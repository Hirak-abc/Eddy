import { Router } from 'express';
import identityRoutes from './identity/identity.routes';
import qrRoutes from './qr/qr.routes';
import socialRoutes from './social/social.routes';
import businessProfileRoutes from './business-profile/business-profile.routes';
import flyerRoutes from './flyer/flyer.routes';
import couponRoutes from './coupons/coupons.routes';

const apiRoutes = Router();

// Placeholder routes
apiRoutes.get('/health', (req, res) => {
  res.status(200).json({ success: true, data: { status: 'api ok' }, error: null });
});

apiRoutes.use('/identity', identityRoutes);
apiRoutes.use('/qr', qrRoutes);
apiRoutes.use('/social', socialRoutes);
apiRoutes.use('/business-profile', businessProfileRoutes);
apiRoutes.use('/flyers', flyerRoutes);
apiRoutes.use('/coupons', couponRoutes);
// apiRoutes.use('/businesses', businessRoutes);

export default apiRoutes;
