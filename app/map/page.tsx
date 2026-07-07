'use client';

import { useState, useEffect } from 'react';
import { PageWrapper } from '@/components/PageWrapper';
import { StatusBadge } from '@/components/StatusBadge';
import { Vehicle } from '@/lib/types';
import { getVehicles } from '@/lib/storage';
import { MapPin, Navigation } from 'lucide-react';

export default function MapPage() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);

  useEffect(() => {
    setVehicles(getVehicles());
    if (getVehicles().length > 0) {
      setSelectedVehicle(getVehicles()[0]);
    }
  }, []);

  const mapBounds = {
    minLat: 14.55,
    maxLat: 14.65,
    minLng: 120.95,
    maxLng: 121.05,
  };

  const getMapPosition = (vehicle: Vehicle) => {
    const x = ((vehicle.location.lng - mapBounds.minLng) / (mapBounds.maxLng - mapBounds.minLng)) * 100;
    const y = ((mapBounds.maxLat - vehicle.location.lat) / (mapBounds.maxLat - mapBounds.minLat)) * 100;
    return { x, y };
  };

  return (
    <PageWrapper>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Live Map</h1>
          <p className="text-gray-600 mt-1">Real-time vehicle tracking and locations</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Map Panel */}
          <div className="lg:col-span-3 bg-white rounded-lg border border-gray-200 p-6">
            <div className="relative w-full bg-gray-100 rounded-lg overflow-hidden" style={{ paddingBottom: '66%' }}>
              <svg
                viewBox="0 0 100 66"
                className="absolute inset-0 w-full h-full"
                style={{ backgroundColor: '#f3f4f6' }}
              >
                {/* Grid */}
                <defs>
                  <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                    <path d="M 10 0 L 0 0 0 10" fill="none" stroke="#e5e7eb" strokeWidth="0.1" />
                  </pattern>
                </defs>
                <rect width="100" height="66" fill="url(#grid)" />

                {/* Map labels */}
                <text x="2" y="4" fontSize="1.5" fill="#6b7280" fontWeight="bold">
                  Manila Region
                </text>
                <text x="2" y="60" fontSize="0.8" fill="#9ca3af">
                  Lat: 14.55-14.65 | Lng: 120.95-121.05
                </text>

                {/* Vehicle markers */}
                {vehicles.map((vehicle) => {
                  const { x, y } = getMapPosition(vehicle);
                  const isSelected = selectedVehicle?.id === vehicle.id;

                  return (
                    <g key={vehicle.id} onClick={() => setSelectedVehicle(vehicle)} style={{ cursor: 'pointer' }}>
                      {/* Marker circle */}
                      <circle
                        cx={x}
                        cy={y}
                        r={isSelected ? 1.5 : 1}
                        fill={
                          vehicle.status === 'active'
                            ? '#22c55e'
                            : vehicle.status === 'idle'
                            ? '#eab308'
                            : vehicle.status === 'maintenance'
                            ? '#f97316'
                            : '#ef4444'
                        }
                        opacity={isSelected ? 1 : 0.7}
                        className="transition-all"
                      />
                      {/* Selection ring */}
                      {isSelected && (
                        <circle cx={x} cy={y} r="2.5" fill="none" stroke="#3b82f6" strokeWidth="0.2" />
                      )}
                    </g>
                  );
                })}
              </svg>

              {/* Overlay info */}
              <div className="absolute top-3 right-3 bg-white px-3 py-2 rounded shadow-sm text-xs text-gray-600">
                {vehicles.length} vehicles tracked
              </div>
            </div>

            {/* Legend */}
            <div className="mt-4 flex flex-wrap gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span>Active</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                <span>Idle</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-orange-500"></div>
                <span>Maintenance</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <span>Offline</span>
              </div>
            </div>
          </div>

          {/* Vehicle Details Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg border border-gray-200 p-6 sticky top-8">
              <h3 className="font-semibold text-gray-900 mb-4">Vehicle Details</h3>

              {selectedVehicle ? (
                <div className="space-y-4">
                  <div>
                    <p className="text-xs text-gray-500 uppercase">Plate Number</p>
                    <p className="font-semibold text-gray-900">{selectedVehicle.plateNumber}</p>
                  </div>

                  <div>
                    <p className="text-xs text-gray-500 uppercase">Vehicle Name</p>
                    <p className="font-semibold text-gray-900">{selectedVehicle.name}</p>
                  </div>

                  <div>
                    <p className="text-xs text-gray-500 uppercase">Driver</p>
                    <p className="font-semibold text-gray-900">{selectedVehicle.driver}</p>
                  </div>

                  <div>
                    <p className="text-xs text-gray-500 uppercase mb-1">Status</p>
                    <StatusBadge status={selectedVehicle.status} />
                  </div>

                  <div className="border-t pt-3">
                    <p className="text-xs text-gray-500 uppercase">Location</p>
                    <p className="text-sm text-gray-900 font-mono">
                      {selectedVehicle.location.lat.toFixed(4)}, {selectedVehicle.location.lng.toFixed(4)}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-gray-500 uppercase">Speed</p>
                    <p className="text-sm font-semibold text-gray-900">{selectedVehicle.speed} km/h</p>
                  </div>

                  <div>
                    <p className="text-xs text-gray-500 uppercase">Fuel Level</p>
                    <div className="mt-1 bg-gray-200 rounded-full h-2 overflow-hidden">
                      <div
                        className="h-full bg-green-500"
                        style={{ width: `${selectedVehicle.fuelLevel}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-gray-600 mt-1">{selectedVehicle.fuelLevel}%</p>
                  </div>

                  <div>
                    <p className="text-xs text-gray-500 uppercase">Odometer</p>
                    <p className="text-sm font-semibold text-gray-900">
                      {selectedVehicle.odometer.toLocaleString()} km
                    </p>
                  </div>

                  <div className="pt-2 text-xs text-gray-500">
                    Last updated: {new Date(selectedVehicle.lastUpdated).toLocaleTimeString()}
                  </div>
                </div>
              ) : (
                <p className="text-gray-500 text-sm">Select a vehicle on the map to view details</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}
