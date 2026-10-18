import { useEffect, useRef, useState } from 'react';
import { Navigate, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth, useClerk, useUser } from '@clerk/clerk-react';
import { ROUTES } from '../../lib/constants';
import type { UserRole } from '../../types';
import { api } from '../../services/api';
import { AuthStatusScreen } from './AuthStatusScreen';
import {
  clearAuthFlowState,
  consumeAuthRedirect,
  getRememberedAuthFlowRole,
  resolveAuthFlowRole,
} from '@/lib/authRedirect';

export const CompleteLoginPage = () => {
  const { isLoaded, isSignedIn, getToken } = useAuth();
  const { signOut } = useClerk();
  const { user } = useUser();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [accountSwitchRequired, setAccountSwitchRequired] = useState(false);
  const hasStarted = useRef(false);

  const paramRole = searchParams.get('role');
  const requestedRole: UserRole = resolveAuthFlowRole(
    paramRole,
    getRememberedAuthFlowRole(),
    true,
  );

  useEffect(() => {
    if (!isLoaded || !isSignedIn || !user || hasStarted.current) return;
    hasStarted.current = true;

    const completeLogin = async () => {
      try {
        const response = await api.post<{ id: string; role: UserRole }>('/identity/role', {
          role: requestedRole,
        });
        if (!response.success || response.data === null) {
          setError(response.error?.message ?? 'Unable to verify your account role. Please try again.');
          return;
        }

        const resolvedRole = response.data.role;
        await user.reload();
        await getToken({ skipCache: true });
        if (resolvedRole !== requestedRole && resolvedRole !== 'ADMIN') {
          setAccountSwitchRequired(true);
          setError(
            `This account is registered as ${resolvedRole.toLowerCase()}, not ${requestedRole.toLowerCase()}. Sign in with a ${requestedRole.toLowerCase()} account instead.`,
          );
          return;
        }

        const redirectTo = consumeAuthRedirect(resolvedRole);
        clearAuthFlowState();
        navigate(
          redirectTo ?? (
            resolvedRole === 'OWNER' || resolvedRole === 'ADMIN'
              ? ROUTES.OWNER_DASHBOARD
              : ROUTES.CUSTOMER_HOME
          ),
          { replace: true },
        );
      } catch (loginError) {
        console.error('Sign-in completion failed:', loginError);
        setError('We could not complete sign-in. Please try again.');
      }
    };

    void completeLogin();
  }, [getToken, isLoaded, isSignedIn, navigate, requestedRole, user]);

  const handleAccountSwitch = async () => {
    try {
      await signOut(() => {
        clearAuthFlowState();
        navigate(`${ROUTES.SIGN_IN}?role=${requestedRole}`, { replace: true });
      });
    } catch (signOutError) {
      console.error('Could not sign out while switching account:', signOutError);
      setError('Could not sign out. Please refresh the page and try again.');
      setAccountSwitchRequired(false);
    }
  };

  if (!isLoaded) return <AuthStatusScreen message="Loading…" />;
  if (!isSignedIn) return <Navigate to={ROUTES.SIGN_IN} replace />;
  if (error) {
    return (
      <AuthStatusScreen
        message=""
        error={error}
        errorTitle={accountSwitchRequired ? 'Use a different account' : undefined}
        errorAction={
          accountSwitchRequired
            ? { label: 'Sign out and choose a different account', onClick: () => void handleAccountSwitch() }
            : undefined
        }
      />
    );
  }

  return <AuthStatusScreen message="Opening your dashboard…" />;
};
