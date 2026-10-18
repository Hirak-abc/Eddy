import { MessageSquare } from 'lucide-react';
import { ComingSoon } from '@/components/ComingSoon';

export const ReviewsPage = () => {
  return (
    <ComingSoon
      eyebrow="Reputation Hub"
      title="Customer Reviews"
      highlight="Coming Soon"
      description="We're building a full review command centre — Google ratings sync, one-click replies, sentiment insights and resolution tracking — so you can turn feedback into loyalty. Hang tight!"
      icon={MessageSquare}
      accentFrom="from-rose-600"
      accentTo="to-pink-500"
      glowColor="bg-rose-500/20"
      features={['Google Sync', 'Smart Replies', 'Sentiment Insights', 'Resolution Tracker']}
    />
  );
};
