import { makeFunctionReference } from "convex/server";
import { config } from "../../config/env";
import { convexClient } from "../../integrations/convex/client";
import type {
  ClaimedCoupon,
  CouponBalanceTransaction,
  CouponUseRequest,
} from "./coupons.types";

const claimCode = makeFunctionReference<
  "mutation",
  {
    codeHash: string;
    customerClerkId: string;
    customerName: string;
    serverSecret: string;
  },
  ClaimedCoupon
>("coupons:claimCode");
const listMine = makeFunctionReference<
  "query",
  { customerClerkId: string; serverSecret: string },
  ClaimedCoupon[]
>("coupons:listMine");
const requestUse = makeFunctionReference<
  "mutation",
  { id: string; customerClerkId: string; serverSecret: string },
  { id: string; status: "REQUESTED" }
>("coupons:requestUse");
const listOwnerRequests = makeFunctionReference<
  "query",
  { ownerClerkId: string; serverSecret: string },
  CouponUseRequest[]
>("coupons:listOwnerRequests");
const approveRequest = makeFunctionReference<
  "mutation",
  {
    id: string;
    ownerClerkId: string;
    billAmount: number;
    serverSecret: string;
  },
  { id: string; discountAmount: number; discountPercent: number }
>("coupons:approveRequest");
const rejectRequest = makeFunctionReference<
  "mutation",
  { id: string; ownerClerkId: string; serverSecret: string },
  { id: string; status: "REJECTED" }
>("coupons:rejectRequest");
const ownerBalance = makeFunctionReference<
  "query",
  { ownerClerkId: string; serverSecret: string },
  { balance: number; transactions: CouponBalanceTransaction[] }
>("coupons:ownerBalance");

const serverSecret = (): string => {
  if (!config.EDDY_CONVEX_SECRET) {
    const error = new Error("EDDY_CONVEX_SECRET is not configured.");
    Object.assign(error, {
      statusCode: 503,
      code: "CONVEX_SERVER_SECRET_NOT_CONFIGURED",
    });
    throw error;
  }
  return config.EDDY_CONVEX_SECRET;
};

const requireConvex = () => {
  if (!convexClient) {
    const error = new Error("Convex is not configured.");
    Object.assign(error, { statusCode: 503, code: "CONVEX_NOT_CONFIGURED" });
    throw error;
  }
  serverSecret();
  return convexClient;
};

export const COUPONS_REPOSITORY = {
  claimCode: async (input: {
    codeHash: string;
    customerClerkId: string;
    customerName: string;
  }): Promise<ClaimedCoupon> =>
    requireConvex().mutation(claimCode, {
      ...input,
      serverSecret: serverSecret(),
    }),

  listMine: async (customerClerkId: string): Promise<ClaimedCoupon[]> =>
    requireConvex().query(listMine, { customerClerkId, serverSecret: serverSecret() }),

  requestUse: async (
    id: string,
    customerClerkId: string,
  ): Promise<void> => {
    await requireConvex().mutation(requestUse, {
      id,
      customerClerkId,
      serverSecret: serverSecret(),
    });
  },

  listOwnerRequests: async (
    ownerClerkId: string,
  ): Promise<CouponUseRequest[]> =>
    requireConvex().query(listOwnerRequests, {
      ownerClerkId,
      serverSecret: serverSecret(),
    }),

  approveRequest: async (
    id: string,
    ownerClerkId: string,
    billAmount: number,
  ): Promise<{ id: string; discountAmount: number; discountPercent: number }> =>
    requireConvex().mutation(approveRequest, {
      id,
      ownerClerkId,
      billAmount,
      serverSecret: serverSecret(),
    }),

  rejectRequest: async (id: string, ownerClerkId: string): Promise<void> => {
    await requireConvex().mutation(rejectRequest, {
      id,
      ownerClerkId,
      serverSecret: serverSecret(),
    });
  },

  ownerBalance: async (
    ownerClerkId: string,
  ): Promise<{ balance: number; transactions: CouponBalanceTransaction[] }> =>
    requireConvex().query(ownerBalance, {
      ownerClerkId,
      serverSecret: serverSecret(),
    }),
};
