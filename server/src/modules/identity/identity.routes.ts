import { Router } from 'express';
import { authenticate } from '../../middleware/auth.middleware';
import { IDENTITY_CONTROLLER } from './identity.controller';

const router = Router();

router.get('/me', authenticate, IDENTITY_CONTROLLER.getMe);
router.patch('/me', authenticate, IDENTITY_CONTROLLER.updateMe);

export default router;
