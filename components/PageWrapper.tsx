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
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Topbar />
        <main className="flex-1 overflow-y-auto p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
