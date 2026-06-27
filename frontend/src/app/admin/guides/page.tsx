"use client";
import React, { useState, useEffect, useRef } from "react";
import {
  Plus, Trash2, MoveUp, MoveDown,
  Image as ImageIcon, Upload,
  ChevronDown, ChevronUp,
  ArrowLeft, Eye, Pencil, Search,
} from "lucide-react";
import { safeFetch, cn, uploadFile } from "@/lib/utils";
import { API_BASE_URL } from "@/lib/constants";
import AdminLayout from "@/components/admin/admin-layout";
import RichBodyEditor from "@/components/admin/rich-body-editor";

// ── Types ─────────────────────────────────────────────────────────────────────
interface Chapter { title: string; desc: string; }

interface Guide {
  id?: number;
  title: string;
  slug: string;
  subtitle: string;
  description: string;
  content: string;
  image_url: string;
  image_size: "sm" | "md" | "lg";
  category: string;
  cta_label: string;
  cta_link: string;
  file_url: string;
  pages_count: string;
  format: string;
  chapters: Chapter[];
  benefits: string[];
  position: number;
  meta_title: string;
  meta_description: string;
  status: "published" | "draft" | "scheduled";
  published_at: string;
  scheduled_at: string;
  author_name: string;
}

function slugify(s: string) {
  return s.toLowerCase().trim().replace(/[^a-z0-9-]+/g, "-").replace(/^-+|-+$/, "");
}

function serializeContent(g: Guide): string {
  return JSON.stringify({
    subtitle:     g.subtitle,
    file_url:     g.file_url,
    pages_count:  g.pages_count,
    format:       g.format,
    image_size:   g.image_size,
    chapters:     g.chapters,
    benefits:     g.benefits,
  });
}

function expandGuide(raw: Record<string, unknown>): Guide {
  let s: Record<string, unknown> = {};
  try { s = JSON.parse((raw.content as string) || "{}"); } catch {}
  return {
    ...raw,
    subtitle:    s.subtitle    ?? raw.subtitle    ?? "",
    file_url:    s.file_url    ?? raw.file_url    ?? "",
    pages_count: s.pages_count ?? raw.pages_count ?? "",
    format:      s.format      ?? raw.format      ?? "PDF",
    image_size:  s.image_size  ?? raw.image_size  ?? "md",
    chapters:    s.chapters    ?? raw.chapters     ?? [],
    benefits:    s.benefits    ?? raw.benefits     ?? [],
    meta_title:       raw.meta_title       ?? "",
    meta_description: raw.meta_description ?? "",
    status:       ((raw.status as string) || "draft") as Guide["status"],
    author_name:  (raw.author_name  as string) || "Digi Pexel Team",
    published_at: (raw.published_at as string) ?? "",
    scheduled_at: (raw.scheduled_at as string) ?? "",
  } as Guide;
}

// ── Defaults ──────────────────────────────────────────────────────────────────
const defaultGuide = (): Guide => ({
  title: "", slug: "",
  subtitle: "", description: "", content: "",
  image_url: "", image_size: "md", category: "Strategy",
  cta_label: "Download the Guide", cta_link: "#",
  file_url: "", pages_count: "", format: "PDF",
  chapters: [], benefits: [], position: 0,
  meta_title: "", meta_description: "",
  status: "published",
  published_at: new Date().toISOString().slice(0, 10),
  scheduled_at: "",
  author_name: "Digi Pexel Team",
});

// ── Seed fallback ─────────────────────────────────────────────────────────────
const SEED_GUIDES: Guide[] = [
  { id: 1, title: "The AI Automation Roadmap: A 12-Month Playbook for B2B Teams", slug: "ai-automation-roadmap-12-month", subtitle: "Step-by-step framework for deploying AI workflows", description: "A step-by-step framework for auditing your operations, identifying high-ROI automation opportunities, and building a deployment plan.", content: "", image_url: "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=800", image_size: "md", category: "Strategy", cta_label: "Download the Roadmap", cta_link: "#", file_url: "", pages_count: "42", format: "PDF", chapters: [{ title: "Why Automation Projects Fail", desc: "The 5 common mistakes and how to avoid them." }], benefits: ["Identify your top automation opportunities"], position: 0, meta_title: "", meta_description: "", status: "published", published_at: "2025-01-15", scheduled_at: "", author_name: "Digi Pexel Team" },
  { id: 2, title: "GEO vs SEO: The Complete Guide to Getting Your Brand Cited by AI", slug: "geo-vs-seo-ai-citation-guide", subtitle: "Win in the AI answer era", description: "Everything B2B marketing leaders need to know about Generative Engine Optimisation.", content: "", image_url: "https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?auto=format&fit=crop&q=80&w=800", image_size: "md", category: "SEO", cta_label: "Download the Guide", cta_link: "#", file_url: "", pages_count: "44", format: "PDF", chapters: [{ title: "Why GEO Matters Now", desc: "How AI search is replacing traditional rankings." }], benefits: ["Understand why your content gets cited by AI"], position: 1, meta_title: "", meta_description: "", status: "published", published_at: "2025-02-10", scheduled_at: "", author_name: "Digi Pexel Team" },
];

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function AdminGuidesPage() {
  const [guides, setGuides]   = useState<Guide[]>([]);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState(false);
  const [saving, setSaving]   = useState(false);
  const [view, setView]       = useState<"list" | "edit">("list");
  const [editKey, setEditKey] = useState<string | null>(null);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [search, setSearch]   = useState("");
  const [catFilter, setCatFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState<"all" | "published" | "draft" | "scheduled">("all");
  const [sort, setSort] = useState<"newest" | "oldest" | "az" | "za">("newest");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo]     = useState("");

  useEffect(() => { fetchGuides(); }, []);

  const fetchGuides = async () => {
    try {
      const data = await safeFetch(`${API_BASE_URL}/guides.php?admin=1`);
      if (data?.status === "success") { setGuides((data.data as Record<string, unknown>[]).map(expandGuide)); setApiError(false); }
      else { setGuides(SEED_GUIDES); setApiError(true); }
    } catch { setGuides(SEED_GUIDES); setApiError(true); }
    finally { setLoading(false); }
  };

  const editIdx = editKey ? guides.findIndex(g => (g.id ? String(g.id) : g.slug) === editKey) : -1;
  const editGuide = editIdx >= 0 ? guides[editIdx] : null;

  const openNew = () => {
    const ng = defaultGuide();
    const key = "new-" + Date.now();
    ng.slug = key;
    setGuides(prev => [ng, ...prev]);
    setEditKey(key);
    setShowAdvanced(false);
    setView("edit");
  };

  const openEdit = (key: string) => {
    setEditKey(key);
    setShowAdvanced(false);
    setView("edit");
  };

  const updateGuide = (idx: number, patch: Partial<Guide>) => {
    setGuides(prev => { const n = [...prev]; n[idx] = { ...n[idx], ...patch }; return n; });
  };

  const removeGuide = (idx: number) => {
    if (!confirm("Delete this guide?")) return;
    const g = guides[idx];
    if (g.id) {
      fetch(`${API_BASE_URL}/guides.php`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "delete_guide", id: g.id }) });
    }
    setGuides(prev => prev.filter((_, i) => i !== idx));
    if (view === "edit") setView("list");
  };

  const saveGuide = async () => {
    if (!editGuide || editIdx < 0) return;
    if (!editGuide.title.trim()) { alert("Title is required."); return; }
    setSaving(true);
    try {
      const payload = { ...editGuide, content: serializeContent(editGuide) };
      const data = await safeFetch(`${API_BASE_URL}/guides.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "save_guide", guide: payload }),
      });
      if (data?.status === "success") {
        if (!editGuide.id && data.id) updateGuide(editIdx, { id: data.id as number });
        alert("Saved successfully!");
      } else { alert("Save failed: " + (data?.message ?? "Unknown error")); }
    } catch { alert("Connection error."); }
    finally { setSaving(false); }
  };

  const categories = Array.from(new Set(guides.map(g => g.category).filter(Boolean)));

  const filtered = [...guides.filter(g => {
    if (!g.title.toLowerCase().includes(search.toLowerCase())) return false;
    if (catFilter !== "all" && g.category !== catFilter) return false;
    if (statusFilter !== "all" && (g.status || "draft") !== statusFilter) return false;
    if (dateFrom && g.published_at && g.published_at < dateFrom) return false;
    if (dateTo   && g.published_at && g.published_at > dateTo)   return false;
    return true;
  })].sort((a, b) => {
    if (sort === "newest") return (b.published_at || "").localeCompare(a.published_at || "");
    if (sort === "oldest") return (a.published_at || "").localeCompare(b.published_at || "");
    if (sort === "az") return a.title.localeCompare(b.title);
    if (sort === "za") return b.title.localeCompare(a.title);
    return 0;
  });

  if (loading) return <AdminLayout><div className="p-10 text-slate-400 text-xs font-bold uppercase tracking-widest">Loading…</div></AdminLayout>;

  // ── EDIT VIEW ────────────────────────────────────────────────────────────────
  if (view === "edit" && editGuide && editIdx >= 0) {
    const g = editGuide;
    const idx = editIdx;
    const isNew = !g.id;

    return (
      <AdminLayout>
        <div className="pb-32 max-w-6xl mx-auto">

          {/* Top bar */}
          <div className="flex items-center gap-3 mb-8 flex-wrap">
            <button onClick={() => setView("list")} className="flex items-center gap-1.5 text-sm font-semibold text-slate-500 hover:text-slate-900 transition-colors">
              <ArrowLeft className="w-4 h-4" /> Guides
            </button>
            <span className="text-slate-300">/</span>
            <span className="text-sm text-slate-700 truncate max-w-xs">{g.title || (isNew ? "New Guide" : "Edit Guide")}</span>
            <div className="ml-auto flex items-center gap-2">
              <button onClick={() => setView("list")} className="px-4 py-2 text-sm text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
                Cancel <kbd className="text-[10px] text-slate-400 ml-1">Esc</kbd>
              </button>
              <a href={`/guides/${g.id ?? g.slug}`} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-4 py-2 text-sm text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
                <Eye className="w-3.5 h-3.5" /> Preview
              </a>
              <button onClick={saveGuide} disabled={saving}
                className="flex items-center gap-2 px-5 py-2 bg-slate-900 text-white text-sm font-semibold rounded-lg hover:bg-slate-800 transition-all disabled:opacity-50">
                {isNew ? "Create Guide" : "Save Guide"}
              </button>
            </div>
          </div>

          {/* Form — two-column layout */}
          <div className="grid grid-cols-3 gap-8 items-start">

            {/* ── LEFT: Writing area ────────────────────────────────────────── */}
            <div className="col-span-2 space-y-5">

              {/* Title + Slug */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Title <span className="text-red-500">*</span></label>
                <input value={g.title} onChange={e => updateGuide(idx, { title: e.target.value, slug: g.id ? g.slug : slugify(e.target.value) })}
                  placeholder="Guide title"
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 text-lg font-semibold focus:outline-none focus:border-brand bg-white placeholder:text-slate-300" />
                <input value={g.slug} onChange={e => updateGuide(idx, { slug: e.target.value })}
                  className="w-full border-0 border-b border-slate-100 px-4 py-1.5 text-xs font-mono text-slate-400 focus:outline-none focus:border-brand bg-transparent" placeholder="slug" />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Description</label>
                <textarea value={g.description} onChange={e => updateGuide(idx, { description: e.target.value })}
                  placeholder="Short summary shown in guide listings…" rows={3}
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand bg-white resize-none placeholder:text-slate-300" />
              </div>

              {/* Body */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Body <span className="text-red-500">*</span></label>
                <RichBodyEditor value={g.content} onChange={v => updateGuide(idx, { content: v })} />
              </div>

              {/* Chapters */}
              <div className="border border-slate-200 rounded-2xl overflow-hidden">
                <div className="px-5 py-3.5 bg-slate-50 border-b border-slate-200">
                  <p className="text-xs font-black uppercase tracking-widest text-slate-500">Chapters / Sections <span className="text-slate-300 font-normal ml-1">({g.chapters.length})</span></p>
                </div>
                {g.chapters.length > 0 && (
                  <div className="p-4 space-y-2">
                    {g.chapters.map((ch, ci) => (
                      <div key={ci} className="border border-slate-200 rounded-xl p-3 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Chapter {ci + 1}</span>
                          <div className="flex gap-1">
                            <button onClick={() => { if(ci===0) return; const c=[...g.chapters];[c[ci],c[ci-1]]=[c[ci-1],c[ci]];updateGuide(idx,{chapters:c}); }} className="p-1 rounded bg-slate-100 text-slate-400 hover:text-brand"><MoveUp className="w-3 h-3"/></button>
                            <button onClick={() => { if(ci===g.chapters.length-1) return; const c=[...g.chapters];[c[ci],c[ci+1]]=[c[ci+1],c[ci]];updateGuide(idx,{chapters:c}); }} className="p-1 rounded bg-slate-100 text-slate-400 hover:text-brand"><MoveDown className="w-3 h-3"/></button>
                            <button onClick={() => updateGuide(idx,{chapters:g.chapters.filter((_,i)=>i!==ci)})} className="p-1 rounded bg-red-50 text-red-400 hover:bg-red-500 hover:text-white"><Trash2 className="w-3 h-3"/></button>
                          </div>
                        </div>
                        <Field label="Chapter Title" value={ch.title} onChange={v=>{const c=[...g.chapters];c[ci]={...c[ci],title:v};updateGuide(idx,{chapters:c});}} placeholder="Introduction to AI Automation" />
                        <Field label="Description" value={ch.desc} onChange={v=>{const c=[...g.chapters];c[ci]={...c[ci],desc:v};updateGuide(idx,{chapters:c});}} placeholder="What readers will learn…" />
                      </div>
                    ))}
                  </div>
                )}
                <div className="px-4 py-3 border-t border-slate-100">
                  <button onClick={() => updateGuide(idx,{chapters:[...g.chapters,{title:"",desc:""}]})} className="flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 border-dashed border-slate-200 text-xs font-bold text-slate-400 hover:border-brand hover:text-brand transition-all w-full justify-center">
                    <Plus className="w-3.5 h-3.5" /> Add Chapter
                  </button>
                </div>
              </div>

              {/* Benefits */}
              <div className="border border-slate-200 rounded-2xl overflow-hidden">
                <div className="px-5 py-3.5 bg-slate-50 border-b border-slate-200">
                  <p className="text-xs font-black uppercase tracking-widest text-slate-500">Key Benefits / Takeaways</p>
                </div>
                {g.benefits.length > 0 && (
                  <div className="p-4 space-y-2">
                    {g.benefits.map((b, bi) => (
                      <div key={bi} className="flex gap-2">
                        <input value={b} onChange={e=>{const bens=[...g.benefits];bens[bi]=e.target.value;updateGuide(idx,{benefits:bens});}} placeholder="Identify your top automation opportunities" className="flex-1 border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-brand bg-white" />
                        <button onClick={() => updateGuide(idx,{benefits:g.benefits.filter((_,i)=>i!==bi)})} className="p-2.5 rounded-xl bg-red-50 text-red-400 hover:bg-red-500 hover:text-white"><Trash2 className="w-3.5 h-3.5"/></button>
                      </div>
                    ))}
                  </div>
                )}
                <div className="px-4 py-3 border-t border-slate-100">
                  <button onClick={() => updateGuide(idx,{benefits:[...g.benefits,""]})} className="flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 border-dashed border-slate-200 text-xs font-bold text-slate-400 hover:border-brand hover:text-brand transition-all w-full justify-center">
                    <Plus className="w-3.5 h-3.5" /> Add Benefit
                  </button>
                </div>
              </div>

            </div>

            {/* ── RIGHT: Sidebar ────────────────────────────────────────────── */}
            <div className="col-span-1 space-y-4 sticky top-4">

              {/* Publishing */}
              <div className="border border-slate-200 rounded-2xl bg-white overflow-hidden">
                <div className="px-4 py-3 bg-slate-50 border-b border-slate-200">
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Publishing</p>
                </div>
                <div className="p-4 space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-1">Status</label>
                    <select value={g.status || "draft"} onChange={e => updateGuide(idx, { status: e.target.value as Guide["status"] })}
                      className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-brand bg-white">
                      <option value="draft">Draft</option>
                      <option value="published">Published</option>
                      <option value="scheduled">Scheduled</option>
                    </select>
                  </div>
                  {g.status === "scheduled" && (
                    <div>
                      <label className="block text-xs font-semibold text-slate-500 mb-1">Scheduled Date &amp; Time</label>
                      <input type="datetime-local" value={g.scheduled_at || ""} onChange={e => updateGuide(idx, { scheduled_at: e.target.value })}
                        className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-brand bg-white" />
                    </div>
                  )}
                  <Field label="Publish Date" value={g.published_at} type="date" onChange={v => updateGuide(idx, { published_at: v })} />
                  <Field label="Author Name" value={g.author_name} onChange={v => updateGuide(idx, { author_name: v })} placeholder="Digi Pexel Team" />
                  <Field label="Position (order)" value={String(g.position)} type="number" onChange={v => updateGuide(idx, { position: Number(v) })} />
                </div>
              </div>

              {/* Cover Image */}
              <div className="border border-slate-200 rounded-2xl bg-white overflow-hidden">
                <div className="px-4 py-3 bg-slate-50 border-b border-slate-200">
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Cover Image</p>
                </div>
                <div className="p-4 space-y-3">
                  <UploadImageField label="" value={g.image_url} onChange={v => updateGuide(idx, { image_url: v })} />
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-1">Display Size</label>
                    <select value={g.image_size} onChange={e => updateGuide(idx, { image_size: e.target.value as Guide["image_size"] })}
                      className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-brand bg-white">
                      <option value="sm">Small</option>
                      <option value="md">Medium</option>
                      <option value="lg">Large</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Details */}
              <div className="border border-slate-200 rounded-2xl bg-white overflow-hidden">
                <div className="px-4 py-3 bg-slate-50 border-b border-slate-200">
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Details</p>
                </div>
                <div className="p-4 space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-1">Category</label>
                    <input list="guide-cats" value={g.category} onChange={e => updateGuide(idx, { category: e.target.value })}
                      placeholder="Strategy, SEO, Operations…"
                      className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-brand bg-white placeholder:text-slate-300" />
                    <datalist id="guide-cats">{categories.map(c => <option key={c} value={c} />)}</datalist>
                  </div>
                  <Field label="Subtitle" value={g.subtitle} onChange={v => updateGuide(idx, { subtitle: v })} placeholder="A hook line shown under the title" />
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-1">Format</label>
                    <select value={g.format} onChange={e => updateGuide(idx, { format: e.target.value })}
                      className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-brand bg-white">
                      <option value="PDF">PDF</option>
                      <option value="Video">Video</option>
                      <option value="Spreadsheet">Spreadsheet</option>
                      <option value="Template">Template</option>
                    </select>
                  </div>
                  <Field label="Pages / Length" value={g.pages_count} onChange={v => updateGuide(idx, { pages_count: v })} placeholder="42" />
                </div>
              </div>

              {/* Download & CTA */}
              <div className="border border-slate-200 rounded-2xl bg-white overflow-hidden">
                <div className="px-4 py-3 bg-slate-50 border-b border-slate-200">
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Download &amp; CTA</p>
                </div>
                <div className="p-4 space-y-3">
                  <Field label="Download / File URL" value={g.file_url} onChange={v => updateGuide(idx, { file_url: v })} placeholder="https://…" />
                  <Field label="CTA Button Label" value={g.cta_label} onChange={v => updateGuide(idx, { cta_label: v })} placeholder="Download the Guide" />
                  <Field label="CTA Button Link" value={g.cta_link} onChange={v => updateGuide(idx, { cta_link: v })} placeholder="#" />
                </div>
              </div>

              {/* SEO */}
              <div className="border border-slate-200 rounded-2xl bg-white overflow-hidden">
                <div className="px-4 py-3 bg-slate-50 border-b border-slate-200">
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">SEO</p>
                </div>
                <div className="p-4 space-y-3">
                  <Field label="Meta Title" value={g.meta_title} onChange={v => updateGuide(idx, { meta_title: v })} placeholder="SEO page title (defaults to title)" />
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-1">Meta Description</label>
                    <textarea value={g.meta_description} onChange={e => updateGuide(idx, { meta_description: e.target.value })}
                      placeholder="150–160 characters for search engines…" rows={3}
                      className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-brand bg-white resize-none placeholder:text-slate-300" />
                  </div>
                </div>
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
      <div className="pb-20 max-w-6xl mx-auto">

        {apiError && (
          <div className="flex items-center gap-3 px-5 py-3 rounded-2xl bg-amber-50 border border-amber-200 text-amber-800 text-xs font-medium mb-6">
            <span className="w-2 h-2 rounded-full bg-amber-400 flex-shrink-0" />
            <span><strong>API offline</strong> — showing demo guides. Deploy the backend or check your connection to load live data.</span>
            <button onClick={() => { setLoading(true); fetchGuides(); }} className="ml-auto text-amber-700 font-bold underline underline-offset-2 hover:no-underline">Retry</button>
          </div>
        )}

        {/* Content-type tabs */}
        <div className="flex items-center gap-0 border-b border-slate-200 mb-6 overflow-x-auto scrollbar-none">
          {[
            { label: "Blog", href: "/admin/blog" },
            { label: "Case Studies", href: "/admin/case-studies" },
            { label: "Guides", href: "/admin/guides" },
            { label: "Testimonials", href: "/admin/testimonials" },
            { label: "Client Logos", href: "/admin/logos" },
            { label: "Authors", href: "/admin/authors" },
            { label: "Categories", href: "/admin/categories" },
          ].map(tab => (
            <a key={tab.href} href={tab.href}
              className={cn("px-4 py-2.5 text-sm font-semibold border-b-2 -mb-px transition-colors",
                tab.href === "/admin/guides"
                  ? "border-brand text-brand"
                  : "border-transparent text-slate-500 hover:text-slate-800"
              )}>
              {tab.label}
            </a>
          ))}
        </div>

        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <h1 className="text-2xl font-display font-bold text-slate-900">Guides</h1>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search guides…"
                className="pl-9 pr-4 h-9 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-brand bg-white w-52" />
            </div>
            <button onClick={openNew}
              className="flex items-center gap-2 bg-brand text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-brand/90 transition-all shadow-sm">
              + New Guide
            </button>
          </div>
        </div>

        {/* Status tabs + advanced filters */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
          <div className="flex items-center gap-1 bg-slate-100 rounded-lg p-1">
            {(["all", "draft", "published", "scheduled"] as const).map(s => (
              <button key={s} onClick={() => setStatusFilter(s)}
                className={cn("px-3 py-1.5 rounded-md text-xs font-semibold capitalize transition-all",
                  statusFilter === s ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"
                )}>
                {s === "all" ? "All" : s.charAt(0).toUpperCase() + s.slice(1)}
              </button>
            ))}
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <select value={catFilter} onChange={e => setCatFilter(e.target.value)}
              className="h-8 border border-slate-200 rounded-lg px-2 text-xs focus:outline-none focus:border-brand bg-white text-slate-600">
              <option value="all">All categories</option>
              {categories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <select value={sort} onChange={e => setSort(e.target.value as typeof sort)}
              className="h-8 border border-slate-200 rounded-lg px-2 text-xs focus:outline-none focus:border-brand bg-white text-slate-600">
              <option value="newest">Newest first</option>
              <option value="oldest">Oldest first</option>
              <option value="az">Title A→Z</option>
              <option value="za">Title Z→A</option>
            </select>
            <span className="text-xs text-slate-400">From</span>
            <input type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)} className="h-8 border border-slate-200 rounded-lg px-2 text-xs focus:outline-none focus:border-brand bg-white" />
            <span className="text-xs text-slate-400">to</span>
            <input type="date" value={dateTo} onChange={e => setDateTo(e.target.value)} className="h-8 border border-slate-200 rounded-lg px-2 text-xs focus:outline-none focus:border-brand bg-white" />
          </div>
        </div>

        {/* Table */}
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
          {filtered.length === 0 ? (
            <div className="py-20 text-center text-slate-400 text-sm font-semibold">
              {search || statusFilter !== "all" || catFilter !== "all" || dateFrom || dateTo ? "No matching guides" : "No guides yet — click \"+ New Guide\" to begin"}
            </div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/60">
                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wide">Title</th>
                  <th className="text-left px-4 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wide hidden md:table-cell">Category</th>
                  <th className="text-left px-4 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wide">Status</th>
                  <th className="text-left px-4 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wide hidden md:table-cell">Author</th>
                  <th className="text-left px-4 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wide hidden lg:table-cell">Published At</th>
                  <th className="text-left px-4 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wide hidden lg:table-cell">Scheduled At</th>
                  <th className="text-right px-5 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wide">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(g => {
                  const realIdx = guides.indexOf(g);
                  const key = g.id ? String(g.id) : g.slug;
                  return (
                    <tr key={key} className="border-b border-slate-100 last:border-0 hover:bg-slate-50/40 transition-colors">
                      <td className="px-5 py-3.5">
                        <span className="text-sm font-medium text-slate-800 block truncate max-w-[280px]">{g.title || "Untitled"}</span>
                        <span className="text-xs text-slate-400 font-mono">{g.slug}</span>
                      </td>
                      <td className="px-4 py-3.5 hidden md:table-cell text-xs text-slate-500">{g.category || "—"}</td>
                      <td className="px-4 py-3.5">
                        <span className={cn(
                          "text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wide",
                          g.status === "published" ? "bg-emerald-100 text-emerald-700"
                            : g.status === "scheduled" ? "bg-blue-100 text-blue-700"
                            : "bg-amber-100 text-amber-700"
                        )}>
                          {g.status || "draft"}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 hidden md:table-cell text-xs text-slate-500">{g.author_name || "Digi Pexel Team"}</td>
                      <td className="px-4 py-3.5 hidden lg:table-cell text-xs text-slate-500">
                        {g.published_at ? new Date(g.published_at).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) : "—"}
                      </td>
                      <td className="px-4 py-3.5 hidden lg:table-cell text-xs text-slate-500">
                        {g.scheduled_at ? new Date(g.scheduled_at).toLocaleString("en-IN", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" }) : "—"}
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center justify-end gap-1">
                          <a href={`/guides/${g.id ?? g.slug}`} target="_blank" rel="noopener noreferrer" className="p-1.5 rounded-lg text-slate-400 hover:text-brand hover:bg-brand/8 transition-all"><Eye className="w-4 h-4" /></a>
                          <button onClick={() => openEdit(key)} className="p-1.5 rounded-lg text-slate-400 hover:text-brand hover:bg-brand/8 transition-all"><Pencil className="w-4 h-4" /></button>
                          <button onClick={() => removeGuide(realIdx)} className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all"><Trash2 className="w-4 h-4" /></button>
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

// ── Field helpers ──────────────────────────────────────────────────────────────
function Field({ label, value, onChange, placeholder="", type="text", mono=false, large=false, textarea=false, rows=3 }: {
  label: string; value: string; onChange: (v: string) => void;
  placeholder?: string; type?: string; mono?: boolean; large?: boolean; textarea?: boolean; rows?: number;
}) {
  const cls = `w-full border border-slate-200 rounded-2xl px-4 py-3 focus:outline-none focus:border-brand transition-colors bg-white placeholder:text-slate-300 ${mono?"font-mono text-xs":large?"text-base font-bold":"text-sm"}`;
  return (
    <div className="space-y-1">
      {label && <label className="field-label">{label}</label>}
      {textarea ? <textarea value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder} rows={rows} className={cls+" resize-none"}/> : <input type={type} value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder} className={cls}/>}
    </div>
  );
}

function UploadImageField({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  const [mode, setMode] = React.useState<"url"|"upload">("url");
  const [uploading, setUploading] = React.useState(false);
  const [uploadErr, setUploadErr] = React.useState("");
  const fileRef = useRef<HTMLInputElement>(null);
  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5*1024*1024) { alert("Image must be under 5 MB."); return; }
    setUploading(true);
    setUploadErr("");
    const fd = new FormData();
    fd.append("file", file);
    const res = await uploadFile(`${API_BASE_URL}/upload.php`, fd);
    setUploading(false);
    if (res.status === "success" && res.url) {
      onChange(res.url as string);
    } else {
      setUploadErr((res.message as string) || "Upload failed — check file type (JPG, PNG, WebP)");
    }
  };
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="field-label">{label}</label>
        <div className="flex gap-0.5 p-1 bg-slate-100 rounded-xl">
          {(["url","upload"] as const).map(m=>(
            <button key={m} type="button" onClick={()=>setMode(m)} className={cn("px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all",mode===m?"bg-white text-brand shadow-sm":"text-slate-400 hover:text-slate-600")}>
              {m==="url"?"URL":"Upload"}
            </button>
          ))}
        </div>
      </div>
      <div className="flex gap-4 items-start">
        <div className="w-20 h-14 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 flex-shrink-0 flex items-center justify-center">
          {value ? <img src={value} alt="" className="w-full h-full object-cover" onError={e=>{(e.target as HTMLImageElement).style.display="none";}} /> : <ImageIcon className="w-5 h-5 text-slate-300"/>}
        </div>
        <div className="flex-1">
          {mode==="url" ? (
            <input type="text" value={value} onChange={e=>onChange(e.target.value)} placeholder="https://images.unsplash.com/…" className="w-full border border-slate-200 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:border-brand bg-white placeholder:text-slate-300"/>
          ) : (
            <div className="space-y-1">
              <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFile}/>
              <button type="button" disabled={uploading} onClick={()=>fileRef.current?.click()} className="w-full border-2 border-dashed border-slate-200 rounded-2xl px-4 py-4 text-xs font-bold text-slate-400 hover:border-brand hover:text-brand transition-all flex items-center gap-2 justify-center disabled:opacity-50">
                <Upload className="w-4 h-4"/> {uploading ? "Uploading…" : "Click to upload from device"} {!uploading && <span className="font-normal text-slate-300">— JPG, PNG, WebP, max 5 MB</span>}
              </button>
              {value && <p className="text-[10px] text-emerald-600 font-semibold">✓ Uploaded: {value.split("/").pop()}</p>}
              {uploadErr && <p className="text-[10px] text-red-500 font-semibold">✗ {uploadErr}</p>}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
