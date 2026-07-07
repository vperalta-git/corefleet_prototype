'use client';

import { useState, useEffect } from 'react';
import { PageWrapper } from '@/components/PageWrapper';
import { StatusBadge } from '@/components/StatusBadge';
import { Vehicle } from '@/lib/types';
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
    status: 'active' as const,
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
        speed: 0,
        odometer: 0,
        fuelLevel: 100,
        lastUpdated: new Date().toISOString(),
      };
      getVehicles().push(newVehicle);
      saveVehicles(getVehicles());
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
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Vehicles</h1>
            <p className="text-gray-600 mt-1">Manage your fleet vehicles</p>
          </div>
          <button
            onClick={handleAddClick}
            className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold transition-colors"
          >
            <Plus size={20} />
            Add Vehicle
          </button>
        </div>

        {/* Vehicles Table */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Plate Number</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Vehicle Name</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Driver</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Status</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Fuel Level</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Odometer</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {vehicles.map((vehicle) => (
                  <tr key={vehicle.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{vehicle.plateNumber}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{vehicle.name}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{vehicle.driver}</td>
                    <td className="px-6 py-4"><StatusBadge status={vehicle.status} /></td>
                    <td className="px-6 py-4 text-sm text-gray-600">{vehicle.fuelLevel}%</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{vehicle.odometer.toLocaleString()} km</td>
                    <td className="px-6 py-4 text-sm">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEditClick(vehicle)}
                          className="text-blue-500 hover:text-blue-700 p-1"
                        >
                          <Edit2 size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(vehicle.id)}
                          className="text-red-500 hover:text-red-700 p-1"
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
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                {editingId ? 'Edit Vehicle' : 'Add New Vehicle'}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Plate Number</label>
                  <input
                    type="text"
                    value={formData.plateNumber}
                    onChange={(e) => setFormData({ ...formData, plateNumber: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Vehicle Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Driver Name</label>
                  <input
                    type="text"
                    value={formData.driver}
                    onChange={(e) => setFormData({ ...formData, driver: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                    className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
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
