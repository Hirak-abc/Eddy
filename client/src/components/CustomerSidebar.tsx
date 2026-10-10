import { Link, useLocation } from 'react-router-dom';
import {
  Home, Search, QrCode, Target, Wallet, History,
  Ticket, UserCheck, Zap, Star, Settings, ScanLine,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { name: 'Home', path: '/customer/home', icon: Home },
  { name: 'Discover', path: '/customer/discover', icon: Search },
  { name: 'Scan QR', path: '/customer/scan', icon: QrCode },
  { name: 'Spin Wheel', path: '/customer/spin-wheel', icon: Target },
  { name: 'Wallet', path: '/customer/wallet', icon: Wallet },
  { name: 'History', path: '/customer/history', icon: History },
  { name: 'Coupons', path: '/customer/coupons', icon: Ticket },
  { name: 'Following', path: '/customer/following', icon: UserCheck },
  { name: 'Streak', path: '/customer/streak', icon: Zap },
  { name: 'Reviews', path: '/customer/review-rating', icon: Star },
  { name: 'Settings', path: '/customer/settings', icon: Settings },
];

export const CustomerSidebar = () => {
  const location = useLocation();

  return (
    <div className="flex min-h-screen w-64 shrink-0 flex-col bg-slate-950 text-white">
      <Link to="/customer/home" className="flex items-center gap-2.5 px-5 pb-5 pt-6">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400 to-orange-600 shadow-lg shadow-amber-500/20">
          <Zap size={18} className="text-white" />
        </div>
        <div className="leading-tight">
          <p className="text-lg font-black tracking-tight">Eddy</p>
          <p className="text-[11px] font-medium text-slate-400">Rewards Club</p>
        </div>
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
              className={cn(
                'flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-semibold transition-all',
                isActive
                  ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg shadow-amber-500/20'
                  : 'text-slate-400 hover:bg-white/5 hover:text-white'
              )}
            >
              <Icon size={19} />
              {item.name}
            </Link>
          );
        })}
      </nav>

      <div className="p-4">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
          <div className="flex items-center gap-2 text-sm font-bold text-amber-300">
            <ScanLine size={16} />
            3 scans left
          </div>
          <p className="mt-1 text-xs leading-relaxed text-slate-400">
            Scan shop QR codes to earn coins & unlock spins.
          </p>
          <Link
            to="/customer/scan"
            className="mt-3 block rounded-xl bg-white/10 py-2 text-center text-xs font-bold text-white transition-colors hover:bg-white/15"
          >
            Scan now
          </Link>
        </div>
      </div>
    </div>
  );
};
