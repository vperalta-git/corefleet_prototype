'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { PageWrapper } from '@/components/PageWrapper';
import { getAuthState, logout } from '@/lib/auth';
import { Bell, HelpCircle, Lock, LogOut, Save, Users } from 'lucide-react';

export default function SettingsPage() {
  const router = useRouter();
  const user = getAuthState().user;
  const [settings, setSettings] = useState({
    notifications: true,
    emailAlerts: true,
    darkMode: false,
    speedLimit: 80,
    fuelAlertThreshold: 25,
  });
  const [saved, setSaved] = useState(false);

  const handleSettingChange = (key: string, value: any) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
    setSaved(false);
  };

  const handleSaveSettings = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const inputClass = 'w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 font-semibold text-slate-700 outline-none transition focus:border-cyan-400 focus:bg-white focus:ring-4 focus:ring-cyan-500/10 disabled:cursor-not-allowed disabled:text-slate-500';

  return (
    <PageWrapper>
      <div className="mx-auto max-w-3xl space-y-6">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-xs font-black uppercase tracking-[0.22em] text-cyan-600">Workspace</p>
          <h1 className="mt-2 text-4xl font-black tracking-tight text-slate-950">Settings</h1>
          <p className="mt-2 text-slate-500">Manage your account, notifications, and fleet thresholds.</p>
        </div>

        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="mb-5 flex items-center gap-2 text-lg font-black text-slate-950">
            <Users size={20} className="text-cyan-600" />
            Profile Information
          </h2>
          <div className="space-y-4">
            {[
              ['Name', user?.name || ''],
              ['Email', user?.email || ''],
              ['Role', user?.role || ''],
            ].map(([label, value]) => (
              <div key={label}>
                <label className="mb-1 block text-sm font-bold text-slate-700">{label}</label>
                <input type="text" value={value} disabled className={inputClass} />
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="mb-5 flex items-center gap-2 text-lg font-black text-slate-950">
            <Bell size={20} className="text-cyan-600" />
            Notifications
          </h2>
          <div className="space-y-3">
            {[
              ['notifications', 'In-App Notifications', 'Receive alerts within the dashboard', settings.notifications],
              ['emailAlerts', 'Email Alerts', 'Get critical alerts via email', settings.emailAlerts],
            ].map(([key, title, description, checked]) => (
              <label key={String(key)} className="flex cursor-pointer items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 p-4 transition hover:bg-cyan-50">
                <span>
                  <span className="block font-black text-slate-950">{title}</span>
                  <span className="text-sm text-slate-500">{description}</span>
                </span>
                <input
                  type="checkbox"
                  checked={Boolean(checked)}
                  onChange={(e) => handleSettingChange(String(key), e.target.checked)}
                  className="size-5 cursor-pointer accent-cyan-600"
                />
              </label>
            ))}
          </div>
        </section>

        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="mb-5 flex items-center gap-2 text-lg font-black text-slate-950">
            <Lock size={20} className="text-cyan-600" />
            Fleet Thresholds
          </h2>
          <div className="space-y-4">
            <div>
              <label className="mb-2 block text-sm font-bold text-slate-700">Speed Limit Alert (km/h)</label>
              <input
                type="number"
                value={settings.speedLimit}
                onChange={(e) => handleSettingChange('speedLimit', parseInt(e.target.value))}
                className={inputClass}
              />
              <p className="mt-1 text-xs font-semibold text-slate-500">Alert when vehicles exceed this speed.</p>
            </div>
            <div>
              <label className="mb-2 block text-sm font-bold text-slate-700">Low Fuel Alert Threshold (%)</label>
              <input
                type="number"
                value={settings.fuelAlertThreshold}
                onChange={(e) => handleSettingChange('fuelAlertThreshold', parseInt(e.target.value))}
                className={inputClass}
              />
              <p className="mt-1 text-xs font-semibold text-slate-500">Alert when fuel level drops below this percentage.</p>
            </div>
          </div>
        </section>

        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="mb-5 text-lg font-black text-slate-950">Display Settings</h2>
          <label className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 p-4 opacity-70">
            <span>
              <span className="block font-black text-slate-950">Dark Mode</span>
              <span className="text-sm text-slate-500">Coming soon</span>
            </span>
            <input type="checkbox" checked={settings.darkMode} disabled className="size-5 cursor-not-allowed accent-cyan-600" />
          </label>
        </section>

        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="mb-5 flex items-center gap-2 text-lg font-black text-slate-950">
            <HelpCircle size={20} className="text-cyan-600" />
            Support & Help
          </h2>
          <div className="grid gap-3">
            {['Documentation', 'Contact Support', 'API Documentation'].map((item) => (
              <a
                key={item}
                href="#"
                className="block rounded-2xl border border-slate-200 bg-slate-50 p-4 transition hover:-translate-y-0.5 hover:border-cyan-200 hover:bg-cyan-50 hover:shadow-md"
              >
                <p className="font-black text-cyan-700">{item}</p>
                <p className="text-sm text-slate-500">Open {item.toLowerCase()} resources.</p>
              </a>
            ))}
          </div>
        </section>

        <div className="sticky bottom-20 flex flex-col gap-3 rounded-3xl border border-slate-200 bg-white/95 p-4 shadow-2xl shadow-slate-950/10 backdrop-blur sm:flex-row xl:bottom-6">
          <button
            onClick={handleSaveSettings}
            className="flex items-center justify-center gap-2 rounded-xl bg-slate-950 px-6 py-3 font-black text-white transition hover:-translate-y-0.5 hover:bg-slate-800"
          >
            <Save size={20} />
            Save Settings
          </button>
          {saved && (
            <div className="flex items-center justify-center rounded-xl bg-emerald-50 px-4 py-3 text-sm font-black text-emerald-700 animate-in fade-in slide-in-from-bottom-2 duration-300">
              Settings saved successfully
            </div>
          )}
          <button
            onClick={handleLogout}
            className="flex items-center justify-center gap-2 rounded-xl bg-rose-600 px-6 py-3 font-black text-white transition hover:-translate-y-0.5 hover:bg-rose-700 sm:ml-auto"
          >
            <LogOut size={20} />
            Logout
          </button>
        </div>
      </div>
    </PageWrapper>
  );
}
