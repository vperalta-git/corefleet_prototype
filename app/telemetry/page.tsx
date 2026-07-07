'use client';

import { useState, useEffect } from 'react';
import { PageWrapper } from '@/components/PageWrapper';
import { Vehicle } from '@/lib/types';
import { getVehicles } from '@/lib/storage';
import { Gauge, Zap, Droplet, Compass } from 'lucide-react';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

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

  const selectedVehicle = vehicles.find(v => v.id === selectedVehicleId);

  // Mock telemetry data
  const speedData = [
    { time: '00:00', speed: 0 },
    { time: '02:00', speed: 25 },
    { time: '04:00', speed: 45 },
    { time: '06:00', speed: 38 },
    { time: '08:00', speed: 52 },
    { time: '10:00', speed: 48 },
    { time: '12:00', speed: 35 },
  ];

  const fuelConsumptionData = [
    { time: '00:00', consumption: 0 },
    { time: '02:00', consumption: 2.5 },
    { time: '04:00', consumption: 5.8 },
    { time: '06:00', consumption: 8.2 },
    { time: '08:00', consumption: 11.5 },
    { time: '10:00', consumption: 14.2 },
    { time: '12:00', consumption: 16.8 },
  ];

  const engineTempData = [
    { time: '00:00', temp: 65 },
    { time: '02:00', temp: 72 },
    { time: '04:00', temp: 85 },
    { time: '06:00', temp: 92 },
    { time: '08:00', temp: 95 },
    { time: '10:00', temp: 88 },
    { time: '12:00', temp: 78 },
  ];

  const batteryVoltageData = [
    { time: '00:00', voltage: 13.2 },
    { time: '02:00', voltage: 13.5 },
    { time: '04:00', voltage: 13.8 },
    { time: '06:00', voltage: 14.0 },
    { time: '08:00', voltage: 14.2 },
    { time: '10:00', voltage: 13.9 },
    { time: '12:00', voltage: 13.5 },
  ];

  return (
    <PageWrapper>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Telemetry</h1>
          <p className="text-gray-600 mt-1">Real-time vehicle performance and diagnostics</p>
        </div>

        {/* Vehicle Selector */}
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Select Vehicle</label>
          <select
            value={selectedVehicleId}
            onChange={(e) => setSelectedVehicleId(e.target.value)}
            className="w-full md:w-64 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {vehicles.map((v) => (
              <option key={v.id} value={v.id}>
                {v.name} ({v.plateNumber})
              </option>
            ))}
          </select>
        </div>

        {/* Current Metrics */}
        {selectedVehicle && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-500 uppercase">Speed</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{selectedVehicle.speed}</p>
                  <p className="text-xs text-gray-600">km/h</p>
                </div>
                <Gauge size={32} className="text-blue-500" />
              </div>
            </div>

            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-500 uppercase">Engine Temp</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">92</p>
                  <p className="text-xs text-gray-600">°C</p>
                </div>
                <Zap size={32} className="text-orange-500" />
              </div>
            </div>

            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-500 uppercase">Fuel Level</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{selectedVehicle.fuelLevel}</p>
                  <p className="text-xs text-gray-600">%</p>
                </div>
                <Droplet size={32} className="text-green-500" />
              </div>
            </div>

            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-500 uppercase">Battery</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">14.2</p>
                  <p className="text-xs text-gray-600">V</p>
                </div>
                <Compass size={32} className="text-red-500" />
              </div>
            </div>
          </div>
        )}

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Speed Chart */}
          <div className="bg-white rounded-lg p-6 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Speed Over Time</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={speedData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="speed"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  dot={{ fill: '#3b82f6', r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Fuel Consumption Chart */}
          <div className="bg-white rounded-lg p-6 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Cumulative Fuel Consumption</h3>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={fuelConsumptionData}>
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
                <Area
                  type="monotone"
                  dataKey="consumption"
                  stroke="#f59e0b"
                  fillOpacity={1}
                  fill="url(#colorFuel)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Engine Temperature Chart */}
          <div className="bg-white rounded-lg p-6 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Engine Temperature</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={engineTempData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis domain={[50, 110]} />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="temp"
                  stroke="#ef4444"
                  strokeWidth={2}
                  dot={{ fill: '#ef4444', r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Battery Voltage Chart */}
          <div className="bg-white rounded-lg p-6 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Battery Voltage</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={batteryVoltageData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis domain={[12, 15]} />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="voltage"
                  stroke="#10b981"
                  strokeWidth={2}
                  dot={{ fill: '#10b981', r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Diagnostics Info */}
        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Vehicle Diagnostics</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 text-sm">
            <div>
              <p className="text-gray-500 mb-1">Odometer</p>
              <p className="font-semibold text-gray-900">{selectedVehicle?.odometer.toLocaleString() || 0} km</p>
            </div>
            <div>
              <p className="text-gray-500 mb-1">Engine Status</p>
              <p className="font-semibold text-green-600">Optimal</p>
            </div>
            <div>
              <p className="text-gray-500 mb-1">Emissions</p>
              <p className="font-semibold text-green-600">Normal</p>
            </div>
            <div>
              <p className="text-gray-500 mb-1">Oil Pressure</p>
              <p className="font-semibold text-gray-900">4.2 bar</p>
            </div>
            <div>
              <p className="text-gray-500 mb-1">Coolant Level</p>
              <p className="font-semibold text-green-600">Normal</p>
            </div>
            <div>
              <p className="text-gray-500 mb-1">Last Service</p>
              <p className="font-semibold text-gray-900">45 days ago</p>
            </div>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}
