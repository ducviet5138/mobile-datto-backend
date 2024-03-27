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

export default router;