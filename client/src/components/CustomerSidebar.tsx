import { Link, useLocation } from 'react-router-dom';
import {
  Home, Search, QrCode, Target, Wallet, History,
  Ticket, UserCheck, Zap, Star
} from 'lucide-react';
import { cn } from '@/lib/utils';
// Removed unused import


const navItems = [
  { name: 'Home', path: '/customer/home', icon: Home },
  { name: 'Discover', path: '/customer/discover', icon: Search },
  { name: 'Scan QR', path: '/customer/scan', icon: QrCode },
  { name: 'Spin Wheel', path: '/customer/spin', icon: Target },
  { name: 'Wallet', path: '/customer/wallet', icon: Wallet },
  { name: 'History', path: '/customer/history', icon: History },
  { name: 'Coupons', path: '/customer/coupons', icon: Ticket },
  { name: 'Following', path: '/customer/following', icon: UserCheck },
  { name: 'Streak', path: '/customer/streak', icon: Zap },
  { name: 'Reviews', path: '/customer/review', icon: Star },
];

export const CustomerSidebar = () => {
  const location = useLocation();

  return (
    <div className="w-64 bg-emerald-900 text-white min-h-screen p-4">
      <h2 className="text-xl font-bold mb-6 text-emerald-400">Eddy Customer</h2>
      <nav className="space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname.startsWith(item.path);
          return (
            <Link
              key={item.name}
              to={item.path}
              className={cn(
                "flex items-center gap-3 px-4 py-2 rounded-lg transition-colors",
                isActive ? "bg-emerald-700 text-white" : "hover:bg-emerald-800 text-emerald-100"
              )}
            >
              <Icon size={20} />
              {item.name}
            </Link>
          );
        })}
      </nav>
    </div>
  );
};
