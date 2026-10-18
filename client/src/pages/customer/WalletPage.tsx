import { useCallback, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Coins, IndianRupee, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useCustomerWallet } from '@/hooks/useCustomerWallet';
import { MAX_WALLET_COINS, MIN_REDEMPTION_COINS } from '@/lib/constants';
import { businessService, type ShopSummary } from '@/services/business.service';
import { redemptionService, type Redemption } from '@/services/redemption.service';
import { notifyWalletUpdated } from '@/services/wallet.service';

export const CustomerWalletPage = () => {
  const { wallet, isLoading, error, refresh } = useCustomerWallet();
  const [shops, setShops] = useState<ShopSummary[]>([]);
  const [selectedShopId, setSelectedShopId] = useState('');
  const [coinsToRedeem, setCoinsToRedeem] = useState(String(MIN_REDEMPTION_COINS));
  const [submitting, setSubmitting] = useState(false);
  const [redemptions, setRedemptions] = useState<Redemption[]>([]);
  const [loadingRewards, setLoadingRewards] = useState(true);
  const [refreshingShops, setRefreshingShops] = useState(false);
  const [shopError, setShopError] = useState<string | null>(null);
  const [historyError, setHistoryError] = useState<string | null>(null);
  const requestKeys = useRef<Record<string, string>>({});
  const balance = wallet?.availableBalance ?? wallet?.balance ?? 0;

  const refreshShops = useCallback(async (showFeedback = false) => {
    setRefreshingShops(true);
    const response = await businessService.getActiveShops();
    if (!response.success) {
      const message = response.error?.message ?? 'Active shops could not be loaded.';
      setShopError(message);
      if (showFeedback) toast.error(message);
      setRefreshingShops(false);
      return;
    }

    const activeShops = response.data ?? [];
    setShops(activeShops);
    setSelectedShopId((current) =>
      activeShops.some((shop) => shop.businessId === current)
        ? current
        : activeShops[0]?.businessId ?? '',
    );
    setShopError(null);
    if (showFeedback) {
      toast.success(`${activeShops.length} active shop${activeShops.length === 1 ? '' : 's'} loaded.`);
    }
    setRefreshingShops(false);
  }, []);

  useEffect(() => {
    let cancelled = false;
    void Promise.all([refreshShops(), redemptionService.listMine()]).then(
      ([, redemptionsResponse]) => {
        if (cancelled) return;
        if (!redemptionsResponse.success) {
          setHistoryError(redemptionsResponse.error?.message ?? 'Redemption history could not be loaded.');
        } else {
          setRedemptions(redemptionsResponse.data ?? []);
        }
        setLoadingRewards(false);
      },
    );
    return () => {
      cancelled = true;
    };
  }, [refreshShops]);

  useEffect(() => {
    const refreshWhenVisible = () => {
      if (document.visibilityState === 'visible') void refreshShops();
    };
    window.addEventListener('focus', refreshWhenVisible);
    document.addEventListener('visibilitychange', refreshWhenVisible);
    return () => {
      window.removeEventListener('focus', refreshWhenVisible);
      document.removeEventListener('visibilitychange', refreshWhenVisible);
    };
  }, [refreshShops]);

  const reloadRedemptions = async () => {
    const response = await redemptionService.listMine();
    if (response.success) setRedemptions(response.data ?? []);
    else toast.error(response.error?.message ?? 'Could not refresh redemption status.');
  };

  const handleRedeem = async () => {
    const coinsCost = Number(coinsToRedeem);
    if (!selectedShopId || !Number.isInteger(coinsCost) || coinsCost < MIN_REDEMPTION_COINS) {
      toast.error(`Choose a shop and enter at least ${MIN_REDEMPTION_COINS} Coins.`);
      return;
    }
    if (coinsCost > MAX_WALLET_COINS || coinsCost > balance) {
      toast.error(`You can redeem up to ${Math.min(balance, MAX_WALLET_COINS)} available Coins at a time.`);
      return;
    }
    const requestKey = `${selectedShopId}:${coinsCost}`;
    const key = requestKeys.current[requestKey] ?? crypto.randomUUID();
    requestKeys.current[requestKey] = key;
    setSubmitting(true);
    const response = await redemptionService.request(selectedShopId, coinsCost, key);
    if (!response.success || response.data === null) {
      toast.error(response.error?.message ?? 'Redemption request could not be submitted.');
      setSubmitting(false);
      return;
    }
    delete requestKeys.current[requestKey];
    toast.success(`Request sent. ${coinsCost} Coins are reserved until the shop responds.`);
    notifyWalletUpdated();
    await reloadRedemptions();
    setSubmitting(false);
  };

  const handleCancel = async (redemptionId: string) => {
    const response = await redemptionService.cancel(redemptionId);
    if (!response.success) {
      toast.error(response.error?.message ?? 'Redemption request could not be cancelled.');
      return;
    }
    toast.success('Request cancelled; reserved Coins were released.');
    notifyWalletUpdated();
    await reloadRedemptions();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100 text-amber-600">
          <Coins size={20} />
        </div>
        <div className="space-y-1">
          <h1 className="text-3xl font-black tracking-tight text-slate-900">My Wallet</h1>
          <p className="text-sm text-slate-500">Available Coins, reservations, and redemption status</p>
        </div>
      </div>

      <Card className="overflow-hidden border-transparent bg-slate-950 shadow-2xl">
        <CardContent className="space-y-5 p-6 sm:p-8">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-widest text-slate-400">Available balance</p>
            <p className="mt-2 text-5xl font-black tabular-nums text-white">
              {isLoading ? '…' : error ? '—' : balance} <span className="text-xl font-bold text-amber-400">Coins</span>
            </p>
            {!isLoading && !error && <p className="mt-1 text-sm text-slate-400">1 Coin = ₹1 · Wallet cap {MAX_WALLET_COINS} Coins</p>}
          </div>
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="rounded-xl bg-white/10 p-3">
              <p className="text-xs text-slate-400">Available</p><p className="font-black text-white">{wallet?.availableBalance ?? balance}</p>
            </div>
            <div className="rounded-xl bg-white/10 p-3">
              <p className="text-xs text-slate-400">Reserved</p><p className="font-black text-white">{wallet?.reservedBalance ?? 0}</p>
            </div>
            <div className="rounded-xl bg-white/10 p-3">
              <p className="text-xs text-slate-400">Spent</p><p className="font-black text-white">{wallet?.spentBalance ?? 0}</p>
            </div>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-white/10">
            <div className="h-full rounded-full bg-gradient-to-r from-amber-400 to-orange-500" style={{ width: `${Math.min(100, (balance / MAX_WALLET_COINS) * 100)}%` }} />
          </div>
          <div className="flex flex-wrap gap-2">
            <Button asChild variant="outline" className="border-white/15 text-white hover:bg-white/10">
              <Link to="/customer/scan">Scan a shop QR <ArrowRight size={16} className="ml-2" /></Link>
            </Button>
            <Button variant="outline" onClick={() => void refresh()} disabled={isLoading} className="border-white/15 text-white hover:bg-white/10">
              Refresh balance
            </Button>
          </div>
        </CardContent>
      </Card>

      {error && (
        <Card className="border-rose-200 bg-rose-50">
          <CardContent className="flex items-center justify-between gap-4 p-4">
            <p className="text-sm text-rose-700">{error}</p>
            <Button variant="outline" onClick={() => void refresh()} className="shrink-0">Retry</Button>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardContent className="space-y-4 p-5">
          <div>
            <h2 className="text-base font-extrabold text-slate-900">Redeem Coins at a shop</h2>
            <p className="text-sm text-slate-500">
              Choose a shop and amount. 1 Coin = ₹1. The shop must accept your request before the Coins are spent.
              Pending requests reserve Coins until approved, rejected, cancelled, or expired.
            </p>
          </div>
          <div className="flex items-center justify-between gap-3">
            <label className="block text-xs font-bold text-slate-600" htmlFor="reward-shop">Choose a shop</label>
            <Button
              type="button"
              variant="outline"
              onClick={() => void refreshShops(true)}
              disabled={refreshingShops}
              className="px-3 py-1.5 text-xs"
            >
              <RefreshCw size={14} className={`mr-1.5 ${refreshingShops ? 'animate-spin' : ''}`} />
              Refresh shops
            </Button>
          </div>
          <select
            id="reward-shop"
            value={selectedShopId}
            onChange={(event) => setSelectedShopId(event.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm"
            disabled={loadingRewards && !shops.length}
          >
            <option value="">Select a shop</option>
            {shops.map((shop) => <option key={shop.businessId} value={shop.businessId}>{shop.name} · {shop.category}</option>)}
          </select>
          {shopError && <p className="text-sm text-rose-700">{shopError}</p>}
          <label className="block text-xs font-bold text-slate-600" htmlFor="redeem-coins">
            Coins to redeem
          </label>
          <div className="flex flex-wrap items-center gap-3">
            <input
              id="redeem-coins"
              type="number"
              min={MIN_REDEMPTION_COINS}
              max={Math.min(balance, MAX_WALLET_COINS)}
              step={1}
              value={coinsToRedeem}
              onChange={(event) => setCoinsToRedeem(event.target.value)}
              className="w-full max-w-xs rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold"
              disabled={submitting}
            />
            <span className="inline-flex items-center gap-1 text-sm font-bold text-emerald-700">
              <IndianRupee size={16} />
              {Number(coinsToRedeem) > 0 ? Number(coinsToRedeem).toLocaleString('en-IN') : '0'} shop credit on approval
            </span>
            <Button
              onClick={() => void handleRedeem()}
              disabled={
                submitting || isLoading || Boolean(error) || !selectedShopId ||
                balance < MIN_REDEMPTION_COINS ||
                !Number.isInteger(Number(coinsToRedeem)) ||
                Number(coinsToRedeem) < MIN_REDEMPTION_COINS ||
                Number(coinsToRedeem) > MAX_WALLET_COINS ||
                Number(coinsToRedeem) > balance
              }
            >
              <Coins size={16} className="mr-1.5" />
              {submitting ? 'Sending request…' : 'Request coin redemption'}
            </Button>
          </div>
          {!loadingRewards && !shops.length && (
            <p className="text-sm text-slate-500">
              No active shops are currently accepting redemptions. Shops appear here after their QR is enabled.
            </p>
          )}
          {balance < MIN_REDEMPTION_COINS && !isLoading && (
            <p className="text-sm text-amber-700">You need at least {MIN_REDEMPTION_COINS} available Coins to request a redemption.</p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardContent className="space-y-3 p-5">
          <h2 className="text-base font-extrabold text-slate-900">Redemption history</h2>
          {historyError && <p className="text-sm text-rose-700">{historyError}</p>}
          {redemptions.map((redemption) => (
            <div key={redemption._id} className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 py-3 last:border-0">
              <div>
                <p className="font-bold text-slate-900">
                  {shops.find((shop) => shop.businessId === redemption.businessId)?.name ?? 'Shop'} · {redemption.coinsCost} Coins (₹{(redemption.settlementValuePaise / 100).toFixed(2)})
                </p>
                <p className="text-xs text-slate-500">{redemption.reference} · {redemption.status}</p>
              </div>
              {redemption.status === 'REQUESTED' && (
                <Button variant="outline" onClick={() => void handleCancel(redemption._id)}>Cancel request</Button>
              )}
            </div>
          ))}
          {!redemptions.length && <p className="text-sm text-slate-500">No redemption requests yet.</p>}
        </CardContent>
      </Card>

      <Card>
        <CardContent className="space-y-1 p-3">
          <div className="flex items-center justify-between px-2 pb-1 pt-2">
            <h2 className="text-base font-extrabold text-slate-900">Recent activity</h2>
            <Link to="/customer/history" className="text-xs font-bold text-amber-600 hover:text-amber-700">View all</Link>
          </div>
          {wallet?.transactions.length ? wallet.transactions.map((transaction) => (
            <div key={transaction.id} className="flex items-center justify-between rounded-xl px-3 py-2.5 hover:bg-slate-50">
              <div>
                <p className="text-sm font-bold text-slate-900">
                  {transaction.type === 'TEST_CREDIT'
                    ? 'Development test Coins'
                    : transaction.type.replace(/_/g, ' ').toLowerCase()}
                </p>
                <p className="text-xs text-slate-500">
                  {transaction.type === 'TEST_CREDIT' ? 'Test wallet top-up' : `Shop ${transaction.businessId}`}
                  {' · '}{new Date(transaction.createdAt).toLocaleDateString('en-IN')}
                </p>
              </div>
              <span className={`text-sm font-black tabular-nums ${transaction.amount < 0 ? 'text-rose-600' : 'text-amber-600'}`}>
                {transaction.amount > 0 ? '+' : ''}{transaction.amount}
              </span>
            </div>
          )) : (
            <p className="px-3 py-4 text-sm text-slate-500">{isLoading ? 'Loading wallet activity…' : error ? 'Wallet activity is unavailable.' : 'No wallet activity yet.'}</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
