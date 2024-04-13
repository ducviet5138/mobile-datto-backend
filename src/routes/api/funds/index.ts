import * as Express from 'express';
import { Request, Response } from 'express';
import BaseResponse from '@/utils/baseResponse';
import { RET_CODE, RET_MSG } from '@/utils/returnCode';
import FundService from '@/services/fund';

const router = Express.Router();

// PATCH /api/funds/:id
// Desc: Update profile information (fullName, dob, avatar, groups)
router.patch('/:id', async (req: Request, res: Response) => {
    try {
        const response = await FundService.patch(req);
        res.json(response.getResponse());
    } catch (_: any) {
        const response = new BaseResponse(RET_CODE.ERROR, false, RET_MSG.ERROR);
        res.json(response.getResponse());
    }
});

// GET /api/funds/:id
// Desc: Get data of a fund
router.get('/:id', async (req: Request, res: Response) => {
    try {
        const response = await FundService.get(req);
        res.json(response.getResponse());
    } catch (_: any) {
        const response = new BaseResponse(RET_CODE.ERROR, false, RET_MSG.ERROR);
        res.json(response.getResponse());
    }
});

// GET /api/funds/:id/members
// Desc: Get members associated with a fund
router.get('/:id/members', async (req: Request, res: Response) => {
    try {
        const response = await FundService.getMembers(req);
        res.json(response.getResponse());
    } catch (_: any) {
        const response = new BaseResponse(RET_CODE.ERROR, false, RET_MSG.ERROR);
        res.json(response.getResponse());
    }
});

export default router;