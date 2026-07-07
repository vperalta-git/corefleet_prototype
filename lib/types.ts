// Vehicle Types
export type VehicleStatus = 'active' | 'idle' | 'maintenance' | 'offline';
export type AlertSeverity = 'critical' | 'warning' | 'info';
export type TripStatus = 'completed' | 'in-progress' | 'scheduled';

export interface Vehicle {
  id: string;
  plateNumber: string;
  name: string;
  driver: string;
  status: VehicleStatus;
  location: {
    lat: number;
    lng: number;
  };
  speed: number;
  odometer: number;
  fuelLevel: number;
  lastUpdated: string;
}

export interface Trip {
  id: string;
  vehicleId: string;
  vehicleName: string;
  driver: string;
  startLocation: string;
  endLocation: string;
  startTime: string;
  endTime: string;
  distance: number;
  status: TripStatus;
  fuelUsed: number;
}

export interface Alert {
  id: string;
  vehicleId: string;
  vehicleName: string;
  type: string;
  severity: AlertSeverity;
  message: string;
  timestamp: string;
  resolved: boolean;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'operator' | 'viewer';
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
}
