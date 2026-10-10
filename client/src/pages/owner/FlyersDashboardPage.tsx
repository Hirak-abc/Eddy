import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  Plus,
  Calendar,
  Clock,
  Send,
  Eye,
  Ticket,
  TrendingUp,
  Flame,
  CheckCircle2,
  Instagram,
  Facebook,
  Share2,
} from 'lucide-react';
import { useOwner, type ExtendedFlyer } from '@/context/OwnerContext';
import { ROUTES } from '@/lib/constants';
import { Button } from '@/components/ui/Button';
import { FlyerLightboxModal } from '@/components/FlyerLightboxModal';

export const FlyersDashboardPage = () => {
  const { trendFlyer, scheduledFlyers, publishedFlyers, publishFlyerNow } = useOwner();
  const [activeTab, setActiveTab] = useState<'ALL' | 'SCHEDULED' | 'PUBLISHED'>('ALL');
  const [selectedFlyerForModal, setSelectedFlyerForModal] = useState<ExtendedFlyer | null>(null);

  const allFlyers: ExtendedFlyer[] = [
    ...(trendFlyer ? [trendFlyer] : []),
    ...scheduledFlyers,
    ...publishedFlyers,
  ];

  const filteredFlyers = allFlyers.filter((f) => {
    if (activeTab === 'SCHEDULED') return f.status === 'SCHEDULED';
    if (activeTab === 'PUBLISHED') return f.status === 'PUBLISHED';
    return true;
  });

  const scheduledCount = allFlyers.filter((f) => f.status === 'SCHEDULED').length;
  const publishedCount = allFlyers.filter((f) => f.status === 'PUBLISHED').length;
  const totalReach = allFlyers.reduce((acc, f) => acc + (f.stats?.reach || 0), 0);

  return (
    <div className="space-y-6 pb-12">
      {/* ── Top Header ──────────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">AI Marketing</span>
            <span className="text-slate-300">•</span>
            <span className="text-xs font-medium text-slate-500">Campaign Management</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            AI Flyer Studio
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <Button asChild variant="outline" className="rounded-xl text-xs font-bold border-slate-200">
            <Link to={ROUTES.OWNER_TRENDS} className="flex items-center gap-1.5">
              <Flame size={14} className="text-amber-500" />
              <span>Trend Radar</span>
            </Link>
          </Button>

          <Button asChild className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs shadow-sm">
            <Link to={ROUTES.OWNER_CREATE_FLYER} className="flex items-center gap-1.5">
              <Plus size={15} />
              <span>Create AI Flyer</span>
            </Link>
          </Button>
        </div>
      </div>

      {/* ── Stats Summary Strip ─────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-2xs space-y-1">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Campaigns</span>
          <div className="text-2xl font-black text-slate-900 font-mono">{allFlyers.length}</div>
          <p className="text-[11px] text-slate-400">Created with xAI</p>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-2xs space-y-1">
          <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider flex items-center gap-1">
            <Clock size={12} /> Scheduled Queue
          </span>
          <div className="text-2xl font-black text-indigo-600 font-mono">{scheduledCount}</div>
          <p className="text-[11px] text-slate-400">48h auto-publish</p>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-2xs space-y-1">
          <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider flex items-center gap-1">
            <CheckCircle2 size={12} /> Live on Meta
          </span>
          <div className="text-2xl font-black text-emerald-600 font-mono">{publishedCount}</div>
          <p className="text-[11px] text-slate-400">Instagram & Facebook</p>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-2xs space-y-1">
          <span className="text-xs font-bold text-sky-600 uppercase tracking-wider flex items-center gap-1">
            <TrendingUp size={12} /> Total Social Reach
          </span>
          <div className="text-2xl font-black text-slate-900 font-mono">{totalReach.toLocaleString('en-IN')}</div>
          <p className="text-[11px] text-slate-400">+18% organic growth</p>
        </div>
      </div>

      {/* ── Tabs & Filter ───────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between border-b border-slate-200/80 pb-3">
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-2xl">
          {(['ALL', 'SCHEDULED', 'PUBLISHED'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === tab
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              {tab === 'ALL' && 'All Campaigns'}
              {tab === 'SCHEDULED' && `Scheduled (${scheduledCount})`}
              {tab === 'PUBLISHED' && `Published (${publishedCount})`}
            </button>
          ))}
        </div>

        <span className="text-xs text-slate-500 font-medium hidden sm:inline">
          Showing {filteredFlyers.length} flyer{filteredFlyers.length !== 1 ? 's' : ''}
        </span>
      </div>

      {/* ── Flyer Cards Grid ────────────────────────────────────────────────── */}
      {filteredFlyers.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-slate-200/80 space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto">
            <Sparkles size={24} />
          </div>
          <h3 className="font-bold text-slate-900">No flyers found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            You don't have any flyers in this view. Generate a high-converting promotional flyer using AI now.
          </p>
          <Button asChild className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs">
            <Link to={ROUTES.OWNER_CREATE_FLYER}>Generate First Flyer</Link>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredFlyers.map((flyer) => {
            const isPublished = flyer.status === 'PUBLISHED';
            return (
              <div
                key={flyer.id}
                className="bg-white rounded-3xl border border-slate-200/80 overflow-hidden shadow-2xs hover:shadow-md transition-all flex flex-col justify-between group"
              >
                <div>
                  {/* Flyer Image with Coupon Badge */}
                  <div className="relative aspect-4/3 bg-slate-100 overflow-hidden">
                    <img
                      src={flyer.imageUrl}
                      alt={flyer.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />

                    {/* Status Pill */}
                    <div className="absolute top-3 left-3">
                      <span
                        className={`text-[10px] font-extrabold px-2.5 py-1 rounded-full backdrop-blur-md uppercase tracking-wider ${
                          isPublished
                            ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-500/30'
                            : 'bg-indigo-950/80 text-indigo-300 border border-indigo-500/30'
                        }`}
                      >
                        {flyer.status}
                      </span>
                    </div>

                    {/* Quick Lightbox Preview Button */}
                    <button
                      onClick={() => setSelectedFlyerForModal(flyer)}
                      className="absolute top-3 right-3 p-2 rounded-xl bg-white/90 hover:bg-white text-slate-700 shadow-md backdrop-blur-xs transition-colors"
                      title="Preview Social Mockup"
                    >
                      <Eye size={15} />
                    </button>

                    {/* Attached Coupon Badge */}
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

                  {/* Body Content */}
                  <div className="p-4 space-y-2">
                    <h3 className="font-bold text-sm text-slate-900 line-clamp-1">{flyer.title}</h3>
                    <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                      {flyer.versions?.[flyer.selectedVersionId ? flyer.versions.findIndex((v) => v.id === flyer.selectedVersionId) : 0]?.caption || flyer.title}
                    </p>

                    {/* Meta Stats or Schedule info */}
                    {isPublished && flyer.stats ? (
                      <div className="pt-2 border-t border-slate-100 grid grid-cols-3 gap-1 text-center">
                        <div className="p-1.5 rounded-lg bg-slate-50">
                          <div className="text-[10px] text-slate-400">Reach</div>
                          <div className="text-xs font-bold text-slate-800 font-mono">
                            {flyer.stats.reach.toLocaleString('en-IN')}
                          </div>
                        </div>
                        <div className="p-1.5 rounded-lg bg-slate-50">
                          <div className="text-[10px] text-slate-400">Likes</div>
                          <div className="text-xs font-bold text-rose-600 font-mono">{flyer.stats.likes}</div>
                        </div>
                        <div className="p-1.5 rounded-lg bg-slate-50">
                          <div className="text-[10px] text-slate-400">Coupons</div>
                          <div className="text-xs font-bold text-emerald-600 font-mono">
                            {flyer.stats.couponsRedeemed}
                          </div>
                        </div>
                      </div>
                    ) : flyer.scheduledAt ? (
                      <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
                        <span className="flex items-center gap-1.5 text-indigo-600 font-bold">
                          <Clock size={13} /> Auto-Publishes in 48h
                        </span>
                        <span className="text-slate-400 text-[11px]">
                          {new Date(flyer.scheduledAt).toLocaleDateString('en-IN', {
                            month: 'short',
                            day: 'numeric',
                          })}
                        </span>
                      </div>
                    ) : null}
                  </div>
                </div>

                {/* Card Footer Actions */}
                <div className="p-4 pt-0 border-t border-slate-50 flex items-center justify-between gap-2 mt-2">
                  <Button
                    variant="outline"
                    onClick={() => setSelectedFlyerForModal(flyer)}
                    className="w-full text-xs font-bold rounded-xl border-slate-200 text-slate-700"
                  >
                    <Eye size={13} className="mr-1.5" /> Preview
                  </Button>

                  {!isPublished && (
                    <Button
                      onClick={() => publishFlyerNow(flyer.id)}
                      className="w-full bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-xs"
                    >
                      <Send size={13} className="mr-1.5" /> Publish Now
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ── Social Lightbox Modal ───────────────────────────────────────────── */}
      <FlyerLightboxModal
        flyer={selectedFlyerForModal}
        isOpen={!!selectedFlyerForModal}
        onClose={() => setSelectedFlyerForModal(null)}
        onPublishNow={(id) => publishFlyerNow(id)}
      />
    </div>
  );
};
