'use client';

import { useState, useEffect } from 'react';
import { PageWrapper } from '@/components/PageWrapper';
import { StatusBadge } from '@/components/StatusBadge';
import { Trip, Vehicle } from '@/lib/types';
import { getTrips, saveTrips, deleteTrip, getVehicles } from '@/lib/storage';
import { Plus, Trash2, Calendar, MapPin } from 'lucide-react';

export default function TripsPage() {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    vehicleId: '',
    startLocation: '',
    endLocation: '',
    distance: 0,
    status: 'scheduled' as const,
  });

  useEffect(() => {
    setTrips(getTrips());
    setVehicles(getVehicles());
  }, []);

  const handleAddClick = () => {
    setFormData({
      vehicleId: vehicles[0]?.id || '',
      startLocation: '',
      endLocation: '',
      distance: 0,
      status: 'scheduled',
    });
    setShowModal(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const vehicle = vehicles.find(v => v.id === formData.vehicleId);
    if (vehicle) {
      const newTrip: Trip = {
        id: Date.now().toString(),
        vehicleId: formData.vehicleId,
        vehicleName: vehicle.name,
        driver: vehicle.driver,
        startLocation: formData.startLocation,
        endLocation: formData.endLocation,
        startTime: new Date().toISOString(),
        endTime: new Date(Date.now() + 3600000).toISOString(),
        distance: formData.distance,
        status: formData.status,
        fuelUsed: formData.distance * 0.12,
      };
      const allTrips = getTrips();
      allTrips.push(newTrip);
      saveTrips(allTrips);
      setTrips(allTrips);
      setShowModal(false);
    }
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this trip?')) {
      deleteTrip(id);
      setTrips(getTrips());
    }
  };

  const formatDistance = (distance: number) => distance.toFixed(1);
  const formatFuel = (fuel: number) => fuel.toFixed(1);

  return (
    <PageWrapper>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Trips</h1>
            <p className="text-gray-600 mt-1">Track vehicle routes and deliveries</p>
          </div>
          <button
            onClick={handleAddClick}
            className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold transition-colors"
          >
            <Plus size={20} />
            Add Trip
          </button>
        </div>

        {/* Trips Table */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Vehicle</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Driver</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Route</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Distance</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Fuel Used</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Status</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {trips.map((trip) => (
                  <tr key={trip.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{trip.vehicleName}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{trip.driver}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <MapPin size={16} className="text-gray-400" />
                        {trip.startLocation} → {trip.endLocation}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{formatDistance(trip.distance)} km</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{formatFuel(trip.fuelUsed)} L</td>
                    <td className="px-6 py-4"><StatusBadge status={trip.status} /></td>
                    <td className="px-6 py-4 text-sm">
                      <button
                        onClick={() => handleDelete(trip.id)}
                        className="text-red-500 hover:text-red-700 p-1"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Create New Trip</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Vehicle</label>
                  <select
                    value={formData.vehicleId}
                    onChange={(e) => setFormData({ ...formData, vehicleId: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  >
                    <option value="">Select a vehicle</option>
                    {vehicles.map((v) => (
                      <option key={v.id} value={v.id}>
                        {v.name} ({v.plateNumber})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Start Location</label>
                  <input
                    type="text"
                    value={formData.startLocation}
                    onChange={(e) => setFormData({ ...formData, startLocation: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">End Location</label>
                  <input
                    type="text"
                    value={formData.endLocation}
                    onChange={(e) => setFormData({ ...formData, endLocation: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Distance (km)</label>
                  <input
                    type="number"
                    value={formData.distance}
                    onChange={(e) => setFormData({ ...formData, distance: parseFloat(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    step="0.1"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="scheduled">Scheduled</option>
                    <option value="in-progress">In Progress</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
                <div className="flex gap-3 justify-end pt-4">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                  >
                    Create Trip
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </PageWrapper>
  );
}
