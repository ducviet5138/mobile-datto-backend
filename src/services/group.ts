import { myDataSource } from '@/app-data-src';
import { Request } from 'express';
import BaseResponse from '@/utils/baseResponse';
import { RET_CODE, RET_MSG } from '@/utils/returnCode';
import { ObjectId } from 'mongodb';
import { Group } from '@/entities';
import BucketService from '@/services/bucket';
import { MongoRepository } from 'typeorm';
import AccountService from '@/services/account';
import generateInviteCode from '@/utils/generateInviteCode';

class GroupService {
    repository: MongoRepository<Group>;

    constructor() {
        this.repository = myDataSource.manager.getMongoRepository(Group);
    }

    async create(req: Request) {
        try {
            const { accountId, name, thumbnail } = req.body;
            const account = await AccountService.getAccountById(new ObjectId(accountId));

            if (!name || !account) {
                return new BaseResponse(RET_CODE.BAD_REQUEST, false, 'Name is required');
            }

            // Add data to the group
            const thumbnailObject = await BucketService.getBucketObject(new ObjectId(thumbnail));

            const group = new Group();
            group.name = name;
            group.inviteCode = generateInviteCode();
            if (thumbnailObject) group.thumbnail = thumbnailObject;
            group.members = [account];

            const data = await this.repository.save(group);

            return new BaseResponse(RET_CODE.SUCCESS, true, RET_MSG.SUCCESS, data);
        } catch (_: any) {
            return new BaseResponse(RET_CODE.ERROR, false, RET_MSG.ERROR);
        }
    }

    async getGroupInfo(req: Request) {
        try {
            const id = new ObjectId(req.params.id);

            const data = await this.repository.findOneBy({ _id: id });

            if (!data) {
                return new BaseResponse(RET_CODE.NOT_FOUND, false, 'Group not found');
            }

            return new BaseResponse(RET_CODE.SUCCESS, true, RET_MSG.SUCCESS, data);
        } catch (_: any) {
            return new BaseResponse(RET_CODE.ERROR, false, RET_MSG.ERROR);
        }
    }

    async getGroupMembers(req: Request) {
        try {
            const id = new ObjectId(req.params.id);

            const data = await this.repository.findOneBy({ _id: id });

            if (!data) {
                return new BaseResponse(RET_CODE.NOT_FOUND, false, 'Group not found');
            }

            return new BaseResponse(RET_CODE.SUCCESS, true, RET_MSG.SUCCESS, data.members);
        } catch (_: any) {
            return new BaseResponse(RET_CODE.ERROR, false, RET_MSG.ERROR);
        }
    }

    async patch(req: Request) {
        try {
            const id = new ObjectId(req.params.id);
            const { name, thumbnail, newMemberId } = req.body;

            const group = await this.repository.findOneBy({ _id: id });

            if (!group) {
                return new BaseResponse(RET_CODE.NOT_FOUND, false, 'Group not found');
            }

            const newMember = await AccountService.getAccountById(new ObjectId(newMemberId));

            group.name = name || group.name;
            group.thumbnail = thumbnail || group.thumbnail;
            group.members.push(newMember);

            const data = await this.repository.update({ _id: id }, group);

            return new BaseResponse(RET_CODE.SUCCESS, true, RET_MSG.SUCCESS, data);
        } catch (_: any) {
            return new BaseResponse(RET_CODE.ERROR, false, RET_MSG.ERROR);
        }
    }

    async generateInviteCode(req: Request) {
        try {
            const id = new ObjectId(req.params.id);

            const group = await this.repository.findOneBy({ _id: id });

            if (!group) {
                return new BaseResponse(RET_CODE.NOT_FOUND, false, 'Group not found');
            }

            group.inviteCode = generateInviteCode();
            await this.repository.update({ _id: id }, group);

            return new BaseResponse(RET_CODE.SUCCESS, true, RET_MSG.SUCCESS, group.inviteCode);
        } catch (_: any) {
            return new BaseResponse(RET_CODE.ERROR, false, RET_MSG.ERROR);
        }
    }

    async joinGroup(req: Request) {
        try {
            const { inviteCode, accountId } = req.body;

            const data = await this.repository.findOneBy({ inviteCode });

            if (!data) {
                return new BaseResponse(RET_CODE.NOT_FOUND, false, 'Group not found');
            }

            const account = await AccountService.getAccountById(new ObjectId(accountId));
            data.members.push(account);

            await this.repository.update({ inviteCode }, data);

            return new BaseResponse(RET_CODE.SUCCESS, true, RET_MSG.SUCCESS, data);
        } catch (_: any) {
            return new BaseResponse(RET_CODE.ERROR, false, RET_MSG.ERROR);
        }
    }

    async getAccountsGroups(req: Request) {
        try {
            const accountId = new ObjectId(req.params.id);

            const data = await this.repository.find({
                members: {
                    $elemMatch: { _id: accountId },
                },
            });

            return new BaseResponse(RET_CODE.SUCCESS, true, RET_MSG.SUCCESS, data);
        } catch (_: any) {
            return new BaseResponse(RET_CODE.ERROR, false, RET_MSG.ERROR);
        }
    }
}

export default new GroupService();
