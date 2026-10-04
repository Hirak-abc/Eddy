import { useEffect, useState, useCallback, useRef } from 'react';

import { Link, useLocation, useNavigate } from 'react-router-dom';

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

import {

  Card,

  CardContent,

  CardHeader,

  CardTitle,

} from '@/components/ui/Card';

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

const ROLES: {

  id: AuthRole;

  label: string;

  hint: string;

  icon: typeof Store;

}[] = [

  {

    id: 'OWNER',

    label: 'Business Owner',

    hint: 'Flyers, QR & analytics',

    icon: Store,

  },

  {

    id: 'CUSTOMER',

    label: 'Customer',

    hint: 'Scan, earn & redeem',

    icon: User,

  },

];

/**

 * Clerk error codes mapped to user-friendly messages

 */

const CLERK_ERROR_MESSAGES: Record<string, string> = {

  form_identifier_not_found:

    'No account found with this email — please sign up',

  form_password_incorrect:

    'Incorrect password',

  form_too_many_requests:

    'Too many attempts. Please try again later',

  verification_code_incorrect:

    'Incorrect verification code',

  verification_code_expired:

    'Verification code expired. Please request a new one',

  verification_limit_reached:

    'Too many verification attempts. Please try again later',

  email_address_exists:

    'An account with this email already exists',

};

/**

 * Get user-friendly error message from Clerk errors

 */

function getClerkErrorMessage(error: unknown): string {

  if (!(error instanceof Error)) {

    return 'Authentication failed';

  }

  const errorJson = error as Error & {

    clerkError?: boolean;

    errors?: Array<{

      code?: string;

      message?: string;

    }>;

  };

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

  const {

    signUp,

    isLoaded: signUpLoaded,

  } = useSignUp();

  const {

    signIn,

    isLoaded: signInLoaded,

  } = useSignIn();

  const clerkAuth = useClerkAuth();

  const {

    getToken,

    isSignedIn,

    userId,

    isLoaded: authLoaded,

    signOut,

  } = clerkAuth;

  /**

   * clerk.setActive() is required after a successful signUp/signIn

   * when we actually want to activate the Clerk session.

   */

  const clerk = useClerk();

  // If user is already signed in, redirect after OAuth callback.

  useEffect(() => {

    if (

      authLoaded &&

      isSignedIn &&

      userId &&

      location.pathname === '/auth/sso-callback'

    ) {

      handleClerkSuccess();

    }

    // handleClerkSuccess intentionally excluded

    // to prevent redirect loops.

  }, [

    authLoaded,

    isSignedIn,

    userId,

    location.pathname,

  ]);

  // --------------------------------------------

  // STATE

  // --------------------------------------------

  const [role, setRole] = useState<AuthRole | null>(null);

  const [showPassword, setShowPassword] =

    useState(false);

  const [isSubmitting, setIsSubmitting] =

    useState(false);

  const [verificationStep, setVerificationStep] =

    useState(false);

  const [pendingEmail, setPendingEmail] =

    useState('');

  const [username, setUsername] = useState('');

  const [verificationType, setVerificationType] =

    useState<'email'>('email');

  const [otpResendCooldown, setOtpResendCooldown] =

    useState(0);

  // Prevent duplicate requests

  const inFlightRef = useRef(false);

  // Prevent duplicate synchronization

  const syncStartedRef = useRef(false);

  const isSignUp = mode === 'sign-up';

  const title = isSignUp

    ? 'Create your account'

    : 'Welcome back';

  const subtitle = isSignUp

    ? 'Choose how you want to use Eddy'

    : 'Sign in to continue';

  const submitLabel = isSignUp

    ? 'Create account'

    : 'Sign in';

  const switchHref = isSignUp

    ? ROUTES.SIGN_IN

    : ROUTES.SIGN_UP;

  const switchPrompt = isSignUp

    ? 'Already have an account?'

    : "Don't have an account?";

  const switchLabel = isSignUp

    ? 'Sign in'

    : 'Create account';

  // --------------------------------------------

  // FORMS

  // --------------------------------------------

  const emailForm = useForm<EmailAuthInput>({

    resolver: zodResolver(emailAuthSchema),

    defaultValues: {

      email: '',

      password: '',

    },

  });

  const otpForm = useForm<{

    otp: string;

  }>({

    defaultValues: {

      otp: '',

    },

  });

  // --------------------------------------------

  // SAVE ROLE

  // --------------------------------------------

  useEffect(() => {

    if (isSignUp && role) {

      saveAuthRole(role);

    }

  }, [role, isSignUp]);

  // --------------------------------------------

  // RESET FORM WHEN MODE CHANGES

  // --------------------------------------------

  useEffect(() => {

    if (!verificationStep) {

      setVerificationStep(false);

      setPendingEmail('');

    setUsername('');

      setVerificationType('email');

      emailForm.reset({

        email: '',

        password: '',

      });

      otpForm.reset({

        otp: '',

      });

    }

    const saved = getSavedAuthRole();

    if (!saved && !verificationStep) {

      setRole(null);

      clearAuthRole();

    } else if (saved && !verificationStep) {

      setRole(saved);

    }

  }, [mode]);

  // --------------------------------------------

  // RECOVER SAVED ROLE

  // --------------------------------------------

  useEffect(() => {

    if (!verificationStep) {

      const saved = getSavedAuthRole();

      if (saved) {

        setRole(saved);

      }

    }

  }, []);

  // --------------------------------------------

  // OTP RESEND TIMER

  // --------------------------------------------

  useEffect(() => {

    if (otpResendCooldown > 0) {

      const timer = setTimeout(

        () =>

          setOtpResendCooldown(

            otpResendCooldown - 1

          ),

        1000

      );

      return () => clearTimeout(timer);

    }

  }, [otpResendCooldown]);

  // ============================================

  // HANDLE SUCCESSFUL CLERK AUTHENTICATION

  // ============================================

  const handleClerkSuccess = useCallback(
    async (sessionId?: string | null) => {
      if (syncStartedRef.current) {
        console.log('[AUTH] handleClerkSuccess skipped: already running');
        return;
      }

      syncStartedRef.current = true;
      console.log('[AUTH] handleClerkSuccess START', {
        sessionId: sessionId ?? null,
        isSignUp,
        role,
      });

      try {
        // 1. Activate the exact session returned by Clerk.
        const pendingSessionId =
          sessionId ??
          (signUp?.status === 'complete'
            ? signUp.createdSessionId
            : signIn?.status === 'complete'
              ? signIn.createdSessionId
              : null);

        console.log('[AUTH] session to activate:', pendingSessionId);

        if (!pendingSessionId) {
          throw new Error('Clerk returned no created session ID after successful authentication.');
        }

        await clerk.setActive({ session: pendingSessionId });
        console.log('[AUTH] Clerk session activated');

        // Clerk state/token propagation can take a tick after setActive().
        // Retry briefly instead of immediately treating a temporary null token as failure.
        let token: string | null = null;
        for (let attempt = 1; attempt <= 5; attempt += 1) {
          token = await getToken({ skipCache: true });
          console.log(`[AUTH] getToken attempt ${attempt}:`, token ? 'TOKEN_OK' : 'NO_TOKEN');

          if (token) break;

          await new Promise((resolve) => setTimeout(resolve, 250));
        }

        if (!token) {
          throw new Error('Clerk session was activated, but no authentication token was available.');
        }

        // 2. Ask the backend for the authoritative application user/role.
        const roleQuery =
          isSignUp && role
            ? `?role=${encodeURIComponent(role)}`
            : '';

        const meUrl = `${API_BASE_URL}/me${roleQuery}`;
        console.log('[AUTH] GET /me:', meUrl);

        const resp = await fetch(meUrl, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json',
          },
        });

        const rawBody = await resp.text();
        console.log('[AUTH] /me response:', resp.status, rawBody);

        let payload: {
          success?: boolean;
          data?: {
            role?: AuthRole;
          };
          error?: {
            code?: string;
            message?: string;
          };
        };

        try {
          payload = JSON.parse(rawBody) as typeof payload;
        } catch {
          throw new Error(
            `Backend /me returned ${resp.status}, but the response was not valid JSON.`
          );
        }

        if (!resp.ok || !payload.success) {
          throw new Error(
            payload.error?.message ??
              `Backend authentication failed (${resp.status}).`
          );
        }

        const backendRole = payload.data?.role;
        console.log('[AUTH] backend role:', backendRole);

        if (backendRole !== 'OWNER' && backendRole !== 'CUSTOMER') {
          throw new Error(
            `Backend returned an invalid/missing role: ${String(backendRole)}`
          );
        }

        // 3. Persist the authoritative role and clear stale cached user data.
        saveAuthRole(backendRole);
        clearApplicationUserCache();

        // 4. Finally navigate to the role-specific dashboard.
        const destination = getPostAuthPath(backendRole);
        console.log('[AUTH] dashboard destination:', destination);

        toast.success(isSignUp ? 'Account ready — heading in' : 'Signed in');
        navigate(destination, { replace: true });
        console.log('[AUTH] navigation completed');
      } catch (error) {
        syncStartedRef.current = false;
        console.error('[AUTH] handleClerkSuccess FAILED:', error);

        toast.error(
          error instanceof Error
            ? error.message
            : 'We could not finish signing you in. Please try again.'
        );
      }
    },
    [
      role,
      isSignUp,
      getToken,
      navigate,
      clerk,
      signUp,
      signIn,
    ]
  );

  // ============================================

  // CLERK ERROR HANDLER

  // ============================================

  const handleClerkError = (

    error: unknown,

    context?: string

  ) => {

    const message =

      getClerkErrorMessage(error);

    toast.error(message);

    if (context === 'signIn') {

      setIsSubmitting(false);

    }

  };

  // ============================================

  // SIGNUP ROLE CHECK

  // ============================================

  const canSignUp =

    isSignUp ? !!role : true;

  // ============================================

  // GOOGLE OAUTH

  // ============================================

  const handleGoogleOAuth = async () => {

    if (

      !isSignUp &&

      (!signInLoaded || !signIn)

    ) {

      toast.error(

        'Authentication not ready. Please try again.'

      );

      return;

    }

    if (

      isSignUp &&

      (!signUpLoaded || !signUp)

    ) {

      toast.error(

        'Authentication not ready. Please try again.'

      );

      return;

    }

    setIsSubmitting(true);

    try {

      // Preserve selected role

      if (isSignUp && role) {

        saveAuthRole(role);

      }

      const redirectUrl =

        window.location.origin +

        '/google/select';

      if (isSignUp) {

        if (!signUp) {

          toast.error(

            'Authentication not ready.'

          );

          return;

        }

        // Clear existing session

        if (

          authLoaded &&

          isSignedIn &&

          signOut

        ) {

          await signOut();

        }

        await signUp.authenticateWithRedirect(

          {

            strategy: 'oauth_google',

            redirectUrl,

            redirectUrlComplete:

              redirectUrl,

            oidcPrompt:

              'select_account',

          }

        );

      } else {

        if (!signIn) {

          toast.error(

            'Authentication not ready.'

          );

          return;

        }

        await signIn.authenticateWithRedirect(

          {

            strategy: 'oauth_google',

            redirectUrl,

            redirectUrlComplete:

              redirectUrl,

            oidcPrompt:

              'select_account',

          }

        );

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

  const onEmailSignUpSubmit =

    emailForm.handleSubmit(

      async (data) => {

        if (

          !signUpLoaded ||

          !signUp

        ) {

          toast.error(

            'Authentication not ready. Please try again.'

          );

          return;

        }

        if (

          isSignUp &&

          !role

        ) {

          toast.error(

            'Please select how you will use Eddy before continuing'

          );

          return;

        }

        if (inFlightRef.current) {

          return;

        }

        inFlightRef.current = true;

        setIsSubmitting(true);

        try {

          if (!username.trim()) {

            toast.error('Please enter a username');

            return;

          }

          // Clear existing Clerk session

          if (

            authLoaded &&

            isSignedIn &&

            signOut

          ) {

            const currentPath =

              location.pathname;

            if (

              currentPath === '/sign-in' ||

              currentPath === '/sign-up'

            ) {

              await signOut();

            }

          }

          // Create signup

          const signUpResult =

            await signUp.create({

              emailAddress: data.email,

              password: data.password,

              username: username.trim(),

            });

          // If no verification is required

          if (

            signUpResult.status ===

            'complete'

          ) {

            // Email verification was not required.

            // Keep the same desired flow as OTP verification:

            // account created -> sign out temporary session -> sign-in page.

            toast.success(

              'Account created successfully. Please sign in.'

            );

            if (signOut) {

              try {

                await signOut();

              } catch {

                // Ignore sign-out error here.

              }

            }

            syncStartedRef.current = false;

            setVerificationStep(false);

            setPendingEmail('');

            otpForm.reset();

            emailForm.reset({

              email: data.email,

              password: '',

            });

            navigate(

              ROUTES.SIGN_IN,

              {

                replace: true,

              }

            );

            return;

          }

          // Send email verification code

          await signUp.prepareEmailAddressVerification(

            {

              strategy: 'email_code',

            }

          );

          setPendingEmail(

            data.email

          );

          setVerificationType(

            'email'

          );

          setVerificationStep(

            true

          );

          setOtpResendCooldown(

            60

          );

        } catch (error) {

          handleClerkError(error);

        } finally {

          inFlightRef.current =

            false;

          setIsSubmitting(false);

        }

      }

    );

  // ============================================

  // EMAIL SIGN IN

  // ============================================

  const onEmailSignInSubmit =

    emailForm.handleSubmit(

      async (data) => {

        console.log('[DEBUG] onEmailSignInSubmit called, data:', data);

        if (

          !signInLoaded ||

          !signIn

        ) {

          toast.error(

            'Authentication not ready. Please try again.'

          );

          return;

        }

        if (inFlightRef.current) {

          return;

        }

        inFlightRef.current = true;

        setIsSubmitting(true);

        try {

          // Clear existing session

          if (

            authLoaded &&

            isSignedIn &&

            signOut

          ) {

            const currentPath =

              location.pathname;

            if (

              currentPath === '/sign-in' ||

              currentPath === '/sign-up'

            ) {

              await signOut();

            }

          }

          const signInResult =

            await signIn.create({

              identifier:

                data.email,

              password:

                data.password,

            });

          console.log('[DEBUG] Sign-in result status:', signInResult.status);

          // Complete means sign-in has succeeded

          if (

            signInResult.status ===

            'complete'

          ) {

            console.log('[DEBUG] Sign-in complete, calling handleClerkSuccess');

            await handleClerkSuccess(signInResult.createdSessionId);

            console.log('[DEBUG] handleClerkSuccess returned');

            return;

          }

          // Handle OTP verification for email code

          if (

            signInResult.status ===

            'needs_first_factor'

          ) {

            const emailFactor =

              signInResult.supportedFirstFactors?.find(

                (factor) =>

                  factor.strategy ===

                  'email_code'

              );

            if (!emailFactor) {

              throw new Error(

                'Email verification is not available for this account.'

              );

            }

            await signIn.prepareFirstFactor({

              strategy: 'email_code',

              emailAddressId:

                emailFactor.emailAddressId,

            });

            setPendingEmail(data.email);

            setVerificationType('email');

            setVerificationStep(true);

            setOtpResendCooldown(60);

            toast.success(

              'Verification code sent to your email.'

            );

            return;

          }

          // Other status - show error

          toast.error(

            `Sign-in requires another step (${signInResult.status}).`

          );

        } catch (error) {

          console.error('[DEBUG] Sign-in error:', error);

          handleClerkError(

            error,

            'signIn'

          );

        } finally {

          inFlightRef.current =

            false;

          setIsSubmitting(false);

        }

      }

    );

  // ============================================

  // OTP VERIFICATION

  // ============================================

  const onVerificationSubmit =

    otpForm.handleSubmit(

      async (data) => {

        if (

          !signUp &&

          !signIn

        ) {

          toast.error(

            'Authentication session expired. Please try again.'

          );

          return;

        }

        // Prevent double submission

        if (inFlightRef.current) {

          return;

        }

        inFlightRef.current = true;

        setIsSubmitting(true);

        try {

          let result;

          // --------------------------------------

          // EMAIL SIGNUP VERIFICATION

          // --------------------------------------

          if (signUp) {

            result =

              await signUp.attemptEmailAddressVerification(

                {

                  code: data.otp,

                }

              );

          }

          // --------------------------------------

          // SIGN IN VERIFICATION

          // --------------------------------------

          else if (signIn) {

            if (

              signIn.status ===

              'needs_first_factor'

            ) {

              result =

                await signIn.attemptFirstFactor(

                  {

                    strategy:

                      'email_code',

                    code:

                      data.otp,

                  }

                );

            } else {

              throw new Error(

                'Additional verification is required to finish signing in.'

              );

            }

          }

          // ======================================

          // IMPORTANT:

          // VERIFICATION SUCCESS

          // ======================================

          if (
            result?.status ===
            'complete'
          ) {
            console.log('[AUTH] Verification complete:', result);

            // Sign-in OTP: keep the newly created Clerk session active
            // and continue directly to the correct dashboard.
            if (!isSignUp) {
              await handleClerkSuccess(result.createdSessionId);
              return;
            }

            // Sign-up OTP: verification only. The intended flow is
            // Verify Email -> Sign In -> Dashboard.
            toast.success(
              'Email verified successfully. Please sign in.'
            );

            if (signOut) {
              try {
                await signOut();
              } catch {
                // Ignore sign-out errors after successful verification.
              }
            }

            syncStartedRef.current = false;
            setVerificationStep(false);
            setPendingEmail('');
            otpForm.reset();
            emailForm.reset({
              email: pendingEmail,
              password: '',
            });

            navigate(ROUTES.SIGN_IN, {
              replace: true,
            });
            return;
          }

          // ======================================

          // MISSING REQUIREMENTS

          // ======================================

          if (

            result?.status ===

            'missing_requirements'

          ) {

            console.log(

              'VERIFICATION RESULT:',

              result

            );

            console.log(

              'SIGNUP STATUS:',

              signUp?.status

            );

            console.log(

              'MISSING FIELDS:',

              signUp?.missingFields

            );

            console.log(

              'UNVERIFIED FIELDS:',

              signUp?.unverifiedFields

            );

            toast.error(

              'Email verified, but your account still has required setup fields. Check the browser console for missing fields.'

            );

            return;

          }

          // ======================================

          // OTHER STATUS

          // ======================================

          console.log(

            'VERIFICATION RESULT:',

            result

          );

          toast.error(

            'Verification did not complete. Please try again.'

          );

        } catch (error) {

          handleClerkError(error);

        } finally {

          inFlightRef.current =

            false;

          setIsSubmitting(false);

        }

      }

    );

  // ============================================

  // RESEND OTP

  // ============================================

  const handleResendOTP =

    async () => {

      if (

        otpResendCooldown > 0

      ) {

        return;

      }

      if (!signUp) {

        toast.error(

          'Session expired. Please start over.'

        );

        return;

      }

      setIsSubmitting(true);

      try {

        await signUp.prepareEmailAddressVerification(

          {

            strategy:

              'email_code',

          }

        );

        setOtpResendCooldown(

          60

        );

        toast.success(

          'Verification code resent'

        );

      } catch (error) {

        handleClerkError(error);

      } finally {

        setIsSubmitting(false);

      }

    };

  // ============================================

  // SUBMIT HANDLER

  // ============================================

  const onEmailSubmit =

    isSignUp

      ? onEmailSignUpSubmit

      : onEmailSignInSubmit;

  // Always show email form

  const showEmailForm = true;

  // Verification form

  const showVerificationForm =

    verificationStep;

  // Pending contact

  const pendingContact =

    pendingEmail;

  // ============================================

  // UI

  // ============================================

  return (

    <Card className="rounded-xl border-slate-200 shadow-md">

      <CardHeader className="space-y-1 pb-4">

        <CardTitle className="text-2xl font-semibold tracking-tight text-slate-900">

          {title}

        </CardTitle>

        <p className="text-sm text-slate-500">

          {subtitle}

        </p>

      </CardHeader>

      <CardContent className="space-y-5">

        {/* Role selector */}

        {!showVerificationForm &&

          isSignUp && (

            <fieldset>

              <legend className="sr-only">

                Account type

              </legend>

              <div className="grid grid-cols-2 gap-2">

                {ROLES.map(

                  (item) => {

                    const Icon =

                      item.icon;

                    const selected =

                      role ===

                      item.id;

                    return (

                      <button

                        key={item.id}

                        type="button"

                        onClick={() =>

                          setRole(

                            item.id

                          )

                        }

                        aria-pressed={

                          selected

                        }

                        className={cn(

                          'flex flex-col items-start gap-1 rounded-lg border px-3 py-3 text-left transition-colors',

                          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2',

                          selected

                            ? 'border-indigo-200 bg-indigo-50 text-indigo-700'

                            : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'

                        )}

                      >

                        <Icon

                          className={cn(

                            'h-4 w-4',

                            selected

                              ? 'text-indigo-600'

                              : 'text-slate-400'

                          )}

                        />

                        <span className="text-sm font-semibold">

                          {

                            item.label

                          }

                        </span>

                        <span

                          className={cn(

                            'text-xs',

                            selected

                              ? 'text-indigo-600'

                              : 'text-slate-500'

                          )}

                        >

                          {

                            item.hint

                          }

                        </span>

                      </button>

                    );

                  }

                )}

              </div>

            </fieldset>

          )}

        {/* Google OAuth */}

        {!showVerificationForm && (

          <Button

            type="button"

            variant="outline"

            className="w-full"

            onClick={

              handleGoogleOAuth

            }

            disabled={

              isSubmitting

            }

          >

            {isSubmitting ? (

              <Loader2 className="mr-2 h-4 w-4 animate-spin" />

            ) : (

              <svg

                className="mr-2 h-4 w-4"

                viewBox="0 0 24 24"

              >

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

              <span className="bg-white px-2 text-slate-500">

                Or continue with

              </span>

            </div>

          </div>

        )}

        {/* Email tab */}

        {!showVerificationForm && (

          <div

            className="flex rounded-lg bg-slate-100 p-1"

            role="tablist"

            aria-label="Sign-in method"

          >

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

        {/* ======================================

            VERIFICATION FORM

        ====================================== */}

        {showVerificationForm ? (

          <form

            onSubmit={

              onVerificationSubmit

            }

            className="space-y-4"

            noValidate

          >

            <div className="text-center space-y-2 mb-4">

              <p className="text-sm font-medium text-slate-900">

                Verify your{' '}

                {verificationType}

              </p>

              <p className="text-xs text-slate-500">

                We've sent a verification code to{' '}

                {pendingContact}

              </p>

            </div>

            <div>

              <label

                htmlFor="otp"

                className="mb-1 block text-sm font-medium text-slate-900"

              >

                Verification Code

              </label>

              <Input

                id="otp"

                type="text"

                inputMode="numeric"

                maxLength={6}

                placeholder="000000"

                className="text-center tracking-widest text-lg font-mono"

                {...otpForm.register(

                  'otp'

                )}

              />

              <p className="mt-2 text-xs text-slate-500">

                Enter the 6-digit code

              </p>

            </div>

            <Button

              type="submit"

              className="w-full active:scale-[0.98]"

              disabled={

                isSubmitting

              }

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

                onClick={

                  handleResendOTP

                }

                disabled={

                  isSubmitting ||

                  otpResendCooldown >

                    0

                }

                className="w-full text-sm text-indigo-600 hover:underline disabled:text-slate-400 disabled:no-underline"

              >

                {otpResendCooldown >

                0

                  ? `Resend code (${otpResendCooldown}s)`

                  : 'Resend verification code'}

              </button>

              <button

                type="button"

                onClick={() => {

                  setVerificationStep(

                    false

                  );

                  otpForm.reset();

                  setPendingEmail(

                    ''

                  );

                }}

                className="w-full text-sm text-slate-500 hover:text-slate-700"

              >

                Back

              </button>

            </div>

          </form>

        ) : showEmailForm ? (

          /* ======================================

             EMAIL FORM

          ====================================== */

          <form

            onSubmit={

              onEmailSubmit

            }

            className="space-y-4"

            noValidate

          >

            {/* Email */}

            <div>

              <label

                htmlFor="email"

                className="mb-1 block text-sm font-medium text-slate-900"

              >

                Email

              </label>

              <Input

                id="email"

                type="email"

                autoComplete={

                  isSignUp

                    ? 'email'

                    : 'username'

                }

                placeholder="you@example.com"

                aria-invalid={

                  !!emailForm

                    .formState

                    .errors

                    .email

                }

                {...emailForm.register(

                  'email'

                )}

              />

              {emailForm

                .formState

                .errors

                .email && (

                <p

                  className="mt-1 flex items-center gap-1 text-xs text-rose-600"

                  role="alert"

                >

                  <AlertCircle className="h-3.5 w-3.5" />

                  {

                    emailForm

                      .formState

                      .errors

                      .email

                      .message

                  }

                </p>

              )}

            </div>

            {isSignUp && (

              <>

                {/* Username */}

                <div>

                  <label

                    htmlFor="username"

                    className="mb-1 block text-sm font-medium text-slate-900"

                  >

                    Username

                  </label>

                  <Input

                    id="username"

                    type="text"

                    autoComplete="username"

                    placeholder="Choose a username"

                    value={username}

                    onChange={(event) => setUsername(event.target.value)}

                    disabled={isSubmitting}

                  />

                </div>

                </>

            )}

            {/* Password */}

            <div>

              <label

                htmlFor="password"

                className="mb-1 block text-sm font-medium text-slate-900"

              >

                Password

              </label>

              <div className="relative">

                <Input

                  id="password"

                  type={

                    showPassword

                      ? 'text'

                      : 'password'

                  }

                  autoComplete={

                    isSignUp

                      ? 'new-password'

                      : 'current-password'

                  }

                  placeholder="At least 8 characters"

                  className="pr-10"

                  aria-invalid={

                    !!emailForm

                      .formState

                      .errors

                      .password

                  }

                  {...emailForm.register(

                    'password'

                  )}

                />

                <button

                  type="button"

                  onClick={() =>

                    setShowPassword(

                      (value) =>

                        !value

                    )

                  }

                  className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-slate-400 hover:text-slate-700"

                  aria-label={

                    showPassword

                      ? 'Hide password'

                      : 'Show password'

                  }

                >

                  {showPassword ? (

                    <EyeOff className="h-4 w-4" />

                  ) : (

                    <Eye className="h-4 w-4" />

                  )}

                </button>

              </div>

              {emailForm

                .formState

                .errors

                .password && (

                <p

                  className="mt-1 flex items-center gap-1 text-xs text-rose-600"

                  role="alert"

                >

                  <AlertCircle className="h-3.5 w-3.5" />

                  {

                    emailForm

                      .formState

                      .errors

                      .password

                      .message

                  }

                </p>

              )}

            </div>

            {/* Submit */}

            <Button

              type="submit"

              className="w-full active:scale-[0.98]"

              disabled={

                isSubmitting ||

                (isSignUp &&

                  !canSignUp)

              }

            >

              {isSubmitting ? (

                <>

                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />

                  {isSignUp

                    ? 'Creating account...'

                    : 'Signing in...'}

                </>

              ) : isSignUp &&

                !canSignUp ? (

                'Select account type to continue'

              ) : (

                submitLabel

              )}

            </Button>

          </form>

        ) : null}

        {/* Switch auth mode */}

        <p className="text-center text-sm text-slate-500">

          {switchPrompt}{' '}

          <Link

            to={switchHref}

            className="font-medium text-indigo-600 hover:underline"

          >

            {switchLabel}

          </Link>

        </p>

      </CardContent>

    </Card>

  );

};
