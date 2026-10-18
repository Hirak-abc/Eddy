import { Router } from 'express';
import { authenticate, authorize } from '../../middleware/auth.middleware';
import { QR_CONTROLLER } from './qr.controller';

const router = Router();
const customerOnly = [authenticate, authorize(['CUSTOMER'])];

router.get('/resolve/:qrToken', QR_CONTROLLER.resolve);
router.post('/scan', ...customerOnly, QR_CONTROLLER.scan);
router.get('/status', ...customerOnly, QR_CONTROLLER.status);

export default router;
