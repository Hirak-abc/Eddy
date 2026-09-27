import rateLimit from 'express-rate-limit';
import { ERROR_CODES } from '../config/constants';

export const rateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  message: {
    success: false,
    data: null,
    error: {
      code: ERROR_CODES.RATE_LIMITED,
      message: 'Too many requests, please try again later.',
    },
  },
});
