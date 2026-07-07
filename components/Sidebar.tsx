'use client';

'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, Truck, Map, AlertTriangle, Navigation, Settings, LogOut } from 'lucide-react';
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

  return (
    <div className="w-64 bg-navy-900 text-white flex flex-col h-screen">
      {/* Header */}
      <div className="p-6 border-b border-navy-800">
        <h1 className="text-2xl font-bold text-electric-blue">CoreFleet</h1>
        <p className="text-xs text-gray-400 mt-1">Fleet Management</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-6">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-6 py-3 text-sm transition-colors ${
                isActive(item.href)
                  ? 'bg-electric-blue text-white border-r-4 border-electric-blue'
                  : 'text-gray-400 hover:text-white hover:bg-navy-800'
              }`}
            >
              <Icon size={20} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-6 border-t border-navy-800">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-4 py-2 text-sm text-gray-400 hover:text-white hover:bg-navy-800 rounded-lg transition-colors"
        >
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
}
