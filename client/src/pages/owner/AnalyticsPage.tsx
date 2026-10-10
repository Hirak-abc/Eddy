import { useMemo, useState } from 'react';
import {
  BarChart3,
  QrCode,
  Ticket,
  IndianRupee,
  Share2,
  ArrowUpRight,
  Download,
  Copy,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { toast } from 'sonner';
import { Button } from '@/components/ui/Button';

const FULL_REACH = [
  { date: 'Sep 06', instagram: 420, facebook: 180 },
  { date: 'Sep 09', instagram: 580, facebook: 240 },
  { date: 'Sep 12', instagram: 710, facebook: 310 },
  { date: 'Sep 15', instagram: 650, facebook: 290 },
  { date: 'Sep 18', instagram: 890, facebook: 420 },
  { date: 'Sep 21', instagram: 1100, facebook: 540 },
  { date: 'Sep 24', instagram: 980, facebook: 480 },
  { date: 'Sep 27', instagram: 1250, facebook: 610 },
  { date: 'Sep 30', instagram: 1420, facebook: 720 },
  { date: 'Oct 03', instagram: 1650, facebook: 810 },
  { date: 'Oct 05', instagram: 1820, facebook: 940 },
];

const QR_DATA = [
  { day: 'Mon', scans: 48, uniqueVisitors: 38 },
  { day: 'Tue', scans: 62, uniqueVisitors: 51 },
  { day: 'Wed', scans: 55, uniqueVisitors: 44 },
  { day: 'Thu', scans: 74, uniqueVisitors: 59 },
  { day: 'Fri', scans: 118, uniqueVisitors: 94 },
  { day: 'Sat', scans: 164, uniqueVisitors: 132 },
  { day: 'Sun', scans: 142, uniqueVisitors: 115 },
];

const CHANNELS = [
  { name: 'Instagram Feed and Stories', value: 58, color: '#8B5CF6' },
  { name: 'Facebook Page', value: 26, color: '#3B82F6' },
  { name: 'In-Store Table QR', value: 16, color: '#10B981' },
];

const FLYERS = [
  { id: 'f1', title: 'Navratri Special Royal Thali 25% OFF', category: 'Festival Promotion', reach: 4850, shares: 142, couponsClaimed: 84, conversion: '34.2%' },
  { id: 'f2', title: 'Weekend Biryani Feast Combo', category: 'Weekend Special', reach: 3920, shares: 98, couponsClaimed: 62, conversion: '28.6%' },
  { id: 'f3', title: 'Monsoon Chai and Pakora Platter', category: 'Flash Deal', reach: 2840, shares: 76, couponsClaimed: 45, conversion: '24.1%' },
];

const RANGE_META: Record<'7D' | '30D' | '90D', { label: string; slice: number; mult: number; note: string }> = {
  '7D': { label: 'Last 7 Days', slice: 4, mult: 0.28, note: 'Oct 1 - Oct 5 window' },
  '30D': { label: 'Last 30 Days', slice: 11, mult: 1, note: 'Sep 6 - Oct 5 window' },
  '90D': { label: 'Last 3 Months', slice: 11, mult: 2.7, note: 'Jul 8 - Oct 5 window, scaled' },
};

export const AnalyticsPage = () => {
  const [timeRange, setTimeRange] = useState<'7D' | '30D' | '90D'>('30D');
  const [visibleSeries, setVisibleSeries] = useState({ instagram: true, facebook: true });
  const [selectedFlyer, setSelectedFlyer] = useState<string | null>(null);

  const meta = RANGE_META[timeRange];
  const reachData = useMemo(() => {
    const sliced = FULL_REACH.slice(-meta.slice);
    if (timeRange === '90D') {
      return sliced.map((d) => ({ ...d, instagram: Math.round(d.instagram * 2.7), facebook: Math.round(d.facebook * 2.7) }));
    }
    return sliced;
  }, [meta.slice, timeRange]);

  const kpis = useMemo(
    () => [
      { icon: Share2, color: 'text-indigo-600', label: 'Social Reach', value: Math.round(18420 * meta.mult).toLocaleString('en-IN'), sub: 'Instagram and Facebook views', delta: '+24.8%' },
      { icon: QrCode, color: 'text-blue-600', label: 'Table Scans', value: Math.round(1480 * meta.mult).toLocaleString('en-IN'), sub: 'Diners spinning wheel and menu', delta: '+18.2%' },
      { icon: Ticket, color: 'text-amber-600', label: 'Conversion Rate', value: timeRange === '7D' ? '33.1%' : timeRange === '30D' ? '31.4%' : '29.8%', sub: 'Flyer coupons redeemed at billing', delta: '+4.5%' },
      { icon: IndianRupee, color: 'text-emerald-600', label: 'Attributed Sales', value: `Rs.${Math.round(148200 * meta.mult).toLocaleString('en-IN')}`, sub: 'Total sales driven by Eddy', delta: '+32.0%' },
    ],
    [meta.mult, timeRange]
  );

  const toggleSeries = (key: 'instagram' | 'facebook') => {
    setVisibleSeries((prev) => {
      const next = { ...prev, [key]: !prev[key] };
      if (!next.instagram && !next.facebook) {
        toast.error('Keep at least one channel visible.');
        return prev;
      }
      return next;
    });
  };

  const handleExport = () => {
    const rows = ['date,instagram,facebook', ...reachData.map((d) => `${d.date},${d.instagram},${d.facebook}`)].join('\n');
    const blob = new Blob([rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `eddy-reach-${timeRange}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success(`Exported ${reachData.length} rows for ${meta.label}.`);
  };

  const handleCopySummary = async () => {
    const text = `Eddy ${meta.label}: Reach ${kpis[0].value}, Scans ${kpis[1].value}, Conversion ${kpis[2].value}, Sales ${kpis[3].value}.`;
    try {
      await navigator.clipboard.writeText(text);
      toast.success('KPI summary copied for WhatsApp report.');
    } catch {
      toast.error('Clipboard unavailable in this browser.');
    }
  };

  return (
    <div className="min-h-screen space-y-6 bg-slate-50 pb-12">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <div className="mb-1 flex items-center gap-2">
            <span className="flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-sky-600">
              <BarChart3 size={14} /> Telemetry and Growth
            </span>
            <span className="text-slate-300">•</span>
            <span className="text-xs font-medium text-slate-500">Cross-Platform ROI</span>
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
            Performance and Marketing Analytics
          </h1>
          <p className="mt-1 text-xs font-medium text-slate-500">Showing: {meta.note}</p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1 rounded-2xl bg-slate-100 p-1">
            {(['7D', '30D', '90D'] as const).map((range) => (
              <button
                key={range}
                onClick={() => {
                  setTimeRange(range);
                  toast.info(`Switched to ${RANGE_META[range].label}. Charts and KPIs updated.`);
                }}
                className={`rounded-xl px-4 py-1.5 text-xs font-bold transition-all ${
                  timeRange === range ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                {RANGE_META[range].label}
              </button>
            ))}
          </div>
          <Button onClick={handleExport} variant="outline" className="rounded-xl border-slate-200 bg-white text-xs font-bold text-slate-700">
            <Download size={14} /> Export CSV
          </Button>
          <Button onClick={handleCopySummary} variant="outline" className="rounded-xl border-slate-200 bg-white text-xs font-bold text-slate-700">
            <Copy size={14} /> Copy Summary
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {kpis.map((kpi) => (
          <div key={kpi.label} className="flex flex-col justify-between space-y-2 rounded-3xl border border-slate-200/80 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <span className={`flex items-center gap-1 text-xs font-bold uppercase tracking-wider ${kpi.color}`}>
                <kpi.icon size={13} /> {kpi.label}
              </span>
              <span className="flex items-center text-[11px] font-bold text-emerald-600">
                <ArrowUpRight size={13} /> {kpi.delta}
              </span>
            </div>
            <div>
              <div className="font-mono text-3xl font-black text-slate-900">{kpi.value}</div>
              <p className="mt-0.5 text-[11px] text-slate-400">{kpi.sub} ({meta.label})</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <div className="space-y-6 rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm sm:p-7 lg:col-span-8">
          <div className="flex flex-col justify-between gap-3 border-b border-slate-100 pb-4 sm:flex-row sm:items-center">
            <div>
              <h2 className="text-base font-bold text-slate-900">Multi-Channel Reach Trends</h2>
              <p className="text-xs text-slate-500">Daily organic impressions ({meta.label}, {reachData.length} points)</p>
            </div>
            <div className="flex items-center gap-2 text-xs font-bold">
              <button type="button" onClick={() => toggleSeries('instagram')} className={`flex items-center gap-1.5 rounded-lg px-2 py-1 transition ${visibleSeries.instagram ? 'text-purple-600' : 'text-slate-300 line-through'}`}>
                <span className="h-3 w-3 rounded-full bg-purple-600" /> Instagram
              </button>
              <button type="button" onClick={() => toggleSeries('facebook')} className={`flex items-center gap-1.5 rounded-lg px-2 py-1 transition ${visibleSeries.facebook ? 'text-blue-600' : 'text-slate-300 line-through'}`}>
                <span className="h-3 w-3 rounded-full bg-blue-600" /> Facebook
              </button>
            </div>
          </div>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={reachData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="igGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="fbGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#64748B' }} tickLine={false} axisLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#64748B' }} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ backgroundColor: '#0F172A', borderRadius: '16px', border: 'none', color: '#fff', fontSize: '12px' }} />
                {visibleSeries.instagram && <Area type="monotone" dataKey="instagram" stroke="#8B5CF6" strokeWidth={2.5} fillOpacity={1} fill="url(#igGradient)" />}
                {visibleSeries.facebook && <Area type="monotone" dataKey="facebook" stroke="#3B82F6" strokeWidth={2.5} fillOpacity={1} fill="url(#fbGradient)" />}
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="flex flex-col justify-between space-y-4 rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm lg:col-span-4">
          <div>
            <h3 className="text-base font-bold text-slate-900">Traffic Source Distribution</h3>
            <p className="text-xs text-slate-500">Where customers discover offers ({meta.label})</p>
          </div>
          <div className="flex h-52 w-full items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={CHANNELS} cx="50%" cy="50%" innerRadius={50} outerRadius={75} paddingAngle={5} dataKey="value">
                  {CHANNELS.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#0F172A', borderRadius: '12px', border: 'none', color: '#fff', fontSize: '11px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-2 border-t border-slate-100 pt-2 text-xs">
            {CHANNELS.map((item) => (
              <button
                key={item.name}
                type="button"
                onClick={() => toast.info(`${item.name}: ${item.value}% of traffic in ${meta.label}.`)}
                className="flex w-full items-center justify-between rounded-lg px-2 py-1 transition hover:bg-slate-50"
              >
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-slate-600">{item.name}</span>
                </div>
                <strong className="font-mono text-slate-900">{item.value}%</strong>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <div className="space-y-5 rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm lg:col-span-5">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="text-base font-bold text-slate-900">Weekly Table QR Activity</h3>
            <p className="text-xs text-slate-500">Weekend spike: Sat 164 scans, 132 unique diners</p>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={QR_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#64748B' }} tickLine={false} axisLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#64748B' }} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ backgroundColor: '#0F172A', borderRadius: '12px', border: 'none', color: '#fff', fontSize: '11px' }} />
                <Bar dataKey="scans" fill="#3B82F6" radius={[6, 6, 0, 0]} />
                <Bar dataKey="uniqueVisitors" fill="#93C5FD" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <Link to="/owner/wallet" className="block rounded-2xl bg-slate-900 px-4 py-2.5 text-center text-xs font-bold text-white transition hover:bg-slate-800">
            Review Coin Redemptions in Wallet
          </Link>
        </div>

        <div className="space-y-4 rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm lg:col-span-7">
          <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900">Campaign ROI Leaderboard</h3>
              <p className="text-xs text-slate-500">Tap a row for a quick insight. {meta.label} ranking.</p>
            </div>
            <Link to="/owner/coupons" className="text-xs font-bold text-indigo-600 hover:text-indigo-800">
              Manage Coupons
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-100 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  <th className="pb-3 pl-1">Flyer Campaign</th>
                  <th className="pb-3 text-right">Reach</th>
                  <th className="pb-3 text-right">Shares</th>
                  <th className="pb-3 text-right">Coupons</th>
                  <th className="pb-3 pr-1 text-right">Conv. Rate</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {FLYERS.map((flyer) => (
                  <tr
                    key={flyer.id}
                    onClick={() => {
                      setSelectedFlyer(flyer.id);
                      toast.success(`${flyer.title}: ${flyer.conversion} conversion, ${flyer.couponsClaimed} coupons claimed.`);
                    }}
                    className={`cursor-pointer transition-colors hover:bg-slate-50/80 ${selectedFlyer === flyer.id ? 'bg-indigo-50/60' : ''}`}
                  >
                    <td className="py-3 pl-1">
                      <div className="font-bold text-slate-900">{flyer.title}</div>
                      <span className="text-[10px] font-semibold uppercase text-indigo-600">{flyer.category}</span>
                    </td>
                    <td className="py-3 text-right font-mono font-semibold text-slate-700">{flyer.reach.toLocaleString('en-IN')}</td>
                    <td className="py-3 text-right font-mono font-semibold text-slate-700">{flyer.shares}</td>
                    <td className="py-3 text-right font-mono font-bold text-amber-600">{flyer.couponsClaimed}</td>
                    <td className="py-3 pr-1 text-right font-mono font-extrabold text-emerald-600">{flyer.conversion}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
