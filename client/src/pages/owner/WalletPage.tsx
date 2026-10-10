import { useState } from 'react';
import {
  Wallet,
  ArrowUpRight,
  ArrowDownLeft,
  Clock,
  CheckCircle2,
  XCircle,
  Coins,
  ShieldCheck,
  Download,
  Filter,
  Search,
  IndianRupee,
  Check,
  X,
  Sparkles,
  Building2,
  ChevronRight,
  TrendingUp,
} from 'lucide-react';
import { toast } from 'sonner';
import { useOwner } from '@/context/OwnerContext';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

export const WalletPage = () => {
  const {
    walletBalance,
    lifetimeCredits,
    transactions,
    approveTransaction,
    rejectTransaction,
  } = useOwner();

  const [statusFilter, setStatusFilter] = useState<'ALL' | 'PENDING' | 'APPROVED' | 'REJECTED'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [isPayoutModalOpen, setIsPayoutModalOpen] = useState(false);
  const [payoutAmount, setPayoutAmount] = useState('2000');
  const [bankUpi, setBankUpi] = useState('owner@okhdfcbank');

  // Pending transactions needing approval
  const pendingTransactions = transactions.filter((t) => t.status === 'PENDING');

  // Filtered transactions
  const filteredTransactions = transactions.filter((t) => {
    if (statusFilter !== 'ALL' && t.status !== statusFilter) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const name = (t.metadata?.customerName as string)?.toLowerCase() || '';
      const note = (t.metadata?.note as string)?.toLowerCase() || '';
      const code = (t.metadata?.couponCode as string)?.toLowerCase() || '';
      return name.includes(q) || note.includes(q) || code.includes(q) || t.id.toLowerCase().includes(q);
    }
    return true;
  });

  const handleApprove = (id: string, name?: string) => {
    approveTransaction(id);
    toast.success(`Approved redemption for ${name || 'Customer'}! Discount applied.`);
  };

  const handleReject = (id: string, name?: string) => {
    rejectTransaction(id);
    toast.error(`Rejected redemption for ${name || 'Customer'}.`);
  };

  const handleRequestPayout = (e: React.FormEvent) => {
    e.preventDefault();
    const amt = parseInt(payoutAmount, 10);
    if (!amt || amt < 500) {
      toast.error('Minimum payout amount is ₹500');
      return;
    }
    if (amt > walletBalance) {
      toast.error('Payout amount cannot exceed current wallet balance');
      return;
    }
    toast.success(`Payout of ₹${amt.toLocaleString('en-IN')} requested to ${bankUpi}. Will settle in 24 hours.`);
    setIsPayoutModalOpen(false);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* ── Top Header ──────────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider flex items-center gap-1">
              <Wallet size={14} /> Financials & Settlements
            </span>
            <span className="text-slate-300">•</span>
            <span className="text-xs font-medium text-slate-500">Coin Economy & Counter Redemptions</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Owner Wallet & Billing Ledger
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <Button
            onClick={() => setIsPayoutModalOpen(true)}
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs shadow-sm flex items-center gap-1.5"
          >
            <ArrowUpRight size={15} />
            <span>Request Payout</span>
          </Button>
        </div>
      </div>

      {/* ── Financial KPI Strip ──────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Wallet Balance */}
        <div className="p-5 rounded-3xl bg-gradient-to-br from-emerald-600 to-teal-700 text-white shadow-md relative overflow-hidden flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-100 uppercase tracking-wider flex items-center gap-1">
              <IndianRupee size={13} /> Available Balance
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/40 text-[10px] font-extrabold text-emerald-100 border border-emerald-400/30 uppercase">
              Live
            </span>
          </div>

          <div>
            <div className="text-3xl font-black font-mono tracking-tight">
              ₹{walletBalance.toLocaleString('en-IN')}
            </div>
            <p className="text-xs text-emerald-100/80 mt-0.5">Ready for instant UPI bank settlement</p>
          </div>

          <div className="pt-2 border-t border-emerald-500/40 flex items-center justify-between text-xs text-emerald-100">
            <span>Next auto-settlement:</span>
            <span className="font-bold">Every Monday 10 AM</span>
          </div>
        </div>

        {/* Lifetime Credits */}
        <div className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-2xs space-y-3 flex flex-col justify-between">
          <div>
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
              <TrendingUp size={13} className="text-emerald-600" /> Lifetime Redeemed Value
            </span>
            <div className="text-3xl font-black text-slate-900 font-mono mt-2">
              ₹{lifetimeCredits.toLocaleString('en-IN')}
            </div>
            <p className="text-xs text-slate-400 mt-0.5">Total customer discounts driven by Eddy</p>
          </div>

          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Average Discount / Bill:</span>
            <strong className="text-slate-800 font-mono">₹54.20</strong>
          </div>
        </div>

        {/* Pending Counter Requests */}
        <div className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-2xs space-y-3 flex flex-col justify-between">
          <div>
            <span className="text-xs font-bold text-amber-600 uppercase tracking-wider flex items-center gap-1">
              <Clock size={13} /> Pending Counter Claims
            </span>
            <div className="text-3xl font-black text-amber-600 font-mono mt-2">
              {pendingTransactions.length} Pending
            </div>
            <p className="text-xs text-slate-400 mt-0.5">Awaiting cashier or manager confirmation</p>
          </div>

          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Total Pending Value:</span>
            <strong className="text-amber-600 font-mono font-bold">
              ₹{pendingTransactions.reduce((acc, t) => acc + t.amount, 0)}
            </strong>
          </div>
        </div>
      </div>

      {/* ── Business Rule Notice ─────────────────────────────────────────────── */}
      <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs">
            <Coins size={18} />
          </div>
          <div>
            <h4 className="text-xs font-extrabold text-emerald-950 uppercase tracking-wide">
              Eddy Coin Economy Standard
            </h4>
            <p className="text-xs text-emerald-800 leading-relaxed">
              <strong>1 Eddy Coin = ₹1.00 Direct Bill Discount.</strong> Diners must have minimum 50 coins to redeem. Maximum wallet capacity is 100 coins.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <span className="text-[11px] font-bold px-2.5 py-1 rounded-lg bg-white border border-emerald-300 text-emerald-800">
            Min: 50 Coins
          </span>
          <span className="text-[11px] font-bold px-2.5 py-1 rounded-lg bg-white border border-emerald-300 text-emerald-800">
            Max Cap: 100 Coins
          </span>
        </div>
      </div>

      {/* ── Pending Approvals Section ────────────────────────────────────────── */}
      {pendingTransactions.length > 0 && (
        <div className="bg-white rounded-3xl p-6 border-2 border-amber-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse" />
              <h2 className="text-base font-bold text-slate-900">
                Action Required: Pending Counter Redemptions ({pendingTransactions.length})
              </h2>
            </div>
            <span className="text-xs text-amber-700 font-semibold">Customers standing at billing counter</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {pendingTransactions.map((tx) => {
              const custName = (tx.metadata?.customerName as string) || 'Customer';
              const billAmt = tx.metadata?.billAmount as number;
              const couponCode = tx.metadata?.couponCode as string;

              return (
                <div
                  key={tx.id}
                  className="p-4 rounded-2xl bg-amber-50/40 border border-amber-200 flex items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <strong className="text-sm font-bold text-slate-900">{custName}</strong>
                      <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-300 uppercase">
                        {tx.type === 'COIN_REDEMPTION' ? 'Coins' : 'Coupon'}
                      </span>
                    </div>

                    <div className="text-xs text-slate-600 flex items-center gap-2">
                      <span>
                        Discount:{' '}
                        <strong className="text-emerald-700 font-mono font-bold">₹{tx.amount} OFF</strong>
                      </span>
                      {billAmt && <span>(Bill: ₹{billAmt})</span>}
                      {couponCode && <span className="font-mono font-bold text-indigo-700">[{couponCode}]</span>}
                    </div>

                    <div className="text-[10px] text-slate-400">
                      Requested {new Date(tx.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      onClick={() => handleReject(tx.id, custName)}
                      className="bg-white hover:bg-rose-50 text-rose-600 border border-rose-200 text-xs font-bold rounded-xl h-8 px-3"
                    >
                      <X size={14} className="mr-1" /> Reject
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => handleApprove(tx.id, custName)}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl h-8 px-3 shadow-xs"
                    >
                      <Check size={14} className="mr-1" /> Approve
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── Transaction History Table ───────────────────────────────────────── */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden space-y-4 p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="font-bold text-base text-slate-900">Settlement Ledger & History</h3>
            <p className="text-xs text-slate-500">Immutable records of all discount redemptions and coin credits.</p>
          </div>

          <div className="flex items-center gap-2.5">
            {/* Search */}
            <div className="relative w-48 sm:w-60">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search customer, code..."
                className="pl-8 text-xs rounded-xl"
              />
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
              {(['ALL', 'PENDING', 'APPROVED', 'REJECTED'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setStatusFilter(tab)}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                    statusFilter === tab
                      ? 'bg-white text-slate-900 shadow-2xs'
                      : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                <th className="pb-3 pl-2">Transaction ID</th>
                <th className="pb-3">Customer</th>
                <th className="pb-3">Redemption Type</th>
                <th className="pb-3 text-right">Discount Amount</th>
                <th className="pb-3">Timestamp</th>
                <th className="pb-3 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredTransactions.map((tx) => {
                const custName = (tx.metadata?.customerName as string) || 'Walk-in Customer';
                const isApproved = tx.status === 'APPROVED';
                const isPending = tx.status === 'PENDING';

                return (
                  <tr key={tx.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3.5 pl-2 font-mono font-bold text-slate-600">{tx.id}</td>
                    <td className="py-3.5 font-semibold text-slate-900">{custName}</td>
                    <td className="py-3.5">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700">
                        {tx.type === 'COIN_REDEMPTION' ? (
                          <>
                            <Coins size={11} className="text-amber-500" />
                            <span>{tx.coinAmount} Coins</span>
                          </>
                        ) : (
                          <>
                            <span>Flyer Coupon</span>
                          </>
                        )}
                      </span>
                    </td>
                    <td className="py-3.5 text-right font-mono font-bold text-slate-900">
                      ₹{tx.amount.toFixed(2)}
                    </td>
                    <td className="py-3.5 text-slate-500">
                      {new Date(tx.createdAt).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </td>
                    <td className="py-3.5 text-center">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${
                          isApproved
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : isPending
                            ? 'bg-amber-50 text-amber-700 border border-amber-200'
                            : 'bg-rose-50 text-rose-700 border border-rose-200'
                        }`}
                      >
                        {isApproved && <CheckCircle2 size={11} />}
                        {isPending && <Clock size={11} />}
                        {tx.status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Request Payout Modal ────────────────────────────────────────────── */}
      {isPayoutModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-xs" onClick={() => setIsPayoutModalOpen(false)} />

          <div className="relative z-10 w-full max-w-md bg-white rounded-3xl p-6 sm:p-7 shadow-2xl border border-slate-200 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <ArrowUpRight size={16} />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">Request Bank Payout</h3>
                  <p className="text-[11px] text-slate-500">Instant UPI transfer to your registered account.</p>
                </div>
              </div>

              <button
                onClick={() => setIsPayoutModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleRequestPayout} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Payout Amount (₹)
                </label>
                <Input
                  type="number"
                  value={payoutAmount}
                  onChange={(e) => setPayoutAmount(e.target.value)}
                  placeholder="e.g. 2000"
                  max={walletBalance}
                  min={500}
                  className="font-mono text-base font-bold"
                  required
                />
                <span className="text-[11px] text-slate-400 mt-1 block">
                  Available balance: ₹{walletBalance.toLocaleString('en-IN')} (Min payout: ₹500)
                </span>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Receiving Bank UPI ID / Account
                </label>
                <Input
                  value={bankUpi}
                  onChange={(e) => setBankUpi(e.target.value)}
                  placeholder="e.g. store@upi"
                  className="font-mono text-xs"
                  required
                />
              </div>

              <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 space-y-1">
                <div className="font-bold flex items-center gap-1">
                  <ShieldCheck size={13} /> Razorpay Payouts Integration
                </div>
                <p className="text-[11px] leading-relaxed text-emerald-800">
                  Payouts are verified and settled directly to your merchant account with zero transaction fee on Eddy Pro.
                </p>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsPayoutModalOpen(false)}
                  className="rounded-xl text-xs"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs shadow-sm"
                >
                  Confirm Payout
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
