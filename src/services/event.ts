import { myDataSource } from '@/app-data-src';
import { Request } from 'express';
import BaseResponse from '@/utils/baseResponse';
import { RET_CODE, RET_MSG } from '@/utils/returnCode';
import { Repository } from 'typeorm';
import { Event, Group } from '@/entities';
import GroupService from '@/services/group';

class EventService{
    repository: Repository<Event>

    constructor() {
        this.repository = myDataSource.manager.getRepository(Event);
    }

    async create(req: Request){
        try {
            const { groupId, name, start, end } = req.body;
            const group = await GroupService.getGroupById(Number(groupId));

            const event = new Event();
            event.name = name;
            event.start = new Date(start);
            event.end = new Date(end);

            // Add event to the group
            if (!group.events)
                group.events = [event]
            else
                group.events.push(event);

            const response = await this.repository.save(event);
            await myDataSource.manager.getRepository(Group).update({ id: group.id }, group);
            return new BaseResponse(RET_CODE.SUCCESS, true, RET_MSG.SUCCESS, response);
        } catch (_: any) {
            return new BaseResponse(RET_CODE.ERROR, false, RET_MSG.ERROR);
        }
    }
}

export default new EventService();
