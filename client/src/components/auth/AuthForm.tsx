import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AlertCircle, Eye, EyeOff, Loader2, Store, User } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { cn } from '@/lib/utils';
import { ROUTES } from '@/lib/constants';
import {
  emailAuthSchema,
  phoneAuthSchema,
  type EmailAuthInput,
  type PhoneAuthInput,
} from '@/lib/validators';
import {
  getPostAuthPath,
  getSavedAuthRole,
  saveAuthRole,
  type AuthMethod,
  type AuthMode,
  type AuthRole,
} from '@/lib/auth';

interface AuthFormProps {
  mode: AuthMode;
}

const ROLES: { id: AuthRole; label: string; hint: string; icon: typeof Store }[] = [
  { id: 'OWNER', label: 'Business Owner', hint: 'Flyers, QR & analytics', icon: Store },
  { id: 'CUSTOMER', label: 'Customer', hint: 'Scan, earn & redeem', icon: User },
];

export const AuthForm = ({ mode }: AuthFormProps) => {
  const navigate = useNavigate();
  const [role, setRole] = useState<AuthRole>('OWNER');
  const [method, setMethod] = useState<AuthMethod>('email');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [phoneOtpStep, setPhoneOtpStep] = useState(false);

  const isSignUp = mode === 'sign-up';
  const title = isSignUp ? 'Create your account' : 'Welcome back';
  const subtitle = isSignUp
    ? 'Choose how you want to use Eddy'
    : 'Sign in to continue to Eddy';
  const submitLabel = isSignUp ? 'Create account' : 'Sign in';
  const switchHref = isSignUp ? ROUTES.SIGN_IN : ROUTES.SIGN_UP;
  const switchPrompt = isSignUp ? 'Already have an account?' : "Don't have an account?";
  const switchLabel = isSignUp ? 'Sign in' : 'Create account';

  const emailForm = useForm<EmailAuthInput>({
    resolver: zodResolver(emailAuthSchema),
    defaultValues: { email: '', password: '' },
  });

  const phoneForm = useForm<PhoneAuthInput>({
    resolver: zodResolver(phoneAuthSchema),
    defaultValues: { phone: '' },
  });

  const otpForm = useForm<{ otp: string }>({
    defaultValues: { otp: '' },
  });

  // UI-only mock. Colleague: replace with Clerk signIn.create / signUp.create.
  const finishAuth = async () => {
    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 600));
    if (isSignUp) saveAuthRole(role);
    const nextRole = isSignUp ? role : getSavedAuthRole();
    toast.success(isSignUp ? 'Account ready — heading in' : 'Signed in');
    navigate(getPostAuthPath(nextRole));
    setIsSubmitting(false);
  };

  const onEmailSubmit = emailForm.handleSubmit(async () => {
    await finishAuth();
  });

  const onPhoneSubmit = phoneForm.handleSubmit(async () => {
    // Show mock OTP screen
    setPhoneOtpStep(true);
  });

  const onOtpSubmit = otpForm.handleSubmit(async (data) => {
    if (data.otp.length !== 6 || !/^\d+$/.test(data.otp)) {
      toast.error('Enter a valid 6-digit OTP');
      return;
    }
    await finishAuth();
  });

  return (
    <Card className="rounded-xl border-slate-200 shadow-md">
      <CardHeader className="space-y-1 pb-4">
        <CardTitle className="text-2xl font-semibold tracking-tight text-slate-900">
          {title}
        </CardTitle>
        <p className="text-sm text-slate-500">{subtitle}</p>
      </CardHeader>
      <CardContent className="space-y-5">
        {isSignUp && (
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

        {!phoneOtpStep && (
          <div className="flex rounded-lg bg-slate-100 p-1" role="tablist" aria-label="Sign-in method">
            {(['email', 'phone'] as const).map((tab) => {
              const selected = method === tab;
              return (
                <button
                  key={tab}
                  type="button"
                  role="tab"
                  aria-selected={selected}
                  onClick={() => setMethod(tab)}
                  className={cn(
                    'flex-1 rounded-md px-3 py-2 text-sm font-medium capitalize transition-colors',
                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500',
                    selected ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-800'
                  )}
                >
                  {tab}
                </button>
              );
            })}
          </div>
        )}

        {phoneOtpStep ? (
          <form onSubmit={onOtpSubmit} className="space-y-4" noValidate>
            <div className="text-center space-y-2 mb-4">
              <p className="text-sm font-medium text-slate-900">Enter the OTP</p>
              <p className="text-xs text-slate-500">
                We've sent a 6-digit code to +91 {phoneForm.getValues('phone')}
              </p>
            </div>
            <div>
              <label htmlFor="otp" className="mb-1 block text-sm font-medium text-slate-900">
                One-Time Password
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
              <p className="mt-2 text-xs text-slate-500">Any 6 digits work (demo mode)</p>
            </div>
            <Button type="submit" className="w-full active:scale-[0.98]" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Verifying
                </>
              ) : (
                'Verify OTP'
              )}
            </Button>
            <button
              type="button"
              onClick={() => {
                setPhoneOtpStep(false);
                otpForm.reset();
              }}
              className="w-full text-sm text-indigo-600 hover:underline"
            >
              Change number
            </button>
          </form>
        ) : method === 'email' ? (
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
            <Button type="submit" className="w-full active:scale-[0.98]" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Please wait
                </>
              ) : (
                submitLabel
              )}
            </Button>
          </form>
        ) : (
          <form onSubmit={onPhoneSubmit} className="space-y-4" noValidate>
            <div>
              <label htmlFor="phone" className="mb-1 block text-sm font-medium text-slate-900">
                Mobile number
              </label>
              <div className="flex">
                <span className="inline-flex items-center rounded-l-md border border-r-0 border-slate-200 bg-slate-50 px-3 text-sm text-slate-500">
                  +91
                </span>
                <Input
                  id="phone"
                  type="tel"
                  inputMode="numeric"
                  autoComplete="tel-national"
                  placeholder="9876543210"
                  maxLength={10}
                  className="rounded-l-none"
                  aria-invalid={!!phoneForm.formState.errors.phone}
                  {...phoneForm.register('phone')}
                />
              </div>
              {phoneForm.formState.errors.phone && (
                <p className="mt-1 flex items-center gap-1 text-xs text-rose-600" role="alert">
                  <AlertCircle className="h-3.5 w-3.5" />
                  {phoneForm.formState.errors.phone.message}
                </p>
              )}
              <p className="mt-2 text-xs text-slate-500">OTP will be sent to this number</p>
            </div>
            <Button type="submit" className="w-full active:scale-[0.98]" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Please wait
                </>
              ) : (
                'Send OTP'
              )}
            </Button>
          </form>
        )}

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
