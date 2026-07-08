'use client';

import { useEffect, useState } from 'react';
import { PageWrapper } from '@/components/PageWrapper';
import { User } from '@/lib/types';
import { addUser, deleteUser, getUsers, updateUser } from '@/lib/storage';
import { Edit2, Mail, Plus, ShieldCheck, Trash2, UserRound } from 'lucide-react';

type UserRole = User['role'];

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'operator' as UserRole,
    password: '',
  });

  useEffect(() => {
    setUsers(getUsers());
  }, []);

  const resetForm = () => {
    setFormData({ name: '', email: '', role: 'operator', password: '' });
  };

  const handleAddClick = () => {
    setEditingId(null);
    resetForm();
    setShowModal(true);
  };

  const handleEditClick = (user: User) => {
    setEditingId(user.id);
    setFormData({
      name: user.name,
      email: user.email,
      role: user.role,
      password: user.password || '',
    });
    setShowModal(true);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (editingId) {
      updateUser(editingId, {
        name: formData.name,
        email: formData.email,
        role: formData.role,
        ...(formData.password ? { password: formData.password } : {}),
      });
    } else {
      addUser({
        id: `user-${Date.now()}`,
        name: formData.name,
        email: formData.email,
        role: formData.role,
        password: formData.password || 'password',
      });
    }

    setUsers(getUsers());
    setShowModal(false);
    resetForm();
  };

  const handleDelete = (id: string) => {
    const user = users.find((item) => item.id === id);
    if (user?.email === 'admin@corefleet.com') {
      alert('Default admin cannot be deleted.');
      return;
    }

    if (confirm('Are you sure you want to delete this user?')) {
      deleteUser(id);
      setUsers(getUsers());
    }
  };

  return (
    <PageWrapper>
      <div className="space-y-6">
        <div className="flex flex-col gap-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.22em] text-cyan-600">Access Control</p>
            <h1 className="mt-2 text-4xl font-black tracking-tight text-slate-950">Users</h1>
            <p className="mt-2 text-slate-500">Add operators, viewers, and admins who can access the fleet system.</p>
          </div>
          <button
            type="button"
            onClick={handleAddClick}
            className="flex items-center justify-center gap-2 rounded-xl bg-blue-700 px-5 py-3 font-black text-white shadow-lg shadow-blue-700/20 transition hover:-translate-y-0.5 hover:bg-blue-800"
          >
            <Plus size={20} />
            Add User
          </button>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {[
            ['Total Users', users.length, UserRound],
            ['Admins', users.filter((user) => user.role === 'admin').length, ShieldCheck],
            ['Operators', users.filter((user) => user.role === 'operator').length, UserRound],
          ].map(([label, value, Icon]) => (
            <div key={String(label)} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.14em] text-slate-500">{String(label)}</p>
                  <p className="mt-2 text-3xl font-black text-slate-950">{String(value)}</p>
                </div>
                <div className="grid size-12 place-items-center rounded-2xl bg-sky-50 text-blue-700">
                  <Icon size={22} />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-slate-200 bg-slate-50">
                <tr>
                  {['Name', 'Email', 'Role', 'Password', 'Actions'].map((heading) => (
                    <th key={heading} className="px-6 py-4 text-left text-xs font-black uppercase tracking-[0.14em] text-slate-500">
                      {heading}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {users.map((user) => (
                  <tr key={user.id} className="transition hover:bg-cyan-50/50">
                    <td className="px-6 py-4 text-sm font-black text-slate-950">{user.name}</td>
                    <td className="px-6 py-4 text-sm text-slate-600">
                      <span className="flex items-center gap-2">
                        <Mail size={16} className="text-cyan-600" />
                        {user.email}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="rounded-full bg-cyan-100 px-3 py-1 text-xs font-black uppercase tracking-[0.12em] text-cyan-800">
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm font-semibold text-slate-500">
                      {user.password ? 'Set' : 'Not set'}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => handleEditClick(user)}
                          className="rounded-lg p-2 text-cyan-600 transition hover:bg-cyan-100 hover:text-cyan-800"
                          title="Edit user"
                        >
                          <Edit2 size={18} />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(user.id)}
                          className="rounded-lg p-2 text-rose-600 transition hover:bg-rose-100 hover:text-rose-800"
                          title="Delete user"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl animate-in zoom-in-95 slide-in-from-bottom-4 duration-300">
              <h2 className="mb-4 text-xl font-black text-slate-950">{editingId ? 'Edit User' : 'Add User'}</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="mb-1 block text-sm font-bold text-slate-700">Full Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(event) => setFormData({ ...formData, name: event.target.value })}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 outline-none transition focus:border-cyan-400 focus:bg-white focus:ring-4 focus:ring-cyan-500/10"
                    required
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-bold text-slate-700">Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(event) => setFormData({ ...formData, email: event.target.value })}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 outline-none transition focus:border-cyan-400 focus:bg-white focus:ring-4 focus:ring-cyan-500/10"
                    required
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-bold text-slate-700">Role</label>
                  <select
                    value={formData.role}
                    onChange={(event) => setFormData({ ...formData, role: event.target.value as UserRole })}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 outline-none transition focus:border-cyan-400 focus:bg-white focus:ring-4 focus:ring-cyan-500/10"
                  >
                    <option value="admin">Admin</option>
                    <option value="operator">Operator</option>
                    <option value="viewer">Viewer</option>
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-sm font-bold text-slate-700">Password</label>
                  <input
                    type="password"
                    value={formData.password}
                    onChange={(event) => setFormData({ ...formData, password: event.target.value })}
                    placeholder={editingId ? 'Leave blank to keep current password' : 'Default: password'}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 outline-none transition focus:border-cyan-400 focus:bg-white focus:ring-4 focus:ring-cyan-500/10"
                  />
                </div>
                <div className="flex justify-end gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="rounded-xl border border-slate-200 px-4 py-2 font-bold text-slate-700 transition hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="rounded-xl bg-blue-700 px-4 py-2 font-black text-white transition hover:bg-blue-800"
                  >
                    {editingId ? 'Update' : 'Add'} User
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </PageWrapper>
  );
}
