import { createBrowserRouter } from 'react-router-dom';
import { ROUTES } from '../lib/constants';
import { LandingPage } from '../pages/LandingPage';
import { SignInPage } from '../pages/auth/SignInPage';
import { SignUpPage } from '../pages/auth/SignUpPage';
import { OwnerLayout } from '../layouts/OwnerLayout';
import { DashboardPage } from '../pages/owner/DashboardPage';
import { CustomerLayout } from '../layouts/CustomerLayout';
import { HomePage } from '../pages/customer/HomePage';
import { ProtectedRoute } from './ProtectedRoute';

export const router = createBrowserRouter([
  // Public
  { path: ROUTES.HOME, element: <LandingPage /> },
  { path: ROUTES.SIGN_IN, element: <SignInPage /> },
  { path: ROUTES.SIGN_UP, element: <SignUpPage /> },

  // Protected Owner
  {
    path: '/owner',
    element: (
      <ProtectedRoute role="OWNER">
        <OwnerLayout />
      </ProtectedRoute>
    ),
    children: [{ path: 'dashboard', element: <DashboardPage /> }],
  },

  // Protected Customer
  {
    path: '/customer',
    element: (
      <ProtectedRoute role="CUSTOMER">
        <CustomerLayout />
      </ProtectedRoute>
    ),
    children: [{ path: 'home', element: <HomePage /> }],
  },

  // Public QR Shop Entry
  { path: ROUTES.SHOP, element: <HomePage /> },
]);
