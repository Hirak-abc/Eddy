import { useEffect, useState, useCallback, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  AlertCircle,
  Eye,
  EyeOff,
  Loader2,
  Store,
  User,
  Mail,
} from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { cn } from '@/lib/utils';
import { ROUTES, API_BASE_URL } from '@/lib/constants';
import {
  emailAuthSchema,
  type EmailAuthInput,
} from '@/lib/validators';
import {
  saveAuthRole,
  getSavedAuthRole,
  clearAuthRole,
  getPostAuthPath,
  type AuthMode,
  type AuthRole,
} from '@/lib/auth';
import {
  useSignUp,
  useSignIn,
  useAuth as useClerkAuth,
  useClerk,
} from '@clerk/clerk-react';
import { clearApplicationUserCache } from '@/hooks/useApplicationUser';

interface AuthFormProps {
  mode: AuthMode;
}

const ROLES: { id: AuthRole; label: string; hint: string; icon: typeof Store }[] = [
  { id: 'OWNER', label: 'Business Owner', hint: 'Flyers, QR & analytics', icon: Store },
  { id: 'CUSTOMER', label: 'Customer', hint: 'Scan, earn & redeem', icon: User },
];

/** Clerk error codes mapped to user-friendly messages */
const CLERK_ERROR_MESSAGES: Record<string, string> = {
  'form_identifier_not_found': 'No account found with this email — please sign up',
  'form_password_incorrect': 'Incorrect password',
  'form_too_many_requests': 'Too many attempts. Please try again later',
  'verification_code_incorrect': 'Incorrect verification code',
  'verification_code_expired': 'Verification code expired. Please request a new one',
  'verification_limit_reached': 'Too many verification attempts. Please try again later',
  'phone_number_exists': 'This phone number is already registered',
  'email_address_exists': 'An account with this email already exists',
};

/** Get user-friendly error message from Clerk errors */
function getClerkErrorMessage(error: unknown): string {
  if (!(error instanceof Error)) return 'Authentication failed';

  const errorJson = (error as Error & { clerkError?: boolean; errors?: Array<{ code?: string; message?: string }> });

  // Check for specific Clerk error codes
  if (errorJson.errors && Array.isArray(errorJson.errors)) {
    for (const err of errorJson.errors) {
      if (err.code && CLERK_ERROR_MESSAGES[err.code]) {
        return CLERK_ERROR_MESSAGES[err.code];
      }
      if (err.message && err.message.includes('password')) {
        return CLERK_ERROR_MESSAGES['form_password_incorrect'];
      }
    }
  }

  // Fallback to generic messages based on error content
  const msg = error.message.toLowerCase();
  if (msg.includes('email') && msg.includes('exists')) {
    return 'An account with this email already exists';
  }
  if (msg.includes('password') && msg.includes('incorrect')) {
    return 'Incorrect password';
  }
  if (msg.includes('code') && msg.includes('incorrect')) {
    return 'Incorrect verification code';
  }
  if (msg.includes('code') && msg.includes('expired')) {
    return 'Verification code expired. Please request a new one';
  }
  if (msg.includes('too many') || msg.includes('rate limit')) {
    return 'Too many attempts. Please try again later';
  }

  return error.message;
}

export const AuthForm = ({ mode }: AuthFormProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { signUp, isLoaded: signUpLoaded } = useSignUp();
  const { signIn, isLoaded: signInLoaded } = useSignIn();
  const clerkAuth = useClerkAuth();
  const { getToken, isSignedIn, userId, isLoaded: authLoaded, signOut } = clerkAuth;
  // `clerk.setActive()` is required after a successful signUp to actually create
  // the client-side session. Without it the signUp completes but no session is
  // ever activated, so getToken() returns null and /api/me cannot authenticate.
  const clerk = useClerk();

  // If user is already signed in, redirect to the appropriate page immediately.
  // Only redirect when NOT on an auth-related route, to avoid redirect loops
  // when Clerk session exists but /api/me hasn't returned yet (e.g. after OAuth).
  useEffect(() => {
    // After OAuth callback completes, navigate from /auth/sso-callback to dashboard
    if (authLoaded && isSignedIn && userId && location.pathname === '/auth/sso-callback') {
      handleClerkSuccess();
    }
  // handleClerkSuccess excluded to prevent loops
  }, [authLoaded, isSignedIn, userId, location.pathname]);

  // Clear form state when component mounts (fresh signup attempt)
  const [role, setRole] = useState<AuthRole | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [verificationStep, setVerificationStep] = useState(false);
  const [pendingEmail, setPendingEmail] = useState('');
  const [verificationType, setVerificationType] = useState<'email'>('email');
  const [otpResendCooldown, setOtpResendCooldown] = useState(0);

  // Ref-guards (not state) so that concurrent submissions within the same tick
  // are blocked even before React re-renders with isSubmitting=true.
  // Without these, a double click / Enter+click fires two verification calls and
  // the second one is rejected by Clerk as an incorrect code.
  const inFlightRef = useRef(false);
  const syncStartedRef = useRef(false);

  const isSignUp = mode === 'sign-up';
  const title = isSignUp ? 'Create your account' : 'Welcome back';
  const subtitle = isSignUp
    ? 'Choose how you want to use Eddy'
    : 'Sign in to continue';
  const submitLabel = isSignUp ? 'Create account' : 'Sign in';
  const switchHref = isSignUp ? ROUTES.SIGN_IN : ROUTES.SIGN_UP;
  const switchPrompt = isSignUp ? 'Already have an account?' : "Don't have an account?";
  const switchLabel = isSignUp ? 'Sign in' : 'Create account';

  const emailForm = useForm<EmailAuthInput>({
    resolver: zodResolver(emailAuthSchema),
    defaultValues: { email: '', password: '' },
  });

  const otpForm = useForm<{ otp: string }>({
    defaultValues: { otp: '' },
  });

  // Preserve signup role in sessionStorage before OAuth redirect
  useEffect(() => {
    if (isSignUp && role) {
      saveAuthRole(role);
    }
  }, [role, isSignUp]);

  // Clear form state only when mode changes, not on every mount
  useEffect(() => {
    if (!verificationStep) {
      setVerificationStep(false);
      setPendingEmail('');
      setVerificationType('email');
      emailForm.reset({ email: '', password: '' });
      otpForm.reset({ otp: '' });
    }
    // Only reset role if we don't have a saved role for this new signup attempt
    // This preserves role selection across redirect
    const saved = getSavedAuthRole();
    if (!saved && !verificationStep) {
      setRole(null);
      clearAuthRole();
    } else if (saved && !verificationStep) {
      setRole(saved);
    }
  }, [mode]);

  // Recover saved role when component mounts (after OAuth redirect)
  useEffect(() => {
    if (!verificationStep) {
      const saved = getSavedAuthRole();
      if (saved) {
        setRole(saved);
      }
    }
  }, []);

  // OTP resend cooldown timer
  useEffect(() => {
    if (otpResendCooldown > 0) {
      const timer = setTimeout(() => setOtpResendCooldown(otpResendCooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [otpResendCooldown]);

  /**
   * Handle successful Clerk authentication.
   *
   * Order matters here:
   *  1. Make sure a Clerk session is actually active (signUp/signIn only report
   *     a created session id — `clerk.setActive()` activates it client-side).
   *  2. Obtain a session token. If there is none, the session never
   *     established and we must NOT pretend success.
   *  3. Call GET /api/me so the backend runs findOrCreateByClerkId() and the
   *     Convex `users` document is created/looked up.
   *  4. Navigate only after /api/me succeeded. A failure surfaces the real
   *     backend error instead of silently redirecting.
   *
   * `/api/me` stays the authoritative source of the application role. The role
   * selected in the signup form is only passed as a hint for *creating* a new
   * Convex user; the backend never overwrites an existing user's role.
   */
  const handleClerkSuccess = useCallback(async () => {
    // Guard against concurrent invocations (e.g. the useEffect redirect firing
    // at the same time as the submit handler completing).
    if (syncStartedRef.current) return;
    syncStartedRef.current = true;

    try {
      // 1. Activate the session Clerk created during signUp/signIn.
      const pendingSessionId =
        signUp?.status === 'complete' ? signUp.createdSessionId : null;
      if (pendingSessionId) {
        await clerk.setActive({ session: pendingSessionId });
      } else if (signIn?.status === 'complete') {
        await clerk.setActive({ session: signIn.createdSessionId });
      }

      // 2. A token can only be minted once a session exists.
      const token = await getToken();
      if (!token) {
        syncStartedRef.current = false;
        toast.error('Your session could not be established. Please sign in again.');
        return;
      }

      // 3. Synchronize the Clerk user with the Convex application user.
      const roleQuery = isSignUp && role ? `?role=${encodeURIComponent(role)}` : '';
      const resp = await fetch(`${API_BASE_URL}/me${roleQuery}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const payload = (await resp.json()) as {
        success?: boolean;
        data?: { role?: AuthRole };
        error?: { code?: string; message?: string };
      };

      if (!resp.ok || !payload?.success) {
        syncStartedRef.current = false;
        toast.error(
          payload?.error?.message ??
            'We could not finish setting up your account. Please try again.'
        );
        return;
      }

      // Route on the role the BACKEND returned, not on the role picked in this
      // form. Hardcoding /customer/home sent every new OWNER to the customer
      // home page, where ProtectedRoute redirected them back to the landing
      // page — the dashboard was unreachable right after signup.
      const backendRole = payload.data?.role;
      if (backendRole !== 'OWNER' && backendRole !== 'CUSTOMER') {
        syncStartedRef.current = false;
        toast.error('Your account role is missing. Please contact support.');
        return;
      }

      // Presentation-only persistence; authorization always comes from /api/me.
      if (role) saveAuthRole(role);
      // The cached /api/me payload is now stale — drop it so the next mount
      // refetches rather than reading the pre-signup state.
      clearApplicationUserCache();
      toast.success(isSignUp ? 'Account ready — heading in' : 'Signed in');
      navigate(getPostAuthPath(backendRole), { replace: true });
    } catch {
      syncStartedRef.current = false;
      toast.error('We could not finish signing you in. Please try again.');
    }
  }, [role, isSignUp, getToken, navigate, clerk, signUp, signIn]);

  /** Handle Clerk errors with user-friendly messages */
  const handleClerkError = (error: unknown, context?: string) => {
    const message = getClerkErrorMessage(error);
    toast.error(message);
    if (context === 'signIn') {
      setIsSubmitting(false);
    }
  };

  /** Block signup if no role selected */
  const canSignUp = isSignUp ? !!role : true;

  /** Google OAuth sign-in/sign-up - uses Clerk's redirect flow */
  const handleGoogleOAuth = async () => {
    if (!isSignUp && (!signInLoaded || !signIn)) {
      toast.error('Authentication not ready. Please try again.');
      return;
    }
    if (isSignUp && (!signUpLoaded || !signUp)) {
      toast.error('Authentication not ready. Please try again.');
      return;
    }
    setIsSubmitting(true);
    try {
      // Preserve selected role before redirect
      if (isSignUp && role) {
        saveAuthRole(role);
      }

      const redirectUrl = window.location.origin + '/google/select';

      if (isSignUp) {
        if (!signUp) {
          toast.error('Authentication not ready.');
          return;
        }
        // If the user has an existing Clerk session (e.g. from a previous
        // sign-in or a prior OAuth attempt), sign out first so Clerk treats
        // this as a fresh sign-up rather than "already signed in".
        if (authLoaded && isSignedIn && signOut) {
          await signOut();
        }
        // Clerk v5: signUp.authenticateWithRedirect with oauth_google strategy
        await signUp.authenticateWithRedirect({
          strategy: 'oauth_google',
          redirectUrl,
          redirectUrlComplete: redirectUrl,
          oidcPrompt: 'select_account',
        });
      } else {
        // For sign-in with Google
        if (!signIn) {
          toast.error('Authentication not ready.');
          return;
        }
        await signIn.authenticateWithRedirect({
          strategy: 'oauth_google',
          redirectUrl,
          redirectUrlComplete: redirectUrl,
          oidcPrompt: 'select_account',
        });
      }
    } catch (error) {
      handleClerkError(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // ============================================
  // EMAIL SIGNUP
  // ============================================
  const onEmailSignUpSubmit = emailForm.handleSubmit(async (data) => {
    if (!signUpLoaded || !signUp) {
      toast.error('Authentication not ready. Please try again.');
      return;
    }
    if (isSignUp && !role) {
      toast.error('Please select how you will use Eddy before continuing');
      return;
    }
    if (inFlightRef.current) return;
    inFlightRef.current = true;
    setIsSubmitting(true);
    try {
      // When an active Clerk session exists and the user intentionally
      // starts a new auth attempt on /sign-in or /sign-up, clear it first
      // to prevent Clerk's "Already signed in" error on a new attempt.
      if (authLoaded && isSignedIn && signOut) {
        const currentPath = location.pathname;
        if (currentPath === '/sign-in' || currentPath === '/sign-up') {
          await signOut();
        }
      }
      const signUpResult = await signUp.create({
        emailAddress: data.email,
        password: data.password,
      });

      // If Clerk did not require email verification, the sign-up is already
      // complete and a session was created — go straight to synchronization.
      if (signUpResult.status === 'complete') {
        setPendingEmail(data.email);
        setVerificationType('email');
        await handleClerkSuccess();
        return;
      }

      await signUp.prepareEmailAddressVerification({
        strategy: 'email_code',
      });
      setPendingEmail(data.email);
      setVerificationType('email');
      setVerificationStep(true);
      setOtpResendCooldown(60); // Clerk typically has a cooldown
    } catch (error) {
      handleClerkError(error);
    } finally {
      inFlightRef.current = false;
      setIsSubmitting(false);
    }
  });

  // ============================================
  // EMAIL SIGN-IN
  // ============================================
  const onEmailSignInSubmit = emailForm.handleSubmit(async (data) => {
    if (!signInLoaded || !signIn) {
      toast.error('Authentication not ready. Please try again.');
      return;
    }
    if (inFlightRef.current) return;
    inFlightRef.current = true;
    setIsSubmitting(true);
    try {
      // When a Clerk session exists and user starts a new sign-in attempt,
      // clear the active session to prevent "Already signed in" errors.
      if (authLoaded && isSignedIn && signOut) {
        const currentPath = location.pathname;
        if (currentPath === '/sign-in' || currentPath === '/sign-up') {
          await signOut();
        }
      }
      const signInResult = await signIn.create({
        identifier: data.email,
        password: data.password,
      });
      // Only a completed sign-in has a real session to activate. Any other
      // status (needs_second_factor, etc.) must not be treated as success.
      if (signInResult.status === 'complete') {
        await handleClerkSuccess();
      } else {
        toast.error('Additional verification is required to finish signing in.');
      }
    } catch (error) {
      handleClerkError(error, 'signIn');
    } finally {
      inFlightRef.current = false;
      setIsSubmitting(false);
    }
  });

  // ============================================
  // OTP VERIFICATION (Email only)
  // ============================================

  // ============================================
  // OTP VERIFICATION (Email or Phone)
  // ============================================
  const onVerificationSubmit = otpForm.handleSubmit(async (data) => {
    if (!signUp && !signIn) {
      toast.error('Authentication session expired. Please try again.');
      return;
    }
    // Exactly ONE verification request per submit. A second concurrent call
    // consumes the code, and Clerk then answers the follow-up with
    // "verification_code_incorrect" — which is what made a correct code look
    // wrong on the first try. A ref (not state) blocks submits within the same
    // tick, before React re-renders with isSubmitting=true.
    if (inFlightRef.current) return;
    inFlightRef.current = true;
    setIsSubmitting(true);
    try {
      let result;

      // Use signUp verification (email only since mobile removed)
      if (signUp) {
        result = await signUp.attemptEmailAddressVerification({
          code: data.otp,
        });
      } else if (signIn) {
        if (signIn.status === 'needs_first_factor') {
          result = await signIn.attemptFirstFactor({
            strategy: 'phone_code',
            code: data.otp,
          });
        } else {
          throw new Error('Additional verification is required to finish signing in.');
        }
      }

      // After verification complete, redirect directly to dashboard.
      if (result?.status === 'complete') {
        toast.success('Email verified. Welcome!');
        navigate(getPostAuthPath(role || 'CUSTOMER'), { replace: true });
        return;
      }

      // Code already accepted (e.g. Verify pressed twice)
      if (result?.status === 'missing_requirements' && signUp?.createdSessionId) {
        toast.success('Email verified. Welcome!');
        navigate(getPostAuthPath(role || 'CUSTOMER'), { replace: true });
        return;
      }

      // If Clerk reports the verification is already done / missing requirements without session
      if (result?.status === 'missing_requirements') {
        toast.success('Email verified. Welcome!');
        navigate(getPostAuthPath(role || 'CUSTOMER'), { replace: true });
        return;
      }

      toast.error('Verification failed. Please check the code and try again.');
    } catch (error) {
      handleClerkError(error);
    } finally {
      inFlightRef.current = false;
      setIsSubmitting(false);
    }
  });

  // ============================================
  // RESEND OTP
  // ============================================
  const handleResendOTP = async () => {
    if (otpResendCooldown > 0) return;
    if (!signUp) {
      toast.error('Session expired. Please start over.');
      return;
    }
    setIsSubmitting(true);
    try {
      await signUp.prepareEmailAddressVerification({
        strategy: 'email_code',
      });
      setOtpResendCooldown(60);
      toast.success('Verification code resent');
    } catch (error) {
      handleClerkError(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Choose the appropriate submit handler (email only since mobile removed)
  const onEmailSubmit = isSignUp ? onEmailSignUpSubmit : onEmailSignInSubmit;

  // Always show email form (mobile number signup removed)
  const showEmailForm = true;

  // Verification form is shown based on verificationStep state
  const showVerificationForm = verificationStep;

  // Pending contact info display (email only since mobile removed)
  const pendingContact = pendingEmail;

  return (
    <Card className="rounded-xl border-slate-200 shadow-md">
      <CardHeader className="space-y-1 pb-4">
        <CardTitle className="text-2xl font-semibold tracking-tight text-slate-900">
          {title}
        </CardTitle>
        <p className="text-sm text-slate-500">{subtitle}</p>
      </CardHeader>
      <CardContent className="space-y-5">
        {/* Role selector — shown ONLY during signup */}
        {!showVerificationForm && isSignUp && (
          <fieldset>
            <legend className="sr-only">Account type</legend>
            <div className="grid grid-cols-2 gap-2">
              {ROLES.map((item) => {
                const Icon = item.icon;
                const selected = role === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setRole(item.id)}
                    aria-pressed={selected}
                    className={cn(
                      'flex flex-col items-start gap-1 rounded-lg border px-3 py-3 text-left transition-colors',
                      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2',
                      selected
                        ? 'border-indigo-200 bg-indigo-50 text-indigo-700'
                        : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                    )}
                  >
                    <Icon className={cn('h-4 w-4', selected ? 'text-indigo-600' : 'text-slate-400')} />
                    <span className="text-sm font-semibold">{item.label}</span>
                    <span className={cn('text-xs', selected ? 'text-indigo-600' : 'text-slate-500')}>
                      {item.hint}
                    </span>
                  </button>
                );
              })}
            </div>
          </fieldset>
        )}

        {/* Google OAuth Button - shown before auth method tabs */}
        {!showVerificationForm && (
          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={handleGoogleOAuth}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
            )}
            Continue with Google
          </Button>
        )}

        {/* Divider */}
        {!showVerificationForm && (
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-slate-500">Or continue with</span>
            </div>
          </div>
        )}

        {/* Auth method tabs - hidden during verification — email only */}
        {!showVerificationForm && (
          <div className="flex rounded-lg bg-slate-100 p-1" role="tablist" aria-label="Sign-in method">
            <button
              type="button"
              role="tab"
              aria-selected={true}
              className="flex-1 flex items-center justify-center gap-2 rounded-md px-3 py-2 text-sm font-medium bg-white text-slate-900 shadow-sm"
            >
              <Mail className="h-4 w-4" />
              email
            </button>
          </div>
        )}

        {/* Verification code form (after signup) */}
        {showVerificationForm ? (
          <form onSubmit={onVerificationSubmit} className="space-y-4" noValidate>
            <div className="text-center space-y-2 mb-4">
              <p className="text-sm font-medium text-slate-900">
                Verify your {verificationType}
              </p>
              <p className="text-xs text-slate-500">
                We've sent a verification code to {pendingContact}
              </p>
            </div>
            <div>
              <label htmlFor="otp" className="mb-1 block text-sm font-medium text-slate-900">
                Verification Code
              </label>
              <Input
                id="otp"
                type="text"
                inputMode="numeric"
                maxLength={6}
                placeholder="000000"
                className="text-center tracking-widest text-lg font-mono"
                {...otpForm.register('otp')}
              />
              <p className="mt-2 text-xs text-slate-500">Enter the 6-digit code</p>
            </div>
            <Button
              type="submit"
              className="w-full active:scale-[0.98]"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Verifying
                </>
              ) : (
                'Verify'
              )}
            </Button>
            <div className="flex flex-col gap-2">
              <button
                type="button"
                onClick={handleResendOTP}
                disabled={isSubmitting || otpResendCooldown > 0}
                className="w-full text-sm text-indigo-600 hover:underline disabled:text-slate-400 disabled:no-underline"
              >
                {otpResendCooldown > 0
                  ? `Resend code (${otpResendCooldown}s)`
                  : 'Resend verification code'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setVerificationStep(false);
                  otpForm.reset();
                  setPendingEmail('');
                }}
                className="w-full text-sm text-slate-500 hover:text-slate-700"
              >
                Back
              </button>
            </div>
          </form>
        ) : showEmailForm ? (
          <form onSubmit={onEmailSubmit} className="space-y-4" noValidate>
            <div>
              <label htmlFor="email" className="mb-1 block text-sm font-medium text-slate-900">
                Email
              </label>
              <Input
                id="email"
                type="email"
                autoComplete={isSignUp ? 'email' : 'username'}
                placeholder="you@example.com"
                aria-invalid={!!emailForm.formState.errors.email}
                {...emailForm.register('email')}
              />
              {emailForm.formState.errors.email && (
                <p className="mt-1 flex items-center gap-1 text-xs text-rose-600" role="alert">
                  <AlertCircle className="h-3.5 w-3.5" />
                  {emailForm.formState.errors.email.message}
                </p>
              )}
            </div>
            <div>
              <label htmlFor="password" className="mb-1 block text-sm font-medium text-slate-900">
                Password
              </label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete={isSignUp ? 'new-password' : 'current-password'}
                  placeholder="At least 8 characters"
                  className="pr-10"
                  aria-invalid={!!emailForm.formState.errors.password}
                  {...emailForm.register('password')}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((value) => !value)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-slate-400 hover:text-slate-700"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {emailForm.formState.errors.password && (
                <p className="mt-1 flex items-center gap-1 text-xs text-rose-600" role="alert">
                  <AlertCircle className="h-3.5 w-3.5" />
                  {emailForm.formState.errors.password.message}
                </p>
              )}
            </div>
            <Button
              type="submit"
              className="w-full active:scale-[0.98]"
              disabled={isSubmitting || (isSignUp && !canSignUp)}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {isSignUp ? 'Creating account...' : 'Signing in...'}
                </>
              ) : isSignUp && !canSignUp ? (
                'Select account type to continue'
              ) : (
                submitLabel
              )}
            </Button>
          </form>
        ) : null}

        <p className="text-center text-sm text-slate-500">
          {switchPrompt}{' '}
          <Link to={switchHref} className="font-medium text-indigo-600 hover:underline">
            {switchLabel}
          </Link>
        </p>
      </CardContent>
    </Card>
  );
};