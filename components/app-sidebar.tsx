'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  AlertTriangle,
  LayoutDashboard,
  LogOut,
  Map,
  Navigation,
  User,
  Settings,
  Truck,
  Users,
} from 'lucide-react';
import { logout } from '@/lib/auth';
import { useTheme } from '@/components/ThemeProvider';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  useSidebar,
} from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/vehicles', label: 'Vehicles', icon: Truck },
  { href: '/map', label: 'Live Map', icon: Map },
  { href: '/telemetry', label: 'Telemetry', icon: Navigation },
  { href: '/trips', label: 'Trips', icon: Navigation },
  { href: '/alerts', label: 'Alerts', icon: AlertTriangle },
  { href: '/users', label: 'Users', icon: Users },
  { href: '/profile', label: 'Profile', icon: User },
  { href: '/settings', label: 'Settings', icon: Settings },
];

export function AppSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { open, setOpen } = useSidebar();
  const { theme } = useTheme();
  const faviconSrc = theme === 'dark' ? '/logos/favicon_dark.png' : '/logos/favicon_light.png';

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const handleNavClick = () => {
    if (window.innerWidth < 1280) {
      setOpen(false);
    }
  };

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex min-w-0 items-center gap-3">
          <div
            className={cn(
              'grid size-12 shrink-0 place-items-center overflow-hidden rounded-2xl bg-sky-950 shadow-lg shadow-cyan-500/20 ring-1 ring-sky-400/20',
              open && 'xl:hidden',
            )}
          >
            <img src={faviconSrc} alt="Coretech" className="size-14 object-cover object-center" />
          </div>
          <div className={cn('min-w-0 transition-opacity', !open && 'xl:hidden')}>
            <div className="flex items-baseline gap-1">
              <span className="text-[1.35rem] font-black leading-none tracking-normal text-slate-950 dark:text-white">
                CORE
              </span>
              <span className="text-[1.35rem] font-black leading-none tracking-normal text-sky-500 dark:text-cyan-300">
                TECH
              </span>
            </div>
            <p className="mt-1 truncate text-[0.68rem] font-black uppercase tracking-[0.18em] text-sky-600 dark:text-sky-300">
              Fleet Command
            </p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                title={item.label}
                onClick={handleNavClick}
                className={cn(
                  'group relative flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition-all duration-200',
                  active
                    ? 'bg-slate-950 text-white shadow-lg shadow-slate-950/15'
                    : 'text-slate-600 hover:-translate-y-0.5 hover:bg-slate-100 hover:text-slate-950',
                  !open && 'xl:justify-center xl:px-0',
                )}
              >
                <Icon
                  size={19}
                  className={active ? 'shrink-0 text-cyan-300' : 'shrink-0 text-slate-400 group-hover:text-cyan-600'}
                />
                <span className={cn('truncate', !open && 'xl:hidden')}>{item.label}</span>
              </Link>
            );
          })}
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <button
          type="button"
          onClick={handleLogout}
          title="Logout"
          className={cn(
            'flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-slate-500 transition-all hover:bg-rose-50 hover:text-rose-600',
            !open && 'xl:justify-center xl:px-0',
          )}
        >
          <LogOut size={20} className="shrink-0" />
          <span className={cn(!open && 'xl:hidden')}>Logout</span>
        </button>
      </SidebarFooter>
    </Sidebar>
  );
}
