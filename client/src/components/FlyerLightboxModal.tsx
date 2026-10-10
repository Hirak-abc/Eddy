import { useState } from 'react';
import {
  X,
  Instagram,
  Facebook,
  Share2,
  Calendar,
  Ticket,
  Eye,
  Heart,
  MessageCircle,
  Sparkles,
  Send,
  ExternalLink,
} from 'lucide-react';
import type { ExtendedFlyer } from '@/context/OwnerContext';
import { Button } from '@/components/ui/Button';

interface FlyerLightboxModalProps {
  flyer: ExtendedFlyer | null;
  isOpen: boolean;
  onClose: () => void;
  onPublishNow?: (flyerId: string) => void;
}

export const FlyerLightboxModal = ({
  flyer,
  isOpen,
  onClose,
  onPublishNow,
}: FlyerLightboxModalProps) => {
  const [activePlatform, setActivePlatform] = useState<'instagram' | 'facebook'>('instagram');
  const [activeVersionIndex, setActiveVersionIndex] = useState(0);

  if (!isOpen || !flyer) return null;

  const currentVersion = flyer.versions?.[activeVersionIndex] || {
    imageUrl: flyer.imageUrl,
    caption: flyer.content || 'Special seasonal promotion crafted by Eddy AI.',
    hashtags: ['#EddyLocal', '#ShopLocal', '#ExclusiveDeal'],
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative z-10 w-full max-w-4xl bg-white rounded-3xl overflow-hidden shadow-2xl border border-slate-200 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Sparkles size={16} />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm">{flyer.title || 'AI Flyer Preview'}</h3>
              <p className="text-xs text-slate-500">
                {flyer.status === 'PUBLISHED' ? 'Live on Social Media' : 'Ready for Publication'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Platform Selector */}
            <div className="flex items-center gap-1 p-1 bg-slate-200/80 rounded-xl">
              <button
                onClick={() => setActivePlatform('instagram')}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                  activePlatform === 'instagram'
                    ? 'bg-white text-rose-600 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Instagram size={13} />
                <span>Instagram</span>
              </button>
              <button
                onClick={() => setActivePlatform('facebook')}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                  activePlatform === 'facebook'
                    ? 'bg-white text-blue-600 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Facebook size={13} />
                <span>Facebook</span>
              </button>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Left: Feed Preview Frame */}
          <div className="md:col-span-7 flex flex-col items-center justify-center">
            {/* Social Post Mockup Card */}
            <div className="w-full max-w-sm rounded-2xl border border-slate-200 shadow-lg bg-white overflow-hidden text-slate-900">
              {/* Profile Header */}
              <div className="p-3 flex items-center justify-between border-b border-slate-100">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-600 to-amber-500 text-white font-bold text-xs flex items-center justify-center">
                    E
                  </div>
                  <div>
                    <div className="text-xs font-bold">theroyalchaicafe</div>
                    <div className="text-[10px] text-slate-400">Sponsored • Lucknow</div>
                  </div>
                </div>
                {activePlatform === 'instagram' ? (
                  <Instagram size={16} className="text-rose-500" />
                ) : (
                  <Facebook size={16} className="text-blue-600" />
                )}
              </div>

              {/* Flyer Image with Coupon Badge */}
              <div className="relative aspect-square bg-slate-100">
                <img
                  src={currentVersion.imageUrl}
                  alt="Flyer artwork"
                  className="w-full h-full object-cover"
                />
                {flyer.couponCode && (
                  <div className="absolute bottom-3 left-3 right-3 px-3 py-1.5 rounded-xl bg-indigo-900/90 backdrop-blur text-white text-xs font-bold flex items-center justify-between shadow-lg">
                    <span className="flex items-center gap-1.5">
                      <Ticket size={13} className="text-amber-400" />
                      Use Code: {flyer.couponCode}
                    </span>
                    <span className="text-[10px] bg-amber-400 text-slate-950 px-2 py-0.5 rounded font-extrabold">
                      96h Deal
                    </span>
                  </div>
                )}
              </div>

              {/* Engagement Icons & Caption */}
              <div className="p-3.5 space-y-2.5">
                <div className="flex items-center justify-between text-slate-600">
                  <div className="flex items-center gap-3">
                    <Heart size={18} className="hover:text-rose-500 cursor-pointer" />
                    <MessageCircle size={18} className="hover:text-indigo-600 cursor-pointer" />
                    <Share2 size={18} className="hover:text-indigo-600 cursor-pointer" />
                  </div>
                  <span className="text-[11px] font-bold text-slate-700">
                    {flyer.stats?.likes || 142} likes
                  </span>
                </div>

                <div className="text-xs text-slate-800 leading-snug">
                  <span className="font-bold mr-1.5">theroyalchaicafe</span>
                  {currentVersion.caption}
                </div>

                <div className="flex flex-wrap gap-1 pt-1">
                  {currentVersion.hashtags?.map((tag) => (
                    <span key={tag} className="text-[11px] text-indigo-600 font-semibold">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right: Metadata, AI Variations & Controls */}
          <div className="md:col-span-5 space-y-5 flex flex-col justify-between">
            <div className="space-y-4">
              {/* Campaign Status */}
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Status
                  </span>
                  <span
                    className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                      flyer.status === 'PUBLISHED'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                    }`}
                  >
                    {flyer.status}
                  </span>
                </div>
                {flyer.scheduledFor && (
                  <div className="flex items-center gap-1.5 text-xs text-slate-600">
                    <Calendar size={13} className="text-slate-400" />
                    <span>Scheduled for {new Date(flyer.scheduledFor).toLocaleDateString('en-IN', { dateStyle: 'medium' })}</span>
                  </div>
                )}
                {flyer.stats && (
                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-200/60 text-xs">
                    <div>
                      <span className="text-slate-400">Total Reach:</span>{' '}
                      <strong className="font-mono">{flyer.stats.reach.toLocaleString('en-IN')}</strong>
                    </div>
                    <div>
                      <span className="text-slate-400">Coupons Used:</span>{' '}
                      <strong className="font-mono text-emerald-600">{flyer.stats.couponsRedeemed}</strong>
                    </div>
                  </div>
                )}
              </div>

              {/* Version Switcher if multiple */}
              {flyer.versions && flyer.versions.length > 1 && (
                <div className="space-y-2">
                  <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    AI Variants Comparison
                  </span>
                  <div className="grid grid-cols-2 gap-2">
                    {flyer.versions.map((v, idx) => (
                      <button
                        key={v.id}
                        onClick={() => setActiveVersionIndex(idx)}
                        className={`p-2 rounded-xl text-xs font-bold border transition-all flex items-center gap-2 ${
                          activeVersionIndex === idx
                            ? 'bg-indigo-50 border-indigo-400 text-indigo-900 shadow-xs'
                            : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        <div className="w-5 h-5 rounded-lg bg-indigo-600 text-white flex items-center justify-center text-[10px]">
                          {String.fromCharCode(65 + idx)}
                        </div>
                        <span>Variant {String.fromCharCode(65 + idx)}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Attached Coupon Info */}
              {flyer.couponCode && (
                <div className="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200/80 flex items-center justify-between">
                  <div className="space-y-0.5">
                    <div className="text-xs font-bold text-amber-950">Linked Special Deal</div>
                    <div className="text-[11px] text-amber-800 font-mono">Code: {flyer.couponCode} (96h Validity)</div>
                  </div>
                  <Ticket size={18} className="text-amber-600" />
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2.5">
              <Button variant="outline" onClick={onClose} className="rounded-xl text-xs">
                Close
              </Button>
              {flyer.status !== 'PUBLISHED' && onPublishNow && (
                <Button
                  onClick={() => {
                    onPublishNow(flyer.id);
                    onClose();
                  }}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-sm"
                >
                  <Send size={14} />
                  <span>Publish Instantly</span>
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
