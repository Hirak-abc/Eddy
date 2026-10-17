import { TrendingUp } from 'lucide-react';
import { ComingSoon } from '@/components/ComingSoon';

export const TrendFlyersPage = () => {
  return (
    <ComingSoon
      eyebrow="AI Trend Radar"
      title="Local Trends"
      highlight="Coming Soon"
      description="We're tuning our AI trend radar to surface hyper-local festivals, seasonal cravings and viral moments near you — with one-click campaign launches. Stay tuned!"
      icon={TrendingUp}
      accentFrom="from-amber-500"
      accentTo="to-rose-500"
      glowColor="bg-amber-500/20"
      features={['Festival Radar', 'Seasonal Demands', 'Weekend Rush', 'Viral Buzz']}
    />
  );
};
