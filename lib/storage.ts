import { Vehicle, Trip, Alert } from './types';
import { mockVehicles, mockTrips, mockAlerts } from './mockData';

const VEHICLES_KEY = 'corefleet_vehicles';
const TRIPS_KEY = 'corefleet_trips';
const ALERTS_KEY = 'corefleet_alerts';

export function getVehicles(): Vehicle[] {
  if (typeof window === 'undefined') return mockVehicles;
  
  const stored = localStorage.getItem(VEHICLES_KEY);
  if (stored) {
    try {
      return JSON.parse(stored);
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
