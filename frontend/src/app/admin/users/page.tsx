"use client";

import React, { useState, useEffect } from "react";
import AdminLayout from "@/components/admin/admin-layout";
import { Trash2, Pencil } from "lucide-react";
import { api } from "@/lib/api";
import { cn } from "@/lib/utils";

interface AdminUser {
  id: number;
  name: string;
  designation: string;
  login_id: string;
  created_at: string;
}

const SETTINGS_TABS = [
  { label: "Site Settings", href: "/admin/settings" },
  { label: "Users", href: "/admin/users" },
];

type AccessLevel = "super_admin" | "admin" | "custom";

const ACCESS_OPTIONS: { value: AccessLevel; label: string; desc: string }[] = [
  { value: "super_admin", label: "Super Admin", desc: "Full access + user management & deletion" },
  { value: "admin",       label: "Admin",       desc: "Full access to all sections" },
  { value: "custom",      label: "Custom Access", desc: "Choose specific sections this user can see" },
];

const PAGE_ACCESS_GROUPS = [
  {
    group: "CONTENT",
    items: [
      { label: "Blog Posts",       key: "blog" },
      { label: "Case Studies",     key: "case_studies" },
      { label: "Guides / Lead Magnets", key: "guides" },
      { label: "Testimonials",     key: "testimonials" },
      { label: "Client Logos",     key: "logos" },
      { label: "Authors",          key: "authors" },
      { label: "Categories",       key: "categories" },
    ],
  },
  {
    group: "SECTIONS",
    items: [
      { label: "Leads & Subscribers", key: "leads" },
      { label: "Marketing Tools",     key: "marketing" },
      { label: "SEO Tools",           key: "seo" },
      { label: "Settings",            key: "settings" },
    ],
  },
];

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ id: 0, name: "", designation: "", login_id: "", password: "" });
  const [formMode, setFormMode] = useState<"create" | "edit">("create");
  const [accessLevel, setAccessLevel] = useState<AccessLevel>("admin");
  const [pageAccess, setPageAccess] = useState<Set<string>>(new Set());
  const [saving, setSaving] = useState(false);

  const fetchUsers = () => {
    api.get("users").then(res => {
      if (res?.status === "success" && Array.isArray(res.data)) setUsers(res.data);
    }).finally(() => setLoading(false));
  };

  useEffect(() => { fetchUsers(); }, []);

  const resetForm = () => {
    setForm({ id: 0, name: "", designation: "", login_id: "", password: "" });
    setFormMode("create");
    setAccessLevel("admin");
    setPageAccess(new Set());
    setShowForm(false);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const res = await api.post("users", { action: "save_user", ...form, access_level: accessLevel });
    if (res?.status === "success") { resetForm(); fetchUsers(); }
    setSaving(false);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this user?")) return;
    await api.post("users", { action: "delete_user", id });
    fetchUsers();
  };

  const handleEdit = (user: AdminUser) => {
    setForm({ id: user.id, name: user.name, designation: user.designation, login_id: user.login_id, password: "" });
    setFormMode("edit");
    setShowForm(true);
  };

  const toggleAccess = (key: string) => {
    setPageAccess(prev => {
      const next = new Set(prev);
      next.has(key) ? next.delete(key) : next.add(key);
      return next;
    });
  };

  const getAccessLabel = (user: AdminUser) => {
    if (user.designation?.toLowerCase().includes("super")) return { label: "Super Admin", cls: "bg-rose-100 text-rose-600" };
    return { label: "Admin", cls: "bg-blue-100 text-blue-600" };
  };

  return (
    <AdminLayout>
      <div className="max-w-5xl mx-auto">

        {/* Settings tabs */}
        <div className="flex items-center gap-0 border-b border-slate-200 mb-8">
          {SETTINGS_TABS.map(tab => (
            <a key={tab.href} href={tab.href}
              className={cn("px-5 py-2.5 text-sm font-semibold border-b-2 -mb-px transition-colors",
                tab.href === "/admin/users"
                  ? "border-brand text-brand"
                  : "border-transparent text-slate-500 hover:text-slate-800"
              )}>
              {tab.label}
            </a>
          ))}
        </div>

        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Users &amp; Access</h1>
            <p className="text-sm text-slate-500 mt-1">Manage admin users and control which sections each person can access.</p>
          </div>
          {!showForm && (
            <button
              onClick={() => { resetForm(); setShowForm(true); }}
              className="flex items-center gap-2 bg-brand text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-brand/90 transition-all shadow-sm"
            >
              + New User
            </button>
          )}
        </div>

        {/* Create / Edit form */}
        {showForm && (
          <div className="bg-white border border-slate-200 rounded-xl p-6 mb-6 shadow-sm">
            <h2 className="text-sm font-bold text-slate-800 mb-5">
              {formMode === "edit" ? "Edit User" : "Create New User"}
            </h2>
            <form onSubmit={handleSave} className="space-y-5">
              {/* Row 1: Name / Email / Password */}
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide block mb-1">Name <span className="text-rose-400">*</span></label>
                  <input required value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                    className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-brand" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide block mb-1">Email <span className="text-rose-400">*</span></label>
                  <input required value={form.login_id} onChange={e => setForm(p => ({ ...p, login_id: e.target.value }))}
                    placeholder="user@digipexel.com"
                    className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-brand" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide block mb-1">
                    Password {formMode === "create" && <span className="text-rose-400">*</span>}
                  </label>
                  <input required={formMode === "create"} type="password" value={form.password}
                    onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
                    placeholder={formMode === "edit" ? "Leave blank to keep" : ""}
                    className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-brand" />
                </div>
              </div>

              {/* Row 2: Access level */}
              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide block mb-2">Access Level <span className="text-rose-400">*</span></label>
                <div className="grid grid-cols-3 gap-3">
                  {ACCESS_OPTIONS.map(opt => (
                    <label key={opt.value}
                      className={cn(
                        "flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition-all",
                        accessLevel === opt.value ? "border-brand bg-brand/5" : "border-slate-200 hover:border-slate-300"
                      )}>
                      <input type="radio" name="access" value={opt.value} checked={accessLevel === opt.value}
                        onChange={() => setAccessLevel(opt.value)} className="mt-0.5 accent-brand" />
                      <div>
                        <p className="text-sm font-semibold text-slate-800">{opt.label}</p>
                        <p className="text-xs text-slate-400 mt-0.5">{opt.desc}</p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Row 3: Page access (custom only) */}
              {accessLevel === "custom" && (
                <div className="border border-slate-100 rounded-xl p-4 space-y-4">
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Page Access — select what this user can see and manage</p>
                  {PAGE_ACCESS_GROUPS.map(group => (
                    <div key={group.group}>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">{group.group}</p>
                      <div className="grid grid-cols-2 gap-y-2 gap-x-6">
                        {group.items.map(item => (
                          <label key={item.key} className="flex items-center gap-2.5 cursor-pointer group">
                            <input type="checkbox" checked={pageAccess.has(item.key)} onChange={() => toggleAccess(item.key)}
                              className="w-4 h-4 accent-brand rounded" />
                            <span className="text-sm text-slate-700 group-hover:text-slate-900">{item.label}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Actions */}
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={resetForm}
                  className="px-4 py-2 rounded-lg text-sm font-semibold text-slate-600 border border-slate-200 hover:bg-slate-50 transition-all">
                  Cancel
                </button>
                <button type="submit" disabled={saving}
                  className="px-5 py-2 rounded-lg text-sm font-semibold bg-brand text-white hover:bg-brand/90 disabled:opacity-50 transition-all">
                  {saving ? "Saving…" : formMode === "edit" ? "Update User" : "Create User"}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* User table */}
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
          {loading ? (
            <div className="py-16 text-center text-slate-400 text-sm">Loading…</div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/60">
                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wide">User</th>
                  <th className="text-left px-4 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wide">Access</th>
                  <th className="text-left px-4 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wide hidden md:table-cell">Added</th>
                  <th className="text-right px-5 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wide">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.length === 0 ? (
                  <tr><td colSpan={4} className="py-16 text-center text-slate-400 text-sm">No users yet</td></tr>
                ) : users.map(user => {
                  const { label, cls } = getAccessLabel(user);
                  const initials = user.name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();
                  return (
                    <tr key={user.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50/40 transition-colors">
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-brand/10 text-brand flex items-center justify-center text-xs font-bold flex-shrink-0">{initials}</div>
                          <div>
                            <p className="text-sm font-semibold text-slate-800">{user.name}</p>
                            <p className="text-xs text-slate-400">{user.login_id}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3.5">
                        <span className={cn("text-[11px] font-bold px-2.5 py-1 rounded-full", cls)}>{label}</span>
                      </td>
                      <td className="px-4 py-3.5 hidden md:table-cell text-xs text-slate-500">
                        {user.created_at ? new Date(user.created_at).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) : "—"}
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center justify-end gap-1">
                          <button onClick={() => handleEdit(user)} className="p-1.5 rounded-lg text-slate-400 hover:text-brand hover:bg-brand/8 transition-all"><Pencil className="w-4 h-4" /></button>
                          <button onClick={() => handleDelete(user.id)} className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all"><Trash2 className="w-4 h-4" /></button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
