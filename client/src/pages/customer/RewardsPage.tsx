import { Link } from 'react-router-dom';
import { Trophy, Ticket, Sparkles, Zap, ChevronRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/Card';
import { cn } from '@/lib/utils';

const HISTORY = [
  { id: 1, shop: 'Café Aadab', label: '10 Eddy Coins', detail: 'QR scan reward · 8 Oct', amount: '+10', kind: 'coins' as const, icon: Trophy },
  { id: 2, shop: 'Café Aadab', label: '25 Eddy Coins', detail: 'Spin wheel win · 6 Oct', amount: '+25', kind: 'coins' as const, icon: Sparkles },
  { id: 3, shop: 'Sharma Sweets & Snacks', label: '15% Off Sweets', detail: 'Flyer coupon · SHARMA15', amount: '−₹64', kind: 'coupon' as const, icon: Ticket },
  { id: 4, shop: 'Streak milestone', label: '10-day bonus', detail: 'Streak reward · 1 Oct', amount: '+10', kind: 'coins' as const, icon: Zap },
];

export const CustomerRewardsPage = () => (
  <div className="space-y-6">
    <div className="flex items-center gap-3">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100 text-amber-600">
        <Trophy size={20} />
      </div>
      <div className="space-y-1">
        <h1 className="text-3xl font-black tracking-tight text-slate-900">My Rewards</h1>
        <p className="text-sm text-slate-500">Coins, prizes & coupons you’ve won</p>
      </div>
    </div>

    {/* Lifetime banner */}
    <div className="relative overflow-hidden rounded-3xl bg-slate-950 p-6 text-white shadow-xl sm:p-8">
      <img
        src="https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=1000&q=80"
        alt=""
        aria-hidden
        className="absolute inset-0 h-full w-full object-cover opacity-25"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/60 to-transparent" />
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs font-extrabold uppercase tracking-widest text-slate-400">Lifetime earnings</p>
          <p className="mt-1 text-4xl font-black tabular-nums">
            142 <span className="text-lg font-bold text-amber-400">coins</span>
          </p>
          <p className="mt-1 text-sm text-slate-400">≈ ₹142 saved across 6 shops</p>
        </div>
        <Link
          to="/customer/spin-wheel"
          className="inline-flex items-center gap-2 rounded-2xl bg-amber-500 px-5 py-2.5 font-extrabold text-white shadow-lg shadow-amber-500/25 transition-transform hover:scale-105"
        >
          <Sparkles size={18} /> Win more
        </Link>
      </div>
    </div>

    {/* History */}
    <div className="space-y-3">
      {HISTORY.map((item) => (
        <Card key={item.id} className="transition-shadow hover:shadow-md">
          <CardContent className="flex items-center gap-4 p-4 sm:p-5">
            <div
              className={cn(
                'flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl',
                item.kind === 'coins' ? 'bg-amber-100 text-amber-600' : 'bg-violet-100 text-violet-600'
              )}
            >
              <item.icon size={22} />
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-extrabold text-slate-900">{item.label}</p>
              <p className="truncate text-xs text-slate-500">
                {item.shop} · {item.detail}
              </p>
            </div>
            <span
              className={cn(
                'shrink-0 text-lg font-black tabular-nums',
                item.kind === 'coins' ? 'text-amber-600' : 'text-slate-800'
              )}
            >
              {item.amount}
            </span>
          </CardContent>
        </Card>
      ))}
    </div>

    <Link
      to="/customer/history"
      className="flex items-center justify-center gap-1 text-sm font-bold text-amber-600 hover:text-amber-700"
    >
      View full transaction history <ChevronRight size={16} />
    </Link>
  </div>
);
