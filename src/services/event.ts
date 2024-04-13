import { Request } from 'express';
import BaseResponse from '@/utils/baseResponse';
import { RET_CODE, RET_MSG } from '@/utils/returnCode';
import { Account, Event, Group } from '@/entities';
import objectIdConverter from '@/utils/objectIdConverter';

class EventService {
    repository = Event;

    async create(req: Request) {
        try {
            const groupId = objectIdConverter(req.params.id);

            const { name, start, end } = req.body;
            const group = await Group.findById(groupId);

            const event = new Event();
            event.name = name;
            event.time = {
                start: new Date(start),
                end: new Date(end),
            };

            const data = await event.save();

            group.events.push(data._id);
            await group.save();

            return new BaseResponse(RET_CODE.SUCCESS, true, RET_MSG.SUCCESS);
        } catch (_: any) {
            return new BaseResponse(RET_CODE.ERROR, false, RET_MSG.ERROR);
        }
    }

    async getEventInfo(req: Request) {
        try {
            const id = objectIdConverter(req.params.id);

            const data = await this.repository.findById({ _id: id });

            if (!data) {
                return new BaseResponse(RET_CODE.BAD_REQUEST, false, 'Event not found');
            }

            return new BaseResponse(RET_CODE.SUCCESS, true, RET_MSG.SUCCESS, data);
        } catch (_: any) {
            return new BaseResponse(RET_CODE.ERROR, false, RET_MSG.ERROR);
        }
    }

    async getEventMembers(req: Request) {
        try {
            const id = objectIdConverter(req.params.id);

            const data = await this.repository.findById({ _id: id });

            if (!data) {
                return new BaseResponse(RET_CODE.BAD_REQUEST, false, 'Event not found');
            }

            // Find groups that have this event
            const groups = await Group.find({ events: id });

            // Find members of these groups
            const membersId = groups.map((group) => group.members).flat();

            // Get members profile
            const members = [];

            for (const memberId of membersId) {
                const member = await Account.findById(memberId).populate('profile');

                // Remove sensitive information
                member.email = undefined;
                member.username = undefined;
                member.password = undefined;

                members.push(member);
            }

            return new BaseResponse(RET_CODE.SUCCESS, true, RET_MSG.SUCCESS, {
                members,
            });
        } catch (_: any) {
            return new BaseResponse(RET_CODE.ERROR, false, RET_MSG.ERROR);
        }
    }
}

export default new EventService();
