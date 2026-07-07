'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getAuthState } from '@/lib/auth';

export default function Page() {
  const router = useRouter();

  useEffect(() => {
    const auth = getAuthState();
    if (auth.isAuthenticated) {
      router.push('/dashboard');
    } else {
      router.push('/login');
    }
  }, [router]);

  return null;
}
