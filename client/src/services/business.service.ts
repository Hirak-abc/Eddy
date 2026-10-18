import { api } from './api';

export interface OwnerBusiness {
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

export const BUSINESS_PROFILE_UPDATED_EVENT = 'eddy-business-profile-updated';

export const notifyBusinessProfileUpdated = () => {
  window.dispatchEvent(new Event(BUSINESS_PROFILE_UPDATED_EVENT));
};

export const businessService = {
  getMine: () => api.get<OwnerBusiness | null>('/businesses/me'),
  create: (input: { name: string; category: string; address: string }) =>
    api.post<OwnerBusiness>('/businesses/me', input),
  update: (input: { name: string; category: string; address: string }) =>
    api.patch<OwnerBusiness>('/businesses/me', input),
  activateLegacyQr: () => api.post<OwnerBusiness>('/businesses/me/qr/activate-legacy'),
  disableQr: () => api.post<{ businessId: string; qrEnabled: false }>('/businesses/me/qr/disable'),
  getMyOffers: () => api.get<RedeemableOffer[]>('/businesses/me/offers'),
  getActiveShops: () => api.get<ShopSummary[]>('/businesses/active'),
  createOffer: (input: {
    name: string;
    description?: string;
    coinsCost: number;
    settlementValuePaise: number;
  }) => api.post<{ offerId: string }>('/businesses/me/offers', input),
  getOffers: (businessId: string) =>
    api.get<RedeemableOffer[]>(`/businesses/${encodeURIComponent(businessId)}/offers`),
};
