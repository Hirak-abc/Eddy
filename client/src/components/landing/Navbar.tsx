import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { ThemeToggle } from '@/components/ThemeToggle';
import { ROUTES } from '@/lib/constants';
import { Zap, Menu, X, ChevronDown } from 'lucide-react';
import { motion } from 'framer-motion';
import { useState } from 'react';

export const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [signInOpen, setSignInOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 shadow-lg shadow-black/20" style={{ backgroundColor: '#000000' }}>
      <div className="w-full px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Brand */}
          <Link
            to={ROUTES.HOME}
            className="flex items-center gap-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 rounded-lg px-2 py-1 transition-all hover:scale-105"
            style={{ outlineColor: '#3A0CA3' }}
            aria-label="Eddy home"
          >
            <div className="flex items-center justify-center w-10 h-10 rounded-lg shadow-md" style={{ backgroundColor: '#3A0CA3' }}>
              <Zap className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-black tracking-tight text-white">Eddy</span>
          </Link>

          {/* Desktop section links */}
          <div className="hidden md:flex items-center gap-7 text-sm font-semibold text-white">
            <a href="#features" className="transition-colors hover:text-[#3A0CA3]">Features</a>
            <a href="#how-it-works" className="transition-colors hover:text-[#3A0CA3]">How it works</a>
            <a href="#gallery" className="transition-colors hover:text-[#3A0CA3]">Gallery</a>
            <a href="#cta" className="transition-colors hover:text-[#3A0CA3]">Get started</a>
          </div>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center gap-2.5">
            <ThemeToggle className="h-7 w-7" />
            <div className="relative">
              {signInOpen && (
                <div className="fixed inset-0 z-10" onClick={() => setSignInOpen(false)} />
              )}
              <button
                type="button"
                className="relative z-20 flex items-center gap-1.5 text-sm font-semibold text-white transition-colors hover:text-white/70"
                onClick={() => setSignInOpen(!signInOpen)}
                aria-haspopup="menu"
                aria-expanded={signInOpen}
              >
                Sign in
                <ChevronDown className={`w-3.5 h-3.5 transition-transform ${signInOpen ? 'rotate-180' : ''}`} />
              </button>
              {signInOpen && (
                <motion.div
                  role="menu"
                  initial={{ opacity: 0, y: -8, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.18 }}
                  className="absolute right-0 z-30 mt-2 w-52 overflow-hidden rounded-xl border border-white/10 bg-black shadow-2xl"
                >
                  <Link
                    to={`${ROUTES.SIGN_IN}?role=OWNER`}
                    onClick={() => setSignInOpen(false)}
                    className="block px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/10"
                  >
                    Sign in as Owner
                  </Link>
                  <Link
                    to={`${ROUTES.SIGN_IN}?role=CUSTOMER`}
                    onClick={() => setSignInOpen(false)}
                    className="block px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/10"
                  >
                    Sign in as Customer
                  </Link>
                </motion.div>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-2 md:hidden">
            <ThemeToggle className="h-8 w-8" />
            <button
              type="button"
              className="p-2 rounded-lg transition-colors hover:bg-white/10 text-white"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
            >
              {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div id="mobile-menu" className="md:hidden px-4 pb-4 pt-2 space-y-2" style={{ backgroundColor: '#000000', borderTopColor: '#3A0CA3', borderTopWidth: '1px' }}>
          <a href="#features" onClick={() => setMenuOpen(false)} className="block px-2 py-2 rounded-lg text-sm font-semibold text-white hover:bg-white/10">Features</a>
          <a href="#how-it-works" onClick={() => setMenuOpen(false)} className="block px-2 py-2 rounded-lg text-sm font-semibold text-white hover:bg-white/10">How it works</a>
          <a href="#gallery" onClick={() => setMenuOpen(false)} className="block px-2 py-2 rounded-lg text-sm font-semibold text-white hover:bg-white/10">Gallery</a>
          <a href="#cta" onClick={() => setMenuOpen(false)} className="block px-2 py-2 rounded-lg text-sm font-semibold text-white hover:bg-white/10">Get started</a>
          <button
            type="button"
            className="flex w-full items-center justify-center gap-1.5 px-2 py-2 text-sm font-semibold text-white"
            onClick={() => setSignInOpen(!signInOpen)}
            aria-haspopup="menu"
            aria-expanded={signInOpen}
          >
            Sign in
            <ChevronDown className={`w-3.5 h-3.5 transition-transform ${signInOpen ? 'rotate-180' : ''}`} />
          </button>
          {signInOpen && (
            <motion.div
              role="menu"
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.18 }}
              className="space-y-1"
            >
              <Button asChild className="w-full justify-center font-semibold text-white" style={{ backgroundColor: '#3A0CA3' }}>
                <Link to={`${ROUTES.SIGN_IN}?role=OWNER`} onClick={() => { setMenuOpen(false); setSignInOpen(false); }}>Sign in as Owner</Link>
              </Button>
              <Button asChild className="w-full justify-center font-semibold text-white" style={{ backgroundColor: '#3A0CA3' }}>
                <Link to={`${ROUTES.SIGN_IN}?role=CUSTOMER`} onClick={() => { setMenuOpen(false); setSignInOpen(false); }}>Sign in as Customer</Link>
              </Button>
            </motion.div>
          )}
        </div>
      )}
    </nav>
  );
};
