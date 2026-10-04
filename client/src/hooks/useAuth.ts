import { useAuth as useClerkAuth, useUser } from '@clerk/clerk-react';
import type { UserRole } from '../types';

export const useAuth = () => {
  const { isLoaded, isSignedIn, getToken } = useClerkAuth();
  const { user } = useUser();
  const role = user?.publicMetadata?.role;
  const userRole: UserRole | undefined =
    role === 'OWNER' || role === 'CUSTOMER' || role === 'ADMIN' ? role : undefined;

  return {
    isLoaded,
    isSignedIn: Boolean(isSignedIn),
    userRole,
    getToken,
  };
};
