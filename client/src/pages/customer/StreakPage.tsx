import { Flame } from 'lucide-react';
import { ComingSoon } from '@/components/ComingSoon';

export const StreakPage = () => {
  return (
    <ComingSoon
      eyebrow="Daily Rewards"
      title="Streak"
      highlight="Coming Soon"
      description="We're cooking up daily scan streaks, milestone bonuses and streak shields that keep your coin multipliers growing. Hang tight!"
      icon={Flame}
      accentFrom="from-amber-500"
      accentTo="to-orange-500"
      glowColor="bg-amber-500/20"
      features={['Daily Streaks', 'Milestone Bonuses', 'Streak Shields', 'Coin Multipliers']}
      backTo="/customer/home"
      backLabel="Back to Home"
      secondaryTo="/customer/scan"
      secondaryLabel="Scan & Earn"
    />
  );
};
