'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getAuthState } from '@/lib/auth';
import { AppSidebar } from './app-sidebar';
import { Topbar } from './Topbar';
import { SidebarProvider } from './ui/sidebar';

interface PageWrapperProps {
  children: React.ReactNode;
}

export function PageWrapper({ children }: PageWrapperProps) {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    const auth = getAuthState();
    if (!auth.isAuthenticated) {
      setIsAuthenticated(false);
      router.push('/login');
      return;
    }

    setIsAuthenticated(true);
  }, [router]);

  if (isAuthenticated !== true) {
    return null;
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <Topbar />
        <main className="flex-1 overflow-y-auto overflow-x-hidden px-3 pb-20 pt-4 sm:px-5 sm:pt-5 lg:px-8 xl:pb-6">
          <div className="mx-auto w-full max-w-[1600px] animate-in fade-in slide-in-from-bottom-3 duration-500">
            {children}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
