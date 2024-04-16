import { Request } from 'express';
import BaseResponse from '@/utils/baseResponse';
import { RET_CODE, RET_MSG } from '@/utils/returnCode';
import { Timeline, Event } from '@/entities';
import objectIdConverter from '@/utils/objectIdConverter';

class TimelineService {
    repository = Timeline;

    async create(req: Request) {
        try {
            const eventId = objectIdConverter(req.params.eventId);

            // Get event
            const event = await Event.findById(eventId);
            if (!event) return new BaseResponse(RET_CODE.ERROR, false, 'Cannot find event with id ' + eventId);

            const { name, description, start, end } = req.body;

            // Check valid data
            if (!name || !description || !start || !end)
                return new BaseResponse(RET_CODE.BAD_REQUEST, false, RET_MSG.BAD_REQUEST);

            const timeline = new Timeline({
                name,
                description,
                start: new Date(start),
                end: new Date(end),
            });

            // Save timeline
            const data = await timeline.save();

            // Append new data to event
            event.timelines.push(data._id);
            await event.save();

            return new BaseResponse(RET_CODE.SUCCESS, true, 'New timeline object added');
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

            const { name, description, start, end } = req.body;

            // Check valid data
            if (!name || !description || !start || !end)
                return new BaseResponse(RET_CODE.BAD_REQUEST, false, RET_MSG.BAD_REQUEST);

            // Update timeline
            await this.repository.findByIdAndUpdate(id, {
                name,
                description,
                start: new Date(start),
                end: new Date(end),
            });

            return new BaseResponse(RET_CODE.SUCCESS, true, 'Timeline object updated');
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

            // Remove timeline from event
            event.timelines = event.timelines.filter((timeline) => timeline.toString() != id.toString());
            await event.save();

            // Remove timeline
            await this.repository.findByIdAndDelete(req.params.id);

            return new BaseResponse(RET_CODE.SUCCESS, true, 'Timeline object deleted');
        } catch (_: any) {
            return new BaseResponse(RET_CODE.ERROR, false, RET_MSG.ERROR);
        }
    }

    async getTimeline(req: Request) {
        try {
            const eventId = objectIdConverter(req.params.eventId);

            // Get event
            const event = await Event.findById(eventId);
            if (!event) return new BaseResponse(RET_CODE.ERROR, false, 'Cannot find an event');

            // Get timelines
            if (req.params.id !== undefined) {
                const timelineId = objectIdConverter(req.params.id);

                const timeline = await this.repository.findById(timelineId);
                if (!timeline)
                    return new BaseResponse(RET_CODE.ERROR, false, 'Cannot find a timeline with id ' + timelineId);

                return new BaseResponse(RET_CODE.SUCCESS, true, 'Timeline found', timeline);
            } else {
                const timelines = await this.repository.find({ _id: { $in: event.timelines } });

                return new BaseResponse(RET_CODE.SUCCESS, true, 'Timelines found', timelines);
            }
        } catch (_: any) {
            return new BaseResponse(RET_CODE.ERROR, false, RET_MSG.ERROR);
        }
    }
}

export default new TimelineService();
