import { Router } from 'express';
import { authenticate, authorize } from '../../middleware/auth.middleware';
import { REWARDS_CONTROLLER } from './rewards.controller';

const router = Router();

router.post('/spin', authenticate, authorize(['CUSTOMER']), REWARDS_CONTROLLER.spinWheel);
router.get('/streak', authenticate, authorize(['CUSTOMER']), REWARDS_CONTROLLER.getStreak);

export default router;
