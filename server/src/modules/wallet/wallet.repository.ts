import { makeFunctionReference } from 'convex/server';
import { createAuthenticatedConvexClient } from '../../integrations/convex/client';
import type { CustomerWallet } from './wallet.types';

const getCustomerWallet = makeFunctionReference<
  'query',
  Record<string, never>,
  CustomerWallet
>('wallets:getCustomerWallet');
const getOwnerWallet = makeFunctionReference<
  'query',
  Record<string, never>,
  OwnerWallet
>('wallets:getOwnerWallet');

export interface OwnerWallet {
  balancePaise: number;
  lifetimeCreditsPaise: number;
  approvedRedemptionsCount: number;
  transactions: Array<{
    _id: string;
    redemptionId: string;
    reference: string;
    amountPaise: number;
    type: string;
    createdAt: string;
  }>;
}

export const WALLET_REPOSITORY = {
  getCustomerWallet: (token: string): Promise<CustomerWallet> =>
    createAuthenticatedConvexClient(token).query(getCustomerWallet, {}),
  getOwnerWallet: (token: string): Promise<OwnerWallet> =>
    createAuthenticatedConvexClient(token).query(getOwnerWallet, {}),
};
