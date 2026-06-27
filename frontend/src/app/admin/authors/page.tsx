"use client";

import React, { useState, useEffect } from "react";
import { Plus, Trash2, Pencil, Check, X, User } from "lucide-react";
import AdminLayout from "@/components/admin/admin-layout";
import { cn } from "@/lib/utils";

interface Author {
  id: number;
  name: string;
  role: string;
  bio: string;
  image_url: string;
}

const SEED: Author[] = [
  { id: 1, name: "Digi Pexel Team", role: "Content Team", bio: "The Digi Pexel editorial team.", image_url: "" },
];

const CONTENT_TABS = [
  { label: "Blog", href: "/admin/blog" },
  { label: "Case Studies", href: "/admin/case-studies" },
  { label: "Guides", href: "/admin/guides" },
  { label: "Testimonials", href: "/admin/testimonials" },
  { label: "Client Logos", href: "/admin/logos" },
  { label: "Authors", href: "/admin/authors" },
  { label: "Categories", href: "/admin/categories" },
];

export default function AdminAuthorsPage() {
  const [authors, setAuthors] = useState<Author[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ id: 0, name: "", role: "", bio: "", image_url: "" });
  const [editingId, setEditingId] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("admin_authors");
    setAuthors(stored ? JSON.parse(stored) : SEED);
  }, []);

  const persist = (next: Author[]) => {
    setAuthors(next);
    localStorage.setItem("admin_authors", JSON.stringify(next));
  };

  const resetForm = () => {
    setForm({ id: 0, name: "", role: "", bio: "", image_url: "" });
    setEditingId(null);
    setShowForm(false);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    if (editingId !== null) {
      persist(authors.map(a => a.id === editingId ? { ...a, ...form, id: editingId } : a));
    } else {
      const next: Author = { ...form, id: Date.now() };
      persist([...authors, next]);
    }
    setSaving(false);
    resetForm();
  };

  const handleEdit = (a: Author) => {
    setForm({ id: a.id, name: a.name, role: a.role, bio: a.bio, image_url: a.image_url });
    setEditingId(a.id);
    setShowForm(true);
  };

  const handleDelete = (id: number) => {
    if (!confirm("Delete this author?")) return;
    persist(authors.filter(a => a.id !== id));
  };

  return (
    <AdminLayout>
      <div className="max-w-5xl mx-auto">

        {/* Content-type tabs */}
        <div className="flex items-center gap-0 border-b border-slate-200 mb-6 overflow-x-auto scrollbar-none">
          {CONTENT_TABS.map(tab => (
            <a key={tab.href} href={tab.href}
              className={cn("px-4 py-2.5 text-sm font-semibold border-b-2 -mb-px transition-colors whitespace-nowrap",
                tab.href === "/admin/authors"
                  ? "border-brand text-brand"
                  : "border-transparent text-slate-500 hover:text-slate-800"
              )}>
              {tab.label}
            </a>
          ))}
        </div>

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-slate-900">Authors</h1>
          {!showForm && (
            <button onClick={() => { resetForm(); setShowForm(true); }}
              className="flex items-center gap-2 bg-brand text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-brand/90 transition-all shadow-sm">
              <Plus className="w-4 h-4" /> New Author
            </button>
          )}
        </div>

        {/* Form */}
        {showForm && (
          <div className="bg-white border border-slate-200 rounded-xl p-6 mb-6 shadow-sm">
            <h2 className="text-sm font-bold text-slate-800 mb-4">{editingId ? "Edit Author" : "New Author"}</h2>
            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide block mb-1">Name <span className="text-rose-400">*</span></label>
                  <input required value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                    placeholder="e.g. Priya Sharma"
                    className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-brand" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide block mb-1">Role / Title</label>
                  <input value={form.role} onChange={e => setForm(p => ({ ...p, role: e.target.value }))}
                    placeholder="e.g. Content Strategist"
                    className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-brand" />
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide block mb-1">Photo URL</label>
                <input value={form.image_url} onChange={e => setForm(p => ({ ...p, image_url: e.target.value }))}
                  placeholder="https://…"
                  className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-brand font-mono" />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide block mb-1">Bio</label>
                <textarea rows={2} value={form.bio} onChange={e => setForm(p => ({ ...p, bio: e.target.value }))}
                  placeholder="Short author bio…"
                  className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-brand resize-none" />
              </div>
              <div className="flex justify-end gap-2">
                <button type="button" onClick={resetForm}
                  className="px-4 py-2 rounded-lg text-sm font-semibold text-slate-600 border border-slate-200 hover:bg-slate-50 transition-all">Cancel</button>
                <button type="submit" disabled={saving}
                  className="px-5 py-2 rounded-lg text-sm font-semibold bg-brand text-white hover:bg-brand/90 disabled:opacity-50 transition-all">
                  {saving ? "Saving…" : editingId ? "Update" : "Create Author"}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Table */}
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
          {authors.length === 0 ? (
            <div className="py-16 text-center text-slate-400 text-sm font-semibold">No authors yet</div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/60">
                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wide">Author</th>
                  <th className="text-left px-4 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wide hidden md:table-cell">Role</th>
                  <th className="text-left px-4 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wide hidden lg:table-cell">Bio</th>
                  <th className="text-right px-5 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wide">Actions</th>
                </tr>
              </thead>
              <tbody>
                {authors.map(a => (
                  <tr key={a.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50/40 transition-colors">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full overflow-hidden bg-slate-100 flex items-center justify-center flex-shrink-0">
                          {a.image_url
                            ? <img src={a.image_url} alt="" className="w-full h-full object-cover" />
                            : <User className="w-4 h-4 text-slate-300" />}
                        </div>
                        <span className="text-sm font-semibold text-slate-800">{a.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3.5 hidden md:table-cell text-sm text-slate-500">{a.role || "—"}</td>
                    <td className="px-4 py-3.5 hidden lg:table-cell text-sm text-slate-500 max-w-xs truncate">{a.bio || "—"}</td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={() => handleEdit(a)} className="p-1.5 rounded-lg text-slate-400 hover:text-brand hover:bg-brand/8 transition-all"><Pencil className="w-4 h-4" /></button>
                        <button onClick={() => handleDelete(a.id)} className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
