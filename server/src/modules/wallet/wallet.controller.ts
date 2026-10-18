import { Request, Response, NextFunction } from 'express';
import { WALLET_SERVICE } from './wallet.service';

export const WALLET_CONTROLLER = {
  getCustomerWallet: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.authToken;
      if (!token) {
        return res.status(401).json({
          success: false,
          data: null,
          error: { code: 'UNAUTHORIZED', message: 'Authentication required' },
        });
      }

      const wallet = await WALLET_SERVICE.getCustomerWallet(token);
      return res.status(200).json({
        success: true,
        data: wallet,
        error: null,
      });
    } catch (error) {
      return next(error);
    }
  },
  getOwnerWallet: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.authToken;
      if (!token) {
        return res.status(401).json({
          success: false,
          data: null,
          error: { code: 'UNAUTHORIZED', message: 'Authentication required' },
        });
      }
      const wallet = await WALLET_SERVICE.getOwnerWallet(token);
      return res.status(200).json({ success: true, data: wallet, error: null });
    } catch (error) {
      return next(error);
    }
  },
};
