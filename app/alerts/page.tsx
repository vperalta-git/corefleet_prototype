'use client';

import { useState, useEffect } from 'react';
import { PageWrapper } from '@/components/PageWrapper';
import { StatusBadge } from '@/components/StatusBadge';
import { Alert as AlertType } from '@/lib/types';
import { getAlerts, updateAlert, deleteAlert } from '@/lib/storage';
import { Trash2, CheckCircle, AlertTriangle } from 'lucide-react';

export default function AlertsPage() {
  const [alerts, setAlerts] = useState<AlertType[]>([]);
  const [filter, setFilter] = useState<'all' | 'unresolved' | 'critical'>('unresolved');

  useEffect(() => {
    setAlerts(getAlerts());
  }, []);

  const filteredAlerts = alerts.filter((alert) => {
    if (filter === 'unresolved') return !alert.resolved;
    if (filter === 'critical') return alert.severity === 'critical' && !alert.resolved;
    return true;
  });

  const handleResolve = (id: string) => {
    updateAlert(id, { resolved: true });
    setAlerts(getAlerts());
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this alert?')) {
      deleteAlert(id);
      setAlerts(getAlerts());
    }
  };

  const stats = {
    total: alerts.length,
    unresolved: alerts.filter(a => !a.resolved).length,
    critical: alerts.filter(a => a.severity === 'critical' && !a.resolved).length,
  };

  return (
    <PageWrapper>
      <div className="space-y-6">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-xs font-black uppercase tracking-[0.22em] text-cyan-600">Signals</p>
          <h1 className="mt-2 text-4xl font-black tracking-tight text-slate-950">Alerts</h1>
          <p className="mt-2 text-slate-500">Fleet monitoring and alert management.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
            <p className="text-sm font-bold uppercase tracking-[0.14em] text-slate-500">Total Alerts</p>
            <p className="mt-2 text-4xl font-black text-slate-950">{stats.total}</p>
          </div>
          <div className="rounded-3xl border border-amber-100 bg-amber-50 p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
            <p className="text-sm font-bold uppercase tracking-[0.14em] text-amber-700">Unresolved</p>
            <p className="mt-2 text-4xl font-black text-slate-950">{stats.unresolved}</p>
          </div>
          <div className="rounded-3xl border border-rose-100 bg-rose-50 p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
            <p className="text-sm font-bold uppercase tracking-[0.14em] text-rose-700">Critical</p>
            <p className="mt-2 text-4xl font-black text-slate-950">{stats.critical}</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 rounded-2xl border border-slate-200 bg-white p-2 shadow-sm">
          <button
            onClick={() => setFilter('all')}
            className={`rounded-xl px-4 py-2 font-black transition-all ${
              filter === 'all'
                ? 'bg-slate-950 text-white shadow-lg shadow-slate-950/15'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-950'
            }`}
          >
            All Alerts
          </button>
          <button
            onClick={() => setFilter('unresolved')}
            className={`rounded-xl px-4 py-2 font-black transition-all ${
              filter === 'unresolved'
                ? 'bg-slate-950 text-white shadow-lg shadow-slate-950/15'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-950'
            }`}
          >
            Unresolved
          </button>
          <button
            onClick={() => setFilter('critical')}
            className={`rounded-xl px-4 py-2 font-black transition-all ${
              filter === 'critical'
                ? 'bg-rose-600 text-white shadow-lg shadow-rose-600/20'
                : 'text-slate-600 hover:bg-rose-50 hover:text-rose-700'
            }`}
          >
            Critical
          </button>
        </div>

        <div className="space-y-3">
          {filteredAlerts.length > 0 ? (
            filteredAlerts.map((alert) => (
              <div
                key={alert.id}
                className={`rounded-3xl border p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-xl ${
                  alert.severity === 'critical'
                    ? 'border-rose-100 bg-rose-50'
                    : alert.severity === 'warning'
                    ? 'border-amber-100 bg-amber-50'
                    : 'border-cyan-100 bg-cyan-50'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <AlertTriangle size={18} className={
                        alert.severity === 'critical' ? 'text-rose-600' :
                        alert.severity === 'warning' ? 'text-amber-600' :
                        'text-cyan-600'
                      } />
                      <h3 className="font-black text-slate-950">{alert.vehicleName}</h3>
                      <StatusBadge status={alert.severity} />
                      {alert.resolved && (
                        <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                          Resolved
                        </span>
                      )}
                    </div>
                    <p className="mb-2 text-sm font-medium text-slate-700">{alert.message}</p>
                    <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-slate-500">
                      <span>Type: {alert.type}</span>
                      <span>
                        {new Date(alert.timestamp).toLocaleDateString()}{' '}
                        {new Date(alert.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2 ml-4">
                    {!alert.resolved && (
                      <button
                        onClick={() => handleResolve(alert.id)}
                        className="rounded-xl p-2 text-emerald-600 transition hover:bg-emerald-100"
                        title="Mark as resolved"
                      >
                        <CheckCircle size={20} />
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(alert.id)}
                      className="rounded-xl p-2 text-rose-600 transition hover:bg-rose-100"
                      title="Delete alert"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm">
              <AlertTriangle size={48} className="mx-auto mb-3 text-slate-300" />
              <p className="text-slate-500">No alerts matching your filter</p>
            </div>
          )}
        </div>
      </div>
    </PageWrapper>
  );
}
