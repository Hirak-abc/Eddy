import { Router } from 'express';
import { SOCIAL_CONTROLLER } from './social.controller';

const router = Router();

// Meta Data Deletion Request Callback (public — called by Meta, no auth).
// Set this URL in Meta App Dashboard > Data Deletion Request Callback URL.
router.post('/data-deletion/meta', SOCIAL_CONTROLLER.metaDataDeletion);

// Public status lookup for a confirmation code issued above.
router.get(
  '/data-deletion/status/:confirmationCode',
  SOCIAL_CONTROLLER.deletionStatus,
);

export default router;
