import * as Express from 'express';
import { Request, Response } from "express"
import BaseResponse from "../../../utils/baseResponse";

const router = Express.Router();

router.post("/", (req: Request, res: Response) => {
    res.status(404).json(new BaseResponse(false, "Not implemented", null));
});

export default router;