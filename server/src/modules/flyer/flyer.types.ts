export type FlyerKind = "AUTOMATIC" | "CUSTOM";
export type FlyerLanguage = "HINDI" | "ENGLISH" | "HINGLISH";
export type FlyerStatus =
  | "QUEUED"
  | "GENERATING"
  | "READY"
  | "SCHEDULED"
  | "PUBLISHED"
  | "FAILED";
export type CouponRequestStatus =
  | "CLAIMED"
  | "REQUESTED"
  | "REJECTED"
  | "APPROVED";

export interface FlyerRecord {
  id: string;
  ownerClerkId: string;
  businessId: string;
  businessName: string;
  businessCategory: string;
  businessLocation: string;
  kind: FlyerKind;
  status: FlyerStatus;
  title: string;
  topic: string;
  language: FlyerLanguage;
  sourceImageUrl: string;
  imageUrl?: string;
  caption?: string;
  hashtags: string[];
  couponDiscountPercent?: number;
  couponExpiresAt?: string;
  couponClaimedBy?: string;
  couponClaimedByName?: string;
  couponClaimedAt?: string;
  couponRequestStatus?: CouponRequestStatus;
  couponRequestedAt?: string;
  couponBillAmount?: number;
  couponDiscountAmount?: number;
  scheduledAt?: string;
  socialPostId?: string;
  errorMessage?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateFlyerInput {
  ownerClerkId: string;
  businessId: string;
  businessName: string;
  businessCategory: string;
  businessLocation: string;
  kind: FlyerKind;
  title: string;
  topic: string;
  language: FlyerLanguage;
  sourceImageUrl: string;
}
