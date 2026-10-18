import { api } from "./api";

export interface CustomerCoupon {
  id: string;
  businessId: string;
  businessName: string;
  title: string;
  discountPercent?: number;
  expiresAt?: string;
  status?: "CLAIMED" | "REQUESTED" | "REJECTED";
}

export interface CouponUseRequest {
  id: string;
  businessId: string;
  businessName: string;
  title: string;
  customerClerkId?: string;
  customerName?: string;
  discountPercent?: number;
  requestedAt?: string;
}

export interface CouponBalanceTransaction {
  id: string;
  customerClerkId: string;
  flyerId: string;
  billAmount: number;
  discountPercent: number;
  discountAmount: number;
  createdAt: string;
}

export const couponService = {
  claim: (code: string) =>
    api.post<{ coupon: CustomerCoupon }>("/coupons/claim", { code }),

  listMine: () =>
    api.get<{ coupons: CustomerCoupon[] }>("/coupons/mine"),

  requestUse: (id: string) =>
    api.post<{ requested: boolean }>(`/coupons/${id}/request`),

  listOwnerRequests: () =>
    api.get<{ requests: CouponUseRequest[] }>("/coupons/owner/requests"),

  approve: (id: string, billAmount: number) =>
    api.patch<{
      redemption: {
        id: string;
        discountAmount: number;
        discountPercent: number;
      };
    }>(`/coupons/owner/requests/${id}/approve`, { billAmount }),

  reject: (id: string) =>
    api.patch<{ rejected: boolean }>(`/coupons/owner/requests/${id}/reject`),

  balance: () =>
    api.get<{
      balance: number;
      transactions: CouponBalanceTransaction[];
    }>("/coupons/owner/balance"),
};
