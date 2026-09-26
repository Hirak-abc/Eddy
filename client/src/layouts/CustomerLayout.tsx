import { Outlet } from 'react-router-dom';

export const CustomerLayout = () => {
  return (
    <div className="min-h-screen bg-background text-foreground pb-16">
      <main className="p-4">
        <Outlet />
      </main>
      <nav className="fixed bottom-0 w-full border-t bg-card h-16">
        Bottom Nav
      </nav>
    </div>
  );
};
