import { Link, useLocation } from 'react-router-dom';
import {
  BarChart2, ClipboardList, LayoutDashboard, QrCode,
  Settings, ShoppingBag, Users, Wallet, Share2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { ROUTES } from '@/lib/constants';

const navItems = [
  { name: 'Dashboard', path: ROUTES.OWNER_DASHBOARD, icon: LayoutDashboard },
  { name: 'Flyers', path: ROUTES.OWNER_FLYERS, icon: ClipboardList },
  { name: 'Coupons', path: ROUTES.OWNER_COUPONS, icon: ShoppingBag },
  { name: 'QR Code', path: ROUTES.OWNER_QR, icon: QrCode },
  { name: 'Social Media', path: ROUTES.OWNER_SOCIAL, icon: Share2 },
  { name: 'Wallet', path: ROUTES.OWNER_WALLET, icon: Wallet },
  { name: 'Analytics', path: ROUTES.OWNER_ANALYTICS, icon: BarChart2 },
  { name: 'Reviews', path: ROUTES.OWNER_REVIEWS, icon: Users },
  { name: 'Settings', path: ROUTES.OWNER_SETTINGS, icon: Settings },
];

export const Sidebar = () => {
  const location = useLocation();

  return (
    <div className="w-64 bg-slate-900 text-white min-h-screen p-4">
      <h2 className="text-xl font-bold mb-6 text-indigo-400">Eddy Owner</h2>
      <nav className="space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname.startsWith(item.path);
          return (
            <Link
              key={item.name}
              to={item.path}
              className={cn(
                "flex items-center gap-3 px-4 py-2 rounded-lg transition-colors",
                isActive ? "bg-indigo-600 text-white" : "hover:bg-slate-800 text-slate-300"
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
