'use client';

import { useEffect, useState } from 'react';
import { PageWrapper } from '@/components/PageWrapper';
import { Vehicle } from '@/lib/types';
import { getVehicles } from '@/lib/storage';
import { Battery, Compass, Droplet, Gauge, MapPin, Power, Thermometer, Truck } from 'lucide-react';
import { Area, AreaChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

export default function TelemetryPage() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [selectedVehicleId, setSelectedVehicleId] = useState<string>('');

  useEffect(() => {
    const allVehicles = getVehicles();
    setVehicles(allVehicles);
    if (allVehicles.length > 0) {
      setSelectedVehicleId(allVehicles[0].id);
    }
  }, []);

  const selectedVehicle = vehicles.find((v) => v.id === selectedVehicleId);
  const telemetryData = selectedVehicle?.telemetryHistory ?? [];

  const metricCards = selectedVehicle
    ? [
        { label: 'Speed', value: selectedVehicle.speed, unit: 'km/h', icon: Gauge, color: 'text-cyan-500' },
        { label: 'Ignition', value: selectedVehicle.ignition === 'on' ? 'On' : 'Off', unit: selectedVehicle.engineStatus, icon: Power, color: 'text-slate-700' },
        { label: 'Fuel Load', value: selectedVehicle.fuelLoad, unit: `L / ${selectedVehicle.fuelCapacity} L`, icon: Droplet, color: 'text-emerald-500' },
        { label: 'Fuel Use', value: selectedVehicle.fuelConsumption, unit: 'L/100 km', icon: Truck, color: 'text-amber-500' },
        { label: 'Engine Temp', value: selectedVehicle.engineTemperature, unit: 'deg C', icon: Thermometer, color: 'text-orange-500' },
        { label: 'Battery', value: selectedVehicle.batteryVoltage, unit: 'V', icon: Battery, color: 'text-rose-500' },
        { label: 'Load', value: selectedVehicle.loadWeight.toLocaleString(), unit: 'kg', icon: Compass, color: 'text-violet-500' },
        { label: 'GPS', value: selectedVehicle.gpsSignal, unit: selectedVehicle.address, icon: MapPin, color: 'text-cyan-600' },
      ]
    : [];

  return (
    <PageWrapper>
      <div className="space-y-6">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-xs font-black uppercase tracking-[0.22em] text-cyan-600">Diagnostics</p>
          <h1 className="mt-2 text-4xl font-black tracking-tight text-slate-950">Telemetry</h1>
          <p className="mt-2 text-slate-500">Real-time vehicle performance and diagnostics.</p>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <label className="mb-2 block text-sm font-black uppercase tracking-[0.14em] text-slate-500">Select Vehicle</label>
          <select
            value={selectedVehicleId}
            onChange={(e) => setSelectedVehicleId(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 font-semibold text-slate-900 outline-none transition focus:border-cyan-400 focus:bg-white focus:ring-4 focus:ring-cyan-500/10 md:w-80"
          >
            {vehicles.map((v) => (
              <option key={v.id} value={v.id}>
                {v.name} ({v.plateNumber})
              </option>
            ))}
          </select>
        </div>

        {selectedVehicle && (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
            {metricCards.map((metric) => {
              const Icon = metric.icon;
              return (
                <div key={metric.label} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
                  <div className="flex items-center justify-between">
                    <div className="min-w-0">
                      <p className="text-xs font-black uppercase tracking-[0.14em] text-slate-500">{metric.label}</p>
                      <p className="mt-1 break-words text-3xl font-black text-slate-950">{metric.value}</p>
                      <p className="line-clamp-2 text-xs font-semibold text-slate-500">{metric.unit}</p>
                    </div>
                    <Icon size={32} className={`${metric.color} shrink-0`} />
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
            <h3 className="mb-4 text-lg font-black text-slate-950">Speed Over Time</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={telemetryData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="speed" stroke="#06b6d4" strokeWidth={3} dot={{ fill: '#06b6d4', r: 4 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
            <h3 className="mb-4 text-lg font-black text-slate-950">Cumulative Fuel Consumption</h3>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={telemetryData}>
                <defs>
                  <linearGradient id="colorFuel" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip />
                <Area type="monotone" dataKey="fuelConsumption" stroke="#f59e0b" fillOpacity={1} fill="url(#colorFuel)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
            <h3 className="mb-4 text-lg font-black text-slate-950">Engine Temperature</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={telemetryData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis domain={[50, 110]} />
                <Tooltip />
                <Line type="monotone" dataKey="engineTemperature" stroke="#ef4444" strokeWidth={3} dot={{ fill: '#ef4444', r: 4 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
            <h3 className="mb-4 text-lg font-black text-slate-950">Battery Voltage</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={telemetryData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis domain={[12, 15]} />
                <Tooltip />
                <Line type="monotone" dataKey="batteryVoltage" stroke="#10b981" strokeWidth={3} dot={{ fill: '#10b981', r: 4 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="mb-4 text-lg font-black text-slate-950">Vehicle Diagnostics</h3>
          <div className="grid grid-cols-2 gap-4 text-sm md:grid-cols-3 lg:grid-cols-6">
            {[
              ['Odometer', `${selectedVehicle?.odometer.toLocaleString() || 0} km`, 'text-slate-950'],
              ['Engine Status', selectedVehicle?.engineStatus || 'Unknown', selectedVehicle?.status === 'maintenance' || selectedVehicle?.status === 'offline' ? 'text-amber-600' : 'text-emerald-600'],
              ['Oil Pressure', `${selectedVehicle?.oilPressure || 0} bar`, 'text-slate-950'],
              ['Coolant Level', selectedVehicle?.coolantLevel || 'Unknown', selectedVehicle?.coolantLevel === 'Normal' ? 'text-emerald-600' : 'text-amber-600'],
              ['Tire Pressure', selectedVehicle ? `${selectedVehicle.tirePressure.frontLeft}/${selectedVehicle.tirePressure.frontRight}/${selectedVehicle.tirePressure.rearLeft}/${selectedVehicle.tirePressure.rearRight} PSI` : '0 PSI', 'text-slate-950'],
              ['Last Service', selectedVehicle?.lastService || 'Not recorded', 'text-slate-950'],
            ].map(([label, value, color]) => (
              <div key={label} className="rounded-2xl bg-slate-50 p-4">
                <p className="mb-1 text-slate-500">{label}</p>
                <p className={`font-black ${color}`}>{value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}
