'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { login } from '@/lib/auth';
import { ThemeToggle } from '@/components/ThemeToggle';
import { useTheme } from '@/components/ThemeProvider';
import { ArrowRight, ShieldCheck, Truck } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { theme } = useTheme();
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

  const logoSrc =
    theme === 'dark'
      ? '/logos/Coretech_Logo_Dark_Background.png'
      : '/logos/Coretech_Logo_Light_Background.png';
  const faviconSrc = theme === 'dark' ? '/logos/favicon_dark.png' : '/logos/favicon_light.png';

  return (
    <div className="min-h-screen overflow-hidden bg-[#020817] text-white">
      <div className="fixed right-4 top-4 z-20">
        <ThemeToggle />
      </div>
      <div className="grid min-h-screen lg:grid-cols-[1.1fr_0.9fr]">
        <section className="relative hidden items-center justify-center overflow-hidden p-10 lg:flex">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_22%_18%,rgba(14,165,233,0.36),transparent_30%),radial-gradient(circle_at_78%_72%,rgba(34,211,238,0.18),transparent_32%)]" />
          <div className="relative w-full max-w-2xl animate-in fade-in slide-in-from-left-6 duration-700">
            <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm font-semibold text-cyan-100">
              <ShieldCheck size={16} />
              Fleet operations, dispatch, telemetry
            </div>
            <div className="inline-flex rounded-2xl border border-cyan-300/25 bg-[#030b1f]/80 p-4 shadow-2xl shadow-sky-500/20 backdrop-blur">
              <img
                src="/logos/Coretech_Logo_Dark_Background.png"
                alt="Coretech"
                className="h-24 w-[23rem] object-cover object-center"
              />
            </div>
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

        <section className="flex items-center justify-center bg-[#f3fbff] p-4 text-slate-950 dark:bg-[#08152a] sm:p-8">
          <div className="w-full max-w-md animate-in fade-in zoom-in-95 duration-500">
            <div className="mb-7 text-center">
              <div className="mb-4 flex justify-center">
                <div className="relative flex w-full max-w-[22rem] items-center gap-4 rounded-2xl border border-sky-200 bg-white p-3 shadow-xl shadow-sky-200/40 dark:border-sky-500/30 dark:bg-[#030b1f] dark:shadow-sky-950/40">
                  <div className="flex size-14 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-sky-950 shadow-lg shadow-sky-500/20 dark:bg-sky-950">
                    <img src={faviconSrc} alt="" className="size-14 object-cover object-center" />
                  </div>
                  <div className="min-w-0 flex-1 overflow-hidden rounded-xl bg-[#071733] dark:bg-[#030814]">
                    <img
                      src={logoSrc}
                      alt="Coretech"
                      className="h-20 w-full object-cover object-center"
                    />
                  </div>
                </div>
              </div>
              <p className="text-sm font-black uppercase tracking-[0.18em] text-sky-700 dark:text-sky-200">
                Fleet Management Dashboard
              </p>
            </div>

            <div className="rounded-3xl border border-sky-100 bg-white p-8 shadow-2xl shadow-sky-950/10 dark:border-sky-500/20 dark:bg-[#0d1930]">
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
