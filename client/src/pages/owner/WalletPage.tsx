import { useCallback, useEffect, useState } from 'react';
import { ArrowUpRight, Banknote, Check, IndianRupee, RefreshCw, Sparkles, Wallet, X } from 'lucide-react';
import { toast } from 'sonner';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { walletService, type OwnerWallet } from '@/services/wallet.service';
import { redemptionService, type Redemption } from '@/services/redemption.service';

const formatRupees = (paise: number) =>
  new Intl.NumberFormat('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    .format(paise / 100);

export const WalletPage = () => {
  const [wallet, setWallet] = useState<OwnerWallet | null>(null);
  const [redemptions, setRedemptions] = useState<Redemption[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reviewingId, setReviewingId] = useState<string | null>(null);

  const loadWallet = useCallback(async () => {
    setLoading(true);
    const [walletResponse, redemptionsResponse] = await Promise.all([
      walletService.getOwnerWallet(),
      redemptionService.listOwner(),
    ]);
    if (!walletResponse.success || walletResponse.data === null || !redemptionsResponse.success) {
      setError(
        walletResponse.error?.message
          ?? redemptionsResponse.error?.message
          ?? 'Could not load your Eddy wallet and requests.',
      );
      setLoading(false);
      return;
    }
    setWallet(walletResponse.data);
    setRedemptions(redemptionsResponse.data ?? []);
    setError(null);
    setLoading(false);
  }, []);

  useEffect(() => {
    void loadWallet();
  }, [loadWallet]);

  const handleReview = async (redemption: Redemption, decision: 'APPROVED' | 'REJECTED') => {
    setReviewingId(redemption._id);
    const response = await redemptionService.review(redemption._id, decision);
    if (!response.success || response.data === null) {
      toast.error(response.error?.message ?? 'Could not update this redemption request.');
      setReviewingId(null);
      return;
    }
    if (response.data.status !== decision) {
      toast.error(`This request is ${response.data.status.toLowerCase()} and was not ${decision.toLowerCase()}.`);
    } else if (decision === 'REJECTED') {
      toast.success(`${redemption.coinsCost} Coins released back to the customer.`);
    } else {
      toast.success(`Approved. ₹${formatRupees(redemption.settlementValuePaise)} credited to your Eddy wallet.`);
    }
    await loadWallet();
    setReviewingId(null);
  };

  const pendingRedemptions = redemptions.filter((redemption) => redemption.status === 'REQUESTED');

  return (
    <div className="space-y-6 pb-12">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="mb-1 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-700">
            <Wallet size={14} />
            <span>Owner finances</span>
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">Eddy Wallet</h1>
          <p className="mt-1 text-sm text-slate-500">Rupees credited when you approve customer coin redemptions.</p>
        </div>
        <Button variant="outline" onClick={() => void loadWallet()} disabled={loading}>
          <RefreshCw size={15} className={`mr-2 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </header>

      {error && (
        <Card className="border-rose-200 bg-rose-50">
          <CardContent className="flex flex-wrap items-center justify-between gap-3 p-4">
            <p className="text-sm text-rose-700">{error}</p>
            <Button variant="outline" onClick={() => void loadWallet()}>Retry</Button>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <Card className="overflow-hidden border-0 bg-gradient-to-br from-emerald-700 to-teal-800 text-white shadow-lg">
          <CardContent className="space-y-4 p-6">
            <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-emerald-100">
              <IndianRupee size={15} />
              Eddy wallet balance
            </p>
            <p className="text-4xl font-black tabular-nums">
              {loading ? '…' : error ? '—' : `₹${formatRupees(wallet?.balancePaise ?? 0)}`}
            </p>
            <p className="text-xs text-emerald-100">
              Internal balance only. Bank/UPI payout is not made automatically.
            </p>
          </CardContent>
        </Card>

        <Card className="group relative isolate overflow-hidden border-0 bg-gradient-to-br from-indigo-950 via-slate-900 to-violet-950 text-white shadow-xl shadow-indigo-950/15 ring-1 ring-white/10">
          <div aria-hidden="true" className="pointer-events-none absolute -right-10 -top-14 -z-10 h-48 w-48 rounded-full bg-indigo-500/20 blur-3xl transition-colors duration-500 group-hover:bg-violet-400/25" />
          <CardContent className="flex h-full flex-col justify-between gap-6 p-6 sm:p-7">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="flex items-center gap-2 text-[11px] font-extrabold uppercase tracking-[0.18em] text-indigo-200">
                  <span className="flex h-7 w-7 items-center justify-center rounded-lg border border-emerald-300/20 bg-emerald-300/10 text-emerald-300">
                    <Check size={15} strokeWidth={3} />
                  </span>
                  Approved requests
                </p>
                <p className="mt-5 text-5xl font-black leading-none tracking-tight tabular-nums text-white drop-shadow-sm">
                  {loading ? '…' : error ? '—' : wallet?.approvedRedemptionsCount ?? 0}
                </p>
                <p className="mt-2 text-xs font-medium text-slate-300">Customer redemptions approved so far</p>
              </div>
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.06] text-indigo-200 shadow-inner">
                <Sparkles size={20} />
              </span>
            </div>
            <div className="rounded-2xl border border-white/10 bg-slate-950/35 p-3.5 backdrop-blur-sm">
              <Button
                type="button"
                disabled
                title="Payout requests are not available yet."
                className="h-11 w-full cursor-not-allowed rounded-xl border border-white/10 bg-white/[0.08] font-bold text-slate-300 shadow-inner hover:bg-white/[0.08]"
              >
                <Banknote size={17} className="mr-2 text-amber-300" />
                Request payout
                <ArrowUpRight size={15} className="ml-auto text-slate-400" />
              </Button>
              <p className="mt-2 flex items-center justify-center gap-1.5 text-[11px] font-medium text-slate-400">
                <span className="h-1.5 w-1.5 rounded-full bg-amber-300/80" />
                Payout requests coming soon
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="space-y-4 p-5 sm:p-6">
          <div>
            <h2 className="text-base font-extrabold text-slate-900">Wallet activity</h2>
            <p className="text-sm text-slate-500">Approved customer redemptions credited to this wallet.</p>
          </div>
          {wallet?.transactions.length ? (
            <div className="divide-y divide-slate-100">
              {wallet.transactions.map((transaction) => (
                <div key={transaction._id} className="flex flex-wrap items-center justify-between gap-3 py-3">
                  <div>
                    <p className="font-bold text-slate-800">Customer coin redemption</p>
                    <p className="text-xs text-slate-500">
                      {transaction.reference} · {new Date(transaction.createdAt).toLocaleString('en-IN')}
                    </p>
                  </div>
                  <p className="font-mono text-sm font-black text-emerald-700">
                    +₹{formatRupees(transaction.amountPaise)}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="rounded-xl bg-slate-50 p-4 text-sm text-slate-500">
              {loading ? 'Loading wallet activity…' : error ? 'Wallet activity is unavailable.' : 'No approved redemptions yet.'}
            </p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardContent className="space-y-4 p-5 sm:p-6">
          <div>
            <h2 className="text-base font-extrabold text-slate-900">
              Customer redemption requests
              {pendingRedemptions.length > 0 && (
                <span className="ml-2 rounded-full bg-amber-100 px-2 py-0.5 text-xs font-bold text-amber-800">
                  {pendingRedemptions.length} pending
                </span>
              )}
            </h2>
            <p className="text-sm text-slate-500">
              Approve to credit your wallet, or reject to return reserved Coins to the customer.
            </p>
          </div>
          {pendingRedemptions.length ? (
            <div className="divide-y divide-slate-100">
              {pendingRedemptions.map((redemption) => (
                <div key={redemption._id} className="flex flex-wrap items-center justify-between gap-4 py-4">
                  <div>
                    <p className="font-bold text-slate-900">
                      {redemption.coinsCost} Coins <span className="text-slate-400">→</span> ₹{formatRupees(redemption.settlementValuePaise)}
                    </p>
                    <p className="text-xs text-slate-500">
                      Customer ID: {redemption.customerId} · {redemption.reference} · Requested {new Date(redemption.requestedAt).toLocaleString('en-IN')}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      onClick={() => void handleReview(redemption, 'REJECTED')}
                      disabled={reviewingId !== null}
                      className="border-rose-200 text-rose-700 hover:bg-rose-50"
                    >
                      <X size={15} className="mr-1" />
                      {reviewingId === redemption._id ? 'Please wait…' : 'Reject'}
                    </Button>
                    <Button
                      onClick={() => void handleReview(redemption, 'APPROVED')}
                      disabled={reviewingId !== null}
                      className="bg-emerald-600 text-white hover:bg-emerald-700"
                    >
                      <Check size={15} className="mr-1" />
                      Approve
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="rounded-xl bg-slate-50 p-4 text-sm text-slate-500">
              {loading ? 'Loading customer requests…' : error ? 'Customer requests are unavailable.' : 'No pending customer requests.'}
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
