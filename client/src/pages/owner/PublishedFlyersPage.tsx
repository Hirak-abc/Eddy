import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  CheckCircle2,
  Eye,
  Heart,
  Share2,
  Ticket,
  Instagram,
  Facebook,
  TrendingUp,
  Plus,
  ExternalLink,
} from 'lucide-react';
import { useOwner, type ExtendedFlyer } from '@/context/OwnerContext';
import { ROUTES } from '@/lib/constants';
import { Button } from '@/components/ui/Button';
import { FlyerLightboxModal } from '@/components/FlyerLightboxModal';

export const PublishedFlyersPage = () => {
  const { flyers } = useOwner();
  const [selectedFlyer, setSelectedFlyer] = useState<ExtendedFlyer | null>(null);

  const publishedFlyers = flyers.filter((f) => f.status === 'PUBLISHED');

  const totalReach = publishedFlyers.reduce((acc, f) => acc + (f.stats?.reach || 0), 0);
  const totalLikes = publishedFlyers.reduce((acc, f) => acc + (f.stats?.likes || 0), 0);
  const totalRedeemed = publishedFlyers.reduce((acc, f) => acc + (f.stats?.couponsRedeemed || 0), 0);

  return (
    <div className="space-y-6 pb-12">
      {/* ── Top Header ──────────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">Live Marketing</span>
            <span className="text-slate-300">•</span>
            <span className="text-xs font-medium text-slate-500">Social Campaigns</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Published Social Flyers
          </h1>
        </div>

        <Button asChild className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs shadow-sm">
          <Link to={ROUTES.OWNER_CREATE_FLYER} className="flex items-center gap-1.5">
            <Plus size={15} />
            <span>Create New Flyer</span>
          </Link>
        </Button>
      </div>

      {/* ── Metric Highlights ───────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-2xs space-y-1">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Combined Reach</span>
          <div className="text-2xl font-black text-slate-900 font-mono">{totalReach.toLocaleString('en-IN')}</div>
          <p className="text-[11px] text-emerald-600 font-semibold">+24% vs last week</p>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-2xs space-y-1">
          <span className="text-xs font-bold text-rose-600 uppercase tracking-wider">Total Likes & Engagement</span>
          <div className="text-2xl font-black text-rose-600 font-mono">{totalLikes.toLocaleString('en-IN')}</div>
          <p className="text-[11px] text-slate-400">On Instagram & Facebook</p>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-2xs space-y-1">
          <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">Flyer Coupons Redeemed</span>
          <div className="text-2xl font-black text-emerald-600 font-mono">{totalRedeemed}</div>
          <p className="text-[11px] text-slate-400">In-store conversions</p>
        </div>
      </div>

      {/* ── Published Flyers Grid ───────────────────────────────────────────── */}
      {publishedFlyers.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-slate-200/80 space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
            <CheckCircle2 size={24} />
          </div>
          <h3 className="font-bold text-slate-900">No published flyers yet</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Once your scheduled flyers auto-publish or you publish one instantly, their live social performance will appear here.
          </p>
          <Button asChild className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs">
            <Link to={ROUTES.OWNER_CREATE_FLYER}>Publish First Flyer</Link>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {publishedFlyers.map((flyer) => (
            <div
              key={flyer.id}
              className="bg-white rounded-3xl border border-slate-200/80 overflow-hidden shadow-2xs hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                {/* Visual Image & Badges */}
                <div className="relative aspect-4/3 bg-slate-100 overflow-hidden">
                  <img src={flyer.imageUrl} alt={flyer.title} className="w-full h-full object-cover" />

                  {/* Live Status Badge */}
                  <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-emerald-950/85 backdrop-blur-md text-emerald-300 text-[10px] font-extrabold uppercase tracking-wider flex items-center gap-1.5 shadow-md">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span>Live on Meta</span>
                  </div>

                  {/* Connected channels */}
                  <div className="absolute top-3 right-3 flex items-center gap-1 bg-white/90 backdrop-blur-xs p-1.5 rounded-xl shadow-xs">
                    <Instagram size={14} className="text-rose-500" />
                    <Facebook size={14} className="text-blue-600" />
                  </div>

                  {/* Coupon Code Strip */}
                  {flyer.couponCode && (
                    <div className="absolute bottom-3 left-3 right-3 px-3 py-1.5 rounded-xl bg-slate-950/80 backdrop-blur-md text-white text-xs font-bold flex items-center justify-between">
                      <span className="flex items-center gap-1.5">
                        <Ticket size={12} className="text-amber-400" />
                        Code: {flyer.couponCode}
                      </span>
                      <span className="text-[10px] text-amber-400">96h Deal</span>
                    </div>
                  )}
                </div>

                {/* Content Details */}
                <div className="p-4 space-y-3">
                  <div>
                    <h3 className="font-bold text-sm text-slate-900 line-clamp-1">{flyer.title}</h3>
                    <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed mt-0.5">{flyer.content}</p>
                  </div>

                  {/* Performance Metric Pills */}
                  {flyer.stats && (
                    <div className="grid grid-cols-3 gap-2 text-center p-2 rounded-2xl bg-slate-50 border border-slate-100">
                      <div>
                        <div className="text-[10px] text-slate-400 uppercase font-semibold">Reach</div>
                        <div className="text-xs font-bold text-slate-900 font-mono">
                          {flyer.stats.reach.toLocaleString('en-IN')}
                        </div>
                      </div>
                      <div>
                        <div className="text-[10px] text-slate-400 uppercase font-semibold">Likes</div>
                        <div className="text-xs font-bold text-rose-600 font-mono">
                          {flyer.stats.likes}
                        </div>
                      </div>
                      <div>
                        <div className="text-[10px] text-slate-400 uppercase font-semibold">Redeemed</div>
                        <div className="text-xs font-bold text-emerald-600 font-mono">
                          {flyer.stats.couponsRedeemed}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="p-4 pt-0 border-t border-slate-50 flex items-center justify-between gap-2 mt-2">
                <Button
                  variant="outline"
                  onClick={() => setSelectedFlyer(flyer)}
                  className="w-full text-xs font-bold rounded-xl border-slate-200 text-slate-700"
                >
                  <Eye size={13} className="mr-1.5" /> Preview Social Card
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Lightbox Modal */}
      <FlyerLightboxModal
        flyer={selectedFlyer}
        isOpen={!!selectedFlyer}
        onClose={() => setSelectedFlyer(null)}
      />
    </div>
  );
};
