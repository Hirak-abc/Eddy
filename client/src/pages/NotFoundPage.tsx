import { Link } from 'react-router-dom';
import { Compass } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export const NotFoundPage = () => (
  <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
    <div className="text-center space-y-6 max-w-md">
      <div className="w-16 h-16 mx-auto rounded-full bg-amber-100 flex items-center justify-center">
        <Compass size={28} className="text-amber-600" />
      </div>
      <div className="space-y-2">
        <h1 className="text-6xl font-black text-slate-900">404</h1>
        <p className="text-lg font-semibold text-slate-700">Page not found</p>
        <p className="text-sm text-slate-500">
          The page you are looking for does not exist or was moved.
        </p>
      </div>
      <Button
        asChild
        className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-semibold"
      >
        <Link to="/">Back to Home</Link>
      </Button>
    </div>
  </div>
);
