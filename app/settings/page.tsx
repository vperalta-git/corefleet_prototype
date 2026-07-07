'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { PageWrapper } from '@/components/PageWrapper';
import { getAuthState, logout } from '@/lib/auth';
import { Bell, Lock, Users, HelpCircle, LogOut, Save } from 'lucide-react';

export default function SettingsPage() {
  const router = useRouter();
  const [user, setUser] = useState(getAuthState().user);
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
    // In a real app, save to backend
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <PageWrapper>
      <div className="max-w-2xl space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-600 mt-1">Manage your account and preferences</p>
        </div>

        {/* Profile Section */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Users size={20} />
            Profile Information
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <input
                type="text"
                value={user?.name || ''}
                disabled
                className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-600 cursor-not-allowed"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                value={user?.email || ''}
                disabled
                className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-600 cursor-not-allowed"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
              <input
                type="text"
                value={user?.role || ''}
                disabled
                className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-600 cursor-not-allowed"
              />
            </div>
          </div>
        </div>

        {/* Notification Settings */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Bell size={20} />
            Notifications
          </h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900">In-App Notifications</p>
                <p className="text-sm text-gray-600">Receive alerts within the dashboard</p>
              </div>
              <input
                type="checkbox"
                checked={settings.notifications}
                onChange={(e) => handleSettingChange('notifications', e.target.checked)}
                className="w-5 h-5 rounded border-gray-300 cursor-pointer"
              />
            </div>
            <div className="border-t pt-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">Email Alerts</p>
                  <p className="text-sm text-gray-600">Get critical alerts via email</p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.emailAlerts}
                  onChange={(e) => handleSettingChange('emailAlerts', e.target.checked)}
                  className="w-5 h-5 rounded border-gray-300 cursor-pointer"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Fleet Settings */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Lock size={20} />
            Fleet Thresholds
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Speed Limit Alert (km/h)
              </label>
              <input
                type="number"
                value={settings.speedLimit}
                onChange={(e) => handleSettingChange('speedLimit', parseInt(e.target.value))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <p className="text-xs text-gray-500 mt-1">Alert when vehicles exceed this speed</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Low Fuel Alert Threshold (%)
              </label>
              <input
                type="number"
                value={settings.fuelAlertThreshold}
                onChange={(e) => handleSettingChange('fuelAlertThreshold', parseInt(e.target.value))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <p className="text-xs text-gray-500 mt-1">Alert when fuel level drops below this percentage</p>
            </div>
          </div>
        </div>

        {/* Display Settings */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Display Settings</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900">Dark Mode</p>
                <p className="text-sm text-gray-600">Coming soon</p>
              </div>
              <input
                type="checkbox"
                checked={settings.darkMode}
                onChange={(e) => handleSettingChange('darkMode', e.target.checked)}
                disabled
                className="w-5 h-5 rounded border-gray-300 cursor-not-allowed opacity-50"
              />
            </div>
          </div>
        </div>

        {/* Support Section */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <HelpCircle size={20} />
            Support & Help
          </h2>
          <div className="space-y-3">
            <a
              href="#"
              className="block p-3 border border-gray-200 rounded-lg hover:bg-blue-50 hover:border-blue-300 transition-colors"
            >
              <p className="font-medium text-blue-600">Documentation</p>
              <p className="text-sm text-gray-600">View the complete user guide</p>
            </a>
            <a
              href="#"
              className="block p-3 border border-gray-200 rounded-lg hover:bg-blue-50 hover:border-blue-300 transition-colors"
            >
              <p className="font-medium text-blue-600">Contact Support</p>
              <p className="text-sm text-gray-600">Reach out to our support team</p>
            </a>
            <a
              href="#"
              className="block p-3 border border-gray-200 rounded-lg hover:bg-blue-50 hover:border-blue-300 transition-colors"
            >
              <p className="font-medium text-blue-600">API Documentation</p>
              <p className="text-sm text-gray-600">Integrate CoreFleet with your systems</p>
            </a>
          </div>
        </div>

        {/* Save & Logout Buttons */}
        <div className="flex gap-3 sticky bottom-0 bg-gray-50 border-t border-gray-200 p-4 -mx-8 px-8">
          <button
            onClick={handleSaveSettings}
            className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold transition-colors"
          >
            <Save size={20} />
            Save Settings
          </button>
          {saved && (
            <div className="flex items-center text-green-600 text-sm">
              ✓ Settings saved successfully
            </div>
          )}
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg font-semibold transition-colors ml-auto"
          >
            <LogOut size={20} />
            Logout
          </button>
        </div>
      </div>
    </PageWrapper>
  );
}
