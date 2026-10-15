import { Request, Response, NextFunction } from 'express';
import { QR_SERVICE } from './qr.service';
import { scanQrSchema } from './qr.schema';

export const QR_CONTROLLER = {
  scan: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const customerId = (req as any).auth?.userId || req.body.customerId || 'sample-customer-id';
      const parsed = scanQrSchema.parse(req.body);

      const result = await QR_SERVICE.scanShopQr(customerId, parsed.businessId);

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

  status: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const customerId = (req as any).auth?.userId || req.query.customerId || 'sample-customer-id';
      const result = await QR_SERVICE.getScanStatus(customerId as string);

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
