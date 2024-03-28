import * as Express from "express"
import { Request, Response } from "express"
import BaseResponse from "@/utils/baseResponse";
import { RET_CODE, RET_MSG } from "@/utils/returnCode";
import GroupService from "@/services/group"

const router = Express.Router();

// POST: /api/groups
// Feat: Create group
router.post("/", async (req: Request, res: Response) => {
    try {
        const response = await GroupService.create(req);
        res.status(response.getRetCode()).json(response.getResponse());
    } catch (_: any) {
        const response = new BaseResponse(RET_CODE.ERROR, false, RET_MSG.ERROR);
        res.status(response.getRetCode()).json(response.getResponse());
    }
});

// GET: /api/groups/:id
// Feat: Get group information
router.get("/:id", async (req: Request, res: Response) => {
    try {
        const response = await GroupService.getGroupInfo(req);
        res.status(response.getRetCode()).json(response.getResponse());
    } catch (_: any) {
        const response = new BaseResponse(RET_CODE.ERROR, false, RET_MSG.ERROR);
        res.status(response.getRetCode()).json(response.getResponse());
    }
});

// GET: /api/groups/:id/members
// Feat: Get group members
router.get("/:id/members", async (req: Request, res: Response) => {
    try {
        const response = await GroupService.getGroupMembers(req);
        res.status(response.getRetCode()).json(response.getResponse());
    } catch (_: any) {
        const response = new BaseResponse(RET_CODE.ERROR, false, RET_MSG.ERROR);
        res.status(response.getRetCode()).json(response.getResponse());
    }
});

// PATCH: /api/groups/:id
// Feat: Update group information
router.patch("/:id", async (req: Request, res: Response) => {
    try {
        const response = await GroupService.patch(req);
        res.status(response.getRetCode()).json(response.getResponse());
    } catch (_: any) {
        const response = new BaseResponse(RET_CODE.ERROR, false, RET_MSG.ERROR);
        res.status(response.getRetCode()).json(response.getResponse());
    }
});

// POST: /api/groups/:id/code-generation
// Feat: Generate new invite code
router.post("/:id/code-generation", async (req: Request, res: Response) => {
    try {
        const response = await GroupService.generateInviteCode(req);
        res.status(response.getRetCode()).json(response.getResponse());
    } catch (_: any) {
        const response = new BaseResponse(RET_CODE.ERROR, false, RET_MSG.ERROR);
        res.status(response.getRetCode()).json(response.getResponse());
    }
});

// POST /api/groups/join
// Feat: Join group
router.post("/join", async (req: Request, res: Response) => {
    try {
        console.log('Reached here')
        const response = await GroupService.joinGroup(req);
        res.status(response.getRetCode()).json(response.getResponse());
    } catch (_: any) {
        const response = new BaseResponse(RET_CODE.ERROR, false, RET_MSG.ERROR);
        res.status(response.getRetCode()).json(response.getResponse());
    }
});


// GET /api/groups/accounts/:id
// Feat: Get accounts's groups
router.get("/accounts/:id", async (req: Request, res: Response) => {
    try {
        const response = await GroupService.getAccountsGroups(req);
        res.status(response.getRetCode()).json(response.getResponse());
    } catch (_: any) {
        const response = new BaseResponse(RET_CODE.ERROR, false, RET_MSG.ERROR);
        res.status(response.getRetCode()).json(response.getResponse());
    }
});

export default router;