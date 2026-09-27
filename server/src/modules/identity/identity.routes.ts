import { Router } from 'express';
import { authorize } from '../../middleware/auth.middleware';
import { IDENTITY_CONTROLLER } from './identity.controller';

const router = Router();

// Define identity-related routes
router.get('/me', authorize(['CUSTOMER', 'OWNER', 'ADMIN']), IDENTITY_CONTROLLER.getMe);
router.patch('/me', authorize(['CUSTOMER', 'OWNER', 'ADMIN']), IDENTITY_CONTROLLER.updateMe);

export default router;
