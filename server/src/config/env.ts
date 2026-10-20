import path from 'path';
import { config as loadDotenv } from 'dotenv';
import { z } from 'zod';

loadDotenv({ path: path.resolve(__dirname, '../../../.env') });
loadDotenv({ path: path.resolve(__dirname, '../../.env') });
loadDotenv({ path: path.resolve(process.cwd(), '.env') });

export const config = {
  PORT: process.env.PORT || 5000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  CLIENT_URL: process.env.CLIENT_URL || 'http://localhost:5173',
  CLERK_SECRET_KEY: process.env.CLERK_SECRET_KEY,
  CLERK_PUBLISHABLE_KEY: process.env.CLERK_PUBLISHABLE_KEY,
  CONVEX_URL: process.env.CONVEX_URL,
  EDDY_CONVEX_SECRET: process.env.EDDY_CONVEX_SECRET,
  XAI_API_KEY: process.env.XAI_API_KEY,
  META_APP_ID: process.env.META_APP_ID,
  META_APP_SECRET: process.env.META_APP_SECRET,
  META_REDIRECT_URI: process.env.META_REDIRECT_URI,
  META_GRAPH_API_VERSION: process.env.META_GRAPH_API_VERSION || 'v21.0',
  META_IG_GRAPH_API_VERSION: process.env.META_IG_GRAPH_API_VERSION || 'v21.0',
  META_STATE_SECRET: process.env.META_STATE_SECRET,
  META_TOKEN_ENCRYPTION_KEY: process.env.META_TOKEN_ENCRYPTION_KEY,
  META_IG_USER_ID: process.env.META_IG_USER_ID,
  META_IG_USERNAME: process.env.META_IG_USERNAME,
  META_IG_ACCESS_TOKEN: process.env.META_IG_ACCESS_TOKEN,
  RAZORPAY_KEY_ID: process.env.RAZORPAY_KEY_ID,
  RAZORPAY_KEY_SECRET: process.env.RAZORPAY_KEY_SECRET,
  RAZORPAY_WEBHOOK_SECRET: process.env.RAZORPAY_WEBHOOK_SECRET,
  R2_ACCOUNT_ID: process.env.R2_ACCOUNT_ID,
  R2_ACCESS_KEY_ID: process.env.R2_ACCESS_KEY_ID,
  R2_SECRET_ACCESS_KEY: process.env.R2_SECRET_ACCESS_KEY,
  R2_BUCKET_NAME: process.env.R2_BUCKET_NAME,
  R2_PUBLIC_URL: process.env.R2_PUBLIC_URL,
  GA_MEASUREMENT_ID: process.env.VITE_GA_MEASUREMENT_ID,
};

// Validate critical configuration
const envSchema = z.object({
  PORT: z.coerce.number().default(5000),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  CLIENT_URL: z.string().url(),
  CLERK_SECRET_KEY: z.string().min(1).optional(),
  CONVEX_URL: z.string().url().optional(),
});

export const parsedConfig = envSchema.parse(config);
