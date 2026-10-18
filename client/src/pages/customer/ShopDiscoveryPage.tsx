import { Search } from 'lucide-react';
import { ComingSoon } from '@/components/ComingSoon';

export const ShopDiscoveryPage = () => {
  return (
    <ComingSoon
      eyebrow="Explore Nearby"
      title="Discover"
      highlight="Coming Soon"
      description="We're curating a smarter way to find nearby shops — personalised picks, live offers and Eddy Coin deals tuned to your taste. Hang tight!"
      icon={Search}
      accentFrom="from-teal-600"
      accentTo="to-emerald-500"
      glowColor="bg-emerald-500/20"
      features={['Personalised Picks', 'Live Offers', 'Coin Deals', 'Shop Categories']}
      backTo="/customer/home"
      backLabel="Back to Home"
      secondaryTo="/customer/scan"
      secondaryLabel="Scan & Earn"
    />
  );
};
