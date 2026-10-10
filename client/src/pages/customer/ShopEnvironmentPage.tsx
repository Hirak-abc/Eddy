import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  BadgeCheck,
  Check,
  Clock,
  Coins,
  Copy,
  Gift,
  MapPin,
  Percent,
  Phone,
  QrCode,
  Sparkles,
  Star,
  Store,
  Ticket,
  Trophy,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { getShopById } from '@/data/shops';
import { cn } from '@/lib/utils';

const FREE_ITEM_BY_SHOP: Record<string, string> = {
  'sharma-sweets': 'Free Jalebi (250 g)',
  'cafe-aadab': 'Free Cold Coffee',
  'lucknowi-threads': 'Free Fall-Pico on any saree',
  'royal-biryani-house': 'Free Gulab Jamun (2 pc)',
  'glow-grace-salon': 'Free Head Massage (15 min)',
  techgully: 'Free Screen Guard',
};

const GalleryImage = ({ src, alt, className }: { src: string; alt: string; className?: string }) => {
  const [failed, setFailed] = useState(false);
  if (failed) {
    return (
      <div className={cn('flex items-center justify-center bg-gradient-to-br from-amber-100 to-slate-100', className)}>
        <Store size={32} className="text-amber-300" />
      </div>
    );
  }
  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      onError={() => setFailed(true)}
      className={cn('object-cover', className)}
    />
  );
};

const renderStars = (rating: number, size = 15) => (
  <span className="inline-flex items-center gap-0.5">
    {[1, 2, 3, 4, 5].map((star) => (
      <Star
        key={star}
        size={size}
        className={star <= Math.round(rating) ? 'fill-amber-400 text-amber-400' : 'text-slate-300'}
      />
    ))}
  </span>
);

export const ShopEnvironmentPage = () => {
  const { businessId, shopId } = useParams<{ businessId?: string; shopId?: string }>();
  const shop = getShopById(businessId ?? shopId);
  const [copied, setCopied] = useState(false);

  if (!shop) {
    return (
      <div className="space-y-6 p-4 sm:p-6">
        <Button asChild className="bg-slate-900 font-semibold text-white hover:bg-slate-700">
          <Link to="/customer/discover">
            <ArrowLeft size={16} className="mr-1.5" />
            Back to shops
          </Link>
        </Button>
        <Card>
          <CardContent className="flex flex-col items-center space-y-3 p-12 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-slate-400">
              <Store size={26} />
            </div>
            <div>
              <p className="font-bold text-slate-800">Shop not found</p>
              <p className="mt-1 text-sm text-slate-500">
                This shop is not participating yet or the link is incorrect.
              </p>
            </div>
            <Link
              to="/customer/discover"
              className="rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-bold text-white hover:bg-slate-700"
            >
              Browse shops
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const freeItem = FREE_ITEM_BY_SHOP[shop.id] ?? 'Surprise gift';
  const rewards = [
    { icon: Trophy, label: '10 Eddy Coins', detail: 'On every valid QR scan', color: 'bg-amber-100 text-amber-600' },
    { icon: Percent, label: shop.offer, detail: `Use code ${shop.couponCode}`, color: 'bg-rose-100 text-rose-600' },
    { icon: Gift, label: freeItem, detail: 'Lucky spin prize', color: 'bg-emerald-100 text-emerald-600' },
    { icon: Coins, label: 'Up to 50 Coins', detail: 'Mega-win slab', color: 'bg-violet-100 text-violet-600' },
  ];

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shop.couponCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className="space-y-6 p-4 sm:p-6">
      {/* ── Back ──────────────────────────────────────────────── */}
      <Button asChild className="bg-slate-900 font-semibold text-white hover:bg-slate-700">
        <Link to="/customer/discover">
          <ArrowLeft size={16} className="mr-1.5" />
          Back to shops
        </Link>
      </Button>

      {/* ── Shop header ───────────────────────────────────────── */}
      <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm">
        <div className="relative h-60 bg-gradient-to-r from-emerald-800 via-emerald-700 to-amber-600 sm:h-80">
          <GalleryImage src={shop.gallery[0]} alt={shop.name} className="h-full w-full" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
          <div className="absolute bottom-3 left-5 right-5 flex flex-wrap items-center gap-2">
            <span
              className={cn(
                'inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-bold text-white shadow',
                shop.openNow ? 'bg-emerald-500' : 'bg-slate-700'
              )}
            >
              <span className={cn('h-1.5 w-1.5 rounded-full', shop.openNow ? 'animate-pulse bg-white' : 'bg-slate-300')} />
              {shop.openNow ? 'Open now · till 10 PM' : 'Closed · opens 10 AM'}
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-black/55 px-2.5 py-1 text-[11px] font-bold text-white backdrop-blur">
              <Star size={12} className="fill-amber-400 text-amber-400" />
              {shop.rating.toFixed(1)} ({shop.reviewCount} reviews)
            </span>
          </div>
        </div>

        <div className="px-5 pb-5 sm:px-6">
          <div className="mb-4 mt-[-2.5rem] flex items-end gap-4">
            <div className="h-20 w-20 shrink-0 overflow-hidden rounded-2xl border-4 border-white bg-amber-50 shadow-md">
              <GalleryImage src={shop.image} alt={shop.name} className="h-full w-full" />
            </div>
            <div className="min-w-0 flex-1 pb-0.5">
              <h1 className="flex flex-wrap items-center gap-2 text-2xl font-extrabold text-slate-900">
                {shop.name}
                <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[11px] font-bold text-emerald-700">
                  <BadgeCheck size={13} />
                  Verified
                </span>
              </h1>
              <p className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-sm text-slate-500">
                <span className="font-medium text-slate-600">{shop.category}</span>
                <span aria-hidden>·</span>
                <span className="inline-flex items-center gap-1">
                  <MapPin size={13} />
                  {shop.area} · {shop.distanceKm.toFixed(1)} km away
                </span>
              </p>
              <p className="mt-1 flex items-center gap-2 text-sm">
                {renderStars(shop.rating)}
                <span className="font-bold text-slate-800">{shop.rating.toFixed(1)}</span>
                <span className="text-slate-400">({shop.reviewCount})</span>
              </p>
            </div>
          </div>

          {/* ── Actions ─────────────────────────────────────── */}
          <div className="grid grid-cols-2 gap-2.5 sm:flex sm:flex-wrap">
            <Button asChild className="bg-emerald-600 font-semibold text-white hover:bg-emerald-700">
              <Link to="/customer/scan">
                <QrCode size={16} className="mr-1.5" />
                Scan QR
              </Link>
            </Button>
            <Button asChild className="bg-amber-500 font-semibold text-white hover:bg-amber-600">
              <Link to="/customer/spin-wheel">
                <Sparkles size={16} className="mr-1.5" />
                Spin & Win
              </Link>
            </Button>
            <Button asChild className="bg-slate-900 font-semibold text-white hover:bg-slate-700">
              <a href={`tel:${shop.phone.replace(/\s/g, '')}`}>
                <Phone size={16} className="mr-1.5" />
                Call Shop
              </a>
            </Button>
            <Button asChild className="bg-slate-900 font-semibold text-white hover:bg-slate-700">
              <Link to="/customer/review-rating">
                <Star size={16} className="mr-1.5" />
                Rate Visit
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* ── Stats ─────────────────────────────────────────────── */}
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-emerald-600">2</div>
            <div className="mt-1 text-xs text-slate-500">Active Offers</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-amber-600">{rewards.length}</div>
            <div className="mt-1 text-xs text-slate-500">Spin Rewards</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-slate-800">3</div>
            <div className="mt-1 text-xs text-slate-500">Scans Left Today</div>
          </CardContent>
        </Card>
      </div>

      {/* ── Photos ────────────────────────────────────────────── */}
      <Card className="overflow-hidden">
        <CardContent className="space-y-3 p-5">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-extrabold text-slate-900">Photos</h2>
            <span className="text-xs font-semibold text-slate-400">{shop.gallery.length} photos</span>
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <GalleryImage
              src={shop.gallery[0]}
              alt={`${shop.name} storefront`}
              className="h-60 w-full rounded-xl sm:col-span-2 sm:h-80"
            />
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-1">
              <GalleryImage src={shop.gallery[1]} alt={`${shop.name} highlight`} className="h-32 w-full rounded-xl sm:h-[154px]" />
              <GalleryImage src={shop.gallery[2]} alt={`${shop.name} interior`} className="h-32 w-full rounded-xl sm:h-[154px]" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ── Active offers ─────────────────────────────────────── */}
      <div>
        <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-slate-900">
          <Ticket size={20} className="text-emerald-600" />
          Active Offers
        </h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Card className="overflow-hidden">
            <div className="bg-gradient-to-r from-indigo-600 to-violet-600 px-5 py-4 text-white">
              <p className="text-[11px] font-bold uppercase tracking-wider text-indigo-200">Flyer coupon</p>
              <h3 className="mt-1 font-extrabold">{shop.offer}</h3>
            </div>
            <CardContent className="space-y-3 p-5">
              <div className="flex items-center justify-between gap-3 rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 px-4 py-3">
                <span className="text-lg font-black tracking-widest text-slate-900">{shop.couponCode}</span>
                <button
                  onClick={handleCopy}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-bold text-white hover:bg-slate-700"
                >
                  {copied ? <Check size={14} /> : <Copy size={14} />}
                  {copied ? 'Copied' : 'Copy'}
                </button>
              </div>
              <p className="flex items-center gap-1.5 text-xs font-semibold text-amber-600">
                <Clock size={14} />
                One-time use · valid for the next {shop.couponExpiryHours}h
              </p>
            </CardContent>
          </Card>

          <Card className="overflow-hidden">
            <div className="bg-gradient-to-r from-amber-500 to-orange-500 px-5 py-4 text-white">
              <p className="text-[11px] font-bold uppercase tracking-wider text-amber-100">Spin bonus</p>
              <h3 className="mt-1 font-extrabold">Spin & win at {shop.name}</h3>
            </div>
            <CardContent className="space-y-3 p-5">
              <p className="text-sm leading-relaxed text-slate-600">
                Every QR scan unlocks a spin — win {freeItem.toLowerCase()}, coins and discount coupons.
              </p>
              <Button asChild className="w-full bg-amber-500 font-semibold text-white hover:bg-amber-600">
                <Link to="/customer/spin-wheel">Spin the Wheel</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* ── Rewards ───────────────────────────────────────────── */}
      <div>
        <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-slate-900">
          <Sparkles size={20} className="text-amber-500" />
          Rewards at this shop
        </h2>
        <Card>
          <CardContent className="grid gap-1 p-2 sm:grid-cols-2">
            {rewards.map((reward) => (
              <div key={reward.label} className="flex items-center gap-4 rounded-xl px-4 py-3 transition-colors hover:bg-slate-50">
                <div className={cn('flex h-11 w-11 shrink-0 items-center justify-center rounded-xl', reward.color)}>
                  <reward.icon size={20} />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-bold text-slate-900">{reward.label}</p>
                  <p className="text-xs text-slate-500">{reward.detail}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* ── Visit info ────────────────────────────────────────── */}
      <Card className="border-transparent" style={{ backgroundColor: '#1E1E1E' }}>
        <CardContent className="space-y-3 p-5">
          <h2 className="text-base font-extrabold text-white">Visit info</h2>
          <p className="text-sm leading-relaxed text-white/70">{shop.description}</p>
          <div className="grid gap-2.5 text-sm text-white/80 sm:grid-cols-2">
            <span className="inline-flex items-center gap-2">
              <Clock size={15} className="shrink-0 text-amber-300" />
              Open daily · 10 AM – 10 PM
            </span>
            <a href={`tel:${shop.phone.replace(/\s/g, '')}`} className="inline-flex items-center gap-2 hover:text-amber-300">
              <Phone size={15} className="shrink-0 text-amber-300" />
              {shop.phone}
            </a>
            <span className="inline-flex items-center gap-2">
              <MapPin size={15} className="shrink-0 text-amber-300" />
              {shop.area}, Lucknow
            </span>
            <span className="inline-flex items-center gap-2">
              <QrCode size={15} className="shrink-0 text-amber-300" />
              3 free scans left today
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
