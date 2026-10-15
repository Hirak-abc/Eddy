import { Router } from 'express';
import { QR_CONTROLLER } from './qr.controller';

const router = Router();

router.post('/scan', QR_CONTROLLER.scan);
router.get('/status', QR_CONTROLLER.status);

export default router;
