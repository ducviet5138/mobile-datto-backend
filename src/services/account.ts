import { Request } from 'express';
import BaseResponse from '@/utils/baseResponse';
import { RET_CODE, RET_MSG } from '@/utils/returnCode';
import { Account } from '@/entities';
import ProfileService from '@/services/profile';
import hashPassword from '@/utils/hashPassword';
import objectIdConverter from '@/utils/objectIdConverter';
import generateJWTToken from '@/utils/generateJWTToken';

class AccountService {
    repository = Account;

    async create(req: Request) {
        try {
            const { username, email, password } = req.body;

            const duplicateUsername = await this.repository.findOne({ username });
            const duplicateEmail = await this.repository.findOne({ email });

            if (duplicateEmail) {
                return new BaseResponse(RET_CODE.BAD_REQUEST, false, 'Email already exists');
            }

            if (duplicateUsername) {
                return new BaseResponse(RET_CODE.BAD_REQUEST, false, 'Username already exists');
            }

            const profileResponse = await ProfileService.createWithFullName(req);

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

            // Return data token
            const token = generateJWTToken({ _id: data._id.toString() });

            return new BaseResponse(RET_CODE.SUCCESS, true, RET_MSG.SUCCESS, {
                token,
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
            const data = await this.repository.findById(objectIdConverter(id)).populate('profile');

            if (!data) {
                return new BaseResponse(RET_CODE.BAD_REQUEST, false, RET_MSG.BAD_REQUEST);
            }

            // Remove password field
            data.password = undefined;

            // Remove googleId field
            data.googleId = undefined;

            return new BaseResponse(RET_CODE.SUCCESS, true, RET_MSG.SUCCESS, data);
        } catch (_: any) {
            return new BaseResponse(RET_CODE.ERROR, false, RET_MSG.ERROR);
        }
    }

    async patchPassword(req: Request) {
        try {
            const id = req.params.id;
            const { currentPassword, newPassword, confirmPassword } = req.body;

            const data = await this.repository.findById(objectIdConverter(id));

            if (!data) {
                return new BaseResponse(RET_CODE.BAD_REQUEST, false, RET_MSG.BAD_REQUEST);
            }

            // Check if all fields are filled
            if (!currentPassword || !newPassword || !confirmPassword) {
                return new BaseResponse(RET_CODE.BAD_REQUEST, false, 'All fields are required');
            }

            if (data.password !== hashPassword(currentPassword)) {
                return new BaseResponse(RET_CODE.BAD_REQUEST, false, 'Current password is incorrect');
            }

            if (newPassword !== confirmPassword) {
                return new BaseResponse(RET_CODE.BAD_REQUEST, false, 'New password and retype password do not match');
            }

            data.password = hashPassword(newPassword);

            await this.repository.updateOne({ _id: objectIdConverter(id) }, data);

            return new BaseResponse(RET_CODE.SUCCESS, true, 'Password changed successfully');
        } catch (_: any) {
            return new BaseResponse(RET_CODE.ERROR, false, RET_MSG.ERROR);
        }
    }

    async patch(req: Request) {
        try {
            const id = req.params.id;
            const { username, fullName, dob } = req.body;

            const data = await this.repository.findById(objectIdConverter(id));

            if (!data) {
                return new BaseResponse(RET_CODE.BAD_REQUEST, false, RET_MSG.BAD_REQUEST);
            }

            // Check if all fields are filled except avatar
            if (!username || !fullName || !dob) {
                return new BaseResponse(RET_CODE.BAD_REQUEST, false, 'All fields are required');
            }

            // Find if username already exists
            const duplicateUsername = await this.repository.findOne({ username });

            if (duplicateUsername && duplicateUsername._id.toString() !== id) {
                return new BaseResponse(RET_CODE.BAD_REQUEST, false, 'Username already exists');
            }

            // Just update username in AccountService
            await this.repository.updateOne({ _id: objectIdConverter(id) }, { username });

            // Update profile in ProfileService
            // Patch req.params.id to profileID to reuse ProfileService.patch
            req.params.id = data.profile.toString();
            await ProfileService.patch(req);

            return new BaseResponse(RET_CODE.SUCCESS, true, 'Profile updated successfully');
        } catch (_: any) {
            return new BaseResponse(RET_CODE.ERROR, false, RET_MSG.ERROR);
        }
    }

    async getByUsername(req: Request) {
        try {
            const { username, password } = req.body;
            const account = await this.repository.findOne({ username });

            if (!account) {
                return new BaseResponse(RET_CODE.BAD_REQUEST, false, 'This account does not exist.');
            }

            if (account.password !== hashPassword(password)) {
                return new BaseResponse(RET_CODE.UNAUTHORIZED, false, 'Incorrect password');
            }

            // Remove password field
            account.password = undefined;

            // Remove googleId field
            account.googleId = undefined;

            // Return JWT token
            const token = generateJWTToken({ _id: account._id.toString() });

            return new BaseResponse(RET_CODE.SUCCESS, true, RET_MSG.SUCCESS, {
                token,
            });
        } catch (error) {
            return new BaseResponse(RET_CODE.ERROR, false, RET_MSG.ERROR);
        }
    }

    async authByGoogle(req: Request) {
        try {
            const { email, googleId } = req.body;
            let account = await this.repository.findOne({ email });

            if (!account) {
                //Sign up
                //Create a account with email, fullName, googleId, avatar and generate a new password for this account
                //Return id of new account
                const profileResponse = await ProfileService.createWithFullName(req);
                const randomPassword = Math.random().toString(36).slice(-8);
                account = new Account({
                    username: email,
                    email,
                    password: hashPassword(randomPassword),
                    profile: profileResponse,
                    googleId,
                });
                await account.save();
            } else if (!account.googleId) {
                //The account exist but it has not connected with Google Account
                //update googleID for this account
                account.googleId = googleId;
                await account.save();
            }
            // Return JWT token
            const token = generateJWTToken({ _id: account._id.toString() });

            //Sign in
            return new BaseResponse(RET_CODE.SUCCESS, true, RET_MSG.SUCCESS, {
                token,
            });
        } catch (error) {
            return new BaseResponse(RET_CODE.ERROR, false, RET_MSG.ERROR);
        }
    }

    async resetPassword(req: Request) {
        try {
            const { email, password } = req.body;

            const data = await this.repository.findOne({ email });
            if (!data) {
                return new BaseResponse(RET_CODE.BAD_REQUEST, false, RET_MSG.BAD_REQUEST);
            }

            data.password = hashPassword(password);

            await this.repository.updateOne({ email }, data);

            return new BaseResponse(RET_CODE.SUCCESS, true, 'Password changed successfully');
        } catch (_: any) {
            return new BaseResponse(RET_CODE.ERROR, false, RET_MSG.ERROR);
        }
    }
}

export default new AccountService();
