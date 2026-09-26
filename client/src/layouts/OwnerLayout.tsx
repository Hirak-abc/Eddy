import { Outlet } from 'react-router-dom';

export const OwnerLayout = () => {
  return (
    <div className="min-h-screen bg-white text-gray-900 border-2 border-red-500">
      <header className="border-b p-4 font-bold">Header (Owner Layout)</header>
      <div className="flex">
        <aside className="w-64 border-r p-4 h-screen bg-gray-50">Sidebar</aside>
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
