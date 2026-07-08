'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Bell, User } from 'lucide-react';
import { getAuthState } from '@/lib/auth';
import { getAlerts } from '@/lib/storage';
import { SidebarTrigger } from './ui/sidebar';
import { ThemeToggle } from './ThemeToggle';

const pageTitles: Record<string, string> = {
  '/dashboard': 'Fleet Dashboard',
  '/vehicles': 'Vehicles',
  '/map': 'Live Map',
  '/telemetry': 'Telemetry',
  '/trips': 'Trips',
  '/alerts': 'Alerts',
  '/users': 'Users',
  '/settings': 'Settings',
  '/profile': 'Admin Profile',
};

export function Topbar() {
  const router = useRouter();
  const pathname = usePathname();
  const auth = getAuthState();
  const user = auth.user;
  const [unresolvedAlerts, setUnresolvedAlerts] = useState(0);

  useEffect(() => {
    setUnresolvedAlerts(getAlerts().filter((alert) => !alert.resolved).length);
  }, [pathname]);

  const title = pageTitles[pathname] || 'Fleet Dashboard';

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/85 px-3 py-2.5 backdrop-blur-xl sm:px-6 sm:py-3 lg:px-8">
      <div className="flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3 sm:gap-4">
          <SidebarTrigger />
          <div className="min-w-0">
            <p className="hidden text-xs font-semibold uppercase tracking-[0.2em] text-cyan-600 sm:block">Operations</p>
            <h2 className="truncate text-lg font-black tracking-tight text-slate-950 sm:text-2xl">{title}</h2>
            <p className="mt-0.5 hidden text-sm text-slate-500 sm:block">Welcome back, {user?.name || 'User'}</p>
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          <ThemeToggle />
          <button
            type="button"
            onClick={() => router.push('/alerts')}
            className="relative grid size-10 place-items-center rounded-xl border border-slate-200 bg-white text-slate-600 transition hover:-translate-y-0.5 hover:border-cyan-200 hover:text-cyan-600 hover:shadow-md"
            title="View notifications"
          >
            <Bell size={18} />
            {unresolvedAlerts > 0 && (
              <span className="absolute -right-1 -top-1 grid min-w-5 place-items-center rounded-full bg-rose-500 px-1.5 text-[10px] font-black text-white">
                {unresolvedAlerts}
              </span>
            )}
          </button>
          <button
            type="button"
            onClick={() => router.push('/profile')}
            className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-2 shadow-sm transition hover:-translate-y-0.5 hover:border-cyan-200 hover:shadow-md sm:px-3"
            title="Open admin profile"
          >
            <div className="grid size-8 place-items-center rounded-lg bg-slate-950 text-white">
              <User size={16} />
            </div>
            <span className="hidden max-w-48 truncate text-sm font-semibold text-slate-700 sm:block">{user?.email}</span>
          </button>
        </div>
      </div>
    </header>
  );
}
