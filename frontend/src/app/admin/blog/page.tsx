"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Plus, Trash2, MoveUp, MoveDown, ChevronDown, ChevronUp,
  FileText, AlertTriangle, Lightbulb, BarChart3, Zap, Clock,
  Table2, BookOpen, Image as ImageIcon, User, Upload,
  ArrowLeft, Eye, Pencil, Search,
} from "lucide-react";
import { safeFetch, cn, uploadFile } from "@/lib/utils";
import { API_BASE_URL } from "@/lib/constants";
import AdminLayout from "@/components/admin/admin-layout";
import RichBodyEditor from "@/components/admin/rich-body-editor";

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
  form_heading: string;
  faqs: { question: string; answer: string }[];
  status: "published" | "draft" | "scheduled";
  scheduled_at: string;
  featured: boolean;
  published_at: string;
  position: number;
  meta_title: string;
  meta_description: string;
}

// ── Defaults ──────────────────────────────────────────────────────────────────
const defaultPost = (): BlogPost => ({
  title: "",
  slug: "",
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
  form_heading: "",
  faqs: [],
  status: "draft",
  scheduled_at: "",
  featured: false,
  published_at: new Date().toISOString().slice(0, 10),
  position: 0,
  meta_title: "",
  meta_description: "",
});

const SECTION_TYPES: { type: SectionType; label: string; icon: React.ReactNode; desc: string }[] = [
  { type: "overview",   label: "Overview",        icon: <BookOpen      className="w-4 h-4" />, desc: "Intro / summary block"    },
  { type: "text",       label: "Text Block",      icon: <FileText      className="w-4 h-4" />, desc: "Free-form paragraphs"     },
  { type: "challenge",  label: "Challenge",       icon: <AlertTriangle className="w-4 h-4" />, desc: "Problem + bullet points"  },
  { type: "solution",   label: "Solution",        icon: <Lightbulb     className="w-4 h-4" />, desc: "Approach + bullet points" },
  { type: "timeline",   label: "Timeline",        icon: <Clock         className="w-4 h-4" />, desc: "Numbered phase breakdown" },
  { type: "comparison", label: "Before / After",  icon: <Table2        className="w-4 h-4" />, desc: "Comparison table"         },
  { type: "metrics",    label: "Stats / Data",    icon: <BarChart3     className="w-4 h-4" />, desc: "KPI cards with numbers"   },
  { type: "mid_cta",    label: "Mid-Article CTA", icon: <Zap           className="w-4 h-4" />, desc: "Inline call-to-action"    },
];

function uid() { return Math.random().toString(36).slice(2, 9); }
function slugify(s: string) { return s.toLowerCase().trim().replace(/[^a-z0-9-]+/g, "-").replace(/^-+|-+$/g, ""); }

// ── Seed fallback ─────────────────────────────────────────────────────────────
const SEED_POSTS: BlogPost[] = [
  { id: 1, title: "How AI Automation Eliminates 14 Hours of Manual Work Per Week", slug: "ai-automation-eliminates-manual-work", eyebrow: "AI Strategy", subtitle: "", excerpt: "Every knowledge worker loses hours each week on repetitive tasks.", content: "", image_url: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&q=80&w=800", category: "AI Strategy", tags: "automation, AI", author_name: "Digi Pexel Team", author_image: "", author_role: "", read_time: "8 min read", sections: [], show_related: true, show_category_section: true, form_heading: "", faqs: [], status: "published", scheduled_at: "", featured: false, published_at: "2025-03-14", position: 0, meta_title: "", meta_description: "" },
  { id: 2, title: "SEO in the Age of AI: How to Win When LLMs Answer Instead of Google", slug: "seo-age-of-ai-llm-answers", eyebrow: "SEO Strategy", subtitle: "", excerpt: "Search is changing. AI assistants now answer questions directly.", content: "", image_url: "https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?auto=format&fit=crop&q=80&w=800", category: "SEO", tags: "SEO, AI search", author_name: "Digi Pexel Team", author_image: "", author_role: "", read_time: "7 min read", sections: [], show_related: true, show_category_section: true, form_heading: "", faqs: [], status: "published", scheduled_at: "", featured: false, published_at: "2025-04-02", position: 1, meta_title: "", meta_description: "" },
  { id: 3, title: "How to Evaluate an AI Automation Agency: 8 Questions Every COO Must Ask", slug: "evaluate-ai-automation-agency-coo-guide", eyebrow: "Buyer Guide", subtitle: "", excerpt: "Most agencies overpromise and underdeliver on AI.", content: "", image_url: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&q=80&w=800", category: "Strategy", tags: "AI agency, automation", author_name: "Digi Pexel Team", author_image: "", author_role: "", read_time: "6 min read", sections: [], show_related: true, show_category_section: true, form_heading: "", faqs: [], status: "published", scheduled_at: "", featured: false, published_at: "2025-04-18", position: 2, meta_title: "", meta_description: "" },
];

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function AdminBlogPage() {
  const [posts, setPosts]     = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState(false);
  const [saving, setSaving]   = useState(false);
  const [view, setView]       = useState<"list" | "edit">("list");
  const [editKey, setEditKey] = useState<string | null>(null);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [addOpen, setAddOpen] = useState(false);
  const [search, setSearch]   = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "published" | "draft" | "scheduled">("all");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo]     = useState("");

  useEffect(() => { fetchPosts(); }, []);

  const fetchPosts = async () => {
    try {
      const data = await safeFetch(`${API_BASE_URL}/blogs.php?admin=1`);
      if (data?.status === "success") { setPosts(data.data as BlogPost[]); setApiError(false); }
      else { setPosts(SEED_POSTS); setApiError(true); }
    } catch { setPosts(SEED_POSTS); setApiError(true); }
    finally { setLoading(false); }
  };

  const editIdx = editKey ? posts.findIndex(p => (p.id ? String(p.id) : p.slug) === editKey) : -1;
  const editPost = editIdx >= 0 ? posts[editIdx] : null;

  const openNew = () => {
    const np = defaultPost();
    const key = "new-" + Date.now();
    np.slug = key;
    setPosts(prev => [np, ...prev]);
    setEditKey(key);
    setShowAdvanced(false);
    setView("edit");
  };

  const openEdit = (key: string) => {
    setEditKey(key);
    setShowAdvanced(false);
    setView("edit");
  };

  const updatePost = (idx: number, patch: Partial<BlogPost>) => {
    setPosts(prev => { const n = [...prev]; n[idx] = { ...n[idx], ...patch }; return n; });
  };

  const removePost = (idx: number) => {
    if (!confirm("Delete this article?")) return;
    const p = posts[idx];
    if (p.id) {
      fetch(`${API_BASE_URL}/blogs.php`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "delete_post", id: p.id }) });
    }
    setPosts(prev => prev.filter((_, i) => i !== idx));
    if (view === "edit") setView("list");
  };

  const savePost = async () => {
    if (!editPost || editIdx < 0) return;
    if (!editPost.title.trim()) { alert("Title is required."); return; }
    if (!editPost.slug.trim()) { alert("Slug is required."); return; }
    setSaving(true);
    try {
      const data = await safeFetch(`${API_BASE_URL}/blogs.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "save_post", post: editPost }),
      });
      if (data?.status === "success") {
        if (!editPost.id && data.id) updatePost(editIdx, { id: data.id as number });
        alert("Saved successfully!");
      } else { alert("Save failed: " + (data?.message ?? "Unknown error")); }
    } catch { alert("Connection error."); }
    finally { setSaving(false); }
  };

  const filtered = posts.filter(p => {
    if (!p.title.toLowerCase().includes(search.toLowerCase())) return false;
    if (statusFilter !== "all" && p.status !== statusFilter) return false;
    if (dateFrom && p.published_at && p.published_at < dateFrom) return false;
    if (dateTo   && p.published_at && p.published_at > dateTo)   return false;
    return true;
  });

  if (loading) return <AdminLayout><div className="p-10 text-slate-400 text-xs font-bold uppercase tracking-widest">Loading…</div></AdminLayout>;

  // ── EDIT VIEW ────────────────────────────────────────────────────────────────
  if (view === "edit" && editPost && editIdx >= 0) {
    const p = editPost;
    const idx = editIdx;
    const isNew = !p.id;

    return (
      <AdminLayout>
        <div className="pb-32 max-w-2xl mx-auto">

          {/* Top bar */}
          <div className="flex items-center gap-3 mb-8 flex-wrap">
            <button onClick={() => setView("list")} className="flex items-center gap-1.5 text-sm font-semibold text-slate-500 hover:text-slate-900 transition-colors">
              <ArrowLeft className="w-4 h-4" /> Blog Posts
            </button>
            <span className="text-slate-300">/</span>
            <span className="text-sm text-slate-700 truncate max-w-xs">{p.title || (isNew ? "New Blog Post" : "Edit Post")}</span>
            <div className="ml-auto flex items-center gap-2">
              <button onClick={() => setView("list")} className="px-4 py-2 text-sm text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
                Cancel <kbd className="text-[10px] text-slate-400 ml-1">Esc</kbd>
              </button>
              <a href={`/blog/${p.slug}`} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-4 py-2 text-sm text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
                <Eye className="w-3.5 h-3.5" /> Preview
              </a>
              <button onClick={savePost} disabled={saving}
                className="flex items-center gap-2 px-5 py-2 bg-slate-900 text-white text-sm font-semibold rounded-lg hover:bg-slate-800 transition-all disabled:opacity-50">
                {isNew ? "Create Post" : "Save Post"}
                {isNew && <kbd className="text-[10px] bg-white/20 px-1.5 py-0.5 rounded ml-0.5">F5</kbd>}
              </button>
            </div>
          </div>

          {/* Form */}
          <div className="space-y-6">

            {/* Title */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Title <span className="text-red-500">*</span></label>
              <input
                value={p.title}
                onChange={e => updatePost(idx, { title: e.target.value, slug: p.id ? p.slug : slugify(e.target.value) })}
                placeholder="Post title"
                className="w-full border border-slate-200 rounded-xl px-4 py-3 text-base font-semibold focus:outline-none focus:border-brand bg-white placeholder:text-slate-300"
              />
            </div>

            {/* Slug */}
            <div>
              <label className="block text-xs text-slate-400 mb-1.5">
                Slug <span className="italic">(auto-generated from title; edit to customize)</span>
              </label>
              <input
                value={p.slug}
                onChange={e => updatePost(idx, { slug: e.target.value })}
                className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm font-mono text-slate-600 focus:outline-none focus:border-brand bg-white"
              />
            </div>

            {/* Excerpt */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Excerpt</label>
              <textarea
                value={p.excerpt}
                onChange={e => updatePost(idx, { excerpt: e.target.value })}
                placeholder="Short summary shown in post listings…"
                rows={3}
                className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand bg-white resize-none placeholder:text-slate-300"
              />
            </div>

            {/* Cover Image */}
            <UploadImageField label="Cover Image" value={p.image_url} onChange={v => updatePost(idx, { image_url: v })} />

            {/* Status */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Status</label>
              <select
                value={p.status}
                onChange={e => updatePost(idx, { status: e.target.value as BlogPost["status"] })}
                className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand bg-white"
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
                <option value="scheduled">Scheduled</option>
              </select>
            </div>

            {p.status === "scheduled" && (
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Scheduled Date &amp; Time</label>
                <input
                  type="datetime-local"
                  value={p.scheduled_at || ""}
                  onChange={e => updatePost(idx, { scheduled_at: e.target.value })}
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand bg-white"
                />
              </div>
            )}

            {/* Meta Title */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                Meta Title <span className="text-xs font-normal text-slate-400">(SEO — defaults to post title if blank)</span>
              </label>
              <input
                value={p.meta_title}
                onChange={e => updatePost(idx, { meta_title: e.target.value })}
                placeholder="SEO page title"
                className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand bg-white placeholder:text-slate-300"
              />
            </div>

            {/* Meta Description */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                Meta Description <span className="text-xs font-normal text-brand">(SEO)</span>
              </label>
              <textarea
                value={p.meta_description}
                onChange={e => updatePost(idx, { meta_description: e.target.value })}
                placeholder="Brief description for search engines (150–160 characters)…"
                rows={3}
                className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand bg-white resize-none placeholder:text-slate-300"
              />
            </div>

            {/* Body */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                Body <span className="text-red-500">*</span>
              </label>
              <RichBodyEditor value={p.content} onChange={v => updatePost(idx, { content: v })} />
            </div>

            {/* Advanced toggle */}
            <button
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-800 border border-slate-200 rounded-xl px-4 py-3 w-full transition-colors"
            >
              {showAdvanced ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              Advanced options
              <span className="ml-auto text-xs text-slate-400 hidden sm:block">Author · Category · Tags · Sections · FAQs</span>
            </button>

            {showAdvanced && (
              <div className="space-y-6 border border-slate-200 rounded-2xl p-6 bg-slate-50/30">

                {/* Author */}
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3 flex items-center gap-1.5"><User className="w-3.5 h-3.5" /> Author</p>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <Field label="Author Name" value={p.author_name} onChange={v => updatePost(idx, { author_name: v })} placeholder="Digi Pexel Team" />
                    <Field label="Author Role" value={p.author_role} onChange={v => updatePost(idx, { author_role: v })} placeholder="AI Strategy Lead" />
                  </div>
                  <AuthorImageField value={p.author_image} onChange={v => updatePost(idx, { author_image: v })} />
                </div>

                {/* Meta */}
                <div className="grid grid-cols-2 gap-4">
                  <Field label="Category" value={p.category} onChange={v => updatePost(idx, { category: v })} placeholder="Technology, Strategy…" />
                  <Field label="Read Time" value={p.read_time} onChange={v => updatePost(idx, { read_time: v })} placeholder="5 min read" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <Field label="Tags (comma-separated)" value={p.tags} onChange={v => updatePost(idx, { tags: v })} placeholder="AI, Automation, SEO" />
                  <Field label="Eyebrow Label" value={p.eyebrow} onChange={v => updatePost(idx, { eyebrow: v })} placeholder="Article" />
                </div>
                <Field label="Publish Date" value={p.published_at} type="date" onChange={v => updatePost(idx, { published_at: v })} />
                <Field label="Sidebar Form Heading" value={p.form_heading} onChange={v => updatePost(idx, { form_heading: v })} placeholder="e.g. Plan an AI-led Automation for Your Business" />

                {/* Content Blocks */}
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Content Blocks</p>
                  <p className="text-xs text-slate-400 mb-4">Structured blocks override the Body field above when added.</p>
                  {p.sections.length === 0 ? (
                    <div className="border-2 border-dashed border-slate-200 rounded-2xl py-8 text-center text-slate-400 text-xs font-bold uppercase tracking-widest mb-4">
                      No blocks yet
                    </div>
                  ) : (
                    <div className="space-y-3 mb-4">
                      {p.sections.map((sec, si) => (
                        <SectionEditor key={sec.id} section={sec}
                          onChange={updated => { const s = [...p.sections]; s[si] = updated; updatePost(idx, { sections: s }); }}
                          onRemove={() => updatePost(idx, { sections: p.sections.filter((_, i) => i !== si) })}
                          onMove={dir => {
                            if (dir === "up" && si === 0) return;
                            if (dir === "down" && si === p.sections.length - 1) return;
                            const s = [...p.sections]; const t = dir === "up" ? si - 1 : si + 1;
                            [s[si], s[t]] = [s[t], s[si]]; updatePost(idx, { sections: s });
                          }}
                        />
                      ))}
                    </div>
                  )}
                  <div className="border border-slate-200 rounded-2xl overflow-hidden">
                    <button className="w-full flex items-center justify-between px-5 py-3.5 text-xs font-black uppercase tracking-widest text-slate-500 hover:bg-slate-50 transition-colors"
                      onClick={() => setAddOpen(!addOpen)}>
                      <span className="flex items-center gap-2"><Plus className="w-4 h-4 text-brand" /> Add Block</span>
                      {addOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                    {addOpen && (
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 p-4 border-t border-slate-100 bg-slate-50/30">
                        {SECTION_TYPES.map(st => (
                          <button key={st.type}
                            onClick={() => { updatePost(idx, { sections: [...p.sections, buildDefaultSection(st.type)] }); setAddOpen(false); }}
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

                {/* FAQs */}
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3">FAQs ({p.faqs.length})</p>
                  <div className="space-y-3 mb-3">
                    {p.faqs.map((faq, fi) => (
                      <div key={fi} className="border border-slate-200 rounded-xl p-4 space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">FAQ {fi + 1}</span>
                          <div className="flex gap-1">
                            <button onClick={() => { if (fi===0) return; const f=[...p.faqs];[f[fi],f[fi-1]]=[f[fi-1],f[fi]];updatePost(idx,{faqs:f}); }} className="p-1 rounded bg-slate-100 text-slate-400 hover:text-brand"><MoveUp className="w-3 h-3"/></button>
                            <button onClick={() => { if (fi===p.faqs.length-1) return; const f=[...p.faqs];[f[fi],f[fi+1]]=[f[fi+1],f[fi]];updatePost(idx,{faqs:f}); }} className="p-1 rounded bg-slate-100 text-slate-400 hover:text-brand"><MoveDown className="w-3 h-3"/></button>
                            <button onClick={() => updatePost(idx,{faqs:p.faqs.filter((_,i)=>i!==fi)})} className="p-1 rounded bg-red-50 text-red-400 hover:bg-red-500 hover:text-white"><Trash2 className="w-3 h-3"/></button>
                          </div>
                        </div>
                        <Field label="Question" value={faq.question} onChange={v=>{const f=[...p.faqs];f[fi]={...f[fi],question:v};updatePost(idx,{faqs:f});}} placeholder="What is AI automation?" />
                        <Field label="Answer" value={faq.answer} textarea rows={2} onChange={v=>{const f=[...p.faqs];f[fi]={...f[fi],answer:v};updatePost(idx,{faqs:f});}} />
                      </div>
                    ))}
                  </div>
                  <button onClick={() => updatePost(idx,{faqs:[...p.faqs,{question:"",answer:""}]})} className="flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 border-dashed border-slate-200 text-xs font-bold text-slate-400 hover:border-brand hover:text-brand transition-all w-full justify-center">
                    <Plus className="w-3.5 h-3.5" /> Add FAQ
                  </button>
                </div>

                {/* Settings */}
                <div className="border-t border-slate-200 pt-4">
                  <ToggleSetting label="Show Related Articles" desc="Display 3 related posts after the content" value={p.show_related} onChange={v => updatePost(idx, { show_related: v })} />
                  <ToggleSetting label="Show Category Section" desc="Show more posts from the same category" value={p.show_category_section} onChange={v => updatePost(idx, { show_category_section: v })} />
                  <ToggleSetting label="Featured" desc="Highlight this article on the listing page" value={p.featured} onChange={v => updatePost(idx, { featured: v })} />
                  <div className="pt-4">
                    <Field label="Position (order)" value={String(p.position)} type="number" onChange={v => updatePost(idx, { position: Number(v) })} />
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

        {/* API offline banner */}
        {apiError && (
          <div className="flex items-center gap-3 px-5 py-3 rounded-2xl bg-amber-50 border border-amber-200 text-amber-800 text-xs font-medium mb-6">
            <span className="w-2 h-2 rounded-full bg-amber-400 flex-shrink-0" />
            <span><strong>API offline</strong> — showing demo posts. Deploy the backend or check your connection to load live data.</span>
            <button onClick={() => { setLoading(true); fetchPosts(); }} className="ml-auto text-amber-700 font-bold underline underline-offset-2 hover:no-underline">Retry</button>
          </div>
        )}

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-display font-bold text-slate-900">Blog Posts</h1>
          <button onClick={openNew} className="flex items-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-slate-800 transition-all shadow-sm">
            New Post <kbd className="text-[10px] bg-white/20 px-1.5 py-0.5 rounded">F2</kbd>
          </button>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3 mb-5">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search by title…"
              className="pl-9 pr-4 h-9 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-brand bg-white w-60"
            />
          </div>
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value as typeof statusFilter)}
            className="h-9 border border-slate-200 rounded-lg px-3 text-sm focus:outline-none focus:border-brand bg-white text-slate-600">
            <option value="all">All statuses</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
            <option value="scheduled">Scheduled</option>
          </select>
          <div className="flex items-center gap-2 text-sm text-slate-500">
            Published from
            <input type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)} className="h-9 border border-slate-200 rounded-lg px-3 text-sm focus:outline-none focus:border-brand bg-white" />
            to
            <input type="date" value={dateTo} onChange={e => setDateTo(e.target.value)} className="h-9 border border-slate-200 rounded-lg px-3 text-sm focus:outline-none focus:border-brand bg-white" />
          </div>
        </div>

        {/* Table */}
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
          {filtered.length === 0 ? (
            <div className="py-20 text-center text-slate-400 text-sm font-semibold">
              {search || statusFilter !== "all" || dateFrom || dateTo
                ? "No matching articles"
                : "No articles yet — click \"New Post\" to begin"}
            </div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/60">
                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-slate-500">Title</th>
                  <th className="text-left px-4 py-3.5 text-xs font-semibold text-slate-500">Status</th>
                  <th className="text-left px-4 py-3.5 text-xs font-semibold text-slate-500 hidden md:table-cell">Scheduled At</th>
                  <th className="text-left px-4 py-3.5 text-xs font-semibold text-slate-500 hidden md:table-cell">Published At</th>
                  <th className="text-left px-4 py-3.5 text-xs font-semibold text-slate-500 hidden md:table-cell">Author</th>
                  <th className="text-right px-5 py-3.5 text-xs font-semibold text-slate-500">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(p => {
                  const realIdx = posts.indexOf(p);
                  const key = p.id ? String(p.id) : p.slug;
                  return (
                    <tr key={key} className="border-b border-slate-100 last:border-0 hover:bg-slate-50/40 transition-colors">
                      <td className="px-5 py-3.5">
                        <span className="text-sm font-medium text-slate-800 truncate max-w-[260px] block">{p.title || "Untitled"}</span>
                      </td>
                      <td className="px-4 py-3.5">
                        <span className={cn(
                          "text-[10px] font-semibold px-2 py-0.5 rounded-full",
                          p.status === "published" ? "bg-emerald-100 text-emerald-700"
                            : p.status === "scheduled" ? "bg-blue-100 text-blue-700"
                            : "bg-amber-100 text-amber-700"
                        )}>
                          {p.status}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 hidden md:table-cell text-xs text-slate-500">
                        {p.scheduled_at ? new Date(p.scheduled_at).toLocaleString("en-IN", { dateStyle: "short", timeStyle: "short" }) : "—"}
                      </td>
                      <td className="px-4 py-3.5 hidden md:table-cell text-xs text-slate-500">
                        {p.published_at ? new Date(p.published_at).toLocaleString("en-IN", { dateStyle: "short", timeStyle: "short" }) : "—"}
                      </td>
                      <td className="px-4 py-3.5 hidden md:table-cell text-xs text-slate-500">{p.author_name || "Digi Pexel Team"}</td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center justify-end gap-1">
                          <a href={`/blog/${p.slug}`} target="_blank" rel="noopener noreferrer"
                            className="p-1.5 rounded-lg text-slate-400 hover:text-brand hover:bg-brand/8 transition-all" title="Preview">
                            <Eye className="w-4 h-4" />
                          </a>
                          <button onClick={() => openEdit(key)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-brand hover:bg-brand/8 transition-all" title="Edit">
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button onClick={() => removePost(realIdx)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all" title="Delete">
                            <Trash2 className="w-4 h-4" />
                          </button>
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
  section: BlogSection; onChange: (s: BlogSection) => void; onRemove: () => void; onMove: (d: "up"|"down") => void;
}) {
  const [open, setOpen] = useState(true);
  const meta = SECTION_TYPES.find(t => t.type === s.type)!;
  const update = (patch: Partial<BlogSection>) => onChange({ ...s, ...patch });

  return (
    <div className="border border-slate-200 rounded-2xl overflow-hidden">
      <div className="flex items-center justify-between bg-slate-50 px-4 py-3 cursor-pointer" onClick={() => setOpen(!open)}>
        <div className="flex items-center gap-2">
          <span className="text-brand">{meta?.icon}</span>
          <span className="text-xs font-bold text-slate-700">{meta?.label}</span>
          {s.title && <span className="text-xs text-slate-400 truncate max-w-40">— {s.title}</span>}
        </div>
        <div className="flex items-center gap-1">
          <button onClick={e => { e.stopPropagation(); onMove("up"); }}   className="p-1 rounded bg-white border border-slate-200 text-slate-400 hover:text-brand"><MoveUp   className="w-3 h-3" /></button>
          <button onClick={e => { e.stopPropagation(); onMove("down"); }} className="p-1 rounded bg-white border border-slate-200 text-slate-400 hover:text-brand"><MoveDown className="w-3 h-3" /></button>
          <button onClick={e => { e.stopPropagation(); onRemove(); }}     className="p-1 rounded bg-red-50 text-red-400 hover:bg-red-500 hover:text-white"><Trash2   className="w-3 h-3" /></button>
          {open ? <ChevronUp className="w-4 h-4 text-slate-400 ml-1" /> : <ChevronDown className="w-4 h-4 text-slate-400 ml-1" />}
        </div>
      </div>
      {open && (
        <div className="p-4 space-y-3">
          {s.type === "mid_cta" && <>
            <Field label="CTA Text" value={s.cta_text ?? ""} onChange={v => update({ cta_text: v })} placeholder="Want to learn more?" />
            <Field label="Button Label" value={s.cta_label ?? ""} onChange={v => update({ cta_label: v })} placeholder="Get In Touch" />
          </>}
          {s.type === "comparison" && <>
            <Field label="Section Title" value={s.title ?? ""} onChange={v => update({ title: v })} />
            <Field label="Content" value={s.content ?? ""} textarea onChange={v => update({ content: v })} />
            <div className="grid grid-cols-2 gap-3">
              <Field label="Before Label" value={s.comparison?.before_label ?? "Before"} onChange={v => update({ comparison: { ...s.comparison!, before_label: v } })} />
              <Field label="After Label"  value={s.comparison?.after_label  ?? "After"}  onChange={v => update({ comparison: { ...s.comparison!, after_label: v  } })} />
            </div>
            {(s.comparison?.rows ?? []).map((row, ri) => (
              <div key={ri} className="flex gap-2">
                <input value={row.before} onChange={e => { const r=[...(s.comparison!.rows)]; r[ri]={...r[ri],before:e.target.value}; update({comparison:{...s.comparison!,rows:r}}); }} placeholder="Before…" className="flex-1 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-brand" />
                <input value={row.after}  onChange={e => { const r=[...(s.comparison!.rows)]; r[ri]={...r[ri],after:e.target.value};  update({comparison:{...s.comparison!,rows:r}}); }} placeholder="After…"  className="flex-1 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-brand" />
                <button onClick={() => update({comparison:{...s.comparison!,rows:s.comparison!.rows.filter((_,i)=>i!==ri)}})} className="p-2 rounded-xl bg-red-50 text-red-400 hover:bg-red-500 hover:text-white"><Trash2 className="w-3 h-3" /></button>
              </div>
            ))}
            <button onClick={() => update({comparison:{before_label:s.comparison?.before_label??"Before",after_label:s.comparison?.after_label??"After",rows:[...(s.comparison?.rows??[]),{before:"",after:""}]}})} className="flex items-center gap-1.5 text-xs font-bold text-brand hover:underline"><Plus className="w-3.5 h-3.5" /> Add Row</button>
          </>}
          {(s.type === "metrics" || s.type === "results") && <>
            <Field label="Section Title" value={s.title ?? ""} onChange={v => update({ title: v })} />
            <Field label="Content" value={s.content ?? ""} textarea onChange={v => update({ content: v })} />
            {(s.metrics ?? []).map((m, mi) => (
              <div key={mi} className="grid grid-cols-[1fr_1fr_2fr_auto] gap-2">
                <input value={m.value} onChange={e=>{const mm=[...(s.metrics!)];mm[mi]={...mm[mi],value:e.target.value};update({metrics:mm});}} placeholder="85%" className="border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-brand font-bold" />
                <input value={m.label} onChange={e=>{const mm=[...(s.metrics!)];mm[mi]={...mm[mi],label:e.target.value};update({metrics:mm});}} placeholder="Label" className="border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-brand" />
                <input value={m.desc}  onChange={e=>{const mm=[...(s.metrics!)];mm[mi]={...mm[mi],desc:e.target.value};update({metrics:mm});}}  placeholder="Description" className="border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-brand" />
                <button onClick={()=>update({metrics:s.metrics!.filter((_,i)=>i!==mi)})} className="p-2 rounded-xl bg-red-50 text-red-400 hover:bg-red-500 hover:text-white"><Trash2 className="w-3 h-3" /></button>
              </div>
            ))}
            <button onClick={()=>update({metrics:[...(s.metrics??[]),{value:"",label:"",desc:""}]})} className="flex items-center gap-1.5 text-xs font-bold text-brand hover:underline"><Plus className="w-3.5 h-3.5" /> Add Metric</button>
          </>}
          {s.type === "timeline" && <>
            <Field label="Section Title" value={s.title ?? ""} onChange={v => update({ title: v })} />
            <Field label="Content" value={s.content ?? ""} textarea onChange={v => update({ content: v })} />
            {(s.phases ?? []).map((ph, pi) => (
              <div key={pi} className="grid grid-cols-[1fr_2fr_3fr_auto] gap-2">
                <input value={ph.phase} onChange={e=>{const pp=[...(s.phases!)];pp[pi]={...pp[pi],phase:e.target.value};update({phases:pp});}} placeholder="Phase 1" className="border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-brand" />
                <input value={ph.title} onChange={e=>{const pp=[...(s.phases!)];pp[pi]={...pp[pi],title:e.target.value};update({phases:pp});}} placeholder="Title" className="border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-brand" />
                <input value={ph.desc}  onChange={e=>{const pp=[...(s.phases!)];pp[pi]={...pp[pi],desc:e.target.value};update({phases:pp});}}  placeholder="Description" className="border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-brand" />
                <button onClick={()=>update({phases:s.phases!.filter((_,i)=>i!==pi)})} className="p-2 rounded-xl bg-red-50 text-red-400 hover:bg-red-500 hover:text-white"><Trash2 className="w-3 h-3" /></button>
              </div>
            ))}
            <button onClick={()=>update({phases:[...(s.phases??[]),{phase:`Phase ${(s.phases?.length??0)+1}`,title:"",desc:""}]})} className="flex items-center gap-1.5 text-xs font-bold text-brand hover:underline"><Plus className="w-3.5 h-3.5" /> Add Phase</button>
          </>}
          {["overview","challenge","solution","text"].includes(s.type) && <>
            <Field label="Section Title" value={s.title ?? ""} onChange={v => update({ title: v })} />
            <Field label="Content" value={s.content ?? ""} textarea rows={4} onChange={v => update({ content: v })} />
            {(s.points ?? []).map((pt, pi) => (
              <div key={pi} className="flex gap-2">
                <input value={pt} onChange={e=>{const pp=[...(s.points!)];pp[pi]=e.target.value;update({points:pp});}} placeholder="Point…" className="flex-1 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-brand" />
                <button onClick={()=>update({points:s.points!.filter((_,i)=>i!==pi)})} className="p-2 rounded-xl bg-red-50 text-red-400 hover:bg-red-500 hover:text-white"><Trash2 className="w-3 h-3" /></button>
              </div>
            ))}
            <button onClick={()=>update({points:[...(s.points??[]),""]}) } className="flex items-center gap-1.5 text-xs font-bold text-brand hover:underline"><Plus className="w-3.5 h-3.5" /> Add Point</button>
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

function AuthorImageField({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const [mode, setMode] = useState<"url" | "upload">("url");
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) { alert("Image must be under 2 MB."); return; }
    const reader = new FileReader();
    reader.onload = () => onChange(reader.result as string);
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="field-label">Author Photo</label>
        <div className="flex gap-0.5 p-1 bg-slate-100 rounded-xl">
          {(["url", "upload"] as const).map(m => (
            <button key={m} type="button" onClick={() => setMode(m)} className={cn("px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all", mode === m ? "bg-white text-brand shadow-sm" : "text-slate-400 hover:text-slate-600")}>
              {m === "url" ? "URL" : "Upload"}
            </button>
          ))}
        </div>
      </div>
      <div className="flex gap-4 items-start">
        <div className="w-14 h-14 rounded-full overflow-hidden bg-slate-100 border-2 border-slate-200 flex-shrink-0 flex items-center justify-center">
          {value ? <img src={value} alt="Author" className="w-full h-full object-cover" onError={e => { (e.target as HTMLImageElement).style.display = "none"; }} /> : <User className="w-5 h-5 text-slate-300" />}
        </div>
        <div className="flex-1">
          {mode === "url" ? (
            <input type="text" value={value.startsWith("data:") ? "" : value} onChange={e => onChange(e.target.value)} placeholder="https://example.com/avatar.jpg" className="w-full border border-slate-200 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:border-brand bg-white placeholder:text-slate-300" />
          ) : (
            <div>
              <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
              <button type="button" onClick={() => fileRef.current?.click()} className="w-full border-2 border-dashed border-slate-200 rounded-2xl px-4 py-4 text-xs font-bold text-slate-400 hover:border-brand hover:text-brand transition-all flex flex-col items-center gap-2">
                <Upload className="w-4 h-4" />
                Click to choose a photo
                <span className="text-[10px] font-normal text-slate-300">JPG, PNG, WEBP — max 2 MB</span>
              </button>
              {value.startsWith("data:") && <p className="text-[10px] text-emerald-600 font-semibold mt-1.5">✓ Image loaded</p>}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function UploadImageField({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  const [mode, setMode] = React.useState<"url" | "upload">("url");
  const [uploading, setUploading] = React.useState(false);
  const [uploadErr, setUploadErr] = React.useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { alert("Image must be under 5 MB."); return; }
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
          {(["url", "upload"] as const).map(m => (
            <button key={m} type="button" onClick={() => setMode(m)} className={cn("px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all", mode === m ? "bg-white text-brand shadow-sm" : "text-slate-400 hover:text-slate-600")}>
              {m === "url" ? "URL" : "Upload"}
            </button>
          ))}
        </div>
      </div>
      <div className="flex gap-4 items-start">
        <div className="w-20 h-14 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 flex-shrink-0 flex items-center justify-center">
          {value ? <img src={value} alt="" className="w-full h-full object-cover" onError={e => { (e.target as HTMLImageElement).style.display = "none"; }} /> : <ImageIcon className="w-5 h-5 text-slate-300" />}
        </div>
        <div className="flex-1">
          {mode === "url" ? (
            <input type="text" value={value} onChange={e => onChange(e.target.value)} placeholder="https://images.unsplash.com/…" className="w-full border border-slate-200 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:border-brand bg-white placeholder:text-slate-300" />
          ) : (
            <div className="space-y-1">
              <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
              <button type="button" disabled={uploading} onClick={() => fileRef.current?.click()}
                className="w-full border-2 border-dashed border-slate-200 rounded-2xl px-4 py-4 text-xs font-bold text-slate-400 hover:border-brand hover:text-brand transition-all flex items-center gap-2 justify-center disabled:opacity-50">
                <Upload className="w-4 h-4" /> {uploading ? "Uploading…" : "Click to upload from device"}
                {!uploading && <span className="font-normal text-slate-300">— JPG, PNG, WebP, max 5 MB</span>}
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

function ToggleSetting({ label, desc, value, onChange }: { label: string; desc: string; value: boolean; onChange: (v: boolean) => void }) {
  return (
    <div className="flex items-start justify-between py-3.5 border-b border-slate-100 last:border-0">
      <div><p className="text-sm font-semibold text-slate-700">{label}</p><p className="text-xs text-slate-400 mt-0.5">{desc}</p></div>
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
