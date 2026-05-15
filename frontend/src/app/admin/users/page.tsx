"use client";

import React, { useState, useEffect } from "react";
import AdminLayout from "@/components/admin/admin-layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Trash2, UserPlus, Edit3, X } from "lucide-react";
import { api } from "@/lib/api";

interface AdminUser {
  id: number;
  name: string;
  designation: string;
  login_id: string;
  created_at: string;
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ id: 0, name: '', designation: '', login_id: '', password: '' });
  const [formMode, setFormMode] = useState<'create' | 'edit'>('create');
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');

  // Passcode change section (per USR-02)
  const [passcode, setPasscode] = useState('');
  const [passcodeSaveStatus, setPasscodeSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');

  const fetchUsers = () => {
    api.get("users").then(res => {
      if (res?.status === "success" && Array.isArray(res.data)) setUsers(res.data);
    }).finally(() => setLoading(false));
  };

  useEffect(() => { fetchUsers(); }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaveStatus('saving');
    const res = await api.post("users", { action: "save_user", ...form });
    if (res?.status === "success") {
      setSaveStatus('saved');
      setForm({ id: 0, name: '', designation: '', login_id: '', password: '' });
      setFormMode('create');
      fetchUsers();
    } else {
      setSaveStatus('error');
    }
    setTimeout(() => setSaveStatus('idle'), 3000);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this user?")) return;
    await api.post("users", { action: "delete_user", id });
    fetchUsers();
  };

  const handleEdit = (user: AdminUser) => {
    setForm({ id: user.id, name: user.name, designation: user.designation, login_id: user.login_id, password: '' });
    setFormMode('edit');
  };

  const handleCancelEdit = () => {
    setForm({ id: 0, name: '', designation: '', login_id: '', password: '' });
    setFormMode('create');
  };

  const handlePasscodeSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!passcode.trim()) return;
    setPasscodeSaveStatus('saving');
    const res = await api.post("settings", { action: "save_all_settings", settings: { admin_passcode: passcode.trim() } });
    setPasscodeSaveStatus(res?.status === "success" ? 'saved' : 'error');
    setPasscode('');
    setTimeout(() => setPasscodeSaveStatus('idle'), 3000);
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-[60vh]">
          <div className="text-brand font-display text-xl animate-pulse">Loading users...</div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-10">
        {/* Page Header */}
        <div className="space-y-2">
          <Badge className="rounded-full bg-brand/10 text-brand border border-brand/20 px-3 py-1 text-[10px] uppercase tracking-[0.2em]">
            Users
          </Badge>
          <h1 className="text-4xl font-display font-bold text-[#1A1C1E]">User Management</h1>
          <p className="text-slate-400 text-sm">Manage admin panel users and login passcode.</p>
        </div>

        {/* 2-column grid: User List + Create/Edit Form */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left — User List */}
          <div className="bg-white rounded-[2rem] border border-slate-100 p-8 shadow-sm space-y-6">
            <h2 className="text-xl font-bold text-[#1A1C1E]">Admin Users</h2>

            {users.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-3 border border-slate-100">
                  <UserPlus className="text-slate-300 w-5 h-5" />
                </div>
                <p className="text-slate-400 text-sm">No users yet. Create the first one.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-100">
                      <th className="pb-3 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">Name</th>
                      <th className="pb-3 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">Designation</th>
                      <th className="pb-3 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">Login ID</th>
                      <th className="pb-3 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">Created</th>
                      <th className="pb-3 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {users.map(user => (
                      <tr key={user.id} className="group hover:bg-slate-50/50 transition-colors">
                        <td className="py-4 pr-3 text-sm font-bold text-[#1A1C1E]">{user.name}</td>
                        <td className="py-4 pr-3 text-xs text-slate-500">{user.designation || '—'}</td>
                        <td className="py-4 pr-3 text-xs font-mono text-slate-500">{user.login_id}</td>
                        <td className="py-4 pr-3 text-xs text-slate-400">
                          {user.created_at ? new Date(user.created_at).toLocaleDateString() : '—'}
                        </td>
                        <td className="py-4 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 rounded-lg text-slate-300 hover:text-brand hover:bg-brand/5 transition-all"
                              onClick={() => handleEdit(user)}
                              title="Edit user"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 rounded-lg text-slate-300 hover:text-rose-500 hover:bg-rose-50 transition-all"
                              onClick={() => handleDelete(user.id)}
                              title="Delete user"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Right — Create / Edit Form */}
          <div className="bg-white rounded-[2rem] border border-slate-100 p-8 shadow-sm space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-[#1A1C1E]">
                {formMode === 'edit' ? 'Edit User' : 'Create New User'}
              </h2>
              {formMode === 'edit' && (
                <button
                  onClick={handleCancelEdit}
                  className="flex items-center gap-1 text-xs text-slate-400 hover:text-slate-600 transition-colors"
                >
                  <X className="w-3 h-3" /> Cancel
                </button>
              )}
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">Name <span className="text-rose-400">*</span></label>
                <input
                  required
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-700 focus:outline-none focus:border-brand/30"
                  value={form.name}
                  onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                  placeholder="Full name"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">Designation</label>
                <input
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-700 focus:outline-none focus:border-brand/30"
                  value={form.designation}
                  onChange={e => setForm(p => ({ ...p, designation: e.target.value }))}
                  placeholder="e.g. Content Manager"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">Login ID <span className="text-rose-400">*</span></label>
                <input
                  required
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-700 focus:outline-none focus:border-brand/30"
                  value={form.login_id}
                  onChange={e => setForm(p => ({ ...p, login_id: e.target.value }))}
                  placeholder="Username or email"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">
                  Password {formMode === 'create' && <span className="text-rose-400">*</span>}
                </label>
                <input
                  required={formMode === 'create'}
                  type="password"
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-700 focus:outline-none focus:border-brand/30"
                  value={form.password}
                  onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
                  placeholder={formMode === 'edit' ? 'Leave blank to keep current password' : 'Set a password'}
                />
                {formMode === 'edit' && (
                  <p className="text-xs text-slate-400 mt-1">Leave blank to keep current password.</p>
                )}
              </div>

              <Button
                type="submit"
                disabled={saveStatus === 'saving'}
                className="w-full bg-[#1A1C1E] hover:bg-[#2A2C2E] text-white rounded-xl h-11 font-bold"
              >
                {saveStatus === 'saving' ? 'Saving...' : saveStatus === 'saved' ? 'Saved!' : saveStatus === 'error' ? 'Error — Retry' : 'Save User'}
              </Button>
            </form>
          </div>
        </div>

        {/* Admin Login Passcode Section */}
        <div className="bg-white rounded-[2rem] border border-slate-100 p-8 shadow-sm space-y-4">
          <div className="space-y-1">
            <h3 className="font-bold text-[#1A1C1E]">Admin Login Passcode</h3>
            <p className="text-slate-400 text-sm">Change the passcode used to access the admin panel. The login page fetches this value from the database at runtime — no code change required.</p>
          </div>
          <form onSubmit={handlePasscodeSave} className="flex gap-3 items-end">
            <div className="flex-1">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">New Passcode</label>
              <input
                type="password"
                value={passcode}
                onChange={e => setPasscode(e.target.value)}
                placeholder="Enter new passcode"
                className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-700 focus:outline-none focus:border-brand/30"
              />
            </div>
            <Button
              type="submit"
              disabled={passcodeSaveStatus === 'saving' || !passcode.trim()}
              className="bg-[#1A1C1E] hover:bg-[#2A2C2E] text-white rounded-xl h-11 px-6 font-bold"
            >
              {passcodeSaveStatus === 'saving' ? 'Saving...' : passcodeSaveStatus === 'saved' ? 'Saved!' : passcodeSaveStatus === 'error' ? 'Error' : 'Update Passcode'}
            </Button>
          </form>
        </div>
      </div>
    </AdminLayout>
  );
}
