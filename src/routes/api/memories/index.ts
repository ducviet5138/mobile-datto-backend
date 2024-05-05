import * as Express from 'express';
import { Request, Response } from 'express';
import BaseResponse from '@/utils/baseResponse';
import { RET_CODE, RET_MSG } from '@/utils/returnCode';
import MemoryService from '@/services/memory';

const router = Express.Router();

// GET /api/memories/:id
// Desc: Get memory information
router.get('/:id', async (req: Request, res: Response) => {
    try {
        const response = await MemoryService.get(req);
        res.json(response.getResponse());
    } catch (_: any) {
        const response = new BaseResponse(RET_CODE.ERROR, false, RET_MSG.ERROR);
        res.json(response.getResponse());
    }
});

export default router;
