'use client';

import { Moon, Sun } from 'lucide-react';
import { useTheme } from './ThemeProvider';

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';
  const Icon = isDark ? Sun : Moon;

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="grid size-10 place-items-center rounded-xl border border-sky-200 bg-white text-blue-700 shadow-sm transition hover:-translate-y-0.5 hover:border-blue-300 hover:bg-sky-50 hover:shadow-md dark:border-sky-800 dark:bg-slate-900 dark:text-sky-200 dark:hover:bg-slate-800"
      title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      <Icon size={18} />
    </button>
  );
}
