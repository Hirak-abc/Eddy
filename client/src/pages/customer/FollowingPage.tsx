import { Heart } from 'lucide-react';
import { ComingSoon } from '@/components/ComingSoon';

export const FollowingPage = () => {
  return (
    <ComingSoon
      eyebrow="Stay Connected"
      title="Following"
      highlight="Coming Soon"
      description="We're building a feed for the shops you love — follow updates, unlock follower-only coin drops and never miss an offer. Hang tight!"
      icon={Heart}
      accentFrom="from-rose-500"
      accentTo="to-pink-500"
      glowColor="bg-rose-500/20"
      features={['Follow Shops', 'Follower Deals', 'Coin Drops', 'Shop Updates']}
      backTo="/customer/home"
      backLabel="Back to Home"
      secondaryTo="/customer/scan"
      secondaryLabel="Scan & Earn"
    />
  );
};
