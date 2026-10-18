import { useState } from 'react';
import { Settings, Bell, Shield, Palette, LogOut, Sun, Moon } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/Card';
import { useClerk } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { useTheme } from '@/context/ThemeContext';
import { clearAuthFlowState } from '@/lib/authRedirect';

export const SettingsPage = () => {
  const { signOut } = useClerk();
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState(true);
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  const handleSignOut = async () => {
    try {
      await signOut(() => {
        clearAuthFlowState();
        navigate('/');
      });
    } catch (error) {
      console.error('Sign out error:', error);
      navigate('/');
    }
  };

  const toggleNotifications = () => {
    setNotifications((on) => {
      if (!on) toast.success('Notifications turned on');
      return !on;
    });
  };

  const handleThemeToggle = () => {
    toggleTheme();
    toast.success(isDark ? 'Switched to light mode' : 'Switched to dark mode');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900">
          <Settings size={20} />
        </div>
        <div className="space-y-1">
          <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">Settings</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">Manage your preferences</p>
        </div>
      </div>

      <div className="grid gap-4">
        <Card className="transition-shadow hover:shadow-md">
          <CardContent className="flex items-center gap-4 p-5">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-100 text-blue-600">
              <Bell size={22} />
            </div>
            <div className="flex-1">
              <h3 className="font-extrabold text-slate-900 dark:text-white">Notifications</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Updates about new rewards and offers</p>
            </div>
            <button
              role="switch"
              aria-checked={notifications}
              aria-label="Toggle notifications"
              onClick={toggleNotifications}
              className={cn(
                'relative h-7 w-12 shrink-0 rounded-full transition-colors',
                notifications ? 'bg-emerald-500' : 'bg-slate-300'
              )}
            >
              <span
                className={cn(
                  'absolute top-1 h-5 w-5 rounded-full bg-white shadow transition-all dark:bg-white',
                  notifications ? 'left-6' : 'left-1'
                )}
              />
            </button>
          </CardContent>
        </Card>

        <Card className="transition-shadow hover:shadow-md">
          <CardContent className="flex items-center gap-4 p-5">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-100 text-rose-600">
              <Shield size={22} />
            </div>
            <div className="flex-1">
              <h3 className="font-extrabold text-slate-900 dark:text-white">Privacy</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Control what data is shared with shops</p>
            </div>
            <span className="rounded-md bg-emerald-100 px-2 py-1 text-xs font-extrabold text-emerald-700">Protected</span>
          </CardContent>
        </Card>

        <Card className="transition-shadow hover:shadow-md">
          <CardContent className="flex items-center gap-4 p-5">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-100 text-amber-600 dark:bg-amber-500/15 dark:text-amber-300">
              <Palette size={22} />
            </div>
            <div className="flex-1">
              <h3 className="font-extrabold text-slate-900 dark:text-white">Theme</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {isDark ? 'Dark mode' : 'Light mode (default)'} · applies across the app
              </p>
            </div>
            <button
              role="switch"
              aria-checked={isDark}
              aria-label="Toggle dark mode"
              onClick={handleThemeToggle}
              className={cn(
                'relative inline-flex h-7 w-12 shrink-0 items-center rounded-full px-1 transition-colors',
                isDark ? 'bg-slate-900 dark:bg-amber-500' : 'bg-slate-300'
              )}
            >
              <span
                className={cn(
                  'flex h-5 w-5 items-center justify-center rounded-full bg-white shadow transition-all dark:bg-white',
                  isDark ? 'translate-x-5 text-slate-900' : 'translate-x-0 text-slate-500'
                )}
              >
                {isDark ? <Moon size={12} /> : <Sun size={12} />}
              </span>
            </button>
          </CardContent>
        </Card>

        <Card className="border-red-200 bg-gradient-to-r from-red-50 to-white transition-shadow hover:shadow-md dark:border-red-900/40 dark:from-red-950/40 dark:to-slate-900">
          <CardContent className="flex items-center gap-4 p-5">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-100 text-red-600">
              <LogOut size={22} />
            </div>
            <div className="flex-1">
              <h3 className="font-extrabold text-slate-900 dark:text-white">Sign Out</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Log out from your account</p>
            </div>
            <button
              onClick={handleSignOut}
              className="bg-red-600 px-4 py-2 text-sm font-extrabold text-white rounded-xl shadow-lg shadow-red-200 transition-transform hover:scale-105 hover:bg-red-700"
            >
              Log Out
            </button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
