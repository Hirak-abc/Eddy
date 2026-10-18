import type { AuthConfig } from 'convex/server';

const frontendApiUrl = process.env.CLERK_FRONTEND_API_URL?.trim();
if (!frontendApiUrl) {
  throw new Error('CLERK_FRONTEND_API_URL must be configured for Convex Clerk authentication.');
}

export default {
  providers: [{ domain: frontendApiUrl, applicationID: 'convex' }],
} satisfies AuthConfig;
