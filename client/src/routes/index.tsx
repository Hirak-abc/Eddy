import { createBrowserRouter } from 'react-router-dom';
import { LandingPage } from '@/pages/LandingPage';
import { SignInPage } from '@/pages/auth/SignInPage';
import { SignUpPage } from '@/pages/auth/SignUpPage';
import { NotFoundPage } from '@/pages/NotFoundPage';

// Owner pages
import { OwnerLayout } from '@/layouts/OwnerLayout';
import { DashboardPage } from '@/pages/owner/DashboardPage';
import { FlyerBuilderPage } from '@/pages/owner/FlyerBuilderPage';
import { AnalyticsPage } from '@/pages/owner/AnalyticsPage';
import { QRPage } from '@/pages/owner/QRPage';
import { CouponsPage } from '@/pages/owner/CouponsPage';
import { ReviewsPage } from '@/pages/owner/ReviewsPage';
import { SocialPage } from '@/pages/owner/SocialPage';
import { WalletPage as OwnerWalletPage } from '@/pages/owner/WalletPage';
import { RewardsPage as OwnerRewardsPage } from '@/pages/owner/RewardsPage';
import { SettingsPage } from '@/pages/owner/SettingsPage';

// Customer pages
import { CustomerLayout } from '@/layouts/CustomerLayout';
import { HomePage } from '@/pages/customer/HomePage';
import { ScanPage } from '@/pages/customer/ScanPage';
import { CustomerWalletPage } from '@/pages/customer/WalletPage';
import { CustomerRewardsPage } from '@/pages/customer/RewardsPage';
import { ProfilePage } from '@/pages/customer/ProfilePage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <LandingPage />,
  },
  {
    path: '/auth/signin',
    element: <SignInPage />,
  },
  {
    path: '/auth/signup',
    element: <SignUpPage />,
  },
  // Owner routes
  {
    path: '/owner',
    element: <OwnerLayout />,
    children: [
      {
        path: 'dashboard',
        element: <DashboardPage />,
      },
      {
        path: 'flyers',
        element: <FlyerBuilderPage />,
      },
      {
        path: 'analytics',
        element: <AnalyticsPage />,
      },
      {
        path: 'qr',
        element: <QRPage />,
      },
      {
        path: 'coupons',
        element: <CouponsPage />,
      },
      {
        path: 'reviews',
        element: <ReviewsPage />,
      },
      {
        path: 'social',
        element: <SocialPage />,
      },
      {
        path: 'wallet',
        element: <OwnerWalletPage />,
      },
      {
        path: 'rewards',
        element: <OwnerRewardsPage />,
      },
      {
        path: 'settings',
        element: <SettingsPage />,
      },
    ],
  },
  // Customer routes
  {
    path: '/customer',
    element: <CustomerLayout />,
    children: [
      {
        path: 'home',
        element: <HomePage />,
      },
      {
        path: 'scan',
        element: <ScanPage />,
      },
      {
        path: 'wallet',
        element: <CustomerWalletPage />,
      },
      {
        path: 'rewards',
        element: <CustomerRewardsPage />,
      },
      {
        path: 'profile',
        element: <ProfilePage />,
      },
    ],
  },
  {
    path: '*',
    element: <NotFoundPage />,
  },
]);
