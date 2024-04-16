import { Request } from 'express';
import BaseResponse from '@/utils/baseResponse';
import { RET_CODE, RET_MSG } from '@/utils/returnCode';
import { Fund, Event, Group } from '@/entities';
import objectIdConverter from '@/utils/objectIdConverter';

class FundService {
    repository = Fund;

    async create(req: Request) {
        try {
            const eventId = objectIdConverter(req.params.id);

            // Get event
            const event = await Event.findById(eventId);
            if (!event) return new BaseResponse(RET_CODE.ERROR, false, 'Cannot find an event');

            const { paidBy, amount, info, paidAt } = req.body;

            // Check valid data
            if (paidBy === undefined || paidBy === null || !amount || !info || !paidAt)
                return new BaseResponse(RET_CODE.BAD_REQUEST, false, RET_MSG.BAD_REQUEST);

            const fund = new Fund({
                paidBy: paidBy === '' ? null : objectIdConverter(paidBy),
                amount,
                info,
                paidAt: new Date(paidAt),
            });

            // Save fund
            const data = await fund.save();

            // Append new data to event
            event.funds.push(data._id);
            await event.save();

            return new BaseResponse(RET_CODE.ERROR, true, 'Add new fund successfully');
        } catch (_: any) {
            return new BaseResponse(RET_CODE.ERROR, false, RET_MSG.ERROR);
        }
    }

    async delete(req: Request) {
        try {
            const eventId = objectIdConverter(req.params.eventId);
            const id = objectIdConverter(req.params.id);

            // Get event
            const event = await Event.findById(eventId);
            if (!event) return new BaseResponse(RET_CODE.ERROR, false, 'Cannot find an event');

            // Remove fund from event
            event.funds = event.funds.filter((fund) => fund.toString() != id.toString());
            await event.save();

            // Remove fund
            await this.repository.findByIdAndDelete(req.params.id);

            return new BaseResponse(RET_CODE.ERROR, true, 'Delete new fund successfully');
        } catch (_: any) {
            return new BaseResponse(RET_CODE.ERROR, false, RET_MSG.ERROR);
        }
    }

    async patch(req: Request) {
        try {
            const id = objectIdConverter(req.params.id);
            const { paidBy, amount, info, paidAt } = req.body;

            // Update fund if it exists
            const fund = await this.repository.findById(id);

            if (!fund) return new BaseResponse(RET_CODE.ERROR, false, 'Cannot find a fund');

            if (paidBy) fund.paidBy = objectIdConverter(paidBy);
            if (amount) fund.amount = amount;
            if (info) fund.info = info;
            if (paidAt) fund.paidAt = new Date(paidAt);

            await fund.save();

            return new BaseResponse(RET_CODE.ERROR, true, 'Update new fund successfully');
        } catch (_: any) {
            return new BaseResponse(RET_CODE.ERROR, false, RET_MSG.ERROR);
        }
    }

    async getAllFunds(req: Request) {
        try {
            const eventId = objectIdConverter(req.params.id);

            // Get event with funds
            const event = await Event.findById(eventId);
            if (!event) return new BaseResponse(RET_CODE.ERROR, false, 'Cannot find an event');

            // Get all funds with account and populate 'paidBy' and 'paidBy.profile'
            const funds = await Fund.find({ _id: { $in: event.funds } }).populate({
                path: 'paidBy',
                select: 'profile _id',
                populate: {
                    path: 'profile',
                    select: '_id fullName',
                },
            });

            // Sort by 'paidAt' and then by 'amount'
            funds.sort((a, b) => {
                if (a.paidAt < b.paidAt) {
                    return 1;
                } else if (a.paidAt > b.paidAt) {
                    return -1;
                } else {
                    if (a.amount < 0 && b.amount >= 0) {
                        return -1;
                    } else if (a.amount >= 0 && b.amount < 0) {
                        return 1;
                    } else {
                        return 0;
                    }
                }
            });

            // Create virtual profile for "Budget" user
            const formattedFunds = [];

            for (const fund of funds)
                if (!fund.paidBy) {
                    formattedFunds.push({
                        _id: fund._id,
                        paidBy: {
                            _id: null,
                            profile: {
                                _id: null,
                                fullName: 'Budget',
                            },
                        },
                        amount: fund.amount,
                        info: fund.info,
                        paidAt: fund.paidAt,
                    });
                } else formattedFunds.push(fund);

            return new BaseResponse(RET_CODE.SUCCESS, true, 'Get funds successfully', {
                funds: formattedFunds,
            });
        } catch (_: any) {
            return new BaseResponse(RET_CODE.ERROR, false, RET_MSG.ERROR);
        }
    }

    async get(req: Request) {
        try {
            const id = objectIdConverter(req.params.id);
            const fund = await this.repository.findById(id).populate({
                path: 'paidBy',
                select: 'profile _id',
                populate: {
                    path: 'profile',
                    select: '_id fullName',
                },
            });

            return new BaseResponse(RET_CODE.SUCCESS, true, 'Get fund successfully', fund);
        } catch (_: any) {
            return new BaseResponse(RET_CODE.ERROR, false, RET_MSG.ERROR);
        }
    }

    async getMembers(req: Request) {
        try {
            const id = objectIdConverter(req.params.id);

            // Find a event with funds
            const event = await Event.findOne({ funds: { $in: [id] } });

            if (!event) return new BaseResponse(RET_CODE.ERROR, false, 'Cannot find an event');

            // Find group with event
            const group = await Group.findOne({ events: { $in: [event?._id] } }).populate({
                path: 'members',
                select: 'profile _id',
                populate: {
                    path: 'profile',
                    select: '_id fullName',
                },
            });

            if (!group) return new BaseResponse(RET_CODE.ERROR, false, 'Cannot find a group');

            return new BaseResponse(RET_CODE.SUCCESS, true, 'Get members successfully', {
                members: group.members,
            });
        } catch (_: any) {
            return new BaseResponse(RET_CODE.ERROR, false, RET_MSG.ERROR);
        }
    }

    async split(req: Request) {
        try {
            const eventId = objectIdConverter(req.params.id);

            // Get group containing the event
            const groupId = (await Group.findOne({ events: { $in: [eventId] } }))._id;

            // Get all members of the group
            const members = (
                await Group.findById(groupId).populate({
                    path: 'members',
                    select: 'profile _id',
                    populate: {
                        path: 'profile',
                        select: '_id fullName avatar',
                    },
                })
            ).members as any;

            const funds = (await Event.findById(eventId).populate('funds')).funds as any;

            // Calculate the total expense amount
            let totalExpense = 0;

            for (const fund of funds)
                if (fund.amount < 0) {
                    totalExpense += fund.amount;
                }

            // Average the total expense amount
            const averageExpense = totalExpense / members.length;

            // Create an array to store the amount of money each member has to pay
            const resAmountToPay = new Array(members.length).fill(averageExpense);

            for (let index = 0; index < members.length; index++) {
                for (const fund of funds) {
                    if (fund.amount > 0 && fund.paidBy.toString() == members[index]._id.toString()) {
                        resAmountToPay[index] += fund.amount;
                    }
                }
            }

            // Map member with amount to pay
            const res = members.map((member: any, index: number) => ({
                account: member,
                amount: resAmountToPay[index],
            }));

            // Calculate the remaining funds
            let remainingFunds = 0;
            for (const fund of funds) {
                if (fund.amount > 0) {
                    remainingFunds += fund.amount;
                }
            }
            remainingFunds -= totalExpense;

            return new BaseResponse(RET_CODE.SUCCESS, true, 'Split funds successfully', {
                data: res,
                remainingFunds,
            });
        } catch (_: any) {
            return new BaseResponse(RET_CODE.ERROR, false, RET_MSG.ERROR);
        }
    }
}

export default new FundService();
