import { WALLET_REPOSITORY } from './wallet.repository';
import type { CustomerWallet } from './wallet.types';

export const WALLET_SERVICE = {
  getCustomerWallet: async (token: string): Promise<CustomerWallet> =>
    await WALLET_REPOSITORY.getCustomerWallet(token),
};
