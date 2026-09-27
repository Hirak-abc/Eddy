import { Router } from 'express';

const apiRoutes = Router();

// Placeholder routes
apiRoutes.get('/health', (req, res) => {
  res.status(200).json({ success: true, data: { status: 'api ok' }, error: null });
});

// Import and use module routes here
// apiRoutes.use('/identity', identityRoutes);
// apiRoutes.use('/businesses', businessRoutes);

export default apiRoutes;
