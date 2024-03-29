import { Request } from 'express';
import BaseResponse from '@/utils/baseResponse';
import { RET_CODE, RET_MSG } from '@/utils/returnCode';
import { Group, Account, Bucket } from '@/entities';
import AccountService from '@/services/account';
import generateInviteCode from '@/utils/generateInviteCode';
import objectIdConverter from '@/utils/objectIdConverter';

class GroupService {
    repository = Group;

    async create(req: Request) {
        try {
            const { accountId, name, thumbnail } = req.body;
            const account = await Account.findById(objectIdConverter(accountId));

            if (!name || !account) {
                return new BaseResponse(RET_CODE.BAD_REQUEST, false, 'Name is required');
            }

            const group = new Group();
            group.name = name;
            group.inviteCode = generateInviteCode();
            if (thumbnail) group.thumbnail = objectIdConverter(thumbnail);
            group.members = [account._id];

            const data = await group.save();

            return new BaseResponse(RET_CODE.SUCCESS, true, RET_MSG.SUCCESS, data);
        } catch (_: any) {
            return new BaseResponse(RET_CODE.ERROR, false, RET_MSG.ERROR);
        }
    }

    async getGroupInfo(req: Request) {
        try {
            const id = objectIdConverter(req.params.id);

            const data = await this.repository.findById({ _id: id });

            if (!data) {
                return new BaseResponse(RET_CODE.BAD_REQUEST, false, 'Group not found');
            }

            return new BaseResponse(RET_CODE.SUCCESS, true, RET_MSG.SUCCESS, data);
        } catch (_: any) {
            return new BaseResponse(RET_CODE.ERROR, false, RET_MSG.ERROR);
        }
    }

    async getGroupMembers(req: Request) {
        try {
            const id = objectIdConverter(req.params.id);

            const data = await this.repository.findById({ _id: id });

            if (!data) {
                return new BaseResponse(RET_CODE.BAD_REQUEST, false, 'Group not found');
            }

            return new BaseResponse(RET_CODE.SUCCESS, true, RET_MSG.SUCCESS, data.members);
        } catch (_: any) {
            return new BaseResponse(RET_CODE.ERROR, false, RET_MSG.ERROR);
        }
    }

    async patch(req: Request) {
        try {
            const id = objectIdConverter(req.params.id);
            const { name, thumbnail, members } = req.body;

            const group = await this.repository.findById({ _id: id });

            if (!group) {
                return new BaseResponse(RET_CODE.BAD_REQUEST, false, 'Group not found');
            }

            group.name = name || group.name;
            group.thumbnail = thumbnail || group.thumbnail;
            if (members) group.members = group.members;

            const data = await this.repository.updateOne({ _id: id }, group);

            return new BaseResponse(RET_CODE.SUCCESS, true, RET_MSG.SUCCESS, data);
        } catch (_: any) {
            return new BaseResponse(RET_CODE.ERROR, false, RET_MSG.ERROR);
        }
    }

    async generateInviteCode(req: Request) {
        try {
            const id = objectIdConverter(req.params.id);

            const group = await this.repository.findById(id);

            if (!group) {
                return new BaseResponse(RET_CODE.BAD_REQUEST, false, 'Group not found');
            }

            group.inviteCode = generateInviteCode();
            await this.repository.updateOne({ _id: id }, group);

            return new BaseResponse(RET_CODE.SUCCESS, true, RET_MSG.SUCCESS, group.inviteCode);
        } catch (_: any) {
            return new BaseResponse(RET_CODE.ERROR, false, RET_MSG.ERROR);
        }
    }

    async joinGroup(req: Request) {
        try {
            const { inviteCode, accountId } = req.body;

            const data = await this.repository.findOne({ inviteCode });

            if (!data) {
                return new BaseResponse(RET_CODE.BAD_REQUEST, false, 'Group not found');
            }

            data.members.push(objectIdConverter(accountId));

            await this.repository.updateOne({ inviteCode }, data);

            return new BaseResponse(RET_CODE.SUCCESS, true, RET_MSG.SUCCESS, data);
        } catch (_: any) {
            return new BaseResponse(RET_CODE.ERROR, false, RET_MSG.ERROR);
        }
    }

    async getAccountsGroups(req: Request) {
        try {
            const accountId = objectIdConverter(req.params.id);
            console.log(accountId)

            const data = await this.repository.find({
                members: {
                    $in: accountId,
                },
            });

            return new BaseResponse(RET_CODE.SUCCESS, true, RET_MSG.SUCCESS, data);
        } catch (_: any) {
            console.log(_);
            return new BaseResponse(RET_CODE.ERROR, false, RET_MSG.ERROR);
        }
    }
}

export default new GroupService();
