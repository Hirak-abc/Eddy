import { randomUUID } from 'node:crypto';
import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '@clerk/backend';
import type { UserRole } from '../types';
import { ERROR_CODES } from '../config/constants';
import { config } from '../config/env';
import { clerkClient } from '../integrations/clerk/client';

const asUserRole = (value: unknown): UserRole | undefined =>
  value === 'OWNER' || value === 'CUSTOMER' || value === 'ADMIN' ? value : undefined;

const roleFromClaims = (claims: Record<string, unknown>): UserRole | undefined => {
  const metadata = claims.metadata as { role?: unknown } | undefined;
  const publicMetadata = (claims.publicMetadata ?? claims.public_metadata) as
    | { role?: unknown }
    | undefined;
  return (
    asUserRole(metadata?.role) ||
    asUserRole(publicMetadata?.role) ||
    asUserRole(claims.role)
  );
};

export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
  const authorization = req.headers.authorization;
  const token = authorization?.startsWith('Bearer ')
    ? authorization.slice('Bearer '.length)
    : undefined;

  if (!token || !config.CLERK_SECRET_KEY) {
    return res.status(401).json({
      success: false,
      data: null,
      error: { code: ERROR_CODES.UNAUTHORIZED, message: 'Authentication required' },
    });
  }

  let userId: string;
  try {
    const claims = await verifyToken(token, { secretKey: config.CLERK_SECRET_KEY });
    let userRole = roleFromClaims(claims as unknown as Record<string, unknown>);

    if (!userRole && clerkClient) {
      const user = await clerkClient.users.getUser(claims.sub);
      userRole = asUserRole(user.publicMetadata?.role);
    }

    req.user = { id: claims.sub, role: userRole };
    next();
  } catch {
    return res.status(401).json({
      success: false,
      data: null,
      error: { code: ERROR_CODES.UNAUTHORIZED, message: 'Invalid authentication token' },
    });
  }

  try {
    const profile = await createAuthenticatedConvexClient(token).query(getUserByClerkId, {
      clerkId: userId,
    });
    const isInactive =
      profile?.status === 'SUSPENDED' ||
      profile?.status === 'DELETED' ||
      profile?.status === 'INACTIVE';
    req.user = {
      id: userId,
      role: isInactive ? undefined : profile?.role,
    };
    req.authToken = token;
    next();
  } catch (error) {
    logAuthenticationFailure(req, res, 'convex_role_lookup', error);
    return res.status(503).json({
      success: false,
      data: null,
      error: {
        code: ERROR_CODES.EXTERNAL_API_ERROR,
        message: 'Authentication services are temporarily unavailable.',
      },
    });
  }
};

export const authorize = (allowedRoles: UserRole[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user?.role || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        data: null,
        error: { code: ERROR_CODES.FORBIDDEN, message: 'Forbidden' },
      });
    }
    next();
  };
};
