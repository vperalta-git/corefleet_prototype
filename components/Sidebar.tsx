'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, Truck, Map, AlertTriangle, Navigation, Settings, LogOut, RadioTower } from 'lucide-react';
import { logout } from '@/lib/auth';

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const isActive = (path: string) => pathname === path;

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const navItems = [
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/vehicles', label: 'Vehicles', icon: Truck },
    { href: '/map', label: 'Live Map', icon: Map },
    { href: '/telemetry', label: 'Telemetry', icon: Navigation },
    { href: '/trips', label: 'Trips', icon: Navigation },
    { href: '/alerts', label: 'Alerts', icon: AlertTriangle },
    { href: '/settings', label: 'Settings', icon: Settings },
  ];

  const navList = (
    <>
      {navItems.map((item) => {
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`group relative flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition-all duration-200 ${
              isActive(item.href)
                ? 'bg-slate-950 text-white shadow-lg shadow-slate-950/15'
                : 'text-slate-600 hover:-translate-y-0.5 hover:bg-slate-100 hover:text-slate-950'
            }`}
          >
            <Icon size={19} className={isActive(item.href) ? 'text-cyan-300' : 'text-slate-400 group-hover:text-cyan-600'} />
            <span>{item.label}</span>
          </Link>
        );
      })}
    </>
  );

  return (
    <>
    <aside className="hidden h-screen w-72 shrink-0 border-r border-slate-200 bg-white/90 text-slate-950 shadow-sm backdrop-blur xl:flex xl:flex-col">
      <div className="border-b border-slate-200 p-6">
        <div className="flex items-center gap-3">
          <div className="grid size-11 place-items-center rounded-xl bg-cyan-500 text-white shadow-lg shadow-cyan-500/25">
            <RadioTower size={22} />
          </div>
          <div>
            <h1 className="text-xl font-black tracking-tight text-slate-950">CoreFleet</h1>
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-500">Command Center</p>
          </div>
        </div>
        <div className="mt-6 rounded-xl border border-cyan-100 bg-cyan-50 p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-700">Live Network</p>
          <div className="mt-3 flex items-end justify-between">
            <span className="text-2xl font-black text-slate-950">98.7%</span>
            <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-bold text-emerald-700">Online</span>
          </div>
        </div>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto p-4">{navList}</nav>

      <div className="border-t border-slate-200 p-4">
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-slate-500 transition-all hover:bg-rose-50 hover:text-rose-600"
        >
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
    <nav className="fixed inset-x-3 bottom-3 z-40 grid grid-cols-7 gap-1 rounded-2xl border border-slate-200 bg-white/95 p-2 shadow-2xl shadow-slate-950/15 backdrop-blur xl:hidden">
      {navItems.map((item) => {
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-label={item.label}
            className={`grid h-11 place-items-center rounded-xl transition-all ${
              isActive(item.href) ? 'bg-slate-950 text-cyan-300' : 'text-slate-500 hover:bg-slate-100 hover:text-slate-950'
            }`}
          >
            <Icon size={18} />
          </Link>
        );
      })}
    </nav>
    </>
  );
}
