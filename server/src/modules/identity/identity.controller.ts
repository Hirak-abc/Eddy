import { Request, Response, NextFunction } from 'express';
import { IDENTITY_SERVICE } from './identity.service';

export const IDENTITY_CONTROLLER = {
  getMe: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = await IDENTITY_SERVICE.getCurrentUser((req as any).user.id);
      res.status(200).json({ success: true, data: user, error: null });
    } catch (error) {
      next(error);
    }
  },

  updateMe: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const updatedUser = await IDENTITY_SERVICE.updateCurrentUser((req as any).user.id, req.body);
      res.status(200).json({ success: true, data: updatedUser, error: null });
    } catch (error) {
      next(error);
    }
  },
};
