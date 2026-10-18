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
