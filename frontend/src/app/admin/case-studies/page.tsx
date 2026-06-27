"use client";
import { API_BASE_URL } from "@/lib/constants";

import React, { useState, useEffect, useRef } from "react";
import {
  Plus, Trash2, MoveUp, MoveDown, ChevronDown, ChevronUp,
  FileText, AlertTriangle, Lightbulb, BarChart3, Zap, Clock,
  Table2, BookOpen, Image as ImageIcon, Upload,
  Quote, Layers, LayoutGrid, TrendingUp, CheckSquare,
  ArrowLeft, Eye, Pencil, Search,
} from "lucide-react";
import { safeFetch, cn, uploadFile } from "@/lib/utils";
import AdminLayout from "@/components/admin/admin-layout";
import RichBodyEditor from "@/components/admin/rich-body-editor";

// ── Types ─────────────────────────────────────────────────────────────────────
type SectionType =
  | "overview" | "challenge" | "solution" | "solution_scope" | "timeline" | "comparison"
  | "metrics" | "results" | "text" | "mid_cta"
  | "testimonial" | "tech_stack" | "image_gallery" | "final_outcomes";

interface Metric      { label: string; value: string; desc: string }
interface Phase       { phase: string; title: string; desc: string }
interface CompRow     { before: string; after: string }
interface HeroStat    { label: string; value: string }
interface GalleryImage{ url: string; caption: string }
interface TechItem    { name: string; desc: string }
interface OutcomeCard { icon: string; title: string; desc: string }

interface CaseSection {
  id: string;
  type: SectionType;
  title?: string;
  content?: string;
  image?: string;
  points?: string[];
  comparison?: { before_label: string; after_label: string; rows: CompRow[] };
  metrics?: Metric[];
  cta_text?: string;
  cta_label?: string;
  phases?: Phase[];
  quote?: string;
  author?: string;
  author_role?: string;
  author_company?: string;
  author_avatar?: string;
  tech_tags?: string[];
  tech_items?: TechItem[];
  gallery?: GalleryImage[];
  outcomes?: OutcomeCard[];
  scope_items?: string[];
}

interface CaseStudy {
  id?: number;
  title: string;
  slug: string;
  eyebrow: string;
  subtitle: string;
  description: string;
  content: string;
  client_name: string;
  client_logo: string;
  client_image: string;
  industry: string;
  service_tags: string[];
  published_date: string;
  read_time: string;
  image_url: string;
  hero_bg: string;
  hero_cta_label: string;
  hero_cta_url: string;
  hero_stats: HeroStat[];
  sections: CaseSection[];
  show_related: boolean;
  show_industry_section: boolean;
  industry_section_title: string;
  status: "published" | "draft";
  featured: boolean;
  position: number;
  challenge: string;
  solution: string;
  results: string;
  meta_title: string;
  meta_description: string;
  scheduled_at: string;
  author_name: string;
}

// ── Defaults ──────────────────────────────────────────────────────────────────
const defaultCase = (): CaseStudy => ({
  title: "",
  slug: "",
  eyebrow: "Case Study",
  subtitle: "",
  description: "",
  content: "",
  client_name: "",
  client_logo: "",
  client_image: "",
  industry: "",
  service_tags: [],
  published_date: new Date().toISOString().slice(0, 10),
  read_time: "8 min read",
  image_url: "",
  hero_bg: "",
  hero_cta_label: "View Case Study",
  hero_cta_url: "#contact",
  hero_stats: [],
  sections: [],
  show_related: true,
  show_industry_section: false,
  industry_section_title: "",
  status: "draft",
  featured: false,
  position: 0,
  challenge: "",
  solution: "",
  results: "",
  meta_title: "",
  meta_description: "",
  scheduled_at: "",
  author_name: "Digi Pexel Team",
});

const SECTION_TYPES: { type: SectionType; label: string; icon: React.ReactNode; desc: string }[] = [
  { type: "overview",        label: "Overview",           icon: <BookOpen      className="w-4 h-4" />, desc: "Executive summary"           },
  { type: "challenge",       label: "Challenge",          icon: <AlertTriangle className="w-4 h-4" />, desc: "Problem statement + points"  },
  { type: "solution",        label: "Solution",           icon: <Lightbulb     className="w-4 h-4" />, desc: "Approach + bullet points"    },
  { type: "solution_scope",  label: "Solution Scope",     icon: <CheckSquare   className="w-4 h-4" />, desc: "Scope items checklist"       },
  { type: "timeline",        label: "Timeline / Phases",  icon: <Clock         className="w-4 h-4" />, desc: "Numbered phase breakdown"    },
  { type: "comparison",      label: "Before / After",     icon: <Table2        className="w-4 h-4" />, desc: "Comparison table"            },
  { type: "metrics",         label: "Metrics / Results",  icon: <BarChart3     className="w-4 h-4" />, desc: "KPI cards with numbers"      },
  { type: "final_outcomes",  label: "Final Outcomes",     icon: <TrendingUp    className="w-4 h-4" />, desc: "Outcome cards with icons"    },
  { type: "text",            label: "Text Block",         icon: <FileText      className="w-4 h-4" />, desc: "Free-form content"           },
  { type: "mid_cta",         label: "Mid-Article CTA",    icon: <Zap           className="w-4 h-4" />, desc: "Inline call-to-action"       },
  { type: "testimonial",     label: "Testimonial",        icon: <Quote         className="w-4 h-4" />, desc: "Client quote block"          },
  { type: "tech_stack",      label: "Tech Stack",         icon: <Layers        className="w-4 h-4" />, desc: "Tech with descriptions"      },
  { type: "image_gallery",   label: "Image Gallery",      icon: <LayoutGrid    className="w-4 h-4" />, desc: "Screenshot / image grid"     },
];

function uid() { return Math.random().toString(36).slice(2, 9); }
function slugify(s: string) { return s.toLowerCase().trim().replace(/[^a-z0-9-]+/g, "-").replace(/^-+|-+$/g, ""); }

// ── Seed fallback ─────────────────────────────────────────────────────────────
const SEED_CASES: CaseStudy[] = [
  { id: 1, title: "How FinFlows Automated 90% of Their Back-Office Operations", slug: "finflows-back-office-automation", eyebrow: "Case Study", subtitle: "", description: "FinFlows partnered with Digi Pexel to automate their loan processing, KYC verification, and monthly reporting pipelines.", content: "", client_name: "FinFlows Inc.", client_logo: "", client_image: "", industry: "Fintech", service_tags: [], published_date: "2025-03-14", read_time: "5 min read", image_url: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80", hero_bg: "", hero_cta_label: "Start Your Project", hero_cta_url: "/contact-us", hero_stats: [{ label: "Ops Cost Reduction", value: "60%" }], sections: [], show_related: true, show_industry_section: true, industry_section_title: "", status: "published", featured: false, position: 0, challenge: "", solution: "", results: "", meta_title: "", meta_description: "", scheduled_at: "", author_name: "Digi Pexel Team" },
  { id: 2, title: "How GrowthLoop Scaled LinkedIn Outreach 10x Without Hiring", slug: "growthloop-linkedin-scale", eyebrow: "Case Study", subtitle: "", description: "GrowthLoop needed to scale their outbound pipeline without expanding their SDR team.", content: "", client_name: "GrowthLoop", client_logo: "", client_image: "", industry: "B2B SaaS", service_tags: [], published_date: "2025-04-10", read_time: "4 min read", image_url: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80", hero_bg: "", hero_cta_label: "Start Your Project", hero_cta_url: "/contact-us", hero_stats: [{ label: "Pipeline Growth", value: "3x" }], sections: [], show_related: true, show_industry_section: true, industry_section_title: "", status: "published", featured: false, position: 1, challenge: "", solution: "", results: "", meta_title: "", meta_description: "", scheduled_at: "", author_name: "Digi Pexel Team" },
];

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function AdminCaseStudyPage() {
  const [cases, setCases]       = useState<CaseStudy[]>([]);
  const [loading, setLoading]   = useState(true);
  const [apiError, setApiError] = useState(false);
  const [saving, setSaving]     = useState(false);
  const [view, setView]         = useState<"list" | "edit">("list");
  const [editKey, setEditKey]   = useState<string | null>(null);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [addSectionOpen, setAddSectionOpen] = useState(false);
  const [search, setSearch]     = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "published" | "draft">("all");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo]     = useState("");

  useEffect(() => { fetchCases(); }, []);

  const fetchCases = async () => {
    try {
      const data = await safeFetch(`${API_BASE_URL}/case_studies.php?admin=1`);
      if (data?.status === "success") { setCases(data.data as CaseStudy[]); setApiError(false); }
      else { setCases(SEED_CASES); setApiError(true); }
    } catch { setCases(SEED_CASES); setApiError(true); }
    finally { setLoading(false); }
  };

  const editIdx = editKey ? cases.findIndex(c => (c.id ? String(c.id) : c.slug) === editKey) : -1;
  const editCase = editIdx >= 0 ? cases[editIdx] : null;

  const openNew = () => {
    const nc = defaultCase();
    const key = "new-" + Date.now();
    nc.slug = key;
    setCases(prev => [nc, ...prev]);
    setEditKey(key);
    setShowAdvanced(false);
    setView("edit");
  };

  const openEdit = (key: string) => {
    setEditKey(key);
    setShowAdvanced(false);
    setView("edit");
  };

  const updateCase = (idx: number, patch: Partial<CaseStudy>) => {
    setCases(prev => { const n = [...prev]; n[idx] = { ...n[idx], ...patch }; return n; });
  };

  const removeCase = (idx: number) => {
    if (!confirm("Delete this case study?")) return;
    const c = cases[idx];
    if (c.id) {
      fetch(`${API_BASE_URL}/case_studies.php`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "delete_case", id: c.id }) });
    }
    setCases(prev => prev.filter((_, i) => i !== idx));
    if (view === "edit") setView("list");
  };

  const saveCase = async () => {
    if (!editCase || editIdx < 0) return;
    if (!editCase.title.trim()) { alert("Title is required."); return; }
    setSaving(true);
    try {
      const data = await safeFetch(`${API_BASE_URL}/case_studies.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "save_case", case: editCase }),
      });
      if (data?.status === "success") {
        if (!editCase.id && data.id) updateCase(editIdx, { id: data.id as number });
        alert("Saved successfully!");
      } else { alert("Save failed: " + (data?.message ?? "Unknown error")); }
    } catch { alert("Connection error."); }
    finally { setSaving(false); }
  };

  const filtered = cases.filter(c => {
    if (!c.title.toLowerCase().includes(search.toLowerCase())) return false;
    if (statusFilter !== "all" && c.status !== statusFilter) return false;
    if (dateFrom && c.published_date && c.published_date < dateFrom) return false;
    if (dateTo   && c.published_date && c.published_date > dateTo)   return false;
    return true;
  });

  if (loading) return <AdminLayout><div className="p-10 text-slate-400 text-xs font-bold uppercase tracking-widest">Loading…</div></AdminLayout>;

  // ── EDIT VIEW ────────────────────────────────────────────────────────────────
  if (view === "edit" && editCase && editIdx >= 0) {
    const c = editCase;
    const idx = editIdx;
    const isNew = !c.id;

    return (
      <AdminLayout>
        <div className="pb-32 max-w-2xl mx-auto">

          {/* Top bar */}
          <div className="flex items-center gap-3 mb-8 flex-wrap">
            <button onClick={() => setView("list")} className="flex items-center gap-1.5 text-sm font-semibold text-slate-500 hover:text-slate-900 transition-colors">
              <ArrowLeft className="w-4 h-4" /> Case Studies
            </button>
            <span className="text-slate-300">/</span>
            <span className="text-sm text-slate-700 truncate max-w-xs">{c.title || (isNew ? "New Case Study" : "Edit")}</span>
            <div className="ml-auto flex items-center gap-2">
              <button onClick={() => setView("list")} className="px-4 py-2 text-sm text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
                Cancel <kbd className="text-[10px] text-slate-400 ml-1">Esc</kbd>
              </button>
              <a href={`/case-studies/${c.slug}`} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-4 py-2 text-sm text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
                <Eye className="w-3.5 h-3.5" /> Preview
              </a>
              <button onClick={saveCase} disabled={saving}
                className="flex items-center gap-2 px-5 py-2 bg-slate-900 text-white text-sm font-semibold rounded-lg hover:bg-slate-800 transition-all disabled:opacity-50">
                {isNew ? "Create Case Study" : "Save Case Study"}
              </button>
            </div>
          </div>

          {/* Form */}
          <div className="space-y-6">

            {/* Title */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Title <span className="text-red-500">*</span></label>
              <input
                value={c.title}
                onChange={e => updateCase(idx, { title: e.target.value, slug: c.id ? c.slug : slugify(e.target.value) })}
                placeholder="Case study title"
                className="w-full border border-slate-200 rounded-xl px-4 py-3 text-base font-semibold focus:outline-none focus:border-brand bg-white placeholder:text-slate-300"
              />
            </div>

            {/* Slug */}
            <div>
              <label className="block text-xs text-slate-400 mb-1.5">Slug <span className="italic">(auto-generated from title; edit to customize)</span></label>
              <input
                value={c.slug}
                onChange={e => updateCase(idx, { slug: e.target.value })}
                className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm font-mono text-slate-600 focus:outline-none focus:border-brand bg-white"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Description</label>
              <textarea
                value={c.description}
                onChange={e => updateCase(idx, { description: e.target.value })}
                placeholder="Brief summary shown in listings and the hero section…"
                rows={3}
                className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand bg-white resize-none placeholder:text-slate-300"
              />
            </div>

            {/* Client + Industry */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Client Name</label>
                <input value={c.client_name} onChange={e => updateCase(idx, { client_name: e.target.value })} placeholder="Acme Corp" className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand bg-white placeholder:text-slate-300" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Industry</label>
                <input value={c.industry} onChange={e => updateCase(idx, { industry: e.target.value })} placeholder="FinTech, E-commerce…" className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand bg-white placeholder:text-slate-300" />
              </div>
            </div>

            {/* Cover Image */}
            <UploadImageField label="Cover Image" value={c.image_url} onChange={v => updateCase(idx, { image_url: v })} />

            {/* Status + Date */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Status</label>
                <select value={c.status} onChange={e => updateCase(idx, { status: e.target.value as CaseStudy["status"] })} className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand bg-white">
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Published Date</label>
                <input type="date" value={c.published_date} onChange={e => updateCase(idx, { published_date: e.target.value })} className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand bg-white" />
              </div>
            </div>

            {/* Scheduled At + Author Name */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Scheduled At</label>
                <input type="datetime-local" value={c.scheduled_at} onChange={e => updateCase(idx, { scheduled_at: e.target.value })} className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand bg-white" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Author Name</label>
                <input value={c.author_name} onChange={e => updateCase(idx, { author_name: e.target.value })} placeholder="Digi Pexel Team" className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand bg-white placeholder:text-slate-300" />
              </div>
            </div>

            {/* Meta Title */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                Meta Title <span className="text-xs font-normal text-slate-400">(SEO — defaults to title if blank)</span>
              </label>
              <input value={c.meta_title} onChange={e => updateCase(idx, { meta_title: e.target.value })} placeholder="SEO page title" className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand bg-white placeholder:text-slate-300" />
            </div>

            {/* Meta Description */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                Meta Description <span className="text-xs font-normal text-brand">(SEO)</span>
              </label>
              <textarea value={c.meta_description} onChange={e => updateCase(idx, { meta_description: e.target.value })} placeholder="Brief description for search engines (150–160 characters)…" rows={3} className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand bg-white resize-none placeholder:text-slate-300" />
            </div>

            {/* Body */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Body <span className="text-red-500">*</span></label>
              <RichBodyEditor value={c.content} onChange={v => updateCase(idx, { content: v })} />
            </div>

            {/* Advanced toggle */}
            <button
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-800 border border-slate-200 rounded-xl px-4 py-3 w-full transition-colors"
            >
              {showAdvanced ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              Advanced options
              <span className="ml-auto text-xs text-slate-400 hidden sm:block">Hero Stats · Service Tags · Sections · Settings</span>
            </button>

            {showAdvanced && (
              <div className="space-y-6 border border-slate-200 rounded-2xl p-6 bg-slate-50/30">

                {/* Eyebrow + Read Time */}
                <div className="grid grid-cols-2 gap-4">
                  <Field label="Eyebrow Badge" value={c.eyebrow} onChange={v => updateCase(idx, { eyebrow: v })} placeholder="Case Study" />
                  <Field label="Read Time" value={c.read_time} onChange={v => updateCase(idx, { read_time: v })} placeholder="8 min read" />
                </div>

                {/* Subtitle */}
                <Field label="Subtitle / Punchline" value={c.subtitle} onChange={v => updateCase(idx, { subtitle: v })} placeholder="A hook line for the hero section" />

                {/* Images */}
                <ImageField label="Client / Person Image URL" value={c.client_image} onChange={v => updateCase(idx, { client_image: v })} />
                <Field label="Client Logo URL (shown inverted/white in dark hero)" value={c.client_logo} onChange={v => updateCase(idx, { client_logo: v })} />

                {/* Hero CTA */}
                <div className="grid grid-cols-2 gap-4">
                  <Field label="Hero CTA Label" value={c.hero_cta_label} onChange={v => updateCase(idx, { hero_cta_label: v })} placeholder="View Case Study" />
                  <Field label="Hero CTA URL" value={c.hero_cta_url} onChange={v => updateCase(idx, { hero_cta_url: v })} placeholder="#contact" />
                </div>

                {/* Service Tags */}
                <TagsField label="Service Tags" tags={c.service_tags} onChange={v => updateCase(idx, { service_tags: v })} />

                {/* Hero Stats */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Hero Stats Strip (up to 4)</p>
                    {(c.hero_stats ?? []).length < 4 && (
                      <button onClick={() => updateCase(idx, { hero_stats: [...(c.hero_stats ?? []), { value: "", label: "" }] })} className="flex items-center gap-1 text-xs font-bold text-brand hover:underline">
                        <Plus className="w-3.5 h-3.5" /> Add Stat
                      </button>
                    )}
                  </div>
                  <div className="space-y-2">
                    {(c.hero_stats ?? []).map((stat, si) => (
                      <div key={si} className="flex gap-2 items-start">
                        <input value={stat.value} onChange={e => { const s=[...(c.hero_stats??[])]; s[si]={...s[si],value:e.target.value}; updateCase(idx,{hero_stats:s}); }} placeholder="85%" className="w-24 border border-slate-200 rounded-xl px-3 py-2.5 text-sm font-bold focus:outline-none focus:border-brand bg-white" />
                        <input value={stat.label} onChange={e => { const s=[...(c.hero_stats??[])]; s[si]={...s[si],label:e.target.value}; updateCase(idx,{hero_stats:s}); }} placeholder="Reduction in manual work" className="flex-1 border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-brand bg-white" />
                        <button onClick={() => updateCase(idx,{hero_stats:(c.hero_stats??[]).filter((_,i)=>i!==si)})} className="p-2.5 rounded-xl bg-red-50 text-red-400 hover:bg-red-500 hover:text-white"><Trash2 className="w-3.5 h-3.5" /></button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Content Blocks */}
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Content Blocks</p>
                  <p className="text-xs text-slate-400 mb-4">Structured blocks override the Body field above when added.</p>
                  {c.sections.length > 0 && (
                    <div className="space-y-3 mb-4">
                      {c.sections.map((sec, si) => (
                        <SectionEditor key={sec.id} section={sec}
                          onChange={updated => { const s=[...c.sections]; s[si]=updated; updateCase(idx,{sections:s}); }}
                          onRemove={() => updateCase(idx,{sections:c.sections.filter((_,i)=>i!==si)})}
                          onMove={dir => {
                            if (dir==="up"&&si===0) return;
                            if (dir==="down"&&si===c.sections.length-1) return;
                            const s=[...c.sections]; const t=dir==="up"?si-1:si+1;
                            [s[si],s[t]]=[s[t],s[si]]; updateCase(idx,{sections:s});
                          }}
                        />
                      ))}
                    </div>
                  )}
                  <div className="border border-slate-200 rounded-2xl overflow-hidden">
                    <button className="w-full flex items-center justify-between px-5 py-3.5 text-xs font-black uppercase tracking-widest text-slate-500 hover:bg-slate-50 transition-colors"
                      onClick={() => setAddSectionOpen(!addSectionOpen)}>
                      <span className="flex items-center gap-2"><Plus className="w-4 h-4 text-brand" /> Add Block</span>
                      {addSectionOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                    {addSectionOpen && (
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 p-4 border-t border-slate-100 bg-slate-50/30">
                        {SECTION_TYPES.map(st => (
                          <button key={st.type}
                            onClick={() => { updateCase(idx,{sections:[...c.sections,buildDefaultSection(st.type)]}); setAddSectionOpen(false); }}
                            className="flex flex-col items-start gap-1 p-3 rounded-xl bg-white border border-slate-200 hover:border-brand hover:shadow-sm transition-all text-left">
                            <span className="text-brand">{st.icon}</span>
                            <span className="text-xs font-bold text-slate-700">{st.label}</span>
                            <span className="text-[10px] text-slate-400">{st.desc}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Settings */}
                <div className="border-t border-slate-200 pt-4">
                  <ToggleSetting label="Show Related Case Studies" desc="Display 3 related case studies after the content" value={c.show_related} onChange={v => updateCase(idx,{show_related:v})} />
                  <ToggleSetting label="Show Industry Section" desc="Show industry-filtered case studies section" value={c.show_industry_section} onChange={v => updateCase(idx,{show_industry_section:v})} />
                  <ToggleSetting label="Featured" desc="Highlight this case study on the listing page" value={c.featured} onChange={v => updateCase(idx,{featured:v})} />
                  <div className="pt-4">
                    <Field label="Position (order in listing)" value={String(c.position)} type="number" onChange={v => updateCase(idx,{position:Number(v)})} />
                  </div>
                </div>

              </div>
            )}
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
            <span><strong>API offline</strong> — showing demo case studies. Deploy the backend or check your connection to load live data.</span>
            <button onClick={() => { setLoading(true); fetchCases(); }} className="ml-auto text-amber-700 font-bold underline underline-offset-2 hover:no-underline">Retry</button>
          </div>
        )}

        {/* Content-type tabs */}
        <div className="flex items-center gap-0 border-b border-slate-200 mb-6 overflow-x-auto">
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
              className={cn("px-4 py-2.5 text-sm font-semibold border-b-2 -mb-px transition-colors whitespace-nowrap",
                tab.href === "/admin/case-studies"
                  ? "border-brand text-brand"
                  : "border-transparent text-slate-500 hover:text-slate-800"
              )}>
              {tab.label}
            </a>
          ))}
        </div>

        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <h1 className="text-2xl font-display font-bold text-slate-900">Case Studies</h1>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search case studies…"
                className="pl-9 pr-4 h-9 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-brand bg-white w-52" />
            </div>
            <button onClick={openNew}
              className="flex items-center gap-2 bg-brand text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-brand/90 transition-all shadow-sm">
              + New Case Study
            </button>
          </div>
        </div>

        {/* Status tabs + date filters */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
          <div className="flex items-center gap-1 bg-slate-100 rounded-lg p-1">
            {(["all", "draft", "published"] as const).map(s => (
              <button key={s} onClick={() => setStatusFilter(s)}
                className={cn("px-3 py-1.5 rounded-md text-xs font-semibold capitalize transition-all",
                  statusFilter === s ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"
                )}>
                {s === "all" ? "All" : s.charAt(0).toUpperCase() + s.slice(1)}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span>From</span>
            <input type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)} className="h-8 border border-slate-200 rounded-lg px-2 text-xs focus:outline-none focus:border-brand bg-white" />
            <span>to</span>
            <input type="date" value={dateTo} onChange={e => setDateTo(e.target.value)} className="h-8 border border-slate-200 rounded-lg px-2 text-xs focus:outline-none focus:border-brand bg-white" />
          </div>
        </div>

        {/* Table */}
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
          {filtered.length === 0 ? (
            <div className="py-20 text-center text-slate-400 text-sm font-semibold">
              {search || statusFilter !== "all" || dateFrom || dateTo ? "No matching case studies" : "No case studies yet — click \"+ New Case Study\" to begin"}
            </div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/60">
                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wide">Title</th>
                  <th className="text-left px-4 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wide hidden md:table-cell">Industry</th>
                  <th className="text-left px-4 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wide">Status</th>
                  <th className="text-left px-4 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wide hidden md:table-cell">Author</th>
                  <th className="text-left px-4 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wide hidden md:table-cell">Published At</th>
                  <th className="text-right px-5 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wide">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(c => {
                  const realIdx = cases.indexOf(c);
                  const key = c.id ? String(c.id) : c.slug;
                  return (
                    <tr key={key} className="border-b border-slate-100 last:border-0 hover:bg-slate-50/40 transition-colors">
                      <td className="px-5 py-3.5">
                        <span className="text-sm font-medium text-slate-800 block truncate max-w-[280px]">{c.title || "Untitled"}</span>
                        <span className="text-xs text-slate-400 font-mono">{c.slug}</span>
                      </td>
                      <td className="px-4 py-3.5 hidden md:table-cell text-xs text-slate-500">{c.industry || "—"}</td>
                      <td className="px-4 py-3.5">
                        <span className={cn(
                          "text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wide",
                          c.status === "published" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"
                        )}>
                          {c.status}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 hidden md:table-cell text-xs text-slate-500">{c.author_name || "Digi Pexel Team"}</td>
                      <td className="px-4 py-3.5 hidden md:table-cell text-xs text-slate-500">
                        {c.published_date ? new Date(c.published_date).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) : "—"}
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center justify-end gap-1">
                          <a href={`/case-studies/${c.slug}`} target="_blank" rel="noopener noreferrer" className="p-1.5 rounded-lg text-slate-400 hover:text-brand hover:bg-brand/8 transition-all"><Eye className="w-4 h-4" /></a>
                          <button onClick={() => openEdit(key)} className="p-1.5 rounded-lg text-slate-400 hover:text-brand hover:bg-brand/8 transition-all"><Pencil className="w-4 h-4" /></button>
                          <button onClick={() => removeCase(realIdx)} className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all"><Trash2 className="w-4 h-4" /></button>
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

// ── Section Editor ─────────────────────────────────────────────────────────────
function SectionEditor({ section: s, onChange, onRemove, onMove }: {
  section: CaseSection; onChange: (s: CaseSection) => void; onRemove: () => void; onMove: (dir: "up"|"down") => void;
}) {
  const [open, setOpen] = useState(true);
  const meta = SECTION_TYPES.find(t => t.type === s.type)!;
  const update = (patch: Partial<CaseSection>) => onChange({ ...s, ...patch });

  return (
    <div className="border border-slate-200 rounded-2xl overflow-hidden">
      <div className="flex items-center justify-between bg-slate-50 px-4 py-3 cursor-pointer" onClick={() => setOpen(!open)}>
        <div className="flex items-center gap-2">
          <span className="text-brand">{meta.icon}</span>
          <span className="text-xs font-bold text-slate-700">{meta.label}</span>
          {s.title && <span className="text-xs text-slate-400 truncate max-w-40">— {s.title}</span>}
        </div>
        <div className="flex items-center gap-1">
          <button onClick={e=>{e.stopPropagation();onMove("up");}}   className="p-1 rounded bg-white border border-slate-200 text-slate-400 hover:text-brand"><MoveUp   className="w-3 h-3"/></button>
          <button onClick={e=>{e.stopPropagation();onMove("down");}} className="p-1 rounded bg-white border border-slate-200 text-slate-400 hover:text-brand"><MoveDown className="w-3 h-3"/></button>
          <button onClick={e=>{e.stopPropagation();onRemove();}}     className="p-1 rounded bg-red-50 text-red-400 hover:bg-red-500 hover:text-white"><Trash2   className="w-3 h-3"/></button>
          {open ? <ChevronUp className="w-4 h-4 text-slate-400 ml-1"/> : <ChevronDown className="w-4 h-4 text-slate-400 ml-1"/>}
        </div>
      </div>
      {open && (
        <div className="p-4 space-y-3">
          {s.type==="mid_cta" && <>
            <Field label="CTA Text"     value={s.cta_text??""} onChange={v=>update({cta_text:v})}  placeholder="Ready to achieve similar results?" />
            <Field label="Button Label" value={s.cta_label??""} onChange={v=>update({cta_label:v})} placeholder="Book a Strategy Call" />
          </>}
          {s.type==="testimonial" && <>
            <Field label="Quote" value={s.quote??""} textarea rows={4} onChange={v=>update({quote:v})} placeholder="The platform transformed how our team operates…" />
            <div className="grid grid-cols-2 gap-3">
              <Field label="Author Name" value={s.author??""} onChange={v=>update({author:v})} placeholder="Jane Smith" />
              <Field label="Author Role" value={s.author_role??""} onChange={v=>update({author_role:v})} placeholder="CEO" />
            </div>
            <Field label="Company" value={s.author_company??""} onChange={v=>update({author_company:v})} placeholder="Acme Corp" />
          </>}
          {s.type==="tech_stack" && <>
            <Field label="Section Title" value={s.title??""} onChange={v=>update({title:v})} placeholder="Technology Stack" />
            <Field label="Intro (optional)" value={s.content??""} textarea rows={2} onChange={v=>update({content:v})} />
            {(s.tech_items??[]).map((item,ti)=>(
              <div key={ti} className="flex gap-2 items-start bg-slate-50 border border-slate-200 rounded-xl p-3">
                <div className="flex-1 space-y-2">
                  <input value={item.name} onChange={e=>{const i=[...(s.tech_items??[])];i[ti]={...i[ti],name:e.target.value};update({tech_items:i});}} placeholder="e.g. n8n, Python…" className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold focus:outline-none focus:border-brand bg-white"/>
                  <textarea value={item.desc} onChange={e=>{const i=[...(s.tech_items??[])];i[ti]={...i[ti],desc:e.target.value};update({tech_items:i});}} placeholder="How it was used…" rows={2} className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-brand bg-white resize-none"/>
                </div>
                <button onClick={()=>update({tech_items:(s.tech_items??[]).filter((_,i)=>i!==ti)})} className="p-2 rounded-xl bg-red-50 text-red-400 hover:bg-red-500 hover:text-white"><Trash2 className="w-3 h-3"/></button>
              </div>
            ))}
            <button onClick={()=>update({tech_items:[...(s.tech_items??[]),{name:"",desc:""}]})} className="flex items-center gap-1.5 text-xs font-bold text-brand hover:underline"><Plus className="w-3.5 h-3.5"/> Add Technology</button>
          </>}
          {s.type==="image_gallery" && <>
            <Field label="Section Title" value={s.title??""} onChange={v=>update({title:v})} placeholder="Screenshots & Results" />
            {(s.gallery??[]).map((img,gi)=>(
              <div key={gi} className="flex gap-3 items-start bg-slate-50 border border-slate-200 rounded-xl p-3">
                <div className="w-14 h-10 rounded-lg overflow-hidden bg-slate-200 flex-shrink-0">
                  {img.url ? <img src={img.url} alt="" className="w-full h-full object-cover"/> : <div className="w-full h-full flex items-center justify-center"><ImageIcon className="w-3 h-3 text-slate-300"/></div>}
                </div>
                <div className="flex-1 space-y-2">
                  <input value={img.url} onChange={e=>{const g=[...(s.gallery??[])];g[gi]={...g[gi],url:e.target.value};update({gallery:g});}} placeholder="Image URL…" className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-brand bg-white"/>
                  <input value={img.caption} onChange={e=>{const g=[...(s.gallery??[])];g[gi]={...g[gi],caption:e.target.value};update({gallery:g});}} placeholder="Caption (optional)…" className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-brand bg-white"/>
                </div>
                <button onClick={()=>update({gallery:(s.gallery??[]).filter((_,i)=>i!==gi)})} className="p-2 rounded-xl bg-red-50 text-red-400 hover:bg-red-500 hover:text-white"><Trash2 className="w-3 h-3"/></button>
              </div>
            ))}
            <button onClick={()=>update({gallery:[...(s.gallery??[]),{url:"",caption:""}]})} className="flex items-center gap-1.5 text-xs font-bold text-brand hover:underline"><Plus className="w-3.5 h-3.5"/> Add Image</button>
          </>}
          {s.type==="comparison" && <>
            <Field label="Section Title" value={s.title??""} onChange={v=>update({title:v})} />
            <Field label="Content" value={s.content??""} textarea onChange={v=>update({content:v})} />
            <div className="grid grid-cols-2 gap-3">
              <Field label="Before Label" value={s.comparison?.before_label??"Before"} onChange={v=>update({comparison:{...s.comparison!,before_label:v}})} />
              <Field label="After Label"  value={s.comparison?.after_label ??"After"}  onChange={v=>update({comparison:{...s.comparison!,after_label:v}})} />
            </div>
            {(s.comparison?.rows??[]).map((row,ri)=>(
              <div key={ri} className="flex gap-2">
                <input value={row.before} onChange={e=>{const r=[...(s.comparison!.rows)];r[ri]={...r[ri],before:e.target.value};update({comparison:{...s.comparison!,rows:r}});}} placeholder="Before…" className="flex-1 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-brand"/>
                <input value={row.after}  onChange={e=>{const r=[...(s.comparison!.rows)];r[ri]={...r[ri],after:e.target.value};update({comparison:{...s.comparison!,rows:r}});}}  placeholder="After…"  className="flex-1 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-brand"/>
                <button onClick={()=>{const r=s.comparison!.rows.filter((_,i)=>i!==ri);update({comparison:{...s.comparison!,rows:r}});}} className="p-2 rounded-xl bg-red-50 text-red-400 hover:bg-red-500 hover:text-white"><Trash2 className="w-3 h-3"/></button>
              </div>
            ))}
            <button onClick={()=>update({comparison:{before_label:s.comparison?.before_label??"Before",after_label:s.comparison?.after_label??"After",rows:[...(s.comparison?.rows??[]),{before:"",after:""}]}})} className="flex items-center gap-1.5 text-xs font-bold text-brand hover:underline"><Plus className="w-3.5 h-3.5"/> Add Row</button>
          </>}
          {(s.type==="metrics"||s.type==="results") && <>
            <Field label="Section Title" value={s.title??""} onChange={v=>update({title:v})} />
            <Field label="Content" value={s.content??""} textarea onChange={v=>update({content:v})} />
            {(s.metrics??[]).map((m,mi)=>(
              <div key={mi} className="grid grid-cols-[1fr_1fr_2fr_auto] gap-2">
                <input value={m.value} onChange={e=>{const mm=[...(s.metrics!)];mm[mi]={...mm[mi],value:e.target.value};update({metrics:mm});}} placeholder="85%" className="border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-brand font-bold"/>
                <input value={m.label} onChange={e=>{const mm=[...(s.metrics!)];mm[mi]={...mm[mi],label:e.target.value};update({metrics:mm});}} placeholder="Time Saved" className="border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-brand"/>
                <input value={m.desc}  onChange={e=>{const mm=[...(s.metrics!)];mm[mi]={...mm[mi],desc:e.target.value};update({metrics:mm});}}  placeholder="Description" className="border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-brand"/>
                <button onClick={()=>update({metrics:s.metrics!.filter((_,i)=>i!==mi)})} className="p-2 rounded-xl bg-red-50 text-red-400 hover:bg-red-500 hover:text-white"><Trash2 className="w-3 h-3"/></button>
              </div>
            ))}
            <button onClick={()=>update({metrics:[...(s.metrics??[]),{value:"",label:"",desc:""}]})} className="flex items-center gap-1.5 text-xs font-bold text-brand hover:underline"><Plus className="w-3.5 h-3.5"/> Add Metric</button>
          </>}
          {s.type==="solution_scope" && <>
            <Field label="Section Title" value={s.title??""} onChange={v=>update({title:v})} placeholder="Solution Scope" />
            <Field label="Intro (optional)" value={s.content??""} textarea rows={2} onChange={v=>update({content:v})} />
            {(s.scope_items??[]).map((item,si)=>(
              <div key={si} className="flex gap-2">
                <input value={item} onChange={e=>{const i=[...(s.scope_items??[])];i[si]=e.target.value;update({scope_items:i});}} placeholder="Scope item…" className="flex-1 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-brand"/>
                <button onClick={()=>update({scope_items:(s.scope_items??[]).filter((_,i)=>i!==si)})} className="p-2 rounded-xl bg-red-50 text-red-400 hover:bg-red-500 hover:text-white"><Trash2 className="w-3 h-3"/></button>
              </div>
            ))}
            <button onClick={()=>update({scope_items:[...(s.scope_items??[]),""]}) } className="flex items-center gap-1.5 text-xs font-bold text-brand hover:underline"><Plus className="w-3.5 h-3.5"/> Add Item</button>
          </>}
          {s.type==="final_outcomes" && <>
            <Field label="Section Title" value={s.title??""} onChange={v=>update({title:v})} placeholder="Final Outcomes" />
            <Field label="Intro (optional)" value={s.content??""} textarea rows={2} onChange={v=>update({content:v})} />
            {(s.outcomes??[]).map((card,oi)=>(
              <div key={oi} className="flex gap-3 items-start bg-slate-50 border border-slate-200 rounded-xl p-3">
                <div className="flex-1 space-y-2">
                  <div className="grid grid-cols-[64px_1fr] gap-2">
                    <input value={card.icon} onChange={e=>{const oc=[...(s.outcomes??[])];oc[oi]={...oc[oi],icon:e.target.value};update({outcomes:oc});}} placeholder="🎯" className="border border-slate-200 rounded-xl px-3 py-2 text-lg text-center focus:outline-none focus:border-brand bg-white"/>
                    <input value={card.title} onChange={e=>{const oc=[...(s.outcomes??[])];oc[oi]={...oc[oi],title:e.target.value};update({outcomes:oc});}} placeholder="Outcome title…" className="border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold focus:outline-none focus:border-brand bg-white"/>
                  </div>
                  <textarea value={card.desc} onChange={e=>{const oc=[...(s.outcomes??[])];oc[oi]={...oc[oi],desc:e.target.value};update({outcomes:oc});}} placeholder="Describe this outcome…" rows={2} className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-brand bg-white resize-none"/>
                </div>
                <button onClick={()=>update({outcomes:(s.outcomes??[]).filter((_,i)=>i!==oi)})} className="p-2 rounded-xl bg-red-50 text-red-400 hover:bg-red-500 hover:text-white flex-shrink-0 mt-1"><Trash2 className="w-3 h-3"/></button>
              </div>
            ))}
            <button onClick={()=>update({outcomes:[...(s.outcomes??[]),{icon:"",title:"",desc:""}]})} className="flex items-center gap-1.5 text-xs font-bold text-brand hover:underline"><Plus className="w-3.5 h-3.5"/> Add Outcome</button>
          </>}
          {s.type==="timeline" && <>
            <Field label="Section Title" value={s.title??""} onChange={v=>update({title:v})} />
            <Field label="Content" value={s.content??""} textarea onChange={v=>update({content:v})} />
            {(s.phases??[]).map((p,pi)=>(
              <div key={pi} className="grid grid-cols-[1fr_2fr_3fr_auto] gap-2">
                <input value={p.phase} onChange={e=>{const pp=[...(s.phases!)];pp[pi]={...pp[pi],phase:e.target.value};update({phases:pp});}} placeholder="Phase 1" className="border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-brand"/>
                <input value={p.title} onChange={e=>{const pp=[...(s.phases!)];pp[pi]={...pp[pi],title:e.target.value};update({phases:pp});}} placeholder="Discovery" className="border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-brand"/>
                <input value={p.desc}  onChange={e=>{const pp=[...(s.phases!)];pp[pi]={...pp[pi],desc:e.target.value};update({phases:pp});}}  placeholder="Description…" className="border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-brand"/>
                <button onClick={()=>update({phases:s.phases!.filter((_,i)=>i!==pi)})} className="p-2 rounded-xl bg-red-50 text-red-400 hover:bg-red-500 hover:text-white"><Trash2 className="w-3 h-3"/></button>
              </div>
            ))}
            <button onClick={()=>update({phases:[...(s.phases??[]),{phase:`Phase ${(s.phases?.length??0)+1}`,title:"",desc:""}]})} className="flex items-center gap-1.5 text-xs font-bold text-brand hover:underline"><Plus className="w-3.5 h-3.5"/> Add Phase</button>
          </>}
          {["overview","challenge","solution","text"].includes(s.type) && <>
            <Field label="Section Title" value={s.title??""} onChange={v=>update({title:v})} />
            <Field label="Content" value={s.content??""} textarea rows={4} onChange={v=>update({content:v})} />
            <ImageField label="Side Image (optional)" value={s.image??""} onChange={v=>update({image:v})} />
            {(s.points??[]).map((pt,pi)=>(
              <div key={pi} className="flex gap-2">
                <input value={pt} onChange={e=>{const pp=[...(s.points!)];pp[pi]=e.target.value;update({points:pp});}} placeholder="Point…" className="flex-1 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-brand"/>
                <button onClick={()=>update({points:s.points!.filter((_,i)=>i!==pi)})} className="p-2 rounded-xl bg-red-50 text-red-400 hover:bg-red-500 hover:text-white"><Trash2 className="w-3 h-3"/></button>
              </div>
            ))}
            <button onClick={()=>update({points:[...(s.points??[]),""]}) } className="flex items-center gap-1.5 text-xs font-bold text-brand hover:underline"><Plus className="w-3.5 h-3.5"/> Add Point</button>
          </>}
        </div>
      )}
    </div>
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
      <label className="field-label">{label}</label>
      {textarea ? <textarea value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder} rows={rows} className={cls+" resize-none"}/> : <input type={type} value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder} className={cls}/>}
    </div>
  );
}

function ImageField({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div className="space-y-2">
      <label className="field-label">{label}</label>
      <div className="flex gap-3 items-start">
        <div className="w-16 h-12 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 flex-shrink-0 flex items-center justify-center">
          {value ? <img src={value} alt="" className="w-full h-full object-cover" onError={e=>{(e.target as HTMLImageElement).style.display="none";}} /> : <ImageIcon className="w-4 h-4 text-slate-300"/>}
        </div>
        <input type="text" value={value} onChange={e=>onChange(e.target.value)} placeholder="https://…" className="flex-1 border border-slate-200 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:border-brand bg-white placeholder:text-slate-300"/>
      </div>
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

function TagsField({ label, tags, onChange }: { label: string; tags: string[]; onChange: (t: string[]) => void }) {
  const [input, setInput] = useState("");
  const add = () => { if (input.trim()) { onChange([...tags, input.trim()]); setInput(""); } };
  return (
    <div className="space-y-2">
      <label className="field-label">{label}</label>
      <div className="flex flex-wrap gap-2 mb-2">
        {tags.map((t,i) => (
          <span key={i} className="flex items-center gap-1 text-[10px] font-bold bg-brand/8 text-brand border border-brand/15 rounded-full px-3 py-1">
            {t} <button onClick={()=>onChange(tags.filter((_,j)=>j!==i))} className="ml-0.5 hover:text-rose-500">×</button>
          </span>
        ))}
      </div>
      <div className="flex gap-2">
        <input value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>{if(e.key==="Enter"){e.preventDefault();add();}}} placeholder="Add tag…" className="flex-1 border border-slate-200 rounded-2xl px-4 py-2.5 text-sm focus:outline-none focus:border-brand bg-white placeholder:text-slate-300"/>
        <button onClick={add} className="px-4 py-2.5 bg-brand text-white rounded-2xl text-xs font-bold hover:bg-brand/90"><Plus className="w-3.5 h-3.5"/></button>
      </div>
    </div>
  );
}

function ToggleSetting({ label, desc, value, onChange }: { label: string; desc: string; value: boolean; onChange: (v: boolean) => void }) {
  return (
    <div className="flex items-start justify-between py-3.5 border-b border-slate-100 last:border-0">
      <div><p className="text-sm font-semibold text-slate-700">{label}</p><p className="text-xs text-slate-400 mt-0.5">{desc}</p></div>
      <button onClick={()=>onChange(!value)} className={`relative w-10 h-5 rounded-full transition-colors flex-shrink-0 ml-6 mt-0.5 ${value?"bg-brand":"bg-slate-200"}`}>
        <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all ${value?"left-5":"left-0.5"}`}/>
      </button>
    </div>
  );
}

function buildDefaultSection(type: SectionType): CaseSection {
  const base: CaseSection = { id: uid(), type };
  if (type==="comparison")     return {...base,title:"Before vs. After",comparison:{before_label:"Before",after_label:"After Digi Pexel",rows:[{before:"",after:""}]}};
  if (type==="metrics")        return {...base,title:"Results & Impact",metrics:[{label:"Time Saved",value:"85%",desc:"Reduction in manual work"}]};
  if (type==="timeline")       return {...base,title:"Implementation Timeline",phases:[{phase:"Phase 1",title:"Discovery",desc:""}]};
  if (type==="mid_cta")        return {...base,cta_text:"Ready to achieve similar results?",cta_label:"Book a Strategy Call"};
  if (type==="testimonial")    return {...base,quote:"",author:"",author_role:"",author_company:"",author_avatar:""};
  if (type==="tech_stack")     return {...base,title:"Technology Stack",content:"",tech_items:[{name:"",desc:""}]};
  if (type==="image_gallery")  return {...base,title:"Screenshots & Results",gallery:[]};
  if (type==="solution_scope") return {...base,title:"Solution Scope",content:"",scope_items:[""]};
  if (type==="final_outcomes") return {...base,title:"Final Outcomes",content:"",outcomes:[{icon:"",title:"",desc:""}]};
  return {...base,title:"",content:"",image:"",points:[]};
}
