import { Request, Response, NextFunction } from 'express';
import { QR_SERVICE } from './qr.service';
import { scanQrSchema } from './qr.schema';

export const QR_CONTROLLER = {
  scan: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.authToken;
      if (!token) {
        return res.status(401).json({
          success: false,
          data: null,
          error: { code: 'UNAUTHORIZED', message: 'Authentication required' },
        });
      }
      const parsed = scanQrSchema.parse(req.body);

      const result = await QR_SERVICE.scanShopQr(parsed.qrToken, token);

      res.status(200).json({
        success: true,
        data: result,
        error: null,
      });
    } catch (error: unknown) {
      if (error instanceof Error && 'code' in error) {
        return res.status(400).json({
          success: false,
          data: null,
          error: {
            code: String(error.code),
            message: error.message,
          },
        });
      }
      next(error);
    }
  },

  status: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.authToken;
      if (!token) {
        return res.status(401).json({
          success: false,
          data: null,
          error: { code: 'UNAUTHORIZED', message: 'Authentication required' },
        });
      }
      const result = await QR_SERVICE.getScanStatus(token);

      res.status(200).json({
        success: true,
        data: result,
        error: null,
      });
    } catch (error) {
      next(error);
    }
  },

  ownerToday: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.authToken;
      if (!token) {
        return res.status(401).json({
          success: false,
          data: null,
          error: { code: 'UNAUTHORIZED', message: 'Authentication required' },
        });
      }
      const result = await QR_SERVICE.getOwnerScansCountToday(token);
      return res.status(200).json({ success: true, data: result, error: null });
    } catch (error) {
      return next(error);
    }
  },

  ownerRepeatRate: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.authToken;
      if (!token) {
        return res.status(401).json({
          success: false,
          data: null,
          error: { code: 'UNAUTHORIZED', message: 'Authentication required' },
        });
      }
      const result = await QR_SERVICE.getOwnerRepeatRate(token);
      return res.status(200).json({ success: true, data: result, error: null });
    } catch (error) {
      return next(error);
    }
  },

  resolve: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await QR_SERVICE.resolveQr(req.params.qrToken);
      if (!result) {
        return res.status(404).json({
          success: false,
          data: null,
          error: { code: 'INVALID_QR', message: 'This QR code is invalid or disabled.' },
        });
      }
      return res.status(200).json({ success: true, data: result, error: null });
    } catch (error) {
      return next(error);
    }
  },
};
