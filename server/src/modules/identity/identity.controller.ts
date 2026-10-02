import { Request, Response, NextFunction } from 'express';
import { IDENTITY_SERVICE } from './identity.service';
import { patchMeSchema, signupRoleSchema } from './identity.schema';

export const IDENTITY_CONTROLLER = {
  getMe: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const authIdentity = (req as Request & { auth?: { clerkId: string } }).auth;
      if (!authIdentity || !authIdentity.clerkId) {
        return res.status(401).json({
          success: false,
          data: null,
          error: { code: 'UNAUTHORIZED', message: 'Authentication required' },
        });
      }

      // Optional validated signup role for new-user creation only.
      // Never accepted for existing users; existing Convex role remains authoritative.
      const rawRole = req.query?.role;
      // Express may parse query params as arrays; normalize to string.
      const roleString = Array.isArray(rawRole) ? rawRole[0] : rawRole;
      let validatedRole: 'OWNER' | 'CUSTOMER' | undefined;
      if (roleString !== undefined) {
        const parsedRole = signupRoleSchema.safeParse(roleString);
        if (!parsedRole.success) {
          return res.status(400).json({
            success: false,
            data: null,
            error: {
              code: 'VALIDATION_ERROR',
              message: 'Invalid signup role. Allowed: OWNER, CUSTOMER.',
              details: parsedRole.error.errors,
            },
          });
        }
        validatedRole = parsedRole.data as 'OWNER' | 'CUSTOMER';
      }

      const user = await IDENTITY_SERVICE.getOrCreateApplicationUser(authIdentity.clerkId, validatedRole);
      return res.status(200).json({
        success: true,
        data: user,
        error: null,
      });
    } catch (err) {
      return next(err);
    }
  },
  updateMe: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const authIdentity = (req as Request & { auth?: { clerkId: string } }).auth;
      if (!authIdentity || !authIdentity.clerkId) {
        return res.status(401).json({
          success: false,
          data: null,
          error: { code: 'UNAUTHORIZED', message: 'Authentication required' },
        });
      }

      const parsed = patchMeSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({
          success: false,
          data: null,
          error: { code: 'VALIDATION_ERROR', message: 'Invalid request body', details: parsed.error.errors },
        });
      }

      const user = await IDENTITY_SERVICE.updateApplicationUser(authIdentity.clerkId, parsed.data);
      return res.status(200).json({
        success: true,
        data: user,
        error: null,
      });
    } catch (err) {
      return next(err);
    }
  },
};
