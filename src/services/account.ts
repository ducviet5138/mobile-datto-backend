import { myDataSource } from '@/app-data-src';
import { Request } from 'express';
import BaseResponse from '@/utils/baseResponse';
import { RET_CODE, RET_MSG } from '@/utils/returnCode';
import { ObjectId } from 'mongodb';
import { Account } from '@/entities';
import ProfileService from '@/services/profile';
import hashPassword from '@/utils/hashPassword';
import { MongoRepository } from 'typeorm';

class AccountService {
    repository: MongoRepository<Account>;

    constructor() {
        this.repository = myDataSource.manager.getMongoRepository(Account);
    }

    async create(req: Request) {
        try {
            const { username, email, password } = req.body;

            const duplicateUsername = await this.repository.findOneBy({ username });
            const duplicateEmail = await this.repository.findOneBy({ email });

            if (duplicateUsername || duplicateEmail) {
                return new BaseResponse(RET_CODE.BAD_REQUEST, false, 'Username or email already exists');
            }

            const profileResponse = await ProfileService.createWithFullName(req);

            if (!profileResponse) {
                return new BaseResponse(RET_CODE.ERROR, false, RET_MSG.ERROR);
            }

            const account = new Account();
            account.username = username;
            account.email = email;
            account.password = hashPassword(password);
            account.profile = profileResponse;

            const data = await this.repository.save(account);

            return new BaseResponse(RET_CODE.SUCCESS, true, RET_MSG.SUCCESS, {
                _id: data._id,
            });
        } catch (_: any) {
            return new BaseResponse(RET_CODE.ERROR, false, RET_MSG.ERROR);
        }
    }

    async delete(req: Request) {
        try {
            const id = new ObjectId(req.params.id);
            const data = await this.repository.delete(id);

            if (data.affected === 0) {
                return new BaseResponse(RET_CODE.NOT_FOUND, false, RET_MSG.NOT_FOUND);
            }

            return new BaseResponse(RET_CODE.SUCCESS, true, RET_MSG.SUCCESS);
        } catch (_: any) {
            return new BaseResponse(RET_CODE.ERROR, false, RET_MSG.ERROR);
        }
    }

    async get(req: Request) {
        try {
            const id = new ObjectId(req.params.id);
            const data = await this.repository.findOneBy({
                _id: id,
            });

            if (!data) {
                return new BaseResponse(RET_CODE.NOT_FOUND, false, RET_MSG.NOT_FOUND);
            }

            return new BaseResponse(RET_CODE.SUCCESS, true, RET_MSG.SUCCESS, data);
        } catch (_: any) {
            return new BaseResponse(RET_CODE.ERROR, false, RET_MSG.ERROR);
        }
    }

    async patch(req: Request) {
        try {
            const id = new ObjectId(req.params.id);
            const { username, password } = req.body;

            const data = await this.repository.findOneBy({
                _id: id,
            });

            if (!data) {
                return new BaseResponse(RET_CODE.NOT_FOUND, false, RET_MSG.NOT_FOUND);
            }

            if (username) {
                data.username = username;
            }

            if (password) {
                data.password = password;
            }

            await this.repository.update({ _id: id }, data);

            return new BaseResponse(RET_CODE.SUCCESS, true, RET_MSG.SUCCESS, data);
        } catch (_: any) {
            return new BaseResponse(RET_CODE.ERROR, false, RET_MSG.ERROR);
        }
    }

    async getAccountById(id: ObjectId) {
        try {
            return await this.repository.findOneBy({ _id: id });
        } catch (_: any) {
            return null;
        }
    }
}

export default new AccountService();
