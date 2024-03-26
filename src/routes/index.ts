import * as Express from 'express';
import apiRoutes from './api'
import { Request, Response } from "express"
import BaseResponse from "@/utils/baseResponse";
import { RET_CODE, RET_MSG } from '@/utils/returnCode';

const router = Express.Router();

router.use("/api", apiRoutes)

// Undefined routes
router.use("*", (req: Request, res: Response) => {
    res.status(RET_CODE.NOT_FOUND).json(new BaseResponse(false, RET_MSG.NOT_FOUND));
});

export default router