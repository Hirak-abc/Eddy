import { ConvexHttpClient } from 'convex/browser';
import { config } from '../../config/env';

if (!config.CONVEX_URL) {
  throw new Error('CONVEX_URL environment variable is not set');
}

export const convexClient = new ConvexHttpClient(config.CONVEX_URL);

export type UserRecord = {
  _id: string;
  clerkId: string;
  email: string;
  role: 'OWNER' | 'CUSTOMER' | 'ADMIN';
  displayName: string;
  phone?: string;
  avatarUrl?: string;
  status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';
  createdAt: string;
  updatedAt: string;
};
