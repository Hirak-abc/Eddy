import { Router } from 'express';
import { authenticate, authorize } from '../../middleware/auth.middleware';
import { REDEMPTIONS_CONTROLLER } from './redemptions.controller';

const router = Router();

router.post('/', authenticate, authorize(['CUSTOMER']), REDEMPTIONS_CONTROLLER.request);
router.get('/mine', authenticate, authorize(['CUSTOMER']), REDEMPTIONS_CONTROLLER.listCustomer);
router.post('/:redemptionId/cancel', authenticate, authorize(['CUSTOMER']), REDEMPTIONS_CONTROLLER.cancel);
router.get('/owner', authenticate, authorize(['OWNER']), REDEMPTIONS_CONTROLLER.listOwner);
router.post('/:redemptionId/review', authenticate, authorize(['OWNER']), REDEMPTIONS_CONTROLLER.review);

export default router;
