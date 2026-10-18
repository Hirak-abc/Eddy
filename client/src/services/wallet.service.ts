import { api } from './api';

export interface WalletTransaction {
  id: string;
  businessId: string;
  amount: number;
  type: string;
  createdAt: string;
}

export interface CustomerWallet {
  balance: number;
  availableBalance: number;
  reservedBalance: number;
  spentBalance: number;
  transactions: WalletTransaction[];
}

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

export const WALLET_UPDATED_EVENT = 'eddy-wallet-updated';

export const notifyWalletUpdated = () => {
  window.dispatchEvent(new Event(WALLET_UPDATED_EVENT));
};

export const walletService = {
  getCustomerWallet: async () => api.get<CustomerWallet>('/wallet'),
  getOwnerWallet: async () => api.get<OwnerWallet>('/wallet/owner'),
};
