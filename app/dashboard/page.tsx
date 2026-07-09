'use client';

import { useState, useEffect } from 'react';
import { PageWrapper } from '@/components/PageWrapper';
import { StatCard } from '@/components/StatCard';
import { Vehicle, Alert } from '@/lib/types';
import { getVehicles, getAlerts } from '@/lib/storage';
import { Truck, AlertTriangle, TrendingUp, Fuel } from 'lucide-react';
import { PieChart, Pie, Cell, BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

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
      <div className="space-y-4 sm:space-y-5 xl:space-y-6">
        <div className="overflow-hidden rounded-2xl border border-sky-200 bg-white p-4 shadow-sm sm:rounded-3xl sm:p-5">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
            <div className="min-w-0">
              <p className="text-xs font-black uppercase tracking-[0.22em] text-cyan-600">Live Overview</p>
              <h1 className="mt-1 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">Dashboard</h1>
              <p className="mt-1 max-w-2xl text-sm text-slate-500 sm:text-base">Real-time fleet monitoring, vehicle health, and alert analytics in one workspace.</p>
            </div>
            <div className="grid w-full grid-cols-1 gap-2 min-[420px]:grid-cols-3 xl:max-w-[520px]">
              <div className="min-w-0 rounded-2xl bg-slate-950 px-3 py-2.5 text-white">
                <p className="text-xs text-slate-400">Mileage</p>
                <p className="truncate text-base font-black sm:text-lg">{totalMileage.toLocaleString()} km</p>
              </div>
              <div className="min-w-0 rounded-2xl bg-cyan-50 px-3 py-2.5">
                <p className="text-xs text-cyan-700">Fuel Avg</p>
                <p className="truncate text-base font-black text-slate-950 sm:text-lg">{averageFuelLevel}%</p>
              </div>
              <div className="min-w-0 rounded-2xl bg-rose-50 px-3 py-2.5">
                <p className="text-xs text-rose-700">Critical</p>
                <p className="truncate text-base font-black text-slate-950 sm:text-lg">{criticalAlerts}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4 xl:gap-4">
          <StatCard
            title="Total Vehicles"
            value={vehicles.length}
            subtitle="All registered vehicles"
            icon={<Truck size={24} />}
            bgColor="bg-cyan-50"
          />
          <StatCard
            title="Active Now"
            value={activeVehicles}
            subtitle={`${idleVehicles} idle, ${maintenanceVehicles} maintenance`}
            icon={<TrendingUp size={24} />}
            bgColor="bg-emerald-50"
          />
          <StatCard
            title="Alerts"
            value={criticalAlerts}
            subtitle={`${criticalAlerts} critical, ${alerts.filter(a => a.severity === 'warning').length} warnings`}
            icon={<AlertTriangle size={24} />}
            bgColor="bg-rose-50"
          />
          <StatCard
            title="Avg Fuel"
            value={`${averageFuelLevel}%`}
            subtitle="Fleet average"
            icon={<Fuel size={24} />}
            bgColor="bg-amber-50"
          />
        </div>

        <div className="grid grid-cols-1 gap-4 xl:grid-cols-2 xl:gap-5">
          <div className="min-w-0 overflow-hidden rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-xl sm:rounded-3xl sm:p-5">
            <h3 className="mb-3 text-lg font-black text-slate-950">Fleet Status</h3>
            <div className="h-[220px] sm:h-[240px] xl:h-[260px]">
            <ResponsiveContainer width="100%" height="100%">
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
            </div>
            <div className="mt-3 flex flex-wrap justify-center gap-x-4 gap-y-2">
              {fleetStatusData.map((item) => (
                <div key={item.name} className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                  <span className="text-xs font-semibold text-slate-600 sm:text-sm">{item.name}: {item.value}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="min-w-0 overflow-hidden rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-xl sm:rounded-3xl sm:p-5">
            <h3 className="mb-3 text-lg font-black text-slate-950">Daily Mileage</h3>
            <div className="h-[220px] sm:h-[240px] xl:h-[260px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dailyMileageData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="distance" fill="#06b6d4" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
            </div>
          </div>

          <div className="min-w-0 overflow-hidden rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-xl sm:rounded-3xl sm:p-5">
            <h3 className="mb-3 text-lg font-black text-slate-950">Speed Trend</h3>
            <div className="h-[220px] sm:h-[240px] xl:h-[260px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={speedTrendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="speed" stroke="#06b6d4" strokeWidth={3} dot={{ fill: '#06b6d4' }} />
              </LineChart>
            </ResponsiveContainer>
            </div>
          </div>

          <div className="min-w-0 overflow-hidden rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-xl sm:rounded-3xl sm:p-5">
            <h3 className="mb-3 text-lg font-black text-slate-950">Alerts by Type</h3>
            <div className="h-[220px] sm:h-[240px] xl:h-[260px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={alertsByTypeData} layout="vertical" margin={{ left: 16, right: 12 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="type" type="category" width={86} />
                <Tooltip />
                <Bar dataKey="count" fill="#0f172a" radius={[0, 8, 8, 0]} />
              </BarChart>
            </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:rounded-3xl sm:p-5">
          <h3 className="mb-3 text-lg font-black text-slate-950">Recent Alerts</h3>
          <div className="space-y-3">
            {alerts.slice(0, 5).map((alert) => (
              <div key={alert.id} className="flex flex-col gap-3 rounded-2xl border border-slate-100 bg-slate-50 p-4 transition hover:-translate-y-0.5 hover:bg-white hover:shadow-md sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0 flex-1">
                  <p className="font-black text-slate-950">{alert.vehicleName}</p>
                  <p className="text-sm text-slate-600">{alert.message}</p>
                </div>
                <div className="shrink-0 sm:text-right">
                  <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                    alert.severity === 'critical' ? 'bg-rose-100 text-rose-800' :
                    alert.severity === 'warning' ? 'bg-amber-100 text-amber-800' :
                    'bg-cyan-100 text-cyan-800'
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
