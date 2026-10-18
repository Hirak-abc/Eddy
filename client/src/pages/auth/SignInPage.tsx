import { SignIn } from '@clerk/clerk-react';
import { Link, useLocation, useSearchParams } from 'react-router-dom';
import { FloatingThemeToggle } from '@/components/ThemeToggle';
import { AUTH_BG_IMAGE, authAppearance } from './authTheme';
import {
  getRememberedAuthFlowRole,
  rememberAuthFlowRole,
  rememberAuthRedirect,
  resolveAuthFlowRole,
} from '@/lib/authRedirect';

export const SignInPage = () => {
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const paramRole = searchParams.get('role');

  const from = (location.state as { from?: unknown } | null)?.from;
  if (typeof from === 'string') {
    rememberAuthRedirect(from);
  }

  const role = resolveAuthFlowRole(
    paramRole,
    getRememberedAuthFlowRole(),
    location.pathname !== '/sign-in',
  );
  rememberAuthFlowRole(role);

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-[#08111f] p-6">
      <FloatingThemeToggle />
      {/* Unsplash background image */}
      <img
        src={AUTH_BG_IMAGE}
        alt="Modern workspace background"
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-black/5" />

      {/* Glass shell around Clerk card */}
      <div className="relative z-10 rounded-[2rem] border border-white/35 bg-white/35 p-3 shadow-2xl shadow-black/40 backdrop-blur-xl">
        <div className="pointer-events-none absolute inset-0 rounded-[2rem] bg-gradient-to-br from-white/45 via-white/20 to-white/10" />
        <div className="relative">
          <SignIn
            routing="path"
            path="/sign-in"
            signUpUrl={`/sign-up?role=${role}`}
            fallbackRedirectUrl={`/complete-login?role=${role}`}
            forceRedirectUrl={`/complete-login?role=${role}`}
            appearance={authAppearance}
          />
        </div>
      </div>
      <p className="relative z-10 mt-6 text-center text-xs text-slate-400">
        Protected by Clerk ·{' '}
        <Link to="/privacy" className="font-semibold text-slate-300 underline-offset-2 hover:underline">
          Privacy Policy
        </Link>
      </p>
    </div>
  );
};
