import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { ROUTES } from '../lib/constants';
import { Button } from '@/components/ui/Button';

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
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 gap-6">
      <h1 className="text-5xl font-extrabold text-indigo-700">Eddy</h1>
      <p className="text-xl text-slate-600">Marketing & Rewards for Local Businesses</p>

      <div className="flex gap-4">
        <Button asChild size="lg">
          <Link to={`${ROUTES.SIGN_UP}?role=OWNER`}>Business owner</Link>
        </Button>
        <Button asChild size="lg" variant="secondary">
          <Link to={`${ROUTES.SIGN_UP}?role=CUSTOMER`}>Customer</Link>
        </Button>
      </div>
      <div className="flex gap-4 text-sm">
        <Link className="text-indigo-700 underline" to={`${ROUTES.SIGN_IN}?role=OWNER`}>
          Sign in as business owner
        </Link>
        <Link className="text-indigo-700 underline" to={`${ROUTES.SIGN_IN}?role=CUSTOMER`}>
          Sign in as customer
        </Link>
      </div>
    </div>
  );
};
