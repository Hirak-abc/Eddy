import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  MapPin,
  Search,
  Star,
  Clock,
  Coins,
  BadgePercent,
  SearchX,
  Coffee,
  Shirt,
  UtensilsCrossed,
  Scissors,
  Cpu,
  Cookie,
  Store,
} from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { cn } from '@/lib/utils';
import { SHOPS, type Shop } from '@/data/shops';

const CATEGORY_ICONS: Record<string, typeof Store> = {
  'Sweets & Bakery': Cookie,
  'Café': Coffee,
  Fashion: Shirt,
  Restaurant: UtensilsCrossed,
  'Salon & Spa': Scissors,
  Electronics: Cpu,
};

const CATEGORIES = ['All', ...Array.from(new Set(SHOPS.map((s) => s.category)))];

const ShopImage = ({ shop }: { shop: Shop }) => {
  const [failed, setFailed] = useState(false);
  const FallbackIcon = CATEGORY_ICONS[shop.category] ?? Store;
  return (
    <div className="relative h-44 w-full overflow-hidden bg-gradient-to-br from-amber-100 via-orange-50 to-slate-100">
      {!failed ? (
        <img
          src={shop.image}
          alt={shop.name}
          loading="lazy"
          onError={() => setFailed(true)}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center">
          <FallbackIcon size={44} className="text-amber-300" />
        </div>
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent" />
      <span
        className={cn(
          'absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-bold shadow',
          shop.openNow ? 'bg-emerald-500 text-white' : 'bg-slate-700 text-white'
        )}
      >
        <span className={cn('h-1.5 w-1.5 rounded-full', shop.openNow ? 'bg-white animate-pulse' : 'bg-slate-300')} />
        {shop.openNow ? 'Open now' : 'Closed'}
      </span>
      <span className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-full bg-black/55 px-2.5 py-1 text-[11px] font-bold text-white backdrop-blur">
        <Star size={12} className="fill-amber-400 text-amber-400" />
        {shop.rating.toFixed(1)}
      </span>
    </div>
  );
};

export const ShopDiscoveryPage = () => {
  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return SHOPS.filter((shop) => {
      const matchesCategory = activeCategory === 'All' || shop.category === activeCategory;
      const matchesQuery =
        !q ||
        shop.name.toLowerCase().includes(q) ||
        shop.category.toLowerCase().includes(q) ||
        shop.area.toLowerCase().includes(q);
      return matchesCategory && matchesQuery;
    });
  }, [query, activeCategory]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
          <MapPin size={20} />
        </div>
        <div className="space-y-1">
          <h1 className="text-3xl font-black tracking-tight text-slate-900">Discover Shops</h1>
          <p className="text-sm text-slate-500">Find participating businesses near you</p>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search size={18} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search shops, categories or areas…"
          className="h-12 rounded-xl border-slate-200 pl-10 shadow-sm"
        />
      </div>

      {/* Category filters */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {CATEGORIES.map((category) => (
          <button
            key={category}
            onClick={() => setActiveCategory(category)}
            className={cn(
              'shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition-all',
              activeCategory === category
                ? 'bg-slate-900 text-white shadow'
                : 'bg-white text-slate-600 ring-1 ring-slate-200 hover:ring-slate-300'
            )}
          >
            {category}
          </button>
        ))}
      </div>

      <p className="text-sm text-slate-500">
        {results.length} {results.length === 1 ? 'shop' : 'shops'} found
        {activeCategory !== 'All' && (
          <>
            {' '}in <span className="font-semibold text-slate-700">{activeCategory}</span>
          </>
        )}
      </p>

      {/* Shop grid */}
      {results.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {results.map((shop) => (
            <Card
              key={shop.id}
              className="group overflow-hidden border-slate-200 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
            >
              <ShopImage shop={shop} />
              <div className="space-y-3 p-5">
                <div>
                  <h3 className="font-extrabold text-slate-900">{shop.name}</h3>
                  <p className="mt-0.5 flex items-center gap-1 text-xs font-medium text-slate-500">
                    <MapPin size={12} />
                    {shop.category} · {shop.area} · {shop.distanceKm.toFixed(1)} km away
                  </p>
                </div>

                <div className="flex items-center gap-3 text-xs text-slate-500">
                  <span className="inline-flex items-center gap-1">
                    <Star size={13} className="fill-amber-400 text-amber-400" />
                    <span className="font-bold text-slate-800">{shop.rating.toFixed(1)}</span>
                    <span>({shop.reviewCount})</span>
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <Clock size={13} />
                    {shop.openNow ? 'Open today till 10 PM' : 'Opens tomorrow 10 AM'}
                  </span>
                </div>

                <div className="flex items-center gap-2 rounded-xl bg-amber-50 px-3 py-2 text-xs font-semibold text-amber-800">
                  <BadgePercent size={15} className="shrink-0" />
                  {shop.offer}
                </div>

                <div className="flex items-center gap-1.5 text-xs font-medium text-emerald-700">
                  <Coins size={14} />
                  Accepts Eddy Coins
                </div>

                <Link
                  to={`/shop/${shop.id}`}
                  className="block w-full rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 py-2.5 text-center text-sm font-extrabold text-white shadow-md shadow-amber-200 transition-all hover:from-amber-600 hover:to-amber-700"
                >
                  Visit Shop
                </Link>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center space-y-3 rounded-2xl border border-dashed border-slate-200 bg-white py-16 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-slate-400">
            <SearchX size={26} />
          </div>
          <div>
            <p className="font-bold text-slate-800">No shops found</p>
            <p className="mt-1 text-sm text-slate-500">Try a different search or category.</p>
          </div>
          <button
            onClick={() => {
              setQuery('');
              setActiveCategory('All');
            }}
            className="rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-bold text-white transition-colors hover:bg-slate-700"
          >
            Clear filters
          </button>
        </div>
      )}
    </div>
  );
};
