import { Router } from 'express';
import { authenticate, authorize } from '../../middleware/auth.middleware';
import { WALLET_CONTROLLER } from './wallet.controller';

const router = Router();

router.get('/', authenticate, authorize(['CUSTOMER']), WALLET_CONTROLLER.getCustomerWallet);

export default router;
