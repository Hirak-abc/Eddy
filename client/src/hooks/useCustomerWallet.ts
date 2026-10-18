import { useCallback, useEffect, useState } from 'react';
import {
  WALLET_UPDATED_EVENT,
  walletService,
  type CustomerWallet,
} from '@/services/wallet.service';

export const useCustomerWallet = () => {
  const [wallet, setWallet] = useState<CustomerWallet | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    const response = await walletService.getCustomerWallet();
    if (response.success && response.data) {
      setWallet(response.data);
      setError(null);
    } else {
      setWallet(null);
      setError(response.error?.message ?? 'Could not load your wallet.');
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    const refreshAfterWalletUpdate = () => {
      void refresh();
    };
    void refresh();
    window.addEventListener(WALLET_UPDATED_EVENT, refreshAfterWalletUpdate);
    return () => window.removeEventListener(WALLET_UPDATED_EVENT, refreshAfterWalletUpdate);
  }, [refresh]);

  return { wallet, isLoading, error, refresh };
};
