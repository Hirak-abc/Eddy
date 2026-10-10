import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Star, Send, BadgeCheck, Lock } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

const RATING_LABELS = ['', 'Terrible', 'Poor', 'Okay', 'Great', 'Excellent'];

export const ReviewRatingPage = () => {
  const [rating, setRating] = useState(0);
  const [hovered, setHovered] = useState(0);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const active = hovered || rating;

  const handleSubmit = () => {
    if (rating === 0) {
      toast.error('Please select a star rating first');
      return;
    }
    setSubmitting(true);
    // Simulated submit — wired to the review API when the backend is ready.
    setTimeout(() => {
      setSubmitting(false);
      if (rating >= 4) {
        toast.success('Thanks for the love! Please also leave us a Google review.');
      } else {
        toast.success('Thanks — your feedback was shared privately with the shop.');
      }
      setRating(0);
      setHovered(0);
      setComment('');
    }, 600);
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col">
      {/* Hero Section */}
      <div className="relative h-48 w-full overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=1200&q=80"
          alt="Cozy coffee shop interior"
          className="w-full h-full object-cover opacity-90"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
        <div className="absolute bottom-4 left-4 text-white">
          <h1 className="text-2xl font-bold md:text-3xl">Rate & Review</h1>
          <p className="text-sm opacity-90">Your feedback helps local businesses thrive</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex-col">
        <div className="max-w-2xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          <div className="space-y-6">
            {/* Rating Section */}
            <div className="bg-white rounded-2xl shadow-lg border border-slate-100">
              <div className="p-6 space-y-4">
                <div className="text-center">
                  <p className="text-slate-500 font-medium">How was your experience?</p>
                  <div className="flex justify-center gap-1 mt-4" onMouseLeave={() => setHovered(0)}>
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        aria-label={`Rate ${star} star${star > 1 ? 's' : ''}`}
                        onClick={() => setRating(star)}
                        onMouseEnter={() => setHovered(star)}
                        onFocus={() => setHovered(star)}
                        className="p-2 rounded-full transition-transform duration-150 hover:scale-125 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
                      >
                        <Star
                          size={32}
                          strokeWidth={1.5}
                          className={cn(
                            'transition-colors duration-150',
                            star <= active
                              ? 'fill-amber-400 text-amber-400 drop-shadow'
                              : 'text-slate-300 hover:text-amber-200'
                          )}
                        />
                      </button>
                    ))}
                  </div>
                  <p className={cn('mt-2 h-6 text-sm font-bold', active ? 'text-slate-800' : 'text-slate-400')}>
                    {active ? RATING_LABELS[active] : 'Tap a star to rate'}
                  </p>
                </div>
              </div>
            </div>

            {/* Review Form */}
            <div className="bg-white rounded-2xl shadow-lg border border-slate-100">
              <div className="p-6 space-y-5">
                <div className="space-y-2">
                  <label htmlFor="review-comment" className="block text-slate-700 font-medium text-sm">
                    Share your thoughts
                  </label>
                  <textarea
                    id="review-comment"
                    rows={4}
                    maxLength={500}
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="What did you enjoy? What could be improved?"
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all duration-200 resize-none"
                  />
                  <p className="text-right text-xs text-slate-400">{comment.length}/500</p>
                </div>

                <Button
                  onClick={handleSubmit}
                  disabled={submitting}
                  className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-60"
                >
                  <Send size={16} className="mr-2" />
                  {submitting ? 'Submitting…' : 'Submit Review'}
                </Button>

                <Link
                  to="/customer/home"
                  className="block text-center text-sm font-medium text-slate-400 hover:text-slate-600"
                >
                  Maybe later
                </Link>
              </div>
            </div>

            {/* How reviews work */}
            <div className="bg-slate-50 rounded-2xl border border-slate-200 p-5 space-y-3">
              <p className="text-sm font-bold text-slate-700">How reviews work</p>
              <div className="flex items-start gap-3 text-sm text-slate-600">
                <BadgeCheck size={16} className="mt-0.5 shrink-0 text-emerald-600" />
                <p><span className="font-semibold">4–5 stars</span> — we’ll point you to the shop’s Google page to post it publicly.</p>
              </div>
              <div className="flex items-start gap-3 text-sm text-slate-600">
                <Lock size={16} className="mt-0.5 shrink-0 text-slate-400" />
                <p><span className="font-semibold">1–3 stars</span> — shared privately with the shop so they can improve.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
