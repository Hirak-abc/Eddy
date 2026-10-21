import { Link, useLocation } from 'react-router-dom';
import {
  Home, Search, QrCode, Target, Wallet, History,
  Ticket, UserCheck, Zap, Star, Settings, ScanLine, X,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { MAX_DAILY_SCANS } from '@/lib/constants';

const navItems: {
  name: string;
  path: string;
  icon: React.ElementType;
  badge?: string;
}[] = [
  { name: 'Home', path: '/customer/home', icon: Home },
  { name: 'Discover', path: '/customer/discover', icon: Search, badge: 'Soon' },
  { name: 'Scan QR', path: '/customer/scan', icon: QrCode },
  { name: 'Spin Wheel', path: '/customer/spin-wheel', icon: Target },
  { name: 'Wallet', path: '/customer/wallet', icon: Wallet },
  { name: 'History', path: '/customer/history', icon: History },
  { name: 'Coupons', path: '/customer/coupons', icon: Ticket },
  { name: 'Following', path: '/customer/following', icon: UserCheck, badge: 'Soon' },
  { name: 'Streak', path: '/customer/streak', icon: Zap, badge: 'Soon' },
  { name: 'Reviews', path: '/customer/review-rating', icon: Star, badge: 'Soon' },
  { name: 'Settings', path: '/customer/settings', icon: Settings },
];

interface CustomerSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CustomerSidebar = ({ isOpen, onClose }: CustomerSidebarProps) => {
  const location = useLocation();

  return (
    <>
      <div
        aria-hidden
        onClick={onClose}
        className={cn(
          'fixed inset-0 z-30 bg-slate-950/50 backdrop-blur-sm transition-opacity duration-300 lg:hidden',
          isOpen ? 'opacity-100' : 'pointer-events-none opacity-0',
        )}
      />
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-40 flex w-64 shrink-0 transform flex-col overflow-y-auto bg-slate-950 text-white transition-transform duration-300 ease-in-out lg:sticky lg:top-0 lg:h-screen lg:translate-x-0',
          isOpen ? 'translate-x-0' : '-translate-x-full',
        )}
      >
        <Link to="/customer/home" className="flex items-center gap-2.5 px-5 pb-5 pt-6">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400 to-orange-600 shadow-lg shadow-amber-500/20">
            <Zap size={18} className="text-white" />
          </div>
          <div className="min-w-0 flex-1 leading-tight">
            <p className="text-lg font-black tracking-tight">Eddy</p>
            <p className="text-[11px] font-medium text-slate-400">Rewards Club</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close menu"
            className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-white/5 hover:text-white lg:hidden"
          >
            <X size={18} />
          </button>
        </Link>

      <nav className="flex-1 space-y-1 px-3">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            location.pathname === item.path || location.pathname.startsWith(`${item.path}/`);
          return (
            <Link
              key={item.name}
              to={item.path}
              onClick={onClose}
              className={cn(
                'flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-semibold transition-all',
                isActive
                  ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg shadow-amber-500/20'
                  : 'text-slate-400 hover:bg-white/5 hover:text-white'
              )}
            >
              <Icon size={19} />
              <span className="flex-1">{item.name}</span>
              {item.badge && (
                <span
                  className={cn(
                    'rounded-full border px-2 py-0.5 text-[10px] font-semibold tracking-wide',
                    isActive
                      ? 'border-white/20 bg-white/20 text-white'
                      : 'border-amber-500/30 bg-amber-500/20 text-amber-300'
                  )}
                >
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      <div className="p-4">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
          <div className="flex items-center gap-2 text-sm font-bold text-amber-300">
            <ScanLine size={16} />
            Up to {MAX_DAILY_SCANS} scans per day
          </div>
          <p className="mt-1 text-xs leading-relaxed text-slate-400">
            Scan shop QR codes to earn coins & unlock spins.
          </p>
          <Link
            to="/customer/scan"
            onClick={onClose}
            className="mt-3 block rounded-xl bg-white/10 py-2 text-center text-xs font-bold text-white transition-colors hover:bg-white/15"
          >
            Scan now
          </Link>
        </div>
      </div>
      </aside>
    </>
  );
};
