import { useState } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Sparkles,
  BarChart3,
  QrCode,
  Ticket,
  MessageSquare,
  Share2,
  Wallet,
  Gift,
  Settings,
} from 'lucide-react';
import { Navbar } from '@/components/shared/navbar';
import { Sidebar, SidebarNavItem } from '@/components/shared/sidebar';

// Mock user data - will be replaced with actual auth
const mockUser = {
  name: 'John Doe',
  email: 'john@example.com',
  role: 'OWNER' as const,
  avatar: '',
};

const ownerNavItems: SidebarNavItem[] = [
  {
    title: 'Dashboard',
    href: '/owner/dashboard',
    icon: LayoutDashboard,
  },
  {
    title: 'Flyers',
    href: '/owner/flyers',
    icon: Sparkles,
    badge: '2',
  },
  {
    title: 'Analytics',
    href: '/owner/analytics',
    icon: BarChart3,
  },
  {
    title: 'QR Code',
    href: '/owner/qr',
    icon: QrCode,
  },
  {
    title: 'Coupons',
    href: '/owner/coupons',
    icon: Ticket,
  },
  {
    title: 'Reviews',
    href: '/owner/reviews',
    icon: MessageSquare,
  },
  {
    title: 'Social Media',
    href: '/owner/social',
    icon: Share2,
  },
  {
    title: 'Wallet',
    href: '/owner/wallet',
    icon: Wallet,
  },
  {
    title: 'Rewards',
    href: '/owner/rewards',
    icon: Gift,
  },
  {
    title: 'Settings',
    href: '/owner/settings',
    icon: Settings,
  },
];

export function OwnerLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // TODO: Replace with actual auth check
  const isAuthenticated = true;
  const isOwner = true;

  if (!isAuthenticated) {
    return <Navigate to="/auth/signin" replace />;
  }

  if (!isOwner) {
    return <Navigate to="/customer/home" replace />;
  }

  const handleSignOut = () => {
    // TODO: Implement actual sign out
    console.log('Sign out');
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar
        showMenuButton
        onMenuClick={() => setSidebarOpen(!sidebarOpen)}
        user={mockUser}
        onSignOut={handleSignOut}
      />
      <div className="flex">
        <Sidebar
          items={ownerNavItems}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />
        <main className="flex-1 p-4 md:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
