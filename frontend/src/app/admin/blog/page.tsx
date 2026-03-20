"use client";

import React, { useState, useEffect } from "react";
import {
  Plus, Trash2, Save, MoveUp, MoveDown, ChevronDown, ChevronUp,
  FileText, AlertTriangle, Lightbulb, BarChart3, Zap, Clock,
  Table2, BookOpen, Image as ImageIcon, User,
} from "lucide-react";
import { safeFetch } from "@/lib/utils";

// ── Types ─────────────────────────────────────────────────────────────────────
type SectionType = "overview" | "challenge" | "solution" | "timeline" | "comparison" | "metrics" | "results" | "text" | "mid_cta";

interface Metric  { label: string; value: string; desc: string }
interface Phase   { phase: string; title: string; desc: string }
interface CompRow { before: string; after: string }

interface BlogSection {
  id: string;
  type: SectionType;
  title?: string;
  content?: string;
  points?: string[];
  comparison?: { before_label: string; after_label: string; rows: CompRow[] };
  metrics?: Metric[];
  cta_text?: string;
  cta_label?: string;
  phases?: Phase[];
}

interface BlogPost {
  id?: number;
  title: string;
  slug: string;
  eyebrow: string;
  subtitle: string;
  excerpt: string;
  content: string;
  image_url: string;
  category: string;
  tags: string;
  author_name: string;
  author_image: string;
  author_role: string;
  read_time: string;
  sections: BlogSection[];
  show_related: boolean;
  show_category_section: boolean;
  status: "published" | "draft";
  featured: boolean;
  published_at: string;
  position: number;
}

// ── Defaults ──────────────────────────────────────────────────────────────────
const defaultPost = (): BlogPost => ({
  title: "New Article",
  slug: "new-article-" + Date.now(),
  eyebrow: "Article",
  subtitle: "",
  excerpt: "",
  content: "",
  image_url: "",
  category: "Technology",
  tags: "",
  author_name: "Digi Pexel Team",
  author_image: "",
  author_role: "",
  read_time: "5 min read",
  sections: [],
  show_related: true,
  show_category_section: false,
  status: "draft",
  featured: false,
  published_at: new Date().toISOString().slice(0, 10),
  position: 0,
});

const SECTION_TYPES: { type: SectionType; label: string; icon: React.ReactNode; desc: string }[] = [
  { type: "overview",   label: "Overview",          icon: <BookOpen      className="w-4 h-4" />, desc: "Intro / summary block"      },
  { type: "text",       label: "Text Block",        icon: <FileText      className="w-4 h-4" />, desc: "Free-form paragraphs"       },
  { type: "challenge",  label: "Challenge",         icon: <AlertTriangle className="w-4 h-4" />, desc: "Problem + bullet points"    },
  { type: "solution",   label: "Solution",          icon: <Lightbulb    className="w-4 h-4" />, desc: "Approach + bullet points"   },
  { type: "timeline",   label: "Timeline",          icon: <Clock         className="w-4 h-4" />, desc: "Numbered phase breakdown"   },
  { type: "comparison", label: "Before / After",    icon: <Table2        className="w-4 h-4" />, desc: "Comparison table"           },
  { type: "metrics",    label: "Stats / Data",      icon: <BarChart3     className="w-4 h-4" />, desc: "KPI cards with numbers"     },
  { type: "mid_cta",    label: "Mid-Article CTA",   icon: <Zap           className="w-4 h-4" />, desc: "Inline call-to-action"      },
];

function uid() { return Math.random().toString(36).slice(2, 9); }
function slugify(s: string) { return s.toLowerCase().trim().replace(/[^a-z0-9-]+/g, "-").replace(/^-+|-+$/g, ""); }

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function AdminBlogPage() {
  const [posts, setPosts]         = useState<BlogPost[]>([]);
  const [loading, setLoading]     = useState(true);
  const [saving, setSaving]       = useState<number | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"info" | "sections" | "settings">("info");
  const [addOpen, setAddOpen]     = useState(false);

  useEffect(() => { fetchPosts(); }, []);

  const fetchPosts = async () => {
    try {
      const data = await safeFetch("/api/blogs.php?admin=1");
      if (data && data.status === "success") setPosts(data.data);
    } catch {}
    finally { setLoading(false); }
  };

  const addPost = () => {
    const np = defaultPost();
    setPosts(prev => [...prev, np]);
    setExpandedId(np.slug);
    setActiveTab("info");
  };

  const updatePost = (idx: number, patch: Partial<BlogPost>) => {
    setPosts(prev => { const n = [...prev]; n[idx] = { ...n[idx], ...patch }; return n; });
  };

  const removePost = (idx: number) => {
    if (!confirm("Delete this article?")) return;
    const p = posts[idx];
    if (p.id) {
      fetch("/api/blogs.php", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "delete_post", id: p.id }) });
    }
    setPosts(prev => prev.filter((_, i) => i !== idx));
  };

  const savePost = async (idx: number) => {
    const p = posts[idx];
    setSaving(idx);
    try {
      const data = await safeFetch("/api/blogs.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "save_post", post: p }),
      });
      if (data && data.status === "success") {
        if (!p.id && data.id) updatePost(idx, { id: data.id });
        alert("Saved successfully!");
      } else { alert("Save failed: " + data.message); }
    } catch { alert("Connection error."); }
    finally { setSaving(null); }
  };

  const movePost = (idx: number, dir: "up" | "down") => {
    if (dir === "up" && idx === 0) return;
    if (dir === "down" && idx === posts.length - 1) return;
    const n = [...posts];
    const t = dir === "up" ? idx - 1 : idx + 1;
    [n[idx], n[t]] = [n[t], n[idx]];
    setPosts(n);
  };

  if (loading) return <div className="p-10 text-slate-400 font-bold text-xs uppercase tracking-widest">Loading Blog Hub…</div>;

  return (
    <div className="pb-32 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-start justify-between mb-10">
        <div>
          <h1 className="text-3xl font-display font-bold text-slate-900 tracking-tight">Blog Hub</h1>
          <p className="text-slate-500 text-sm mt-1">Create and manage rich, structured articles with sections, stats, and CTAs.</p>
        </div>
        <button onClick={addPost} className="flex items-center gap-2 bg-brand text-white px-6 py-3 rounded-2xl text-xs font-bold uppercase tracking-widest hover:bg-brand/90 transition-all shadow-lg shadow-brand/20">
          <Plus className="w-4 h-4" /> New Article
        </button>
      </div>

      {/* Post list */}
      <div className="space-y-4">
        {posts.length === 0 && (
          <div className="border-2 border-dashed border-slate-200 rounded-3xl py-20 text-center text-slate-400 text-sm font-bold uppercase tracking-widest">
            No articles yet — click "New Article" to begin
          </div>
        )}

        {posts.map((p, idx) => {
          const isExpanded = expandedId === (p.id ? String(p.id) : p.slug);
          const toggleId   = p.id ? String(p.id) : p.slug;

          return (
            <div key={p.id ?? p.slug} className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden">

              {/* Card header */}
              <div className="flex items-center justify-between px-7 py-5 cursor-pointer hover:bg-slate-50/50 transition-colors" onClick={() => { setExpandedId(isExpanded ? null : toggleId); setActiveTab("info"); }}>
                <div className="flex items-center gap-4 min-w-0">
                  <div className="w-14 h-10 rounded-xl overflow-hidden bg-slate-100 flex-shrink-0">
                    {p.image_url ? <img src={p.image_url} alt="" className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center"><ImageIcon className="w-4 h-4 text-slate-300" /></div>}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-slate-900 text-sm truncate max-w-xs">{p.title || "Untitled"}</span>
                      <span className={`text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full ${p.status === "published" ? "bg-emerald-50 text-emerald-600 border border-emerald-200" : "bg-amber-50 text-amber-600 border border-amber-200"}`}>{p.status}</span>
                      {p.featured && <span className="text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full bg-yellow-50 text-yellow-600 border border-yellow-200">Featured</span>}
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5">{p.category} · {p.author_name} · {p.sections.length} sections · {p.published_at}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0 ml-4">
                  <button onClick={e => { e.stopPropagation(); movePost(idx, "up"); }}   className="p-1.5 rounded-lg bg-slate-50 text-slate-400 hover:text-brand transition-colors"><MoveUp   className="w-3.5 h-3.5" /></button>
                  <button onClick={e => { e.stopPropagation(); movePost(idx, "down"); }} className="p-1.5 rounded-lg bg-slate-50 text-slate-400 hover:text-brand transition-colors"><MoveDown className="w-3.5 h-3.5" /></button>
                  <button onClick={e => { e.stopPropagation(); savePost(idx); }} disabled={saving === idx}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-brand text-white text-xs font-bold hover:bg-brand/90 transition-all disabled:opacity-50">
                    <Save className="w-3.5 h-3.5" /> {saving === idx ? "Saving…" : "Save"}
                  </button>
                  <button onClick={e => { e.stopPropagation(); removePost(idx); }} className="p-1.5 rounded-lg bg-red-50 text-red-500 hover:bg-red-500 hover:text-white transition-all"><Trash2 className="w-3.5 h-3.5" /></button>
                  {isExpanded ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                </div>
              </div>

              {/* Expanded editor */}
              {isExpanded && (
                <div className="border-t border-slate-100">
                  {/* Tab bar */}
                  <div className="flex border-b border-slate-100 bg-slate-50/50 px-7">
                    {(["info", "sections", "settings"] as const).map(tab => (
                      <button key={tab} onClick={() => setActiveTab(tab)}
                        className={`py-3 px-4 text-[10px] font-black uppercase tracking-widest transition-colors border-b-2 -mb-px ${activeTab === tab ? "border-brand text-brand" : "border-transparent text-slate-400 hover:text-slate-600"}`}>
                        {tab === "info" ? "Basic Info" : tab === "sections" ? `Sections (${p.sections.length})` : "Settings"}
                      </button>
                    ))}
                  </div>

                  <div className="p-7">

                    {/* ── TAB: Info ── */}
                    {activeTab === "info" && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="md:col-span-2 grid grid-cols-3 gap-4">
                          <Field label="Eyebrow Label" value={p.eyebrow} onChange={v => updatePost(idx, { eyebrow: v })} placeholder="Article" />
                          <Field label="Slug (URL)" value={p.slug} mono onChange={v => updatePost(idx, { slug: v })} />
                          <Field label="Read Time" value={p.read_time} onChange={v => updatePost(idx, { read_time: v })} placeholder="5 min read" />
                        </div>
                        <div className="md:col-span-2">
                          <Field label="Title" value={p.title} large onChange={v => updatePost(idx, { title: v, slug: p.id ? p.slug : slugify(v) })} />
                        </div>
                        <div className="md:col-span-2">
                          <Field label="Subtitle" value={p.subtitle} onChange={v => updatePost(idx, { subtitle: v })} />
                        </div>
                        <div className="md:col-span-2">
                          <Field label="Excerpt (card summary)" value={p.excerpt} textarea rows={2} onChange={v => updatePost(idx, { excerpt: v })} />
                        </div>
                        <Field label="Category" value={p.category} onChange={v => updatePost(idx, { category: v })} placeholder="Technology, Strategy…" />
                        <Field label="Tags (comma-separated)" value={p.tags} onChange={v => updatePost(idx, { tags: v })} placeholder="AI, Automation, SEO" />
                        <Field label="Publish Date" value={p.published_at} type="date" onChange={v => updatePost(idx, { published_at: v })} />
                        <div className="md:col-span-2">
                          <ImageField label="Cover Image URL" value={p.image_url} onChange={v => updatePost(idx, { image_url: v })} />
                        </div>
                        <div className="border-t border-slate-100 pt-5 md:col-span-2">
                          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4 flex items-center gap-2"><User className="w-3.5 h-3.5" /> Author</p>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <Field label="Author Name" value={p.author_name} onChange={v => updatePost(idx, { author_name: v })} placeholder="Digi Pexel Team" />
                            <Field label="Author Role" value={p.author_role} onChange={v => updatePost(idx, { author_role: v })} placeholder="AI Strategy Lead" />
                            <Field label="Author Photo URL" value={p.author_image} onChange={v => updatePost(idx, { author_image: v })} />
                          </div>
                        </div>
                        <div className="md:col-span-2 border-t border-slate-100 pt-5">
                          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3">Legacy HTML Content (used only if no sections)</p>
                          <Field label="" value={p.content} textarea rows={6} onChange={v => updatePost(idx, { content: v })} />
                        </div>
                      </div>
                    )}

                    {/* ── TAB: Sections ── */}
                    {activeTab === "sections" && (
                      <div>
                        <p className="text-xs text-slate-400 mb-5">Sections replace the legacy content field. Add structured blocks to build a rich article layout with a table of contents.</p>

                        {p.sections.length === 0 && (
                          <div className="border-2 border-dashed border-slate-200 rounded-2xl py-10 text-center text-slate-400 text-xs font-bold uppercase tracking-widest mb-6">
                            No sections yet — add your first section below
                          </div>
                        )}

                        <div className="space-y-4 mb-6">
                          {p.sections.map((sec, si) => (
                            <SectionEditor
                              key={sec.id}
                              section={sec}
                              onChange={updated => {
                                const secs = [...p.sections]; secs[si] = updated;
                                updatePost(idx, { sections: secs });
                              }}
                              onRemove={() => updatePost(idx, { sections: p.sections.filter((_, i) => i !== si) })}
                              onMove={dir => {
                                if (dir === "up" && si === 0) return;
                                if (dir === "down" && si === p.sections.length - 1) return;
                                const secs = [...p.sections];
                                const t = dir === "up" ? si - 1 : si + 1;
                                [secs[si], secs[t]] = [secs[t], secs[si]];
                                updatePost(idx, { sections: secs });
                              }}
                            />
                          ))}
                        </div>

                        {/* Section type picker */}
                        <div className="border border-slate-200 rounded-2xl overflow-hidden">
                          <button className="w-full flex items-center justify-between px-5 py-4 text-xs font-black uppercase tracking-widest text-slate-500 hover:bg-slate-50 transition-colors"
                            onClick={() => setAddOpen(!addOpen)}>
                            <span className="flex items-center gap-2"><Plus className="w-4 h-4 text-brand" /> Add Section</span>
                            {addOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                          </button>
                          {addOpen && (
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 p-5 border-t border-slate-100 bg-slate-50/30">
                              {SECTION_TYPES.map(st => (
                                <button key={st.type}
                                  onClick={() => { updatePost(idx, { sections: [...p.sections, buildDefaultSection(st.type)] }); setAddOpen(false); }}
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
                          <ToggleSetting label="Show Related Articles" desc="Display 3 related posts after the content" value={p.show_related} onChange={v => updatePost(idx, { show_related: v })} />
                          <ToggleSetting label="Show Category Section" desc="Show more posts from the same category" value={p.show_category_section} onChange={v => updatePost(idx, { show_category_section: v })} />
                          <ToggleSetting label="Featured" desc="Highlight this article on the listing page" value={p.featured} onChange={v => updatePost(idx, { featured: v })} />
                        </div>
                        <div className="space-y-5">
                          <div>
                            <label className="field-label">Status</label>
                            <select value={p.status} onChange={e => updatePost(idx, { status: e.target.value as any })} className="w-full border border-slate-200 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:border-brand bg-white">
                              <option value="draft">Draft (hidden from public)</option>
                              <option value="published">Published (visible to all)</option>
                            </select>
                          </div>
                          <Field label="Position (order)" value={String(p.position)} type="number" onChange={v => updatePost(idx, { position: Number(v) })} />
                        </div>
                        <div className="md:col-span-2 border-t border-slate-100 pt-5">
                          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Preview URL</p>
                          <p className="font-mono text-xs text-brand bg-brand/5 border border-brand/10 rounded-xl px-4 py-2">
                            /blog/{p.slug || "your-slug"}
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
  section: BlogSection; onChange: (s: BlogSection) => void; onRemove: () => void; onMove: (d: "up"|"down") => void;
}) {
  const [open, setOpen] = useState(true);
  const meta = SECTION_TYPES.find(t => t.type === s.type)!;
  const update = (patch: Partial<BlogSection>) => onChange({ ...s, ...patch });

  return (
    <div className="border border-slate-200 rounded-2xl overflow-hidden">
      <div className="flex items-center justify-between bg-slate-50 px-5 py-3 cursor-pointer" onClick={() => setOpen(!open)}>
        <div className="flex items-center gap-3">
          <span className="text-brand">{meta?.icon}</span>
          <span className="text-xs font-bold text-slate-700">{meta?.label}</span>
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
          {s.type === "mid_cta" && <>
            <Field label="CTA Text" value={s.cta_text ?? ""} onChange={v => update({ cta_text: v })} placeholder="Want to learn more?" />
            <Field label="Button Label" value={s.cta_label ?? ""} onChange={v => update({ cta_label: v })} placeholder="Get In Touch" />
          </>}

          {s.type === "comparison" && <>
            <Field label="Section Title" value={s.title ?? ""} onChange={v => update({ title: v })} />
            <Field label="Content" value={s.content ?? ""} textarea onChange={v => update({ content: v })} />
            <div className="grid grid-cols-2 gap-4">
              <Field label="Before Label" value={s.comparison?.before_label ?? "Before"} onChange={v => update({ comparison: { ...s.comparison!, before_label: v } })} />
              <Field label="After Label"  value={s.comparison?.after_label  ?? "After"}  onChange={v => update({ comparison: { ...s.comparison!, after_label: v  } })} />
            </div>
            <div className="space-y-2">
              <label className="field-label">Rows</label>
              {(s.comparison?.rows ?? []).map((row, ri) => (
                <div key={ri} className="flex gap-2">
                  <input value={row.before} onChange={e => { const rows=[...(s.comparison!.rows)]; rows[ri]={...rows[ri],before:e.target.value}; update({comparison:{...s.comparison!,rows}}); }} placeholder="Before…" className="flex-1 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-brand" />
                  <input value={row.after}  onChange={e => { const rows=[...(s.comparison!.rows)]; rows[ri]={...rows[ri],after:e.target.value};  update({comparison:{...s.comparison!,rows}}); }} placeholder="After…"  className="flex-1 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-brand" />
                  <button onClick={() => update({comparison:{...s.comparison!,rows:s.comparison!.rows.filter((_,i)=>i!==ri)}})} className="p-2 rounded-xl bg-red-50 text-red-400 hover:bg-red-500 hover:text-white"><Trash2 className="w-3 h-3" /></button>
                </div>
              ))}
              <button onClick={() => update({comparison:{before_label:s.comparison?.before_label??"Before",after_label:s.comparison?.after_label??"After",rows:[...(s.comparison?.rows??[]),{before:"",after:""}]}})} className="flex items-center gap-1.5 text-xs font-bold text-brand hover:underline">
                <Plus className="w-3.5 h-3.5" /> Add Row
              </button>
            </div>
          </>}

          {(s.type === "metrics" || s.type === "results") && <>
            <Field label="Section Title" value={s.title ?? ""} onChange={v => update({ title: v })} />
            <Field label="Content" value={s.content ?? ""} textarea onChange={v => update({ content: v })} />
            <div className="space-y-2">
              <label className="field-label">Stats/Metrics</label>
              {(s.metrics ?? []).map((m, mi) => (
                <div key={mi} className="grid grid-cols-[1fr_1fr_2fr_auto] gap-2">
                  <input value={m.value} onChange={e=>{const mm=[...(s.metrics!)];mm[mi]={...mm[mi],value:e.target.value};update({metrics:mm});}} placeholder="85%" className="border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-brand font-bold" />
                  <input value={m.label} onChange={e=>{const mm=[...(s.metrics!)];mm[mi]={...mm[mi],label:e.target.value};update({metrics:mm});}} placeholder="Metric Label" className="border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-brand" />
                  <input value={m.desc}  onChange={e=>{const mm=[...(s.metrics!)];mm[mi]={...mm[mi],desc:e.target.value};update({metrics:mm});}}  placeholder="Short description" className="border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-brand" />
                  <button onClick={()=>update({metrics:s.metrics!.filter((_,i)=>i!==mi)})} className="p-2 rounded-xl bg-red-50 text-red-400 hover:bg-red-500 hover:text-white"><Trash2 className="w-3 h-3" /></button>
                </div>
              ))}
              <button onClick={()=>update({metrics:[...(s.metrics??[]),{value:"",label:"",desc:""}]})} className="flex items-center gap-1.5 text-xs font-bold text-brand hover:underline">
                <Plus className="w-3.5 h-3.5" /> Add Metric
              </button>
            </div>
          </>}

          {s.type === "timeline" && <>
            <Field label="Section Title" value={s.title ?? ""} onChange={v => update({ title: v })} />
            <Field label="Content" value={s.content ?? ""} textarea onChange={v => update({ content: v })} />
            <div className="space-y-2">
              <label className="field-label">Phases</label>
              {(s.phases ?? []).map((ph, pi) => (
                <div key={pi} className="grid grid-cols-[1fr_2fr_3fr_auto] gap-2">
                  <input value={ph.phase} onChange={e=>{const pp=[...(s.phases!)];pp[pi]={...pp[pi],phase:e.target.value};update({phases:pp});}} placeholder="Phase 1" className="border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-brand" />
                  <input value={ph.title} onChange={e=>{const pp=[...(s.phases!)];pp[pi]={...pp[pi],title:e.target.value};update({phases:pp});}} placeholder="Title" className="border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-brand" />
                  <input value={ph.desc}  onChange={e=>{const pp=[...(s.phases!)];pp[pi]={...pp[pi],desc:e.target.value};update({phases:pp});}}  placeholder="Description" className="border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-brand" />
                  <button onClick={()=>update({phases:s.phases!.filter((_,i)=>i!==pi)})} className="p-2 rounded-xl bg-red-50 text-red-400 hover:bg-red-500 hover:text-white"><Trash2 className="w-3 h-3" /></button>
                </div>
              ))}
              <button onClick={()=>update({phases:[...(s.phases??[]),{phase:`Phase ${(s.phases?.length??0)+1}`,title:"",desc:""}]})} className="flex items-center gap-1.5 text-xs font-bold text-brand hover:underline">
                <Plus className="w-3.5 h-3.5" /> Add Phase
              </button>
            </div>
          </>}

          {["overview","challenge","solution","text"].includes(s.type) && <>
            <Field label="Section Title" value={s.title ?? ""} onChange={v => update({ title: v })} placeholder={s.type === "text" ? "Section heading (optional)" : `e.g. The ${s.type.charAt(0).toUpperCase()}${s.type.slice(1)}`} />
            <Field label="Content" value={s.content ?? ""} textarea rows={5} onChange={v => update({ content: v })} />
            <div className="space-y-2">
              <label className="field-label">Bullet Points (optional)</label>
              {(s.points ?? []).map((pt, pi) => (
                <div key={pi} className="flex gap-2">
                  <input value={pt} onChange={e=>{const pp=[...(s.points!)];pp[pi]=e.target.value;update({points:pp});}} placeholder="Point…" className="flex-1 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-brand" />
                  <button onClick={()=>update({points:s.points!.filter((_,i)=>i!==pi)})} className="p-2 rounded-xl bg-red-50 text-red-400 hover:bg-red-500 hover:text-white"><Trash2 className="w-3 h-3" /></button>
                </div>
              ))}
              <button onClick={()=>update({points:[...(s.points??[]),""]}) } className="flex items-center gap-1.5 text-xs font-bold text-brand hover:underline">
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
function Field({ label, value, onChange, placeholder="", type="text", mono=false, large=false, textarea=false, rows=3 }: {
  label: string; value: string; onChange: (v: string) => void;
  placeholder?: string; type?: string; mono?: boolean; large?: boolean; textarea?: boolean; rows?: number;
}) {
  const cls = `w-full border border-slate-200 rounded-2xl px-4 py-3 focus:outline-none focus:border-brand transition-colors bg-white placeholder:text-slate-300 ${mono ? "font-mono text-xs" : large ? "text-base font-bold" : "text-sm"}`;
  return (
    <div className="space-y-1">
      {label && <label className="field-label">{label}</label>}
      {textarea ? <textarea value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder} rows={rows} className={cls+" resize-none"} /> : <input type={type} value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder} className={cls} />}
    </div>
  );
}

function ImageField({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div className="space-y-2">
      <label className="field-label">{label}</label>
      <div className="flex gap-3 items-start">
        <div className="w-20 h-14 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 flex-shrink-0 flex items-center justify-center">
          {value ? <img src={value} alt="" className="w-full h-full object-cover" onError={e=>{(e.target as HTMLImageElement).style.display="none";}} /> : <ImageIcon className="w-5 h-5 text-slate-300" />}
        </div>
        <input type="text" value={value} onChange={e=>onChange(e.target.value)} placeholder="https://…" className="flex-1 border border-slate-200 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:border-brand bg-white placeholder:text-slate-300" />
      </div>
    </div>
  );
}

function ToggleSetting({ label, desc, value, onChange }: { label: string; desc: string; value: boolean; onChange: (v: boolean) => void }) {
  return (
    <div className="flex items-start justify-between py-4 border-b border-slate-100 last:border-0">
      <div><p className="text-sm font-bold text-slate-700">{label}</p><p className="text-xs text-slate-400 mt-0.5">{desc}</p></div>
      <button onClick={() => onChange(!value)} className={`relative w-10 h-5 rounded-full transition-colors flex-shrink-0 ml-6 mt-0.5 ${value ? "bg-brand" : "bg-slate-200"}`}>
        <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all ${value ? "left-5" : "left-0.5"}`} />
      </button>
    </div>
  );
}

function buildDefaultSection(type: SectionType): BlogSection {
  const base: BlogSection = { id: uid(), type };
  if (type === "comparison") return { ...base, title: "Before vs. After", comparison: { before_label: "Before", after_label: "After", rows: [{ before: "", after: "" }] } };
  if (type === "metrics")    return { ...base, title: "Key Stats",  metrics: [{ label: "Metric", value: "0%", desc: "" }] };
  if (type === "timeline")   return { ...base, title: "How It Works", phases: [{ phase: "Phase 1", title: "", desc: "" }] };
  if (type === "mid_cta")    return { ...base, cta_text: "Want to learn more?", cta_label: "Get In Touch" };
  return { ...base, title: "", content: "", points: [] };
}
