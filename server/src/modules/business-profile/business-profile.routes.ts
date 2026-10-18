import { Router } from 'express';
import express from 'express';
import { authenticate, authorize } from '../../middleware/auth.middleware';
import { BUSINESS_PROFILE_CONTROLLER } from './business-profile.controller';

const router = Router();
const ownerOnly = [authenticate, authorize(['OWNER'])];

router.get('/images', ...ownerOnly, BUSINESS_PROFILE_CONTROLLER.listImages);
router.put(
  '/images/:slot',
  ...ownerOnly,
  express.raw({ type: 'application/octet-stream', limit: '10mb' }),
  BUSINESS_PROFILE_CONTROLLER.saveImage,
);
router.delete('/images/:slot', ...ownerOnly, BUSINESS_PROFILE_CONTROLLER.deleteImage);

export default router;
