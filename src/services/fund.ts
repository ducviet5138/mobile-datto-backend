import { Request } from 'express';
import BaseResponse from '@/utils/baseResponse';
import { RET_CODE, RET_MSG } from '@/utils/returnCode';
import { Fund, Event } from '@/entities';
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
            if (!paidBy || !amount || !info || !paidAt)
                return new BaseResponse(RET_CODE.BAD_REQUEST, false, RET_MSG.BAD_REQUEST);

            const fund = new Fund({
                paidBy: objectIdConverter(paidBy),
                amount,
                info,
                paidAt: new Date(paidAt),
            });

            // Save fund
            const data = await fund.save();

            // Append new data to event
            event.funds.push(data._id);
            await event.save();

            return new BaseResponse(RET_CODE.ERROR, false, 'Add new fund successfully');
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

            return new BaseResponse(RET_CODE.ERROR, false, 'Delete new fund successfully');
        } catch (_: any) {
            return new BaseResponse(RET_CODE.ERROR, false, RET_MSG.ERROR);
        }
    }

    async patch(req: Request) {
        try {
            const eventId = objectIdConverter(req.params.eventId);
            const id = objectIdConverter(req.params.id);

            // Get event
            const event = await Event.findById(eventId);
            if (!event) return new BaseResponse(RET_CODE.ERROR, false, 'Cannot find an event');

            const { paidBy, amount, info, paidAt } = req.body;

            // Update fund if it exists
            const fund = await this.repository.findById(id);

            if (!fund) return new BaseResponse(RET_CODE.ERROR, false, 'Cannot find a fund');

            if (paidBy) fund.paidBy = objectIdConverter(paidBy);
            if (amount) fund.amount = amount;
            if (info) fund.info = info;
            if (paidAt) fund.paidAt = new Date(paidAt);

            await fund.save();

            return new BaseResponse(RET_CODE.ERROR, false, 'Update new fund successfully');
        } catch (_: any) {
            return new BaseResponse(RET_CODE.ERROR, false, RET_MSG.ERROR);
        }
    }
}

export default new FundService();
