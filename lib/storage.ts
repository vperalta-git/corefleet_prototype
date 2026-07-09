import { Vehicle, Trip, Alert, User } from './types';
import { mockVehicles, mockTrips, mockAlerts } from './mockData';

const VEHICLES_KEY = 'corefleet_vehicles';
const TRIPS_KEY = 'corefleet_trips';
const ALERTS_KEY = 'corefleet_alerts';
const USERS_KEY = 'corefleet_users';

const defaultUsers: User[] = [
  {
    id: 'admin-001',
    email: 'admin@corefleet.com',
    name: 'Admin User',
    role: 'admin',
    password: 'admin',
  },
];

function createDefaultTelemetry(vehicle: Vehicle): Vehicle['telemetryHistory'] {
  const times = ['00:00', '02:00', '04:00', '06:00', '08:00', '10:00', '12:00'];
  const finalSpeed = vehicle.speed ?? 0;
  const finalFuelConsumption = vehicle.fuelConsumption ?? 0;
  const finalEngineTemperature = vehicle.engineTemperature ?? 70;
  const finalBatteryVoltage = vehicle.batteryVoltage ?? 12.8;

  return times.map((time, index) => {
    const progress = index / (times.length - 1);

    return {
      time,
      speed: Math.round(finalSpeed * progress),
      fuelConsumption: Number((finalFuelConsumption * progress).toFixed(1)),
      engineTemperature: Math.round(60 + (finalEngineTemperature - 60) * progress),
      batteryVoltage: Number((12.6 + (finalBatteryVoltage - 12.6) * progress).toFixed(1)),
    };
  });
}

function hydrateVehicle(vehicle: Partial<Vehicle>): Vehicle {
  const mockVehicle = mockVehicles.find((item) => item.id === vehicle.id);
  const fuelCapacity = vehicle.fuelCapacity ?? mockVehicle?.fuelCapacity ?? 70;
  const fuelLevel = vehicle.fuelLevel ?? mockVehicle?.fuelLevel ?? 100;
  const hydrated: Vehicle = {
    id: vehicle.id ?? Date.now().toString(),
    plateNumber: vehicle.plateNumber ?? mockVehicle?.plateNumber ?? 'TMP-000',
    name: vehicle.name ?? mockVehicle?.name ?? 'New Vehicle',
    driver: vehicle.driver ?? mockVehicle?.driver ?? 'Unassigned',
    status: vehicle.status ?? mockVehicle?.status ?? 'active',
    ignition: vehicle.ignition ?? mockVehicle?.ignition ?? (vehicle.status === 'active' ? 'on' : 'off'),
    location: vehicle.location ?? mockVehicle?.location ?? { lat: 14.5995, lng: 120.9842 },
    heading: vehicle.heading ?? mockVehicle?.heading ?? 0,
    address: vehicle.address ?? mockVehicle?.address ?? 'Manila fleet yard',
    speed: vehicle.speed ?? mockVehicle?.speed ?? 0,
    odometer: vehicle.odometer ?? mockVehicle?.odometer ?? 0,
    fuelLevel,
    fuelLoad: vehicle.fuelLoad ?? mockVehicle?.fuelLoad ?? Number(((fuelCapacity * fuelLevel) / 100).toFixed(1)),
    fuelCapacity,
    fuelConsumption: vehicle.fuelConsumption ?? mockVehicle?.fuelConsumption ?? 0,
    engineTemperature: vehicle.engineTemperature ?? mockVehicle?.engineTemperature ?? 70,
    batteryVoltage: vehicle.batteryVoltage ?? mockVehicle?.batteryVoltage ?? 12.8,
    engineStatus: vehicle.engineStatus ?? mockVehicle?.engineStatus ?? 'Optimal',
    oilPressure: vehicle.oilPressure ?? mockVehicle?.oilPressure ?? 4.2,
    coolantLevel: vehicle.coolantLevel ?? mockVehicle?.coolantLevel ?? 'Normal',
    lastService: vehicle.lastService ?? mockVehicle?.lastService ?? 'Not recorded',
    gpsSignal: vehicle.gpsSignal ?? mockVehicle?.gpsSignal ?? 'Strong',
    loadWeight: vehicle.loadWeight ?? mockVehicle?.loadWeight ?? 0,
    tirePressure: vehicle.tirePressure ?? mockVehicle?.tirePressure ?? {
      frontLeft: 34,
      frontRight: 34,
      rearLeft: 35,
      rearRight: 35,
    },
    telemetryHistory: vehicle.telemetryHistory ?? mockVehicle?.telemetryHistory ?? [],
    lastUpdated: vehicle.lastUpdated ?? mockVehicle?.lastUpdated ?? new Date().toISOString(),
  };

  if (hydrated.telemetryHistory.length === 0) {
    hydrated.telemetryHistory = createDefaultTelemetry(hydrated);
  }

  return hydrated;
}

function mergeStoredVehicles(storedVehicles: Partial<Vehicle>[]): Vehicle[] {
  const hydratedStoredVehicles = storedVehicles.map(hydrateVehicle);
  const storedIds = new Set(hydratedStoredVehicles.map((vehicle) => vehicle.id));
  const missingMockVehicles = mockVehicles.filter((vehicle) => !storedIds.has(vehicle.id));

  return [...hydratedStoredVehicles, ...missingMockVehicles];
}

export function getVehicles(): Vehicle[] {
  if (typeof window === 'undefined') return mockVehicles;
  
  const stored = localStorage.getItem(VEHICLES_KEY);
  if (stored) {
    try {
      const vehicles = mergeStoredVehicles(JSON.parse(stored));
      localStorage.setItem(VEHICLES_KEY, JSON.stringify(vehicles));
      return vehicles;
    } catch {
      return mockVehicles;
    }
  }

  // Initialize with mock data
  localStorage.setItem(VEHICLES_KEY, JSON.stringify(mockVehicles));
  return mockVehicles;
}

export function saveVehicles(vehicles: Vehicle[]): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(VEHICLES_KEY, JSON.stringify(vehicles));
  }
}

export function getTrips(): Trip[] {
  if (typeof window === 'undefined') return mockTrips;
  
  const stored = localStorage.getItem(TRIPS_KEY);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      return mockTrips;
    }
  }

  localStorage.setItem(TRIPS_KEY, JSON.stringify(mockTrips));
  return mockTrips;
}

export function saveTrips(trips: Trip[]): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(TRIPS_KEY, JSON.stringify(trips));
  }
}

export function getAlerts(): Alert[] {
  if (typeof window === 'undefined') return mockAlerts;
  
  const stored = localStorage.getItem(ALERTS_KEY);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      return mockAlerts;
    }
  }

  localStorage.setItem(ALERTS_KEY, JSON.stringify(mockAlerts));
  return mockAlerts;
}

export function saveAlerts(alerts: Alert[]): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(ALERTS_KEY, JSON.stringify(alerts));
  }
}

export function getUsers(): User[] {
  if (typeof window === 'undefined') return defaultUsers;

  const stored = localStorage.getItem(USERS_KEY);
  if (stored) {
    try {
      const users: User[] = JSON.parse(stored);
      const hasAdmin = users.some((user) => user.email === defaultUsers[0].email);
      const mergedUsers = hasAdmin ? users : [...defaultUsers, ...users];
      localStorage.setItem(USERS_KEY, JSON.stringify(mergedUsers));
      return mergedUsers;
    } catch {
      return defaultUsers;
    }
  }

  localStorage.setItem(USERS_KEY, JSON.stringify(defaultUsers));
  return defaultUsers;
}

export function saveUsers(users: User[]): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  }
}

export function addVehicle(vehicle: Vehicle): void {
  const vehicles = getVehicles();
  vehicles.push(vehicle);
  saveVehicles(vehicles);
}

export function updateVehicle(id: string, updates: Partial<Vehicle>): void {
  const vehicles = getVehicles();
  const index = vehicles.findIndex(v => v.id === id);
  if (index !== -1) {
    vehicles[index] = { ...vehicles[index], ...updates };
    saveVehicles(vehicles);
  }
}

export function deleteVehicle(id: string): void {
  const vehicles = getVehicles();
  saveVehicles(vehicles.filter(v => v.id !== id));
}

export function addTrip(trip: Trip): void {
  const trips = getTrips();
  trips.push(trip);
  saveTrips(trips);
}

export function updateTrip(id: string, updates: Partial<Trip>): void {
  const trips = getTrips();
  const index = trips.findIndex(t => t.id === id);
  if (index !== -1) {
    trips[index] = { ...trips[index], ...updates };
    saveTrips(trips);
  }
}

export function deleteTrip(id: string): void {
  const trips = getTrips();
  saveTrips(trips.filter(t => t.id !== id));
}

export function addAlert(alert: Alert): void {
  const alerts = getAlerts();
  alerts.push(alert);
  saveAlerts(alerts);
}

export function updateAlert(id: string, updates: Partial<Alert>): void {
  const alerts = getAlerts();
  const index = alerts.findIndex(a => a.id === id);
  if (index !== -1) {
    alerts[index] = { ...alerts[index], ...updates };
    saveAlerts(alerts);
  }
}

export function deleteAlert(id: string): void {
  const alerts = getAlerts();
  saveAlerts(alerts.filter(a => a.id !== id));
}

export function addUser(user: User): void {
  const users = getUsers();
  users.push(user);
  saveUsers(users);
}

export function updateUser(id: string, updates: Partial<User>): void {
  const users = getUsers();
  const index = users.findIndex(user => user.id === id);
  if (index !== -1) {
    users[index] = { ...users[index], ...updates };
    saveUsers(users);
  }
}

export function deleteUser(id: string): void {
  const users = getUsers();
  saveUsers(users.filter(user => user.id !== id));
}
