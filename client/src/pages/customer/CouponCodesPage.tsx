import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Ticket, Clock, Check, Copy, SearchX } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { SHOPS } from '@/data/shops';

type CouponStatus = 'ACTIVE' | 'USED' | 'EXPIRED';

interface Coupon {
  id: string;
  code: string;
  title: string;
  discount: string;
  shopId: string;
  validUntil: string;
  status: CouponStatus;
}

const COUPONS: Coupon[] = [
  { id: 'c1', code: 'SHARMA15', title: 'Flat 15% off all sweets', discount: '15% OFF', shopId: 'sharma-sweets', validUntil: '12 Oct 2026', status: 'ACTIVE' },
  { id: 'c2', code: 'AADAB100', title: 'Free cold coffee on 100 coins', discount: 'FREE COFFEE', shopId: 'cafe-aadab', validUntil: '12 Oct 2026', status: 'ACTIVE' },
  { id: 'c3', code: 'THREADS10', title: 'Extra 10% off for followers', discount: '10% OFF', shopId: 'lucknowi-threads', validUntil: '10 Oct 2026', status: 'ACTIVE' },
  { id: 'c4', code: 'WEEKEND149', title: 'Weekend chai combo', discount: 'COMBO ₹149', shopId: 'cafe-aadab', validUntil: '5 Oct 2026', status: 'USED' },
  { id: 'c5', code: 'MONSOON15', title: 'Monsoon chai platter', discount: '₹50 OFF', shopId: 'royal-biryani-house', validUntil: '4 Oct 2026', status: 'EXPIRED' },
];

const FILTERS = ['All', 'Active', 'Used', 'Expired'] as const;

const STATUS_STYLES: Record<CouponStatus, { badge: string; icon: typeof Ticket }> = {
  ACTIVE: { badge: 'bg-emerald-100 text-emerald-700', icon: Ticket },
  USED: { badge: 'bg-slate-200 text-slate-500', icon: Check },
  EXPIRED: { badge: 'bg-red-100 text-red-600', icon: Clock },
};

export const CouponCodesPage = () => {
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>('All');

  const results = useMemo(() => {
    if (filter === 'All') return COUPONS;
    return COUPONS.filter((c) => c.status === filter.toUpperCase());
  }, [filter]);

  const handleCopy = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code);
      toast.success(`Code ${code} copied — show it at billing`);
    } catch {
      toast.error('Could not copy the code');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-100 text-violet-600">
          <Ticket size={20} />
        </div>
        <div className="space-y-1">
          <h1 className="text-3xl font-black tracking-tight text-slate-900">My Coupons</h1>
          <p className="text-sm text-slate-500">
            {COUPONS.filter((c) => c.status === 'ACTIVE').length} active discounts waiting for you
          </p>
        </div>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1">
        {FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={cn(
              'shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition-all',
              filter === f
                ? 'bg-slate-900 text-white shadow'
                : 'bg-white text-slate-600 ring-1 ring-slate-200 hover:ring-slate-300'
            )}
          >
            {f}
          </button>
        ))}
      </div>

      {results.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2">
          {results.map((coupon) => {
            const shop = SHOPS.find((s) => s.id === coupon.shopId);
            const meta = STATUS_STYLES[coupon.status];
            const isActive = coupon.status === 'ACTIVE';
            return (
              <Card
                key={coupon.id}
                className={cn('overflow-hidden transition-shadow hover:shadow-lg', !isActive && 'opacity-75')}
              >
                <div className="flex">
                  <div className="relative w-28 shrink-0">
                    {shop ? (
                      <img src={shop.image} alt={shop.name} loading="lazy" className="h-full w-full object-cover" />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-violet-100">
                        <Ticket size={24} className="text-violet-400" />
                      </div>
                    )}
                  </div>
                  <div className="min-w-0 flex-1 space-y-2 p-4">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-extrabold text-slate-900">{coupon.title}</p>
                        <p className="text-xs text-slate-500">{shop?.name}</p>
                      </div>
                      <span className={cn('inline-flex shrink-0 items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-extrabold', meta.badge)}>
                        <meta.icon size={11} />
                        {coupon.status}
                      </span>
                    </div>
                    <p className="text-lg font-black tracking-wide text-violet-700">{coupon.discount}</p>
                    <div className="flex items-center justify-between gap-2 border-t border-dashed border-slate-200 pt-2.5">
                      <span className="font-mono text-sm font-black tracking-widest text-slate-800">{coupon.code}</span>
                      {isActive ? (
                        <button
                          onClick={() => handleCopy(coupon.code)}
                          className="inline-flex items-center gap-1 rounded-lg bg-slate-900 px-2.5 py-1.5 text-[11px] font-bold text-white hover:bg-slate-700"
                        >
                          <Copy size={12} /> Copy
                        </button>
                      ) : (
                        <span className="text-[11px] font-semibold text-slate-400">Valid till {coupon.validUntil}</span>
                      )}
                    </div>
                    {isActive && (
                      <p className="flex items-center gap-1 text-[11px] font-medium text-slate-400">
                        <Clock size={11} /> Valid till {coupon.validUntil} · one-time use
                      </p>
                    )}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      ) : (
        <div className="flex flex-col items-center space-y-2 rounded-2xl border border-dashed border-slate-200 bg-white py-14 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-slate-400">
            <SearchX size={26} />
          </div>
          <p className="font-bold text-slate-800">No {filter.toLowerCase()} coupons</p>
          <Link to="/customer/discover" className="text-sm font-bold text-amber-600 hover:text-amber-700">
            Discover shops to earn more
          </Link>
        </div>
      )}
    </div>
  );
};
