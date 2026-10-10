import { Link } from 'react-router-dom';
import { Zap, Loader2, AlertCircle } from 'lucide-react';
import { ROUTES } from '../../lib/constants';
import { AUTH_BG_IMAGE } from './authTheme';

interface AuthStatusScreenProps {
  message: string;
  error?: string | null;
}

export const AuthStatusScreen = ({ message, error }: AuthStatusScreenProps) => (
  <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#08111f] p-6">
    <img
      src={AUTH_BG_IMAGE}
      alt=""
      aria-hidden
      className="absolute inset-0 h-full w-full object-cover opacity-40"
    />
    <div className="absolute inset-0 bg-gradient-to-b from-[#08111f]/70 via-[#08111f]/30 to-[#08111f]" />

    <div className="relative z-10 w-full max-w-sm rounded-3xl border border-white/15 bg-white/10 p-8 text-center shadow-2xl backdrop-blur-xl">
      <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#3A0CA3] shadow-lg shadow-purple-950/40">
        <Zap size={26} className="text-white" />
      </div>
      {error ? (
        <>
          <div className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-full bg-red-500/15 text-red-400">
            <AlertCircle size={22} />
          </div>
          <h1 className="text-xl font-extrabold text-white">Something went wrong</h1>
          <p className="mt-2 text-sm leading-relaxed text-slate-300">{error}</p>
          <Link
            to={ROUTES.SIGN_IN}
            className="mt-6 block rounded-xl bg-white/10 py-2.5 text-sm font-bold text-white ring-1 ring-white/20 transition-colors hover:bg-white/15"
          >
            Back to sign in
          </Link>
        </>
      ) : (
        <>
          <Loader2 size={30} className="mx-auto animate-spin text-amber-300" />
          <h1 className="mt-4 text-xl font-extrabold text-white">Eddy</h1>
          <p className="mt-1 text-sm text-slate-300">{message}</p>
        </>
      )}
    </div>
  </div>
);
