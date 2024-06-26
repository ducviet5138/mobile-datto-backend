import * as Express from 'express';
import { Request, Response } from 'express';
import BaseResponse from '@/utils/baseResponse';
import { RET_CODE, RET_MSG } from '@/utils/returnCode';
import AccountService from '@/services/account';
import GroupService from '@/services/group';

const router = Express.Router();

// POST: /api/accounts
// Desc: Create account
router.post('/', async (req: Request, res: Response) => {
    try {
        const response = await AccountService.create(req);
        res.json(response.getResponse());
    } catch (_: any) {
        const response = new BaseResponse(RET_CODE.ERROR, false, RET_MSG.ERROR);
        res.json(response.getResponse());
    }
});

// DELETE: /api/accounts/:id
// Desc: Delete account
router.delete('/:id', async (req: Request, res: Response) => {
    try {
        const response = await AccountService.delete(req);
        res.json(response.getResponse());
    } catch (_: any) {
        const response = new BaseResponse(RET_CODE.ERROR, false, RET_MSG.ERROR);
        res.json(response.getResponse());
    }
});

// GET: /api/accounts/:id
// Desc: Get account and profile by id
router.get('/:id', async (req: Request, res: Response) => {
    try {
        const response = await AccountService.get(req);
        res.json(response.getResponse());
    } catch (_: any) {
        const response = new BaseResponse(RET_CODE.ERROR, false, RET_MSG.ERROR);
        res.json(response.getResponse());
    }
});

// PATCH: /api/accounts/:id/password
// Desc: Change password
router.patch('/:id/password', async (req: Request, res: Response) => {
    try {
        const response = await AccountService.patchPassword(req);
        res.json(response.getResponse());
    } catch (_: any) {
        const response = new BaseResponse(RET_CODE.ERROR, false, RET_MSG.ERROR);
        res.json(response.getResponse());
    }
});

// PATCH: /api/accounts/:id
// Desc: Update account and profile including avartar, username, fullname, dob
router.patch('/:id', async (req: Request, res: Response) => {
    try {
        const response = await AccountService.patch(req);
        res.json(response.getResponse());
    } catch (_: any) {
        const response = new BaseResponse(RET_CODE.ERROR, false, RET_MSG.ERROR);
        res.json(response.getResponse());
    }
});

// GET: /api/accounts/:id/groups
// Desc: Get groups that account is in
router.get('/:id/groups', async (req: Request, res: Response) => {
    try {
        const response = await GroupService.getAccountsGroups(req);
        res.json(response.getResponse());
    } catch (_: any) {
        const response = new BaseResponse(RET_CODE.ERROR, false, RET_MSG.ERROR);
        res.json(response.getResponse());
    }
});

// POST: /api/accounts/sign-in
// Desc: Get id account by sign in
router.post('/sign-in', async (req: Request, res: Response) => {
    try {
        const response = await AccountService.getByUsername(req);
        res.json(response.getResponse());
    } catch (_: any) {
        const response = new BaseResponse(RET_CODE.ERROR, false, RET_MSG.ERROR);
        res.json(response.getResponse());
    }
});

// POST: /api/accounts/reset-password
// Desc: Reset password
router.post('/reset-password', async (req: Request, res: Response) => {
    try {
        const response = await AccountService.resetPassword(req);
        res.json(response.getResponse());
    } catch (_: any) {
        const response = new BaseResponse(RET_CODE.ERROR, false, RET_MSG.ERROR);
        res.json(response.getResponse());
    }
});

// POST: /api/accounts/auth-google
// Desc: Reset password
router.post('/auth-google', async (req: Request, res: Response) => {
    try {
        const response = await AccountService.authByGoogle(req);
        res.json(response.getResponse());
    } catch (_: any) {
        const response = new BaseResponse(RET_CODE.ERROR, false, RET_MSG.ERROR);
        res.json(response.getResponse());
    }
});

export default router;
