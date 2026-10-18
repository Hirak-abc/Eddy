export interface Business {
  _id: string;
  ownerId: string;
  name: string;
  category: string;
  address: string;
  qrToken: string;
  qrEnabled: boolean;
  verificationStatus: 'PENDING' | 'VERIFIED' | 'REJECTED';
  createdAt: string;
  updatedAt: string;
}

export interface RedeemableOffer {
  _id: string;
  businessId: string;
  ownerId: string;
  name: string;
  description?: string;
  coinsCost: number;
  settlementValuePaise: number;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ShopSummary {
  businessId: string;
  name: string;
  category: string;
  address: string;
}
