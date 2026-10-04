import { Router } from 'express';
import identityRoutes from './identity/identity.routes';

const apiRoutes = Router();

// Placeholder routes
apiRoutes.get('/health', (req, res) => {
  res.status(200).json({ success: true, data: { status: 'api ok' }, error: null });
});

apiRoutes.use('/identity', identityRoutes);
// apiRoutes.use('/businesses', businessRoutes);

export default apiRoutes;
