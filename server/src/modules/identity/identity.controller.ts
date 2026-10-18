import { Request, Response, NextFunction } from 'express';
import { IDENTITY_SERVICE } from './identity.service';
import { z } from 'zod';

const roleSchema = z.object({
  role: z.enum(['OWNER', 'CUSTOMER']),
});

export const IDENTITY_CONTROLLER = {
  setRole: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { role } = roleSchema.parse(req.body);
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({
          success: false,
          data: null,
          error: { code: 'UNAUTHORIZED', message: 'Authentication required' },
        });
      }
      const user = await IDENTITY_SERVICE.setRole(userId, role, req.authToken!);
      return res.status(200).json({ success: true, data: user, error: null });
    } catch (error) {
      next(error);
    }
  },

  getMe: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = await IDENTITY_SERVICE.getCurrentUser(req.user!.id, req.authToken!);
      res.status(200).json({ success: true, data: user, error: null });
    } catch (error) {
      next(error);
    }
  },

  updateMe: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const updatedUser = await IDENTITY_SERVICE.updateCurrentUser(
        req.user!.id,
        req.body,
        req.authToken!,
      );
      res.status(200).json({ success: true, data: updatedUser, error: null });
    } catch (error) {
      next(error);
    }
  },
};
