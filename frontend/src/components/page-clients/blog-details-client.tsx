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
  BookOpen, User, Tag, Zap, Facebook, Share2, Plus, Minus,
} from "lucide-react";
import { cn, safeFetch, fireWebhook } from "@/lib/utils";
import { API_BASE_URL, WEBHOOK_LEAD, WEBHOOK_NEWSLETTER } from "@/lib/constants";
import { InlineLeadForm, LeadPopup } from "@/components/ui/lead-capture";

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
  form_heading: string;
  faqs?: { question: string; answer: string }[];
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
  form_heading: "Get Expert Help on AI Automation",
  faqs: [
    { question: "What types of tasks can AI automation handle?", answer: "AI automation can handle repetitive, rule-based tasks like data entry, report generation, email routing, CRM updates, lead scoring, and customer follow-ups — freeing your team for high-judgment work." },
    { question: "How long does it take to set up an automation workflow?", answer: "Simple workflows typically go live within 1–2 weeks. Complex, multi-system pipelines with custom logic can take 4–8 weeks depending on integration complexity and data quality." },
    { question: "Do I need technical staff to maintain the automations?", answer: "No. We design workflows for non-technical operators. Most clients manage day-to-day operations through a visual dashboard, with our team on call for structural changes." },
    { question: "What is the ROI on AI automation projects?", answer: "Clients typically see a return of 3–5× their investment within the first 6 months, driven by time savings, reduced error rates, and faster lead response times." },
    { question: "Is my data safe in automated workflows?", answer: "Yes. We follow SOC 2–aligned practices, use encrypted data-in-transit, and never store sensitive data outside your approved systems. All vendor integrations go through a security review." },
  ],
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
  const [formError, setFormError] = useState(false);
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", requirement: "" });
  const [openFaqIdx, setOpenFaqIdx] = useState<number | null>(null);
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [newsletterStatus, setNewsletterStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  useEffect(() => {
    async function load() {
      const d = await safeFetch(`${API_BASE_URL}/blogs.php?slug=${slug}`);
      if (d.status === "success") {
        setPost(d.data as any);
        const rd = await safeFetch(`${API_BASE_URL}/blogs.php`);
        if (rd.status === "success" && Array.isArray(rd.data)) {
          const allOtherPosts = (rd.data as any[]).filter((p: any) => p.id !== (d.data as any).id);
          const sameCategory = allOtherPosts
            .filter((p: any) => p.category === (d.data as any).category)
            .sort((a: any, b: any) => new Date(b.published_at).getTime() - new Date(a.published_at).getTime());
          const otherPosts = allOtherPosts
            .filter((p: any) => p.category !== (d.data as any).category)
            .sort((a: any, b: any) => new Date(b.published_at).getTime() - new Date(a.published_at).getTime());
          setRelated([...sameCategory, ...otherPosts].slice(0, 3));
        }
      } else {
        setPost(DEMO_POST);
        setRelated(DEMO_RELATED);
      }
      setLoading(false);
    }
    load().catch(() => { setPost(DEMO_POST); setRelated(DEMO_RELATED); setLoading(false); });
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
    setFormSubmitting(true);
    setFormError(false);
    const payload = { action: "add_lead", full_name: form.name, email: form.email, message: form.requirement, service: `Blog Inquiry: ${post?.title}` };
    const res = await safeFetch(`${API_BASE_URL}/leads.php`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (res.status === "success") {
      fireWebhook(WEBHOOK_LEAD, { ...payload, source: "blog_inline_form", site_name: "Digi Pexel" });
      setFormSent(true);
    } else {
      setFormError(true);
    }
    setFormSubmitting(false);
  };

  const submitNewsletter = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail) return;
    setNewsletterStatus("sending");
    const d = await safeFetch(`${API_BASE_URL}/newsletter.php`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: newsletterEmail }),
    });
    if (d.status === "success") {
      fireWebhook(WEBHOOK_NEWSLETTER, { email: newsletterEmail, source: "blog_page" });
    }
    setNewsletterStatus(d.status === "success" ? "sent" : "error");
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
              <div className="flex items-center gap-3 mb-5">
                <Badge variant="outline" className="section-eyebrow !mb-0">{post.eyebrow || "Article"}</Badge>
                <Badge variant="outline" className="section-eyebrow !mb-0">{post.category}</Badge>
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
            {sections.map((section, i) => (
              <React.Fragment key={i}>
                <SectionBlock section={section} sectionId={section.id || `section-${i}`} />
                {/* 50% inline lead form */}
                {sections.length > 1 && i === Math.floor(sections.length / 2) - 1 && (
                  <InlineLeadForm
                    heading="Want to see how this applies to your business?"
                    subheading="Our team can map this to your ops and show you the ROI within 48 hours."
                    source={`Blog 50%: ${post.title}`}
                  />
                )}
              </React.Fragment>
            ))}

            {/* 100% inline lead form — end of article */}
            {sections.length > 0 && (
              <InlineLeadForm
                heading="Ready to automate your operations?"
                subheading="Tell us your name and number — we'll reach out with a custom plan."
                cta="Book a Free Strategy Call"
                source={`Blog 100%: ${post.title}`}
              />
            )}

            {/* FAQ */}
            {post.faqs && post.faqs.length > 0 && (
              <div className="mt-12 border-t border-slate-100 pt-10">
                <div className="text-center mb-8">
                  <Badge variant="outline" className="section-eyebrow mx-auto mb-4">FAQ</Badge>
                  <h2 className="text-2xl font-display font-bold text-primary">Frequently Asked Questions</h2>
                </div>
                <div className="space-y-3">
                  {post.faqs.map((faq, i) => (
                    <div key={i} className="border border-border-subtle rounded-2xl overflow-hidden">
                      <button
                        className="w-full flex items-center justify-between px-6 py-5 text-left text-sm font-semibold text-primary hover:bg-slate-50/60 transition-colors"
                        onClick={() => setOpenFaqIdx(openFaqIdx === i ? null : i)}
                      >
                        <span className="pr-4 leading-snug">{faq.question}</span>
                        {openFaqIdx === i
                          ? <Minus className="w-4 h-4 text-brand flex-shrink-0" />
                          : <Plus  className="w-4 h-4 text-slate-400 flex-shrink-0" />
                        }
                      </button>
                      {openFaqIdx === i && (
                        <div className="px-6 pb-5 text-sm text-secondary/70 leading-relaxed border-t border-border-subtle bg-slate-50/30">
                          <p className="pt-4">{faq.answer}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Share Bar */}
            <div className="mt-8 border-t border-border-subtle pt-6 flex flex-wrap items-center justify-center gap-6">
              <span className="flex items-center gap-2 text-sm font-semibold text-secondary/70">
                <Share2 className="w-4 h-4 text-brand" />
                Don&apos;t Forget to share this post!
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => { const u = typeof window !== "undefined" ? window.location.href : ""; window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(u)}`); }}
                  className="w-9 h-9 rounded-full bg-white border border-border-subtle flex items-center justify-center text-slate-500 hover:bg-[#1877F2] hover:text-white hover:border-[#1877F2] transition-all"
                  aria-label="Share on Facebook"
                >
                  <Facebook className="w-4 h-4" />
                </button>
                <button
                  onClick={() => share("twitter")}
                  className="w-9 h-9 rounded-full bg-white border border-border-subtle flex items-center justify-center text-slate-500 hover:bg-black hover:text-white hover:border-black transition-all"
                  aria-label="Share on X"
                >
                  <Twitter className="w-4 h-4" />
                </button>
                <button
                  onClick={() => share("linkedin")}
                  className="w-9 h-9 rounded-full bg-white border border-border-subtle flex items-center justify-center text-slate-500 hover:bg-[#0A66C2] hover:text-white hover:border-[#0A66C2] transition-all"
                  aria-label="Share on LinkedIn"
                >
                  <Linkedin className="w-4 h-4" />
                </button>
                <button
                  onClick={() => { const u = typeof window !== "undefined" ? window.location.href : ""; window.open(`https://pinterest.com/pin/create/button/?url=${encodeURIComponent(u)}&description=${encodeURIComponent(post.title)}`); }}
                  className="w-9 h-9 rounded-full bg-white border border-border-subtle flex items-center justify-center text-slate-500 hover:bg-[#E60023] hover:text-white hover:border-[#E60023] transition-all"
                  aria-label="Share on Pinterest"
                >
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M12 0C5.373 0 0 5.373 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 0 1 .083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.632-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0z"/></svg>
                </button>
              </div>
            </div>
          </article>
          <aside className="hidden lg:block">
            <div className="sticky top-28">
              <div className="rounded-3xl border border-border-subtle bg-surface p-6 shadow-xl">
                {!formSent ? (
                  <>
                    <h3 className="text-lg font-display font-bold text-primary leading-snug mb-5">
                      {post.form_heading || "Get Expert Help"}
                    </h3>
                    <form onSubmit={submitForm} className="space-y-3">
                      <div>
                        <input placeholder="Full Name" required className="w-full bg-base border border-border-subtle rounded-2xl px-4 py-3 text-xs focus:outline-none focus:border-brand transition-colors" value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
                        <span className="text-red-500 text-[10px] ml-1">*</span>
                      </div>
                      <div>
                        <input placeholder="Email" required type="email" className="w-full bg-base border border-border-subtle rounded-2xl px-4 py-3 text-xs focus:outline-none focus:border-brand transition-colors" value={form.email} onChange={e => setForm({...form, email: e.target.value})} />
                        <span className="text-red-500 text-[10px] ml-1">*</span>
                      </div>
                      <div>
                        <textarea
                          placeholder="Brief your Requirement"
                          required
                          rows={4}
                          className="w-full bg-base border border-border-subtle rounded-2xl px-4 py-3 text-xs focus:outline-none focus:border-brand transition-colors resize-none"
                          value={form.requirement}
                          onChange={e => setForm({...form, requirement: e.target.value})}
                        />
                        <span className="text-red-500 text-[10px] ml-1">*</span>
                      </div>
                      {formError && (
                        <div className="flex items-start gap-2 rounded-xl bg-rose-50 border border-rose-100 px-3 py-2.5">
                          <span className="text-rose-500 text-sm flex-shrink-0">✕</span>
                          <p className="text-xs text-rose-700">Something went wrong. Please try again.</p>
                        </div>
                      )}
                      <Button type="submit" disabled={formSubmitting} className="w-full rounded-full bg-brand text-white py-3 text-xs font-bold uppercase tracking-widest disabled:opacity-60">
                        {formSubmitting ? "Sending…" : "Consult with Experts"}
                      </Button>
                      <p className="text-center text-[10px] text-secondary/50 leading-relaxed">
                        By submitting this form, you agree to our{" "}
                        <a href="/privacy-policy" className="underline hover:text-brand transition-colors">Privacy Policy</a>
                      </p>
                    </form>
                  </>
                ) : (
                  <div className="py-6 text-center flex flex-col items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center">
                      <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                    </div>
                    <div>
                      <p className="font-bold text-primary text-sm mb-1">Message Sent!</p>
                      <p className="text-xs text-secondary/55">We&apos;ll be in touch within 24 hours.</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </aside>
        </div>
      </div>

      {/* Related Articles */}
      {related.length > 0 && (
        <section className="border-t border-slate-100 py-16">
          <div className="container mx-auto px-6 max-w-7xl">
            <h2 className="text-2xl font-display font-bold text-primary mb-10">
              Related <span className="text-brand">Articles</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {related.map(rel => (
                <Link key={rel.id} href={`/blog/${rel.slug || rel.id}`} className="group flex flex-col rounded-3xl border border-border-subtle bg-surface overflow-hidden hover:border-brand/30 hover:shadow-xl hover:shadow-brand/5 transition-all duration-300">
                  {rel.image_url && (
                    <div className="h-44 overflow-hidden">
                      <img src={rel.image_url} alt={rel.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                    </div>
                  )}
                  <div className="p-6 flex flex-col flex-1">
                    <Badge className="bg-brand/10 text-brand border-none text-[9px] font-bold uppercase tracking-widest mb-3 self-start px-3 py-1 rounded-full">{rel.category}</Badge>
                    <h3 className="text-sm font-bold text-primary leading-tight group-hover:text-brand transition-colors">{rel.title}</h3>
                    <p className="text-xs text-secondary/60 mt-2 line-clamp-2">{rel.excerpt}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Content Page Banner */}
      <ContentPageBanner />

      {/* Newsletter Block */}
      <section className="bg-primary py-20 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-brand/[0.08] blur-[140px] rounded-full pointer-events-none" />
        <div className="container mx-auto px-6 max-w-3xl text-center relative z-10">
          <Badge variant="outline" className="section-eyebrow mx-auto mb-6 border-white/10 bg-white/5 text-white/60">Stay Ahead</Badge>
          <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-4 leading-tight">
            Get insights before they<br />
            <span className="hero-title-accent">become common knowledge</span>
          </h2>
          <p className="text-white/50 text-base mb-10 leading-relaxed">
            Weekly deep dives on AI automation, growth strategy, and the tools shaping the future of business — direct to your inbox.
          </p>
          {newsletterStatus === "sent" ? (
            <div className="flex flex-col items-center gap-2">
              <div className="w-12 h-12 rounded-full bg-emerald-500/20 flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6 text-emerald-400" />
              </div>
              <p className="text-emerald-400 font-bold text-base">You&apos;re subscribed. Welcome aboard!</p>
              <p className="text-white/40 text-sm">Check your inbox for a confirmation.</p>
            </div>
          ) : (
            <form onSubmit={submitNewsletter} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                required
                placeholder="your@email.com"
                value={newsletterEmail}
                onChange={e => setNewsletterEmail(e.target.value)}
                className="flex-1 h-14 bg-white/10 border border-white/20 text-white placeholder:text-white/30 rounded-2xl px-5 text-sm focus:outline-none focus:border-brand/50 transition-all"
              />
              <button
                type="submit"
                disabled={newsletterStatus === "sending"}
                className="h-14 px-8 bg-brand text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-brand/90 disabled:opacity-50 transition-all flex-shrink-0 shadow-lg shadow-brand/30"
              >
                {newsletterStatus === "sending" ? "Subscribing…" : "Subscribe"}
              </button>
            </form>
          )}
          {newsletterStatus === "error" && (
            <p className="text-rose-400 text-sm mt-3">Something went wrong. Please try again.</p>
          )}
          {newsletterStatus === "error" && (
            <p className="text-red-400 text-xs mt-3">Something went wrong. Please try again.</p>
          )}
        </div>
      </section>

      <Footer />
      <LeadPopup
        source={`Blog: ${post.title}`}
        heading="Get a free demo"
        subheading="See how Digi Pexel helps you automate operations and win more business."
      />
    </main>
  );
}

function ContentPageBanner() {
  const [banner, setBanner] = React.useState<{enabled:boolean;text:string;ctaLabel:string;ctaLink:string;bgColor:string}|null>(null);
  React.useEffect(() => {
    safeFetch(`${API_BASE_URL}/banners.php`)
      .then(json => {
        const bd = json?.data as { banner?: typeof banner } | undefined;
        if (json?.status === "success" && bd?.banner?.enabled) {
          setBanner(bd.banner);
        }
      });
  }, []);
  if (!banner) return null;
  return (
    <div className="my-8 rounded-2xl p-6 text-white flex items-center justify-between gap-4 flex-wrap" style={{ backgroundColor: banner.bgColor || "#7C3AED" }}>
      <p className="font-semibold text-sm">{banner.text}</p>
      <a href={banner.ctaLink} className="shrink-0 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-xl text-sm font-bold transition-colors">
        {banner.ctaLabel}
      </a>
    </div>
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
