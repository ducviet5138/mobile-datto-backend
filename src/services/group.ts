import { myDataSource } from '@/app-data-src';
import { Request } from 'express';
import BaseResponse from '@/utils/baseResponse';
import { RET_CODE, RET_MSG } from '@/utils/returnCode';
import { ObjectId } from 'mongodb';
import { Group } from '@/entities';
import BucketService from '@/services/bucket';

class GroupService {
    repository: any;

    constructor() {
        this.repository = myDataSource.manager.getMongoRepository(Group);
    }

    async create(req: Request) {
        try {
            const { name, thumbnail } = req.body;

            if (!name) {
                return new BaseResponse(RET_CODE.BAD_REQUEST, false, 'Name is required');
            }

            const thumbnailObject = await BucketService.getBucketObject(new ObjectId(thumbnail));

            const group = new Group();
            group.name = name;
            group.thumbnail = thumbnailObject;

            const data = await this.repository.save(group);

            return new BaseResponse(RET_CODE.SUCCESS, true, RET_MSG.SUCCESS, data);
        } catch (_: any) {
            return new BaseResponse(RET_CODE.ERROR, false, RET_MSG.ERROR);
        }
    }

    async getGroupInfo(req: Request) {
        try {
            const id = new ObjectId(req.params.id);

            const data = await this.repository.findOne(id);
            console.log(data);

            if (!data) {
                return new BaseResponse(RET_CODE.NOT_FOUND, false, 'Group not found');
            }

            return new BaseResponse(RET_CODE.SUCCESS, true, RET_MSG.SUCCESS, data);
        } catch (_: any) {
            return new BaseResponse(RET_CODE.ERROR, false, RET_MSG.ERROR);
        }
    }
}

export default new GroupService();
