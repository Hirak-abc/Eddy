import { useCallback, useEffect, useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { UserButton } from '@clerk/clerk-react';
import {
  Menu,
  X,
  Sparkles,
  Store,
  CheckCircle2,
  Clock,
  ExternalLink,
} from 'lucide-react';
import { Sidebar } from '../components/Sidebar';
import { ThemeToggle } from '../components/ThemeToggle';
import { OwnerProvider, useOwner } from '../context/OwnerContext';
import { ROUTES } from '../lib/constants';
import { Button } from '../components/ui/Button';
import {
  BUSINESS_PROFILE_UPDATED_EVENT,
  businessService,
  type OwnerBusiness,
} from '../services/business.service';

const OwnerHeader = ({
  onOpenMobileMenu,
  savedBusiness,
  profileLoading,
  profileError,
  onRetryProfile,
}: {
  onOpenMobileMenu: () => void;
  savedBusiness: OwnerBusiness | null;
  profileLoading: boolean;
  profileError: string | null;
  onRetryProfile: () => void;
}) => {
  const { business, toggleAutoPublish } = useOwner();
  const navigate = useNavigate();
  const location = useLocation();
  const isDashboard = location.pathname === ROUTES.OWNER_DASHBOARD;

  return (
    <header className="sticky top-0 z-20 h-16 bg-white/95 backdrop-blur-md border-b border-slate-200 px-4 lg:px-8 flex items-center justify-between shadow-xs dark:border-slate-800 dark:bg-slate-900/95">
      {/* Left: Mobile Hamburger & Store Badge */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobileMenu}
          className="lg:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors"
          aria-label="Open navigation menu"
        >
          <Menu size={22} />
        </button>

        {savedBusiness ? (
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
                  {savedBusiness.name}
                </span>
                {savedBusiness.verificationStatus === 'VERIFIED' && (
                  <span title="Verified Business" className="inline-flex">
                    <CheckCircle2 size={13} className="text-emerald-500 shrink-0" />
                  </span>
                )}
              </div>
              <span className="text-[10px] text-slate-500 font-medium truncate max-w-[140px] sm:max-w-[180px]">
                {savedBusiness.category}
              </span>
            </div>
          </Link>
        ) : profileLoading ? (
          <div className="flex items-center gap-2.5 rounded-xl border border-slate-200/80 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-500">
            <Store size={15} />
            Loading shop profile…
          </div>
        ) : profileError ? (
          <Button
            variant="outline"
            onClick={onRetryProfile}
            title={profileError}
            className="rounded-xl text-xs"
          >
            Retry profile
          </Button>
        ) : !isDashboard ? (
          <Link
            to={ROUTES.OWNER_SETTINGS}
            className="group flex items-center gap-2.5 rounded-xl border border-indigo-200 bg-gradient-to-r from-indigo-50 to-violet-50 px-3 py-1.5 shadow-sm transition-all hover:-translate-y-0.5 hover:border-indigo-300 hover:shadow-md"
            title="Set up your business profile in Settings & Billing"
          >
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-indigo-600 text-white shadow-sm transition-transform group-hover:scale-105">
              <Store size={14} />
            </div>
            <span className="text-xs font-bold text-indigo-800 transition-colors group-hover:text-violet-800">
              Set your profile
            </span>
          </Link>
        ) : null}
      </div>

      {/* Right: Actions, Auto-Publish status & Profile */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Auto-Publish Pill Toggle */}
        <button
          onClick={() => toggleAutoPublish()}
          className={`hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
            business.autoPublish
              ? 'bg-indigo-50 border-indigo-200 text-indigo-700 hover:bg-indigo-100'
              : 'bg-slate-100 border-slate-200 text-slate-600 hover:bg-slate-200'
          }`}
          title="Toggle automatic AI flyer publication (72h after generation)"
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

        <ThemeToggle className="h-8 w-8" />

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

const OwnerWorkspace = () => {
  const { business } = useOwner();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [savedBusiness, setSavedBusiness] = useState<OwnerBusiness | null>(null);
  const [profileLoading, setProfileLoading] = useState(true);
  const [profileError, setProfileError] = useState<string | null>(null);
  const location = useLocation();
  const sidebarBusinessName = savedBusiness ? business.name : '';

  const loadSavedBusiness = useCallback(async () => {
    setProfileLoading(true);
    const response = await businessService.getMine();
    if (!response.success) {
      setProfileError(response.error?.message ?? 'Could not load your shop profile.');
      setProfileLoading(false);
      return;
    }
    setSavedBusiness(response.data);
    setProfileError(null);
    setProfileLoading(false);
  }, []);

  useEffect(() => {
    void loadSavedBusiness();
    window.addEventListener(BUSINESS_PROFILE_UPDATED_EVENT, loadSavedBusiness);
    return () => window.removeEventListener(BUSINESS_PROFILE_UPDATED_EVENT, loadSavedBusiness);
  }, [loadSavedBusiness]);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-row dark:bg-slate-950">
      {/* Desktop Sidebar */}
      <div className="hidden lg:block">
        <Sidebar businessName={sidebarBusinessName} />
      </div>

      {/* Mobile Drawer Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="relative z-10 flex">
            <Sidebar
              isMobile
              businessName={sidebarBusinessName}
              onCloseMobile={() => setMobileMenuOpen(false)}
            />
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
        <OwnerHeader
          onOpenMobileMenu={() => setMobileMenuOpen(true)}
          savedBusiness={savedBusiness}
          profileLoading={profileLoading}
          profileError={profileError}
          onRetryProfile={() => void loadSavedBusiness()}
        />
        {!profileLoading &&
          !profileError &&
          !savedBusiness &&
          location.pathname === ROUTES.OWNER_DASHBOARD && (
            <div className="fixed inset-0 z-40 flex items-center justify-center bg-slate-950/75 px-4 py-8 backdrop-blur-sm">
              <section
                role="dialog"
                aria-modal="true"
                aria-labelledby="owner-profile-prompt-title"
                className="relative w-full max-w-xl overflow-hidden rounded-3xl border border-white/15 bg-gradient-to-br from-slate-900 via-indigo-950 to-violet-950 p-7 text-center text-white shadow-2xl shadow-indigo-950/50 sm:p-10"
              >
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute -right-16 -top-20 h-56 w-56 rounded-full bg-indigo-500/25 blur-3xl"
                />
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute -bottom-24 -left-12 h-56 w-56 rounded-full bg-violet-500/20 blur-3xl"
                />
                <div className="relative mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-white/15 bg-white/10 text-indigo-200 shadow-lg shadow-indigo-950/30">
                  <Store size={30} />
                </div>
                <p className="relative mt-6 text-xs font-extrabold uppercase tracking-[0.2em] text-indigo-200">
                  Welcome to Eddy
                </p>
                <h1
                  id="owner-profile-prompt-title"
                  className="relative mt-2 text-2xl font-black tracking-tight sm:text-3xl"
                >
                  Set up your business profile
                </h1>
                <p className="relative mx-auto mt-3 max-w-md text-sm leading-relaxed text-slate-300">
                  Add your shop name, category, and address to personalize your owner dashboard and get your shop ready for customers.
                </p>
                <Link
                  to={ROUTES.OWNER_SETTINGS}
                  className="profile-color-blink group relative mx-auto mt-7 flex min-h-14 w-full max-w-sm items-center justify-center gap-3 rounded-2xl border px-6 py-3 text-base font-extrabold shadow-lg transition-transform hover:scale-[1.02] focus:outline-none focus:ring-4 focus:ring-yellow-300/50"
                >
                  <Store size={20} />
                  <span>Set your profile</span>
                  <Sparkles size={18} />
                </Link>
                <p className="relative mt-4 text-xs font-medium text-slate-400">
                  Your shop name will appear here once your profile is saved.
                </p>
              </section>
            </div>
          )}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
        <footer className="border-t border-slate-200/80 bg-white px-4 py-4 sm:px-6 lg:px-8 dark:border-slate-800 dark:bg-slate-900">
          <div className="mx-auto flex w-full max-w-7xl flex-col items-center justify-between gap-2 text-xs text-slate-400 sm:flex-row">
            <p>© 2026 Eddy · Marketing for local businesses</p>
            <div className="flex items-center gap-4">
              <Link to="/privacy" className="font-semibold text-slate-500 hover:text-indigo-600">
                Privacy Policy
              </Link>
              <Link to="/terms" className="font-semibold text-slate-500 hover:text-indigo-600">
                Terms of Service
              </Link>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export const OwnerLayout = () => (
  <OwnerProvider>
    <OwnerWorkspace />
  </OwnerProvider>
);
