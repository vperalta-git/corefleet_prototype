'use client';

import { useState, useEffect } from 'react';
import { PageWrapper } from '@/components/PageWrapper';
import { StatusBadge } from '@/components/StatusBadge';
import { Vehicle, VehicleStatus } from '@/lib/types';
import { getVehicles, saveVehicles, deleteVehicle, updateVehicle } from '@/lib/storage';
import { Plus, Trash2, Edit2 } from 'lucide-react';

export default function VehiclesPage() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    plateNumber: '',
    name: '',
    driver: '',
    status: 'active' as VehicleStatus,
  });

  useEffect(() => {
    setVehicles(getVehicles());
  }, []);

  const handleAddClick = () => {
    setEditingId(null);
    setFormData({ plateNumber: '', name: '', driver: '', status: 'active' });
    setShowModal(true);
  };

  const handleEditClick = (vehicle: Vehicle) => {
    setEditingId(vehicle.id);
    setFormData({
      plateNumber: vehicle.plateNumber,
      name: vehicle.name,
      driver: vehicle.driver,
      status: vehicle.status,
    });
    setShowModal(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      updateVehicle(editingId, formData);
    } else {
      const newVehicle: Vehicle = {
        id: Date.now().toString(),
        ...formData,
        location: { lat: 14.5995, lng: 120.9842 },
        heading: 0,
        speed: 0,
        odometer: 0,
        fuelLevel: 100,
        fuelLoad: 70,
        fuelCapacity: 70,
        fuelConsumption: 0,
        ignition: 'off',
        address: 'Manila fleet yard',
        engineTemperature: 70,
        batteryVoltage: 12.8,
        engineStatus: 'Ready',
        oilPressure: 0,
        coolantLevel: 'Normal',
        lastService: 'Not recorded',
        gpsSignal: 'Strong',
        loadWeight: 0,
        tirePressure: { frontLeft: 34, frontRight: 34, rearLeft: 35, rearRight: 35 },
        telemetryHistory: [
          { time: '00:00', speed: 0, fuelConsumption: 0, engineTemperature: 70, batteryVoltage: 12.8 },
          { time: '02:00', speed: 0, fuelConsumption: 0, engineTemperature: 70, batteryVoltage: 12.8 },
          { time: '04:00', speed: 0, fuelConsumption: 0, engineTemperature: 70, batteryVoltage: 12.8 },
          { time: '06:00', speed: 0, fuelConsumption: 0, engineTemperature: 70, batteryVoltage: 12.8 },
          { time: '08:00', speed: 0, fuelConsumption: 0, engineTemperature: 70, batteryVoltage: 12.8 },
          { time: '10:00', speed: 0, fuelConsumption: 0, engineTemperature: 70, batteryVoltage: 12.8 },
          { time: '12:00', speed: 0, fuelConsumption: 0, engineTemperature: 70, batteryVoltage: 12.8 },
        ],
        lastUpdated: new Date().toISOString(),
      };
      saveVehicles([...getVehicles(), newVehicle]);
    }
    setVehicles(getVehicles());
    setShowModal(false);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this vehicle?')) {
      deleteVehicle(id);
      setVehicles(getVehicles());
    }
  };

  return (
    <PageWrapper>
      <div className="space-y-6">
        <div className="flex flex-col gap-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.22em] text-cyan-600">Fleet Assets</p>
            <h1 className="mt-2 text-4xl font-black tracking-tight text-slate-950">Vehicles</h1>
            <p className="mt-2 text-slate-500">Manage your fleet vehicles, drivers, and operating status.</p>
          </div>
          <button
            onClick={handleAddClick}
            className="flex items-center justify-center gap-2 rounded-xl bg-slate-950 px-5 py-3 font-black text-white shadow-lg shadow-slate-950/20 transition hover:-translate-y-0.5 hover:bg-slate-800"
          >
            <Plus size={20} />
            Add Vehicle
          </button>
        </div>

        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-slate-200 bg-slate-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-black uppercase tracking-[0.14em] text-slate-500">Plate Number</th>
                  <th className="px-6 py-4 text-left text-xs font-black uppercase tracking-[0.14em] text-slate-500">Vehicle Name</th>
                  <th className="px-6 py-4 text-left text-xs font-black uppercase tracking-[0.14em] text-slate-500">Driver</th>
                  <th className="px-6 py-4 text-left text-xs font-black uppercase tracking-[0.14em] text-slate-500">Status</th>
                  <th className="px-6 py-4 text-left text-xs font-black uppercase tracking-[0.14em] text-slate-500">Fuel Level</th>
                  <th className="px-6 py-4 text-left text-xs font-black uppercase tracking-[0.14em] text-slate-500">Odometer</th>
                  <th className="px-6 py-4 text-left text-xs font-black uppercase tracking-[0.14em] text-slate-500">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {vehicles.map((vehicle) => (
                  <tr key={vehicle.id} className="transition hover:bg-cyan-50/50">
                    <td className="px-6 py-4 text-sm font-black text-slate-950">{vehicle.plateNumber}</td>
                    <td className="px-6 py-4 text-sm font-semibold text-slate-700">{vehicle.name}</td>
                    <td className="px-6 py-4 text-sm text-slate-600">{vehicle.driver}</td>
                    <td className="px-6 py-4"><StatusBadge status={vehicle.status} /></td>
                    <td className="px-6 py-4 text-sm text-slate-600">
                      <div className="min-w-28">
                        <div className="h-2 rounded-full bg-slate-100">
                          <div className="h-2 rounded-full bg-emerald-500" style={{ width: `${vehicle.fuelLevel}%` }} />
                        </div>
                        <span className="mt-1 block text-xs font-bold">{vehicle.fuelLevel}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">{vehicle.odometer.toLocaleString()} km</td>
                    <td className="px-6 py-4 text-sm">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEditClick(vehicle)}
                          className="rounded-lg p-2 text-cyan-600 transition hover:bg-cyan-100 hover:text-cyan-800"
                        >
                          <Edit2 size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(vehicle.id)}
                          className="rounded-lg p-2 text-rose-600 transition hover:bg-rose-100 hover:text-rose-800"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl animate-in zoom-in-95 slide-in-from-bottom-4 duration-300">
              <h2 className="mb-4 text-xl font-black text-slate-950">
                {editingId ? 'Edit Vehicle' : 'Add New Vehicle'}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="mb-1 block text-sm font-bold text-slate-700">Plate Number</label>
                  <input
                    type="text"
                    value={formData.plateNumber}
                    onChange={(e) => setFormData({ ...formData, plateNumber: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 outline-none transition focus:border-cyan-400 focus:bg-white focus:ring-4 focus:ring-cyan-500/10"
                    required
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-bold text-slate-700">Vehicle Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 outline-none transition focus:border-cyan-400 focus:bg-white focus:ring-4 focus:ring-cyan-500/10"
                    required
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-bold text-slate-700">Driver Name</label>
                  <input
                    type="text"
                    value={formData.driver}
                    onChange={(e) => setFormData({ ...formData, driver: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 outline-none transition focus:border-cyan-400 focus:bg-white focus:ring-4 focus:ring-cyan-500/10"
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
                    <option value="active">Active</option>
                    <option value="idle">Idle</option>
                    <option value="maintenance">Maintenance</option>
                    <option value="offline">Offline</option>
                  </select>
                </div>
                <div className="flex gap-3 justify-end pt-4">
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
                    {editingId ? 'Update' : 'Add'} Vehicle
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
