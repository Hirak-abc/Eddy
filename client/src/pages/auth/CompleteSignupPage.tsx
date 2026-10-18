import { useEffect, useRef, useState } from 'react';
import { useAuth, useUser } from '@clerk/clerk-react';
import { Navigate, useNavigate, useSearchParams } from 'react-router-dom';
import { api } from '../../services/api';
import { ROUTES } from '../../lib/constants';
import type { UserRole } from '../../types';
import { AuthStatusScreen } from './AuthStatusScreen';
import {
  clearAuthFlowState,
  consumeAuthRedirect,
  getRememberedAuthFlowRole,
  resolveAuthFlowRole,
} from '@/lib/authRedirect';

export const CompleteSignupPage = () => {
  const { isLoaded, isSignedIn, getToken } = useAuth();
  const { user } = useUser();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const hasStarted = useRef(false);

  const paramRole = searchParams.get('role');
  const role: UserRole = resolveAuthFlowRole(
    paramRole,
    getRememberedAuthFlowRole(),
    true,
  );

  useEffect(() => {
    if (!isLoaded || !isSignedIn || hasStarted.current) return;
    hasStarted.current = true;

    const assignRole = async () => {
      try {
        const response = await api.post<{ role: UserRole }>('/identity/role', { role });
        if (!response.success || response.data === null) {
          setError(response.error?.message ?? 'Unable to complete account setup.');
          return;
        }

        await getToken({ skipCache: true });
        await user?.reload();
        const resolvedRole = response.data.role;
        if (resolvedRole !== role && resolvedRole !== 'ADMIN') {
          setError(
            `This account is registered as ${resolvedRole.toLowerCase()}, not ${role.toLowerCase()}. Sign in with a ${role.toLowerCase()} account instead.`,
          );
          return;
        }
        const redirectTo = consumeAuthRedirect(resolvedRole);
        clearAuthFlowState();
        navigate(
          redirectTo
            ?? (resolvedRole === 'OWNER' || resolvedRole === 'ADMIN'
              ? ROUTES.OWNER_DASHBOARD
              : ROUTES.CUSTOMER_HOME),
          {
            replace: true,
          },
        );
      } catch (signupError) {
        console.error('Sign-up completion failed:', signupError);
        setError('We could not complete account setup. Please try again.');
      }
    };

    void assignRole();
  }, [getToken, isLoaded, isSignedIn, navigate, role, user]);

  if (!isLoaded) return <AuthStatusScreen message="Loading…" />;
  if (!isSignedIn) return <Navigate to={ROUTES.SIGN_IN} replace />;
  if (error) return <AuthStatusScreen message="" error={error} />;

  return <AuthStatusScreen message="Setting up your account…" />;
};
