import { NextFunction, Request, Response } from "express";
import { COUPONS_SERVICE } from "./coupons.service";
import {
  approveCouponBodySchema,
  claimCouponBodySchema,
  couponIdParamsSchema,
} from "./coupons.schema";

export const COUPONS_CONTROLLER = {
  claim: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { code } = claimCouponBodySchema.parse(req.body);
      const coupon = await COUPONS_SERVICE.claim(req.user!.id, code);
      return res.status(201).json({ success: true, data: { coupon }, error: null });
    } catch (error) {
      return next(error);
    }
  },

  listMine: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const coupons = await COUPONS_SERVICE.listMine(req.user!.id);
      return res.status(200).json({ success: true, data: { coupons }, error: null });
    } catch (error) {
      return next(error);
    }
  },

  requestUse: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = couponIdParamsSchema.parse(req.params);
      await COUPONS_SERVICE.requestUse(id, req.user!.id);
      return res.status(200).json({
        success: true,
        data: { requested: true },
        error: null,
      });
    } catch (error) {
      return next(error);
    }
  },

  listOwnerRequests: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const requests = await COUPONS_SERVICE.listOwnerRequests(req.user!.id);
      return res.status(200).json({
        success: true,
        data: { requests },
        error: null,
      });
    } catch (error) {
      return next(error);
    }
  },

  approveRequest: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = couponIdParamsSchema.parse(req.params);
      const { billAmount } = approveCouponBodySchema.parse(req.body);
      const result = await COUPONS_SERVICE.approveRequest(
        id,
        req.user!.id,
        billAmount,
      );
      return res.status(200).json({
        success: true,
        data: { redemption: result },
        error: null,
      });
    } catch (error) {
      return next(error);
    }
  },

  rejectRequest: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = couponIdParamsSchema.parse(req.params);
      await COUPONS_SERVICE.rejectRequest(id, req.user!.id);
      return res.status(200).json({
        success: true,
        data: { rejected: true },
        error: null,
      });
    } catch (error) {
      return next(error);
    }
  },

  ownerBalance: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await COUPONS_SERVICE.ownerBalance(req.user!.id);
      return res.status(200).json({
        success: true,
        data: result,
        error: null,
      });
    } catch (error) {
      return next(error);
    }
  },
};
