import { BarChart3 } from 'lucide-react';
import { ComingSoon } from '@/components/ComingSoon';

export const AnalyticsPage = () => {
  return (
    <ComingSoon
      eyebrow="Telemetry & Growth"
      title="Analytics"
      highlight="Coming Soon"
      description="We're crafting rich cross-platform ROI insights — social reach, QR scans, conversions and attributed sales — with a brand-new analytics experience. Hang tight!"
      icon={BarChart3}
      accentFrom="from-sky-600"
      accentTo="to-indigo-500"
      glowColor="bg-sky-500/20"
      features={['Social Reach', 'QR Activity', 'Conversion ROI', 'Export Reports']}
    />
  );
};
