'use client';

import { useEffect, useState } from 'react';
import { PageWrapper } from '@/components/PageWrapper';
import { StatusBadge } from '@/components/StatusBadge';
import { Trip, Vehicle } from '@/lib/types';
import { deleteTrip, getTrips, getVehicles, saveTrips } from '@/lib/storage';
import { MapPin, Plus, Trash2 } from 'lucide-react';

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
    const vehicle = vehicles.find((v) => v.id === formData.vehicleId);
    if (!vehicle) return;

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
        <div className="flex flex-col gap-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.22em] text-cyan-600">Routes</p>
            <h1 className="mt-2 text-4xl font-black tracking-tight text-slate-950">Trips</h1>
            <p className="mt-2 text-slate-500">Track vehicle routes, deliveries, distance, and fuel usage.</p>
          </div>
          <button
            onClick={handleAddClick}
            className="flex items-center justify-center gap-2 rounded-xl bg-slate-950 px-5 py-3 font-black text-white shadow-lg shadow-slate-950/20 transition hover:-translate-y-0.5 hover:bg-slate-800"
          >
            <Plus size={20} />
            Add Trip
          </button>
        </div>

        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-slate-200 bg-slate-50">
                <tr>
                  {['Vehicle', 'Driver', 'Route', 'Distance', 'Fuel Used', 'Status', 'Actions'].map((heading) => (
                    <th key={heading} className="px-6 py-4 text-left text-xs font-black uppercase tracking-[0.14em] text-slate-500">
                      {heading}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {trips.map((trip) => (
                  <tr key={trip.id} className="transition hover:bg-cyan-50/50">
                    <td className="px-6 py-4 text-sm font-black text-slate-950">{trip.vehicleName}</td>
                    <td className="px-6 py-4 text-sm text-slate-600">{trip.driver}</td>
                    <td className="px-6 py-4 text-sm text-slate-600">
                      <div className="flex min-w-64 items-center gap-1">
                        <MapPin size={16} className="text-cyan-500" />
                        {trip.startLocation} to {trip.endLocation}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm font-semibold text-slate-700">{formatDistance(trip.distance)} km</td>
                    <td className="px-6 py-4 text-sm text-slate-600">{formatFuel(trip.fuelUsed)} L</td>
                    <td className="px-6 py-4"><StatusBadge status={trip.status} /></td>
                    <td className="px-6 py-4 text-sm">
                      <button
                        onClick={() => handleDelete(trip.id)}
                        className="rounded-lg p-2 text-rose-600 transition hover:bg-rose-100 hover:text-rose-800"
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

        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl animate-in zoom-in-95 slide-in-from-bottom-4 duration-300">
              <h2 className="mb-4 text-xl font-black text-slate-950">Create New Trip</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="mb-1 block text-sm font-bold text-slate-700">Vehicle</label>
                  <select
                    value={formData.vehicleId}
                    onChange={(e) => setFormData({ ...formData, vehicleId: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 outline-none transition focus:border-cyan-400 focus:bg-white focus:ring-4 focus:ring-cyan-500/10"
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
                  <label className="mb-1 block text-sm font-bold text-slate-700">Start Location</label>
                  <input
                    type="text"
                    value={formData.startLocation}
                    onChange={(e) => setFormData({ ...formData, startLocation: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 outline-none transition focus:border-cyan-400 focus:bg-white focus:ring-4 focus:ring-cyan-500/10"
                    required
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-bold text-slate-700">End Location</label>
                  <input
                    type="text"
                    value={formData.endLocation}
                    onChange={(e) => setFormData({ ...formData, endLocation: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 outline-none transition focus:border-cyan-400 focus:bg-white focus:ring-4 focus:ring-cyan-500/10"
                    required
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-bold text-slate-700">Distance (km)</label>
                  <input
                    type="number"
                    value={formData.distance}
                    onChange={(e) => setFormData({ ...formData, distance: parseFloat(e.target.value) })}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 outline-none transition focus:border-cyan-400 focus:bg-white focus:ring-4 focus:ring-cyan-500/10"
                    step="0.1"
                    required
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-bold text-slate-700">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 outline-none transition focus:border-cyan-400 focus:bg-white focus:ring-4 focus:ring-cyan-500/10"
                  >
                    <option value="scheduled">Scheduled</option>
                    <option value="in-progress">In Progress</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
                <div className="flex justify-end gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="rounded-xl border border-slate-200 px-4 py-2 font-bold text-slate-700 transition hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="rounded-xl bg-slate-950 px-4 py-2 font-black text-white transition hover:bg-slate-800"
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
