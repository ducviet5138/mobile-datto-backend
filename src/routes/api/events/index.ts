import * as Express from 'express';
import { Request, Response } from 'express';
import BaseResponse from '@/utils/baseResponse';
import { RET_CODE, RET_MSG } from '@/utils/returnCode';
import FundService from '@/services/fund';
import EventService from '@/services/event';
import TimelineService from '@/services/timeline';
import CalendarService from '@/services/calendar';
import MemoryService from '@/services/memory';

const router = Express.Router();

// GET /api/events/:id
// Desc: Get event information
router.get('/:id', async (req: Request, res: Response) => {
    try {
        const response = await EventService.getEventInfo(req);
        res.json(response.getResponse());
    } catch (_: any) {
        const response = new BaseResponse(RET_CODE.ERROR, false, RET_MSG.ERROR);
        res.json(response.getResponse());
    }
});

// POST /api/events/:eventId/funds/:id
// Desc: Create a new expense
router.post('/:id/funds', async (req: Request, res: Response) => {
    try {
        const response = await FundService.create(req);
        res.json(response.getResponse());
    } catch (_: any) {
        const response = new BaseResponse(RET_CODE.ERROR, false, RET_MSG.ERROR);
        res.json(response.getResponse());
    }
});

// DELETE /api/events/:eventId/funds/:id
// Desc: Delete a new expense
router.delete('/:eventId/funds/:id', async (req: Request, res: Response) => {
    try {
        const response = await FundService.delete(req);
        res.json(response.getResponse());
    } catch (_: any) {
        const response = new BaseResponse(RET_CODE.ERROR, false, RET_MSG.ERROR);
        res.json(response.getResponse());
    }
});

// PATCH /api/events/:eventId/funds/:id
// Desc: Delete a new expense
router.patch('/:eventId/funds/:id', async (req: Request, res: Response) => {
    try {
        const response = await FundService.patch(req);
        res.json(response.getResponse());
    } catch (_: any) {
        const response = new BaseResponse(RET_CODE.ERROR, false, RET_MSG.ERROR);
        res.json(response.getResponse());
    }
});

// GET /api/events/:id/funds
// Desc: Get all expenses
router.get('/:id/funds', async (req: Request, res: Response) => {
    try {
        const response = await FundService.getAllFunds(req);
        res.json(response.getResponse());
    } catch (_: any) {
        const response = new BaseResponse(RET_CODE.ERROR, false, RET_MSG.ERROR);
        res.json(response.getResponse());
    }
});

// GET /api/events/:id/members
// Desc: Get event members
router.get('/:id/members', async (req: Request, res: Response) => {
    try {
        const response = await EventService.getEventMembers(req);
        res.json(response.getResponse());
    } catch (_: any) {
        const response = new BaseResponse(RET_CODE.ERROR, false, RET_MSG.ERROR);
        res.json(response.getResponse());
    }
});

// GET /api/events/:id/split-funds
// Desc: Get data after splitting funds
router.get('/:id/split-funds', async (req: Request, res: Response) => {
    try {
        const response = await FundService.split(req);
        res.json(response.getResponse());
    } catch (_: any) {
        const response = new BaseResponse(RET_CODE.ERROR, false, RET_MSG.ERROR);
        res.json(response.getResponse());
    }
});

// GET /api/events/:eventId/timeline/:id
// Desc: Get a timeline object
router.get('/:eventId/timeline/:id', async (req: Request, res: Response) => {
    try {
        const response = await TimelineService.getTimeline(req);
        res.json(response.getResponse());
    } catch (_: any) {
        const response = new BaseResponse(RET_CODE.ERROR, false, RET_MSG.ERROR);
        res.json(response.getResponse());
    }
});

// GET /api/events/:eventId/timeline
// Desc: Get all timeline objects
router.get('/:eventId/timeline', async (req: Request, res: Response) => {
    try {
        const response = await TimelineService.getTimeline(req);
        res.json(response.getResponse());
    } catch (_: any) {
        const response = new BaseResponse(RET_CODE.ERROR, false, RET_MSG.ERROR);
        res.json(response.getResponse());
    }
});

// POST /api/events/:eventId/timeline
// Desc: Create a new timeline object
router.post('/:eventId/timeline', async (req: Request, res: Response) => {
    try {
        const response = await TimelineService.create(req);
        res.json(response.getResponse());
    } catch (_: any) {
        const response = new BaseResponse(RET_CODE.ERROR, false, RET_MSG.ERROR);
        res.json(response.getResponse());
    }
});

// PATCH /api/events/:eventId/timeline/:id
// Desc: Update a timeline object
router.patch('/:eventId/timeline/:id', async (req: Request, res: Response) => {
    try {
        const response = await TimelineService.patch(req);
        res.json(response.getResponse());
    } catch (_: any) {
        const response = new BaseResponse(RET_CODE.ERROR, false, RET_MSG.ERROR);
        res.json(response.getResponse());
    }
});

// DELETE /api/events/:eventId/timeline/:id
// Desc: Delete a timeline object
router.delete('/:eventId/timeline/:id', async (req: Request, res: Response) => {
    try {
        const response = await TimelineService.delete(req);
        res.json(response.getResponse());
    } catch (_: any) {
        const response = new BaseResponse(RET_CODE.ERROR, false, RET_MSG.ERROR);
        res.json(response.getResponse());
    }
});

// GET /api/events/:eventId/calendars
// Desc: Get all calendar objects
router.get('/:eventId/calendars', async (req: Request, res: Response) => {
    try {
        const response = await CalendarService.get(req);
        res.json(response.getResponse());
    } catch (_: any) {
        const response = new BaseResponse(RET_CODE.ERROR, false, RET_MSG.ERROR);
        res.json(response.getResponse());
    }
});

// POST /api/events/:eventId/calendars
// Desc: Create a new calendar object
router.post('/:eventId/calendars', async (req: Request, res: Response) => {
    try {
        const response = await CalendarService.post(req);
        res.json(response.getResponse());
    } catch (_: any) {
        const response = new BaseResponse(RET_CODE.ERROR, false, RET_MSG.ERROR);
        res.json(response.getResponse());
    }
});

// PATCH /api/events/:id
// Desc: Update event information
router.patch('/:id', async (req: Request, res: Response) => {
    try {
        const response = await EventService.patchEventInfo(req);
        res.json(response.getResponse());
    } catch (_: any) {
        const response = new BaseResponse(RET_CODE.ERROR, false, RET_MSG.ERROR);
        res.json(response.getResponse());
    }
});

// POST /api/events/:id/memories
// Desc: Create a new memory
router.post('/:id/memories', async (req: Request, res: Response) => {
    try {
        const response = await MemoryService.create(req);
        res.json(response.getResponse());
    } catch (_: any) {
        const response = new BaseResponse(RET_CODE.ERROR, false, RET_MSG.ERROR);
        res.json(response.getResponse());
    }
});

export default router;