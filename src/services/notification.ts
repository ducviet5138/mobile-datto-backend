import { Request } from 'express';
import BaseResponse from '@/utils/baseResponse';
import { RET_CODE, RET_MSG } from '@/utils/returnCode';
import firebaseMessaging from '@/utils/firebaseMessaging';
import * as schedule from 'node-schedule';

class NotificationService {
    async composeNotification(req: Request) {
        try {
            const { message } = req.body;
            if (message.sendAt === 'now') {
                message.sendAt = undefined;
                const response = await firebaseMessaging.send(message);
                return new BaseResponse(RET_CODE.SUCCESS, true, response);
            } else {
                message.sendAt = new Date(message.sendAt);
                await this.scheduleSendMessage(message);
                return new BaseResponse(RET_CODE.SUCCESS, true, 'Message scheduled');
            }
        } catch (_: any) {
            return new BaseResponse(RET_CODE.ERROR, false, RET_MSG.ERROR);
        }
    }

    async scheduleSendMessage(message: any) {
        try {
            const job = schedule.scheduleJob(message.sendAt, async () => {
                try {
                    message.sendAt = undefined;
                    const response = await firebaseMessaging.send(message);
                } catch (error) {
                    throw error;
                }
            });
        } catch (error) {
            throw error;
        }
    }
}

export default new NotificationService();
