import { Link } from 'react-router-dom';
import { Coins, ArrowRight, Gift, TrendingUp, BadgePercent, Sparkles } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { toast } from 'sonner';

const STATS = [
  { icon: TrendingUp, label: 'Earned', value: '132', color: 'bg-emerald-100 text-emerald-600' },
  { icon: Gift, label: 'Redeemed', value: '47', color: 'bg-rose-100 text-rose-600' },
  { icon: Sparkles, label: 'Bonus', value: '10', color: 'bg-violet-100 text-violet-600' },
];

const RECENT = [
  { id: 'r1', label: 'Coins earned', shop: 'Café Aadab', amount: '+10', tone: 'text-amber-600' },
  { id: 'r2', label: 'Coupon used', shop: 'Sharma Sweets · SHARMA15', amount: '−₹64', tone: 'text-slate-700' },
  { id: 'r3', label: 'Streak bonus', shop: '10-day milestone', amount: '+10', tone: 'text-amber-600' },
];

export const CustomerWalletPage = () => {
  const balance = 85;
  const cap = 100;
  const minRedeem = 50;

  const handleRedeem = () => {
    if (balance < minRedeem) {
      toast.error(`You need at least ${minRedeem} coins to redeem`);
      return;
    }
    toast.success('Redemption request sent — show this to the shop owner to approve');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100 text-amber-600">
          <Coins size={20} />
        </div>
        <div className="space-y-1">
          <h1 className="text-3xl font-black tracking-tight text-slate-900">My Wallet</h1>
          <p className="text-sm text-slate-500">Coins, redemptions & rewards</p>
        </div>
      </div>

      {/* Balance card */}
      <Card className="overflow-hidden border-transparent bg-slate-950 shadow-2xl">
        <CardContent className="relative space-y-5 p-6 sm:p-8">
          <div
            className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-amber-500/20 blur-3xl"
            aria-hidden
          />
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-extrabold uppercase tracking-widest text-slate-400">Total balance</p>
              <p className="mt-2 text-5xl font-black tabular-nums text-white">
                {balance} <span className="text-xl font-bold text-amber-400">coins</span>
              </p>
              <p className="mt-1 text-sm text-slate-400">
                ≈ <span className="font-bold text-slate-200">₹{balance}</span> value · 1 coin = ₹1
              </p>
            </div>
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-400 to-orange-600 shadow-lg shadow-amber-500/30">
              <Coins size={28} className="text-white" />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-xs font-semibold text-slate-400">
              <span>Redeemable at {minRedeem}+ coins</span>
              <span>Cap {cap}</span>
            </div>
            <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full rounded-full bg-gradient-to-r from-amber-400 to-orange-500"
                style={{ width: `${(balance / cap) * 100}%` }}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            <Button onClick={handleRedeem} className="bg-amber-500 py-3 font-extrabold text-white hover:bg-amber-600">
              <BadgePercent size={17} className="mr-1.5" />
              Redeem
            </Button>
            <Button
              asChild
              variant="outline"
              className="border-white/15 py-3 font-extrabold text-white hover:bg-white/10"
            >
              <Link to="/customer/history">
                History <ArrowRight size={17} className="ml-1.5" />
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {STATS.map((stat) => (
          <Card key={stat.label}>
            <CardContent className="flex flex-col items-center gap-1 p-4 text-center">
              <div className={`flex h-9 w-9 items-center justify-center rounded-xl ${stat.color}`}>
                <stat.icon size={18} />
              </div>
              <div className="text-xl font-black tabular-nums text-slate-900">{stat.value}</div>
              <div className="text-xs font-medium text-slate-500">{stat.label}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent activity */}
      <Card>
        <CardContent className="space-y-1 p-3">
          <div className="flex items-center justify-between px-2 pb-1 pt-2">
            <h2 className="text-base font-extrabold text-slate-900">Recent activity</h2>
            <Link to="/customer/history" className="text-xs font-bold text-amber-600 hover:text-amber-700">
              View all
            </Link>
          </div>
          {RECENT.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between rounded-xl px-3 py-2.5 transition-colors hover:bg-slate-50"
            >
              <div>
                <p className="text-sm font-bold text-slate-900">{item.label}</p>
                <p className="text-xs text-slate-500">{item.shop}</p>
              </div>
              <span className={`text-sm font-black tabular-nums ${item.tone}`}>{item.amount}</span>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};
