"use client";

import React, { useState, useEffect } from "react";
import { Plus, Trash2, Save, User, Quote, Tag, Image as ImageIcon, Video, ArrowLeft, X } from "lucide-react";
import AdminLayout from "@/components/admin/admin-layout";
import { cn, safeFetch } from "@/lib/utils";
import { API_BASE_URL } from "@/lib/constants";
import { FALLBACK_TESTIMONIALS as SHARED_FALLBACK } from "@/lib/testimonials-data";

// ── Types ─────────────────────────────────────────────────────────────────────
interface Testimonial {
  id?: number;
  name: string;
  role: string;
  company: string;
  industry: string;
  content: string;
  image_url: string;
  category: string;       // service tag
  position: number;
  star_rating: number;
  video_url: string;
  logo_url: string;
  display_context: string; // comma-separated page keys
  visible: boolean;
}

// ── Constants ─────────────────────────────────────────────────────────────────
const CONTENT_TABS = [
  { label: "Blog",         href: "/admin/blog" },
  { label: "Case Studies", href: "/admin/case-studies" },
  { label: "Guides",       href: "/admin/guides" },
  { label: "Testimonials", href: "/admin/testimonials" },
  { label: "Client Logos", href: "/admin/logos" },
  { label: "Authors",      href: "/admin/authors" },
  { label: "Categories",   href: "/admin/categories" },
];

const PAGE_OPTIONS = [
  { value: "homepage",         label: "homepage",    cls: "bg-blue-50 text-blue-600 border-blue-200" },
  { value: "services",         label: "services",    cls: "bg-violet-50 text-violet-600 border-violet-200" },
  { value: "solutions",        label: "solutions",   cls: "bg-emerald-50 text-emerald-600 border-emerald-200" },
  { value: "about",            label: "about",       cls: "bg-amber-50 text-amber-600 border-amber-200" },
  { value: "how-we-work",      label: "how-we-work", cls: "bg-rose-50 text-rose-500 border-rose-200" },
  { value: "testimonials-page",label: "testimonials",cls: "bg-slate-100 text-slate-500 border-slate-200" },
];

const DEFAULT_T = (): Testimonial => ({
  name: "", role: "", company: "", industry: "", content: "",
  image_url: "", category: "", position: 0, star_rating: 5,
  video_url: "", logo_url: "", display_context: "homepage", visible: true,
});

function expandT(raw: Record<string, unknown>): Testimonial {
  return {
    id:              raw.id as number | undefined,
    name:            (raw.name as string) || "",
    role:            (raw.role as string) || "",
    company:         (raw.company as string) || "",
    industry:        (raw.industry as string) || "",
    content:         (raw.content as string) || "",
    image_url:       (raw.image_url as string) || "",
    category:        (raw.category as string) || "",
    position:        Number(raw.position) || 0,
    star_rating:     Number(raw.star_rating) || 5,
    video_url:       (raw.video_url as string) || "",
    logo_url:        (raw.logo_url as string) || "",
    display_context: (raw.display_context as string) || "homepage",
    visible:         raw.visible !== false && raw.visible !== 0 && raw.visible !== "0",
  };
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function AdminTestimonialsPage() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading]           = useState(true);
  const [apiError, setApiError]         = useState(false);
  const [view, setView]                 = useState<"list" | "edit">("list");
  const [editKey, setEditKey]           = useState<string | null>(null);
  const [saving, setSaving]             = useState(false);
  const [savedOk, setSavedOk]           = useState(false);

  // filters
  const [search, setSearch]       = useState("");
  const [serviceFilter, setSvc]   = useState("all");
  const [industryFilter, setInd]  = useState("all");

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      const data = await safeFetch(`${API_BASE_URL}/testimonials.php?admin=1`);
      if (data?.status === "success") {
        const items = Array.isArray(data.data)
          ? data.data
          : (data.data as { items?: unknown[] })?.items ?? [];
        setTestimonials((items as Record<string, unknown>[]).map(expandT));
        setApiError(false);
      } else throw new Error();
    } catch {
      setTestimonials(SHARED_FALLBACK.map(t => expandT(t as unknown as Record<string, unknown>)));
      setApiError(true);
    } finally { setLoading(false); }
  };

  // ── derived ──
  const editIdx = editKey
    ? testimonials.findIndex(t => (t.id ? String(t.id) : `${t.name}-${t.position}`) === editKey)
    : -1;
  const editT = editIdx >= 0 ? testimonials[editIdx] : null;

  const services  = Array.from(new Set(testimonials.map(t => t.category).filter(Boolean)));
  const industries = Array.from(new Set(testimonials.map(t => t.industry).filter(Boolean)));

  const filtered = testimonials.filter(t => {
    if (search && !t.name.toLowerCase().includes(search.toLowerCase()) &&
        !t.company.toLowerCase().includes(search.toLowerCase())) return false;
    if (serviceFilter !== "all" && t.category !== serviceFilter) return false;
    if (industryFilter !== "all" && t.industry !== industryFilter) return false;
    return true;
  });

  // ── actions ──
  const openNew = () => {
    const newIdx = testimonials.length;
    const t: Testimonial = { ...DEFAULT_T(), position: newIdx };
    setTestimonials(prev => [...prev, t]);
    setEditKey(`new-${newIdx}`);
    setView("edit");
  };

  const openEdit = (key: string) => { setEditKey(key); setView("edit"); };

  const updateT = (patch: Partial<Testimonial>) => {
    setTestimonials(prev => {
      const n = [...prev];
      n[editIdx] = { ...n[editIdx], ...patch };
      return n;
    });
  };

  const togglePage = (val: string) => {
    if (!editT) return;
    const pages = new Set(editT.display_context.split(",").map(s => s.trim()).filter(Boolean));
    pages.has(val) ? pages.delete(val) : pages.add(val);
    updateT({ display_context: Array.from(pages).join(",") });
  };

  const saveT = async () => {
    if (!editT) return;
    if (!editT.name.trim()) { alert("Name is required."); return; }
    setSaving(true);
    try {
      const data = await safeFetch(`${API_BASE_URL}/testimonials.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "save_testimonial", testimonial: { ...editT, position: editIdx } }),
      });
      if (data?.status === "success" && (data.data as { id?: number })?.id) {
        updateT({ id: (data.data as { id: number }).id });
      }
      setSavedOk(true); setTimeout(() => setSavedOk(false), 2000);
    } catch { alert("Connection error."); }
    setSaving(false);
  };

  const removeT = async (idx: number) => {
    if (!confirm("Delete this testimonial?")) return;
    const t = testimonials[idx];
    if (t.id) {
      safeFetch(`${API_BASE_URL}/testimonials.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "delete_testimonial", id: t.id }),
      }).catch(() => {});
    }
    setTestimonials(prev => prev.filter((_, i) => i !== idx));
    if (view === "edit") setView("list");
  };

  // ── LOADING ──
  if (loading) return (
    <AdminLayout>
      <div className="p-10 text-slate-400 text-xs font-bold uppercase tracking-widest">Loading…</div>
    </AdminLayout>
  );

  // ── EDIT VIEW ────────────────────────────────────────────────────────────────
  if (view === "edit" && editT && editIdx >= 0) {
    const pages = new Set(editT.display_context.split(",").map(s => s.trim()).filter(Boolean));
    return (
      <AdminLayout>
        <div className="max-w-3xl mx-auto pb-20">

          {/* Back */}
          <button onClick={() => setView("list")}
            className="flex items-center gap-1.5 text-sm font-semibold text-slate-500 hover:text-slate-900 transition-colors mb-6">
            <ArrowLeft className="w-4 h-4" /> Testimonials
          </button>

          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-slate-900">{editT.id ? "Edit Testimonial" : "New Testimonial"}</h1>
            <div className="flex items-center gap-3">
              <button onClick={() => setView("list")}
                className="px-4 py-2 rounded-lg text-sm font-semibold text-slate-600 border border-slate-200 hover:bg-slate-50 transition-all">
                Cancel
              </button>
              <button onClick={saveT} disabled={saving}
                className={cn("px-5 py-2 rounded-lg text-sm font-bold transition-all",
                  savedOk ? "bg-emerald-500 text-white" : "bg-brand text-white hover:bg-brand/90 disabled:opacity-50")}>
                {saving ? "Saving…" : savedOk ? "Saved ✓" : <><Save className="w-3.5 h-3.5 inline mr-1.5" />Save</>}
              </button>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-5 shadow-sm">

            {/* Avatar + Name / Role / Company */}
            <div className="flex items-start gap-5">
              <div className="shrink-0 space-y-1.5">
                <div className="w-16 h-16 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 flex items-center justify-center">
                  {editT.image_url
                    ? <img src={editT.image_url} alt="" className="w-full h-full object-cover" />
                    : <User className="w-6 h-6 text-slate-300" />}
                </div>
                <input type="text" placeholder="Photo URL" value={editT.image_url}
                  onChange={e => updateT({ image_url: e.target.value })}
                  className="w-16 border border-slate-200 rounded-lg px-1.5 py-1 text-[8px] font-mono text-slate-500 focus:outline-none" />
              </div>
              <div className="flex-1 grid grid-cols-2 gap-4">
                <div className="col-span-2 grid grid-cols-3 gap-3">
                  <Field label="Full Name *" value={editT.name} onChange={v => updateT({ name: v })} placeholder="e.g. Sarah Chen" />
                  <Field label="Job Role"   value={editT.role} onChange={v => updateT({ role: v })} placeholder="e.g. COO" />
                  <Field label="Company"    value={editT.company} onChange={v => updateT({ company: v })} placeholder="e.g. Stripe" />
                </div>
                <div className="col-span-2 grid grid-cols-2 gap-3">
                  <Field label="Industry"  value={editT.industry} onChange={v => updateT({ industry: v })} placeholder="e.g. Fintech" />
                  <Field label="Service Tag" value={editT.category} onChange={v => updateT({ category: v })} placeholder="e.g. AUTOMATION" />
                </div>
              </div>
            </div>

            {/* Quote */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide flex items-center gap-1"><Quote className="w-3 h-3" /> Quote</label>
              <textarea rows={3} value={editT.content} onChange={e => updateT({ content: e.target.value })}
                placeholder="What did the client say?"
                className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm text-slate-700 italic focus:outline-none focus:border-brand resize-none" />
            </div>

            {/* Logo + Video */}
            <div className="grid grid-cols-2 gap-4">
              <Field label="Company Logo URL" value={editT.logo_url} onChange={v => updateT({ logo_url: v })} placeholder="https://…" mono />
              <Field label="Video URL (optional)" value={editT.video_url} onChange={v => updateT({ video_url: v })} placeholder="https://…" mono />
            </div>

            {/* Rating + Visible + Order */}
            <div className="flex flex-wrap items-center gap-6 pt-4 border-t border-slate-100">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Rating</span>
                {[1,2,3,4,5].map(n => (
                  <button key={n} type="button" onClick={() => updateT({ star_rating: n })}
                    className={cn("text-lg leading-none transition-colors", n <= editT.star_rating ? "text-amber-400" : "text-slate-200")}>
                    ★
                  </button>
                ))}
              </div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={editT.visible} onChange={e => updateT({ visible: e.target.checked })} className="w-4 h-4 accent-brand rounded" />
                <span className="text-sm text-slate-700 font-medium">Visible on /testimonials page</span>
              </label>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Order</span>
                <input type="number" value={editT.position} onChange={e => updateT({ position: Number(e.target.value) })}
                  className="w-16 border border-slate-200 rounded-lg px-2 py-1.5 text-sm text-center focus:outline-none focus:border-brand" />
              </div>
            </div>

            {/* Pages */}
            <div className="space-y-2 pt-4 border-t border-slate-100">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Show on pages</span>
              <div className="flex flex-wrap gap-2">
                {PAGE_OPTIONS.map(opt => {
                  const active = pages.has(opt.value);
                  return (
                    <button key={opt.value} type="button" onClick={() => togglePage(opt.value)}
                      className={cn("px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all",
                        active ? opt.cls : "bg-white border-slate-200 text-slate-400 hover:border-slate-300")}>
                      {opt.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </AdminLayout>
    );
  }

  // ── LIST VIEW ────────────────────────────────────────────────────────────────
  return (
    <AdminLayout>
      <div className="pb-20 max-w-[1200px] mx-auto">

        {/* Content-type tabs */}
        <div className="flex items-center gap-0 border-b border-slate-200 mb-6 overflow-x-auto scrollbar-none">
          {CONTENT_TABS.map(tab => (
            <a key={tab.href} href={tab.href}
              className={cn("px-4 py-2.5 text-sm font-semibold border-b-2 -mb-px transition-colors whitespace-nowrap",
                tab.href === "/admin/testimonials"
                  ? "border-brand text-brand"
                  : "border-transparent text-slate-500 hover:text-slate-800"
              )}>
              {tab.label}
            </a>
          ))}
        </div>

        {/* API error banner */}
        {apiError && (
          <div className="flex items-center gap-3 px-5 py-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs font-medium mb-5">
            <span className="w-2 h-2 rounded-full bg-amber-400 flex-shrink-0" />
            <span><strong>API offline</strong> — showing demo testimonials.</span>
            <button onClick={() => { setLoading(true); fetchData(); }} className="ml-auto text-amber-700 font-bold underline underline-offset-2 hover:no-underline">Retry</button>
          </div>
        )}

        {/* Header */}
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-2xl font-bold text-slate-900">Testimonials</h1>
          <button onClick={openNew}
            className="flex items-center gap-2 bg-brand text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-brand/90 transition-all shadow-sm">
            <Plus className="w-4 h-4" /> New Testimonial
          </button>
        </div>

        {/* Legend */}
        <p className="text-xs text-slate-400 mb-5">
          <strong className="text-slate-500">Pages</strong> = which site pages display this testimonial.{" "}
          <strong className="text-slate-500">Visible</strong> = shown on the /testimonials listing page.
        </p>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3 mb-5">
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search…"
            className="h-9 border border-slate-200 rounded-lg px-3 text-sm focus:outline-none focus:border-brand bg-white w-44" />
          <select value={serviceFilter} onChange={e => setSvc(e.target.value)}
            className="h-9 border border-slate-200 rounded-lg px-3 text-sm focus:outline-none focus:border-brand bg-white text-slate-600">
            <option value="all">All services</option>
            {services.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          <select value={industryFilter} onChange={e => setInd(e.target.value)}
            className="h-9 border border-slate-200 rounded-lg px-3 text-sm focus:outline-none focus:border-brand bg-white text-slate-600">
            <option value="all">All industries</option>
            {industries.map(i => <option key={i} value={i}>{i}</option>)}
          </select>
        </div>

        {/* Table */}
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
          {filtered.length === 0 ? (
            <div className="py-20 text-center text-slate-400 text-sm font-semibold">
              {search || serviceFilter !== "all" || industryFilter !== "all"
                ? "No matching testimonials"
                : "No testimonials yet — click \"+ New Testimonial\" to begin"}
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/60">
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Name</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide hidden md:table-cell">Company</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide hidden lg:table-cell">Service</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide hidden lg:table-cell">Industry</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Rating</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide hidden xl:table-cell">Pages</th>
                  <th className="text-center px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Visible</th>
                  <th className="text-center px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide hidden md:table-cell">Order</th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((t, fi) => {
                  const realIdx = testimonials.indexOf(t);
                  const key = t.id ? String(t.id) : `${t.name}-${realIdx}`;
                  const pages = t.display_context.split(",").map(s => s.trim()).filter(Boolean);
                  return (
                    <tr key={key} className="border-b border-slate-100 last:border-0 hover:bg-slate-50/40 transition-colors">
                      <td className="px-4 py-3">
                        <p className="font-semibold text-slate-800">{t.name || "—"}</p>
                        <p className="text-xs text-slate-400">{t.role || ""}</p>
                      </td>
                      <td className="px-4 py-3 hidden md:table-cell text-slate-600">{t.company || "—"}</td>
                      <td className="px-4 py-3 hidden lg:table-cell">
                        {t.category
                          ? <span className="text-xs font-bold text-slate-500 uppercase">{t.category}</span>
                          : <span className="text-slate-300">—</span>}
                      </td>
                      <td className="px-4 py-3 hidden lg:table-cell text-slate-600 text-xs">{t.industry || <span className="text-slate-300">—</span>}</td>
                      <td className="px-4 py-3">
                        <span className="text-amber-400 text-sm">{"★".repeat(t.star_rating)}</span>
                      </td>
                      <td className="px-4 py-3 hidden xl:table-cell">
                        <div className="flex flex-wrap gap-1">
                          {pages.length === 0
                            ? <span className="text-[10px] text-slate-300">none</span>
                            : pages.map(p => {
                                const opt = PAGE_OPTIONS.find(o => o.value === p);
                                return (
                                  <span key={p} className={cn("px-1.5 py-0.5 rounded text-[10px] font-semibold border", opt?.cls ?? "bg-slate-100 text-slate-500 border-slate-200")}>
                                    {opt?.label ?? p}
                                  </span>
                                );
                              })}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <input type="checkbox" checked={t.visible} readOnly
                          className="w-4 h-4 accent-brand rounded cursor-default" />
                      </td>
                      <td className="px-4 py-3 text-center hidden md:table-cell text-slate-500">{t.position}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-3">
                          <button onClick={() => openEdit(key)}
                            className="text-xs font-semibold text-brand hover:underline">Edit</button>
                          <button onClick={() => removeT(realIdx)}
                            className="text-xs font-semibold text-rose-500 hover:underline">Delete</button>
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

// ── Field helper ──────────────────────────────────────────────────────────────
function Field({ label, value, onChange, placeholder = "", mono = false }: {
  label: string; value: string; onChange: (v: string) => void;
  placeholder?: string; mono?: boolean;
}) {
  return (
    <div className="space-y-1">
      <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide block">{label}</label>
      <input type="text" value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
        className={cn("w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-brand",
          mono ? "font-mono text-xs" : "")} />
    </div>
  );
}
