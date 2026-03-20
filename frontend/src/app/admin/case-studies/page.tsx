"use client";

import React, { useState, useEffect } from "react";
import {
  Plus, Trash2, Save, MoveUp, MoveDown, ChevronDown, ChevronUp,
  FileText, AlertTriangle, Lightbulb, BarChart3, Zap, Clock,
  Table2, BookOpen, Image as ImageIcon, Quote, Layers, LayoutGrid,
} from "lucide-react";
import { safeFetch } from "@/lib/utils";

// ── Types ─────────────────────────────────────────────────────────────────────
type SectionType =
  | "overview" | "challenge" | "solution" | "timeline" | "comparison"
  | "metrics" | "results" | "text" | "mid_cta"
  | "testimonial" | "tech_stack" | "image_gallery";

interface Metric      { label: string; value: string; desc: string }
interface Phase       { phase: string; title: string; desc: string }
interface CompRow     { before: string; after: string }
interface HeroStat    { label: string; value: string }
interface GalleryImage{ url: string; caption: string }

interface CaseSection {
  id: string;
  type: SectionType;
  title?: string;
  content?: string;
  image?: string;          // optional side image for overview/challenge/solution/text
  points?: string[];
  comparison?: { before_label: string; after_label: string; rows: CompRow[] };
  metrics?: Metric[];
  cta_text?: string;
  cta_label?: string;
  phases?: Phase[];
  // testimonial
  quote?: string;
  author?: string;
  author_role?: string;
  author_company?: string;
  author_avatar?: string;
  // tech_stack
  tech_tags?: string[];
  // image_gallery
  gallery?: GalleryImage[];
}

interface CaseStudy {
  id?: number;
  title: string;
  slug: string;
  eyebrow: string;
  subtitle: string;
  description: string;
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
}

// ── Defaults ──────────────────────────────────────────────────────────────────
const defaultCase = (): CaseStudy => ({
  title: "New Case Study",
  slug: "new-case-study-" + Date.now(),
  eyebrow: "Case Study",
  subtitle: "",
  description: "",
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
});

const SECTION_TYPES: { type: SectionType; label: string; icon: React.ReactNode; desc: string }[] = [
  { type: "overview",      label: "Overview",          icon: <BookOpen      className="w-4 h-4" />, desc: "Executive summary"          },
  { type: "challenge",     label: "Challenge",         icon: <AlertTriangle className="w-4 h-4" />, desc: "Problem statement + points" },
  { type: "solution",      label: "Solution",          icon: <Lightbulb     className="w-4 h-4" />, desc: "Approach + bullet points"   },
  { type: "timeline",      label: "Timeline / Phases", icon: <Clock         className="w-4 h-4" />, desc: "Numbered phase breakdown"   },
  { type: "comparison",    label: "Before / After",    icon: <Table2        className="w-4 h-4" />, desc: "Comparison table"           },
  { type: "metrics",       label: "Metrics / Results", icon: <BarChart3     className="w-4 h-4" />, desc: "KPI cards with numbers"     },
  { type: "text",          label: "Text Block",        icon: <FileText      className="w-4 h-4" />, desc: "Free-form content"          },
  { type: "mid_cta",       label: "Mid-Article CTA",   icon: <Zap           className="w-4 h-4" />, desc: "Inline call-to-action"      },
  { type: "testimonial",   label: "Testimonial",       icon: <Quote         className="w-4 h-4" />, desc: "Client quote block"         },
  { type: "tech_stack",    label: "Tech Stack",        icon: <Layers        className="w-4 h-4" />, desc: "Technology badge grid"      },
  { type: "image_gallery", label: "Image Gallery",     icon: <LayoutGrid    className="w-4 h-4" />, desc: "Screenshot / image grid"    },
];

function uid() { return Math.random().toString(36).slice(2, 9); }
function slugify(s: string) { return s.toLowerCase().trim().replace(/[^a-z0-9-]+/g, "-").replace(/^-+|-+$/g, ""); }

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function AdminCaseStudyPage() {
  const [cases, setCases] = useState<CaseStudy[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<number | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"info" | "hero" | "sections" | "settings">("info");
  const [addSectionOpen, setAddSectionOpen] = useState(false);

  useEffect(() => { fetchCases(); }, []);

  const fetchCases = async () => {
    try {
      const data = await safeFetch("/api/case_studies.php?admin=1");
      if (data && data.status === "success") setCases(data.data);
    } catch {}
    finally { setLoading(false); }
  };

  const addCase = () => {
    const nc = defaultCase();
    setCases(prev => [...prev, nc]);
    setExpandedId(nc.slug);
    setActiveTab("info");
  };

  const updateCase = (idx: number, patch: Partial<CaseStudy>) => {
    setCases(prev => { const n = [...prev]; n[idx] = { ...n[idx], ...patch }; return n; });
  };

  const removeCase = (idx: number) => {
    if (!confirm("Delete this case study?")) return;
    const c = cases[idx];
    if (c.id) {
      fetch("/api/case_studies.php", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "delete_case", id: c.id }) });
    }
    setCases(prev => prev.filter((_, i) => i !== idx));
  };

  const saveCase = async (idx: number) => {
    const c = cases[idx];
    setSaving(idx);
    try {
      const data = await safeFetch("/api/case_studies.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "save_case", case: c }),
      });
      if (data && data.status === "success") {
        if (!c.id && data.id) updateCase(idx, { id: data.id });
        alert("Saved successfully!");
      } else { alert("Save failed: " + data.message); }
    } catch { alert("Connection error."); }
    finally { setSaving(null); }
  };

  const moveCase = (idx: number, dir: "up" | "down") => {
    if (dir === "up" && idx === 0) return;
    if (dir === "down" && idx === cases.length - 1) return;
    const n = [...cases];
    const t = dir === "up" ? idx - 1 : idx + 1;
    [n[idx], n[t]] = [n[t], n[idx]];
    setCases(n);
  };

  if (loading) return <div className="p-10 text-slate-400 font-bold text-xs uppercase tracking-widest">Loading Case Vault...</div>;

  return (
    <div className="pb-32 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-start justify-between mb-10">
        <div>
          <h1 className="text-3xl font-display font-bold text-slate-900 tracking-tight">Case Vault</h1>
          <p className="text-slate-500 text-sm mt-1">Build, manage, and publish detailed client case studies.</p>
        </div>
        <button onClick={addCase} className="flex items-center gap-2 bg-brand text-white px-6 py-3 rounded-2xl text-xs font-bold uppercase tracking-widest hover:bg-brand/90 transition-all shadow-lg shadow-brand/20">
          <Plus className="w-4 h-4" /> New Case Study
        </button>
      </div>

      {/* Case list */}
      <div className="space-y-4">
        {cases.length === 0 && (
          <div className="border-2 border-dashed border-slate-200 rounded-3xl py-20 text-center text-slate-400 text-sm font-bold uppercase tracking-widest">
            No case studies yet — click "New Case Study" to begin
          </div>
        )}

        {cases.map((c, idx) => {
          const isExpanded = expandedId === (c.id ? String(c.id) : c.slug);
          const toggleId   = c.id ? String(c.id) : c.slug;

          return (
            <div key={c.id ?? c.slug} className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden">

              {/* ── Card Header ── */}
              <div className="flex items-center justify-between px-7 py-5 cursor-pointer hover:bg-slate-50/50 transition-colors" onClick={() => { setExpandedId(isExpanded ? null : toggleId); setActiveTab("info"); }}>
                <div className="flex items-center gap-4 min-w-0">
                  <div className="w-14 h-10 rounded-xl overflow-hidden bg-slate-100 flex-shrink-0">
                    {c.image_url ? <img src={c.image_url} alt="" className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center"><ImageIcon className="w-4 h-4 text-slate-300" /></div>}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-slate-900 text-sm truncate max-w-xs">{c.title || "Untitled"}</span>
                      <span className={`text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full ${c.status === "published" ? "bg-emerald-50 text-emerald-600 border border-emerald-200" : "bg-amber-50 text-amber-600 border border-amber-200"}`}>{c.status}</span>
                      {c.featured && <span className="text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full bg-yellow-50 text-yellow-600 border border-yellow-200">Featured</span>}
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5">{c.client_name || "—"} · {c.industry || "—"} · {c.sections.length} sections</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0 ml-4">
                  <button onClick={e => { e.stopPropagation(); moveCase(idx, "up"); }} className="p-1.5 rounded-lg bg-slate-50 text-slate-400 hover:text-brand transition-colors"><MoveUp className="w-3.5 h-3.5" /></button>
                  <button onClick={e => { e.stopPropagation(); moveCase(idx, "down"); }} className="p-1.5 rounded-lg bg-slate-50 text-slate-400 hover:text-brand transition-colors"><MoveDown className="w-3.5 h-3.5" /></button>
                  <button onClick={e => { e.stopPropagation(); saveCase(idx); }} disabled={saving === idx}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-brand text-white text-xs font-bold hover:bg-brand/90 transition-all disabled:opacity-50">
                    <Save className="w-3.5 h-3.5" /> {saving === idx ? "Saving…" : "Save"}
                  </button>
                  <button onClick={e => { e.stopPropagation(); removeCase(idx); }} className="p-1.5 rounded-lg bg-red-50 text-red-500 hover:bg-red-500 hover:text-white transition-all"><Trash2 className="w-3.5 h-3.5" /></button>
                  {isExpanded ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                </div>
              </div>

              {/* ── Expanded Editor ── */}
              {isExpanded && (
                <div className="border-t border-slate-100">
                  {/* Tab bar */}
                  <div className="flex border-b border-slate-100 bg-slate-50/50 px-7">
                    {(["info", "hero", "sections", "settings"] as const).map(tab => (
                      <button key={tab} onClick={() => setActiveTab(tab)}
                        className={`py-3 px-4 text-[10px] font-black uppercase tracking-widest transition-colors border-b-2 -mb-px ${activeTab === tab ? "border-brand text-brand" : "border-transparent text-slate-400 hover:text-slate-600"}`}>
                        {tab === "info" ? "Basic Info" : tab === "hero" ? "Hero & Stats" : tab === "sections" ? `Sections (${c.sections.length})` : "Settings"}
                      </button>
                    ))}
                  </div>

                  <div className="p-7">

                    {/* ── TAB: Info ── */}
                    {activeTab === "info" && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="md:col-span-2 grid grid-cols-3 gap-4">
                          <Field label="Eyebrow Badge" value={c.eyebrow} onChange={v => updateCase(idx, { eyebrow: v })} />
                          <Field label="Slug (URL)" value={c.slug} mono onChange={v => updateCase(idx, { slug: v })} />
                          <Field label="Read Time" value={c.read_time} onChange={v => updateCase(idx, { read_time: v })} placeholder="8 min read" />
                        </div>
                        <div className="md:col-span-2">
                          <Field label="Title" value={c.title} large onChange={v => updateCase(idx, { title: v, slug: c.id ? c.slug : slugify(v) })} />
                        </div>
                        <div className="md:col-span-2">
                          <Field label="Subtitle / Punchline" value={c.subtitle} onChange={v => updateCase(idx, { subtitle: v })} />
                        </div>
                        <div className="md:col-span-2">
                          <Field label="Description (hero paragraph)" value={c.description} textarea rows={3} onChange={v => updateCase(idx, { description: v })} placeholder="A brief paragraph shown in the hero section describing the case study…" />
                        </div>
                        <Field label="Client Name" value={c.client_name} onChange={v => updateCase(idx, { client_name: v })} />
                        <Field label="Industry" value={c.industry} onChange={v => updateCase(idx, { industry: v })} placeholder="FinTech, E-commerce…" />
                        <Field label="Published Date" value={c.published_date} type="date" onChange={v => updateCase(idx, { published_date: v })} />
                        <TagsField label="Service Tags" tags={c.service_tags} onChange={v => updateCase(idx, { service_tags: v })} />
                        <div className="md:col-span-2">
                          <ImageField label="Hero Product Image (right side of hero)" value={c.image_url} onChange={v => updateCase(idx, { image_url: v })} />
                        </div>
                        <div className="md:col-span-2">
                          <ImageField label="Client / Person Image URL" value={c.client_image} onChange={v => updateCase(idx, { client_image: v })} />
                        </div>
                        <div className="md:col-span-2">
                          <Field label="Client Logo URL (shown inverted/white in dark hero)" value={c.client_logo} onChange={v => updateCase(idx, { client_logo: v })} />
                        </div>
                      </div>
                    )}

                    {/* ── TAB: Hero & Stats ── */}
                    {activeTab === "hero" && (
                      <div className="space-y-8">
                        {/* CTA button */}
                        <div>
                          <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-4">Hero CTA Button</p>
                          <div className="grid grid-cols-2 gap-4">
                            <Field label="Button Label" value={c.hero_cta_label} onChange={v => updateCase(idx, { hero_cta_label: v })} placeholder="View Case Study" />
                            <Field label="Button URL" value={c.hero_cta_url} onChange={v => updateCase(idx, { hero_cta_url: v })} placeholder="#contact" />
                          </div>
                        </div>

                        {/* Hero Stats strip */}
                        <div>
                          <div className="flex items-center justify-between mb-4">
                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Hero Stats Strip (up to 4)</p>
                            {(c.hero_stats ?? []).length < 4 && (
                              <button
                                onClick={() => updateCase(idx, { hero_stats: [...(c.hero_stats ?? []), { value: "", label: "" }] })}
                                className="flex items-center gap-1.5 text-xs font-bold text-brand hover:underline">
                                <Plus className="w-3.5 h-3.5" /> Add Stat
                              </button>
                            )}
                          </div>

                          {(c.hero_stats ?? []).length === 0 && (
                            <div className="border-2 border-dashed border-slate-200 rounded-2xl py-8 text-center text-slate-400 text-xs font-bold uppercase tracking-widest">
                              No stats yet — click "Add Stat" to create hero metrics
                            </div>
                          )}

                          <div className="space-y-3">
                            {(c.hero_stats ?? []).map((stat, si) => (
                              <div key={si} className="flex gap-3 items-start">
                                <div className="flex-1 bg-slate-50 border border-slate-200 rounded-2xl p-4 grid grid-cols-2 gap-3">
                                  <Field
                                    label="Value (big number)"
                                    value={stat.value}
                                    onChange={v => {
                                      const stats = [...(c.hero_stats ?? [])];
                                      stats[si] = { ...stats[si], value: v };
                                      updateCase(idx, { hero_stats: stats });
                                    }}
                                    placeholder="85%"
                                    large
                                  />
                                  <Field
                                    label="Label"
                                    value={stat.label}
                                    onChange={v => {
                                      const stats = [...(c.hero_stats ?? [])];
                                      stats[si] = { ...stats[si], label: v };
                                      updateCase(idx, { hero_stats: stats });
                                    }}
                                    placeholder="Reduction in manual work"
                                  />
                                </div>
                                <button
                                  onClick={() => updateCase(idx, { hero_stats: (c.hero_stats ?? []).filter((_, i) => i !== si) })}
                                  className="p-2.5 mt-6 rounded-xl bg-red-50 text-red-400 hover:bg-red-500 hover:text-white transition-all">
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            ))}
                          </div>

                          {(c.hero_stats ?? []).length > 0 && (
                            <div className="mt-4 bg-slate-900 rounded-2xl p-4">
                              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Preview (dark hero strip)</p>
                              <div className={`grid gap-4 ${(c.hero_stats ?? []).length > 2 ? "grid-cols-4" : "grid-cols-2"}`}>
                                {(c.hero_stats ?? []).map((stat, si) => (
                                  <div key={si} className="text-center">
                                    <div className="text-2xl font-black text-white">{stat.value || "—"}</div>
                                    <div className="text-xs text-slate-400 mt-1">{stat.label || "Label"}</div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* ── TAB: Sections ── */}
                    {activeTab === "sections" && (
                      <div>
                        {c.sections.length === 0 && (
                          <div className="border-2 border-dashed border-slate-200 rounded-2xl py-10 text-center text-slate-400 text-xs font-bold uppercase tracking-widest mb-6">
                            No sections yet — add your first section below
                          </div>
                        )}

                        <div className="space-y-4 mb-6">
                          {c.sections.map((sec, si) => (
                            <SectionEditor
                              key={sec.id}
                              section={sec}
                              onChange={updated => {
                                const secs = [...c.sections];
                                secs[si] = updated;
                                updateCase(idx, { sections: secs });
                              }}
                              onRemove={() => { const secs = c.sections.filter((_, i) => i !== si); updateCase(idx, { sections: secs }); }}
                              onMove={(dir) => {
                                if (dir === "up" && si === 0) return;
                                if (dir === "down" && si === c.sections.length - 1) return;
                                const secs = [...c.sections];
                                const t = dir === "up" ? si - 1 : si + 1;
                                [secs[si], secs[t]] = [secs[t], secs[si]];
                                updateCase(idx, { sections: secs });
                              }}
                            />
                          ))}
                        </div>

                        {/* Add section picker */}
                        <div className="border border-slate-200 rounded-2xl overflow-hidden">
                          <button className="w-full flex items-center justify-between px-5 py-4 text-xs font-black uppercase tracking-widest text-slate-500 hover:bg-slate-50 transition-colors"
                            onClick={() => setAddSectionOpen(!addSectionOpen)}>
                            <span className="flex items-center gap-2"><Plus className="w-4 h-4 text-brand" /> Add Section</span>
                            {addSectionOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                          </button>
                          {addSectionOpen && (
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 p-5 border-t border-slate-100 bg-slate-50/30">
                              {SECTION_TYPES.map(st => (
                                <button key={st.type}
                                  onClick={() => {
                                    const ns = buildDefaultSection(st.type);
                                    updateCase(idx, { sections: [...c.sections, ns] });
                                    setAddSectionOpen(false);
                                  }}
                                  className="flex flex-col items-start gap-1.5 p-4 rounded-2xl bg-white border border-slate-200 hover:border-brand hover:shadow-sm transition-all text-left">
                                  <span className="text-brand">{st.icon}</span>
                                  <span className="text-xs font-bold text-slate-700">{st.label}</span>
                                  <span className="text-[10px] text-slate-400">{st.desc}</span>
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* ── TAB: Settings ── */}
                    {activeTab === "settings" && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <ToggleSetting label="Show Related Case Studies" desc="Display 3 related case studies after the content" value={c.show_related} onChange={v => updateCase(idx, { show_related: v })} />
                          <ToggleSetting label="Show Industry Section" desc="Show industry-filtered case studies section" value={c.show_industry_section} onChange={v => updateCase(idx, { show_industry_section: v })} />
                          <ToggleSetting label="Featured" desc="Highlight this case study on the listing page" value={c.featured} onChange={v => updateCase(idx, { featured: v })} />
                        </div>
                        <div className="space-y-5">
                          <div>
                            <label className="field-label">Status</label>
                            <select value={c.status} onChange={e => updateCase(idx, { status: e.target.value as any })} className="w-full border border-slate-200 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:border-brand bg-white">
                              <option value="draft">Draft (hidden from public)</option>
                              <option value="published">Published (visible to all)</option>
                            </select>
                          </div>
                          {c.show_industry_section && (
                            <Field label="Industry Section Title" value={c.industry_section_title} onChange={v => updateCase(idx, { industry_section_title: v })} placeholder={`More ${c.industry || "Industry"} Case Studies`} />
                          )}
                          <Field label="Position (order in listing)" value={String(c.position)} type="number" onChange={v => updateCase(idx, { position: Number(v) })} />
                        </div>
                        <div className="md:col-span-2 border-t border-slate-100 pt-5">
                          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3">Preview URL</p>
                          <p className="font-mono text-xs text-brand bg-brand/5 border border-brand/10 rounded-xl px-4 py-2">
                            /case-studies/{c.slug || "your-slug"}
                          </p>
                        </div>
                      </div>
                    )}

                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Section Editor ─────────────────────────────────────────────────────────────
function SectionEditor({ section: s, onChange, onRemove, onMove }: {
  section: CaseSection;
  onChange: (s: CaseSection) => void;
  onRemove: () => void;
  onMove: (dir: "up" | "down") => void;
}) {
  const [open, setOpen] = useState(true);
  const [techInput, setTechInput] = useState("");
  const meta = SECTION_TYPES.find(t => t.type === s.type)!;

  const update = (patch: Partial<CaseSection>) => onChange({ ...s, ...patch });

  return (
    <div className="border border-slate-200 rounded-2xl overflow-hidden">
      {/* Section header */}
      <div className="flex items-center justify-between bg-slate-50 px-5 py-3 cursor-pointer" onClick={() => setOpen(!open)}>
        <div className="flex items-center gap-3">
          <span className="text-brand">{meta.icon}</span>
          <span className="text-xs font-bold text-slate-700">{meta.label}</span>
          {s.title && <span className="text-xs text-slate-400 truncate max-w-48">— {s.title}</span>}
        </div>
        <div className="flex items-center gap-1.5">
          <button onClick={e => { e.stopPropagation(); onMove("up"); }}   className="p-1 rounded-lg bg-white border border-slate-200 text-slate-400 hover:text-brand"><MoveUp   className="w-3 h-3" /></button>
          <button onClick={e => { e.stopPropagation(); onMove("down"); }} className="p-1 rounded-lg bg-white border border-slate-200 text-slate-400 hover:text-brand"><MoveDown className="w-3 h-3" /></button>
          <button onClick={e => { e.stopPropagation(); onRemove(); }}     className="p-1 rounded-lg bg-red-50 text-red-400 hover:bg-red-500 hover:text-white"><Trash2   className="w-3 h-3" /></button>
          {open ? <ChevronUp className="w-4 h-4 text-slate-400 ml-1" /> : <ChevronDown className="w-4 h-4 text-slate-400 ml-1" />}
        </div>
      </div>

      {open && (
        <div className="p-5 space-y-4">

          {/* mid_cta */}
          {s.type === "mid_cta" && <>
            <Field label="CTA Text" value={s.cta_text ?? ""} onChange={v => update({ cta_text: v })} placeholder="Ready to achieve similar results?" />
            <Field label="Button Label" value={s.cta_label ?? ""} onChange={v => update({ cta_label: v })} placeholder="Book a Strategy Call" />
          </>}

          {/* testimonial */}
          {s.type === "testimonial" && <>
            <Field label="Quote" value={s.quote ?? ""} textarea rows={4} onChange={v => update({ quote: v })} placeholder="The platform transformed how our team operates…" />
            <div className="grid grid-cols-2 gap-4">
              <Field label="Author Name" value={s.author ?? ""} onChange={v => update({ author: v })} placeholder="Jane Smith" />
              <Field label="Author Role" value={s.author_role ?? ""} onChange={v => update({ author_role: v })} placeholder="CEO" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Company" value={s.author_company ?? ""} onChange={v => update({ author_company: v })} placeholder="Acme Corp" />
              <ImageField label="Author Avatar URL (optional)" value={s.author_avatar ?? ""} onChange={v => update({ author_avatar: v })} />
            </div>
          </>}

          {/* tech_stack */}
          {s.type === "tech_stack" && <>
            <Field label="Section Title" value={s.title ?? ""} onChange={v => update({ title: v })} placeholder="Technology Stack" />
            <div className="space-y-2">
              <label className="field-label">Technologies / Tags</label>
              <div className="flex flex-wrap gap-2 mb-2">
                {(s.tech_tags ?? []).map((tag, ti) => (
                  <span key={ti} className="flex items-center gap-1 text-[10px] font-bold bg-brand/8 text-brand border border-brand/15 rounded-full px-3 py-1">
                    {tag}
                    <button onClick={() => update({ tech_tags: (s.tech_tags ?? []).filter((_, i) => i !== ti) })} className="ml-0.5 hover:text-rose-500">×</button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  value={techInput}
                  onChange={e => setTechInput(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      if (techInput.trim()) { update({ tech_tags: [...(s.tech_tags ?? []), techInput.trim()] }); setTechInput(""); }
                    }
                  }}
                  placeholder="React, Node.js, AWS…"
                  className="flex-1 border border-slate-200 rounded-2xl px-4 py-2.5 text-sm focus:outline-none focus:border-brand bg-white placeholder:text-slate-300"
                />
                <button
                  onClick={() => { if (techInput.trim()) { update({ tech_tags: [...(s.tech_tags ?? []), techInput.trim()] }); setTechInput(""); } }}
                  className="px-4 py-2.5 bg-brand text-white rounded-2xl text-xs font-bold hover:bg-brand/90">
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </>}

          {/* image_gallery */}
          {s.type === "image_gallery" && <>
            <Field label="Section Title" value={s.title ?? ""} onChange={v => update({ title: v })} placeholder="Screenshots & Results" />
            <div className="space-y-2">
              <label className="field-label">Gallery Images</label>
              {(s.gallery ?? []).map((img, gi) => (
                <div key={gi} className="flex gap-3 items-start bg-slate-50 border border-slate-200 rounded-2xl p-3">
                  <div className="w-16 h-12 rounded-xl overflow-hidden bg-slate-200 flex-shrink-0">
                    {img.url ? <img src={img.url} alt="" className="w-full h-full object-cover" onError={e => { (e.target as HTMLImageElement).style.display = "none"; }} /> : <div className="w-full h-full flex items-center justify-center"><ImageIcon className="w-4 h-4 text-slate-300" /></div>}
                  </div>
                  <div className="flex-1 space-y-2">
                    <input
                      value={img.url}
                      onChange={e => { const g = [...(s.gallery ?? [])]; g[gi] = { ...g[gi], url: e.target.value }; update({ gallery: g }); }}
                      placeholder="Image URL…"
                      className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-brand bg-white"
                    />
                    <input
                      value={img.caption}
                      onChange={e => { const g = [...(s.gallery ?? [])]; g[gi] = { ...g[gi], caption: e.target.value }; update({ gallery: g }); }}
                      placeholder="Caption (optional)…"
                      className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-brand bg-white"
                    />
                  </div>
                  <button onClick={() => update({ gallery: (s.gallery ?? []).filter((_, i) => i !== gi) })} className="p-2 rounded-xl bg-red-50 text-red-400 hover:bg-red-500 hover:text-white flex-shrink-0"><Trash2 className="w-3 h-3" /></button>
                </div>
              ))}
              <button onClick={() => update({ gallery: [...(s.gallery ?? []), { url: "", caption: "" }] })} className="flex items-center gap-1.5 text-xs font-bold text-brand hover:underline mt-1">
                <Plus className="w-3.5 h-3.5" /> Add Image
              </button>
            </div>
          </>}

          {/* comparison */}
          {s.type === "comparison" && <>
            <Field label="Section Title" value={s.title ?? ""} onChange={v => update({ title: v })} />
            <Field label="Section Content" value={s.content ?? ""} textarea onChange={v => update({ content: v })} />
            <div className="grid grid-cols-2 gap-4">
              <Field label="Before Label" value={s.comparison?.before_label ?? "Before"} onChange={v => update({ comparison: { ...s.comparison!, before_label: v } })} />
              <Field label="After Label"  value={s.comparison?.after_label  ?? "After"}  onChange={v => update({ comparison: { ...s.comparison!, after_label: v  } })} />
            </div>
            <div className="space-y-2">
              <label className="field-label">Rows</label>
              {(s.comparison?.rows ?? []).map((row, ri) => (
                <div key={ri} className="flex gap-2">
                  <input value={row.before} onChange={e => { const rows = [...(s.comparison!.rows)]; rows[ri] = { ...rows[ri], before: e.target.value }; update({ comparison: { ...s.comparison!, rows } }); }} placeholder="Before…" className="flex-1 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-brand" />
                  <input value={row.after}  onChange={e => { const rows = [...(s.comparison!.rows)]; rows[ri] = { ...rows[ri], after:  e.target.value }; update({ comparison: { ...s.comparison!, rows } }); }} placeholder="After…"  className="flex-1 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-brand" />
                  <button onClick={() => { const rows = s.comparison!.rows.filter((_, i) => i !== ri); update({ comparison: { ...s.comparison!, rows } }); }} className="p-2 rounded-xl bg-red-50 text-red-400 hover:bg-red-500 hover:text-white"><Trash2 className="w-3 h-3" /></button>
                </div>
              ))}
              <button onClick={() => update({ comparison: { before_label: s.comparison?.before_label ?? "Before", after_label: s.comparison?.after_label ?? "After", rows: [...(s.comparison?.rows ?? []), { before: "", after: "" }] } })} className="flex items-center gap-1.5 text-xs font-bold text-brand hover:underline mt-1">
                <Plus className="w-3.5 h-3.5" /> Add Row
              </button>
            </div>
          </>}

          {/* metrics / results */}
          {(s.type === "metrics" || s.type === "results") && <>
            <Field label="Section Title" value={s.title ?? ""} onChange={v => update({ title: v })} />
            <Field label="Section Content" value={s.content ?? ""} textarea onChange={v => update({ content: v })} />
            <div className="space-y-2">
              <label className="field-label">Metric Cards</label>
              {(s.metrics ?? []).map((m, mi) => (
                <div key={mi} className="grid grid-cols-[1fr_1fr_2fr_auto] gap-2 items-start">
                  <input value={m.value} onChange={e => { const mm = [...(s.metrics!)]; mm[mi] = { ...mm[mi], value: e.target.value }; update({ metrics: mm }); }} placeholder="85%" className="border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-brand font-bold" />
                  <input value={m.label} onChange={e => { const mm = [...(s.metrics!)]; mm[mi] = { ...mm[mi], label: e.target.value }; update({ metrics: mm }); }} placeholder="Time Saved" className="border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-brand" />
                  <input value={m.desc}  onChange={e => { const mm = [...(s.metrics!)]; mm[mi] = { ...mm[mi], desc:  e.target.value }; update({ metrics: mm }); }} placeholder="Reduction in manual work" className="border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-brand" />
                  <button onClick={() => update({ metrics: s.metrics!.filter((_, i) => i !== mi) })} className="p-2 rounded-xl bg-red-50 text-red-400 hover:bg-red-500 hover:text-white"><Trash2 className="w-3 h-3" /></button>
                </div>
              ))}
              <button onClick={() => update({ metrics: [...(s.metrics ?? []), { value: "", label: "", desc: "" }] })} className="flex items-center gap-1.5 text-xs font-bold text-brand hover:underline">
                <Plus className="w-3.5 h-3.5" /> Add Metric
              </button>
            </div>
          </>}

          {/* timeline */}
          {s.type === "timeline" && <>
            <Field label="Section Title" value={s.title ?? ""} onChange={v => update({ title: v })} />
            <Field label="Section Content" value={s.content ?? ""} textarea onChange={v => update({ content: v })} />
            <div className="space-y-2">
              <label className="field-label">Phases</label>
              {(s.phases ?? []).map((p, pi) => (
                <div key={pi} className="grid grid-cols-[1fr_2fr_3fr_auto] gap-2 items-start">
                  <input value={p.phase} onChange={e => { const pp = [...(s.phases!)]; pp[pi] = { ...pp[pi], phase: e.target.value }; update({ phases: pp }); }} placeholder="Phase 1" className="border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-brand" />
                  <input value={p.title} onChange={e => { const pp = [...(s.phases!)]; pp[pi] = { ...pp[pi], title: e.target.value }; update({ phases: pp }); }} placeholder="Discovery" className="border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-brand" />
                  <input value={p.desc}  onChange={e => { const pp = [...(s.phases!)]; pp[pi] = { ...pp[pi], desc:  e.target.value }; update({ phases: pp }); }} placeholder="Description…" className="border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-brand" />
                  <button onClick={() => update({ phases: s.phases!.filter((_, i) => i !== pi) })} className="p-2 rounded-xl bg-red-50 text-red-400 hover:bg-red-500 hover:text-white"><Trash2 className="w-3 h-3" /></button>
                </div>
              ))}
              <button onClick={() => update({ phases: [...(s.phases ?? []), { phase: `Phase ${(s.phases?.length ?? 0) + 1}`, title: "", desc: "" }] })} className="flex items-center gap-1.5 text-xs font-bold text-brand hover:underline">
                <Plus className="w-3.5 h-3.5" /> Add Phase
              </button>
            </div>
          </>}

          {/* overview / challenge / solution / text — with optional side image */}
          {["overview", "challenge", "solution", "text"].includes(s.type) && <>
            <Field label="Section Title" value={s.title ?? ""} onChange={v => update({ title: v })} placeholder={`e.g. The ${s.type.charAt(0).toUpperCase() + s.type.slice(1)}`} />
            <Field label="Content" value={s.content ?? ""} textarea rows={5} onChange={v => update({ content: v })} />
            <ImageField label="Side Image (optional — adds 2-col layout)" value={s.image ?? ""} onChange={v => update({ image: v })} />
            <div className="space-y-2">
              <label className="field-label">Bullet Points (optional)</label>
              {(s.points ?? []).map((pt, pi) => (
                <div key={pi} className="flex gap-2">
                  <input value={pt} onChange={e => { const pp = [...(s.points!)]; pp[pi] = e.target.value; update({ points: pp }); }} className="flex-1 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-brand" placeholder="Point…" />
                  <button onClick={() => update({ points: s.points!.filter((_, i) => i !== pi) })} className="p-2 rounded-xl bg-red-50 text-red-400 hover:bg-red-500 hover:text-white"><Trash2 className="w-3 h-3" /></button>
                </div>
              ))}
              <button onClick={() => update({ points: [...(s.points ?? []), ""] })} className="flex items-center gap-1.5 text-xs font-bold text-brand hover:underline">
                <Plus className="w-3.5 h-3.5" /> Add Point
              </button>
            </div>
          </>}

        </div>
      )}
    </div>
  );
}

// ── Field helpers ──────────────────────────────────────────────────────────────
function Field({ label, value, onChange, placeholder = "", type = "text", mono = false, large = false, textarea = false, rows = 3 }: {
  label: string; value: string; onChange: (v: string) => void;
  placeholder?: string; type?: string; mono?: boolean; large?: boolean; textarea?: boolean; rows?: number;
}) {
  const cls = `w-full border border-slate-200 rounded-2xl px-4 py-3 focus:outline-none focus:border-brand transition-colors bg-white placeholder:text-slate-300 ${mono ? "font-mono text-xs" : large ? "text-base font-bold" : "text-sm"}`;
  return (
    <div className="space-y-1">
      <label className="field-label">{label}</label>
      {textarea
        ? <textarea value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} rows={rows} className={cls + " resize-none"} />
        : <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} className={cls} />}
    </div>
  );
}

function ImageField({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div className="space-y-2">
      <label className="field-label">{label}</label>
      <div className="flex gap-3 items-start">
        <div className="w-20 h-14 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 flex-shrink-0 flex items-center justify-center">
          {value ? <img src={value} alt="" className="w-full h-full object-cover" onError={e => { (e.target as HTMLImageElement).style.display = "none"; }} /> : <ImageIcon className="w-5 h-5 text-slate-300" />}
        </div>
        <input type="text" value={value} onChange={e => onChange(e.target.value)} placeholder="https://…" className="flex-1 border border-slate-200 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:border-brand bg-white placeholder:text-slate-300" />
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
        {tags.map((t, i) => (
          <span key={i} className="flex items-center gap-1 text-[10px] font-bold bg-brand/8 text-brand border border-brand/15 rounded-full px-3 py-1">
            {t} <button onClick={() => onChange(tags.filter((_, j) => j !== i))} className="ml-0.5 hover:text-rose-500">×</button>
          </span>
        ))}
      </div>
      <div className="flex gap-2">
        <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); add(); } }} placeholder="Add tag…" className="flex-1 border border-slate-200 rounded-2xl px-4 py-2.5 text-sm focus:outline-none focus:border-brand bg-white placeholder:text-slate-300" />
        <button onClick={add} className="px-4 py-2.5 bg-brand text-white rounded-2xl text-xs font-bold hover:bg-brand/90"><Plus className="w-3.5 h-3.5" /></button>
      </div>
    </div>
  );
}

function ToggleSetting({ label, desc, value, onChange }: { label: string; desc: string; value: boolean; onChange: (v: boolean) => void }) {
  return (
    <div className="flex items-start justify-between py-4 border-b border-slate-100 last:border-0">
      <div>
        <p className="text-sm font-bold text-slate-700">{label}</p>
        <p className="text-xs text-slate-400 mt-0.5">{desc}</p>
      </div>
      <button onClick={() => onChange(!value)} className={`relative w-10 h-5 rounded-full transition-colors flex-shrink-0 ml-6 mt-0.5 ${value ? "bg-brand" : "bg-slate-200"}`}>
        <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all ${value ? "left-5" : "left-0.5"}`} />
      </button>
    </div>
  );
}

// ── Build default section ──────────────────────────────────────────────────────
function buildDefaultSection(type: SectionType): CaseSection {
  const base: CaseSection = { id: uid(), type };
  if (type === "comparison")    return { ...base, title: "Before vs. After", comparison: { before_label: "Before", after_label: "After Digi Pexel", rows: [{ before: "", after: "" }] } };
  if (type === "metrics")       return { ...base, title: "Results & Impact", metrics: [{ label: "Time Saved", value: "85%", desc: "Reduction in manual work" }] };
  if (type === "timeline")      return { ...base, title: "Implementation Timeline", phases: [{ phase: "Phase 1", title: "Discovery", desc: "" }] };
  if (type === "mid_cta")       return { ...base, cta_text: "Ready to achieve similar results?", cta_label: "Book a Strategy Call" };
  if (type === "testimonial")   return { ...base, quote: "", author: "", author_role: "", author_company: "", author_avatar: "" };
  if (type === "tech_stack")    return { ...base, title: "Technology Stack", tech_tags: [] };
  if (type === "image_gallery") return { ...base, title: "Screenshots & Results", gallery: [] };
  return { ...base, title: "", content: "", image: "", points: [] };
}
