import { api } from './api';

export interface Redemption {
  _id: string;
  reference: string;
  customerId: string;
  businessId: string;
  ownerId: string;
  offerId: string;
  offerName: string;
  coinsCost: number;
  settlementValuePaise: number;
  status: 'REQUESTED' | 'APPROVED' | 'REJECTED' | 'EXPIRED' | 'CANCELLED' | 'REFUNDED' | 'DISPUTED';
  requestedAt: string;
  reviewedAt?: string;
  expiresAt: string;
}

export const redemptionService = {
  request: (offerId: string, idempotencyKey: string) =>
    api.post<{ redemptionId: string; reference: string; status: Redemption['status'] }>('/redemptions', {
      offerId,
      idempotencyKey,
    }),
  cancel: (redemptionId: string) =>
    api.post<{ redemptionId: string; status: string }>(`/redemptions/${encodeURIComponent(redemptionId)}/cancel`),
  review: (redemptionId: string, decision: 'APPROVED' | 'REJECTED') =>
    api.post<{ redemptionId: string; status: string }>(
      `/redemptions/${encodeURIComponent(redemptionId)}/review`,
      { decision },
    ),
  listMine: () => api.get<Redemption[]>('/redemptions/mine'),
  listOwner: () => api.get<Redemption[]>('/redemptions/owner'),
};
