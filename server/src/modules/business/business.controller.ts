import { Request, Response, NextFunction } from 'express';
import { BUSINESS_SERVICE } from './business.service';
import {
  createBusinessSchema,
  createRedeemableOfferSchema,
} from './business.schema';

const respondError = (error: unknown, res: Response, next: NextFunction) => {
  if (error instanceof Error && 'code' in error) {
    const code = String(error.code);
    return res.status(code === 'BUSINESS_ALREADY_EXISTS' ? 409 : 400).json({
      success: false,
      data: null,
      error: { code, message: error.message },
    });
  }
  return next(error);
};

export const BUSINESS_CONTROLLER = {
  getOwnedBusiness: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const business = await BUSINESS_SERVICE.getOwnedBusiness(req.authToken!);
      return res.status(200).json({ success: true, data: business, error: null });
    } catch (error) {
      return next(error);
    }
  },

  createOwnedBusiness: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const input = createBusinessSchema.parse(req.body);
      const business = await BUSINESS_SERVICE.createOwnedBusiness(input, req.authToken!);
      return res.status(201).json({ success: true, data: business, error: null });
    } catch (error) {
      return respondError(error, res, next);
    }
  },

  disableOwnedQr: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await BUSINESS_SERVICE.disableOwnedQr(req.authToken!);
      return res.status(200).json({ success: true, data: result, error: null });
    } catch (error) {
      return next(error);
    }
  },

  activateLegacyOwnedQr: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await BUSINESS_SERVICE.activateLegacyOwnedQr(req.authToken!);
      return res.status(200).json({ success: true, data: result, error: null });
    } catch (error) {
      return respondError(error, res, next);
    }
  },

  createOffer: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const input = createRedeemableOfferSchema.parse(req.body);
      const offer = await BUSINESS_SERVICE.createOffer(input, req.authToken!);
      return res.status(201).json({ success: true, data: offer, error: null });
    } catch (error) {
      return respondError(error, res, next);
    }
  },

  listBusinessOffers: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const offers = await BUSINESS_SERVICE.listBusinessOffers(req.params.businessId, req.authToken!);
      return res.status(200).json({ success: true, data: offers, error: null });
    } catch (error) {
      return next(error);
    }
  },

  listOwnedOffers: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const offers = await BUSINESS_SERVICE.listOwnedOffers(req.authToken!);
      return res.status(200).json({ success: true, data: offers, error: null });
    } catch (error) {
      return next(error);
    }
  },

  listActiveBusinesses: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const businesses = await BUSINESS_SERVICE.listActiveBusinesses(req.authToken!);
      return res.status(200).json({ success: true, data: businesses, error: null });
    } catch (error) {
      return next(error);
    }
  },
};
