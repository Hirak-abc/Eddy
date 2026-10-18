import { useEffect } from 'react';
import { useAuth as useClerkAuth } from '@clerk/clerk-react';
import { RouterProvider } from 'react-router-dom';
import { router } from './routes';
import { setAuthTokenGetter } from './services/api';
import { ThemeProvider } from './context/ThemeContext';
import { Toaster } from 'sonner';

export default function App() {
  const { getToken } = useClerkAuth();

  useEffect(() => {
    setAuthTokenGetter(() => getToken());
    return () => setAuthTokenGetter(null);
  }, [getToken]);

  return (
    <ThemeProvider>
      <RouterProvider router={router} />
      <Toaster position="top-right" />
    </ThemeProvider>
  );
}
