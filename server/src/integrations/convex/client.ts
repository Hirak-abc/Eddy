import { ConvexHttpClient } from 'convex/browser';
import { config } from '../../config/env';

export const convexClient = config.CONVEX_URL
  ? new ConvexHttpClient(config.CONVEX_URL)
  : null;

export const createAuthenticatedConvexClient = (token: string) => {
  if (!config.CONVEX_URL) {
    throw new Error('Convex is not configured.');
  }
  const client = new ConvexHttpClient(config.CONVEX_URL);
  client.setAuth(token);
  return client;
};
