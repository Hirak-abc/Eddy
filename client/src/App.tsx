import { ClerkProvider } from '@clerk/clerk-react';
import { RouterProvider } from 'react-router-dom';
import { router } from './routes';
import { Toaster } from 'sonner';
import { CLERK_PUBLISHABLE_KEY } from './lib/constants';

// Get the Clerk publishable key from environment
const PUBLISHABLE_KEY = CLERK_PUBLISHABLE_KEY;

export default function App() {
  return (
    <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
      <RouterProvider router={router} />
      <Toaster position="top-right" />
    </ClerkProvider>
  );
}
