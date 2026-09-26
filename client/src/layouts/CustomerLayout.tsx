import { Outlet } from 'react-router-dom';

export const CustomerLayout = () => {
  return (
    <div className="min-h-screen bg-white text-gray-900 border-2 border-blue-500 pb-16">
      <main className="p-4">
        <h1 className="text-xl font-bold">Customer Layout</h1>
        <Outlet />
      </main>
      <nav className="fixed bottom-0 w-full border-t bg-white p-4 h-16">
        Bottom Nav
      </nav>
    </div>
  );
};
