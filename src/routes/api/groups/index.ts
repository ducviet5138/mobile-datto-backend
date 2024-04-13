import * as Express from 'express';
import { Request, Response } from 'express';
import BaseResponse from '@/utils/baseResponse';
import { RET_CODE, RET_MSG } from '@/utils/returnCode';
import GroupService from '@/services/group';
import EventService from '@/services/event';

const router = Express.Router();

// POST: /api/groups
// Desc: Create group
router.post('/', async (req: Request, res: Response) => {
    try {
        const response = await GroupService.create(req);
        res.json(response.getResponse());
    } catch (_: any) {
        const response = new BaseResponse(RET_CODE.ERROR, false, RET_MSG.ERROR);
        res.json(response.getResponse());
    }
});

// GET: /api/groups/:id
// Desc: Get group information
router.get('/:id', async (req: Request, res: Response) => {
    try {
        const response = await GroupService.getGroupInfo(req);
        res.json(response.getResponse());
    } catch (_: any) {
        const response = new BaseResponse(RET_CODE.ERROR, false, RET_MSG.ERROR);
        res.json(response.getResponse());
    }
});

// GET: /api/groups/:id/members
// Desc: Get group members
router.get('/:id/members', async (req: Request, res: Response) => {
    try {
        const response = await GroupService.getGroupMembers(req);
        res.json(response.getResponse());
    } catch (_: any) {
        const response = new BaseResponse(RET_CODE.ERROR, false, RET_MSG.ERROR);
        res.json(response.getResponse());
    }
});

// PATCH: /api/groups/:id
// Desc: Update group information
router.patch('/:id', async (req: Request, res: Response) => {
    try {
        const response = await GroupService.patch(req);
        res.json(response.getResponse());
    } catch (_: any) {
        const response = new BaseResponse(RET_CODE.ERROR, false, RET_MSG.ERROR);
        res.json(response.getResponse());
    }
});

// GET: /api/groups/:id/code-generation
// Desc: Generate new invite code
router.get('/:id/code-generation', async (req: Request, res: Response) => {
    try {
        const response = await GroupService.generateInviteCode(req);
        res.json(response.getResponse());
    } catch (_: any) {
        const response = new BaseResponse(RET_CODE.ERROR, false, RET_MSG.ERROR);
        res.json(response.getResponse());
    }
});

// POST /api/groups/join
// Desc: Join group
router.post('/join', async (req: Request, res: Response) => {
    try {
        const response = await GroupService.joinGroup(req);
        res.json(response.getResponse());
    } catch (_: any) {
        const response = new BaseResponse(RET_CODE.ERROR, false, RET_MSG.ERROR);
        res.json(response.getResponse());
    }
});

// GET /api/groups/:id/events
// Desc: Get group events
router.get('/:id/events', async (req: Request, res: Response) => {
    try {
        const response = await GroupService.getGroupEvents(req);
        res.json(response.getResponse());
    } catch (_: any) {
        const response = new BaseResponse(RET_CODE.ERROR, false, RET_MSG.ERROR);
        res.json(response.getResponse());
    }
});

// POST /api/groups/:id/events
// Desc: Create a new event
router.post('/:id/events', async (req: Request, res: Response) => {
    try {
        const response = await EventService.create(req);
        res.json(response.getResponse());
    } catch (_: any) {
        const response = new BaseResponse(RET_CODE.ERROR, false, RET_MSG.ERROR);
        res.json(response.getResponse());
    }
});

export default router;
