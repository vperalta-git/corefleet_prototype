'use client';

import { useEffect, useState } from 'react';
import { PageWrapper } from '@/components/PageWrapper';
import { StatusBadge } from '@/components/StatusBadge';
import { getAuthState } from '@/lib/auth';
import { getAlerts, getTrips, getVehicles } from '@/lib/storage';
import { Alert, Trip, User, Vehicle } from '@/lib/types';
import { Bell, CalendarClock, Mail, ShieldCheck, Truck, UserRound } from 'lucide-react';

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [trips, setTrips] = useState<Trip[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);

  useEffect(() => {
    setUser(getAuthState().user);
    setVehicles(getVehicles());
    setTrips(getTrips());
    setAlerts(getAlerts());
  }, []);

  const unresolvedAlerts = alerts.filter((alert) => !alert.resolved).length;
  const activeVehicles = vehicles.filter((vehicle) => vehicle.status === 'active').length;
  const completedTrips = trips.filter((trip) => trip.status === 'completed').length;

  return (
    <PageWrapper>
      <div className="space-y-6">
        <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <div className="bg-slate-950 p-6 text-white">
            <p className="text-xs font-black uppercase tracking-[0.22em] text-cyan-300">Administrator</p>
            <div className="mt-5 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
              <div className="flex items-center gap-4">
                <div className="grid size-20 place-items-center rounded-3xl bg-cyan-500 text-white shadow-lg shadow-cyan-500/30">
                  <UserRound size={36} />
                </div>
                <div>
                  <h1 className="text-4xl font-black tracking-tight">{user?.name || 'Admin User'}</h1>
                  <p className="mt-2 text-slate-300">{user?.email || 'admin@corefleet.com'}</p>
                </div>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/10 px-4 py-3 backdrop-blur">
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-cyan-200">Role</p>
                <p className="mt-1 text-2xl font-black capitalize">{user?.role || 'admin'}</p>
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-3">
          {[
            { label: 'Active Vehicles', value: activeVehicles, icon: Truck, tone: 'bg-cyan-50 text-cyan-700' },
            { label: 'Completed Trips', value: completedTrips, icon: CalendarClock, tone: 'bg-emerald-50 text-emerald-700' },
            { label: 'Unread Alerts', value: unresolvedAlerts, icon: Bell, tone: 'bg-rose-50 text-rose-700' },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.label} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-black uppercase tracking-[0.14em] text-slate-500">{item.label}</p>
                    <p className="mt-2 text-4xl font-black text-slate-950">{item.value}</p>
                  </div>
                  <div className={`grid size-12 place-items-center rounded-2xl ${item.tone}`}>
                    <Icon size={22} />
                  </div>
                </div>
              </div>
            );
          })}
        </section>

        <div className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="flex items-center gap-2 text-lg font-black text-slate-950">
              <ShieldCheck size={20} className="text-cyan-600" />
              Account Access
            </h2>
            <div className="mt-5 space-y-4">
              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="text-xs font-black uppercase tracking-[0.14em] text-slate-500">User ID</p>
                <p className="mt-1 font-mono text-sm font-bold text-slate-950">{user?.id || 'admin-001'}</p>
              </div>
              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="text-xs font-black uppercase tracking-[0.14em] text-slate-500">Email</p>
                <p className="mt-1 flex items-center gap-2 text-sm font-bold text-slate-950">
                  <Mail size={16} className="text-cyan-600" />
                  {user?.email || 'admin@corefleet.com'}
                </p>
              </div>
              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="text-xs font-black uppercase tracking-[0.14em] text-slate-500">Permissions</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {['Fleet Control', 'Alerts', 'Trips', 'Reports', 'Settings'].map((permission) => (
                    <span key={permission} className="rounded-full bg-cyan-100 px-3 py-1 text-xs font-black uppercase tracking-[0.1em] text-cyan-800">
                      {permission}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </section>

          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-black text-slate-950">Recent Admin Signals</h2>
            <div className="mt-5 space-y-3">
              {alerts.slice(0, 4).map((alert) => (
                <div key={alert.id} className="flex flex-col gap-3 rounded-2xl border border-slate-100 bg-slate-50 p-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="font-black text-slate-950">{alert.vehicleName}</p>
                    <p className="mt-1 text-sm text-slate-600">{alert.message}</p>
                  </div>
                  <StatusBadge status={alert.severity} />
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </PageWrapper>
  );
}
