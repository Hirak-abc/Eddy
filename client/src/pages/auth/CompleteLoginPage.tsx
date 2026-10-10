import { useEffect, useRef, useState } from 'react';
import { Navigate, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth, useUser } from '@clerk/clerk-react';
import { ROUTES } from '../../lib/constants';
import type { UserRole } from '../../types';
import { api } from '../../services/api';
import { AuthStatusScreen } from './AuthStatusScreen';

export const CompleteLoginPage = () => {
  const { isLoaded, isSignedIn } = useAuth();
  const { user } = useUser();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const hasStarted = useRef(false);
  const requestedRole: UserRole =
    searchParams.get('role') === 'CUSTOMER' ? 'CUSTOMER' : 'OWNER';

  useEffect(() => {
    if (!isLoaded || !isSignedIn || !user || hasStarted.current) return;
    hasStarted.current = true;

    const completeLogin = async () => {
      const storedRole = user.publicMetadata.role;
      const actualRole: UserRole | undefined =
        storedRole === 'OWNER' || storedRole === 'CUSTOMER' || storedRole === 'ADMIN'
          ? storedRole
          : undefined;

      if (!actualRole) {
        const response = await api.post<{ role: UserRole }>('/identity/role', {
          role: requestedRole,
        });
        if (!response.success) {
          setError(response.error?.message ?? 'Unable to assign your account role.');
          return;
        }

        await user.reload();
      }

      const resolvedRole = actualRole ?? requestedRole;
      if (resolvedRole !== requestedRole && resolvedRole !== 'ADMIN') {
        setError(`This account is registered as ${resolvedRole.toLowerCase()}, not ${requestedRole.toLowerCase()}.`);
        return;
      }

      navigate(
        resolvedRole === 'OWNER' || resolvedRole === 'ADMIN'
          ? ROUTES.OWNER_DASHBOARD
          : ROUTES.CUSTOMER_HOME,
        { replace: true },
      );
    };

    void completeLogin();
  }, [isLoaded, isSignedIn, navigate, requestedRole, user]);

  if (!isLoaded) return <AuthStatusScreen message="Loading…" />;
  if (!isSignedIn) return <Navigate to={ROUTES.SIGN_IN} replace />;
  if (error) return <AuthStatusScreen message="" error={error} />;

  return <AuthStatusScreen message="Opening your dashboard…" />;
};
