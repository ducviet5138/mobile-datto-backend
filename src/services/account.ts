import { Request } from 'express';
import BaseResponse from '@/utils/baseResponse';
import { RET_CODE, RET_MSG } from '@/utils/returnCode';
import { Account } from '@/entities';
import ProfileService from '@/services/profile';
import hashPassword from '@/utils/hashPassword';
import objectIdConverter from '@/utils/objectIdConverter';
import { Schema } from 'mongoose';

class AccountService {
    repository = Account;

    async create(req: Request) {
        try {
            const { username, email, password } = req.body;

            const duplicateUsername = await this.repository.findOne({ username });
            const duplicateEmail = await this.repository.findOne({ email });

            if (duplicateUsername || duplicateEmail) {
                return new BaseResponse(RET_CODE.BAD_REQUEST, false, 'Username or email already exists');
            }

            const profileResponse = await ProfileService.createWithFullName(req);
            console.log(profileResponse)

            if (!profileResponse) {
                return new BaseResponse(RET_CODE.ERROR, false, RET_MSG.ERROR);
            }

            const account = new Account({
                username,
                email,
                password: hashPassword(password),
                profile: profileResponse,
            });

            const data = await account.save();

            return new BaseResponse(RET_CODE.SUCCESS, true, RET_MSG.SUCCESS, {
                _id: data._id,
            });
        } catch (_: any) {
            return new BaseResponse(RET_CODE.ERROR, false, RET_MSG.ERROR);
        }
    }

    async delete(req: Request) {
        try {
            const id = req.params.id;
            const data = await this.repository.deleteOne({ _id: objectIdConverter(id) });

            if (!data) {
                return new BaseResponse(RET_CODE.BAD_REQUEST, false, RET_MSG.BAD_REQUEST);
            }

            return new BaseResponse(RET_CODE.SUCCESS, true, RET_MSG.SUCCESS);
        } catch (_: any) {
            return new BaseResponse(RET_CODE.ERROR, false, RET_MSG.ERROR);
        }
    }

    async get(req: Request) {
        try {
            const id = req.params.id;
            const data = await this.repository.findById(objectIdConverter(id)).populate("profile");

            if (!data) {
                return new BaseResponse(RET_CODE.BAD_REQUEST, false, RET_MSG.BAD_REQUEST);
            }

            // Remove password field
            data.password = undefined;

            return new BaseResponse(RET_CODE.SUCCESS, true, RET_MSG.SUCCESS, data);
        } catch (_: any) {
            console.log(_);
            return new BaseResponse(RET_CODE.ERROR, false, RET_MSG.ERROR);
        }
    }

    async patch(req: Request) {
        try {
            const id = req.params.id;
            const { username, password } = req.body;

            const data = await this.repository.findById(objectIdConverter(id));
    

            if (!data) {
                return new BaseResponse(RET_CODE.BAD_REQUEST, false, RET_MSG.BAD_REQUEST);
            }

            if (username) {
                data.username = username;
            }

            if (password) {
                data.password = password;
            }

            await this.repository.updateOne({ _id: objectIdConverter(id) }, data);

            return new BaseResponse(RET_CODE.SUCCESS, true, RET_MSG.SUCCESS, data);
        } catch (_: any) {
            return new BaseResponse(RET_CODE.ERROR, false, RET_MSG.ERROR);
        }
    }
}

export default new AccountService();
