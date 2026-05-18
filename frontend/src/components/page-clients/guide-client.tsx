"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Navbar } from "@/components/blocks/floating-icons-hero-demo";
import { Footer } from "@/components/ui/footer-section";
import { safeFetch, fireWebhook } from "@/lib/utils";
import { API_BASE_URL, WEBHOOK_LEAD, WEBHOOK_NEWSLETTER } from "@/lib/constants";
import { CheckCircle2, Download, FileText, BookOpen, ArrowRight } from "lucide-react";
import { InlineLeadForm, LeadPopup } from "@/components/ui/lead-capture";

interface GuideChapter { title: string; desc: string; }

interface GuideStructured {
  subtitle?: string;
  file_url?: string;
  pages_count?: string;
  format?: string;
  chapters?: GuideChapter[];
  benefits?: string[];
}

interface Guide {
  id: number;
  title: string;
  slug: string;
  description: string;
  content: string;
  image_url: string;
  category: string;
  cta_label: string;
  cta_link: string;
}

function parseStructured(content: string): GuideStructured {
  try { return JSON.parse(content) as GuideStructured; } catch { return {}; }
}

const FALLBACK_GUIDES: Guide[] = [
  {
    id: 1, title: "The 2025 AI Automation Roadmap", slug: "ai-automation-roadmap",
    description: "How to audit your business for high-ROI automation opportunities and build a 12-month deployment plan that delivers measurable results within 90 days.",
    content: JSON.stringify({ subtitle: "A step-by-step framework for auditing your operations and deploying AI workflows that actually stick", file_url: "", pages_count: "42", format: "PDF", chapters: [{ title: "Why Automation Projects Fail", desc: "The 5 common mistakes and how to avoid them before you start." }, { title: "Mapping Your Automation Candidates", desc: "A 3-step audit framework for identifying high-ROI workflows in your ops." }, { title: "Building the Business Case", desc: "How to quantify time savings and present ROI to leadership." }, { title: "The 90-Day Deployment Plan", desc: "Week-by-week rollout roadmap with milestones and checkpoints." }, { title: "Scaling Without Breaking Things", desc: "Error handling, monitoring, and maintenance strategies at scale." }, { title: "Measuring ROI and Reporting", desc: "Dashboards, metrics, and how to communicate automation impact." }], benefits: ["Identify your top 3 highest-ROI automation opportunities", "Build a credible business case for AI investment", "Avoid the 5 most common deployment mistakes", "Get a week-by-week 90-day implementation roadmap", "Know which tools fit your stack and budget", "Present automation results clearly to stakeholders"] }),
    image_url: "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=800", category: "Strategy", cta_label: "Download the Roadmap", cta_link: "#",
  },
  {
    id: 2, title: "n8n for Enterprise: A Scaling Guide", slug: "n8n-enterprise-guide",
    description: "Advanced patterns for managing hundreds of workflows with error handling, version control, and security.",
    content: JSON.stringify({ subtitle: "Proven enterprise patterns for teams running n8n at scale", file_url: "", pages_count: "36", format: "PDF", chapters: [{ title: "Self-Hosting Architecture", desc: "Deploy n8n on your own infrastructure with redundancy." }, { title: "Workflow Version Control", desc: "Git-based workflow management and rollback strategies." }, { title: "Error Handling Patterns", desc: "Retry logic, dead letter queues, and alerting." }, { title: "Security & Access Control", desc: "Role-based access, secrets management, and audit logs." }, { title: "Performance at Scale", desc: "Queue management, execution limits, and database optimization." }, { title: "Monitoring & Observability", desc: "Real-time dashboards, alerting, and workflow health tracking at enterprise scale." }], benefits: ["Deploy n8n on your own infrastructure securely", "Manage hundreds of workflows without chaos", "Implement robust error handling and monitoring", "Set up role-based access for your team", "Scale to thousands of executions per day"] }),
    image_url: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800", category: "Technical", cta_label: "Download the Guide", cta_link: "#",
  },
  {
    id: 3, title: "Scaling YouTube with AI Agents", slug: "youtube-ai-agents",
    description: "Our proprietary framework for automating research, scriptwriting, and production coordination on YouTube.",
    content: JSON.stringify({ subtitle: "Automate your entire YouTube production pipeline with custom AI agents", file_url: "", pages_count: "28", format: "PDF", chapters: [{ title: "Topic Research at Scale", desc: "Use AI agents to identify winning video ideas automatically." }, { title: "AI Scriptwriting Framework", desc: "Generate and refine scripts with structured prompts." }, { title: "Production Coordination", desc: "Automate briefs, timelines, and team assignments." }, { title: "Thumbnail & SEO Automation", desc: "AI-powered titles, descriptions, and thumbnail concepts." }, { title: "Distribution & Scheduling", desc: "Automate upload schedules, community posts, and cross-platform distribution." }, { title: "Analytics & Iteration Loop", desc: "Feed performance data back into your AI to continuously improve content output." }], benefits: ["Research 50+ video ideas per week automatically", "Cut scriptwriting time by 70%", "Coordinate production with zero manual briefs", "Optimise titles and thumbnails with AI"] }),
    image_url: "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?auto=format&fit=crop&q=80&w=800", category: "Social", cta_label: "Download the Framework", cta_link: "#",
  },
  {
    id: 4, title: "Zero-Touch Accounting Workflows", slug: "accounting-automation",
    description: "How to automate AP/AR and reconciliation using AI and modern fintech integrations safely.",
    content: JSON.stringify({ subtitle: "Automate your finance operations without compliance risk", file_url: "", pages_count: "32", format: "PDF", chapters: [{ title: "AP Automation Fundamentals", desc: "Automate invoice receipt, approval routing, and payment." }, { title: "AR and Collections Automation", desc: "Intelligent follow-up sequences and payment reconciliation." }, { title: "Bank Reconciliation at Scale", desc: "Daily auto-reconciliation with exception flagging." }, { title: "Compliance and Audit Trail", desc: "Maintaining a clean audit trail through automated workflows." }, { title: "Expense Management Automation", desc: "Auto-categorise and approve employee expenses with AI-powered rules." }, { title: "Financial Reporting at Speed", desc: "Generate real-time P&L, cash flow, and board reports without manual input." }], benefits: ["Eliminate manual invoice data entry", "Automate payment reminders and collections", "Run daily bank reconciliation without staff", "Maintain a complete compliance audit trail"] }),
    image_url: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&q=80&w=800", category: "Operations", cta_label: "Download the Playbook", cta_link: "#",
  },
  {
    id: 5, title: "Lead Scoring and Nurture at Scale", slug: "lead-nurture-automation",
    description: "Building autonomous sales systems that identify intent and follow up 24/7 without losing the human touch.",
    content: JSON.stringify({ subtitle: "Deploy AI-driven lead scoring and nurture that converts while you sleep", file_url: "", pages_count: "38", format: "PDF", chapters: [{ title: "Intent Signal Identification", desc: "Which signals indicate buyer readiness and how to capture them." }, { title: "AI Lead Scoring Models", desc: "Build and tune a lead score that predicts conversion." }, { title: "Automated Nurture Sequences", desc: "Trigger-based sequences personalised by behaviour." }, { title: "CRM Integration Patterns", desc: "Syncing scores and activities into HubSpot or Salesforce." }, { title: "Measuring Conversion Impact", desc: "Attribution models for automated nurture programs." }, { title: "Sales & Marketing Alignment", desc: "Shared scoring definitions and handoff protocols that close the revenue loop." }], benefits: ["Score every inbound lead automatically in real time", "Route hot leads to sales instantly, 24/7", "Nurture cold leads without manual follow-ups", "Integrate directly with your existing CRM", "Measure the revenue impact of automation"] }),
    image_url: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800", category: "Sales", cta_label: "Download the Sales Guide", cta_link: "#",
  },
  {
    id: 6, title: "The AI SEO Playbook", slug: "ai-seo-playbook",
    description: "Everything you need to know about Generative Engine Optimisation (GEO) and owning AI answers in search.",
    content: JSON.stringify({ subtitle: "Win in the AI answer era — get your brand cited by ChatGPT, Perplexity, and Google AI Overviews", file_url: "", pages_count: "44", format: "PDF", chapters: [{ title: "Why GEO Matters Now", desc: "How AI search is replacing traditional rankings and what it means for your traffic." }, { title: "Citation Architecture", desc: "What content structures LLMs prefer when selecting sources." }, { title: "Authority Signal Building", desc: "The signals that make AI models trust your domain." }, { title: "Content Strategy for AI Search", desc: "Formats, depth, and topical authority frameworks." }, { title: "Measuring GEO Performance", desc: "Track brand mentions in AI responses and citation share." }, { title: "Competitor Citation Analysis", desc: "Identify which competitor content gets cited by AI and build a strategy to outrank it." }], benefits: ["Understand why your content gets cited (or doesn't) by AI", "Build topical authority that AI models recognise", "Optimise existing content for AI search inclusion", "Track your brand's AI citation share over time", "Outperform competitors in AI answer results"] }),
    image_url: "https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?auto=format&fit=crop&q=80&w=800", category: "Marketing", cta_label: "Download the SEO Playbook", cta_link: "#",
  },
];

function ContentPageBanner() {
  const [banner, setBanner] = React.useState<{ enabled: boolean; text: string; ctaLabel: string; ctaLink: string; bgColor: string } | null>(null);
  React.useEffect(() => {
    safeFetch(`${API_BASE_URL}/banners.php`).then(json => {
      const bd = json?.data as { banner?: typeof banner } | undefined;
      if (json?.status === "success" && bd?.banner?.enabled) setBanner(bd.banner);
    });
  }, []);
  if (!banner) return null;
  return (
    <div className="my-8 rounded-2xl p-6 text-white flex items-center justify-between gap-4 flex-wrap" style={{ backgroundColor: banner.bgColor || "#7C3AED" }}>
      <p className="font-semibold text-sm">{banner.text}</p>
      <a href={banner.ctaLink} className="shrink-0 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-xl text-sm font-bold transition-colors">{banner.ctaLabel}</a>
    </div>
  );
}

export default function GuideClient({ id }: { id: string }) {
  const [guide, setGuide] = useState<Guide | null>(null);
  const [loading, setLoading] = useState(true);
  const [formSent, setFormSent] = useState(false);
  const [formError, setFormError] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", company: "", phone: "" });
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [newsletterStatus, setNewsletterStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  useEffect(() => {
    async function fetchGuide() {
      try {
        const data = await safeFetch(`${API_BASE_URL}/guides.php`);
        if (data?.status === "success") {
          const found = (data.data as Guide[]).find((g: Guide) => g.id.toString() === id);
          setGuide(found || FALLBACK_GUIDES.find(g => g.id.toString() === id) || null);
        } else {
          setGuide(FALLBACK_GUIDES.find(g => g.id.toString() === id) || null);
        }
      } catch {
        setGuide(FALLBACK_GUIDES.find(g => g.id.toString() === id) || null);
      } finally {
        setLoading(false);
      }
    }
    fetchGuide();
  }, [id]);

  const submitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setFormError(false);
    const payload = {
      action: "add_lead",
      full_name: form.name,
      email: form.email,
      company: form.company,
      message: `Guide Download Request. Phone: ${form.phone}`,
      service: `Guide: ${guide?.title}`,
    };
    const res = await safeFetch(`${API_BASE_URL}/leads.php`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (res.status === "success") {
      fireWebhook(WEBHOOK_LEAD, { ...payload, source: "guide_download_form" });
      setFormSent(true);
    } else {
      setFormError(true);
    }
    setSubmitting(false);
  };

  const submitNewsletter = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail) return;
    setNewsletterStatus("sending");
    const d = await safeFetch(`${API_BASE_URL}/newsletter.php`, {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: newsletterEmail }),
    });
    if (d.status === "success") {
      fireWebhook(WEBHOOK_NEWSLETTER, { email: newsletterEmail, source: "guide_page" });
    }
    setNewsletterStatus(d.status === "success" ? "sent" : "error");
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center text-secondary/50 text-sm">Loading…</div>;
  if (!guide) return <div className="min-h-screen flex items-center justify-center text-secondary/50 text-sm">Guide not found.</div>;

  const structured = parseStructured(guide.content);
  const { subtitle, file_url, pages_count, format = "PDF", chapters = [], benefits = [] } = structured;

  // Form JSX reused in both desktop and mobile positions
  const formCard = (
    <div id="guide-form" className="rounded-3xl border border-border-subtle bg-surface shadow-2xl p-6 h-full flex flex-col">
      <div className="flex items-center gap-3 flex-wrap mb-5 pb-4 border-b border-border-subtle">
        <span className="flex items-center gap-1.5 text-[11px] font-bold text-secondary/60 uppercase tracking-widest">
          <FileText className="w-3.5 h-3.5 text-brand" /> {format}
        </span>
        {pages_count && (
          <span className="flex items-center gap-1.5 text-[11px] font-bold text-secondary/60 uppercase tracking-widest">
            <BookOpen className="w-3.5 h-3.5 text-brand" /> {pages_count} Pages
          </span>
        )}
        <Badge variant="outline" className="text-[9px] font-black uppercase tracking-widest border-brand/20 text-brand bg-brand/5">
          {guide.category}
        </Badge>
      </div>
      {!formSent ? (
        <>
          <h3 className="text-lg font-display font-bold text-primary mb-1">Get Your Free Guide</h3>
          <p className="text-xs text-secondary/60 mb-5">Fill in your details to get instant access.</p>
          <form onSubmit={submitForm} className="space-y-3 flex-1">
            <input required placeholder="Full Name *"
              className="w-full bg-base border border-border-subtle rounded-2xl px-4 py-3 text-sm focus:outline-none focus:border-brand transition-colors placeholder:text-secondary/40"
              value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
            <input required type="email" placeholder="Work Email *"
              className="w-full bg-base border border-border-subtle rounded-2xl px-4 py-3 text-sm focus:outline-none focus:border-brand transition-colors placeholder:text-secondary/40"
              value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
            <input required placeholder="Company Name *"
              className="w-full bg-base border border-border-subtle rounded-2xl px-4 py-3 text-sm focus:outline-none focus:border-brand transition-colors placeholder:text-secondary/40"
              value={form.company} onChange={e => setForm({ ...form, company: e.target.value })} />
            <input type="tel" placeholder="Phone (optional)"
              className="w-full bg-base border border-border-subtle rounded-2xl px-4 py-3 text-sm focus:outline-none focus:border-brand transition-colors placeholder:text-secondary/40"
              value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
            {formError && (
              <div className="flex items-start gap-2 rounded-xl bg-rose-50 border border-rose-100 px-3 py-2.5">
                <span className="text-rose-500 text-sm flex-shrink-0">✕</span>
                <p className="text-xs text-rose-700">Something went wrong. Please try again.</p>
              </div>
            )}
            <button type="submit" disabled={submitting}
              className="w-full flex items-center justify-center gap-2 bg-brand text-white py-4 rounded-full text-sm font-black uppercase tracking-widest hover:bg-brand/90 disabled:opacity-60 transition-all shadow-lg shadow-brand/20 mt-1">
              <Download className="w-4 h-4" />
              {submitting ? "Processing…" : (guide.cta_label || "Download Now")}
            </button>
            <p className="text-center text-[10px] text-secondary/40 leading-relaxed pt-1">
              By submitting, you agree to our{" "}
              <a href="/privacy-policy" className="underline hover:text-brand transition-colors">Privacy Policy</a>. No spam, ever.
            </p>
          </form>
        </>
      ) : (
        <div className="text-center py-4 flex-1 flex flex-col items-center justify-center">
          <div className="w-14 h-14 rounded-full bg-emerald-50 flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="w-7 h-7 text-emerald-500" />
          </div>
          <h3 className="text-base font-display font-bold text-primary mb-1">You&apos;re All Set!</h3>
          <p className="text-xs text-secondary/60 mb-5">
            {file_url && file_url !== "#" && file_url !== "" ? "Your guide is ready to download." : "We'll send the guide to your email shortly."}
          </p>
          {file_url && file_url !== "#" && file_url !== "" && (
            <a href={file_url} target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 w-full justify-center bg-brand text-white py-4 rounded-full text-sm font-black uppercase tracking-widest hover:bg-brand/90 transition-all shadow-lg shadow-brand/20">
              <Download className="w-4 h-4" /> Download Now
            </a>
          )}
        </div>
      )}
    </div>
  );

  return (
    <main className="min-h-screen bg-base">
      <Navbar className="top-0" darkHero={false} />

      {/* ── Hero — title & description ────────────────────────────────────── */}
      <section className="relative pt-32 pb-10 overflow-hidden bg-base">
        <div className="absolute inset-x-0 top-0 h-[500px] bg-gradient-to-b from-brand/[0.04] to-transparent pointer-events-none" />
        <div className="container mx-auto px-6 max-w-4xl relative z-10 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <Badge variant="outline" className="section-eyebrow mb-5 mx-auto">{guide.category}</Badge>
            <h1 className="text-3xl md:text-5xl font-display font-bold text-primary leading-[1.1] mb-4">
              {guide.title}
            </h1>
            {subtitle && <p className="text-secondary/70 text-lg leading-relaxed mb-3">{subtitle}</p>}
            <p className="text-secondary/55 text-base leading-relaxed">{guide.description}</p>
          </motion.div>
        </div>
      </section>

      {/* ── Image + Form — side by side ───────────────────────────────────── */}
      <section className="container mx-auto px-6 max-w-6xl pb-16">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch"
        >
          {/* Cover image */}
          {guide.image_url ? (
            <div className="relative rounded-2xl overflow-hidden border-2 border-border-subtle shadow-lg h-full min-h-[360px] w-full">
              <img src={guide.image_url} alt={guide.title} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/50 via-transparent to-transparent pointer-events-none" />
              <div className="absolute bottom-4 left-4 right-4 flex items-center gap-2 flex-wrap">
                <span className="text-[9px] font-black uppercase tracking-widest text-white bg-black/30 backdrop-blur-sm px-2.5 py-1 rounded-full">{format}</span>
                {pages_count && (
                  <span className="text-[9px] font-black uppercase tracking-widest text-white/90 bg-black/30 backdrop-blur-sm px-2.5 py-1 rounded-full">{pages_count} Pages</span>
                )}
                <span className="ml-auto text-[9px] font-black uppercase tracking-widest text-white bg-brand/80 backdrop-blur-sm px-2.5 py-1 rounded-full">{guide.category}</span>
              </div>
            </div>
          ) : (
            <div className="rounded-2xl bg-surface border-2 border-border-subtle h-full min-h-[360px] flex items-center justify-center">
              <FileText className="w-16 h-16 text-secondary/20" />
            </div>
          )}

          {/* Download form */}
          {formCard}
        </motion.div>
      </section>

      {/* ── What's Inside — chapters ──────────────────────────────────────── */}
      {chapters.length > 0 && (
        <section className="container mx-auto px-6 max-w-6xl py-20">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.25 }}
          >
            <div className="text-center mb-12">
              <Badge variant="outline" className="section-eyebrow mb-4 mx-auto">Inside This Guide</Badge>
              <h2 className="text-2xl md:text-4xl font-display font-bold text-primary">What&apos;s covered</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {chapters.map((ch, i) => (
                <div key={i} className="flex flex-col gap-5 p-7 rounded-2xl border border-border-subtle bg-surface hover:border-brand/30 hover:shadow-md transition-all">
                  <span className="w-11 h-11 rounded-full bg-brand/10 text-brand text-sm font-black flex items-center justify-center flex-shrink-0">
                    {i + 1}
                  </span>
                  <div>
                    <p className="text-base font-bold text-primary mb-2">{ch.title}</p>
                    <p className="text-sm text-secondary/60 leading-relaxed">{ch.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </section>
      )}

      {/* ── Benefits ─────────────────────────────────────────────────────── */}
      {benefits.length > 0 && (
        <section className="container mx-auto px-6 max-w-6xl py-20">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="rounded-3xl bg-surface border border-border-subtle p-10 md:p-16"
          >
            <div className="text-center mb-12">
              <Badge variant="outline" className="section-eyebrow mb-4 mx-auto">What You&apos;ll Get</Badge>
              <h2 className="text-2xl md:text-4xl font-display font-bold text-primary">After reading this guide you will</h2>
            </div>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-4xl mx-auto">
              {benefits.map((b, i) => (
                <li key={i} className="flex items-start gap-4 p-5 rounded-2xl border border-border-subtle bg-base/60 hover:border-emerald-200 transition-colors">
                  <div className="w-9 h-9 rounded-full bg-emerald-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <CheckCircle2 className="w-4.5 h-4.5 text-emerald-500" />
                  </div>
                  <span className="text-sm text-secondary/80 leading-relaxed pt-2">{b}</span>
                </li>
              ))}
            </ul>
            <div className="text-center mt-12">
              <a href="#guide-form"
                className="inline-flex items-center gap-2 bg-brand text-white px-10 py-4 rounded-full text-sm font-black uppercase tracking-widest hover:bg-brand/90 transition-all shadow-lg shadow-brand/20">
                <Download className="w-4 h-4" />
                {guide.cta_label || "Get the Guide Free"}
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </motion.div>
        </section>
      )}

      {/* 100% inline lead form */}
      <div className="container mx-auto px-6 max-w-4xl py-16">
        <InlineLeadForm
          heading="Want a personalised walkthrough of this guide?"
          subheading="Drop your name and number — we'll walk you through the key takeaways and how they apply to your business."
          cta="Get a Walkthrough"
          source={`Guide 100%: ${guide.title}`}
        />
      </div>

      {/* Content Page Banner */}
      <div className="container mx-auto px-6 max-w-7xl">
        <ContentPageBanner />
      </div>

      {/* Newsletter */}
      <section className="bg-primary py-20 mt-12 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-brand/[0.08] blur-[140px] rounded-full pointer-events-none" />
        <div className="container mx-auto px-6 max-w-3xl text-center relative z-10">
          <Badge variant="outline" className="section-eyebrow mx-auto mb-6 border-white/10 bg-white/5 text-white/60">Stay Ahead</Badge>
          <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-4 leading-tight">
            Get the next playbook<br />
            <span className="hero-title-accent">before it drops</span>
          </h2>
          <p className="text-white/50 text-base mb-10 leading-relaxed">
            Join operators and founders getting Digi Pexel&apos;s latest automation frameworks, case studies, and guides — direct to their inbox.
          </p>
          {newsletterStatus === "sent" ? (
            <div className="flex flex-col items-center gap-2">
              <div className="w-12 h-12 rounded-full bg-emerald-500/20 flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6 text-emerald-400" />
              </div>
              <p className="text-emerald-400 font-bold text-base">You&apos;re on the list. Watch your inbox!</p>
              <p className="text-white/40 text-sm">Check your inbox for a confirmation.</p>
            </div>
          ) : (
            <>
            <form onSubmit={submitNewsletter} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email" required placeholder="your@email.com"
                value={newsletterEmail} onChange={e => setNewsletterEmail(e.target.value)}
                className="flex-1 h-14 bg-white/10 border border-white/20 text-white placeholder:text-white/30 rounded-2xl px-5 text-sm focus:outline-none focus:border-brand/50 transition-all"
              />
              <button
                type="submit" disabled={newsletterStatus === "sending"}
                className="h-14 px-8 bg-brand text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-brand/90 disabled:opacity-50 transition-all flex-shrink-0 shadow-lg shadow-brand/30"
              >
                {newsletterStatus === "sending" ? "Subscribing…" : "Subscribe"}
              </button>
            </form>
            {newsletterStatus === "error" && (
              <p className="text-rose-400 text-sm mt-3">Something went wrong. Please try again.</p>
            )}
            </>
          )}
        </div>
      </section>

      <Footer />
      <LeadPopup
        source={`Guide: ${guide.title}`}
        heading="Get a free demo"
        subheading="See how Digi Pexel can help you automate your business and grow faster."
      />
    </main>
  );
}
