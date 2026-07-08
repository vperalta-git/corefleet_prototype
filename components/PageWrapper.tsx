'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getAuthState } from '@/lib/auth';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';

interface PageWrapperProps {
  children: React.ReactNode;
}

export function PageWrapper({ children }: PageWrapperProps) {
  const router = useRouter();

  useEffect(() => {
    const auth = getAuthState();
    if (!auth.isAuthenticated) {
      router.push('/login');
    }
  }, [router]);

  const auth = getAuthState();
  if (!auth.isAuthenticated) {
    return null;
  }

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-950">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <Topbar />
        <main className="flex-1 overflow-y-auto px-4 pb-24 pt-6 sm:px-6 lg:px-8 xl:pb-6">
          <div className="mx-auto w-full max-w-7xl animate-in fade-in slide-in-from-bottom-3 duration-500">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
