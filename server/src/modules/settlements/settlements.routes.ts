import { Router } from 'express';
import { authenticate, authorize } from '../../middleware/auth.middleware';
import { SETTLEMENTS_CONTROLLER } from './settlements.controller';

const router = Router();

router.get('/me', authenticate, authorize(['OWNER']), SETTLEMENTS_CONTROLLER.getOwnerSummary);
router.post('/batches', authenticate, authorize(['OWNER']), SETTLEMENTS_CONTROLLER.createBatch);
router.post('/batches/:batchId/outcome', authenticate, authorize(['ADMIN']), SETTLEMENTS_CONTROLLER.recordOutcome);
router.post('/batches/:batchId/reverse', authenticate, authorize(['ADMIN']), SETTLEMENTS_CONTROLLER.reverse);

export default router;
