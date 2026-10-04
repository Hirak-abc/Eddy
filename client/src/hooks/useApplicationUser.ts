import { useCallback, useEffect, useState } from 'react';
import { useAuth as useClerkAuth } from '@clerk/clerk-react';
import { API_BASE_URL } from '@/lib/constants';
import type { User, UserRole } from '@/types';

/**
 * Reads the authoritative application user from the backend.
 *
 * The role returned by GET /api/me is the ONLY source of truth for role in the
 * client. Signup selections, sessionStorage and query parameters are never used
 * to derive role here — they are presentation-only inputs to the signup form.
 *
 * Several components mount this hook at once (ProtectedRoute, the layout, the
 * page itself), so the request is deduplicated per Clerk user through a module
 * level cache. Without it a single navigation fired one GET /api/me per mount,
 * and each of those could race into a Convex user insert.
 */
type CacheEntry = {
  promise: Promise<User | null>;
  user: User | null;
};

let cache: CacheEntry | null = null;

const fetchApplicationUser = async (
  getToken: () => Promise<string | null>
): Promise<User | null> => {
  try {
    const token = await getToken();
    if (!token) return null;
    const savedRole = sessionStorage.getItem('eddy.authRole') as 'OWNER' | 'CUSTOMER' | null;
    const roleQuery = savedRole ? `?role=${encodeURIComponent(savedRole)}` : '';
    const response = await fetch(`${API_BASE_URL}/me${roleQuery}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const payload = await response.json();
    if (!response.ok || !payload?.success || !payload?.data) {
      return null;
    }
    return payload.data as User;
  } catch {
    return null;
  }
};

/** Drop the cached user, e.g. on sign-out or when a token is rejected. */
export const clearApplicationUserCache = (): void => {
  cache = null;
};

export const useApplicationUser = () => {
  const { isLoaded, isSignedIn, getToken } = useClerkAuth();
  const [user, setUser] = useState<User | null>(cache?.user ?? null);
  const [isLoadingUser, setIsLoadingUser] = useState(
    isLoaded && isSignedIn && !cache
  );

  const loadUser = useCallback(async () => {
    if (!isLoaded || !isSignedIn) {
      clearApplicationUserCache();
      setUser(null);
      setIsLoadingUser(false);
      return null;
    }
    setIsLoadingUser(true);
    try {
      // Reuse an in-flight request so N mounted consumers produce one call.
      cache ??= { promise: Promise.resolve(null), user: null };
      cache.promise = fetchApplicationUser(getToken);
      const result = await cache.promise;
      cache = { promise: cache.promise, user: result };
      setUser(result);
      return result;
    } finally {
      setIsLoadingUser(false);
    }
  }, [isLoaded, isSignedIn, getToken]);

  useEffect(() => {
    void loadUser();
  }, [loadUser]);

  // A sign-out must not leave the previous identity on screen.
  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      clearApplicationUserCache();
      setUser(null);
    }
  }, [isLoaded, isSignedIn]);

  const role: UserRole | null = user?.role ?? null;
  const displayName = user?.displayName?.trim() || '';
  const greetingName = displayName || 'there';

  return {
    user,
    role,
    displayName,
    greetingName,
    isLoadingUser,
    refreshUser: loadUser,
  };
};
