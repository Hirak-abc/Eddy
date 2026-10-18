import { useEffect, useState } from 'react';
import { useAuth as useClerkAuth, useUser } from '@clerk/clerk-react';
import type { UserRole } from '../types';
import { api } from '../services/api';

const isUserRole = (role: unknown): role is UserRole =>
  role === 'OWNER' || role === 'CUSTOMER' || role === 'ADMIN';

interface CurrentUser {
  role: UserRole;
}

export const useAuth = () => {
  const { isLoaded, isSignedIn, getToken } = useClerkAuth();
  const { user } = useUser();
  const metadataRole = user?.publicMetadata?.role;
  const userRoleFromMetadata = isUserRole(metadataRole) ? metadataRole : undefined;
  const [serverRole, setServerRole] = useState<{ userId: string; role: UserRole } | null>(null);
  const [isRoleLoading, setIsRoleLoading] = useState(false);
  const [roleError, setRoleError] = useState<string | null>(null);

  useEffect(() => {
    const userId = user?.id;
    if (!isLoaded || !isSignedIn || !userId) {
      setIsRoleLoading(false);
      setRoleError(null);
      return;
    }
    if (userRoleFromMetadata) {
      setIsRoleLoading(false);
      setRoleError(null);
      return;
    }

    let cancelled = false;
    const controller = new AbortController();
    const timeoutId = window.setTimeout(() => controller.abort(), 10_000);
    const loadRole = async () => {
      setIsRoleLoading(true);
      setRoleError(null);
      try {
        const token = await getToken();
        if (!token) {
          throw new Error('Your session token is unavailable. Please sign in again.');
        }
        const response = await api.getWithToken<CurrentUser>(
          '/identity/me',
          token,
          controller.signal,
        );
        if (!response.success || !response.data || !isUserRole(response.data.role)) {
          throw new Error(response.error?.message ?? 'We could not verify your account role.');
        }
        if (!cancelled) setServerRole({ userId, role: response.data.role });
      } catch (error) {
        if (!cancelled) {
          setRoleError(
            error instanceof Error ? error.message : 'We could not verify your account role.',
          );
        }
      } finally {
        window.clearTimeout(timeoutId);
        if (!cancelled) setIsRoleLoading(false);
      }
    };

    void loadRole();
    return () => {
      cancelled = true;
      controller.abort();
      window.clearTimeout(timeoutId);
    };
  }, [getToken, isLoaded, isSignedIn, user?.id, userRoleFromMetadata]);

  const userRole =
    userRoleFromMetadata ??
    (serverRole && serverRole.userId === user?.id ? serverRole.role : undefined);

  return {
    isLoaded,
    isSignedIn: Boolean(isSignedIn),
    userRole,
    isRoleLoading,
    roleError,
    getToken,
  };
};
