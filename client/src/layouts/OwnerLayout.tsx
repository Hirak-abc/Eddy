import { Outlet } from 'react-router-dom';
import { Sidebar } from '../components/Sidebar';
import { useApplicationUser } from '../hooks/useApplicationUser';

export const OwnerLayout = () => {
  const { greetingName } = useApplicationUser();
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 bg-slate-50">
        <header className="bg-white border-b p-4 shadow-sm">
          <div className="flex justify-between items-center">
            <h1 className="text-xl font-semibold">Business Dashboard</h1>
            <div className="text-sm text-slate-500">Hello {greetingName}</div>
          </div>
        </header>
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
