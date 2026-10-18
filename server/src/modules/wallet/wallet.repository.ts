import { makeFunctionReference } from 'convex/server';
import { createAuthenticatedConvexClient } from '../../integrations/convex/client';
import type { CustomerWallet } from './wallet.types';

const getCustomerWallet = makeFunctionReference<
  'query',
  Record<string, never>,
  CustomerWallet
>('wallets:getCustomerWallet');

export const WALLET_REPOSITORY = {
  getCustomerWallet: (token: string): Promise<CustomerWallet> =>
    createAuthenticatedConvexClient(token).query(getCustomerWallet, {}),
};
