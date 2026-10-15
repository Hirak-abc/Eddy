import { ConvexHttpClient } from 'convex/browser';
import { config } from '../../config/env';

export const convexClient = config.CONVEX_URL
  ? new ConvexHttpClient(config.CONVEX_URL)
  : null;
