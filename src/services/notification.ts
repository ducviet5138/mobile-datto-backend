import { Request } from 'express';
import BaseResponse from '@/utils/baseResponse';
import { RET_CODE, RET_MSG } from '@/utils/returnCode';
import firebaseMessaging from '@/utils/firebaseMessaging';
import * as schedule from 'node-schedule';
import { Group } from '@/entities';
import objectIdConverter from '@/utils/objectIdConverter';
import { Notification } from '@/entities/notification';

class NotificationService {
    async composeNotification(req: Request) {
        try {
            const { message } = req.body;
            const notification = new Notification({
                topic: message.topic,
                title: message.notification.title,
                body: message.notification.body,
                sendAt: message.sendAt === 'now' ? new Date() : new Date(message.sendAt),
            });
            await notification.save();
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
            console.log(_);
            return new BaseResponse(RET_CODE.ERROR, false, RET_MSG.ERROR);
        }
    }

    async getNotifications(req: Request) {
        try {
            // Get notifications from database from user id
            const accountId = objectIdConverter(req.params.id);

            const groups = await Group.find({
                members: {
                    $in: accountId,
                },
            });

            const notifications = await Notification.find({
                $or: [
                    { topic: 'everyone' },
                    {
                        topic: {
                            $in: groups.map((group) => group._id.toString()),
                        },
                    },
                ],
            }).sort({ sendAt: -1 });

            return new BaseResponse(RET_CODE.SUCCESS, true, RET_MSG.SUCCESS, notifications);
        } catch (_: any) {
            return new BaseResponse(RET_CODE.ERROR, false, RET_MSG.ERROR);
        }
    }

    async scheduleSendMessage(message: any) {
        const job = schedule.scheduleJob(message.sendAt, async () => {
            message.sendAt = undefined;
            const response = await firebaseMessaging.send(message);
        });
    }
}

export default new NotificationService();
