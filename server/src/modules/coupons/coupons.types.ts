export interface ClaimedCoupon {
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
