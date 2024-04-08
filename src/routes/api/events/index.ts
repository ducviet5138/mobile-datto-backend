import * as Express from 'express';
import { Request, Response } from 'express';
import BaseResponse from '@/utils/baseResponse';
import { RET_CODE, RET_MSG } from '@/utils/returnCode';
import EventService from '@/services/event';

const router = Express.Router();

// POST: /api/events
// Desc: Create a new event
router.post('/', async (req: Request, res: Response) => {
    try {
        const response = await EventService.create(req);
        res.json(response.getResponse());
    } catch (_: any) {
        const response = new BaseResponse(RET_CODE.ERROR, false, RET_MSG.ERROR);
        res.json(response.getResponse());
    }
});

export default router;