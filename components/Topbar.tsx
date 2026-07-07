'use client';

import { User } from 'lucide-react';
import { getAuthState } from '@/lib/auth';

export function Topbar() {
  const auth = getAuthState();
  const user = auth.user;

  return (
    <div className="bg-white border-b border-gray-200 px-8 py-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Fleet Dashboard</h2>
          <p className="text-sm text-gray-500 mt-1">Welcome back, {user?.name || 'User'}</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-gray-600">
            <User size={20} />
            <span className="text-sm font-medium">{user?.email}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
