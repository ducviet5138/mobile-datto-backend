import { myDataSource } from '@/app-data-src';
import { Request } from 'express';
import BaseResponse from '@/utils/baseResponse';
import { RET_CODE, RET_MSG } from '@/utils/returnCode';
import { ObjectId } from 'mongodb';
import { MongoRepository } from 'typeorm';

import { Profile } from '@/entities';

class ProfileService {
    repository: MongoRepository<Profile>;

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
            const { fullName, dob, avatar } = req.body;

            const data = await this.repository.findOneBy({ _id: id });

            if (!data) {
                return new BaseResponse(RET_CODE.NOT_FOUND, false, RET_MSG.NOT_FOUND);
            }

            data.fullName = fullName || data.fullName;
            data.dob = new Date(dob || data.dob);
            data.avatar = avatar || data.avatar;

            await this.repository.save(data);

            return new BaseResponse(RET_CODE.SUCCESS, true, RET_MSG.SUCCESS, data);
        } catch (_: any) {
            return new BaseResponse(RET_CODE.ERROR, false, RET_MSG.ERROR);
        }
    }
}

export default new ProfileService();
