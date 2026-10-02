import { createClerkClient, verifyToken } from '@clerk/backend';
import { config } from '../../config/env';

// Server-side Clerk client instance.
// Used for JWT token verification in authentication middleware and for
// Clerk user lookups in later tasks (Convex sync, /api/me, authorization).
export const clerkClient = createClerkClient({
  secretKey: config.CLERK_SECRET_KEY!,
});

/**
 * Verify a Clerk session token and return the verified Clerk user id.
 *
 * The token is verified against Clerk's published JWKS using the server
 * secret key. Only the resulting `sub` claim is trusted; nothing about the
 * application user (Convex id, role, account status) is derived here.
 *
 * @throws if the token is missing, malformed, expired or fails verification.
 */
export async function getClerkProfile(clerkId: string) {
  const user = await clerkClient.users.getUser(clerkId);
  const primaryEmail = user.emailAddresses?.find((e) => e.id === user.primaryEmailAddressId) || user.emailAddresses?.[0];
  return {
    email: primaryEmail?.emailAddress || '',
    displayName: `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.username || '',
    firstName: user.firstName || '',
    lastName: user.lastName || '',
    avatarUrl: user.imageUrl || undefined,
    phone: user.phoneNumbers?.[0]?.phoneNumber || undefined,
  };
}

export async function verifyClerkSessionToken(token: string): Promise<string> {
  interface ClerkPayload {
    sub: string;
  }

  // The installed @clerk/backend (v1.34.0) exports verifyToken as
  // `withLegacyReturn(verifyToken2)`, which THROWS on verification failure and
  // resolves with the raw JwtPayload on success. It does NOT resolve to
  // `{ data, errors }` — the internal function does, but the exported wrapper
  // unwraps it. Reading `.data` off the result therefore always yielded
  // `undefined` and every authenticated request failed with 401.
  let payload: unknown;
  try {
    payload = await verifyToken(token, {
      secretKey: config.CLERK_SECRET_KEY!,
    });
  } catch {
    throw new Error('Clerk token verification failed');
  }

  const data = payload as ClerkPayload | undefined;
  if (!data || typeof data.sub !== 'string' || data.sub.length === 0) {
    throw new Error('Clerk token verification returned no payload');
  }

  return data.sub;
}
