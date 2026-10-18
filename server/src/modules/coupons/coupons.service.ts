import { createHash } from "crypto";
import { AppError } from "../../utils/errors";
import { clerkClient } from "../../integrations/clerk/client";
import { COUPONS_REPOSITORY } from "./coupons.repository";

const knownCouponErrors: Record<string, { message: string; status: number }> = {
  COUPON_CODE_INVALID: { message: "That flyer code is invalid.", status: 404 },
  COUPON_EXPIRED: { message: "This flyer coupon has expired.", status: 410 },
  COUPON_ALREADY_CLAIMED: {
    message: "This flyer code has already been claimed.",
    status: 409,
  },
  CUSTOMER_COUPON_NOT_FOUND: {
    message: "This coupon does not belong to your account.",
    status: 404,
  },
  COUPON_REQUEST_NOT_ALLOWED: {
    message: "This coupon cannot be requested in its current state.",
    status: 409,
  },
  OWNER_COUPON_REQUEST_NOT_FOUND: {
    message: "Coupon request not found for this shop.",
    status: 404,
  },
  COUPON_REQUEST_NOT_PENDING: {
    message: "This coupon request has already been processed.",
    status: 409,
  },
  INVALID_BILL_AMOUNT: {
    message: "Enter a total purchase amount greater than zero.",
    status: 400,
  },
};

const mapCouponError = (error: unknown): never => {
  const message = error instanceof Error ? error.message : "";
  const matchedCode = Object.keys(knownCouponErrors).find((code) =>
    message.includes(code),
  );
  if (!matchedCode) throw error;
  const details = knownCouponErrors[matchedCode];
  throw new AppError(matchedCode, details.message, details.status);
};

const normalizeCode = (code: string): string =>
  code.toUpperCase().replace(/[\s-]/g, "");

export const COUPONS_SERVICE = {
  claim: async (customerClerkId: string, enteredCode: string) => {
    const code = normalizeCode(enteredCode);
    if (!/^[A-Z0-9]{8}$/.test(code)) {
      throw new AppError(
        "COUPON_CODE_INVALID",
        "Enter the eight-character code shown on the flyer.",
        400,
      );
    }
    if (!clerkClient) {
      throw new AppError(
        "CLERK_NOT_CONFIGURED",
        "Customer profile lookup is unavailable.",
        503,
      );
    }
    const customer = await clerkClient.users.getUser(customerClerkId);
    const customerName =
      customer.username ||
      [customer.firstName, customer.lastName].filter(Boolean).join(" ") ||
      `Customer ${customerClerkId.slice(-6)}`;
    try {
      return await COUPONS_REPOSITORY.claimCode({
        codeHash: createHash("sha256").update(code).digest("hex"),
        customerClerkId,
        customerName,
      });
    } catch (error) {
      return mapCouponError(error);
    }
  },

  listMine: (customerClerkId: string) =>
    COUPONS_REPOSITORY.listMine(customerClerkId),

  requestUse: async (id: string, customerClerkId: string): Promise<void> => {
    try {
      await COUPONS_REPOSITORY.requestUse(id, customerClerkId);
    } catch (error) {
      return mapCouponError(error);
    }
  },

  listOwnerRequests: (ownerClerkId: string) =>
    COUPONS_REPOSITORY.listOwnerRequests(ownerClerkId),

  approveRequest: async (
    id: string,
    ownerClerkId: string,
    billAmount: number,
  ) => {
    try {
      return await COUPONS_REPOSITORY.approveRequest(
        id,
        ownerClerkId,
        billAmount,
      );
    } catch (error) {
      return mapCouponError(error);
    }
  },

  rejectRequest: async (id: string, ownerClerkId: string): Promise<void> => {
    try {
      await COUPONS_REPOSITORY.rejectRequest(id, ownerClerkId);
    } catch (error) {
      return mapCouponError(error);
    }
  },

  ownerBalance: (ownerClerkId: string) =>
    COUPONS_REPOSITORY.ownerBalance(ownerClerkId),
};
