import { makeFunctionReference } from 'convex/server';
import type { GenericId } from 'convex/values';
import { createAuthenticatedConvexClient } from '../../integrations/convex/client';

export interface RedemptionRecord {
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

const requestRedemption = makeFunctionReference<
  'mutation',
  { offerId: GenericId<'redeemableOffers'>; idempotencyKey: string },
  { redemptionId: GenericId<'redemptions'>; reference: string; status: 'REQUESTED' | 'APPROVED' | 'REJECTED' | 'EXPIRED' | 'CANCELLED' | 'REFUNDED' | 'DISPUTED' }
>('redemptions:requestRedemption');
const reviewRedemption = makeFunctionReference<
  'mutation',
  { redemptionId: GenericId<'redemptions'>; decision: 'APPROVED' | 'REJECTED' },
  { redemptionId: GenericId<'redemptions'>; status: 'APPROVED' | 'REJECTED' | 'EXPIRED' }
>('redemptions:reviewRedemption');
const cancelRedemption = makeFunctionReference<
  'mutation',
  { redemptionId: GenericId<'redemptions'> },
  { redemptionId: GenericId<'redemptions'>; status: 'CANCELLED' }
>('redemptions:cancelRedemption');
const listCustomerRedemptions = makeFunctionReference<
  'query',
  Record<string, never>,
  RedemptionRecord[]
>('redemptions:listCustomerRedemptions');
const expirePendingRedemptions = makeFunctionReference<
  'mutation',
  Record<string, never>,
  number
>('redemptions:expirePendingRedemptions');
const listOwnerRedemptions = makeFunctionReference<
  'query',
  Record<string, never>,
  RedemptionRecord[]
>('redemptions:listOwnerRedemptions');

export const REDEMPTIONS_REPOSITORY = {
  request: (offerId: string, idempotencyKey: string, token: string) =>
    createAuthenticatedConvexClient(token).mutation(requestRedemption, {
      offerId: offerId as GenericId<'redeemableOffers'>,
      idempotencyKey,
    }),
  review: (redemptionId: string, decision: 'APPROVED' | 'REJECTED', token: string) =>
    createAuthenticatedConvexClient(token).mutation(reviewRedemption, {
      redemptionId: redemptionId as GenericId<'redemptions'>,
      decision,
    }),
  cancel: (redemptionId: string, token: string) =>
    createAuthenticatedConvexClient(token).mutation(cancelRedemption, {
      redemptionId: redemptionId as GenericId<'redemptions'>,
    }),
  listCustomer: async (token: string) => {
    const client = createAuthenticatedConvexClient(token);
    await client.mutation(expirePendingRedemptions, {});
    return await client.query(listCustomerRedemptions, {});
  },
  listOwner: async (token: string) => {
    const client = createAuthenticatedConvexClient(token);
    await client.mutation(expirePendingRedemptions, {});
    return await client.query(listOwnerRedemptions, {});
  },
};
