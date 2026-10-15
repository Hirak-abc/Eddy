import { Router } from 'express';
import identityRoutes from './identity/identity.routes';
import socialRoutes from './social/social.routes';

const apiRoutes = Router();

// Placeholder routes
apiRoutes.get('/health', (req, res) => {
  res.status(200).json({ success: true, data: { status: 'api ok' }, error: null });
});

apiRoutes.use('/identity', identityRoutes);
apiRoutes.use('/social', socialRoutes);
// apiRoutes.use('/businesses', businessRoutes);

export default apiRoutes;
