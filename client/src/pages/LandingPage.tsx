import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { ROUTES } from '../lib/constants';
import { Navbar } from '../components/landing/Navbar';
import { HeroSection } from '../components/landing/HeroSection';
import { FeaturesSection } from '../components/landing/FeaturesSection';
import { GenerationWorkflow } from '../components/landing/GenerationWorkflow';
import { FlyerGallery } from '../components/landing/FlyerGallery';
import { TestimonialsSection } from '../components/landing/TestimonialsSection';
import { CTAFooter } from '../components/landing/CTAFooter';

export const LandingPage = () => {
  const { isLoaded, isSignedIn, userRole } = useAuth();

  if (!isLoaded) return <div>Loading...</div>;
  if (isSignedIn && (userRole === 'OWNER' || userRole === 'ADMIN')) {
    return <Navigate to={ROUTES.OWNER_DASHBOARD} replace />;
  }
  if (isSignedIn && userRole === 'CUSTOMER') {
    return <Navigate to={ROUTES.CUSTOMER_HOME} replace />;
  }
  if (isSignedIn) return <div>Loading account...</div>;

  return (
    <div className="bg-white">
      <Navbar />
      <main className="pt-16">
        <HeroSection />
        <FeaturesSection />
        <GenerationWorkflow />
        <FlyerGallery />
        <TestimonialsSection />
        <CTAFooter />
      </main>
    </div>
    
  );
};
