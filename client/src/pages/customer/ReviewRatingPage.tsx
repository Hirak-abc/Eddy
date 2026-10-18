import { Star } from 'lucide-react';
import { ComingSoon } from '@/components/ComingSoon';

export const ReviewRatingPage = () => {
  return (
    <ComingSoon
      eyebrow="Share Feedback"
      title="Reviews"
      highlight="Coming Soon"
      description="We're designing a smoother way to rate shops, unlock review rewards and share 4–5★ feedback straight to Google. Hang tight!"
      icon={Star}
      accentFrom="from-violet-600"
      accentTo="to-fuchsia-500"
      glowColor="bg-fuchsia-500/20"
      features={['Star Ratings', 'Review Rewards', 'Google Share', 'Private Feedback']}
      backTo="/customer/home"
      backLabel="Back to Home"
      secondaryTo="/customer/scan"
      secondaryLabel="Scan & Earn"
    />
  );
};
