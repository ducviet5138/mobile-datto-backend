import * as Express from 'express';
import filesRoute from './files';
import accountRoute from './accounts';
import eventRoute from './events';
import otpRoute from './otp';
import profileRoute from './profiles';
import groupRoute from './groups';
import fundRoute from './funds';
import memoryRoute from './memories';

const router = Express.Router();

router.use('/files', filesRoute);
router.use('/accounts', accountRoute);
router.use('/events', eventRoute);
router.use('/otp', otpRoute);
router.use('/profiles', profileRoute);
router.use('/groups', groupRoute);
router.use('/funds', fundRoute);
router.use('/memories', memoryRoute);

export default router;
