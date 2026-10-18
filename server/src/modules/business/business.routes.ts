import { Router } from 'express';
import { authenticate, authorize } from '../../middleware/auth.middleware';
import { BUSINESS_CONTROLLER } from './business.controller';

const router = Router();

router.get('/me', authenticate, authorize(['OWNER']), BUSINESS_CONTROLLER.getOwnedBusiness);
router.post('/me', authenticate, authorize(['OWNER']), BUSINESS_CONTROLLER.createOwnedBusiness);
router.post('/me/qr/activate-legacy', authenticate, authorize(['OWNER']), BUSINESS_CONTROLLER.activateLegacyOwnedQr);
router.post('/me/qr/disable', authenticate, authorize(['OWNER']), BUSINESS_CONTROLLER.disableOwnedQr);
router.get('/me/offers', authenticate, authorize(['OWNER']), BUSINESS_CONTROLLER.listOwnedOffers);
router.post('/me/offers', authenticate, authorize(['OWNER']), BUSINESS_CONTROLLER.createOffer);
router.get('/active', authenticate, authorize(['CUSTOMER']), BUSINESS_CONTROLLER.listActiveBusinesses);
router.get('/:businessId/offers', authenticate, authorize(['CUSTOMER']), BUSINESS_CONTROLLER.listBusinessOffers);

export default router;
