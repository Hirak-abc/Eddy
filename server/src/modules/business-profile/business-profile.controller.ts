import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { BUSINESS_PROFILE_SERVICE } from './business-profile.service';

const imageSlotSchema = z.enum(['shop', 'product', 'item']);

const parseImageSlot = (value: unknown, res: Response) => {
  const result = imageSlotSchema.safeParse(value);
  if (!result.success) {
    res.status(400).json({
      success: false,
      data: null,
      error: { code: 'INVALID_IMAGE_SLOT', message: 'Choose a valid business image slot.' },
    });
    return null;
  }
  return result.data;
};

export const BUSINESS_PROFILE_CONTROLLER = {
  listImages: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const images = await BUSINESS_PROFILE_SERVICE.listImages(req.user!.id);
      return res.status(200).json({ success: true, data: { images }, error: null });
    } catch (error) {
      return next(error);
    }
  },

  saveImage: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const slot = parseImageSlot(req.params.slot, res);
      if (!slot) return;
      if (!Buffer.isBuffer(req.body)) {
        return res.status(400).json({
          success: false,
          data: null,
          error: { code: 'INVALID_IMAGE', message: 'An image file is required.' },
        });
      }
      const image = await BUSINESS_PROFILE_SERVICE.saveImage(
        req.user!.id,
        slot,
        req.body,
        req.header('x-image-content-type'),
      );
      return res.status(200).json({ success: true, data: { image }, error: null });
    } catch (error) {
      return next(error);
    }
  },

  deleteImage: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const slot = parseImageSlot(req.params.slot, res);
      if (!slot) return;
      await BUSINESS_PROFILE_SERVICE.deleteImage(req.user!.id, slot);
      return res.status(200).json({ success: true, data: null, error: null });
    } catch (error) {
      return next(error);
    }
  },
};
