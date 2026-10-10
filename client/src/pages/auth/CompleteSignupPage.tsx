import { useEffect, useRef, useState } from 'react';
import { useAuth, useUser } from '@clerk/clerk-react';
import { Navigate, useNavigate, useSearchParams } from 'react-router-dom';
import { api } from '../../services/api';
import { ROUTES } from '../../lib/constants';
import type { UserRole } from '../../types';
import { AuthStatusScreen } from './AuthStatusScreen';

export const CompleteSignupPage = () => {
  const { isLoaded, isSignedIn, getToken } = useAuth();
  const { user } = useUser();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const hasStarted = useRef(false);
  const role: UserRole = searchParams.get('role') === 'CUSTOMER' ? 'CUSTOMER' : 'OWNER';

  useEffect(() => {
    if (!isLoaded || !isSignedIn || hasStarted.current) return;
    hasStarted.current = true;

    const assignRole = async () => {
      const response = await api.post<{ role: UserRole }>('/identity/role', { role });
      if (!response.success) {
        setError(response.error?.message ?? 'Unable to complete account setup.');
        return;
      }

      await getToken({ skipCache: true });
      await user?.reload();
      navigate(role === 'OWNER' ? ROUTES.OWNER_DASHBOARD : ROUTES.CUSTOMER_HOME, {
        replace: true,
      });
    };

    void assignRole();
  }, [getToken, isLoaded, isSignedIn, navigate, role, user]);

  if (!isLoaded) return <AuthStatusScreen message="Loading…" />;
  if (!isSignedIn) return <Navigate to={ROUTES.SIGN_IN} replace />;
  if (error) return <AuthStatusScreen message="" error={error} />;

  return <AuthStatusScreen message="Setting up your account…" />;
};
