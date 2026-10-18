import { NextFunction, Request, Response } from "express";
import {
  automaticFlyerBodySchema,
  customFlyerBodySchema,
  flyerIdParamsSchema,
  scheduleFlyerBodySchema,
} from "./flyer.schema";
import { FLYER_SERVICE } from "./flyer.service";

export const FLYER_CONTROLLER = {
  list: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const flyers = await FLYER_SERVICE.listByOwner(req.user!.id);
      return res.status(200).json({ success: true, data: { flyers }, error: null });
    } catch (error) {
      return next(error);
    }
  },

  createAutomatic: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const body = automaticFlyerBodySchema.parse(req.body);
      const flyer = await FLYER_SERVICE.queueAutomatic(req.user!.id, body);
      return res.status(202).json({ success: true, data: { flyer }, error: null });
    } catch (error) {
      return next(error);
    }
  },

  createCustom: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const body = customFlyerBodySchema.parse(req.body);
      const flyer = await FLYER_SERVICE.queueCustom(req.user!.id, body);
      return res.status(202).json({ success: true, data: { flyer }, error: null });
    } catch (error) {
      return next(error);
    }
  },

  uploadImage: async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!Buffer.isBuffer(req.body)) {
        return res.status(400).json({
          success: false,
          data: null,
          error: { code: "INVALID_IMAGE", message: "An image file is required." },
        });
      }
      const image = await FLYER_SERVICE.uploadImage(req.body);
      return res.status(201).json({ success: true, data: { image }, error: null });
    } catch (error) {
      return next(error);
    }
  },

  schedule: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = flyerIdParamsSchema.parse(req.params);
      const { scheduledAt } = scheduleFlyerBodySchema.parse(req.body);
      const post = await FLYER_SERVICE.scheduleCustom(
        req.user!.id,
        id,
        scheduledAt,
      );
      return res.status(200).json({ success: true, data: { post }, error: null });
    } catch (error) {
      return next(error);
    }
  },

  publishNow: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = flyerIdParamsSchema.parse(req.params);
      const post = await FLYER_SERVICE.publishCustomNow(req.user!.id, id);
      const success = post.status === "PUBLISHED";
      return res.status(success ? 200 : 502).json({
        success,
        data: { post },
        error: success
          ? null
          : {
              code: post.errorCode || "PUBLISH_FAILED",
              message: post.errorMessage || "Publishing failed.",
            },
      });
    } catch (error) {
      return next(error);
    }
  },
};
