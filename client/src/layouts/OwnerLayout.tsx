import { useState } from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { UserButton, useUser } from '@clerk/clerk-react';
import {
  Menu,
  X,
  Sparkles,
  Store,
  CheckCircle2,
  Bell,
  Clock,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';
import { Sidebar } from '../components/Sidebar';
import { OwnerProvider, useOwner } from '../context/OwnerContext';
import { ROUTES } from '../lib/constants';
import { Button } from '../components/ui/Button';

const OwnerHeader = ({ onOpenMobileMenu }: { onOpenMobileMenu: () => void }) => {
  const { business, toggleAutoPublish, trendFlyer, transactions } = useOwner();
  const { user } = useUser();
  const navigate = useNavigate();

  const pendingRequests = transactions.filter((t) => t.status === 'PENDING');
  const pendingAmount = pendingRequests.reduce((sum, t) => sum + t.amount, 0);

  return (
    <header className="sticky top-0 z-20 h-16 bg-white/95 backdrop-blur-md border-b border-slate-200 px-4 lg:px-8 flex items-center justify-between shadow-xs">
      {/* Left: Mobile Hamburger & Store Badge */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobileMenu}
          className="lg:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors"
          aria-label="Open navigation menu"
        >
          <Menu size={22} />
        </button>

        <Link
          to={ROUTES.OWNER_PROFILE}
          className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200/80 transition-all group"
          title="View & Edit Business Profile"
        >
          <div className="w-7 h-7 rounded-lg bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-600 shrink-0 group-hover:scale-105 transition-transform">
            <Store size={15} />
          </div>
          <div className="flex flex-col text-left">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold text-slate-900 group-hover:text-indigo-600 transition-colors truncate max-w-[140px] sm:max-w-[200px]">
                {business.name}
              </span>
              <CheckCircle2 size={13} className="text-emerald-500 shrink-0" title="Verified Business" />
            </div>
            <span className="text-[10px] text-slate-500 font-medium truncate max-w-[140px] sm:max-w-[180px]">
              {business.category}
            </span>
          </div>
        </Link>
      </div>

      {/* Right: Actions, Auto-Publish status, Pending Alert & Profile */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Pending Redemptions Banner if any */}
        {pendingRequests.length > 0 && (
          <Link
            to={ROUTES.OWNER_WALLET}
            className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-50 hover:bg-amber-100 border border-amber-200/80 text-amber-900 text-xs font-medium transition-colors animate-pulse"
          >
            <span className="w-2 h-2 rounded-full bg-amber-500" />
            <span>
              <strong>{pendingRequests.length}</strong> Pending Redemption{pendingRequests.length > 1 ? 's' : ''} (₹{pendingAmount})
            </span>
            <ChevronRight size={14} className="text-amber-600" />
          </Link>
        )}

        {/* Auto-Publish Pill Toggle */}
        <button
          onClick={() => toggleAutoPublish()}
          className={`hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
            business.autoPublish
              ? 'bg-indigo-50 border-indigo-200 text-indigo-700 hover:bg-indigo-100'
              : 'bg-slate-100 border-slate-200 text-slate-600 hover:bg-slate-200'
          }`}
          title="Toggle automatic AI flyer publication (48h window)"
        >
          <Clock size={13} className={business.autoPublish ? 'text-indigo-600' : 'text-slate-400'} />
          <span>Auto-Publish: <strong>{business.autoPublish ? 'ON' : 'PAUSED'}</strong></span>
          <span
            className={`w-2 h-2 rounded-full ${
              business.autoPublish ? 'bg-indigo-600' : 'bg-slate-400'
            }`}
          />
        </button>

        {/* Quick Action: Create Flyer */}
        <Button
          onClick={() => navigate(ROUTES.OWNER_CREATE_FLYER)}
          size="sm"
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-sm flex items-center gap-1.5 rounded-xl px-3.5"
        >
          <Sparkles size={14} />
          <span className="hidden sm:inline">Create</span> AI Flyer
        </Button>

        {/* Public Shop Preview Link */}
        <Link
          to={`/shop/${business.id}`}
          target="_blank"
          rel="noopener noreferrer"
          className="hidden xl:flex items-center gap-1.5 text-xs text-slate-500 hover:text-indigo-600 px-2.5 py-1.5 rounded-lg hover:bg-slate-100 transition-colors font-medium"
          title="Preview Customer Shop Environment"
        >
          <span>Live Shop</span>
          <ExternalLink size={12} />
        </Link>

        {/* User Account / Clerk Avatar */}
        <div className="pl-1 border-l border-slate-200 flex items-center">
          <UserButton
            afterSignOutUrl={ROUTES.HOME}
            appearance={{
              elements: {
                avatarBox: 'w-8 h-8 rounded-xl ring-2 ring-indigo-500/20 shadow-xs',
              },
            }}
          />
        </div>
      </div>
    </header>
  );
};

export const OwnerLayout = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <OwnerProvider>
      <div className="min-h-screen bg-slate-50 flex flex-row">
        {/* Desktop Sidebar */}
        <div className="hidden lg:block">
          <Sidebar />
        </div>

        {/* Mobile Drawer Overlay */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 lg:hidden flex">
            <div
              className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
              onClick={() => setMobileMenuOpen(false)}
            />
            <div className="relative z-10 flex">
              <Sidebar isMobile onCloseMobile={() => setMobileMenuOpen(false)} />
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="absolute top-4 right-4 p-2 rounded-lg bg-slate-800 text-slate-300 hover:text-white"
              >
                <X size={20} />
              </button>
            </div>
          </div>
        )}

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0">
          <OwnerHeader onOpenMobileMenu={() => setMobileMenuOpen(true)} />
          <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
            <Outlet />
          </main>
          <footer className="border-t border-slate-200/80 bg-white px-4 py-4 sm:px-6 lg:px-8">
            <div className="mx-auto flex w-full max-w-7xl flex-col items-center justify-between gap-2 text-xs text-slate-400 sm:flex-row">
              <p>© 2026 Eddy · AI marketing for local businesses</p>
              <Link to="/privacy" className="font-semibold text-slate-500 hover:text-indigo-600">
                Privacy Policy
              </Link>
            </div>
          </footer>
        </div>
      </div>
    </OwnerProvider>
  );
};
