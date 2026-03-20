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

// Types
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

export default function BlogDetailsClient({ slug }: { slug: string }) {
  const [post, setPost] = useState<BlogPost | null>(null);
  const [related, setRelated] = useState<RelatedPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeId, setActiveId] = useState("");
  const [copied, setCopied] = useState(false);
  const [formSent, setFormSent] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", company: "", message: "" });

  useEffect(() => {
    fetch(`/backend/api/blogs.php?slug=${slug}`)
      .then(r => r.json())
      .then(d => {
        if (d.status === "success") {
          setPost(d.data);
          fetch("/backend/api/blogs.php")
            .then(r => r.json())
            .then(rd => {
              if (rd.status === "success") {
                setRelated(rd.data.filter((p: any) => p.id !== d.data.id).slice(0, 3));
              }
            });
        } else {
          setPost(DEMO_POST);
          setRelated(DEMO_RELATED);
        }
      })
      .catch(() => { setPost(DEMO_POST); setRelated(DEMO_RELATED); })
      .finally(() => setLoading(false));
  }, [slug]);

  useEffect(() => {
    if (!post) return;
    const obs = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) setActiveId(e.target.id); }),
      { rootMargin: "-10% 0px -65% 0px" }
    );
    document.querySelectorAll("[data-section-anchor]").forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, [post]);

  const getSections = (): BlogSection[] => {
    if (post?.sections?.length) return post.sections;
    if (post?.content) return [{ type: "text", title: "Article", content: post.content }];
    return [];
  };

  const share = (platform: string) => {
    const url = typeof window !== "undefined" ? window.location.href : "";
    const txt = `${post?.title}`;
    if (platform === "twitter")  window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(txt)}&url=${encodeURIComponent(url)}`);
    if (platform === "linkedin") window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`);
    if (platform === "copy")     { navigator.clipboard.writeText(url); setCopied(true); setTimeout(() => setCopied(false), 2000); }
  };

  const submitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetch("/backend/api/leads.php", {
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
      <section className="relative pt-32 pb-14 overflow-hidden bg-base">
        <div className="absolute inset-x-0 top-0 h-[600px] bg-gradient-to-b from-brand/[0.04] to-transparent pointer-events-none" />
        <div className="container mx-auto px-6 max-w-7xl relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-14 items-start">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <div className="flex flex-wrap items-center gap-3 mb-5">
                <Badge variant="outline" className="section-eyebrow">{post.eyebrow || "Article"}</Badge>
                <span className="text-[10px] font-black uppercase tracking-widest text-brand/60 bg-brand/8 border border-brand/15 px-3 py-1 rounded-full">{post.category}</span>
              </div>
              <h1 className="text-3xl md:text-5xl font-display font-bold text-primary leading-[1.1] mb-5 max-w-2xl">{post.title}</h1>
              <p className="text-secondary/70 text-lg leading-relaxed max-w-xl mb-7">{post.subtitle || post.excerpt}</p>
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
            </motion.div>
            {post.image_url && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.15 }} className="hidden lg:block">
                <div className="rounded-3xl overflow-hidden border border-border-subtle shadow-2xl aspect-[4/3]">
                  <img src={post.image_url} alt={post.title} className="w-full h-full object-cover" />
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </section>
      <div className="border-t border-slate-100" />
      <div className="container mx-auto px-6 max-w-7xl py-14">
        <div className="grid grid-cols-1 lg:grid-cols-[200px_1fr_280px] gap-8 xl:gap-14">
          <aside className="hidden lg:block">
            <div className="sticky top-28 space-y-6">
              {tocItems.map((s, i) => (
                <a key={i} href={`#${s.id || `section-${i}`}`} className={cn("block text-xs py-1.5 px-3 rounded-xl", activeId === (s.id || `section-${i}`) ? "text-brand bg-brand/8 font-bold" : "text-slate-400 font-medium")}>{s.title}</a>
              ))}
            </div>
          </aside>
          <article className="min-w-0 max-w-none">
            {sections.map((section, i) => <SectionBlock key={i} section={section} sectionId={section.id || `section-${i}`} />)}
          </article>
          <aside className="hidden lg:block">
            <div className="sticky top-28">
              <div className="rounded-3xl border border-border-subtle bg-surface p-6 shadow-xl">
                {!formSent ? (
                  <form onSubmit={submitForm} className="space-y-4">
                    <input placeholder="Full Name" required className="w-full bg-base border border-border-subtle rounded-2xl px-4 py-3 text-xs" value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
                    <input placeholder="Work Email" required type="email" className="w-full bg-base border border-border-subtle rounded-2xl px-4 py-3 text-xs" value={form.email} onChange={e => setForm({...form, email: e.target.value})} />
                    <Button type="submit" className="w-full rounded-full bg-brand text-white py-3">Consult Experts</Button>
                  </form>
                ) : <p className="text-center font-bold">Success!</p>}
              </div>
            </div>
          </aside>
        </div>
      </div>
      <Footer />
    </main>
  );
}

function SectionBlock({ section: s, sectionId }: { section: BlogSection; sectionId: string }) {
  if (s.type === "mid_cta") return null;
  return (
    <div id={sectionId} data-section-anchor className="mb-12">
      {s.title && <h2 className="text-2xl font-display font-bold text-primary mb-4">{s.title}</h2>}
      {s.content && <p className="text-secondary/80 text-sm leading-relaxed">{s.content}</p>}
      {s.points && (
        <ul className="mt-4 space-y-2">
          {s.points.map((p, i) => <li key={i} className="flex gap-2 text-sm text-secondary/70"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> {p}</li>)}
        </ul>
      )}
    </div>
  );
}

function MetaPill({ icon, label }: { icon: any; label: string }) {
  return <span className="flex items-center gap-1.5 text-[11px] font-semibold text-secondary/50">{icon} {label}</span>;
}

function PageSkeleton() { return <div className="p-20 text-center">Loading...</div>; }
function NotFound() { return <div className="p-20 text-center">Post Not Found</div>; }
