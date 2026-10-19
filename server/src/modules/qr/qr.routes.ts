import { Router } from 'express';
import { authenticate, authorize } from '../../middleware/auth.middleware';
import { QR_CONTROLLER } from './qr.controller';

const router = Router();
const customerOnly = [authenticate, authorize(['CUSTOMER'])];
const ownerOnly = [authenticate, authorize(['OWNER'])];

router.get('/resolve/:qrToken', QR_CONTROLLER.resolve);
router.post('/scan', ...customerOnly, QR_CONTROLLER.scan);
router.get('/status', ...customerOnly, QR_CONTROLLER.status);
router.get('/owner/today', ...ownerOnly, QR_CONTROLLER.ownerToday);
router.get('/owner/repeat-rate', ...ownerOnly, QR_CONTROLLER.ownerRepeatRate);

export default router;
