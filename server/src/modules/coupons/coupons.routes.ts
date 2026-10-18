import { Router } from "express";
import { authenticate, authorize } from "../../middleware/auth.middleware";
import { COUPONS_CONTROLLER } from "./coupons.controller";

const router = Router();
const customerOnly = [authenticate, authorize(["CUSTOMER"])];
const ownerOnly = [authenticate, authorize(["OWNER"])];

router.post("/claim", ...customerOnly, COUPONS_CONTROLLER.claim);
router.get("/mine", ...customerOnly, COUPONS_CONTROLLER.listMine);
router.post("/:id/request", ...customerOnly, COUPONS_CONTROLLER.requestUse);

router.get("/owner/requests", ...ownerOnly, COUPONS_CONTROLLER.listOwnerRequests);
router.get("/owner/balance", ...ownerOnly, COUPONS_CONTROLLER.ownerBalance);
router.patch(
  "/owner/requests/:id/approve",
  ...ownerOnly,
  COUPONS_CONTROLLER.approveRequest,
);
router.patch(
  "/owner/requests/:id/reject",
  ...ownerOnly,
  COUPONS_CONTROLLER.rejectRequest,
);

export default router;
