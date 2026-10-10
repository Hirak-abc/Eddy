import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Clock,
  Sparkles,
  Send,
  Eye,
  Trash2,
  Calendar,
  Ticket,
  Plus,
  Info,
  Layers,
} from 'lucide-react';
import { toast } from 'sonner';
import { useOwner, type ExtendedFlyer } from '@/context/OwnerContext';
import { ROUTES } from '@/lib/constants';
import { Button } from '@/components/ui/Button';
import { FlyerLightboxModal } from '@/components/FlyerLightboxModal';

export const ScheduledFlyersPage = () => {
  const { flyers, publishFlyerNow, deleteFlyer } = useOwner();
  const [selectedFlyer, setSelectedFlyer] = useState<ExtendedFlyer | null>(null);

  const scheduledFlyers = flyers.filter((f) => f.status === 'SCHEDULED');

  return (
    <div className="space-y-6 pb-12">
      {/* ── Top Header ──────────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">AI Marketing</span>
            <span className="text-slate-300">•</span>
            <span className="text-xs font-medium text-slate-500">Auto-Publish Queue</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Scheduled Flyers
          </h1>
        </div>

        <Button asChild className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs shadow-sm">
          <Link to={ROUTES.OWNER_CREATE_FLYER} className="flex items-center gap-1.5">
            <Plus size={15} />
            <span>Create New Flyer</span>
          </Link>
        </Button>
      </div>

      {/* ── 48-Hour Auto-Review Explanation Banner ──────────────────────────── */}
      <div className="p-4 rounded-2xl bg-indigo-50/70 border border-indigo-200/80 flex items-start gap-3">
        <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0">
          <Info size={16} />
        </div>
        <div className="space-y-1">
          <h4 className="text-xs font-bold text-slate-900">48-Hour AI Review Window Active</h4>
          <p className="text-xs text-slate-600 leading-relaxed">
            Eddy generates flyer campaigns based on local trends and queues them here. You have 48 hours to review,
            swap AI variations, or customize coupon codes before they automatically publish to your Instagram and
            Facebook channels.
          </p>
        </div>
      </div>

      {/* ── Scheduled Flyers Grid ───────────────────────────────────────────── */}
      {scheduledFlyers.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-slate-200/80 space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto">
            <Clock size={24} />
          </div>
          <h3 className="font-bold text-slate-900">No scheduled flyers in queue</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Eddy AI automatically schedules flyers for upcoming festivals and local trends. You can also build one manually.
          </p>
          <Button asChild className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs">
            <Link to={ROUTES.OWNER_CREATE_FLYER}>Generate AI Campaign</Link>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {scheduledFlyers.map((flyer) => (
            <div
              key={flyer.id}
              className="bg-white rounded-3xl border border-slate-200/80 overflow-hidden shadow-2xs hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                {/* Visual Thumbnail */}
                <div className="relative aspect-4/3 bg-slate-100 overflow-hidden">
                  <img src={flyer.imageUrl} alt={flyer.title} className="w-full h-full object-cover" />

                  {/* Countdown Badge */}
                  <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-slate-950/80 backdrop-blur-md text-white text-[11px] font-bold flex items-center gap-1.5 shadow-md">
                    <Clock size={12} className="text-amber-400" />
                    <span>Auto-Publishes in ~36h</span>
                  </div>

                  {/* Attached Coupon */}
                  {flyer.couponCode && (
                    <div className="absolute bottom-3 left-3 right-3 px-3 py-1.5 rounded-xl bg-indigo-950/85 backdrop-blur-md text-white text-xs font-bold flex items-center justify-between">
                      <span className="flex items-center gap-1.5">
                        <Ticket size={12} className="text-amber-400" />
                        Code: {flyer.couponCode}
                      </span>
                      <span className="text-[10px] text-amber-300 font-extrabold">96h Deal</span>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-4 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 border border-indigo-200">
                      {flyer.category || 'AI SPECIAL'}
                    </span>
                    {flyer.versions && (
                      <span className="text-[10px] font-semibold text-slate-500 flex items-center gap-1">
                        <Layers size={11} />
                        {flyer.versions.length} AI Variants
                      </span>
                    )}
                  </div>

                  <h3 className="font-bold text-sm text-slate-900 line-clamp-1">{flyer.title}</h3>
                  <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">{flyer.content}</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="p-4 pt-0 border-t border-slate-50 grid grid-cols-3 gap-2 mt-3">
                <Button
                  variant="outline"
                  onClick={() => setSelectedFlyer(flyer)}
                  className="text-xs font-bold rounded-xl border-slate-200 text-slate-700"
                >
                  <Eye size={13} className="mr-1" /> View
                </Button>

                <Button
                  onClick={() => {
                    publishFlyerNow(flyer.id);
                    toast.success('Flyer published live now!');
                  }}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-xs"
                >
                  <Send size={13} className="mr-1" /> Publish
                </Button>

                <Button
                  variant="outline"
                  onClick={() => {
                    deleteFlyer(flyer.id);
                    toast.success('Flyer removed from schedule.');
                  }}
                  className="border-slate-200 text-rose-600 hover:bg-rose-50 hover:border-rose-300 text-xs font-bold rounded-xl"
                >
                  <Trash2 size={13} />
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
        onPublishNow={(id) => publishFlyerNow(id)}
      />
    </div>
  );
};
