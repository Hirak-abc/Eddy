import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '@clerk/backend';
import type { UserRole } from '../types';
import { ERROR_CODES } from '../config/constants';
import { config } from '../config/env';

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

  try {
    const claims = await verifyToken(token, { secretKey: config.CLERK_SECRET_KEY });
    const metadata = (claims.metadata ?? {}) as { role?: unknown };
    const role = metadata.role;
    const userRole: UserRole | undefined =
      role === 'OWNER' || role === 'CUSTOMER' || role === 'ADMIN' ? role : undefined;

    req.user = { id: claims.sub, role: userRole };
    next();
  } catch {
    return res.status(401).json({
      success: false,
      data: null,
      error: { code: ERROR_CODES.UNAUTHORIZED, message: 'Invalid authentication token' },
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
