import { AuthenticateWithRedirectCallback } from '@clerk/clerk-react';
import { AuthCompletePage } from './AuthCompletePage';

/**
 * OAuth callback route for Clerk's Google redirect flow.
 *
 * Clerk resolves the callback (validates state, exchanges the code, establishes
 * the session) and then completes silently. Our AuthCompletePage handles the
 * final navigation based on the user's role from the backend.
 */
export const AuthCallbackPage = () => {
  return (
    <>
      <AuthenticateWithRedirectCallback
        signUpUrl="/sign-up"
        signInUrl="/sign-in"
        afterSignUpUrl="/auth/sso-callback"
        afterSignInUrl="/auth/sso-callback"
      />
      <AuthCompletePage />
    </>
  );
};
