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
        return 'bg-green-100 text-green-800';
      case 'idle':
        return 'bg-yellow-100 text-yellow-800';
      case 'maintenance':
        return 'bg-orange-100 text-orange-800';
      case 'offline':
        return 'bg-red-100 text-red-800';
      // Alert Severity
      case 'critical':
        return 'bg-red-100 text-red-800';
      case 'warning':
        return 'bg-orange-100 text-orange-800';
      case 'info':
        return 'bg-blue-100 text-blue-800';
      // Trip Status
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'in-progress':
        return 'bg-blue-100 text-blue-800';
      case 'scheduled':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getColorClasses()}`}>
      {status.charAt(0).toUpperCase() + status.slice(1).replace('-', ' ')}
    </span>
  );
}
