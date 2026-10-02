// Integrated with @clerk/clerk-react
import { useAuth as useClerkAuth, useUser } from '@clerk/clerk-react';
import { useApplicationUser } from './useApplicationUser';

/**
 * Custom auth hook wrapping Clerk's useAuth.
 *
 * Role is NOT read from sessionStorage or any client-side storage. The role
 * exposed here comes from the authoritative application user record returned by
 * `GET /api/me` (see useApplicationUser). The frontend role is used only for
 * presentation/routing; backend authorization remains the security boundary.
 */
export const useAuth = () => {
  const { isLoaded, userId } = useClerkAuth();
  const { user } = useUser();
  const { role, isLoadingUser, refreshUser } = useApplicationUser();

  return {
    isLoaded,
    isSignedIn: !!userId,
    userId: userId ?? null,
    user,
    /** Authoritative application role (OWNER | CUSTOMER | ADMIN | null). */
    userRole: role,
    isLoadingUser,
    refreshUser,
  };
};
