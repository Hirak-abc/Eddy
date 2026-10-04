import { createClerkClient } from '@clerk/backend';
import { config } from '../../config/env';

export const clerkClient = config.CLERK_SECRET_KEY
  ? createClerkClient({ secretKey: config.CLERK_SECRET_KEY })
  : null;
