import { Link } from 'react-router-dom';
import { ROUTES } from '../lib/constants';
import { Button } from '@/components/ui/Button';

export const LandingPage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 gap-6">
      <h1 className="text-5xl font-extrabold text-indigo-700">Eddy</h1>
      <p className="text-xl text-slate-600">Marketing & Rewards for Local Businesses</p>

      <div className="flex gap-4">
        <Button asChild size="lg">
          <Link to={`${ROUTES.OWNER_DASHBOARD}?role=OWNER`}>Access Owner Portal</Link>
        </Button>
        <Button asChild size="lg" variant="secondary">
          <Link to={`${ROUTES.CUSTOMER_HOME}?role=CUSTOMER`}>Access Customer Portal</Link>
        </Button>
      </div>
    </div>
  );
};
