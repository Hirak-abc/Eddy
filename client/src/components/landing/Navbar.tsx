import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { ROUTES } from '@/lib/constants';
import { Zap, Menu, X } from 'lucide-react';
import { useState } from 'react';

export const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 shadow-lg shadow-black/20" style={{ backgroundColor: '#F8E7C9' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
            <span className="text-2xl font-black tracking-tight" style={{ color: '#23262F' }}>Eddy</span>
          </Link>

          {/* Desktop section links */}
          <div className="hidden md:flex items-center gap-7 text-sm font-semibold" style={{ color: '#23262F' }}>
            <a href="#features" className="transition-colors hover:text-[#3A0CA3]">Features</a>
            <a href="#how-it-works" className="transition-colors hover:text-[#3A0CA3]">How it works</a>
            <a href="#gallery" className="transition-colors hover:text-[#3A0CA3]">Gallery</a>
            <a href="#cta" className="transition-colors hover:text-[#3A0CA3]">Get started</a>
          </div>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center gap-3">
            <Button
              asChild
              size="default"
              className="font-semibold text-white transition-all hover:shadow-lg"
              style={{ backgroundColor: '#3A0CA3' }}
            >
              <Link to={`${ROUTES.SIGN_IN}?role=OWNER`}>Sign in as Owner</Link>
            </Button>
            <Button
              asChild
              size="default"
              className="font-semibold text-white transition-all hover:shadow-lg"
              style={{ backgroundColor: '#3A0CA3' }}
            >
              <Link to={`${ROUTES.SIGN_IN}?role=CUSTOMER`}>Sign in as Customer</Link>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            type="button"
            className="md:hidden p-2 rounded-lg transition-colors hover:bg-black/5"
            style={{ color: '#3A0CA3' }}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
          >
            {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div id="mobile-menu" className="md:hidden px-4 pb-4 pt-2 space-y-2" style={{ backgroundColor: '#F8E7C9', borderTopColor: '#3A0CA3', borderTopWidth: '1px' }}>
          <a href="#features" onClick={() => setMenuOpen(false)} className="block px-2 py-2 rounded-lg text-sm font-semibold hover:bg-black/5" style={{ color: '#23262F' }}>Features</a>
          <a href="#how-it-works" onClick={() => setMenuOpen(false)} className="block px-2 py-2 rounded-lg text-sm font-semibold hover:bg-black/5" style={{ color: '#23262F' }}>How it works</a>
          <a href="#gallery" onClick={() => setMenuOpen(false)} className="block px-2 py-2 rounded-lg text-sm font-semibold hover:bg-black/5" style={{ color: '#23262F' }}>Gallery</a>
          <a href="#cta" onClick={() => setMenuOpen(false)} className="block px-2 py-2 rounded-lg text-sm font-semibold hover:bg-black/5" style={{ color: '#23262F' }}>Get started</a>
          <Button asChild className="w-full justify-center font-semibold text-white" style={{ backgroundColor: '#3A0CA3' }}>
            <Link to={`${ROUTES.SIGN_IN}?role=OWNER`} onClick={() => setMenuOpen(false)}>Sign in as Owner</Link>
          </Button>
          <Button asChild className="w-full justify-center font-semibold text-white" style={{ backgroundColor: '#3A0CA3' }}>
            <Link to={`${ROUTES.SIGN_IN}?role=CUSTOMER`} onClick={() => setMenuOpen(false)}>Sign in as Customer</Link>
          </Button>
        </div>
      )}
    </nav>
  );
};
