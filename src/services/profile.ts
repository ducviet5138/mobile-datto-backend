import { Request } from 'express';
import BaseResponse from '@/utils/baseResponse';
import { RET_CODE, RET_MSG } from '@/utils/returnCode';
import { Profile } from '@/entities';
import objectIdConverter from '@/utils/objectIdConverter';

class ProfileService {
    repository = Profile;

    async createWithFullName(req: Request) {
        try {
            const { fullName } = req.body;

            const profile = new Profile();
            profile.fullName = fullName ? fullName : '';
            profile.dob = new Date('1970-01-01');
            profile.avatar = null;

            const data = await profile.save();

            return data;
        } catch (_: any) {
            return null;
        }
    }

    async patch(req: Request) {
        try {
            const id = req.params.id;
            const { fullName, dob, avatar } = req.body;

            const data = await this.repository.findById(objectIdConverter(id));

            if (!data) {
                return new BaseResponse(RET_CODE.BAD_REQUEST, false, RET_MSG.BAD_REQUEST);
            }

            data.fullName = fullName || data.fullName;
            data.dob = new Date(dob) || data.dob;
            if (avatar) data.avatar = objectIdConverter(avatar);

            await this.repository.updateOne({ _id: objectIdConverter(id) }, data);

            return new BaseResponse(RET_CODE.SUCCESS, true, RET_MSG.SUCCESS, data);
        } catch (_: any) {
            return new BaseResponse(RET_CODE.ERROR, false, RET_MSG.ERROR);
        }
    }
}

export default new ProfileService();
