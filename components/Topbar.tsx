'use client';

import { Bell, Search, User } from 'lucide-react';
import { getAuthState } from '@/lib/auth';

export function Topbar() {
  const auth = getAuthState();
  const user = auth.user;

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/85 px-4 py-3 backdrop-blur-xl sm:px-6 lg:px-8">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-600">Operations</p>
          <h2 className="text-xl font-black tracking-tight text-slate-950 sm:text-2xl">Fleet Dashboard</h2>
          <p className="mt-1 text-sm text-slate-500">Welcome back, {user?.name || 'User'}</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="hidden min-w-64 items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-slate-500 md:flex">
            <Search size={17} />
            <span className="text-sm">Search vehicles, trips, alerts</span>
          </div>
          <button className="relative grid size-10 place-items-center rounded-xl border border-slate-200 bg-white text-slate-600 transition hover:-translate-y-0.5 hover:border-cyan-200 hover:text-cyan-600 hover:shadow-md">
            <Bell size={18} />
            <span className="absolute right-2 top-2 size-2 rounded-full bg-rose-500" />
          </button>
          <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-3 py-2 shadow-sm">
            <div className="grid size-8 place-items-center rounded-lg bg-slate-950 text-white">
              <User size={16} />
            </div>
            <span className="hidden max-w-48 truncate text-sm font-semibold text-slate-700 sm:block">{user?.email}</span>
          </div>
        </div>
      </div>
    </header>
  );
}
