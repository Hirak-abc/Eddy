import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, BadgePercent, Coins } from 'lucide-react';
import { toast } from 'sonner';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useCustomerWallet } from '@/hooks/useCustomerWallet';
import { MAX_WALLET_COINS, MIN_REDEMPTION_COINS } from '@/lib/constants';
import { businessService, type RedeemableOffer, type ShopSummary } from '@/services/business.service';
import { redemptionService, type Redemption } from '@/services/redemption.service';
import { notifyWalletUpdated } from '@/services/wallet.service';

export const CustomerWalletPage = () => {
  const { wallet, isLoading, error, refresh } = useCustomerWallet();
  const [shops, setShops] = useState<ShopSummary[]>([]);
  const [selectedShopId, setSelectedShopId] = useState('');
  const [offers, setOffers] = useState<RedeemableOffer[]>([]);
  const [redemptions, setRedemptions] = useState<Redemption[]>([]);
  const [loadingRewards, setLoadingRewards] = useState(true);
  const [rewardError, setRewardError] = useState<string | null>(null);
  const requestKeys = useRef<Record<string, string>>({});
  const balance = wallet?.availableBalance ?? wallet?.balance ?? 0;

  useEffect(() => {
    let cancelled = false;
    void Promise.all([businessService.getActiveShops(), redemptionService.listMine()]).then(
      ([shopsResponse, redemptionsResponse]) => {
        if (cancelled) return;
        if (!shopsResponse.success || !redemptionsResponse.success) {
          setRewardError(
            shopsResponse.error?.message
              ?? redemptionsResponse.error?.message
              ?? 'Redeemable offers could not be loaded.',
          );
        } else {
          const listedShops = shopsResponse.data ?? [];
          setShops(listedShops);
          setSelectedShopId((current) => current || listedShops[0]?.businessId || '');
          setRedemptions(redemptionsResponse.data ?? []);
        }
        setLoadingRewards(false);
      },
    );
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;
    if (!selectedShopId) {
      setOffers([]);
      return;
    }
    void businessService.getOffers(selectedShopId).then((response) => {
      if (cancelled) return;
      if (response.success) {
        setOffers(response.data ?? []);
        setRewardError(null);
      } else {
        setRewardError(response.error?.message ?? 'Shop offers could not be loaded.');
      }
    });
    return () => {
      cancelled = true;
    };
  }, [selectedShopId]);

  const reloadRedemptions = async () => {
    const response = await redemptionService.listMine();
    if (response.success) setRedemptions(response.data ?? []);
    else toast.error(response.error?.message ?? 'Could not refresh redemption status.');
  };

  const handleRedeem = async (offer: RedeemableOffer) => {
    if (balance < MIN_REDEMPTION_COINS || balance < offer.coinsCost) {
      toast.error(`You need at least ${offer.coinsCost} available Coins for this item.`);
      return;
    }
    const key = requestKeys.current[offer._id] ?? crypto.randomUUID();
    requestKeys.current[offer._id] = key;
    const response = await redemptionService.request(offer._id, key);
    if (!response.success || response.data === null) {
      toast.error(response.error?.message ?? 'Redemption request could not be submitted.');
      return;
    }
    delete requestKeys.current[offer._id];
    toast.success(`Request ${response.data.reference} submitted. ${offer.coinsCost} Coins are reserved for owner approval.`);
    notifyWalletUpdated();
    await reloadRedemptions();
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
            <h2 className="text-base font-extrabold text-slate-900">Redeem Coins for a shop reward</h2>
            <p className="text-sm text-slate-500">At least {MIN_REDEMPTION_COINS} available Coins are required. Pending requests reserve Coins until approved, rejected, cancelled, or expired.</p>
          </div>
          <label className="block text-xs font-bold text-slate-600" htmlFor="reward-shop">Choose a verified shop</label>
          <select
            id="reward-shop"
            value={selectedShopId}
            onChange={(event) => setSelectedShopId(event.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm"
          >
            <option value="">Select a shop</option>
            {shops.map((shop) => <option key={shop.businessId} value={shop.businessId}>{shop.name} · {shop.category}</option>)}
          </select>
          {rewardError && <p className="text-sm text-rose-700">{rewardError}</p>}
          <div className="space-y-3">
            {offers.map((offer) => (
              <div key={offer._id} className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-100 p-4">
                <div>
                  <p className="font-bold text-slate-900">{offer.name}</p>
                  {offer.description && <p className="text-xs text-slate-500">{offer.description}</p>}
                  <p className="text-xs font-semibold text-amber-700">{offer.coinsCost} Coins · settlement value ₹{(offer.settlementValuePaise / 100).toFixed(2)}</p>
                </div>
                <Button
                  onClick={() => void handleRedeem(offer)}
                  disabled={isLoading || Boolean(error) || balance < offer.coinsCost}
                >
                  <BadgePercent size={16} className="mr-1.5" />Request reward
                </Button>
              </div>
            ))}
            {!loadingRewards && selectedShopId && !offers.length && <p className="text-sm text-slate-500">This shop has no active redemption offers.</p>}
            {!loadingRewards && !shops.length && <p className="text-sm text-slate-500">No verified shops are currently accepting redemptions.</p>}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="space-y-3 p-5">
          <h2 className="text-base font-extrabold text-slate-900">Redemption history</h2>
          {redemptions.map((redemption) => (
            <div key={redemption._id} className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 py-3 last:border-0">
              <div>
                <p className="font-bold text-slate-900">{redemption.offerName} · {redemption.coinsCost} Coins</p>
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
                <p className="text-sm font-bold text-slate-900">{transaction.type.replace(/_/g, ' ').toLowerCase()}</p>
                <p className="text-xs text-slate-500">Shop {transaction.businessId} · {new Date(transaction.createdAt).toLocaleDateString('en-IN')}</p>
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
