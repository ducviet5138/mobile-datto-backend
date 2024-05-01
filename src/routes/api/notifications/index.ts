import * as Express from 'express';
import { Request, Response } from 'express';
import BaseResponse from '@/utils/baseResponse';
import { RET_CODE, RET_MSG } from '@/utils/returnCode';
import Notification from '@/services/notification';

const router = Express.Router();

// POST: /api/notifications
// Desc: Send a notification to firebase
router.post('/', async (req: Request, res: Response) => {
    try {
        console.log('Notification:', req.body);
        const response = await Notification.composeNotification(req);
        res.json(response.getResponse());
    } catch (_: any) {
        const response = new BaseResponse(RET_CODE.ERROR, false, RET_MSG.ERROR);
        res.json(response.getResponse());
    }
});

export default router;
