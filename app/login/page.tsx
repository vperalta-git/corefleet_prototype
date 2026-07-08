'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { login } from '@/lib/auth';
import { ArrowRight, RadioTower, ShieldCheck, Truck } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('admin@corefleet.com');
  const [password, setPassword] = useState('admin');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    const success = login(email, password);
    if (success) {
      router.push('/dashboard');
    } else {
      setError('Invalid email or password');
    }

    setIsLoading(false);
  };

  return (
    <div className="min-h-screen overflow-hidden bg-slate-950 text-white">
      <div className="grid min-h-screen lg:grid-cols-[1.1fr_0.9fr]">
        <section className="relative hidden items-center justify-center overflow-hidden p-10 lg:flex">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_20%,rgba(34,211,238,0.24),transparent_28%),radial-gradient(circle_at_80%_70%,rgba(16,185,129,0.18),transparent_30%)]" />
          <div className="relative w-full max-w-2xl animate-in fade-in slide-in-from-left-6 duration-700">
            <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm font-semibold text-cyan-100">
              <ShieldCheck size={16} />
              Fleet operations, dispatch, telemetry
            </div>
            <h1 className="text-6xl font-black tracking-tight">CoreFleet</h1>
            <p className="mt-5 max-w-xl text-lg leading-8 text-slate-300">
              A sharper command center for live vehicles, driver activity, trips, alerts, and diagnostics.
            </p>
            <div className="mt-10 grid grid-cols-3 gap-4">
              {[
                ['98.7%', 'Network uptime'],
                ['8', 'Tracked units'],
                ['24/7', 'Monitoring'],
              ].map(([value, label]) => (
                <div key={label} className="rounded-2xl border border-white/10 bg-white/10 p-5 backdrop-blur">
                  <p className="text-3xl font-black text-white">{value}</p>
                  <p className="mt-1 text-sm text-slate-300">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="flex items-center justify-center bg-slate-50 p-4 text-slate-950 sm:p-8">
          <div className="w-full max-w-md animate-in fade-in zoom-in-95 duration-500">
            <div className="mb-8 text-center">
              <div className="mb-4 flex items-center justify-center gap-3">
                <div className="grid size-13 place-items-center rounded-2xl bg-cyan-500 text-white shadow-lg shadow-cyan-500/30">
                  <RadioTower size={30} />
                </div>
                <h1 className="text-3xl font-black tracking-tight text-slate-950">CoreFleet</h1>
              </div>
              <p className="text-sm font-medium text-slate-500">Fleet Management Dashboard</p>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-2xl shadow-slate-950/10">
              <h2 className="text-2xl font-black tracking-tight text-slate-950">Sign in</h2>
              <p className="mt-2 text-sm text-slate-500">Access your fleet command workspace.</p>

          {error && (
            <div className="mt-5 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <label className="mb-2 block text-sm font-bold text-slate-700">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 font-medium text-slate-900 outline-none transition focus:border-cyan-400 focus:bg-white focus:ring-4 focus:ring-cyan-500/10"
                placeholder="admin@corefleet.com"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-bold text-slate-700">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 font-medium text-slate-900 outline-none transition focus:border-cyan-400 focus:bg-white focus:ring-4 focus:ring-cyan-500/10"
                placeholder="Enter password"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-slate-950 px-4 py-3 font-black text-white shadow-lg shadow-slate-950/20 transition hover:-translate-y-0.5 hover:bg-slate-800 disabled:bg-slate-400"
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
              {!isLoading && <ArrowRight size={18} />}
            </button>
          </form>

          <div className="mt-6 rounded-2xl border border-cyan-100 bg-cyan-50 p-4">
            <p className="mb-2 flex items-center gap-2 text-xs font-black uppercase tracking-[0.16em] text-cyan-700"><Truck size={14} /> Demo Credentials</p>
            <p className="text-xs font-mono text-slate-700">Email: admin@corefleet.com</p>
            <p className="text-xs font-mono text-slate-700">Password: admin</p>
          </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
