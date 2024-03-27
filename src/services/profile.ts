import { myDataSource } from '@/app-data-src';
import { Request } from 'express';
import BaseResponse from '@/utils/baseResponse';
import { RET_CODE, RET_MSG } from '@/utils/returnCode';
import { ObjectId } from 'mongodb';
import { Profile } from '@/entities';

class ProfileService {
    repository: any;

    constructor() {
        this.repository = myDataSource.manager.getMongoRepository(Profile);
    }

    async createWithFullName(req: Request) {
        try {
            const { fullName } = req.body;

            const profile = new Profile();
            profile.fullName = fullName;

            const data = await this.repository.save(profile);

            return data;
        } catch (_: any) {
            return null;
        }
    }

    async patch(req: Request) {
        try {
            const id = new ObjectId(req.params.id);
            const { fullName, dob, avatar, groups } = req.body;

            const data = await this.repository.findOne(id);

            if (!data) {
                return new BaseResponse(RET_CODE.NOT_FOUND, false, RET_MSG.NOT_FOUND);
            }

            data.fullName = fullName || data.fullName;
            data.dob = new Date(dob || data.dob);
            data.avatar = avatar || data.avatar;
            data.groups = groups || data.groups;

            await this.repository.save(data);

            return new BaseResponse(RET_CODE.SUCCESS, true, RET_MSG.SUCCESS, data);
        } catch (_: any) {
            return new BaseResponse(RET_CODE.ERROR, false, RET_MSG.ERROR);
        }
    }
}

export default new ProfileService();
