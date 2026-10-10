import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Star,
  ShieldCheck,
  Sparkles,
  ExternalLink,
  Reply,
  CheckCircle2,
  Clock,
  AlertCircle,
  Send,
  HeartHandshake,
  Copy,
  Check,
  ArrowDownWideNarrow,
} from 'lucide-react';
import { toast } from 'sonner';
import { useOwner } from '@/context/OwnerContext';
import { Button } from '@/components/ui/Button';

type Filter = 'ALL' | 'NEEDS_ATTENTION' | 'GOOGLE' | 'RESOLVED';
type Sort = 'NEWEST' | 'LOWEST' | 'HIGHEST';

const TABS: { id: Filter; label: string }[] = [
  { id: 'ALL', label: 'All' },
  { id: 'NEEDS_ATTENTION', label: 'Needs Attention' },
  { id: 'GOOGLE', label: 'Google Redirects' },
  { id: 'RESOLVED', label: 'Resolved' },
];

export const ReviewsPage = () => {
  const { reviews, replyToReview, reviewStats } = useOwner();

  const [activeFilter, setActiveFilter] = useState<Filter>('ALL');
  const [sort, setSort] = useState<Sort>('NEWEST');
  const [replyInputs, setReplyInputs] = useState<Record<string, string>>({});
  const [activeReplyId, setActiveReplyId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const tabCounts = useMemo(
    () => ({
      ALL: reviews.length,
      NEEDS_ATTENTION: reviews.filter((r) => r.rating <= 3 && r.status === 'PENDING_REPLY').length,
      GOOGLE: reviews.filter((r) => r.status === 'GOOGLE_REDIRECTED').length,
      RESOLVED: reviews.filter((r) => r.status === 'REPLIED').length,
    }),
    [reviews]
  );

  const filteredReviews = useMemo(() => {
    const list = reviews.filter((r) => {
      if (activeFilter === 'NEEDS_ATTENTION') return r.rating <= 3 && r.status === 'PENDING_REPLY';
      if (activeFilter === 'GOOGLE') return r.status === 'GOOGLE_REDIRECTED';
      if (activeFilter === 'RESOLVED') return r.status === 'REPLIED';
      return true;
    });
    const sorted = [...list];
    if (sort === 'NEWEST') sorted.sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt));
    if (sort === 'LOWEST') sorted.sort((a, b) => a.rating - b.rating);
    if (sort === 'HIGHEST') sorted.sort((a, b) => b.rating - a.rating);
    return sorted;
  }, [reviews, activeFilter, sort]);

  const ratingCounts = useMemo(
    () =>
      [5, 4, 3, 2, 1].map((star) => {
        const count = reviews.filter((r) => r.rating === star).length;
        return { star, count, percentage: Math.round((count / (reviews.length || 1)) * 100) };
      }),
    [reviews]
  );

  const handleSendReply = (reviewId: string) => {
    const text = replyInputs[reviewId]?.trim();
    if (!text) {
      toast.error('Please enter a reply message');
      return;
    }
    if (text.length < 5) {
      toast.error('Reply is too short to send');
      return;
    }
    replyToReview(reviewId, text);
    toast.success('Reply sent to customer via SMS and WhatsApp');
    setActiveReplyId(null);
    setReplyInputs((prev) => ({ ...prev, [reviewId]: '' }));
  };

  const handleCopyReview = async (id: string, comment: string) => {
    try {
      await navigator.clipboard.writeText(comment);
    } catch {
      toast.error('Clipboard blocked by browser');
      return;
    }
    setCopiedId(id);
    toast.success('Review text copied');
    window.setTimeout(() => setCopiedId(null), 2000);
  };

  const handleTabChange = (tab: Filter) => {
    setActiveFilter(tab);
    setActiveReplyId(null);
  };

  const quickReplies = [
    'Sincere apologies for the experience. We have addressed this with our team and would love a second chance.',
    'Thank you for your warm words. Looking forward to welcoming you again soon.',
    'We appreciate your feedback and have resolved this issue with our kitchen team.',
  ];

  return (
    <div className="min-h-screen bg-slate-50 -m-4 sm:-m-6 p-4 sm:p-6">
      <div className="space-y-6 pb-12 max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold text-rose-600 uppercase tracking-wider flex items-center gap-1">
                <HeartHandshake size={14} /> Customer Sentiment
              </span>
              <span className="text-slate-300">•</span>
              <span className="text-xs font-medium text-slate-500">Reputation Defense and Feedback Routing</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Customer Reviews and Feedback
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Track trends in{' '}
              <Link to="/owner/analytics" className="text-indigo-600 font-semibold hover:underline">
                analytics
              </Link>{' '}
              or update notification preferences in{' '}
              <Link to="/owner/settings" className="text-indigo-600 font-semibold hover:underline">
                settings
              </Link>
              .
            </p>
          </div>
          <div className="px-3.5 py-1.5 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold flex items-center gap-1.5 w-fit">
            <ShieldCheck size={14} className="text-emerald-600" />
            <span>Smart Google Redirect Active</span>
          </div>
        </div>

        {/* Summary */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6">
          <div className="lg:col-span-4 bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between gap-4">
            <div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Average Store Rating</span>
              <div className="flex items-baseline gap-3 mt-2">
                <div className="text-4xl font-black text-slate-900 font-mono">
                  {reviewStats.overallRating.toFixed(1)}
                </div>
                <div className="flex items-center gap-1 text-amber-400" aria-label={`${reviewStats.overallRating} out of 5 stars`}>
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star
                      key={i}
                      size={18}
                      className={i <= Math.round(reviewStats.overallRating) ? 'fill-amber-400 text-amber-400' : 'text-slate-200'}
                    />
                  ))}
                </div>
              </div>
              <p className="text-xs text-slate-400 mt-1">Based on {reviewStats.totalReviews} verified dine-in scans</p>
            </div>
            <div className="space-y-1.5 pt-3 border-t border-slate-100">
              {ratingCounts.map((item) => (
                <div key={item.star} className="flex items-center gap-2 text-xs">
                  <span className="w-6 font-bold text-slate-600 font-mono">{item.star} star</span>
                  <div className="flex-1 h-2 rounded-full bg-slate-100 overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        item.star >= 4 ? 'bg-emerald-500' : item.star === 3 ? 'bg-amber-400' : 'bg-rose-400'
                      }`}
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>
                  <span className="w-8 text-right text-[11px] font-mono text-slate-400">{item.count}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-8 bg-slate-900 text-white rounded-3xl p-6 sm:p-7 shadow-md flex flex-col justify-between gap-5 border border-slate-800">
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-bold text-amber-300 uppercase tracking-wider flex items-center gap-1">
                  <Sparkles size={13} /> Eddy Reputation Firewall
                </span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold">
                  Protecting Google Rating
                </span>
              </div>
              <h3 className="text-lg font-bold text-white">How Automated Feedback Routing Works</h3>
              <p className="text-xs text-slate-300 leading-relaxed max-w-2xl">
                When diners scan your QR code and rate their experience, Eddy routes happy guests to Google and
                keeps critical feedback private for direct resolution.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-white/10 border border-white/10 space-y-1.5">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-bold text-emerald-300 flex items-center gap-1.5">
                    <Star size={13} className="fill-emerald-300" /> 4 and 5 Star Ratings
                  </span>
                  <span className="text-[10px] font-mono text-emerald-200 font-bold">Public SEO</span>
                </div>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  Redirected to your Google Maps review page to multiply genuine 5-star public ratings.
                </p>
              </div>
              <div className="p-4 rounded-2xl bg-white/10 border border-white/10 space-y-1.5">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-bold text-rose-300 flex items-center gap-1.5">
                    <AlertCircle size={13} /> 1, 2 and 3 Star Ratings
                  </span>
                  <span className="text-[10px] font-mono text-rose-200 font-bold">Private</span>
                </div>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  Kept internal as private feedback so you can resolve issues before negative public posts.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 border-b border-slate-200 pb-3">
          <div
            className="flex items-center gap-1 bg-white border border-slate-200 p-1 rounded-2xl overflow-x-auto"
            role="tablist"
            aria-label="Review filters"
          >
            {TABS.map((tab) => (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={activeFilter === tab.id}
                onClick={() => handleTabChange(tab.id)}
                className={`whitespace-nowrap px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  activeFilter === tab.id
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                {tab.label} ({tabCounts[tab.id]})
              </button>
            ))}
          </div>
          <div className="flex items-center gap-1 bg-white border border-slate-200 p-1 rounded-2xl w-fit">
            <span className="pl-2 text-slate-400 flex items-center gap-1 text-[11px] font-bold uppercase">
              <ArrowDownWideNarrow size={12} /> Sort
            </span>
            {(['NEWEST', 'LOWEST', 'HIGHEST'] as const).map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setSort(s)}
                aria-pressed={sort === s}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  sort === s ? 'bg-indigo-600 text-white' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                {s === 'NEWEST' ? 'Newest' : s === 'LOWEST' ? 'Lowest' : 'Highest'}
              </button>
            ))}
          </div>
        </div>

        {/* Feed */}
        <div className="space-y-4">
          {filteredReviews.length === 0 && (
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-10 text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
                <CheckCircle2 size={22} />
              </div>
              <h3 className="font-bold text-slate-900">All clear in this view</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                No reviews match this filter right now. New QR feedback will appear here automatically.
              </p>
              <Button type="button" variant="outline" onClick={() => handleTabChange('ALL')} className="rounded-xl text-xs font-bold mx-auto">
                Show All Reviews
              </Button>
            </div>
          )}

          {filteredReviews.map((review) => {
            const isGoogleRedirect = review.status === 'GOOGLE_REDIRECTED';
            const isReplied = review.status === 'REPLIED';
            const isPendingReply = review.status === 'PENDING_REPLY';

            return (
              <div
                key={review.id}
                className={`bg-white rounded-3xl p-5 sm:p-6 border shadow-sm transition-shadow hover:shadow-md ${
                  isPendingReply ? 'border-rose-200' : 'border-slate-200'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div className="space-y-2 flex-1 min-w-0">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-slate-900 text-white font-bold text-sm flex items-center justify-center shrink-0">
                        {review.customerName.charAt(0).toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <h4 className="font-bold text-sm text-slate-900 truncate">{review.customerName}</h4>
                        <div className="flex flex-wrap items-center gap-2">
                          <div className="flex items-center text-amber-400" aria-label={`${review.rating} stars`}>
                            {[1, 2, 3, 4, 5].map((i) => (
                              <Star
                                key={i}
                                size={12}
                                className={i <= review.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-200'}
                              />
                            ))}
                          </div>
                          <span className="text-[11px] text-slate-400 font-mono">
                            {new Date(review.createdAt).toLocaleDateString('en-IN', {
                              day: 'numeric',
                              month: 'short',
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </span>
                        </div>
                      </div>
                    </div>

                    <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium pl-1">
                      &ldquo;{review.comment}&rdquo;
                    </p>

                    <div className="flex flex-wrap items-center gap-2 pt-1 pl-1">
                      {review.category && (
                        <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 text-[10px] font-bold">
                          {review.category}
                        </span>
                      )}
                      <button
                        type="button"
                        onClick={() => handleCopyReview(review.id, review.comment)}
                        className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-500 hover:text-indigo-700 transition-colors"
                      >
                        {copiedId === review.id ? <Check size={12} className="text-emerald-600" /> : <Copy size={12} />}
                        {copiedId === review.id ? 'Copied' : 'Copy text'}
                      </button>
                    </div>
                  </div>

                  <div className="shrink-0 flex sm:flex-col items-start sm:items-end gap-2">
                    {isGoogleRedirect && (
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                        <ExternalLink size={11} /> Google Review Redirected
                      </span>
                    )}
                    {isReplied && (
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
                        <CheckCircle2 size={11} className="text-emerald-600" /> Resolved and Replied
                      </span>
                    )}
                    {isPendingReply && (
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
                        <Clock size={11} /> Action Needed
                      </span>
                    )}
                  </div>
                </div>

                {review.reply && (
                  <div className="mt-4 p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                    <div className="flex items-center gap-1.5 text-[11px] font-bold text-indigo-700">
                      <Reply size={12} /> Owner Response
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">{review.reply}</p>
                  </div>
                )}

                {isPendingReply && (
                  <div className="mt-4 pt-4 border-t border-slate-100 space-y-3">
                    {activeReplyId === review.id ? (
                      <div className="space-y-2.5">
                        <label htmlFor={`reply-${review.id}`} className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                          Private resolution message
                        </label>
                        <textarea
                          id={`reply-${review.id}`}
                          value={replyInputs[review.id] || ''}
                          onChange={(e) => setReplyInputs((prev) => ({ ...prev, [review.id]: e.target.value }))}
                          placeholder="Write a warm apology or resolution message..."
                          rows={3}
                          maxLength={500}
                          className="w-full text-xs sm:text-sm p-3 rounded-2xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 min-h-[80px] bg-white"
                        />
                        <div className="text-[11px] text-slate-400 text-right font-mono">
                          {(replyInputs[review.id] || '').length}/500
                        </div>
                        <div className="flex flex-wrap items-center gap-1.5">
                          {quickReplies.map((chip, idx) => (
                            <button
                              key={idx}
                              type="button"
                              onClick={() => {
                                setReplyInputs((prev) => ({ ...prev, [review.id]: chip }));
                                toast.success('Quick reply inserted, review before sending');
                              }}
                              className="text-left text-[10px] px-2.5 py-1 rounded-lg bg-slate-100 text-slate-600 hover:bg-indigo-50 hover:text-indigo-700 transition-colors max-w-full"
                            >
                              + {chip.slice(0, 38)}...
                            </button>
                          ))}
                        </div>
                        <div className="flex items-center justify-end gap-2 pt-1">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setActiveReplyId(null)}
                            className="rounded-xl text-xs"
                          >
                            Cancel
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => handleSendReply(review.id)}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-sm flex items-center gap-1.5"
                          >
                            <Send size={13} />
                            <span>Send Resolution</span>
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <Button
                        size="sm"
                        onClick={() => setActiveReplyId(review.id)}
                        className="bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl shadow-sm flex items-center gap-1.5"
                      >
                        <Reply size={13} />
                        <span>Reply Privately and Resolve</span>
                      </Button>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
