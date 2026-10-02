import { Navigate } from 'react-router-dom';
import { useApplicationUser } from '../hooks/useApplicationUser';
import { ROUTES } from '../lib/constants';

interface ProtectedRouteProps {
  children: React.ReactNode;
  role: 'OWNER' | 'CUSTOMER';
}

/**
 * Route guard that uses the authoritative application role from the backend.
 * The frontend role selection on signup is NOT the authorization source —
 * only `GET /api/me` (via useApplicationUser) provides the trusted role.
 */
export const ProtectedRoute = ({ children, role }: ProtectedRouteProps) => {
  const { role: userRole, isLoadingUser } = useApplicationUser();

  if (isLoadingUser) return <div>Loading...</div>;
  // If no user role yet, don't redirect to sign-in immediately — session may
  // still be establishing (e.g. after OAuth). Wait briefly for /me response.
  if (!userRole) {
    // Only redirect away if we're not actively loading — but since isLoadingUser
    // is false when there's no session at all, redirect is safe here.
    return <Navigate to={ROUTES.SIGN_IN} replace />;
  }
  if (userRole !== role) return <Navigate to={ROUTES.HOME} replace />;

  return <>{children}</>;
};
