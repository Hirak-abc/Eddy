import { useMemo, useState } from 'react';
import {
  ArrowUpDown, Sparkles, Ticket, Zap, UserCheck, SearchX,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/Card';
import { cn } from '@/lib/utils';

type TxnType = 'COIN_REWARD' | 'COIN_REDEMPTION' | 'COUPON_REDEMPTION' | 'STREAK_BONUS' | 'FOLLOW_REWARD';

interface Txn {
  id: string;
  type: TxnType;
  coinAmount: number;
  rupeeAmount: number;
  businessName: string;
  status: 'COMPLETED' | 'APPROVED' | 'PENDING' | 'REJECTED';
  date: string;
  coupon?: string;
}

const TXNS: Txn[] = [
  { id: 'tx_1', type: 'COIN_REWARD', coinAmount: 10, rupeeAmount: 10, businessName: 'Café Aadab', status: 'COMPLETED', date: '2026-10-08T10:30:00Z' },
  { id: 'tx_2', type: 'STREAK_BONUS', coinAmount: 10, rupeeAmount: 10, businessName: '10-day streak milestone', status: 'COMPLETED', date: '2026-10-07T09:00:00Z' },
  { id: 'tx_3', type: 'COUPON_REDEMPTION', coinAmount: 0, rupeeAmount: 64, businessName: 'Sharma Sweets & Snacks', status: 'COMPLETED', date: '2026-10-05T18:20:00Z', coupon: 'SHARMA15' },
  { id: 'tx_4', type: 'COIN_REWARD', coinAmount: 10, rupeeAmount: 10, businessName: 'Royal Biryani House', status: 'COMPLETED', date: '2026-10-04T13:10:00Z' },
  { id: 'tx_5', type: 'COIN_REDEMPTION', coinAmount: 50, rupeeAmount: 50, businessName: 'Café Aadab', status: 'APPROVED', date: '2026-10-03T14:00:00Z' },
  { id: 'tx_6', type: 'FOLLOW_REWARD', coinAmount: 10, rupeeAmount: 10, businessName: 'Lucknowi Threads · Instagram', status: 'COMPLETED', date: '2026-10-02T11:45:00Z' },
  { id: 'tx_7', type: 'COIN_REDEMPTION', coinAmount: 60, rupeeAmount: 60, businessName: 'TechGully Electronics', status: 'PENDING', date: '2026-10-01T16:30:00Z' },
];

const TYPE_META: Record<TxnType, { label: string; icon: typeof Sparkles; color: string }> = {
  COIN_REWARD: { label: 'Coins earned', icon: Sparkles, color: 'bg-amber-100 text-amber-600' },
  COIN_REDEMPTION: { label: 'Coins redeemed', icon: ArrowUpDown, color: 'bg-rose-100 text-rose-600' },
  COUPON_REDEMPTION: { label: 'Coupon redeemed', icon: Ticket, color: 'bg-violet-100 text-violet-600' },
  STREAK_BONUS: { label: 'Streak bonus', icon: Zap, color: 'bg-orange-100 text-orange-600' },
  FOLLOW_REWARD: { label: 'Follow reward', icon: UserCheck, color: 'bg-blue-100 text-blue-600' },
};

const STATUS_STYLES: Record<Txn['status'], string> = {
  COMPLETED: 'bg-emerald-100 text-emerald-700',
  APPROVED: 'bg-blue-100 text-blue-700',
  PENDING: 'bg-amber-100 text-amber-700',
  REJECTED: 'bg-red-100 text-red-700',
};

const FILTERS = [
  { id: 'ALL', label: 'All' },
  { id: 'EARNED', label: 'Earned' },
  { id: 'REDEEMED', label: 'Redeemed' },
  { id: 'COUPONS', label: 'Coupons' },
] as const;

export const TransactionHistoryPage = () => {
  const [filter, setFilter] = useState<(typeof FILTERS)[number]['id']>('ALL');

  const results = useMemo(() => {
    if (filter === 'EARNED') {
      return TXNS.filter((t) => ['COIN_REWARD', 'STREAK_BONUS', 'FOLLOW_REWARD'].includes(t.type));
    }
    if (filter === 'REDEEMED') return TXNS.filter((t) => t.type === 'COIN_REDEMPTION');
    if (filter === 'COUPONS') return TXNS.filter((t) => t.type === 'COUPON_REDEMPTION');
    return TXNS;
  }, [filter]);

  const earned = TXNS.filter((t) => t.type !== 'COIN_REDEMPTION' && t.type !== 'COUPON_REDEMPTION')
    .reduce((sum, t) => sum + t.coinAmount, 0);
  const redeemed = TXNS.filter((t) => t.type === 'COIN_REDEMPTION')
    .reduce((sum, t) => sum + t.coinAmount, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100 text-amber-600">
          <ArrowUpDown size={20} />
        </div>
        <div className="space-y-1">
          <h1 className="text-3xl font-black tracking-tight text-slate-900">Transaction History</h1>
          <p className="text-sm text-slate-500">Every coin earned, redeemed & coupon used</p>
        </div>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="border-emerald-200 bg-emerald-50">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-black tabular-nums text-emerald-700">+{earned}</div>
            <div className="mt-0.5 text-xs font-semibold text-emerald-600">Coins earned</div>
          </CardContent>
        </Card>
        <Card className="border-rose-200 bg-rose-50">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-black tabular-nums text-rose-700">−{redeemed}</div>
            <div className="mt-0.5 text-xs font-semibold text-rose-600">Coins redeemed</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {FILTERS.map((f) => (
          <button
            key={f.id}
            onClick={() => setFilter(f.id)}
            className={cn(
              'shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition-all',
              filter === f.id
                ? 'bg-slate-900 text-white shadow'
                : 'bg-white text-slate-600 ring-1 ring-slate-200 hover:ring-slate-300'
            )}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* List */}
      {results.length > 0 ? (
        <div className="space-y-3">
          {results.map((t) => {
            const meta = TYPE_META[t.type];
            const isEarn = t.type !== 'COIN_REDEMPTION' && t.type !== 'COUPON_REDEMPTION';
            return (
              <Card key={t.id} className="transition-shadow hover:shadow-md">
                <CardContent className="flex items-center gap-4 p-4 sm:p-5">
                  <div className={cn('flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl', meta.color)}>
                    <meta.icon size={22} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-extrabold text-slate-900">{meta.label}</p>
                    <p className="truncate text-xs text-slate-500">
                      {t.businessName} ·{' '}
                      {new Date(t.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                    </p>
                    {t.coupon && (
                      <span className="mt-1 inline-block rounded-md bg-amber-100 px-2 py-0.5 text-[10px] font-extrabold tracking-wider text-amber-700">
                        {t.coupon}
                      </span>
                    )}
                  </div>
                  <div className="shrink-0 space-y-1 text-right">
                    <div className={cn('text-lg font-extrabold tabular-nums', isEarn ? 'text-emerald-600' : 'text-slate-800')}>
                      {isEarn ? `+${t.coinAmount}` : t.type === 'COUPON_REDEMPTION' ? `−₹${t.rupeeAmount}` : `−${t.coinAmount}`}
                    </div>
                    <span className={cn('inline-block rounded-full px-2 py-0.5 text-[10px] font-extrabold', STATUS_STYLES[t.status])}>
                      {t.status}
                    </span>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        <div className="flex flex-col items-center space-y-2 rounded-2xl border border-dashed border-slate-200 bg-white py-14 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-slate-400">
            <SearchX size={26} />
          </div>
          <p className="font-bold text-slate-800">No transactions here yet</p>
          <p className="text-sm text-slate-500">Try a different filter.</p>
        </div>
      )}
    </div>
  );
};
