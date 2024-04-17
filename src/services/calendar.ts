import { Request } from 'express';
import BaseResponse from '@/utils/baseResponse';
import { RET_CODE, RET_MSG } from '@/utils/returnCode';
import { Calendar, Event } from '@/entities';
import objectIdConverter from '@/utils/objectIdConverter';

class CalendarService {
    repository = Calendar;

    async post(req: Request) {
        try {
            const eventId = objectIdConverter(req.params.eventId);

            // Get event
            const event = await Event.findById(eventId);
            if (!event) return new BaseResponse(RET_CODE.ERROR, false, 'Cannot find event with id ' + eventId);

            const { createdBy, time } = req.body;

            // Check valid data
            if (!createdBy || !time)
                return new BaseResponse(RET_CODE.BAD_REQUEST, false, RET_MSG.BAD_REQUEST);

            // search for existing calendar
            const existingCalendar = await this.repository.findOne({ createdBy: objectIdConverter(createdBy) });

            if (existingCalendar) {
                // Update calendar
                existingCalendar.time = time.map((t: string) => new Date(t));
                await existingCalendar.save();
                return new BaseResponse(RET_CODE.SUCCESS, true, 'Calendar updated');
            } else {
                // Create new calendar
                const calendar = new Calendar({
                    createdBy: objectIdConverter(createdBy),
                    time: time.map((t: string) => new Date(t)),
                });

                // Save calendar
                const data = await calendar.save();

                // Append new data to event
                event.calendars.push(data._id);
                await event.save();

                return new BaseResponse(RET_CODE.SUCCESS, true, 'New calendar object added');
            }
        } catch (_: any) {
            return new BaseResponse(RET_CODE.ERROR, false, RET_MSG.ERROR);
        }
    }

    async get(req: Request) {
        try {
            const eventId = objectIdConverter(req.params.eventId);

            // Get event
            const event = await Event.findById(eventId);
            if (!event) return new BaseResponse(RET_CODE.ERROR, false, 'Cannot find event with id ' + eventId);

            if(req.params.id) {
                const calendar = await this.repository.findById(objectIdConverter(req.params.id));
                if (!calendar) return new BaseResponse(RET_CODE.ERROR, false, 'Cannot find calendar with id ' + req.params.id);
                return new BaseResponse(RET_CODE.SUCCESS, true, 'Calendar found', calendar);
            } else {
                const calendars = await this.repository.find({ _id: { $in: event.calendars } });
                return new BaseResponse(RET_CODE.SUCCESS, true, 'Calendars found', calendars);
            }
        } catch (_: any) {
            return new BaseResponse(RET_CODE.ERROR, false, RET_MSG.ERROR);
        }
    }
}

export default new CalendarService();