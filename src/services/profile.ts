import { Request } from 'express';
import BaseResponse from '@/utils/baseResponse';
import { RET_CODE, RET_MSG } from '@/utils/returnCode';
import { Profile, Bucket } from '@/entities';
import objectIdConverter from '@/utils/objectIdConverter';
import axios from 'axios';
import * as fs from 'fs';

const uploadFromUrl = async (url: string, fileName: string): Promise<string> => {
    const response = await axios.get(url, { responseType: 'stream' });
    const filePath = `./my_bucket/${fileName}`;
    const writer = fs.createWriteStream(filePath);
    response.data.pipe(writer);

    await new Promise((resolve, reject) => {
        writer.on('finish', resolve);
        writer.on('error', reject);
    });

    const bucket = new Bucket({
        fileName: fileName,
    });

    const entity = await bucket.save();
    const newFilePath = `./my_bucket/${entity._id.toHexString()}`;
    fs.renameSync(filePath, newFilePath);

    return entity._id.toHexString();
};

class ProfileService {
    repository = Profile;

    async createWithFullName(req: Request) {
        try {
            const { fullName, avatar, googleId } = req.body;
            console.log(fullName);
            const profile = new Profile();
            profile.fullName = fullName ? fullName : '';
            profile.dob = new Date('1970-01-01');
            console.log(avatar);
            if (avatar && googleId) {
                const avatarFilename = await uploadFromUrl(avatar, googleId);
                profile.avatar = objectIdConverter(avatarFilename);
            } else {
                profile.avatar = null;
            }

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
