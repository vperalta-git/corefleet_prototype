'use client';

import { useState, useEffect } from 'react';
import { PageWrapper } from '@/components/PageWrapper';
import { StatCard } from '@/components/StatCard';
import { Vehicle, Alert } from '@/lib/types';
import { getVehicles, getAlerts } from '@/lib/storage';
import { Truck, AlertTriangle, TrendingUp, Fuel } from 'lucide-react';
import { PieChart, Pie, Cell, BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function DashboardPage() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);

  useEffect(() => {
    setVehicles(getVehicles());
    setAlerts(getAlerts());
  }, []);

  // Calculate stats
  const activeVehicles = vehicles.filter(v => v.status === 'active').length;
  const idleVehicles = vehicles.filter(v => v.status === 'idle').length;
  const maintenanceVehicles = vehicles.filter(v => v.status === 'maintenance').length;
  const offlineVehicles = vehicles.filter(v => v.status === 'offline').length;

  const criticalAlerts = alerts.filter(a => a.severity === 'critical' && !a.resolved).length;
  const totalMileage = vehicles.reduce((sum, v) => sum + v.odometer, 0);
  const averageFuelLevel = vehicles.length > 0 ? Math.round(vehicles.reduce((sum, v) => sum + v.fuelLevel, 0) / vehicles.length) : 0;

  // Chart data
  const fleetStatusData = [
    { name: 'Active', value: activeVehicles, color: '#22c55e' },
    { name: 'Idle', value: idleVehicles, color: '#eab308' },
    { name: 'Maintenance', value: maintenanceVehicles, color: '#f97316' },
    { name: 'Offline', value: offlineVehicles, color: '#ef4444' },
  ];

  const dailyMileageData = [
    { day: 'Mon', distance: 240 },
    { day: 'Tue', distance: 380 },
    { day: 'Wed', distance: 200 },
    { day: 'Thu', distance: 390 },
    { day: 'Fri', distance: 320 },
    { day: 'Sat', distance: 270 },
    { day: 'Sun', distance: 180 },
  ];

  const speedTrendData = [
    { time: '08:00', speed: 32 },
    { time: '10:00', speed: 45 },
    { time: '12:00', speed: 38 },
    { time: '14:00', speed: 52 },
    { time: '16:00', speed: 42 },
    { time: '18:00', speed: 35 },
  ];

  const alertsByTypeData = [
    { type: 'Maintenance', count: 2, color: '#f97316' },
    { type: 'Offline', count: 1, color: '#ef4444' },
    { type: 'Low Fuel', count: 1, color: '#eab308' },
  ];

  return (
    <PageWrapper>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">Real-time fleet monitoring and analytics</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Total Vehicles"
            value={vehicles.length}
            subtitle="All registered vehicles"
            icon={<Truck size={24} />}
            bgColor="bg-blue-50"
          />
          <StatCard
            title="Active Now"
            value={activeVehicles}
            subtitle={`${idleVehicles} idle, ${maintenanceVehicles} maintenance`}
            icon={<TrendingUp size={24} />}
            bgColor="bg-green-50"
          />
          <StatCard
            title="Alerts"
            value={criticalAlerts}
            subtitle={`${criticalAlerts} critical, ${alerts.filter(a => a.severity === 'warning').length} warnings`}
            icon={<AlertTriangle size={24} />}
            bgColor="bg-red-50"
          />
          <StatCard
            title="Avg Fuel"
            value={`${averageFuelLevel}%`}
            subtitle="Fleet average"
            icon={<Fuel size={24} />}
            bgColor="bg-yellow-50"
          />
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Fleet Status Chart */}
          <div className="bg-white rounded-lg p-6 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Fleet Status</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={fleetStatusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {fleetStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex justify-center gap-4 mt-4 flex-wrap">
              {fleetStatusData.map((item) => (
                <div key={item.name} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                  <span className="text-sm text-gray-600">{item.name}: {item.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Daily Mileage Chart */}
          <div className="bg-white rounded-lg p-6 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Daily Mileage</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={dailyMileageData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="distance" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Speed Trend Chart */}
          <div className="bg-white rounded-lg p-6 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Speed Trend</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={speedTrendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="speed" stroke="#3b82f6" strokeWidth={2} dot={{ fill: '#3b82f6' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Alerts by Type */}
          <div className="bg-white rounded-lg p-6 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Alerts by Type</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={alertsByTypeData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="type" type="category" />
                <Tooltip />
                <Bar dataKey="count" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Alerts */}
        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Alerts</h3>
          <div className="space-y-3">
            {alerts.slice(0, 5).map((alert) => (
              <div key={alert.id} className="flex items-start justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{alert.vehicleName}</p>
                  <p className="text-sm text-gray-600">{alert.message}</p>
                </div>
                <div className="text-right">
                  <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                    alert.severity === 'critical' ? 'bg-red-100 text-red-800' :
                    alert.severity === 'warning' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-blue-100 text-blue-800'
                  }`}>
                    {alert.severity.toUpperCase()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}
