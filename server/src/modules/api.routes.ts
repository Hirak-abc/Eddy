import { Router } from 'express';

const apiRoutes = Router();

// Placeholder routes
apiRoutes.get('/health', (req, res) => {
  res.status(200).json({ success: true, data: { status: 'api ok' }, error: null });
});

import identityRoutes from './identity/identity.routes';

apiRoutes.use('/', identityRoutes);

export default apiRoutes;
