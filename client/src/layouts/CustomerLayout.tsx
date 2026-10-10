import { Link, Outlet } from 'react-router-dom';
import { Coins, MapPin } from 'lucide-react';
import { CustomerSidebar } from '../components/CustomerSidebar';

export const CustomerLayout = () => {
  return (
    <div className="flex min-h-screen">
      <CustomerSidebar />
      <div className="min-w-0 flex-1 bg-slate-50">
        <header className="sticky top-0 z-20 flex items-center justify-between border-b border-slate-200/80 bg-white/90 px-4 py-3 shadow-sm backdrop-blur sm:px-6">
          <div className="flex items-center gap-1.5 text-sm font-semibold text-slate-600">
            <MapPin size={15} className="text-amber-500" />
            Lucknow
          </div>
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1.5 text-sm font-extrabold text-amber-700 ring-1 ring-amber-200">
              <Coins size={15} />
              85
            </span>
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-slate-700 to-slate-900 text-sm font-black text-white">
              A
            </span>
          </div>
        </header>
        <main className="p-4 sm:p-6">
          <Outlet />
        </main>
        <footer className="border-t border-slate-200/80 bg-white px-4 py-4 sm:px-6">
          <div className="flex flex-col items-center justify-between gap-2 text-xs text-slate-400 sm:flex-row">
            <p>© 2026 Eddy. All rights reserved.</p>
            <Link to="/privacy" className="font-semibold text-slate-500 hover:text-amber-600">
              Privacy Policy
            </Link>
          </div>
        </footer>
      </div>
    </div>
  );
};
