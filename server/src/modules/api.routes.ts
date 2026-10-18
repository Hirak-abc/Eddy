import { Router } from 'express';
import identityRoutes from './identity/identity.routes';
import qrRoutes from './qr/qr.routes';
import socialRoutes from './social/social.routes';
import rewardsRoutes from './rewards/rewards.routes';
import walletRoutes from './wallet/wallet.routes';
import businessRoutes from './business/business.routes';
import redemptionRoutes from './redemptions/redemptions.routes';
import settlementRoutes from './settlements/settlements.routes';

const apiRoutes = Router();

// Placeholder routes
apiRoutes.get('/health', (req, res) => {
  res.status(200).json({ success: true, data: { status: 'api ok' }, error: null });
});

apiRoutes.use('/identity', identityRoutes);
apiRoutes.use('/businesses', businessRoutes);
apiRoutes.use('/qr', qrRoutes);
apiRoutes.use('/social', socialRoutes);
apiRoutes.use('/rewards', rewardsRoutes);
apiRoutes.use('/wallet', walletRoutes);
apiRoutes.use('/redemptions', redemptionRoutes);
apiRoutes.use('/settlements', settlementRoutes);
// apiRoutes.use('/businesses', businessRoutes);

export default apiRoutes;
