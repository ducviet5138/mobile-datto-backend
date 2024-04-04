import * as Express from 'express';
import { Request, Response } from 'express';
import BaseResponse from '@/utils/baseResponse';
import { RET_CODE, RET_MSG } from '@/utils/returnCode';
import AccountService from '@/services/account';

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


export default router;