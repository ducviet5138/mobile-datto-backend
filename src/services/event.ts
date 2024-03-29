import { Request } from 'express';
import BaseResponse from '@/utils/baseResponse';
import { RET_CODE, RET_MSG } from '@/utils/returnCode';
import { Event, Group } from '@/entities';
import objectIdConverter from '@/utils/objectIdConverter';

class EventService {
    repository = Event;

    async create(req: Request) {
        try {
            const { groupId, name, start, end } = req.body;
            const group = await Group.findById(objectIdConverter(groupId));

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
}

export default new EventService();
