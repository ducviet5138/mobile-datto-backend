import * as Express from 'express';
import { Request, Response } from 'express';
import BaseResponse from '@/utils/baseResponse';
import { RET_CODE, RET_MSG } from '@/utils/returnCode';
import AccountService from '@/services/account';

const router = Express.Router();

// POST: /api/accounts
// Feat: Create account
router.post('/', async (req: Request, res: Response) => {
    try {
        const response = await AccountService.create(req);
        res.status(response.getRetCode()).json(response.getResponse());
    } catch (_: any) {
        const response = new BaseResponse(RET_CODE.ERROR, false, RET_MSG.ERROR);
        res.status(response.getRetCode()).json(response.getResponse());
    }
});

// DELETE: /api/accounts/:id
// Feat: Delete account
router.delete('/:id', async (req: Request, res: Response) => {
    try {
        const response = await AccountService.delete(req);
        res.status(response.getRetCode()).json(response.getResponse());
    } catch (_: any) {
        const response = new BaseResponse(RET_CODE.ERROR, false, RET_MSG.ERROR);
        res.status(response.getRetCode()).json(response.getResponse());
    }
});

// GET: /api/accounts/:id
// Feat: Get account and profile by id
router.get('/:id', async (req: Request, res: Response) => {
    try {
        const response = await AccountService.get(req);
        res.status(response.getRetCode()).json(response.getResponse());
    } catch (_: any) {
        const response = new BaseResponse(RET_CODE.ERROR, false, RET_MSG.ERROR);
        res.status(response.getRetCode()).json(response.getResponse());
    }
});

// PATCH: /api/accounts/:id
// Feat: Update account information (username, password)
router.patch('/:id', async (req: Request, res: Response) => {
    try {
        const response = await AccountService.patch(req);
        res.status(response.getRetCode()).json(response.getResponse());
    } catch (_: any) {
        const response = new BaseResponse(RET_CODE.ERROR, false, RET_MSG.ERROR);
        res.status(response.getRetCode()).json(response.getResponse());
    }
});


export default router;