import { useState } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import {
  Home,
  Scan,
  Wallet,
  Gift,
  User,
} from 'lucide-react';
import { Navbar } from '@/components/shared/navbar';
import { Sidebar, SidebarNavItem } from '@/components/shared/sidebar';

// Mock user data - will be replaced with actual auth
const mockUser = {
  name: 'Jane Smith',
  email: 'jane@example.com',
  role: 'CUSTOMER' as const,
  avatar: '',
};

const customerNavItems: SidebarNavItem[] = [
  {
    title: 'Home',
    href: '/customer/home',
    icon: Home,
  },
  {
    title: 'Scan QR',
    href: '/customer/scan',
    icon: Scan,
  },
  {
    title: 'Wallet',
    href: '/customer/wallet',
    icon: Wallet,
    badge: '50',
  },
  {
    title: 'Rewards',
    href: '/customer/rewards',
    icon: Gift,
  },
  {
    title: 'Profile',
    href: '/customer/profile',
    icon: User,
  },
];

export function CustomerLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // TODO: Replace with actual auth check
  const isAuthenticated = true;
  const isCustomer = true;

  if (!isAuthenticated) {
    return <Navigate to="/auth/signin" replace />;
  }

  if (!isCustomer) {
    return <Navigate to="/owner/dashboard" replace />;
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
          items={customerNavItems}
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
