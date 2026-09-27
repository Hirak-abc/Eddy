import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import { errorHandler } from './middleware/error.middleware';
import apiRoutes from './modules/api.routes';

// Create Express application
const app = express();

// Middleware
app.use(helmet()); // Secure HTTP headers
app.use(cors());   // Enable Cross-Origin Resource Sharing
app.use(express.json()); // Parse JSON request bodies
app.use(morgan('dev')); // HTTP request logger

// API Routes
app.use('/api', apiRoutes);

// Base API route
app.get('/health', (req, res) => {
  res.status(200).json({ success: true, data: { status: 'ok' }, error: null });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    data: null,
    error: {
      code: 'NOT_FOUND',
      message: 'Resource not found',
    },
  });
});

// Global error handler
app.use(errorHandler);

export default app;
