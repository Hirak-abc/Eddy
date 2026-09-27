import { Link, Outlet } from 'react-router-dom';
import { APP_DESCRIPTION, ROUTES } from '../lib/constants';

export const AuthLayout = () => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 px-4 py-10">
      <Link to={ROUTES.HOME} className="mb-8 text-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 rounded-lg">
        <span className="text-3xl font-bold tracking-tight text-indigo-600">Eddy</span>
        <p className="mt-1 text-sm text-slate-500">{APP_DESCRIPTION}</p>
      </Link>
      <div className="w-full max-w-md">
        <Outlet />
      </div>
    </div>
  );
};
