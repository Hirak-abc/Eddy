import { Request, Response, NextFunction } from 'express';
// import { getAuth } from '@clerk/express'; // Temporarily commented out
import { ERROR_CODES } from '../config/constants';

// Authentication Middleware
export const authenticate = (req: Request, res: Response, next: NextFunction) => {
  // const { userId } = getAuth(req);
  const userId = 'sample-user-id'; // Temporary mock

  if (!userId) {
    return res.status(401).json({
      success: false,
      data: null,
      error: { code: ERROR_CODES.UNAUTHORIZED, message: 'Authentication required' },
    });
  }
  // Attach userId to request for use in controllers
  (req as any).user = { id: userId };
  next();
};

// Authorization Middleware
export const authorize = (allowedRoles: string[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    // In a real implementation, you would fetch user role from Convex based on (req as any).user.id
    // const userRole = await fetchUserRole((req as any).user.id);

    // Placeholder until Identity Module is implemented
    const userRole = 'CUSTOMER';

    if (!allowedRoles.includes(userRole)) {
      return res.status(403).json({
        success: false,
        data: null,
        error: { code: ERROR_CODES.FORBIDDEN, message: 'Forbidden' },
      });
    }
    next();
  };
};
