import { Router } from 'express';
import { authenticate, authorize } from '../../middleware/auth.middleware';
import { SOCIAL_CONTROLLER } from './social.controller';

const router = Router();
const ownerOnly = [authenticate, authorize(['OWNER'])];

// Meta Data Deletion Request Callback (public — called by Meta, no auth).
router.post('/data-deletion/meta', SOCIAL_CONTROLLER.metaDataDeletion);
router.get(
  '/data-deletion/status/:confirmationCode',
  SOCIAL_CONTROLLER.deletionStatus,
);

router.get('/meta/connect', ...ownerOnly, SOCIAL_CONTROLLER.connect);
router.get('/meta/callback', SOCIAL_CONTROLLER.callback);

router.get('/accounts', ...ownerOnly, SOCIAL_CONTROLLER.listAccounts);
router.patch('/accounts/:id', ...ownerOnly, SOCIAL_CONTROLLER.updateAccount);
router.delete('/accounts/:id', ...ownerOnly, SOCIAL_CONTROLLER.disconnectAccount);

router.post('/posts/publish', ...ownerOnly, SOCIAL_CONTROLLER.publishNow);
router.post('/posts/schedule', ...ownerOnly, SOCIAL_CONTROLLER.schedule);
router.post('/posts/:id/cancel', ...ownerOnly, SOCIAL_CONTROLLER.cancel);

export default router;
