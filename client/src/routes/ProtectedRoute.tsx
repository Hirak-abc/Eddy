import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { ROUTES } from '../lib/constants';

interface ProtectedRouteProps {
  children: React.ReactNode;
  role: 'OWNER' | 'CUSTOMER';
}

export const ProtectedRoute = ({ children, role }: ProtectedRouteProps) => {
  const { isLoaded, isSignedIn, userRole } = useAuth();

  if (!isLoaded) return <div>Loading...</div>;
  if (!isSignedIn) return <Navigate to={ROUTES.SIGN_IN} replace />;
  if (userRole !== role) return <Navigate to={ROUTES.HOME} replace />;

  return <>{children}</>;
};
