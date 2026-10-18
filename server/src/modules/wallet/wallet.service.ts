import { WALLET_REPOSITORY } from './wallet.repository';
import type { CustomerWallet } from './wallet.types';
import type { OwnerWallet } from './wallet.repository';

export const WALLET_SERVICE = {
  getCustomerWallet: async (token: string): Promise<CustomerWallet> =>
    await WALLET_REPOSITORY.getCustomerWallet(token),
  getOwnerWallet: async (token: string): Promise<OwnerWallet> =>
    await WALLET_REPOSITORY.getOwnerWallet(token),
};
