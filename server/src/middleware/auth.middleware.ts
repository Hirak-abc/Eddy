import { Request, Response, NextFunction } from 'express';
import { verifyClerkSessionToken } from '../integrations/clerk';
import { convexClient } from '../integrations/convex';
import { anyApi } from 'convex/server';
import { ERROR_CODES } from '../config/constants';
import { UserRecord } from '../integrations/convex';

/** Authentication Middleware — verifies Clerk session token and attaches clerkId. */
export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        success: false,
        data: null,
        error: { code: ERROR_CODES.UNAUTHORIZED, message: 'Missing Authorization header' },
      });
    }

    const [scheme, token, ...rest] = authHeader.split(' ');

    if (scheme !== 'Bearer') {
      return res.status(401).json({
        success: false,
        data: null,
        error: { code: ERROR_CODES.UNAUTHORIZED, message: 'Authorization header must use Bearer scheme' },
      });
    }

    if (!token || rest.length > 0) {
      return res.status(401).json({
        success: false,
        data: null,
        error: { code: ERROR_CODES.UNAUTHORIZED, message: 'Invalid Bearer token format' },
      });
    }

    const clerkId = await verifyClerkSessionToken(token);
    (req as Request & { auth?: { clerkId: string; role?: string } }).auth = { clerkId };
    return next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      data: null,
      error: { code: ERROR_CODES.UNAUTHORIZED, message: 'Invalid or expired authentication token' },
    });
  }
};

/** Authorization Middleware — verifies role against Convex application user. */
export const authorize = (allowedRoles: string[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const authIdentity = (req as Request & { auth?: { clerkId: string; role?: string } }).auth;
    if (!authIdentity || !authIdentity.clerkId) {
      return res.status(401).json({
        success: false,
        data: null,
        error: { code: ERROR_CODES.UNAUTHORIZED, message: 'Authentication required before authorization' },
      });
    }

    try {
      const user = (await convexClient.query(anyApi.users.getByClerkId, { clerkId: authIdentity.clerkId })) as UserRecord | null;
      if (!user) {
        return res.status(403).json({
          success: false,
          data: null,
          error: { code: ERROR_CODES.FORBIDDEN, message: 'No application user found for this identity' },
        });
      }

      const validRoles = ['OWNER', 'CUSTOMER', 'ADMIN'];
      const rawRole = user.role;
      if (!rawRole || !validRoles.includes(rawRole)) {
        return res.status(403).json({
          success: false,
          data: null,
          error: { code: ERROR_CODES.FORBIDDEN, message: 'Invalid or missing application role' },
        });
      }

      const role = rawRole as 'OWNER' | 'CUSTOMER' | 'ADMIN';
      (req as Request & { auth?: { clerkId: string; role?: string; status?: string } }).auth!.role = role;

      // Account status check: only ACTIVE accounts receive authorized access.
      const accountStatus = user.status as 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';
      (req as Request & { auth?: { clerkId: string; role?: string; status?: string } }).auth!.status = accountStatus;

      if (accountStatus !== 'ACTIVE') {
        return res.status(403).json({
          success: false,
          data: null,
          error: {
            code: accountStatus === 'INACTIVE' ? ERROR_CODES.ACCOUNT_INACTIVE : ERROR_CODES.ACCOUNT_SUSPENDED,
            message: accountStatus === 'INACTIVE' ? 'Account is inactive' : 'Account is suspended',
          },
        });
      }

      if (!allowedRoles.includes(role)) {
        return res.status(403).json({
          success: false,
          data: null,
          error: { code: ERROR_CODES.FORBIDDEN, message: 'Insufficient authorization' },
        });
      }

      return next();
    } catch (err) {
      return next(err);
    }
  };
};
