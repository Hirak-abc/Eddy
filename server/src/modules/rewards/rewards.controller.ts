import { Request, Response, NextFunction } from 'express';
import { REWARDS_SERVICE } from './rewards.service';
import { spinWheelSchema } from './rewards.schema';

export const REWARDS_CONTROLLER = {
  spinWheel: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const parsed = spinWheelSchema.parse(req.body);
      const token = req.authToken;
      if (!token) {
        return res.status(401).json({
          success: false,
          data: null,
          error: { code: 'UNAUTHORIZED', message: 'Authentication required' },
        });
      }

      const result = await REWARDS_SERVICE.spinWheel(parsed.scanId, token);

      res.status(200).json({
        success: true,
        data: result,
        error: null,
      });
    } catch (error: any) {
      if (error.code && error.message) {
        return res.status(400).json({
          success: false,
          data: null,
          error: {
            code: error.code,
            message: error.message,
          },
        });
      }
      next(error);
    }
  },

  getStreak: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.authToken;
      if (!token) {
        return res.status(401).json({
          success: false,
          data: null,
          error: { code: 'UNAUTHORIZED', message: 'Authentication required' },
        });
      }
      const result = await REWARDS_SERVICE.getStreak(token);

      res.status(200).json({
        success: true,
        data: result,
        error: null,
      });
    } catch (error) {
      next(error);
    }
  },
};
