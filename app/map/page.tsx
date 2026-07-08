'use client';

import { useState, useEffect } from 'react';
import { PageWrapper } from '@/components/PageWrapper';
import { StatusBadge } from '@/components/StatusBadge';
import { Vehicle } from '@/lib/types';
import { getVehicles } from '@/lib/storage';
import { MapPin } from 'lucide-react';

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
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-xs font-black uppercase tracking-[0.22em] text-cyan-600">Tracking</p>
          <h1 className="mt-2 text-4xl font-black tracking-tight text-slate-950">Live Map</h1>
          <p className="mt-2 text-slate-500">Real-time vehicle tracking and locations.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Map Panel */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm lg:col-span-3">
            <div className="relative w-full overflow-hidden rounded-3xl border border-slate-200 bg-slate-100" style={{ paddingBottom: '66%' }}>
              <svg
                viewBox="0 0 100 66"
                className="absolute inset-0 w-full h-full"
                style={{ backgroundColor: '#f8fafc' }}
              >
                {/* Grid */}
                <defs>
                  <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                    <path d="M 10 0 L 0 0 0 10" fill="none" stroke="#cbd5e1" strokeWidth="0.12" />
                  </pattern>
                </defs>
                <rect width="100" height="66" fill="url(#grid)" />

                {/* Map labels */}
                <text x="2" y="4" fontSize="1.5" fill="#0f172a" fontWeight="bold">
                  Manila Region
                </text>
                <text x="2" y="60" fontSize="0.8" fill="#64748b">
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
                        <circle cx={x} cy={y} r="2.5" fill="none" stroke="#06b6d4" strokeWidth="0.35" className="animate-pulse" />
                      )}
                    </g>
                  );
                })}
              </svg>

              {/* Overlay info */}
              <div className="absolute right-3 top-3 rounded-xl border border-slate-200 bg-white/90 px-3 py-2 text-xs font-bold text-slate-600 shadow-sm backdrop-blur">
                {vehicles.length} vehicles tracked
              </div>
            </div>

            <div className="mt-4 flex flex-wrap gap-4 text-sm font-semibold text-slate-600">
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
            <div className="sticky top-24 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="mb-4 text-lg font-black text-slate-950">Vehicle Details</h3>

              {selectedVehicle ? (
                <div className="space-y-4">
                  <div>
                    <p className="text-xs font-black uppercase tracking-[0.14em] text-slate-500">Plate Number</p>
                    <p className="font-black text-slate-950">{selectedVehicle.plateNumber}</p>
                  </div>

                  <div>
                    <p className="text-xs font-black uppercase tracking-[0.14em] text-slate-500">Vehicle Name</p>
                    <p className="font-black text-slate-950">{selectedVehicle.name}</p>
                  </div>

                  <div>
                    <p className="text-xs font-black uppercase tracking-[0.14em] text-slate-500">Driver</p>
                    <p className="font-black text-slate-950">{selectedVehicle.driver}</p>
                  </div>

                  <div>
                    <p className="mb-1 text-xs font-black uppercase tracking-[0.14em] text-slate-500">Status</p>
                    <StatusBadge status={selectedVehicle.status} />
                  </div>

                  <div className="border-t border-slate-100 pt-3">
                    <p className="text-xs font-black uppercase tracking-[0.14em] text-slate-500">Location</p>
                    <p className="font-mono text-sm text-slate-900">
                      {selectedVehicle.location.lat.toFixed(4)}, {selectedVehicle.location.lng.toFixed(4)}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs font-black uppercase tracking-[0.14em] text-slate-500">Speed</p>
                    <p className="text-sm font-black text-slate-950">{selectedVehicle.speed} km/h</p>
                  </div>

                  <div>
                    <p className="text-xs font-black uppercase tracking-[0.14em] text-slate-500">Fuel Level</p>
                    <div className="mt-1 h-2 overflow-hidden rounded-full bg-slate-100">
                      <div
                        className="h-full rounded-full bg-emerald-500"
                        style={{ width: `${selectedVehicle.fuelLevel}%` }}
                      ></div>
                    </div>
                    <p className="mt-1 text-xs font-bold text-slate-600">{selectedVehicle.fuelLevel}%</p>
                  </div>

                  <div>
                    <p className="text-xs font-black uppercase tracking-[0.14em] text-slate-500">Odometer</p>
                    <p className="text-sm font-black text-slate-950">
                      {selectedVehicle.odometer.toLocaleString()} km
                    </p>
                  </div>

                  <div className="pt-2 text-xs font-semibold text-slate-500">
                    Last updated: {new Date(selectedVehicle.lastUpdated).toLocaleTimeString()}
                  </div>
                </div>
              ) : (
                <p className="text-sm text-slate-500">Select a vehicle on the map to view details</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}
