import { makeFunctionReference } from 'convex/server';
import { createAuthenticatedConvexClient } from '../../integrations/convex/client';
import type { Business, RedeemableOffer, ShopSummary } from './business.types';

const getOwnedBusiness = makeFunctionReference<'query', Record<string, never>, Business | null>(
  'businesses:getOwnedBusiness',
);
const createOwnedBusiness = makeFunctionReference<
  'mutation',
  {
    name: string;
    category: string;
    address: string;
    qrToken: string;
    timestamp: string;
  },
  Business
>('businesses:createOwnedBusiness');
const disableOwnedQr = makeFunctionReference<
  'mutation',
  { timestamp: string },
  { businessId: string; qrEnabled: boolean }
>('businesses:disableOwnedQr');
const activateLegacyOwnedQr = makeFunctionReference<
  'mutation',
  { timestamp: string },
  Business
>('businesses:activateLegacyOwnedQr');
const createOffer = makeFunctionReference<
  'mutation',
  {
    name: string;
    description?: string;
    coinsCost: number;
    settlementValuePaise: number;
    timestamp: string;
  },
  { offerId: string }
>('businesses:createOffer');
const listBusinessOffers = makeFunctionReference<
  'query',
  { businessId: string },
  RedeemableOffer[]
>('businesses:listBusinessOffers');
const listOwnedOffers = makeFunctionReference<
  'query',
  Record<string, never>,
  RedeemableOffer[]
>('businesses:listOwnedOffers');
const listActiveBusinesses = makeFunctionReference<
  'query',
  Record<string, never>,
  ShopSummary[]
>('businesses:listActiveBusinesses');

export const BUSINESS_REPOSITORY = {
  getOwnedBusiness: (token: string) =>
    createAuthenticatedConvexClient(token).query(getOwnedBusiness, {}),
  createOwnedBusiness: (args: {
    name: string;
    category: string;
    address: string;
    qrToken: string;
  }, token: string) =>
    createAuthenticatedConvexClient(token).mutation(createOwnedBusiness, {
      ...args,
      timestamp: new Date().toISOString(),
    }),
  disableOwnedQr: (token: string) =>
    createAuthenticatedConvexClient(token).mutation(disableOwnedQr, {
      timestamp: new Date().toISOString(),
    }),
  activateLegacyOwnedQr: (token: string) =>
    createAuthenticatedConvexClient(token).mutation(activateLegacyOwnedQr, {
      timestamp: new Date().toISOString(),
    }),
  createOffer: (args: {
    name: string;
    description?: string;
    coinsCost: number;
    settlementValuePaise: number;
  }, token: string) =>
    createAuthenticatedConvexClient(token).mutation(createOffer, {
      ...args,
      timestamp: new Date().toISOString(),
    }),
  listBusinessOffers: (businessId: string, token: string) =>
    createAuthenticatedConvexClient(token).query(listBusinessOffers, { businessId }),
  listOwnedOffers: (token: string) =>
    createAuthenticatedConvexClient(token).query(listOwnedOffers, {}),
  listActiveBusinesses: (token: string) =>
    createAuthenticatedConvexClient(token).query(listActiveBusinesses, {}),
};
