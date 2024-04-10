import * as Express from 'express';
import { Request, Response } from 'express';
import BaseResponse from '@/utils/baseResponse';
import { RET_CODE, RET_MSG } from '@/utils/returnCode';
import FundService from '@/services/fund';

const router = Express.Router();

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

export default router;