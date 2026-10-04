import { createBrowserRouter, Navigate } from 'react-router-dom';
import { ROUTES } from '../lib/constants';
import { LandingPage } from '../pages/LandingPage';
import { SignInPage } from '../pages/auth/SignInPage';
import { SignUpPage } from '../pages/auth/SignUpPage';
import { CompleteSignupPage } from '../pages/auth/CompleteSignupPage';
import { CompleteLoginPage } from '../pages/auth/CompleteLoginPage';
import { OwnerLayout } from '../layouts/OwnerLayout';
import { DashboardPage } from '../pages/owner/DashboardPage';
import { OnboardingPage } from '../pages/owner/OnboardingPage';
import { TrendFlyersPage } from '../pages/owner/TrendFlyersPage';
import { FlyersDashboardPage } from '../pages/owner/FlyersDashboardPage';
import { FlyerBuilderPage } from '../pages/owner/FlyerBuilderPage';
import { ScheduledFlyersPage } from '../pages/owner/ScheduledFlyersPage';
import { PublishedFlyersPage } from '../pages/owner/PublishedFlyersPage';
import { CouponsPage } from '../pages/owner/CouponsPage';
import { ReviewsPage } from '../pages/owner/ReviewsPage';
import { WalletPage as OwnerWalletPage } from '../pages/owner/WalletPage';
import { QRPage } from '../pages/owner/QRPage';
import { SocialPage } from '../pages/owner/SocialPage';
import { AnalyticsPage } from '../pages/owner/AnalyticsPage';
import { SettingsPage } from '../pages/owner/SettingsPage';
import { CustomerLayout } from '../layouts/CustomerLayout';
import { HomePage } from '../pages/customer/HomePage';
import { ShopDiscoveryPage } from '../pages/customer/ShopDiscoveryPage';
import { ShopEnvironmentPage } from '../pages/customer/ShopEnvironmentPage';
import { SpinWheelPage } from '../pages/customer/SpinWheelPage';
import { CustomerWalletPage } from '../pages/customer/WalletPage';
import { CouponCodesPage } from '../pages/customer/CouponCodesPage';
import { FollowingPage } from '../pages/customer/FollowingPage';
import { StreakPage } from '../pages/customer/StreakPage';
import { TransactionHistoryPage } from '../pages/customer/TransactionHistoryPage';
import { ReviewRatingPage } from '../pages/customer/ReviewRatingPage';
import { ScanPage } from '../pages/customer/ScanPage';
import { CustomerRewardsPage } from '../pages/customer/RewardsPage';
import { ProfilePage } from '../pages/customer/ProfilePage';
import { ProtectedRoute } from './ProtectedRoute';

export const router = createBrowserRouter([
  // Public
  { path: ROUTES.HOME, element: <LandingPage /> },
  { path: `${ROUTES.SIGN_IN}/*`, element: <SignInPage /> },
  { path: `${ROUTES.SIGN_UP}/*`, element: <SignUpPage /> },
  { path: '/complete-signup', element: <CompleteSignupPage /> },
  { path: '/complete-login', element: <CompleteLoginPage /> },

  // Protected Owner
  {
    path: '/owner',
    element: (
      <ProtectedRoute role="OWNER">
        <OwnerLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <Navigate to="dashboard" replace /> },
      { path: 'dashboard', element: <DashboardPage /> },
      { path: 'onboarding', element: <OnboardingPage /> },
      { path: 'trend-flyers', element: <TrendFlyersPage /> },
      {
        path: 'flyers',
        children: [
          { index: true, element: <FlyersDashboardPage /> },
          { path: 'create', element: <FlyerBuilderPage /> },
          { path: 'scheduled', element: <ScheduledFlyersPage /> },
          { path: 'published', element: <PublishedFlyersPage /> },
        ],
      },
      { path: 'coupons', element: <CouponsPage /> },
      { path: 'reviews', element: <ReviewsPage /> },
      { path: 'wallet', element: <OwnerWalletPage /> },
      { path: 'qr', element: <QRPage /> },
      { path: 'social', element: <SocialPage /> },
      { path: 'analytics', element: <AnalyticsPage /> },
      { path: 'settings', element: <SettingsPage /> },
    ],
  },

  // Protected Customer
  {
    path: '/customer',
    element: (
      <ProtectedRoute role="CUSTOMER">
        <CustomerLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <Navigate to="home" replace /> },
      { path: 'home', element: <HomePage /> },
      { path: 'discover', element: <ShopDiscoveryPage /> },
      { path: 'shop', element: <ShopEnvironmentPage /> },
      { path: 'scan', element: <ScanPage /> },
      { path: 'spin', element: <SpinWheelPage /> },
      { path: 'rewards', element: <CustomerRewardsPage /> },
      { path: 'wallet', element: <CustomerWalletPage /> },
      { path: 'coupons', element: <CouponCodesPage /> },
      { path: 'following', element: <FollowingPage /> },
      { path: 'streak', element: <StreakPage /> },
      { path: 'history', element: <TransactionHistoryPage /> },
      { path: 'profile', element: <ProfilePage /> },
      { path: 'review', element: <ReviewRatingPage /> },
    ],
  },

  // Public QR Shop Entry
  { path: ROUTES.SHOP, element: <ShopEnvironmentPage /> },
]);
