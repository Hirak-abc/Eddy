import { createBrowserRouter, Navigate } from 'react-router-dom';
import { LandingPage } from './pages/LandingPage';
import { SignInPage } from './pages/auth/SignInPage';
import { SignUpPage } from './pages/auth/SignUpPage';
import { CompleteLoginPage } from './pages/auth/CompleteLoginPage';
import { CompleteSignupPage } from './pages/auth/CompleteSignupPage';
import { NotFoundPage } from './pages/NotFoundPage';
import { PrivacyPolicyPage } from './pages/PrivacyPolicyPage';
import { ProtectedRoute } from './routes/ProtectedRoute';

// Owner pages
import { DashboardPage as OwnerDashboardPage } from './pages/owner/DashboardPage';
import { OnboardingPage } from './pages/owner/OnboardingPage';
import { FlyerBuilderPage } from './pages/owner/FlyerBuilderPage';
import { FlyersDashboardPage } from './pages/owner/FlyersDashboardPage';
import { ScheduledFlyersPage } from './pages/owner/ScheduledFlyersPage';
import { PublishedFlyersPage } from './pages/owner/PublishedFlyersPage';
import { TrendFlyersPage } from './pages/owner/TrendFlyersPage';
import { CouponsPage as OwnerCouponsPage } from './pages/owner/CouponsPage';
import { ReviewsPage as OwnerReviewsPage } from './pages/owner/ReviewsPage';
import { WalletPage as OwnerWalletPage } from './pages/owner/WalletPage';
import { QRPage } from './pages/owner/QRPage';
import { SocialPage } from './pages/owner/SocialPage';
import { AnalyticsPage } from './pages/owner/AnalyticsPage';
import { BusinessProfilePage } from './pages/owner/BusinessProfilePage';
import { SettingsPage } from './pages/owner/SettingsPage';
import { RewardsPage as OwnerRewardsPage } from './pages/owner/RewardsPage';

// Customer pages
import { HomePage as CustomerHomePage } from './pages/customer/HomePage';
import { ShopDiscoveryPage } from './pages/customer/ShopDiscoveryPage';
import { ScanPage } from './pages/customer/ScanPage';
import { CustomerRewardsPage } from './pages/customer/RewardsPage';
import { CustomerWalletPage } from './pages/customer/WalletPage';
import { TransactionHistoryPage } from './pages/customer/TransactionHistoryPage';
import { CouponCodesPage } from './pages/customer/CouponCodesPage';
import { FollowingPage } from './pages/customer/FollowingPage';
import { StreakPage } from './pages/customer/StreakPage';
import { ProfilePage as CustomerProfilePage } from './pages/customer/ProfilePage';
import { SettingsPage as CustomerSettingsPage } from './pages/customer/SettingsPage';
import { SpinWheelPage } from './pages/customer/SpinWheelPage';
import { ReviewRatingPage } from './pages/customer/ReviewRatingPage';
import { ShopEnvironmentPage } from './pages/customer/ShopEnvironmentPage';

// Layouts
import { OwnerLayout } from './layouts/OwnerLayout';
import { CustomerLayout } from './layouts/CustomerLayout';

export const router = createBrowserRouter([
  // Public routes
  {
    path: '/',
    element: <LandingPage />,
    errorElement: <NotFoundPage />,
  },

  // Auth routes
  {
    path: '/sign-in/*',
    element: <SignInPage />,
  },
  {
    path: '/sign-up/*',
    element: <SignUpPage />,
  },
  {
    path: '/complete-login',
    element: <CompleteLoginPage />,
  },
  {
    path: '/complete-signup',
    element: <CompleteSignupPage />,
  },

  // Owner routes
  {
    path: '/owner',
    element: (
      <ProtectedRoute role="OWNER">
        <OwnerLayout />
      </ProtectedRoute>
    ),
    errorElement: <NotFoundPage />,
    children: [
      {
        index: true,
        element: <Navigate to="/owner/dashboard" replace />,
      },
      {
        path: 'dashboard',
        element: <OwnerDashboardPage />,
      },
      {
        path: 'onboarding',
        element: <OnboardingPage />,
      },
      {
        path: 'flyers',
        element: <FlyersDashboardPage />,
      },
      {
        path: 'flyers/create',
        element: <FlyerBuilderPage />,
      },
      {
        path: 'flyers/scheduled',
        element: <ScheduledFlyersPage />,
      },
      {
        path: 'flyers/published',
        element: <PublishedFlyersPage />,
      },
      {
        path: 'flyers/trends',
        element: <TrendFlyersPage />,
      },
      {
        path: 'coupons',
        element: <OwnerCouponsPage />,
      },
      {
        path: 'reviews',
        element: <OwnerReviewsPage />,
      },
      {
        path: 'rewards',
        element: <OwnerRewardsPage />,
      },
      {
        path: 'wallet',
        element: <OwnerWalletPage />,
      },
      {
        path: 'qr',
        element: <QRPage />,
      },
      {
        path: 'social',
        element: <SocialPage />,
      },
      {
        path: 'analytics',
        element: <AnalyticsPage />,
      },
      {
        path: 'profile',
        element: <BusinessProfilePage />,
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
    element: (
      <ProtectedRoute role="CUSTOMER">
        <CustomerLayout />
      </ProtectedRoute>
    ),
    errorElement: <NotFoundPage />,
    children: [
      {
        index: true,
        element: <Navigate to="/customer/home" replace />,
      },
      {
        path: 'home',
        element: <CustomerHomePage />,
      },
      {
        path: 'discover',
        element: <ShopDiscoveryPage />,
      },
      {
        path: 'scan',
        element: <ScanPage />,
      },
      {
        path: 'rewards',
        element: <CustomerRewardsPage />,
      },
      {
        path: 'wallet',
        element: <CustomerWalletPage />,
      },
      {
        path: 'history',
        element: <TransactionHistoryPage />,
      },
      {
        path: 'coupons',
        element: <CouponCodesPage />,
      },
      {
        path: 'following',
        element: <FollowingPage />,
      },
      {
        path: 'streak',
        element: <StreakPage />,
      },
      {
        path: 'profile',
        element: <CustomerProfilePage />,
      },
      {
        path: 'settings',
        element: <CustomerSettingsPage />,
      },
      {
        path: 'spin-wheel',
        element: <SpinWheelPage />,
      },
      {
        path: 'review-rating',
        element: <ReviewRatingPage />,
      },
      {
        path: 'shop/:shopId',
        element: <ShopEnvironmentPage />,
      },
    ],
  },

  // Public shop route (accessed via QR)
  {
    path: '/shop/:businessId',
    element: <ShopEnvironmentPage />,
    errorElement: <NotFoundPage />,
  },

  // Public legal page
  {
    path: '/privacy',
    element: <PrivacyPolicyPage />,
    errorElement: <NotFoundPage />,
  },

  // Catch-all 404
  {
    path: '*',
    element: <NotFoundPage />,
  },
]);
