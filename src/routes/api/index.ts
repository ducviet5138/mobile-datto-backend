import * as Express from 'express';
import filesRoute from './files'
import accountRoute from './accounts'

const router = Express.Router();

router.use("/files", filesRoute)
router.use("/accounts", accountRoute)
