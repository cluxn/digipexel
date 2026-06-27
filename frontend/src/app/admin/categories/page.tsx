"use client";

import React, { useEffect, useState } from "react";
import { Plus, Trash2, Pencil, Check, X } from "lucide-react";
import AdminLayout from "@/components/admin/admin-layout";
import { API_BASE_URL } from "@/lib/constants";
import { safeFetch, cn } from "@/lib/utils";

interface SavedCategory {
  id: number;
  name: string;
  slug: string;
  description: string;
  content_type: string;
}

function slugify(s: string) {
  return s.toLowerCase().trim().replace(/[^a-z0-9-]+/g, "-").replace(/^-+|-+$/, "");
}

const CONTENT_TABS = [
  { label: "Blog", href: "/admin/blog" },
  { label: "Case Studies", href: "/admin/case-studies" },
  { label: "Guides", href: "/admin/guides" },
  { label: "Testimonials", href: "/admin/testimonials" },
  { label: "Client Logos", href: "/admin/logos" },
  { label: "Authors", href: "/admin/authors" },
  { label: "Categories", href: "/admin/categories" },
];

export default function AdminCategoriesPage() {
  const [saved, setSaved] = useState<SavedCategory[]>([]);
  const [loading, setLoading] = useState(true);

  const [showForm, setShowForm] = useState(false);
  const [newName, setNewName] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [adding, setAdding] = useState(false);

  const [editingId, setEditingId] = useState<number | null>(null);
  const [editName, setEditName] = useState("");
  const [editDesc, setEditDesc] = useState("");

  useEffect(() => { loadAll(); }, []);

  const loadAll = async () => {
    setLoading(true);
    try {
      const res = await safeFetch(`${API_BASE_URL}/categories.php`);
      if (res?.status === "success") setSaved(res.data as SavedCategory[]);
    } finally {
      setLoading(false);
    }
  };

  const addCategory = async () => {
    const name = newName.trim();
    if (!name) return;
    setAdding(true);
    const res = await safeFetch(`${API_BASE_URL}/categories.php`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "add_category", name, description: newDesc.trim(), content_type: "all" }),
    });
    if (res?.status === "success") {
      setNewName(""); setNewDesc(""); setShowForm(false);
      loadAll();
    }
    setAdding(false);
  };

  const deleteCategory = async (id: number) => {
    if (!confirm("Delete this category?")) return;
    await safeFetch(`${API_BASE_URL}/categories.php`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "delete_category", id }),
    });
    loadAll();
  };

  const startEdit = (cat: SavedCategory) => {
    setEditingId(cat.id);
    setEditName(cat.name);
    setEditDesc(cat.description || "");
  };

  const saveEdit = async (id: number) => {
    const name = editName.trim();
    if (!name) return;
    await safeFetch(`${API_BASE_URL}/categories.php`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "rename_category", id, name, description: editDesc.trim() }),
    });
    setEditingId(null);
    loadAll();
  };

  return (
    <AdminLayout>
      <div className="max-w-5xl mx-auto">

        {/* Content-type tabs */}
        <div className="flex items-center gap-0 border-b border-slate-200 mb-6 overflow-x-auto">
          {CONTENT_TABS.map(tab => (
            <a key={tab.href} href={tab.href}
              className={cn("px-4 py-2.5 text-sm font-semibold border-b-2 -mb-px transition-colors whitespace-nowrap",
                tab.href === "/admin/categories"
                  ? "border-brand text-brand"
                  : "border-transparent text-slate-500 hover:text-slate-800"
              )}>
              {tab.label}
            </a>
          ))}
        </div>

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-slate-900">Categories</h1>
          <button
            onClick={() => { setShowForm(true); setNewName(""); setNewDesc(""); }}
            className="flex items-center gap-2 bg-brand text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-brand/90 transition-all shadow-sm"
          >
            <Plus className="w-4 h-4" /> New Category
          </button>
        </div>

        {/* Create form */}
        {showForm && (
          <div className="bg-white border border-slate-200 rounded-xl p-6 mb-6 shadow-sm">
            <h2 className="text-sm font-bold text-slate-800 mb-4">New Category</h2>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide block mb-1">Name <span className="text-rose-400">*</span></label>
                <input
                  value={newName}
                  onChange={e => setNewName(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && addCategory()}
                  placeholder="e.g. AI & Automation"
                  className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-brand"
                  autoFocus
                />
                {newName && (
                  <p className="text-[11px] text-slate-400 mt-1 font-mono">{slugify(newName)}</p>
                )}
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide block mb-1">Description</label>
                <input
                  value={newDesc}
                  onChange={e => setNewDesc(e.target.value)}
                  placeholder="Optional description"
                  className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-brand"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <button onClick={() => setShowForm(false)} className="px-4 py-2 rounded-lg text-sm font-semibold text-slate-600 border border-slate-200 hover:bg-slate-50 transition-all">Cancel</button>
              <button
                onClick={addCategory}
                disabled={adding || !newName.trim()}
                className="px-4 py-2 rounded-lg text-sm font-semibold bg-brand text-white hover:bg-brand/90 disabled:opacity-40 transition-all"
              >
                {adding ? "Saving…" : "Save"}
              </button>
            </div>
          </div>
        )}

        {/* Table */}
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
          {loading ? (
            <div className="py-16 text-center text-slate-400 text-sm">Loading…</div>
          ) : saved.length === 0 ? (
            <div className="py-16 text-center text-slate-400 text-sm font-semibold">
              No categories yet — click &ldquo;+ New Category&rdquo; to add one
            </div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/60">
                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wide">Name</th>
                  <th className="text-left px-4 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wide hidden sm:table-cell">Slug</th>
                  <th className="text-left px-4 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wide hidden md:table-cell">Description</th>
                  <th className="text-right px-5 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wide">Actions</th>
                </tr>
              </thead>
              <tbody>
                {saved.map(cat => (
                  <tr key={cat.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50/40 transition-colors">
                    {editingId === cat.id ? (
                      <>
                        <td className="px-5 py-3">
                          <input
                            value={editName}
                            onChange={e => setEditName(e.target.value)}
                            onKeyDown={e => { if (e.key === "Enter") saveEdit(cat.id); if (e.key === "Escape") setEditingId(null); }}
                            className="w-full border border-brand rounded-lg px-3 py-1.5 text-sm focus:outline-none"
                            autoFocus
                          />
                        </td>
                        <td className="px-4 py-3 hidden sm:table-cell text-xs text-slate-400 font-mono">{slugify(editName || cat.name)}</td>
                        <td className="px-4 py-3 hidden md:table-cell">
                          <input
                            value={editDesc}
                            onChange={e => setEditDesc(e.target.value)}
                            className="w-full border border-slate-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:border-brand"
                            placeholder="Description"
                          />
                        </td>
                        <td className="px-5 py-3">
                          <div className="flex items-center justify-end gap-1">
                            <button onClick={() => saveEdit(cat.id)} className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600 hover:bg-emerald-100 transition-all"><Check className="w-4 h-4" /></button>
                            <button onClick={() => setEditingId(null)} className="p-1.5 rounded-lg bg-slate-100 text-slate-500 hover:bg-slate-200 transition-all"><X className="w-4 h-4" /></button>
                          </div>
                        </td>
                      </>
                    ) : (
                      <>
                        <td className="px-5 py-3.5">
                          <span className="text-sm font-semibold text-slate-800">{cat.name}</span>
                        </td>
                        <td className="px-4 py-3.5 hidden sm:table-cell text-xs text-slate-400 font-mono">{cat.slug || slugify(cat.name)}</td>
                        <td className="px-4 py-3.5 hidden md:table-cell text-sm text-slate-500">{cat.description || "—"}</td>
                        <td className="px-5 py-3.5">
                          <div className="flex items-center justify-end gap-1">
                            <button onClick={() => startEdit(cat)} className="p-1.5 rounded-lg text-slate-400 hover:text-brand hover:bg-brand/8 transition-all"><Pencil className="w-4 h-4" /></button>
                            <button onClick={() => deleteCategory(cat.id)} className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all"><Trash2 className="w-4 h-4" /></button>
                          </div>
                        </td>
                      </>
                    )}
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
