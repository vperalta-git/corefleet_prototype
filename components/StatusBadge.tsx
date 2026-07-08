'use client';

import { VehicleStatus, AlertSeverity, TripStatus } from '@/lib/types';

interface StatusBadgeProps {
  status: VehicleStatus | AlertSeverity | TripStatus;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const getColorClasses = () => {
    switch (status) {
      // Vehicle Status
      case 'active':
        return 'bg-emerald-100 text-emerald-800 ring-emerald-200';
      case 'idle':
        return 'bg-amber-100 text-amber-800 ring-amber-200';
      case 'maintenance':
        return 'bg-orange-100 text-orange-800 ring-orange-200';
      case 'offline':
        return 'bg-rose-100 text-rose-800 ring-rose-200';
      // Alert Severity
      case 'critical':
        return 'bg-rose-100 text-rose-800 ring-rose-200';
      case 'warning':
        return 'bg-amber-100 text-amber-800 ring-amber-200';
      case 'info':
        return 'bg-cyan-100 text-cyan-800 ring-cyan-200';
      // Trip Status
      case 'completed':
        return 'bg-emerald-100 text-emerald-800 ring-emerald-200';
      case 'in-progress':
        return 'bg-cyan-100 text-cyan-800 ring-cyan-200';
      case 'scheduled':
        return 'bg-violet-100 text-violet-800 ring-violet-200';
      default:
        return 'bg-slate-100 text-slate-800 ring-slate-200';
    }
  };

  return (
    <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-black uppercase tracking-[0.12em] ring-1 ${getColorClasses()}`}>
      {status.charAt(0).toUpperCase() + status.slice(1).replace('-', ' ')}
    </span>
  );
}
