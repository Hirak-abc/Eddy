import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Star, MapPin, Store } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/Card';
import { toast } from 'sonner';
import { SHOPS } from '@/data/shops';

interface FollowedShop {
  shopId: string;
  visits: number;
  coinsEarned: number;
  isFavorite: boolean;
}

const INITIAL: FollowedShop[] = [
  { shopId: 'cafe-aadab', visits: 12, coinsEarned: 85, isFavorite: true },
  { shopId: 'sharma-sweets', visits: 8, coinsEarned: 42, isFavorite: false },
  { shopId: 'lucknowi-threads', visits: 4, coinsEarned: 20, isFavorite: false },
];

export const FollowingPage = () => {
  const [followed, setFollowed] = useState(INITIAL);

  const toggleFavorite = (shopId: string) =>
    setFollowed((prev) => prev.map((f) => (f.shopId === shopId ? { ...f, isFavorite: !f.isFavorite } : f)));

  const unfollow = (shopId: string, name: string) => {
    setFollowed((prev) => prev.filter((f) => f.shopId !== shopId));
    toast.success(`Unfollowed ${name}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-100 text-rose-600">
          <Heart size={20} />
        </div>
        <div className="space-y-1">
          <h1 className="text-3xl font-black tracking-tight text-slate-900">Following</h1>
          <p className="text-sm text-slate-500">
            {followed.length} {followed.length === 1 ? 'shop' : 'shops'} you follow for rewards
          </p>
        </div>
      </div>

      {followed.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2">
          {followed.map((entry) => {
            const shop = SHOPS.find((s) => s.id === entry.shopId);
            if (!shop) return null;
            return (
              <Card key={entry.shopId} className="overflow-hidden transition-shadow hover:shadow-lg">
                <div className="relative h-36">
                  <img src={shop.image} alt={shop.name} loading="lazy" className="h-full w-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/55 to-transparent" />
                  <button
                    onClick={() => toggleFavorite(entry.shopId)}
                    aria-label={entry.isFavorite ? 'Remove from favorites' : 'Mark as favorite'}
                    className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-black/45 text-white backdrop-blur transition-transform hover:scale-110"
                  >
                    <Heart size={17} className={entry.isFavorite ? 'fill-rose-500 text-rose-500' : ''} />
                  </button>
                  <div className="absolute bottom-2.5 left-3 right-3 flex items-end justify-between gap-2">
                    <div className="min-w-0">
                      <p className="truncate font-extrabold text-white">{shop.name}</p>
                      <p className="flex items-center gap-1 text-[11px] font-medium text-white/80">
                        <MapPin size={11} /> {shop.area} · {shop.category}
                      </p>
                    </div>
                    <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-black/55 px-2 py-0.5 text-[11px] font-bold text-white backdrop-blur">
                      <Star size={11} className="fill-amber-400 text-amber-400" />
                      {shop.rating.toFixed(1)}
                    </span>
                  </div>
                </div>
                <CardContent className="flex items-center gap-3 p-4">
                  <div className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-slate-100 py-2 text-sm font-extrabold text-slate-700">
                    {entry.visits} <span className="text-[11px] font-semibold text-slate-400">visits</span>
                  </div>
                  <div className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-amber-50 py-2 text-sm font-extrabold text-amber-700">
                    {entry.coinsEarned} <span className="text-[11px] font-semibold text-amber-500">coins</span>
                  </div>
                  <Link
                    to={`/shop/${shop.id}`}
                    className="flex-1 rounded-xl bg-slate-900 py-2 text-center text-sm font-bold text-white hover:bg-slate-700"
                  >
                    Open Shop
                  </Link>
                </CardContent>
                <button
                  onClick={() => unfollow(entry.shopId, shop.name)}
                  className="w-full border-t border-slate-100 py-2 text-xs font-semibold text-slate-400 hover:text-rose-600"
                >
                  Unfollow
                </button>
              </Card>
            );
          })}
        </div>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center space-y-2 p-12 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-slate-400">
              <Store size={26} />
            </div>
            <p className="font-bold text-slate-800">You’re not following any shops yet</p>
            <p className="text-sm text-slate-500">Follow shops to earn +10 coins on every platform.</p>
            <Link
              to="/customer/discover"
              className="rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-bold text-white hover:bg-slate-700"
            >
              Discover shops
            </Link>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
