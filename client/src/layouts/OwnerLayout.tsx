import { Outlet } from 'react-router-dom';

export const OwnerLayout = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b">Header (Owner)</header>
      <div className="flex">
        <aside className="w-64 border-r">Sidebar</aside>
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
