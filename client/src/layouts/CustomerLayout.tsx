import { Outlet } from 'react-router-dom';
import { CustomerSidebar } from '../components/CustomerSidebar';

export const CustomerLayout = () => {
  return (
    <div className="flex min-h-screen">
      <CustomerSidebar />
      <div className="flex-1 bg-slate-50">
        <header className="bg-white border-b p-4 shadow-sm">
          <h1 className="text-xl font-semibold">Customer Portal</h1>
        </header>
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
