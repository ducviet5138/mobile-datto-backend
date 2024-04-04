import * as Express from 'express';
import { Request, Response } from 'express';
import BaseResponse from '@/utils/baseResponse';
import { RET_CODE, RET_MSG } from '@/utils/returnCode';
import ProfileService from '@/services/profile';

const router = Express.Router();

// Patch: /api/profile/:id
// Desc: Update profile information (fullName, dob, avatar, groups)
router.patch('/:id', async (req: Request, res: Response) => {
    try {
        const response = await ProfileService.patch(req);
        res.json(response.getResponse());
    } catch (_: any) {
        const response = new BaseResponse(RET_CODE.ERROR, false, RET_MSG.ERROR);
        res.json(response.getResponse());
    }
});

export default router;