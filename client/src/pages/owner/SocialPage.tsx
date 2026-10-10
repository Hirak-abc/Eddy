import { useState } from 'react';
import {
  Instagram,
  Facebook,
  Share2,
  RefreshCw,
  Zap,
  Sliders,
  Copy,
  Eye,
  X,
  BarChart3,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import { useOwner } from '@/context/OwnerContext';
import { Button } from '@/components/ui/Button';

const SAMPLE_HASHTAGS = '#LucknowEats #HazratganjCafe #NavratriSpecial #ChaiLovers #EddyDeals';
const SAMPLE_CAPTION =
  'Celebrate this festive season at The Royal Chai and Cafe, Hazratganj. Flat 20% OFF festive combos with code NAVRATRI20. Valid 96 hours.';

export const SocialPage = () => {
  const { socialAccounts, toggleSocialConnection, updateSocialAutoPublish } = useOwner();

  const [isConnecting, setIsConnecting] = useState<string | null>(null);
  const [autoHashtags, setAutoHashtags] = useState(true);
  const [storyCrosspost, setStoryCrosspost] = useState(true);
  const [couponSticker, setCouponSticker] = useState(true);
  const [previewFormat, setPreviewFormat] = useState<'feed' | 'story'>('feed');
  const [showCaptionModal, setShowCaptionModal] = useState(false);
  const [showTokenModal, setShowTokenModal] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const handleToggleConnection = (platform: 'instagram' | 'facebook') => {
    const isCurrentlyConnected = socialAccounts[platform].connected;
    if (isCurrentlyConnected) {
      toggleSocialConnection(platform);
      toast.info(`Disconnected ${platform === 'instagram' ? 'Instagram' : 'Facebook'} account.`);
    } else {
      setIsConnecting(platform);
      setTimeout(() => {
        toggleSocialConnection(platform);
        setIsConnecting(null);
        toast.success(
          `Successfully connected ${platform === 'instagram' ? 'Instagram Business' : 'Facebook Page'}!`
        );
      }, 1000);
    }
  };

  const handleRefreshTokens = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
      setShowTokenModal(true);
      toast.success('Meta Graph API access tokens refreshed. Valid for 60 days.');
    }, 700);
  };

  const handlePrefToggle = (
    key: 'hashtags' | 'story' | 'coupon',
    value: boolean
  ) => {
    if (key === 'hashtags') setAutoHashtags(value);
    if (key === 'story') setStoryCrosspost(value);
    if (key === 'coupon') setCouponSticker(value);
    toast.success(`Publishing rule ${value ? 'enabled' : 'paused'}.`);
  };

  const handleCopyHashtags = async () => {
    try {
      await navigator.clipboard.writeText(SAMPLE_HASHTAGS);
      toast.success('Hashtag set copied to clipboard.');
    } catch {
      toast.error('Clipboard unavailable in this browser.');
    }
  };

  const handleCopyCaption = async () => {
    try {
      await navigator.clipboard.writeText(`${SAMPLE_CAPTION} ${autoHashtags ? SAMPLE_HASHTAGS : ''}`);
      toast.success('Caption copied. Paste it into Meta Business Suite to test.');
    } catch {
      toast.error('Clipboard unavailable in this browser.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 space-y-6 pb-12">
      {/* ── Top Header ── */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="mb-1 flex items-center gap-2">
            <span className="flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-indigo-600">
              <Share2 size={14} /> Multi-Channel Marketing
            </span>
            <span className="text-slate-300">•</span>
            <span className="text-xs font-medium text-slate-500">Meta Graph API and Social Publishing</span>
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
            Social Media Integrations
          </h1>
          <p className="mt-1 max-w-2xl text-sm text-slate-500">
            Connect Meta accounts once. Eddy drafts festival flyers and publishes them after your 48-hour review window.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Link
            to="/owner/analytics"
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-slate-700 shadow-sm transition hover:bg-slate-50"
          >
            <BarChart3 size={14} className="text-indigo-600" />
            View Reach Analytics
          </Link>
          <Button
            onClick={handleRefreshTokens}
            variant="outline"
            disabled={refreshing}
            className="flex items-center gap-1.5 rounded-xl border-slate-200 bg-white text-xs font-bold text-slate-700"
          >
            <RefreshCw size={14} className={refreshing ? 'animate-spin' : ''} />
            <span>{refreshing ? 'Refreshing...' : 'Refresh Meta Tokens'}</span>
          </Button>
        </div>
      </div>

      {/* ── Meta status ── */}
      <div className="flex flex-col justify-between gap-4 rounded-3xl bg-gradient-to-r from-indigo-900 via-slate-900 to-indigo-950 p-5 text-white shadow-md sm:flex-row sm:items-center sm:p-6">
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-indigo-300">
              <Zap size={13} className="text-amber-400" /> Meta Graph API V20.0
            </span>
            <span className="rounded-full border border-emerald-500/30 bg-emerald-500/20 px-2 py-0.5 text-[10px] font-bold text-emerald-300">
              Healthy
            </span>
          </div>
          <h3 className="text-lg font-bold text-white">Automated Flyer and Story Publishing</h3>
          <p className="max-w-xl text-xs leading-relaxed text-slate-300">
            Instagram reach last 7 days: 8,240 impressions. Facebook Page reach: 3,180. Tokens auto-renew 5 days before expiry.
          </p>
          <div className="flex flex-wrap gap-2 pt-2">
            <button
              type="button"
              onClick={() => setShowCaptionModal(true)}
              className="inline-flex items-center gap-1.5 rounded-lg bg-white/10 px-3 py-1.5 text-xs font-bold text-white transition hover:bg-white/20"
            >
              <Eye size={13} /> Preview Auto Caption
            </button>
            <button
              type="button"
              onClick={() => setShowTokenModal(true)}
              className="inline-flex items-center gap-1.5 rounded-lg bg-white/10 px-3 py-1.5 text-xs font-bold text-white transition hover:bg-white/20"
            >
              Token Health Details
            </button>
          </div>
        </div>

        <div className="shrink-0 space-y-0.5 rounded-2xl border border-white/10 bg-white/10 p-4 text-center backdrop-blur-xs">
          <div className="text-[11px] font-semibold uppercase text-indigo-200">Review Window</div>
          <div className="font-mono text-xl font-black text-amber-300">48 Hours</div>
          <div className="text-[11px] text-slate-300">2 flyers awaiting review</div>
        </div>
      </div>

      {/* ── Accounts grid ── */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Instagram */}
        <div className="flex flex-col justify-between space-y-5 rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm">
          <div className="space-y-4">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 text-white shadow-md shadow-rose-500/20">
                  <Instagram size={24} />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Instagram Business</h3>
                  <p className="text-xs text-slate-500">Feed Posts and Stories</p>
                </div>
              </div>
              <span
                className={`rounded-full border px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider ${
                  socialAccounts.instagram.connected
                    ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                    : 'border-slate-200 bg-slate-100 text-slate-500'
                }`}
              >
                {socialAccounts.instagram.connected ? 'Connected' : 'Disconnected'}
              </span>
            </div>

            {socialAccounts.instagram.connected ? (
              <div className="space-y-3 pt-1">
                <div className="space-y-1 rounded-2xl border border-slate-100 bg-slate-50 p-3">
                  <div className="text-[10px] font-bold uppercase text-slate-400">Connected Handle</div>
                  <div className="font-mono text-sm font-bold text-slate-900">
                    {socialAccounts.instagram.username}
                  </div>
                  <button
                    type="button"
                    onClick={handleCopyHashtags}
                    className="mt-1 inline-flex items-center gap-1 text-[11px] font-bold text-indigo-600 hover:text-indigo-800"
                  >
                    <Copy size={12} /> Copy hashtag set
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="rounded-2xl border border-slate-100 bg-slate-50 p-3">
                    <span className="block text-[10px] font-semibold uppercase text-slate-400">Followers</span>
                    <strong className="font-mono text-base font-black text-slate-900">
                      {socialAccounts.instagram.followers?.toLocaleString('en-IN')}
                    </strong>
                  </div>
                  <div className="rounded-2xl border border-slate-100 bg-slate-50 p-3">
                    <span className="block text-[10px] font-semibold uppercase text-slate-400">Token Health</span>
                    <strong className="font-mono text-base font-black text-emerald-600">
                      {socialAccounts.instagram.tokenExpiresDays}d left
                    </strong>
                  </div>
                </div>
                <div className="flex items-center justify-between rounded-2xl border border-indigo-100 bg-indigo-50/60 p-3">
                  <div>
                    <div className="text-xs font-bold text-indigo-950">48h Auto-Publish</div>
                    <div className="text-[11px] text-indigo-700">Auto-post scheduled AI flyers</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={socialAccounts.instagram.autoPublish}
                    onChange={(e) => {
                      updateSocialAutoPublish('instagram', e.target.checked);
                      toast.success(`Instagram auto-publish ${e.target.checked ? 'on' : 'off'}.`);
                    }}
                    className="h-4 w-4 cursor-pointer rounded accent-indigo-600"
                    aria-label="Toggle Instagram auto publish"
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-2 rounded-2xl border border-slate-200/60 bg-slate-50 p-6 text-center">
                <p className="text-xs leading-relaxed text-slate-500">
                  Connect your Instagram Professional account to enable 1-click publishing and live reach tracking.
                </p>
              </div>
            )}
          </div>
          <div className="border-t border-slate-100 pt-4">
            <Button
              onClick={() => handleToggleConnection('instagram')}
              disabled={isConnecting === 'instagram'}
              className={`w-full rounded-xl py-2.5 text-xs font-bold ${
                socialAccounts.instagram.connected
                  ? 'border border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100'
                  : 'bg-gradient-to-r from-purple-600 to-rose-600 text-white shadow-sm hover:from-purple-700 hover:to-rose-700'
              }`}
            >
              {isConnecting === 'instagram'
                ? 'Connecting via Meta...'
                : socialAccounts.instagram.connected
                  ? 'Disconnect Instagram'
                  : 'Connect Instagram Business'}
            </Button>
          </div>
        </div>

        {/* Facebook */}
        <div className="flex flex-col justify-between space-y-5 rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm">
          <div className="space-y-4">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-md shadow-blue-600/20">
                  <Facebook size={24} />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Facebook Page</h3>
                  <p className="text-xs text-slate-500">Business Page Feed</p>
                </div>
              </div>
              <span
                className={`rounded-full border px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider ${
                  socialAccounts.facebook.connected
                    ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                    : 'border-slate-200 bg-slate-100 text-slate-500'
                }`}
              >
                {socialAccounts.facebook.connected ? 'Connected' : 'Disconnected'}
              </span>
            </div>

            {socialAccounts.facebook.connected ? (
              <div className="space-y-3 pt-1">
                <div className="space-y-1 rounded-2xl border border-slate-100 bg-slate-50 p-3">
                  <div className="text-[10px] font-bold uppercase text-slate-400">Connected Page</div>
                  <div className="truncate text-sm font-bold text-slate-900">
                    {socialAccounts.facebook.pageName}
                  </div>
                  <button
                    type="button"
                    onClick={handleCopyCaption}
                    className="mt-1 inline-flex items-center gap-1 text-[11px] font-bold text-blue-700 hover:text-blue-900"
                  >
                    <Copy size={12} /> Copy test caption
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="rounded-2xl border border-slate-100 bg-slate-50 p-3">
                    <span className="block text-[10px] font-semibold uppercase text-slate-400">Page Likes</span>
                    <strong className="font-mono text-base font-black text-slate-900">
                      {socialAccounts.facebook.likes?.toLocaleString('en-IN')}
                    </strong>
                  </div>
                  <div className="rounded-2xl border border-slate-100 bg-slate-50 p-3">
                    <span className="block text-[10px] font-semibold uppercase text-slate-400">Token Health</span>
                    <strong className="font-mono text-base font-black text-emerald-600">
                      {socialAccounts.facebook.tokenExpiresDays}d left
                    </strong>
                  </div>
                </div>
                <div className="flex items-center justify-between rounded-2xl border border-blue-100 bg-blue-50/60 p-3">
                  <div>
                    <div className="text-xs font-bold text-blue-950">48h Auto-Publish</div>
                    <div className="text-[11px] text-blue-700">Cross-post flyers automatically</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={socialAccounts.facebook.autoPublish}
                    onChange={(e) => {
                      updateSocialAutoPublish('facebook', e.target.checked);
                      toast.success(`Facebook auto-publish ${e.target.checked ? 'on' : 'off'}.`);
                    }}
                    className="h-4 w-4 cursor-pointer rounded accent-blue-600"
                    aria-label="Toggle Facebook auto publish"
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-2 rounded-2xl border border-slate-200/60 bg-slate-50 p-6 text-center">
                <p className="text-xs leading-relaxed text-slate-500">
                  Connect your Facebook Business page to syndicate marketing flyers and festival offers.
                </p>
              </div>
            )}
          </div>
          <div className="border-t border-slate-100 pt-4">
            <Button
              onClick={() => handleToggleConnection('facebook')}
              disabled={isConnecting === 'facebook'}
              className={`w-full rounded-xl py-2.5 text-xs font-bold ${
                socialAccounts.facebook.connected
                  ? 'border border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100'
                  : 'bg-blue-600 text-white shadow-sm hover:bg-blue-700'
              }`}
            >
              {isConnecting === 'facebook'
                ? 'Connecting via Meta...'
                : socialAccounts.facebook.connected
                  ? 'Disconnect Facebook'
                  : 'Connect Facebook Page'}
            </Button>
          </div>
        </div>
      </div>

      {/* ── Preferences ── */}
      <div className="space-y-4 rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <Sliders size={18} className="text-indigo-600" />
            <h3 className="text-base font-bold text-slate-900">Automation and Publishing Rules</h3>
          </div>
          <div className="flex rounded-xl bg-slate-100 p-1 text-xs font-bold">
            {(['feed', 'story'] as const).map((f) => (
              <button
                key={f}
                type="button"
                onClick={() => {
                  setPreviewFormat(f);
                  toast.info(`Caption preview switched to ${f === 'feed' ? 'Feed' : 'Story'} format.`);
                }}
                className={`rounded-lg px-3 py-1.5 transition ${
                  previewFormat === f ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                {f === 'feed' ? 'Feed Preview' : 'Story Preview'}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {[
            { key: 'hashtags' as const, title: 'Smart Local Hashtags', desc: 'Append Lucknow and festival hashtags for discovery.', value: autoHashtags },
            { key: 'story' as const, title: 'Instagram Story Sync', desc: previewFormat === 'story' ? 'Story cutout: 9:16 vertical, coupon sticker at bottom.' : 'Feed cutout: 4:5 vertical with caption below.', value: storyCrosspost },
            { key: 'coupon' as const, title: 'Coupon Promo Overlay', desc: 'Include 96-hour promo code in graphics and caption.', value: couponSticker },
          ].map((item) => (
            <div key={item.key} className="flex items-start justify-between gap-3 rounded-2xl border border-slate-200 bg-slate-50/70 p-4">
              <div>
                <div className="text-xs font-bold text-slate-900">{item.title}</div>
                <p className="mt-0.5 text-[11px] leading-relaxed text-slate-500">{item.desc}</p>
              </div>
              <input
                type="checkbox"
                checked={item.value}
                onChange={(e) => handlePrefToggle(item.key, e.target.checked)}
                className="mt-0.5 h-4 w-4 cursor-pointer rounded accent-indigo-600"
                aria-label={item.title}
              />
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-2 rounded-2xl border border-slate-100 bg-slate-50 p-4 text-xs sm:flex-row sm:items-center sm:justify-between">
          <p className="text-slate-600">
            Next auto-post: <strong className="text-slate-900">Navratri Royal Thali flyer</strong> in 31 hours unless edited.
          </p>
          <Link
            to="/owner/coupons"
            className="inline-flex items-center justify-center rounded-lg bg-slate-900 px-3 py-2 text-[11px] font-bold text-white hover:bg-slate-800"
          >
            Review Flyer Coupons
          </Link>
        </div>
      </div>

      {/* Caption modal */}
      {showCaptionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-slate-950/70" onClick={() => setShowCaptionModal(false)} />
          <div className="relative z-10 w-full max-w-md space-y-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900">Auto Caption ({previewFormat})</h3>
              <button type="button" onClick={() => setShowCaptionModal(false)} className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700" aria-label="Close caption preview">
                <X size={18} />
              </button>
            </div>
            <p className="rounded-2xl bg-slate-50 p-4 text-xs leading-relaxed text-slate-700">
              {SAMPLE_CAPTION} {couponSticker ? 'Code NAVRATRI20 auto-stamped on artwork. ' : ''}
              {autoHashtags ? SAMPLE_HASHTAGS : ''}
            </p>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowCaptionModal(false)} className="rounded-xl text-xs">Close</Button>
              <Button onClick={handleCopyCaption} className="rounded-xl bg-indigo-600 text-xs font-bold text-white hover:bg-indigo-700">Copy Caption</Button>
            </div>
          </div>
        </div>
      )}

      {/* Token modal */}
      {showTokenModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-slate-950/70" onClick={() => setShowTokenModal(false)} />
          <div className="relative z-10 w-full max-w-md space-y-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900">Meta Token Health</h3>
              <button type="button" onClick={() => setShowTokenModal(false)} className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700" aria-label="Close token details">
                <X size={18} />
              </button>
            </div>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between rounded-xl bg-slate-50 p-3"><span className="text-slate-500">Instagram token</span><strong className="font-mono text-emerald-700">{socialAccounts.instagram.tokenExpiresDays} days left</strong></div>
              <div className="flex justify-between rounded-xl bg-slate-50 p-3"><span className="text-slate-500">Facebook token</span><strong className="font-mono text-emerald-700">{socialAccounts.facebook.tokenExpiresDays} days left</strong></div>
              <div className="flex justify-between rounded-xl bg-slate-50 p-3"><span className="text-slate-500">Last sync</span><strong className="text-slate-900">Today, 9:40 AM IST</strong></div>
            </div>
            <div className="flex justify-end">
              <Button onClick={() => { setShowTokenModal(false); toast.success('Token report saved to activity log.'); }} className="rounded-xl bg-slate-900 text-xs font-bold text-white hover:bg-slate-800">Done</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
