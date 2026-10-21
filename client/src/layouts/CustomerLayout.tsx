import { useState } from 'react';
import { Link, Outlet } from 'react-router-dom';
import { Coins, MapPin, Menu } from 'lucide-react';
import { CustomerSidebar } from '../components/CustomerSidebar';
import { ThemeToggle } from '../components/ThemeToggle';
import { useProfilePhoto } from '../hooks/useProfilePhoto';
import { useCustomerWallet } from '../hooks/useCustomerWallet';
import { ROUTES } from '../lib/constants';

export const CustomerLayout = () => {
  const { photoUrl } = useProfilePhoto();
  const { wallet, isLoading } = useCustomerWallet();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen">
      <CustomerSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      <div className="min-w-0 flex-1 bg-slate-50 dark:bg-slate-950">
        <header className="sticky top-0 z-20 flex items-center justify-between border-b border-slate-200/80 bg-white/90 px-4 py-3 shadow-sm backdrop-blur sm:px-6 dark:border-slate-800 dark:bg-slate-900/90">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsSidebarOpen(true)}
              aria-label="Open menu"
              className="rounded-lg p-1.5 text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white lg:hidden"
            >
              <Menu size={20} />
            </button>
            <div className="flex items-center gap-1.5 text-sm font-semibold text-slate-600">
              <MapPin size={15} className="text-amber-500" />
              Lucknow
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1.5 text-sm font-extrabold text-amber-700 ring-1 ring-amber-200 dark:bg-amber-500/10 dark:text-amber-300 dark:ring-amber-500/30">
              <Coins size={15} />
              {isLoading ? '…' : wallet?.balance ?? '—'}
            </span>
            <ThemeToggle />
            <Link
              to={ROUTES.CUSTOMER_PROFILE}
              title="View profile"
              aria-label="View profile"
              className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-slate-700 to-slate-900 text-sm font-black text-white ring-offset-2 ring-offset-white transition hover:ring-2 hover:ring-amber-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 dark:ring-offset-slate-900"
            >
              {photoUrl ? (
                <img src={photoUrl} alt="Profile" className="h-full w-full object-cover" />
              ) : (
                'A'
              )}
            </Link>
          </div>
        </header>
        <main className="p-4 sm:p-6">
          <Outlet />
        </main>
        <footer className="border-t border-slate-200/80 bg-white px-4 py-4 sm:px-6 dark:border-slate-800 dark:bg-slate-900">
          <div className="flex flex-col items-center justify-between gap-2 text-xs text-slate-400 sm:flex-row">
            <p>© 2026 Eddy. All rights reserved.</p>
            <div className="flex items-center gap-4">
              <Link to="/privacy" className="font-semibold text-slate-500 hover:text-amber-600">
                Privacy Policy
              </Link>
              <Link to="/terms" className="font-semibold text-slate-500 hover:text-amber-600">
                Terms of Service
              </Link>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};
