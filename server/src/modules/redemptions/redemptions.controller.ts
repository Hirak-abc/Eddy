import { Request, Response, NextFunction } from 'express';
import { REDEMPTIONS_REPOSITORY } from './redemptions.repository';
import { redemptionIdSchema, requestRedemptionSchema, reviewRedemptionSchema } from './redemptions.schema';

const respondError = (error: unknown, res: Response, next: NextFunction) => {
  if (error instanceof Error) {
    const codes = [
      'REWARD_NOT_AVAILABLE',
      'INSUFFICIENT_COINS',
      'INVALID_REDEMPTION_COST',
      'REDEMPTION_ALREADY_REVIEWED',
      'REDEMPTION_CANNOT_BE_CANCELLED',
      'REDEMPTION_NOT_FOUND',
      'FORBIDDEN',
    ];
    const code = codes.find((candidate) => error.message.includes(candidate));
    if (code) {
      const status = code === 'FORBIDDEN' ? 403 : code === 'INSUFFICIENT_COINS' ? 409 : 400;
      return res.status(status).json({
        success: false,
        data: null,
        error: { code, message: code.replace(/_/g, ' ').toLowerCase() },
      });
    }
  }
  return next(error);
};

export const REDEMPTIONS_CONTROLLER = {
  request: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const input = requestRedemptionSchema.parse(req.body);
      const result = await REDEMPTIONS_REPOSITORY.request(
        input.offerId,
        input.idempotencyKey,
        req.authToken!,
      );
      return res.status(201).json({ success: true, data: result, error: null });
    } catch (error) {
      return respondError(error, res, next);
    }
  },

  review: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { redemptionId } = redemptionIdSchema.parse(req.params);
      const { decision } = reviewRedemptionSchema.parse(req.body);
      const result = await REDEMPTIONS_REPOSITORY.review(redemptionId, decision, req.authToken!);
      return res.status(200).json({ success: true, data: result, error: null });
    } catch (error) {
      return respondError(error, res, next);
    }
  },

  cancel: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { redemptionId } = redemptionIdSchema.parse(req.params);
      const result = await REDEMPTIONS_REPOSITORY.cancel(redemptionId, req.authToken!);
      return res.status(200).json({ success: true, data: result, error: null });
    } catch (error) {
      return respondError(error, res, next);
    }
  },

  listCustomer: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await REDEMPTIONS_REPOSITORY.listCustomer(req.authToken!);
      return res.status(200).json({ success: true, data, error: null });
    } catch (error) {
      return next(error);
    }
  },

  listOwner: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await REDEMPTIONS_REPOSITORY.listOwner(req.authToken!);
      return res.status(200).json({ success: true, data, error: null });
    } catch (error) {
      return next(error);
    }
  },
};
