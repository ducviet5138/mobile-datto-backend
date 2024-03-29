import * as Express from 'express';
import { Request, Response } from 'express';
import BaseResponse from '@/utils/baseResponse';
import { RET_CODE, RET_MSG } from '@/utils/returnCode';
import OTP from '@/services/otp';

const router = Express.Router();

// POST: /api/otp
// Feat: Send OTP
router.post('/', async (req: Request, res: Response) => {
    try {
        const response = await OTP.sendOTP(req);
        res.status(response.getRetCode()).json(response.getResponse());
    } catch (_: any) {
        const response = new BaseResponse(RET_CODE.ERROR, false, RET_MSG.ERROR);
        res.status(response.getRetCode()).json(response.getResponse());
    }
});

// POST: /api/otp/verification
// Feat: Verify OTP
router.post('/verification', async (req: Request, res: Response) => {
    try {
        const response = await OTP.verifyOTP(req);
        res.status(response.getRetCode()).json(response.getResponse());
    } catch (_: any) {
        const response = new BaseResponse(RET_CODE.ERROR, false, RET_MSG.ERROR);
        res.status(response.getRetCode()).json(response.getResponse());
    }
});

export default router;