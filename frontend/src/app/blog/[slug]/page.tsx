"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Navbar } from "@/components/blocks/floating-icons-hero-demo";
import { Footer } from "@/components/ui/footer-section";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Calendar, Clock, ArrowRight, Twitter, Linkedin, Link2,
  CheckCircle2, XCircle, TrendingUp, AlertTriangle, Lightbulb,
  BookOpen, User, Tag, Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";

// ── Types ─────────────────────────────────────────────────────────────────────
interface BlogSection {
  id?: string;
  type: "overview" | "challenge" | "solution" | "timeline" | "comparison" | "metrics" | "text" | "mid_cta";
  title?: string;
  content?: string;
  points?: string[];
  comparison?: { before_label: string; after_label: string; rows: [string, string][] };
  metrics?: { label: string; value: string; desc: string }[];
  cta_text?: string;
  cta_label?: string;
  phases?: { phase: string; title: string; desc: string }[];
}

interface BlogPost {
  id: number;
  title: string;
  slug: string;
  eyebrow: string;
  subtitle: string;
  excerpt: string;
  content: string;
  image_url: string;
  category: string;
  tags: string;
  tags_array: string[];
  author_name: string;
  author_image: string;
  author_role: string;
  read_time: string;
  published_at: string;
  sections: BlogSection[];
  show_related: boolean;
  show_category_section: boolean;
}

interface RelatedPost {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  image_url: string;
  category: string;
  published_at: string;
}

// ── Demo fallback (shown when no API data — keeps template always previewable) ──
const DEMO_POST: BlogPost = {
  id: 0,
  title: "How AI Automation Is Eliminating Manual Work in Modern Businesses",
  slug: "ai-automation-eliminating-manual-work",
  eyebrow: "AI Strategy",
  subtitle: "A practical deep-dive into the automation stack that saves 14+ hours per week",
  excerpt: "Every knowledge worker loses hours each week on repetitive tasks that shouldn't require a human. Here's how to reclaim that time with autonomous AI workflows.",
  content: "",
  image_url: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&q=80&w=1400",
  category: "AI Strategy",
  tags: "automation, AI, workflows, productivity",
  tags_array: ["automation", "AI", "workflows", "productivity"],
  author_name: "Digi Pexel Team",
  author_image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=120",
  author_role: "AI Automation Specialists",
  read_time: "8 min read",
  published_at: "2025-03-14",
  show_related: true,
  show_category_section: false,
  sections: [
    {
      type: "overview",
      title: "The Hidden Cost of Manual Operations",
      content: "Research shows that knowledge workers spend an average of 40% of their time on low-value, repetitive tasks — data entry, status updates, report generation, and tool-switching. That's 16+ hours per week per employee that could be reclaimed with properly implemented AI automation.",
      points: ["14 hours/week lost to manual handoffs per employee", "73% of repetitive tasks are automatable with current AI tools", "Teams with automation report 3× faster output cycles"],
    },
    {
      type: "challenge",
      title: "Why Most Automation Projects Fail",
      content: "The challenge isn't the technology — it's the implementation strategy. Most companies automate individual tasks in isolation, creating islands of efficiency that don't talk to each other.",
      points: [
        "Siloed tools with no shared data layer",
        "No error handling or fallback logic",
        "Humans still required for edge cases with no escalation path",
        "ROI never measured or visible to leadership",
      ],
    },
    {
      type: "solution",
      title: "The Connected Automation Stack",
      content: "Effective automation operates as a system, not a collection of scripts. Every workflow needs a trigger, a logic layer, error handling, and an observable output. When these components are designed together, automation becomes self-sustaining.",
      points: [
        "Event-driven triggers that respond to real data changes",
        "LLM decision layer for intelligent routing and exception handling",
        "Human-in-the-loop checkpoints for high-stakes decisions",
        "Monitoring dashboards with ROI metrics built in",
      ],
    },
    {
      type: "metrics",
      title: "What Clients Achieve in 90 Days",
      content: "These are median outcomes across Digi Pexel clients in their first quarter after deployment.",
      metrics: [
        { value: "14 hrs", label: "Weekly time saved", desc: "Per employee on average" },
        { value: "99.2%", label: "Workflow uptime",   desc: "Across all automated pipelines" },
        { value: "3×",    label: "Output velocity",   desc: "Faster than pre-automation baseline" },
        { value: "−64%",  label: "Manual touches",    desc: "Reduction in human intervention" },
      ],
    },
    {
      type: "text",
      title: "Getting Started: The 3-Step Audit",
      content: "Before building anything, audit your current stack. Identify the 3 workflows that cost your team the most time each week. Map every manual step in each workflow. Then ask: which steps require genuine human judgment, and which are just mechanical execution? Automate the mechanical, design the judgment touchpoints.",
    },
    {
      type: "mid_cta",
      cta_text: "Want a free automation audit for your business?",
      cta_label: "Book a Strategy Call",
    },
  ],
};

const DEMO_RELATED: RelatedPost[] = [
  {
    id: 1, title: "Building a Lead Qualification Bot in 48 Hours",
    slug: "lead-qualification-bot",
    excerpt: "A step-by-step walkthrough of automating top-of-funnel lead scoring with a custom AI agent.",
    image_url: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800",
    category: "Case Study", published_at: "2025-02-28",
  },
  {
    id: 2, title: "n8n vs. Make vs. Zapier: Which Platform Wins in 2025?",
    slug: "automation-platform-comparison",
    excerpt: "An honest comparison of the three leading automation platforms for business workflows.",
    image_url: "https://images.unsplash.com/photo-1518186285589-2f7649de83e0?auto=format&fit=crop&q=80&w=800",
    category: "Tools", published_at: "2025-02-15",
  },
  {
    id: 3, title: "The ROI Framework for AI Automation Projects",
    slug: "roi-framework-ai-automation",
    excerpt: "How to measure, track, and report the business impact of your automation investments.",
    image_url: "https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?auto=format&fit=crop&q=80&w=800",
    category: "Strategy", published_at: "2025-01-30",
  },
];

// ── Page ──────────────────────────────────────────────────────────────────────
export default function BlogDetailPage({ params }: { params: { slug: string } }) {
  const [post, setPost] = useState<BlogPost | null>(null);
  const [related, setRelated] = useState<RelatedPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeId, setActiveId] = useState("");
  const [copied, setCopied] = useState(false);
  const [formSent, setFormSent] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", company: "", message: "" });

  useEffect(() => {
    fetch(`/api/blogs.php?slug=${params.slug}`)
      .then(r => r.json())
      .then(d => {
        if (d.status === "success") {
          setPost(d.data);
          fetch("/api/blogs.php")
            .then(r => r.json())
            .then(rd => {
              if (rd.status === "success") {
                setRelated(rd.data.filter((p: RelatedPost & { id: number }) => p.id !== d.data.id).slice(0, 3));
              }
            });
        } else {
          // Fallback: show a rich demo post so the template is always previewable
          setPost(DEMO_POST);
          setRelated(DEMO_RELATED);
        }
      })
      .catch(() => { setPost(DEMO_POST); setRelated(DEMO_RELATED); })
      .finally(() => setLoading(false));
  }, [params.slug]);

  // Scroll spy
  useEffect(() => {
    if (!post) return;
    const obs = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) setActiveId(e.target.id); }),
      { rootMargin: "-10% 0px -65% 0px" }
    );
    document.querySelectorAll("[data-section-anchor]").forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, [post]);

  // Build content: rich sections OR legacy HTML content
  const getSections = (): BlogSection[] => {
    if (post?.sections?.length) return post.sections;
    if (post?.content) return [{ type: "text", title: "Article", content: post.content }];
    return [];
  };

  const share = (platform: string) => {
    const url = window.location.href;
    const txt = `${post?.title}`;
    if (platform === "twitter")  window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(txt)}&url=${encodeURIComponent(url)}`);
    if (platform === "linkedin") window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`);
    if (platform === "copy")     { navigator.clipboard.writeText(url); setCopied(true); setTimeout(() => setCopied(false), 2000); }
  };

  const submitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetch("/api/leads.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "add_lead", full_name: form.name, email: form.email, company: form.company, message: form.message, service: `Blog Inquiry: ${post?.title}` }),
      });
      setFormSent(true);
    } catch {}
  };

  if (loading) return <PageSkeleton />;
  if (!post) return <NotFound />;

  const sections = getSections();
  const tocItems = sections.filter(s => s.title && s.type !== "mid_cta");

  return (
    <main className="min-h-screen bg-base">
      <Navbar className="top-0" darkHero={false} />

      {/* ── Hero ── */}
      <section className="relative pt-32 pb-14 overflow-hidden bg-base">
        {/* Subtle background */}
        <div className="absolute inset-x-0 top-0 h-[600px] bg-gradient-to-b from-brand/[0.04] to-transparent pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(37,99,235,0.06),transparent_60%)] pointer-events-none" />

        <div className="container mx-auto px-6 max-w-7xl relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-14 items-start">

            {/* Left — meta + title */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <div className="flex flex-wrap items-center gap-3 mb-5">
                <Badge variant="outline" className="section-eyebrow">{post.eyebrow || "Article"}</Badge>
                <span className="text-[10px] font-black uppercase tracking-widest text-brand/60 bg-brand/8 border border-brand/15 px-3 py-1 rounded-full">{post.category}</span>
              </div>
              <h1 className="text-3xl md:text-5xl font-display font-bold text-primary leading-[1.1] mb-5 max-w-2xl">{post.title}</h1>
              {post.subtitle && <p className="text-secondary/70 text-lg leading-relaxed max-w-xl mb-7">{post.subtitle}</p>}
              {!post.subtitle && post.excerpt && <p className="text-secondary/70 text-lg leading-relaxed max-w-xl mb-7">{post.excerpt}</p>}

              {/* Meta row */}
              <div className="flex flex-wrap items-center gap-5 mb-6">
                {post.author_name && (
                  <div className="flex items-center gap-2.5">
                    {post.author_image
                      ? <img src={post.author_image} alt={post.author_name} className="w-9 h-9 rounded-full object-cover border-2 border-brand/20" />
                      : <div className="w-9 h-9 rounded-full bg-brand/10 flex items-center justify-center"><User className="w-4 h-4 text-brand" /></div>}
                    <div>
                      <p className="text-xs font-bold text-primary leading-none">{post.author_name}</p>
                      {post.author_role && <p className="text-[10px] text-secondary/50 mt-0.5">{post.author_role}</p>}
                    </div>
                  </div>
                )}
                <MetaPill icon={<Calendar className="w-3 h-3" />} label={new Date(post.published_at).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })} />
                <MetaPill icon={<Clock className="w-3 h-3" />} label={post.read_time || "5 min read"} />
              </div>

              {/* Tags */}
              {post.tags_array?.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {post.tags_array.map(tag => (
                    <span key={tag} className="text-[10px] font-bold text-secondary/60 bg-slate-100 rounded-full px-3 py-1">{tag}</span>
                  ))}
                </div>
              )}
            </motion.div>

            {/* Right — cover image */}
            {post.image_url && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.15 }} className="hidden lg:block">
                <div className="rounded-3xl overflow-hidden border border-border-subtle shadow-2xl shadow-slate-200/80 aspect-[4/3]">
                  <img src={post.image_url} alt={post.title} className="w-full h-full object-cover" />
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="border-t border-slate-100" />

      {/* ── 3-Column Layout ── */}
      <div className="container mx-auto px-6 max-w-7xl py-14">
        <div className="grid grid-cols-1 lg:grid-cols-[200px_1fr_280px] gap-8 xl:gap-14">

          {/* ── Left: Sticky TOC ── */}
          <aside className="hidden lg:block">
            <div className="sticky top-28 space-y-6">
              {tocItems.length > 0 && (
                <div>
                  <p className="text-[9px] font-black uppercase tracking-[0.25em] text-slate-400 mb-3">On This Page</p>
                  <nav className="space-y-0.5">
                    {tocItems.map((s, i) => {
                      const id = s.id || `section-${i}`;
                      return (
                        <a key={id} href={`#${id}`}
                          onClick={e => { e.preventDefault(); document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" }); }}
                          className={cn(
                            "block text-xs py-1.5 px-3 rounded-xl transition-all leading-snug",
                            activeId === id ? "text-brand bg-brand/8 font-bold" : "text-slate-400 hover:text-slate-700 hover:bg-slate-50 font-medium"
                          )}
                        >
                          {s.title}
                        </a>
                      );
                    })}
                  </nav>
                </div>
              )}

              {/* Share */}
              <div className={cn("pt-4", tocItems.length > 0 && "border-t border-slate-100")}>
                <p className="text-[9px] font-black uppercase tracking-[0.25em] text-slate-400 mb-3">Share</p>
                <div className="flex gap-2">
                  {[
                    { p: "twitter",  icon: <Twitter   className="w-3.5 h-3.5" /> },
                    { p: "linkedin", icon: <Linkedin  className="w-3.5 h-3.5" /> },
                    { p: "copy",     icon: copied ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> : <Link2 className="w-3.5 h-3.5" /> },
                  ].map(({ p, icon }) => (
                    <button key={p} onClick={() => share(p)} className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center hover:bg-brand hover:text-white transition-all">{icon}</button>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* ── Center: Article Content ── */}
          <article className="min-w-0 max-w-none">
            {sections.map((section, i) => {
              const id = section.id || `section-${i}`;
              return <SectionBlock key={id} section={section} sectionId={id} />;
            })}

            {/* Author card at bottom */}
            {post.author_name && (
              <div className="mt-14 p-6 rounded-3xl border border-border-subtle bg-surface flex items-start gap-4">
                {post.author_image
                  ? <img src={post.author_image} alt={post.author_name} className="w-14 h-14 rounded-2xl object-cover flex-shrink-0 border-2 border-brand/15" />
                  : <div className="w-14 h-14 rounded-2xl bg-brand/10 flex items-center justify-center flex-shrink-0"><User className="w-6 h-6 text-brand" /></div>}
                <div>
                  <p className="font-bold text-primary">{post.author_name}</p>
                  {post.author_role && <p className="text-xs text-secondary/60 mb-2">{post.author_role}</p>}
                  <p className="text-xs text-secondary/60 leading-relaxed">Published by the Digi Pexel team — building AI-powered growth systems for forward-thinking businesses.</p>
                </div>
              </div>
            )}

            {/* Bottom share */}
            <div className="mt-10 pt-8 border-t border-slate-100">
              <p className="text-sm font-bold text-slate-700 mb-4">Found this useful? Share it.</p>
              <div className="flex flex-wrap gap-3">
                {[{ p: "twitter", label: "Twitter" }, { p: "linkedin", label: "LinkedIn" }, { p: "copy", label: copied ? "Copied!" : "Copy Link" }].map(({ p, label }) => (
                  <button key={p} onClick={() => share(p)} className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-slate-100 text-xs font-bold text-slate-600 hover:bg-brand hover:text-white transition-all">
                    {p === "twitter"  && <Twitter  className="w-3.5 h-3.5" />}
                    {p === "linkedin" && <Linkedin className="w-3.5 h-3.5" />}
                    {p === "copy"     && <Link2    className="w-3.5 h-3.5" />}
                    {label}
                  </button>
                ))}
              </div>
            </div>
          </article>

          {/* ── Right: Sticky Form ── */}
          <aside className="hidden lg:block">
            <div className="sticky top-28">
              <div className="rounded-3xl border border-border-subtle bg-surface shadow-xl shadow-slate-200/60 p-6">
                {!formSent ? (
                  <>
                    <div className="mb-5">
                      <span className="text-[9px] font-black uppercase tracking-widest text-brand">Work With Us</span>
                      <h3 className="text-[15px] font-bold text-primary leading-snug mt-1.5">Execute Your AI Vision With Seasoned Strategists</h3>
                    </div>
                    <form onSubmit={submitForm} className="space-y-3">
                      {[
                        { key: "name",    placeholder: "Full Name",  type: "text",  required: true  },
                        { key: "email",   placeholder: "Work Email", type: "email", required: true  },
                        { key: "company", placeholder: "Company",    type: "text",  required: false },
                      ].map(({ key, placeholder, type, required }) => (
                        <input key={key} type={type} required={required} placeholder={placeholder}
                          value={(form as any)[key]}
                          onChange={e => setForm({ ...form, [key]: e.target.value })}
                          className="w-full bg-base border border-border-subtle rounded-2xl px-4 py-3 text-xs focus:outline-none focus:ring-2 focus:ring-brand/10 transition-all placeholder:text-secondary/30"
                        />
                      ))}
                      <textarea rows={3} placeholder="Describe your project…"
                        value={form.message}
                        onChange={e => setForm({ ...form, message: e.target.value })}
                        className="w-full bg-base border border-border-subtle rounded-2xl px-4 py-3 text-xs focus:outline-none focus:ring-2 focus:ring-brand/10 transition-all resize-none placeholder:text-secondary/30"
                      />
                      <Button type="submit" className="w-full rounded-full bg-brand text-white text-xs font-bold py-3 h-auto hover:bg-brand/90">
                        Consult With Experts
                      </Button>
                    </form>
                    <p className="text-[9px] text-center text-slate-400 mt-3">By submitting, you agree to our privacy policy.</p>
                  </>
                ) : (
                  <div className="text-center py-8">
                    <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-3" />
                    <p className="font-bold text-primary mb-1">We'll be in touch!</p>
                    <p className="text-xs text-secondary/60">Expect a response within 24 hours.</p>
                  </div>
                )}
              </div>

              {/* Category badge */}
              <div className="mt-4 rounded-2xl border border-border-subtle bg-surface p-4 text-center">
                <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 block mb-1">Category</span>
                <span className="text-xs font-bold text-primary">{post.category}</span>
              </div>
            </div>
          </aside>

        </div>
      </div>

      {/* ── Related Articles ── */}
      {post.show_related && related.length > 0 && (
        <section className="py-20 border-t border-slate-100">
          <div className="container mx-auto px-6 max-w-7xl">
            <div className="flex items-center justify-between mb-10">
              <h2 className="text-2xl font-display font-bold text-primary">More Articles</h2>
              <Link href="/blog" className="flex items-center gap-1.5 text-xs font-bold text-brand hover:underline">
                View All <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {related.map(r => <RelatedCard key={r.id} post={r} />)}
            </div>
          </div>
        </section>
      )}

      {/* ── Category Section ── */}
      {post.show_category_section && (
        <section className="py-20 bg-slate-50 border-t border-slate-100">
          <div className="container mx-auto px-6 max-w-7xl">
            <h2 className="text-2xl font-display font-bold text-primary mb-10">
              More in {post.category}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {related.filter(r => r.category === post.category).map(r => <RelatedCard key={r.id} post={r} />)}
            </div>
            {related.filter(r => r.category === post.category).length === 0 && (
              <p className="text-secondary/50 text-sm italic">More {post.category} articles coming soon.</p>
            )}
          </div>
        </section>
      )}

      {/* ── Final CTA ── */}
      <section className="py-24 bg-base">
        <div className="container mx-auto px-6 max-w-4xl text-center">
          <Badge variant="outline" className="section-eyebrow mb-6 mx-auto">Get Started</Badge>
          <h2 className="section-title mb-5">
            Ready to put these<br />
            <span className="section-title-accent">insights into action?</span>
          </h2>
          <p className="section-subtitle max-w-xl mx-auto mb-10 opacity-60">
            Let's build a strategy around what you just read — tailored to your business goals.
          </p>
          <Link href="/contact-us">
            <Button className="bg-brand text-white hover:bg-brand/90 rounded-full px-10 h-14 font-bold shadow-xl shadow-brand/30">
              Start Your Project <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
        </div>
      </section>

      <Footer />
    </main>
  );
}

// ── Section Renderer (same types, blog-appropriate labels) ────────────────────
function SectionBlock({ section: s, sectionId }: { section: BlogSection; sectionId: string }) {
  if (s.type === "mid_cta") {
    return (
      <div id={sectionId} data-section-anchor className="mb-12 rounded-2xl bg-gradient-to-r from-brand/8 to-brand/4 border border-brand/15 p-7 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <p className="text-sm font-bold text-primary mb-1">{s.cta_text || "Want to learn more?"}</p>
          <p className="text-xs text-secondary/60">Talk to our team about your specific goals.</p>
        </div>
        <Link href="/contact-us" className="flex-shrink-0">
          <Button className="bg-brand text-white rounded-full text-xs font-bold px-6 h-10 hover:bg-brand/90">
            {s.cta_label || "Get In Touch"} <ArrowRight className="ml-1.5 w-3.5 h-3.5" />
          </Button>
        </Link>
      </div>
    );
  }

  if (s.type === "comparison" && s.comparison) {
    const { before_label, after_label, rows } = s.comparison;
    return (
      <div id={sectionId} data-section-anchor className="mb-12">
        {s.title && <h2 className="text-xl md:text-2xl font-display font-bold text-primary mb-4">{s.title}</h2>}
        {s.content && <SectionProse content={s.content} />}
        <div className="overflow-x-auto rounded-2xl border border-slate-200 shadow-sm mt-5">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr>
                <th className="bg-rose-50 text-rose-600 font-black uppercase tracking-widest text-[10px] px-5 py-4 text-left w-1/2 border-b border-r border-slate-200">✕ {before_label || "Before"}</th>
                <th className="bg-emerald-50 text-emerald-600 font-black uppercase tracking-widest text-[10px] px-5 py-4 text-left w-1/2 border-b border-slate-200">✓ {after_label || "After"}</th>
              </tr>
            </thead>
            <tbody>
              {rows.map(([b, a], i) => (
                <tr key={i} className="border-b border-slate-100 last:border-0 hover:bg-slate-50/50 transition-colors">
                  <td className="px-5 py-4 text-slate-500 border-r border-slate-100"><div className="flex items-start gap-2.5"><XCircle className="w-4 h-4 text-rose-400 mt-0.5 flex-shrink-0" /><span>{b}</span></div></td>
                  <td className="px-5 py-4 text-slate-700"><div className="flex items-start gap-2.5"><CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" /><span>{a}</span></div></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  if ((s.type === "metrics" || s.type === "results" as any) && s.metrics?.length) {
    return (
      <div id={sectionId} data-section-anchor className="mb-12">
        {s.title && <h2 className="flex items-center gap-2.5 text-xl md:text-2xl font-display font-bold text-primary mb-4"><TrendingUp className="w-5 h-5 text-brand" />{s.title}</h2>}
        {s.content && <SectionProse content={s.content} />}
        <div className={cn("grid gap-4 mt-6", s.metrics.length >= 4 ? "grid-cols-2 md:grid-cols-4" : s.metrics.length === 3 ? "grid-cols-1 sm:grid-cols-3" : "grid-cols-1 sm:grid-cols-2")}>
          {s.metrics.map((m, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
              className="rounded-2xl bg-brand/5 border border-brand/10 p-5 text-center">
              <div className="text-3xl md:text-4xl font-black text-brand tracking-tight">{m.value}</div>
              <div className="text-xs font-bold text-primary mt-1 mb-1.5">{m.label}</div>
              <div className="text-[11px] text-secondary/60 leading-snug">{m.desc}</div>
            </motion.div>
          ))}
        </div>
        {s.points?.length ? <PointsList points={s.points} type="check" /> : null}
      </div>
    );
  }

  if (s.type === "timeline" && s.phases?.length) {
    return (
      <div id={sectionId} data-section-anchor className="mb-12">
        {s.title && <h2 className="text-xl md:text-2xl font-display font-bold text-primary mb-4">{s.title}</h2>}
        {s.content && <SectionProse content={s.content} />}
        <div className="mt-6 space-y-4">
          {s.phases.map((p, i) => (
            <motion.div key={i} initial={{ opacity: 0, x: -12 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
              className="flex gap-5 p-5 rounded-2xl border border-border-subtle bg-surface hover:border-brand/20 transition-all">
              <div className="w-10 h-10 rounded-xl bg-brand/10 flex items-center justify-center text-brand font-black text-sm flex-shrink-0">{String(i + 1).padStart(2, "0")}</div>
              <div>
                <span className="text-[9px] font-black uppercase tracking-widest text-brand/60 block mb-0.5">{p.phase}</span>
                <p className="font-bold text-primary text-sm mb-1">{p.title}</p>
                <p className="text-xs text-secondary/70 leading-relaxed">{p.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    );
  }

  // Default text sections
  const iconMap: Record<string, React.ReactNode> = {
    challenge: <AlertTriangle className="w-5 h-5 text-amber-500" />,
    solution:  <Lightbulb    className="w-5 h-5 text-brand"      />,
    overview:  <BookOpen     className="w-5 h-5 text-slate-500"  />,
    text:      undefined,
  };

  return (
    <div id={sectionId} data-section-anchor className="mb-12">
      {s.title && (
        <h2 className="flex items-center gap-2.5 text-xl md:text-2xl font-display font-bold text-primary mb-4">
          {iconMap[s.type]}
          {s.title}
        </h2>
      )}
      {s.content && (
        s.type === "text" && s.content.trim().startsWith("<")
          ? <div className="prose prose-slate max-w-none text-sm" dangerouslySetInnerHTML={{ __html: s.content }} />
          : <SectionProse content={s.content} />
      )}
      {s.points?.length ? <PointsList points={s.points} type={s.type === "challenge" ? "x" : "check"} /> : null}
    </div>
  );
}

function SectionProse({ content }: { content: string }) {
  return (
    <div className="text-secondary/80 text-sm leading-relaxed space-y-4">
      {content.split("\n\n").map((para, i) => <p key={i}>{para}</p>)}
    </div>
  );
}

function PointsList({ points, type }: { points: string[]; type: "check" | "x" }) {
  return (
    <ul className="mt-5 space-y-3">
      {points.map((pt, i) => (
        <li key={i} className="flex items-start gap-3 text-sm text-secondary/80">
          {type === "check"
            ? <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
            : <XCircle      className="w-4 h-4 text-rose-400    mt-0.5 flex-shrink-0" />}
          {pt}
        </li>
      ))}
    </ul>
  );
}

function MetaPill({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <span className="flex items-center gap-1.5 text-[11px] font-semibold text-secondary/60">
      {icon} {label}
    </span>
  );
}

function RelatedCard({ post: p }: { post: RelatedPost }) {
  return (
    <Link href={`/blog/${p.slug}`} className="group block rounded-3xl overflow-hidden border border-border-subtle bg-surface hover:shadow-xl transition-all duration-300">
      <div className="aspect-[16/10] overflow-hidden relative">
        <img src={p.image_url} alt={p.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
        <div className="absolute top-4 left-4">
          <span className="text-[9px] font-black uppercase tracking-widest bg-white/90 text-primary px-3 py-1.5 rounded-full shadow">{p.category}</span>
        </div>
      </div>
      <div className="p-5">
        <p className="text-[9px] font-bold text-secondary/40 mb-2">{new Date(p.published_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</p>
        <h3 className="font-bold text-primary text-sm leading-snug mb-2 group-hover:text-brand transition-colors line-clamp-2">{p.title}</h3>
        <p className="text-xs text-secondary/60 line-clamp-2">{p.excerpt}</p>
        <div className="flex items-center gap-1 mt-3 text-brand text-xs font-bold">Read More <ArrowRight className="w-3.5 h-3.5" /></div>
      </div>
    </Link>
  );
}

function PageSkeleton() {
  return (
    <main className="min-h-screen bg-base">
      <div className="container mx-auto px-6 max-w-7xl pt-40 pb-16">
        <div className="space-y-5 max-w-2xl mb-14">
          <div className="h-5 bg-slate-100 rounded-xl w-28 animate-pulse" />
          <div className="h-12 bg-slate-100 rounded-xl animate-pulse" />
          <div className="h-12 bg-slate-100 rounded-xl w-4/5 animate-pulse" />
          <div className="h-4 bg-slate-100 rounded animate-pulse" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-[200px_1fr_280px] gap-14">
          <div className="hidden lg:block space-y-3">{[1,2,3,4].map(i => <div key={i} className="h-5 bg-slate-100 rounded-xl animate-pulse" />)}</div>
          <div className="space-y-8">{[1,2,3].map(i => <div key={i} className="space-y-3"><div className="h-7 bg-slate-100 rounded-xl w-48 animate-pulse" /><div className="h-4 bg-slate-100 rounded animate-pulse" /><div className="h-4 bg-slate-100 rounded w-4/5 animate-pulse" /></div>)}</div>
          <div className="hidden lg:block"><div className="h-80 bg-slate-100 rounded-3xl animate-pulse" /></div>
        </div>
      </div>
    </main>
  );
}

function NotFound() {
  return (
    <main className="min-h-screen bg-base flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-primary mb-4">Article Not Found</h1>
        <Link href="/blog"><Button>Browse All Articles</Button></Link>
      </div>
    </main>
  );
}
