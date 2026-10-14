import { Moon, Sun } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import { cn } from '@/lib/utils';

export const ThemeToggle = ({ className }: { className?: string }) => {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <button
      type="button"
      onClick={toggleTheme}
      title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      aria-pressed={isDark}
      className={cn(
        'inline-flex h-9 w-9 items-center justify-center rounded-full ring-1 transition-colors',
        'bg-white text-slate-600 ring-slate-200 hover:bg-slate-100 hover:text-slate-900',
        'dark:bg-slate-800 dark:text-amber-300 dark:ring-slate-700 dark:hover:bg-slate-700 dark:hover:text-amber-200',
        className
      )}
    >
      {isDark ? <Sun size={17} /> : <Moon size={17} />}
    </button>
  );
};

/** Fixed top-right theme button for pages without a header (landing, auth, privacy, 404, public shop). */
export const FloatingThemeToggle = ({ className }: { className?: string }) => (
  <ThemeToggle
    className={cn('fixed right-4 top-4 z-50 shadow-lg shadow-black/10', className)}
  />
);
