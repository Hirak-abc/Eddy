import { Router } from 'express';
import { authenticate, authorize } from '../../middleware/auth.middleware';
import { WALLET_CONTROLLER } from './wallet.controller';

const router = Router();

router.get('/', authenticate, authorize(['CUSTOMER']), WALLET_CONTROLLER.getCustomerWallet);
router.get('/owner', authenticate, authorize(['OWNER']), WALLET_CONTROLLER.getOwnerWallet);

export default router;
