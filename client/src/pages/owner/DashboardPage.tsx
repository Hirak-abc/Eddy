import { Link, useNavigate } from 'react-router-dom';
import {
  Sparkles,
  QrCode,
  Ticket,
  TrendingUp,
  Eye,
  CheckCircle2,
  Store,
  ChevronRight,
  Zap,
  Gift,
  Check,
  X,
  Instagram,
  Facebook,
} from 'lucide-react';
import { toast } from 'sonner';
import { useOwner } from '@/context/OwnerContext';
import { ROUTES } from '@/lib/constants';
import { Button } from '@/components/ui/Button';

export const DashboardPage = () => {
  const navigate = useNavigate();
  const {
    business,
    transactions,
    approveTransaction,
    rejectTransaction,
    analyticsSummary,
    socialAccounts,
  } = useOwner();

  const pendingTransactions = transactions.filter((t) => t.status === 'PENDING');
  const recentApproved = transactions.filter((t) => t.status === 'APPROVED').slice(0, 4);

  return (
    <div className="space-y-8 pb-12">
      {/* ── Welcome Banner ─────────────────────────────────────────────────── */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-950 via-indigo-950 to-slate-900 border border-indigo-900/40 p-6 sm:p-8 text-white shadow-xl shadow-slate-950/10">
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 flex items-center gap-1.5">
                <Store size={12} /> {business.category}
              </span>
              <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                <CheckCircle2 size={12} /> Verified Shop
              </span>
              <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1">
                <Zap size={12} className="fill-amber-300" /> Pro Plan Active
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Welcome back, {business.name}
            </h1>
            <p className="text-sm text-slate-300 max-w-2xl">
              Marketing engine is active. Your customer QR standee is collecting scans, and trend flyers are scheduled for auto-publishing.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <Button
              onClick={() => navigate(ROUTES.OWNER_CREATE_FLYER)}
              className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold shadow-lg shadow-indigo-600/30 flex items-center gap-2 rounded-2xl px-5 py-2.5"
            >
              <Sparkles size={16} />
              Create AI Flyer
            </Button>
            <Button
              onClick={() => navigate(ROUTES.OWNER_QR)}
              variant="outline"
              className="border-slate-700 bg-slate-900/60 hover:bg-slate-800 text-slate-200 font-semibold flex items-center gap-2 rounded-2xl px-4 py-2.5"
            >
              <QrCode size={16} />
              Print QR Standee
            </Button>
          </div>
        </div>
      </div>

      {/* ── KPI Stat Cards ─────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Total Reach */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Reach</span>
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Eye size={20} />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-slate-900 font-mono tracking-tight">
              {analyticsSummary.totalReach.toLocaleString('en-IN')}
            </div>
            <div className="flex items-center gap-1.5 mt-1 text-xs font-semibold text-emerald-600">
              <TrendingUp size={14} />
              <span>+{analyticsSummary.reachGrowth}% this month</span>
            </div>
          </div>
        </div>

        {/* QR Store Scans */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Today's Scans</span>
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <QrCode size={20} />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-slate-900 font-mono tracking-tight">
              {analyticsSummary.totalScans.toLocaleString('en-IN')}
            </div>
            <div className="flex items-center gap-1.5 mt-1 text-xs font-semibold text-emerald-600">
              <TrendingUp size={14} />
              <span>+{analyticsSummary.scanGrowth}% vs last week</span>
            </div>
          </div>
        </div>

        {/* Coupons Redeemed */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Coupons Redeemed</span>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Ticket size={20} />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-slate-900 font-mono tracking-tight">
              {analyticsSummary.couponsRedeemed}
            </div>
            <div className="flex items-center gap-1.5 mt-1 text-xs font-semibold text-emerald-600">
              <TrendingUp size={14} />
              <span>+{analyticsSummary.couponGrowth}% redemption rate</span>
            </div>
          </div>
        </div>

        {/* Customer Repeat Rate */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Repeat Rate</span>
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Gift size={20} />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-slate-900 font-mono tracking-tight">
              {analyticsSummary.repeatCustomerRate}%
            </div>
            <div className="flex items-center gap-1.5 mt-1 text-xs font-semibold text-slate-500">
              <span>Loyal local customers</span>
            </div>
          </div>
        </div>
      </div>

      <section className="flex flex-col justify-between gap-4 rounded-3xl border border-indigo-100 bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:p-6">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
            <Sparkles size={20} />
          </div>
          <div>
            <h2 className="font-bold text-slate-900">AI Flyer Studio</h2>
            <p className="mt-1 max-w-2xl text-sm text-slate-600">
              Save all three business photos to queue an automatic trend flyer.
              It is scheduled for Facebook and Instagram 72 hours after
              generation. Custom flyers can be posted now or scheduled.
            </p>
          </div>
        </div>
        <Button
          onClick={() => navigate(ROUTES.OWNER_FLYERS)}
          className="shrink-0 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700"
        >
          Open Flyer Studio
        </Button>
      </section>

      {/* ── Two Column Grid: Pending Approvals & Live Activity ─────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Customer Redemption Requests & Wallet (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
                  ₹
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base">Pending Customer Redemptions</h3>
                  <p className="text-xs text-slate-500">Verify customer bills to settle coins and coupons</p>
                </div>
              </div>
              <Link
                to={ROUTES.OWNER_WALLET}
                className="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
              >
                <span>Full Ledger</span>
                <ChevronRight size={14} />
              </Link>
            </div>

            {pendingTransactions.length === 0 ? (
              <div className="p-8 text-center rounded-2xl bg-slate-50 border border-dashed border-slate-200">
                <CheckCircle2 size={32} className="mx-auto text-emerald-500 mb-2" />
                <div className="text-sm font-bold text-slate-800">All caught up!</div>
                <p className="text-xs text-slate-500 mt-1">No pending coin redemption requests right now.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {pendingTransactions.map((tx) => (
                  <div
                    key={tx.id}
                    className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-slate-900">
                          {(tx.metadata?.customerName as string | undefined) || 'Customer'}
                        </span>
                        <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-amber-200/60 text-amber-900">
                          {tx.type === 'COIN_REDEMPTION' ? `${tx.coinAmount} Coins` : 'Coupon Deal'}
                        </span>
                      </div>
                      <div className="text-xs text-slate-600 flex items-center gap-3">
                        <span>Discount: <strong>₹{tx.amount}</strong></span>
                        {(tx.metadata?.billAmount as number | undefined) ? <span>Bill: ₹{tx.metadata?.billAmount as number}</span> : null}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => {
                          approveTransaction(tx.id);
                          toast.success(`Approved ₹${tx.amount} discount for ${(tx.metadata?.customerName as string | undefined) || 'customer'}`);
                        }}
                        className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1 shadow-xs transition-colors"
                      >
                        <Check size={14} />
                        Approve
                      </button>
                      <button
                        onClick={() => {
                          rejectTransaction(tx.id);
                          toast.error('Redemption rejected');
                        }}
                        className="px-2.5 py-1.5 rounded-xl bg-white hover:bg-slate-100 text-slate-600 border border-slate-200 font-bold text-xs flex items-center gap-1 transition-colors"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quick Action Shortcuts */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <Link
              to={ROUTES.OWNER_CREATE_FLYER}
              className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:border-indigo-300 hover:shadow-md transition-all group flex flex-col items-center text-center space-y-2"
            >
              <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Sparkles size={20} />
              </div>
              <span className="text-xs font-bold text-slate-800">New Flyer</span>
            </Link>

            <Link
              to={ROUTES.OWNER_COUPONS}
              className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:border-emerald-300 hover:shadow-md transition-all group flex flex-col items-center text-center space-y-2"
            >
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Ticket size={20} />
              </div>
              <span className="text-xs font-bold text-slate-800">Add Coupon</span>
            </Link>

            <Link
              to={ROUTES.OWNER_QR}
              className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:border-blue-300 hover:shadow-md transition-all group flex flex-col items-center text-center space-y-2"
            >
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                <QrCode size={20} />
              </div>
              <span className="text-xs font-bold text-slate-800">QR Standee</span>
            </Link>

            <Link
              to={ROUTES.OWNER_REWARDS}
              className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:border-amber-300 hover:shadow-md transition-all group flex flex-col items-center text-center space-y-2"
            >
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Gift size={20} />
              </div>
              <span className="text-xs font-bold text-slate-800">Spin Rewards</span>
            </Link>
          </div>
        </div>

        {/* Right Column: Social Channels & Recent Activity (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Social Channels Widget */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-900 text-base">Connected Channels</h3>
              <Link to={ROUTES.OWNER_SOCIAL} className="text-xs font-bold text-indigo-600 hover:text-indigo-700">
                Manage
              </Link>
            </div>

            <div className="space-y-3">
              {/* Instagram Card */}
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 text-white flex items-center justify-center shrink-0">
                    <Instagram size={18} />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900">
                      {socialAccounts.instagram.username || 'Instagram Page'}
                    </div>
                    <div className="text-[11px] text-slate-500 font-mono">
                      {socialAccounts.instagram.followers?.toLocaleString('en-IN')} Followers
                    </div>
                  </div>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200">
                  Synced
                </span>
              </div>

              {/* Facebook Card */}
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0">
                    <Facebook size={18} />
                  </div>
                  <div className="max-w-[170px] truncate">
                    <div className="text-xs font-bold text-slate-900 truncate">
                      {socialAccounts.facebook.pageName || 'Facebook Page'}
                    </div>
                    <div className="text-[11px] text-slate-500 font-mono">
                      {socialAccounts.facebook.likes?.toLocaleString('en-IN')} Likes
                    </div>
                  </div>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200">
                  Synced
                </span>
              </div>
            </div>
          </div>

          {/* Recent Settled Transactions */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
            <h3 className="font-bold text-slate-900 text-base">Recent Settled Redemptions</h3>
            <div className="space-y-2.5">
              {recentApproved.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center text-xs font-bold">
                      ✓
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-900">
                        {(item.metadata?.customerName as string | undefined) || 'Customer'}
                      </div>
                      <div className="text-[10px] text-slate-500">
                        {item.type === 'COIN_REDEMPTION' ? 'Eddy Coins Redeemed' : `Coupon: ${(item.metadata?.couponCode as string | undefined) ?? ''}`}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs font-bold text-emerald-600 font-mono">+₹{item.amount}</div>
                    <div className="text-[10px] text-slate-400">Settled</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
