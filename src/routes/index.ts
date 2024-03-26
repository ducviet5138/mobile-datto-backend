import * as Express from 'express';
import apiRoutes from './api'

const router = Express.Router();

router.use("/api", apiRoutes)

export default router