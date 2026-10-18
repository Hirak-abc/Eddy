import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { ROUTES } from '../lib/constants';
import { AuthStatusScreen } from '../pages/auth/AuthStatusScreen';

interface ProtectedRouteProps {
  children: React.ReactNode;
  role: 'OWNER' | 'CUSTOMER' | 'ADMIN';
}

export const ProtectedRoute = ({ children, role }: ProtectedRouteProps) => {
  const location = useLocation();
  const { isLoaded, isSignedIn, userRole, isRoleLoading, roleError } = useAuth();

  if (!isLoaded) return <div>Loading...</div>;
  if (!isSignedIn) {
    return (
      <Navigate
        to={`${ROUTES.SIGN_IN}?role=${role}`}
        state={{ from: `${location.pathname}${location.search}${location.hash}` }}
        replace
      />
    );
  }
  if (roleError) {
    return (
      <AuthStatusScreen
        message=""
        error={roleError}
        errorTitle="Account verification failed"
      />
    );
  }
  if (!userRole || isRoleLoading) return <AuthStatusScreen message="Verifying your account…" />;

  const hasAccess = role === 'OWNER'
    ? userRole === 'OWNER' || userRole === 'ADMIN'
    : userRole === role;

  if (!hasAccess) return <Navigate to={ROUTES.HOME} replace />;

  return <>{children}</>;
};
