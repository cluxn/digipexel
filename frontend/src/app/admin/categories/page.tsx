"use client";

import React, { useEffect, useState } from "react";
import { Tag, FileText, BookOpen, Briefcase, RefreshCw, Plus, Trash2, Pencil, Check, X } from "lucide-react";
import AdminLayout from "@/components/admin/admin-layout";
import { API_BASE_URL } from "@/lib/constants";
import { safeFetch, cn } from "@/lib/utils";
import Link from "next/link";

interface ContentItem {
  category?: string;
  industry?: string;
}

interface CategoryRow {
  name: string;
  blogCount: number;
  guideCount: number;
  caseStudyCount: number;
  total: number;
}

interface SavedCategory {
  id: number;
  name: string;
  content_type: string;
}

export default function AdminCategoriesPage() {
  const [rows, setRows] = useState<CategoryRow[]>([]);
  const [saved, setSaved] = useState<SavedCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "blog" | "guide" | "case-study">("all");

  const [newName, setNewName] = useState("");
  const [newType, setNewType] = useState("all");
  const [adding, setAdding] = useState(false);
  const [addMsg, setAddMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const [editingId, setEditingId] = useState<number | null>(null);
  const [editName, setEditName] = useState("");

  useEffect(() => {
    loadAll();
  }, []);

  const loadAll = async () => {
    setLoading(true);
    try {
      const [blogsRes, guidesRes, casesRes, catRes] = await Promise.all([
        safeFetch(`${API_BASE_URL}/blogs.php?admin=1`),
        safeFetch(`${API_BASE_URL}/guides.php?admin=1`),
        safeFetch(`${API_BASE_URL}/case_studies.php?admin=1`),
        safeFetch(`${API_BASE_URL}/categories.php`),
      ]);

      const blogs: ContentItem[] = blogsRes?.status === "success" ? blogsRes.data : [];
      const guides: ContentItem[] = guidesRes?.status === "success" ? guidesRes.data : [];
      const cases: ContentItem[] = casesRes?.status === "success" ? casesRes.data : [];

      const map = new Map<string, CategoryRow>();
      const addItems = (items: ContentItem[], field: "blogCount" | "guideCount" | "caseStudyCount", key: keyof ContentItem) => {
        for (const item of items) {
          const cat = ((item[key] as string) || "").trim();
          if (!cat) continue;
          if (!map.has(cat)) map.set(cat, { name: cat, blogCount: 0, guideCount: 0, caseStudyCount: 0, total: 0 });
          const row = map.get(cat)!;
          row[field]++;
          row.total++;
        }
      };
      addItems(blogs, "blogCount", "category");
      addItems(guides, "guideCount", "category");
      addItems(cases, "caseStudyCount", "industry");

      setRows(Array.from(map.values()).sort((a, b) => b.total - a.total));
      if (catRes?.status === "success") setSaved(catRes.data as SavedCategory[]);
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
      body: JSON.stringify({ action: "add_category", name, content_type: newType }),
    });
    if (res?.status === "success") {
      setNewName("");
      setAddMsg({ type: "success", text: "Category added." });
      loadAll();
    } else {
      setAddMsg({ type: "error", text: res?.message ?? "Failed to add." });
    }
    setTimeout(() => setAddMsg(null), 4000);
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
  };

  const saveEdit = async (id: number) => {
    const name = editName.trim();
    if (!name) return;
    await safeFetch(`${API_BASE_URL}/categories.php`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "rename_category", id, name }),
    });
    setEditingId(null);
    loadAll();
  };

  const filtered = rows.filter(r => {
    if (filter === "blog") return r.blogCount > 0;
    if (filter === "guide") return r.guideCount > 0;
    if (filter === "case-study") return r.caseStudyCount > 0;
    return true;
  });

  const totalBlogs = rows.reduce((s, r) => s + r.blogCount, 0);
  const totalGuides = rows.reduce((s, r) => s + r.guideCount, 0);
  const totalCases = rows.reduce((s, r) => s + r.caseStudyCount, 0);

  return (
    <AdminLayout>
      <div className="p-10 max-w-5xl mx-auto space-y-10">

        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Categories</h1>
            <p className="text-slate-500 text-sm mt-1">Manage predefined categories for Blog, Guides, and Case Studies.</p>
          </div>
          <button
            onClick={loadAll}
            className="flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 bg-white text-slate-600 text-sm font-semibold hover:border-brand/40 hover:text-brand transition-all"
          >
            <RefreshCw className={cn("w-4 h-4", loading && "animate-spin")} />
            Refresh
          </button>
        </div>

        {/* Add category */}
        <div className="bg-white rounded-2xl border border-slate-100 p-6 space-y-4">
          <h2 className="text-sm font-bold text-slate-700 uppercase tracking-widest">Add New Category</h2>
          <div className="flex items-center gap-3">
            <input
              value={newName}
              onChange={e => setNewName(e.target.value)}
              onKeyDown={e => e.key === "Enter" && addCategory()}
              placeholder="Category name…"
              className="flex-1 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-brand transition-colors"
            />
            <select
              value={newType}
              onChange={e => setNewType(e.target.value)}
              className="border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-brand bg-white text-slate-600"
            >
              <option value="all">All</option>
              <option value="blog">Blog</option>
              <option value="guide">Guides</option>
              <option value="case-study">Case Studies</option>
            </select>
            <button
              onClick={addCategory}
              disabled={adding || !newName.trim()}
              className="flex items-center gap-2 bg-brand text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-brand/90 disabled:opacity-40 transition-all"
            >
              <Plus className="w-4 h-4" />
              {adding ? "Adding…" : "Add"}
            </button>
          </div>
          {addMsg && (
            <p className={`text-xs font-semibold ${addMsg.type === "success" ? "text-emerald-500" : "text-rose-500"}`}>
              {addMsg.text}
            </p>
          )}
        </div>

        {/* Saved categories list */}
        {saved.length > 0 && (
          <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50">
              <h2 className="text-[11px] font-black uppercase tracking-widest text-slate-500">Saved Categories ({saved.length})</h2>
            </div>
            <div className="divide-y divide-slate-50">
              {saved.map(cat => (
                <div key={cat.id} className="flex items-center gap-3 px-6 py-3">
                  <div className="w-7 h-7 rounded-lg bg-brand/5 flex items-center justify-center flex-shrink-0">
                    <Tag className="w-3.5 h-3.5 text-brand/50" />
                  </div>
                  {editingId === cat.id ? (
                    <>
                      <input
                        value={editName}
                        onChange={e => setEditName(e.target.value)}
                        onKeyDown={e => { if (e.key === "Enter") saveEdit(cat.id); if (e.key === "Escape") setEditingId(null); }}
                        className="flex-1 border border-brand rounded-lg px-3 py-1 text-sm focus:outline-none"
                        autoFocus
                      />
                      <button onClick={() => saveEdit(cat.id)} className="w-7 h-7 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600 hover:bg-emerald-100">
                        <Check className="w-3.5 h-3.5" />
                      </button>
                      <button onClick={() => setEditingId(null)} className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200">
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </>
                  ) : (
                    <>
                      <span className="flex-1 text-sm font-semibold text-slate-700">{cat.name}</span>
                      <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 px-2 py-0.5 bg-slate-50 rounded-full">{cat.content_type}</span>
                      <button onClick={() => startEdit(cat)} className="w-7 h-7 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400 hover:text-brand hover:bg-brand/5 transition-colors">
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      <button onClick={() => deleteCategory(cat.id)} className="w-7 h-7 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400 hover:text-rose-500 hover:bg-rose-50 transition-colors">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: "Blog Categories", count: rows.filter(r => r.blogCount > 0).length, total: totalBlogs, icon: FileText, href: "/admin/blog" },
            { label: "Guide Categories", count: rows.filter(r => r.guideCount > 0).length, total: totalGuides, icon: BookOpen, href: "/admin/guides" },
            { label: "Case Study Categories", count: rows.filter(r => r.caseStudyCount > 0).length, total: totalCases, icon: Briefcase, href: "/admin/case-studies" },
          ].map(stat => (
            <Link key={stat.label} href={stat.href} className="bg-white rounded-2xl border border-slate-100 p-6 hover:border-brand/30 hover:shadow-sm transition-all group">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-9 h-9 rounded-xl bg-slate-50 flex items-center justify-center group-hover:bg-brand/5 transition-colors">
                  <stat.icon className="w-4 h-4 text-slate-400 group-hover:text-brand transition-colors" />
                </div>
                <span className="text-xs font-bold uppercase tracking-widest text-slate-400">{stat.label}</span>
              </div>
              <p className="text-3xl font-bold text-slate-800">{loading ? "—" : stat.count}</p>
              <p className="text-xs text-slate-400 mt-1">{loading ? "" : `across ${stat.total} items`}</p>
            </Link>
          ))}
        </div>

        {/* Filter + table */}
        <div>
          <div className="flex items-center gap-2 mb-6">
            {(["all", "blog", "guide", "case-study"] as const).map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={cn(
                  "px-4 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-widest border transition-all",
                  filter === f ? "bg-brand border-brand text-white" : "border-slate-200 text-slate-400 hover:border-brand/30 hover:text-brand bg-white"
                )}
              >
                {f === "all" ? "All" : f === "case-study" ? "Case Studies" : f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
            <span className="ml-auto text-xs text-slate-400">{filtered.length} {filtered.length === 1 ? "category" : "categories"} in use</span>
          </div>

          <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
            {loading ? (
              <div className="p-12 text-center">
                <RefreshCw className="w-6 h-6 text-slate-300 animate-spin mx-auto mb-3" />
                <p className="text-sm text-slate-400">Loading categories...</p>
              </div>
            ) : filtered.length === 0 ? (
              <div className="p-12 text-center">
                <Tag className="w-8 h-8 text-slate-200 mx-auto mb-3" />
                <p className="text-sm font-semibold text-slate-400">No categories in use yet</p>
                <p className="text-xs text-slate-300 mt-1">Categories appear here once content is published with a category tag.</p>
              </div>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50">
                    <th className="text-left px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Category</th>
                    <th className="text-center px-4 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Blog</th>
                    <th className="text-center px-4 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Guides</th>
                    <th className="text-center px-4 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Case Studies</th>
                    <th className="text-center px-4 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((row, i) => (
                    <tr key={row.name} className={cn("border-b border-slate-50 hover:bg-slate-50/60 transition-colors", i === filtered.length - 1 && "border-b-0")}>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-7 h-7 rounded-lg bg-brand/5 flex items-center justify-center">
                            <Tag className="w-3.5 h-3.5 text-brand/50" />
                          </div>
                          <span className="font-semibold text-slate-700">{row.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-center">
                        {row.blogCount > 0 ? (
                          <Link href="/admin/blog" className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-blue-50 text-blue-600 text-xs font-bold hover:bg-blue-100 transition-colors">{row.blogCount}</Link>
                        ) : <span className="text-slate-200 text-xs">—</span>}
                      </td>
                      <td className="px-4 py-4 text-center">
                        {row.guideCount > 0 ? (
                          <Link href="/admin/guides" className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-violet-50 text-violet-600 text-xs font-bold hover:bg-violet-100 transition-colors">{row.guideCount}</Link>
                        ) : <span className="text-slate-200 text-xs">—</span>}
                      </td>
                      <td className="px-4 py-4 text-center">
                        {row.caseStudyCount > 0 ? (
                          <Link href="/admin/case-studies" className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-emerald-50 text-emerald-600 text-xs font-bold hover:bg-emerald-100 transition-colors">{row.caseStudyCount}</Link>
                        ) : <span className="text-slate-200 text-xs">—</span>}
                      </td>
                      <td className="px-4 py-4 text-center">
                        <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-slate-100 text-slate-600 text-xs font-bold">{row.total}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

      </div>
    </AdminLayout>
  );
}
