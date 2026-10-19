import { useCallback, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Sparkles,
  QrCode,
  Ticket,
  CheckCircle2,
  Store,
  Gift,
  Instagram,
  Facebook,
  ArrowUpRight,
} from 'lucide-react';
import { useOwner } from '@/context/OwnerContext';
import { ROUTES } from '@/lib/constants';
import { Button } from '@/components/ui/Button';
import { qrService } from '@/services/qr.service';

export const DashboardPage = () => {
  const navigate = useNavigate();
  const [todayScans, setTodayScans] = useState<number | null>(null);
  const [scanCountError, setScanCountError] = useState<string | null>(null);
  const [repeatRate, setRepeatRate] = useState<{
    rate: number;
    repeatCustomers: number;
    uniqueCustomers: number;
  } | null>(null);
  const [repeatRateError, setRepeatRateError] = useState<string | null>(null);
  const {
    business,
    analyticsSummary,
    socialAccounts,
  } = useOwner();

  const refreshTodayScans = useCallback(async () => {
    const response = await qrService.getOwnerScansCountToday();
    if (!response.success || response.data === null) {
      setTodayScans(null);
      setScanCountError(response.error?.message || 'Unable to load today’s scans.');
      return;
    }
    setTodayScans(response.data.scansToday);
    setScanCountError(null);
  }, []);

  const refreshRepeatRate = useCallback(async () => {
    const response = await qrService.getOwnerRepeatRate();
    if (!response.success || response.data === null) {
      setRepeatRate(null);
      setRepeatRateError(response.error?.message || 'Unable to load repeat rate.');
      return;
    }
    setRepeatRate({
      rate: response.data.repeatCustomerRate,
      repeatCustomers: response.data.repeatCustomers,
      uniqueCustomers: response.data.uniqueCustomers,
    });
    setRepeatRateError(null);
  }, []);

  useEffect(() => {
    void refreshTodayScans();
    const intervalId = window.setInterval(() => void refreshTodayScans(), 30_000);
    window.addEventListener('focus', refreshTodayScans);
    void refreshRepeatRate();
    const repeatRateIntervalId = window.setInterval(() => void refreshRepeatRate(), 60_000);
    window.addEventListener('focus', refreshRepeatRate);

    return () => {
      window.clearInterval(intervalId);
      window.removeEventListener('focus', refreshTodayScans);
      window.clearInterval(repeatRateIntervalId);
      window.removeEventListener('focus', refreshRepeatRate);
    };
  }, [refreshRepeatRate, refreshTodayScans]);

  return (
    <div className="space-y-7 pb-12">
      {/* ── Welcome Banner ─────────────────────────────────────────────────── */}
      <div className="relative isolate overflow-hidden rounded-[2rem] border border-indigo-400/20 bg-gradient-to-br from-slate-950 via-indigo-950 to-violet-950 p-6 text-white shadow-2xl shadow-indigo-950/20 sm:p-9">
        <div className="pointer-events-none absolute -right-16 -top-24 -z-10 h-80 w-80 rounded-full bg-indigo-500/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-36 left-1/3 -z-10 h-72 w-72 rounded-full bg-violet-500/15 blur-3xl" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="flex items-center gap-1.5 rounded-full border border-indigo-300/20 bg-white/[0.08] px-3 py-1.5 text-xs font-semibold text-indigo-100 backdrop-blur-sm">
                <Store size={12} /> {business.category}
              </span>
              {business.verificationStatus === 'VERIFIED' && (
                <span className="flex items-center gap-1 rounded-full border border-emerald-300/20 bg-emerald-400/10 px-3 py-1.5 text-xs font-semibold text-emerald-200">
                  <CheckCircle2 size={12} /> Verified shop
                </span>
              )}
            </div>
            <h1 className="text-3xl font-black tracking-tight text-white sm:text-4xl">
              Welcome, {business.name}
            </h1>
            <p className="max-w-2xl text-sm leading-relaxed text-indigo-100/75">
              Your shop workspace, customer rewards, and marketing tools—all in one place.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <Button
              onClick={() => navigate(ROUTES.OWNER_CREATE_FLYER)}
              className="flex items-center gap-2 rounded-2xl bg-white px-5 py-2.5 font-bold text-indigo-800 shadow-lg shadow-indigo-950/20 transition-all hover:-translate-y-0.5 hover:bg-indigo-50"
            >
              <Sparkles size={16} />
              Create AI Flyer
            </Button>
            <Button
              onClick={() => navigate(ROUTES.OWNER_QR)}
              variant="outline"
              className="flex items-center gap-2 rounded-2xl border border-white/15 bg-white/[0.06] px-4 py-2.5 font-semibold text-white backdrop-blur-sm hover:bg-white/10"
            >
              <QrCode size={16} />
              Print QR Standee
            </Button>
          </div>
        </div>
      </div>

      {/* ── KPI Stat Cards ─────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-5">
        {/* QR Store Scans */}
        <div className="group relative overflow-hidden rounded-2xl border border-blue-100 bg-white p-5 shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-blue-950/5 dark:border-slate-700 dark:bg-slate-900">
          <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-blue-400 to-cyan-400" />
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-[0.14em] text-slate-500">Today's scans</span>
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 ring-1 ring-blue-100 dark:bg-blue-400/10 dark:text-blue-300 dark:ring-blue-300/10">
              <QrCode size={20} />
            </div>
          </div>
          <div className="mt-5">
            <div className="font-mono text-4xl font-black tracking-tight text-slate-900 dark:text-white">
              {todayScans === null ? '—' : todayScans.toLocaleString('en-IN')}
            </div>
            <p className={`mt-2 text-xs font-medium ${scanCountError ? 'text-rose-600 dark:text-rose-400' : 'text-slate-500'}`}>
              {scanCountError || 'Recorded shop QR scans today'}
            </p>
          </div>
        </div>

        {/* Coupons Redeemed */}
        <div className="group relative overflow-hidden rounded-2xl border border-emerald-100 bg-white p-5 shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-emerald-950/5 dark:border-slate-700 dark:bg-slate-900">
          <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-emerald-400 to-teal-400" />
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-[0.14em] text-slate-500">Coupons redeemed</span>
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 ring-1 ring-emerald-100 dark:bg-emerald-400/10 dark:text-emerald-300 dark:ring-emerald-300/10">
              <Ticket size={20} />
            </div>
          </div>
          <div className="mt-5">
            <div className="font-mono text-4xl font-black tracking-tight text-slate-900 dark:text-white">
              {analyticsSummary.couponsRedeemed}
            </div>
            <p className="mt-2 text-xs font-medium text-slate-500">Customer coupon redemptions</p>
          </div>
        </div>

        {/* Customer Repeat Rate */}
        <div className="group relative overflow-hidden rounded-2xl border border-amber-100 bg-white p-5 shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-amber-950/5 dark:border-slate-700 dark:bg-slate-900">
          <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-amber-400 to-orange-400" />
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-[0.14em] text-slate-500">Repeat rate</span>
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-50 text-amber-600 ring-1 ring-amber-100 dark:bg-amber-400/10 dark:text-amber-300 dark:ring-amber-300/10">
              <Gift size={20} />
            </div>
          </div>
          <div className="mt-5">
            <div className="font-mono text-4xl font-black tracking-tight text-slate-900 dark:text-white">
              {repeatRate === null ? '—' : `${repeatRate.rate}%`}
            </div>
            <p className={`mt-2 text-xs font-medium ${repeatRateError ? 'text-rose-600 dark:text-rose-400' : 'text-slate-500'}`}>
              {repeatRateError || (repeatRate
                ? `${repeatRate.repeatCustomers} of ${repeatRate.uniqueCustomers} customers returned in 30 days`
                : 'Repeat customers among unique scanners in the last 30 days')}
            </p>
          </div>
        </div>
      </div>

      <section className="relative flex flex-col justify-between gap-4 overflow-hidden rounded-3xl border border-indigo-200/70 bg-gradient-to-r from-indigo-50 via-white to-violet-50 p-5 shadow-sm dark:border-indigo-400/20 dark:from-indigo-950/60 dark:via-slate-900 dark:to-violet-950/40 sm:flex-row sm:items-center sm:p-6">
        <div className="pointer-events-none absolute -right-10 -top-16 h-40 w-40 rounded-full bg-indigo-300/20 blur-3xl dark:bg-indigo-400/10" />
        <div className="flex items-start gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-indigo-600 text-white shadow-lg shadow-indigo-600/20">
            <Sparkles size={20} />
          </div>
          <div>
            <h2 className="font-bold text-slate-900 dark:text-white">Bring your next campaign to life</h2>
            <p className="mt-1 max-w-2xl text-sm text-slate-600 dark:text-slate-300">
              Create polished flyers for your shop and manage your campaigns from the Flyer Studio.
            </p>
          </div>
        </div>
        <Button
          onClick={() => navigate(ROUTES.OWNER_FLYERS)}
          className="shrink-0 rounded-xl bg-indigo-600 font-bold text-white shadow-md shadow-indigo-600/20 transition-all hover:-translate-y-0.5 hover:bg-indigo-700"
        >
          Open Flyer Studio
          <ArrowUpRight size={16} className="ml-2" />
        </Button>
      </section>

      {/* ── Two Column Grid: Quick Actions & Live Activity ────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Quick Actions */}
        <div className="lg:col-span-7 space-y-6">
          {/* Quick Action Shortcuts */}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <Link
              to={ROUTES.OWNER_CREATE_FLYER}
              className="group flex flex-col items-center space-y-3 rounded-2xl border border-slate-200/80 bg-white p-4 text-center shadow-sm transition-all hover:-translate-y-1 hover:border-indigo-300 hover:shadow-lg dark:border-slate-700 dark:bg-slate-900"
            >
              <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Sparkles size={20} />
              </div>
              <span className="text-xs font-bold text-slate-800">New Flyer</span>
            </Link>

            <Link
              to={ROUTES.OWNER_COUPONS}
              className="group flex flex-col items-center space-y-3 rounded-2xl border border-slate-200/80 bg-white p-4 text-center shadow-sm transition-all hover:-translate-y-1 hover:border-emerald-300 hover:shadow-lg dark:border-slate-700 dark:bg-slate-900"
            >
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Ticket size={20} />
              </div>
              <span className="text-xs font-bold text-slate-800">Add Coupon</span>
            </Link>

            <Link
              to={ROUTES.OWNER_QR}
              className="group flex flex-col items-center space-y-3 rounded-2xl border border-slate-200/80 bg-white p-4 text-center shadow-sm transition-all hover:-translate-y-1 hover:border-blue-300 hover:shadow-lg dark:border-slate-700 dark:bg-slate-900"
            >
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                <QrCode size={20} />
              </div>
              <span className="text-xs font-bold text-slate-800">QR Standee</span>
            </Link>

            <Link
              to={ROUTES.OWNER_REWARDS}
              className="group flex flex-col items-center space-y-3 rounded-2xl border border-slate-200/80 bg-white p-4 text-center shadow-sm transition-all hover:-translate-y-1 hover:border-amber-300 hover:shadow-lg dark:border-slate-700 dark:bg-slate-900"
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
          <div className="space-y-4 rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-900 text-base">Connected Channels</h3>
              <Link to={ROUTES.OWNER_SOCIAL} className="text-xs font-bold text-indigo-600 hover:text-indigo-700">
                Manage
              </Link>
            </div>

            <div className="space-y-3">
              {/* Instagram Card */}
              <div className="flex items-center justify-between rounded-2xl border border-slate-200/80 bg-slate-50 p-3.5 dark:border-slate-700 dark:bg-slate-800/70">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 text-white flex items-center justify-center shrink-0">
                    <Instagram size={18} />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900 dark:text-white">
                      {socialAccounts.instagram.connected ? socialAccounts.instagram.username || 'Instagram account' : 'Instagram'}
                    </div>
                    {!socialAccounts.instagram.connected && (
                      <div className="text-[11px] text-slate-500 font-mono">
                        Connect an account to get started
                      </div>
                    )}
                  </div>
                </div>
                <span className={`rounded-md border px-2 py-0.5 text-[10px] font-bold ${
                  socialAccounts.instagram.connected
                    ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                    : 'border-slate-200 bg-white text-slate-500 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-400'
                }`}>
                  {socialAccounts.instagram.connected ? 'Connected' : 'Not connected'}
                </span>
              </div>

              {/* Facebook Card */}
              <div className="flex items-center justify-between rounded-2xl border border-slate-200/80 bg-slate-50 p-3.5 dark:border-slate-700 dark:bg-slate-800/70">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0">
                    <Facebook size={18} />
                  </div>
                  <div className="max-w-[170px] truncate">
                    <div className="truncate text-xs font-bold text-slate-900 dark:text-white">
                      {socialAccounts.facebook.connected ? socialAccounts.facebook.pageName || 'Facebook page' : 'Facebook'}
                    </div>
                    {!socialAccounts.facebook.connected && (
                      <div className="text-[11px] text-slate-500 font-mono">
                        Connect a page to get started
                      </div>
                    )}
                  </div>
                </div>
                <span className={`rounded-md border px-2 py-0.5 text-[10px] font-bold ${
                  socialAccounts.facebook.connected
                    ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                    : 'border-slate-200 bg-white text-slate-500 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-400'
                }`}>
                  {socialAccounts.facebook.connected ? 'Connected' : 'Not connected'}
                </span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
