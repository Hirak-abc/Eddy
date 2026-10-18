import { randomBytes } from 'node:crypto';
import { BUSINESS_REPOSITORY } from './business.repository';

export const BUSINESS_SERVICE = {
  getOwnedBusiness: (token: string) => BUSINESS_REPOSITORY.getOwnedBusiness(token),

  createOwnedBusiness: async (
    input: { name: string; category: string; address: string },
    token: string,
  ) => {
    const existing = await BUSINESS_REPOSITORY.getOwnedBusiness(token);
    if (existing) {
      throw Object.assign(new Error('This owner already has a shop profile.'), {
        code: 'BUSINESS_ALREADY_EXISTS',
      });
    }
    const qrToken = randomBytes(32).toString('base64url');
    return BUSINESS_REPOSITORY.createOwnedBusiness({ ...input, qrToken }, token);
  },

  updateOwnedBusiness: (input: { name: string; category: string; address: string }, token: string) =>
    BUSINESS_REPOSITORY.updateOwnedBusiness(input, token),

  activateLegacyOwnedQr: (token: string) =>
    BUSINESS_REPOSITORY.activateLegacyOwnedQr(token),
  disableOwnedQr: (token: string) => BUSINESS_REPOSITORY.disableOwnedQr(token),
  createOffer: (input: {
    name: string;
    description?: string;
    coinsCost: number;
    settlementValuePaise: number;
  }, token: string) => BUSINESS_REPOSITORY.createOffer(input, token),
  listBusinessOffers: (businessId: string, token: string) =>
    BUSINESS_REPOSITORY.listBusinessOffers(businessId, token),
  listOwnedOffers: (token: string) => BUSINESS_REPOSITORY.listOwnedOffers(token),
  listActiveBusinesses: (token: string) => BUSINESS_REPOSITORY.listActiveBusinesses(token),
};
