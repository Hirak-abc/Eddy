import { Link } from 'react-router-dom';
import { QrCode, Sparkles, Search, Wallet, ChevronRight, Flame, MapPin, Star } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/Card';
import { SHOPS } from '@/data/shops';

const QUICK_ACTIONS = [
  { label: 'Scan QR', detail: 'Earn coins', icon: QrCode, to: '/customer/scan', color: 'bg-emerald-100 text-emerald-600' },
  { label: 'Spin & Win', detail: 'Try luck', icon: Sparkles, to: '/customer/spin-wheel', color: 'bg-amber-100 text-amber-600' },
  { label: 'Discover', detail: 'Find shops', icon: Search, to: '/customer/discover', color: 'bg-blue-100 text-blue-600' },
  { label: 'Wallet', detail: '85 coins', icon: Wallet, to: '/customer/wallet', color: 'bg-violet-100 text-violet-600' },
];

const NEARBY = SHOPS.slice(0, 3);

export const HomePage = () => (
  <div className="space-y-6">
    {/* Hero */}
    <div className="relative overflow-hidden rounded-3xl bg-slate-950 p-8 text-white shadow-2xl sm:p-10">
      <img
        src="https://images.unsplash.com/photo-1488459716781-31db52582fe9?auto=format&fit=crop&w=1200&q=80"
        alt=""
        aria-hidden
        className="absolute inset-0 h-full w-full object-cover opacity-30"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/70 to-transparent" />
      <div className="relative z-10 max-w-xl space-y-4">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/15 px-3 py-1 text-xs font-bold text-amber-300 ring-1 ring-amber-500/30">
          <Flame size={13} />
          5-day streak · keep it alive
        </span>
        <h1 className="text-3xl font-black leading-tight tracking-tight sm:text-4xl">
          Good evening, welcome back!
        </h1>
        <p className="text-slate-300">
          You have <span className="font-extrabold text-amber-300">85 coins</span> (≈ ₹85) and 3 scans left today.
        </p>
        <div className="flex flex-wrap gap-3 pt-1">
          <Link
            to="/customer/scan"
            className="inline-flex items-center gap-2 rounded-2xl bg-amber-500 px-5 py-2.5 font-extrabold text-white shadow-lg shadow-amber-500/25 transition-transform hover:scale-105"
          >
            <QrCode size={18} /> Scan QR
          </Link>
          <Link
            to="/customer/discover"
            className="inline-flex items-center gap-2 rounded-2xl bg-white/10 px-5 py-2.5 font-extrabold text-white ring-1 ring-white/20 backdrop-blur transition-colors hover:bg-white/15"
          >
            Explore shops
          </Link>
        </div>
      </div>
    </div>

    {/* Quick actions */}
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {QUICK_ACTIONS.map((action) => (
        <Link key={action.label} to={action.to}>
          <Card className="transition-all hover:-translate-y-0.5 hover:shadow-lg">
            <CardContent className="flex items-center gap-3 p-4">
              <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${action.color}`}>
                <action.icon size={20} />
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-extrabold text-slate-900">{action.label}</p>
                <p className="text-xs text-slate-500">{action.detail}</p>
              </div>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>

    {/* Nearby shops */}
    <div>
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-lg font-extrabold text-slate-900">Shops near you</h2>
        <Link
          to="/customer/discover"
          className="inline-flex items-center gap-1 text-sm font-bold text-amber-600 hover:text-amber-700"
        >
          View all <ChevronRight size={16} />
        </Link>
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        {NEARBY.map((shop) => (
          <Link key={shop.id} to={`/shop/${shop.id}`}>
            <Card className="group overflow-hidden transition-all hover:-translate-y-1 hover:shadow-xl">
              <div className="relative h-32 overflow-hidden">
                <img
                  src={shop.image}
                  alt={shop.name}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/45 to-transparent" />
                <span className="absolute bottom-2 left-2 inline-flex items-center gap-1 rounded-full bg-black/55 px-2 py-0.5 text-[11px] font-bold text-white backdrop-blur">
                  <Star size={11} className="fill-amber-400 text-amber-400" />
                  {shop.rating.toFixed(1)}
                </span>
              </div>
              <CardContent className="p-4">
                <p className="truncate text-sm font-extrabold text-slate-900">{shop.name}</p>
                <p className="mt-0.5 flex items-center gap-1 text-xs text-slate-500">
                  <MapPin size={12} />
                  {shop.area} · {shop.distanceKm.toFixed(1)} km
                </p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  </div>
);
