import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth as useClerkAuth } from '@clerk/clerk-react';
import { API_BASE_URL } from '@/lib/constants';
import { getPostAuthPath, clearAuthRole, type AuthRole } from '@/lib/auth';
import { clearApplicationUserCache } from '@/hooks/useApplicationUser';

/**
 * Post-OAuth completion step.
 *
 * Clerk's `<AuthenticateWithRedirectCallback />` establishes the session and
 * navigates here. The signup role chosen before the redirect is still in
 * sessionStorage, and this is the only place the OAuth flow can hand it to the
 * backend — `AuthForm` is never reached again after a redirect, so without
 * this step every new Google signup was created as a CUSTOMER.
 *
 * The role is passed only as a creation hint; for an existing user the backend
 * ignores it and returns the stored role, which is what we route on.
 */
export const AuthCompletePage = () => {
  const navigate = useNavigate();
  const clerkAuth = useClerkAuth();
  const { isLoaded, isSignedIn, getToken } = clerkAuth;
  const [message] = useState('Finishing sign-in — opening dashboard…');
  const startedRef = useRef(false);

  useEffect(() => {
    console.log('[AuthCompletePage] isLoaded=', isLoaded, 'isSignedIn=', isSignedIn, 'userId=', clerkAuth.userId);
    if (!isLoaded) {
      console.log('[AuthCompletePage] Clerk not loaded yet');
      return;
    }
    // If Clerk session is not yet active, wait — don't redirect away.
    // AuthCompletePage runs alongside <AuthenticateWithRedirectCallback>,
    // which activates the session; once active this effect re-runs.
    if (!isSignedIn) {
      return;
    }
    if (startedRef.current) return;
    startedRef.current = true;

    const complete = async () => {
      try {
        const token = await getToken();
        if (!token) {
          // No token available — retry briefly rather than redirecting to landing.
          // The session may still be establishing after OAuth callback.
          return;
        }

        // Pass role hint from sessionStorage for new-user creation
        const savedRole = sessionStorage.getItem('eddy.authRole') as 'OWNER' | 'CUSTOMER' | null;
        const roleQuery = savedRole ? `?role=${encodeURIComponent(savedRole)}` : '';
        const resp = await fetch(`${API_BASE_URL}/me${roleQuery}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const payload = (await resp.json()) as {
          success?: boolean;
          data?: { role?: AuthRole };
          error?: { message?: string };
        };

        if (!resp.ok || !payload?.success) {
          // Backend error — navigate to landing rather than staying on auth page.
          navigate('/', { replace: true });
          return;
        }

        console.log('[AuthCompletePage] token=', !!token, 'payload=', payload, 'backendRole=', payload?.data?.role);
        const backendRole = payload.data?.role;
        if (!backendRole || (backendRole !== 'OWNER' && backendRole !== 'CUSTOMER')) {
          // Role missing — navigate to landing. In production this should
          // trigger an alert or retry; here we redirect gracefully.
          navigate('/', { replace: true });
          return;
        }

        clearAuthRole();
        clearApplicationUserCache();
        console.log('[AuthCompletePage] NAVIGATE to=', getPostAuthPath(backendRole as AuthRole), 'role=', backendRole);
        const path = getPostAuthPath(backendRole as AuthRole);
        navigate(path, { replace: true });
      } catch {
        // Any error — navigate to home page
        navigate('/', { replace: true });
      }
    };

    void complete();
  }, [isLoaded, isSignedIn, getToken, navigate]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-3 bg-slate-50 px-4">
      <div
        className="h-8 w-8 animate-spin rounded-full border-2 border-slate-300 border-t-indigo-600"
        aria-hidden="true"
      />
      <p className="text-sm text-slate-600" role="status">
        {message}
      </p>
    </div>
  );
};
