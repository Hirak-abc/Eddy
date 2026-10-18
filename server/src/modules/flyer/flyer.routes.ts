import { Router } from "express";
import express from "express";
import { authenticate, authorize } from "../../middleware/auth.middleware";
import { FLYER_CONTROLLER } from "./flyer.controller";

const router = Router();
const ownerOnly = [authenticate, authorize(["OWNER"])];

router.get("/", ...ownerOnly, FLYER_CONTROLLER.list);
router.post("/automatic", ...ownerOnly, FLYER_CONTROLLER.createAutomatic);
router.post("/generate", ...ownerOnly, FLYER_CONTROLLER.createCustom);
router.post(
  "/images",
  ...ownerOnly,
  express.raw({ type: "application/octet-stream", limit: "10mb" }),
  FLYER_CONTROLLER.uploadImage,
);
router.post("/:id/schedule", ...ownerOnly, FLYER_CONTROLLER.schedule);
router.post("/:id/publish", ...ownerOnly, FLYER_CONTROLLER.publishNow);

export default router;
