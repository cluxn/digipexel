"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Navbar } from "@/components/blocks/floating-icons-hero-demo";
import { Footer } from "@/components/ui/footer-section";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ArrowRight, CheckCircle2, XCircle, TrendingUp, AlertTriangle,
  Lightbulb, BookOpen, Zap, Quote, ExternalLink, Building2, Tag,
} from "lucide-react";
import { cn } from "@/lib/utils";

// ── Types ─────────────────────────────────────────────────────────────────────
interface HeroStat   { label: string; value: string }
interface Metric     { label: string; value: string; desc: string }
interface Phase      { phase: string; title: string; desc: string }
interface CompRow    { before: string; after: string }
interface GalleryImg { url: string; caption?: string }

interface CaseSection {
  id?: string;
  type: string;
  title?: string;
  content?: string;
  image?: string;
  points?: string[];
  comparison?: { before_label: string; after_label: string; rows: CompRow[] };
  metrics?: Metric[];
  cta_text?: string;
  cta_label?: string;
  cta_url?: string;
  phases?: Phase[];
  quote?: string;
  author?: string;
  author_role?: string;
  author_company?: string;
  author_avatar?: string;
  tech_tags?: string[];
  gallery?: GalleryImg[];
}

interface CaseStudy {
  id: number;
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
  hero_cta_label: string;
  hero_cta_url: string;
  hero_stats: HeroStat[];
  image_url: string;
  sections: CaseSection[];
  show_related: boolean;
  challenge?: string;
  solution?: string;
  results?: string;
}

interface RelatedCase {
  id: number; title: string; slug: string; subtitle: string;
  image_url: string; industry: string; client_name: string;
}

// ── Demo fallback data ─────────────────────────────────────────────────────────
const DEMO_CASE: CaseStudy = {
  id: 0,
  title: "How FinFlows Automated 90% of Their Back-Office Ops",
  slug: "finflows-automation",
  eyebrow: "Case Study",
  subtitle: "AI-powered workflow automation that eliminated manual processing and cut operational costs by 60%.",
  description: "FinFlows, a fast-growing fintech platform, partnered with Digi Pexel to automate their loan processing, KYC verification, and reporting pipelines — enabling the ops team to focus on high-value decisions.",
  client_name: "FinFlows Inc.",
  client_logo: "",
  client_image: "",
  industry: "Fintech",
  service_tags: ["AI Automation", "Workflow Design", "System Integration"],
  hero_cta_label: "Read Full Story",
  hero_cta_url: "/contact-us",
  hero_stats: [
    { label: "Ops Cost Reduction", value: "60%" },
    { label: "Processes Automated", value: "40+" },
    { label: "Hours Saved / Week", value: "320h" },
    { label: "ROI in 90 Days", value: "4.2×" },
  ],
  image_url: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80",
  show_related: true,
  sections: [
    {
      type: "overview",
      title: "Client Overview",
      content: "FinFlows is a B2B lending platform that processes over 2,000 loan applications per month across SME and consumer segments. As they scaled, their operations team was buried under manual data entry, duplicate verification steps, and fragmented reporting — limiting their ability to grow without proportionally increasing headcount.",
      points: [
        "2,000+ monthly loan applications",
        "Operations team of 12 processing 80% of work manually",
        "4-day average loan processing cycle",
        "No centralised visibility into pipeline health",
      ],
    },
    {
      type: "challenge",
      title: "The Challenge",
      content: "Their existing tech stack — a legacy CRM, separate KYC provider, and manual Excel reporting — created a patchwork of disconnected tools that required constant human intervention. Each loan application triggered a chain of 18+ manual steps across 5 systems.",
      image: "https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=800&q=80",
      points: [
        "18+ manual steps per loan application",
        "KYC checks delayed by 48–72 hours due to manual uploads",
        "Reporting compiled by hand every Monday morning",
        "No alerts when applications stalled in the pipeline",
      ],
    },
    {
      type: "solution",
      title: "Our Solution",
      content: "We designed an end-to-end automation layer connecting their CRM, KYC provider, internal database, and reporting dashboard — eliminating human touchpoints for routine steps while preserving human oversight for edge cases and approvals.",
      image: "https://images.unsplash.com/photo-1518186285589-2f7649de83e0?w=800&q=80",
      points: [
        "Built a no-code automation hub using n8n + custom API bridges",
        "KYC documents now automatically fetched, parsed, and filed",
        "Real-time Slack alerts for stalled or flagged applications",
        "Automated daily and weekly reports delivered to stakeholders",
        "Exception-only escalation — humans review only flagged cases",
      ],
    },
    {
      type: "timeline",
      title: "Implementation Roadmap",
      content: "We followed a phased delivery to minimise disruption and validate ROI at each stage before expanding scope.",
      phases: [
        { phase: "Week 1–2", title: "Discovery & Mapping", desc: "Audited every manual step across all 5 systems, mapped data flows, and identified the 10 highest-impact automation opportunities." },
        { phase: "Week 3–5", title: "Core Automation Build", desc: "Deployed KYC automation, CRM-to-database sync, and the Slack alerting system. First ROI visible within 2 weeks." },
        { phase: "Week 6–7", title: "Reporting & Dashboard", desc: "Built automated reporting pipelines and a live ops dashboard giving the team real-time visibility for the first time." },
        { phase: "Week 8", title: "Handover & Training", desc: "Trained the ops team, documented all workflows, and established an SLA for ongoing optimisation support." },
      ],
    },
    {
      type: "metrics",
      title: "Results After 90 Days",
      content: "Within 90 days of full deployment, FinFlows saw transformational improvements across speed, cost, and team capacity.",
      metrics: [
        { label: "Ops Cost Reduction", value: "60%", desc: "Annual savings of ~£180k vs. prior headcount trajectory" },
        { label: "Loan Processing Time", value: "4d → 6h", desc: "Application cycle cut by 94%" },
        { label: "Hours Freed Weekly", value: "320h", desc: "Ops team reallocated to strategic work" },
        { label: "Error Rate", value: "−98%", desc: "Near-zero data entry errors after full automation" },
      ],
    },
    {
      type: "testimonial",
      quote: "Digi Pexel didn't just automate tasks — they redesigned how we operate. We went from firefighting every day to running a predictable, scalable machine.",
      author: "Sarah Chen",
      author_role: "COO",
      author_company: "FinFlows Inc.",
      author_avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b63c?w=200&q=80",
    },
    {
      type: "tech_stack",
      title: "Technologies Used",
      content: "Our integration stack was chosen for reliability, flexibility, and zero vendor lock-in.",
      tech_tags: ["n8n", "Make (Integromat)", "REST APIs", "PostgreSQL", "Slack", "Google Sheets", "Webhook.site", "Node.js", "Vercel"],
    },
    {
      type: "mid_cta",
      cta_text: "See how we can automate your operations in 8 weeks.",
      cta_label: "Book a Discovery Call",
      cta_url: "/contact-us",
    },
  ],
};

const DEMO_RELATED_CASES: RelatedCase[] = [
  {
    id: 1,
    title: "RetailBot: AI Customer Support Handling 10k Queries/Month",
    slug: "retailbot-ai-support",
    subtitle: "Automated Tier-1 support across WhatsApp, email, and live chat — with zero additional headcount.",
    image_url: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=600&q=80",
    industry: "E-commerce",
    client_name: "RetailBot",
  },
  {
    id: 2,
    title: "PropTrack: Lead Qualification Automated End-to-End",
    slug: "proptrack-lead-automation",
    subtitle: "Real estate platform automates lead scoring, CRM updates, and agent assignment in real time.",
    image_url: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=600&q=80",
    industry: "Real Estate",
    client_name: "PropTrack",
  },
  {
    id: 3,
    title: "MedSync: Appointment & Document Automation for Clinics",
    slug: "medsync-clinic-automation",
    subtitle: "Digital health platform reduces admin burden by 75% through intelligent appointment and document workflows.",
    image_url: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=600&q=80",
    industry: "Healthcare",
    client_name: "MedSync",
  },
];

// ── Page ──────────────────────────────────────────────────────────────────────
export default function CaseStudyPage({ params }: { params: { slug: string } }) {
  const [cs, setCs]       = useState<CaseStudy | null>(null);
  const [related, setRelated] = useState<RelatedCase[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/case_studies.php?slug=${params.slug}`)
      .then(r => r.json())
      .then(d => {
        if (d.status === "success") {
          setCs(d.data);
          fetch("/api/case_studies.php")
            .then(r => r.json())
            .then(rd => {
              if (rd.status === "success")
                setRelated(rd.data.filter((c: RelatedCase) => c.id !== d.data.id).slice(0, 3));
              else
                setRelated(DEMO_RELATED_CASES);
            })
            .catch(() => setRelated(DEMO_RELATED_CASES));
        } else {
          setCs(DEMO_CASE);
          setRelated(DEMO_RELATED_CASES);
        }
      })
      .catch(() => {
        setCs(DEMO_CASE);
        setRelated(DEMO_RELATED_CASES);
      })
      .finally(() => setLoading(false));
  }, [params.slug]);

  const buildSections = (): CaseSection[] => {
    if (cs?.sections?.length) return cs.sections;
    const fb: CaseSection[] = [];
    if (cs?.challenge) fb.push({ type: "challenge", title: "The Challenge", content: cs.challenge });
    if (cs?.solution)  fb.push({ type: "solution",  title: "Our Solution",  content: cs.solution  });
    if (cs?.results)   fb.push({ type: "metrics",   title: "Results",       content: cs.results   });
    return fb;
  };

  if (loading) return <Skeleton />;
  if (!cs)     return <NotFound />;

  const sections = buildSections();

  return (
    <main className="min-h-screen bg-white">
      <Navbar className="top-0" darkHero={false} />

      {/* ── HERO ── */}
      <section className="relative overflow-hidden" style={{ background: "linear-gradient(135deg, #080e1f 0%, #0d1535 40%, #0a1628 100%)" }}>
        {/* Subtle grid */}
        <div className="absolute inset-0 bg-[radial-gradient(circle,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[length:36px_36px] pointer-events-none" />
        {/* Brand glow */}
        <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-brand/15 blur-[120px] rounded-full pointer-events-none" />

        <div className="container mx-auto px-6 max-w-7xl pt-32 pb-0 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_480px] gap-10 xl:gap-16 items-center pb-16">

            {/* Left */}
            <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
              {/* Client logo */}
              {cs.client_logo && (
                <div className="mb-7">
                  <img src={cs.client_logo} alt={cs.client_name} className="h-10 object-contain brightness-0 invert opacity-80" />
                </div>
              )}

              {/* Eyebrow + tags */}
              <div className="flex flex-wrap items-center gap-2 mb-5">
                <span className="text-[9px] font-black uppercase tracking-[0.25em] text-brand border border-brand/30 bg-brand/10 rounded-full px-3 py-1">
                  {cs.eyebrow || "Case Study"}
                </span>
                {cs.industry && (
                  <span className="text-[9px] font-black uppercase tracking-[0.25em] text-white/40 border border-white/10 bg-white/5 rounded-full px-3 py-1">
                    {cs.industry}
                  </span>
                )}
                {cs.service_tags?.slice(0, 2).map(tag => (
                  <span key={tag} className="text-[9px] font-black uppercase tracking-[0.25em] text-white/40 border border-white/10 bg-white/5 rounded-full px-3 py-1">{tag}</span>
                ))}
              </div>

              <h1 className="text-4xl md:text-5xl xl:text-6xl font-display font-bold text-white leading-[1.05] mb-5 max-w-xl">
                {cs.title}
              </h1>

              {cs.subtitle && (
                <p className="text-lg font-semibold text-white/60 mb-4 max-w-lg">{cs.subtitle}</p>
              )}

              {cs.description && (
                <p className="text-base text-white/50 leading-relaxed max-w-lg mb-8">{cs.description}</p>
              )}

              <div className="flex flex-wrap items-center gap-4">
                <Link href={cs.hero_cta_url || "/contact-us"}>
                  <Button variant="brand" className="px-8 h-12 font-bold text-sm">
                    {cs.hero_cta_label || "View Case Study"} <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </Link>
                {cs.client_name && (
                  <span className="text-white/40 text-sm font-medium flex items-center gap-2">
                    <Building2 className="w-3.5 h-3.5" /> {cs.client_name}
                  </span>
                )}
              </div>
            </motion.div>

            {/* Right — hero image */}
            {cs.image_url && (
              <motion.div initial={{ opacity: 0, x: 32 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7, delay: 0.15 }} className="relative hidden lg:block">
                <div className="absolute -inset-4 bg-brand/10 blur-3xl rounded-3xl" />
                <div className="relative rounded-2xl overflow-hidden border border-white/10 shadow-2xl shadow-black/60">
                  <img src={cs.image_url} alt={cs.title} className="w-full h-auto object-cover" />
                  {/* Glass overlay at bottom */}
                  <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-black/40 to-transparent" />
                </div>
                {/* Floating client badge */}
                {cs.client_name && (
                  <div className="absolute -bottom-5 -left-5 bg-white rounded-2xl px-4 py-3 shadow-2xl flex items-center gap-2.5 border border-slate-100">
                    {cs.client_logo
                      ? <img src={cs.client_logo} alt="" className="h-6 object-contain" />
                      : <Building2 className="w-4 h-4 text-brand" />}
                    <span className="text-xs font-bold text-slate-800">{cs.client_name}</span>
                  </div>
                )}
              </motion.div>
            )}
          </div>
        </div>

        {/* ── Hero Stats Strip ── */}
        {cs.hero_stats?.length > 0 && (
          <div className="border-t border-white/8 bg-white/[0.03] backdrop-blur-sm">
            <div className="container mx-auto px-6 max-w-7xl">
              <div className={cn("grid divide-x divide-white/8", cs.hero_stats.length === 2 ? "grid-cols-2" : cs.hero_stats.length === 3 ? "grid-cols-3" : "grid-cols-2 md:grid-cols-4")}>
                {cs.hero_stats.map((s, i) => (
                  <motion.div key={i} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 + i * 0.08 }}
                    className="py-7 px-8 text-center">
                    <div className="text-3xl md:text-4xl font-black text-white tracking-tight mb-1">{s.value}</div>
                    <div className="text-[10px] font-bold uppercase tracking-widest text-white/40">{s.label}</div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        )}
      </section>

      {/* ── Case Study Content ── */}
      <div className="bg-white">
        {sections.map((section, i) => (
          <SectionBlock key={section.id ?? `s-${i}`} section={section} index={i} />
        ))}
      </div>

      {/* ── Explore More ── */}
      {cs.show_related && related.length > 0 && (
        <section className="py-24 bg-slate-50 border-t border-slate-100">
          <div className="container mx-auto px-6 max-w-7xl">
            <div className="flex items-center justify-between mb-12">
              <div>
                <Badge variant="outline" className="section-eyebrow mb-3">Explore More</Badge>
                <h2 className="text-3xl font-display font-bold text-primary">More Case Studies</h2>
              </div>
              <Link href="/case-studies" className="flex items-center gap-1.5 text-sm font-bold text-brand hover:underline">
                View All <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {related.map((r, i) => <RelatedCard key={r.id} c={r} index={i} />)}
            </div>
          </div>
        </section>
      )}

      {/* ── CTA ── */}
      <section className="py-28 bg-white border-t border-slate-100">
        <div className="container mx-auto px-6 max-w-4xl text-center">
          <Badge variant="outline" className="section-eyebrow mb-6 mx-auto">Get Started</Badge>
          <h2 className="section-title mb-5">
            Ready to build your<br />
            <span className="section-title-accent">own success story?</span>
          </h2>
          <p className="section-subtitle max-w-xl mx-auto mb-10 opacity-60">
            Let's design an AI strategy that delivers measurable, real-world outcomes for your business.
          </p>
          <Link href="/contact-us">
            <Button variant="brand" className="px-10 h-14 font-bold">
              Start Your Project <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
        </div>
      </section>

      <Footer />
    </main>
  );
}

// ── Section Renderer ──────────────────────────────────────────────────────────
function SectionBlock({ section: s, index }: { section: CaseSection; index: number }) {
  const altBg = index % 2 !== 0; // alternating light background

  // ── mid_cta ────────────────────────────────────────────────────────────────
  if (s.type === "mid_cta") {
    return (
      <div className="py-12 bg-brand/[0.04] border-y border-brand/10">
        <div className="container mx-auto px-6 max-w-6xl flex flex-col sm:flex-row items-center justify-between gap-5">
          <p className="text-lg font-bold text-primary">{s.cta_text || "Ready to achieve similar results?"}</p>
          <Link href={s.cta_url || "/contact-us"} className="flex-shrink-0">
            <Button variant="brand" className="px-8 h-12 font-bold">
              {s.cta_label || "Let's Talk"} <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  // ── testimonial ────────────────────────────────────────────────────────────
  if (s.type === "testimonial") {
    return (
      <section className={cn("py-20", altBg ? "bg-slate-50" : "bg-white")}>
        <div className="container mx-auto px-6 max-w-4xl text-center">
          <Quote className="w-12 h-12 text-brand/20 mx-auto mb-6" />
          {s.quote && (
            <blockquote className="text-2xl md:text-3xl font-display font-bold text-primary leading-[1.3] mb-8 max-w-3xl mx-auto">
              "{s.quote}"
            </blockquote>
          )}
          <div className="flex items-center justify-center gap-4">
            {s.author_avatar && (
              <img src={s.author_avatar} alt={s.author} className="w-14 h-14 rounded-full object-cover border-2 border-brand/20" />
            )}
            <div className="text-left">
              {s.author && <p className="font-bold text-primary">{s.author}</p>}
              {(s.author_role || s.author_company) && (
                <p className="text-sm text-secondary/60">{[s.author_role, s.author_company].filter(Boolean).join(", ")}</p>
              )}
            </div>
          </div>
        </div>
      </section>
    );
  }

  // ── tech_stack ─────────────────────────────────────────────────────────────
  if (s.type === "tech_stack") {
    return (
      <section className={cn("py-20", altBg ? "bg-slate-50" : "bg-white")}>
        <div className="container mx-auto px-6 max-w-6xl">
          {s.title && <SectionHeading title={s.title} />}
          {s.content && <SectionProse content={s.content} className="mb-8" />}
          <div className="flex flex-wrap gap-3">
            {(s.tech_tags ?? []).map((tag, i) => (
              <span key={i} className="text-sm font-bold text-primary bg-white border border-slate-200 rounded-xl px-5 py-2.5 shadow-sm hover:border-brand/30 hover:shadow-md transition-all">
                {tag}
              </span>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // ── image_gallery ──────────────────────────────────────────────────────────
  if (s.type === "image_gallery") {
    const imgs = s.gallery ?? [];
    return (
      <section className={cn("py-20", altBg ? "bg-slate-50" : "bg-white")}>
        <div className="container mx-auto px-6 max-w-6xl">
          {s.title && <SectionHeading title={s.title} />}
          {s.content && <SectionProse content={s.content} className="mb-8" />}
          <div className={cn("grid gap-5", imgs.length === 1 ? "grid-cols-1" : imgs.length === 2 ? "grid-cols-2" : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3")}>
            {imgs.map((img, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}
                className="rounded-2xl overflow-hidden border border-slate-200 shadow-md group">
                <img src={img.url} alt={img.caption || ""} className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-500" />
                {img.caption && <div className="px-4 py-3 bg-white"><p className="text-xs text-secondary/60 font-medium">{img.caption}</p></div>}
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // ── metrics / results ──────────────────────────────────────────────────────
  if ((s.type === "metrics" || s.type === "results") && s.metrics?.length) {
    return (
      <section className="py-20 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[length:32px_32px] pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-brand/10 blur-3xl rounded-full pointer-events-none" />
        <div className="container mx-auto px-6 max-w-6xl relative z-10">
          {s.title && <SectionHeading title={s.title} white />}
          {s.content && <SectionProse content={s.content} className="mb-10 text-white/60" />}
          <div className={cn("grid gap-6", s.metrics.length === 2 ? "grid-cols-2" : s.metrics.length === 3 ? "grid-cols-1 sm:grid-cols-3" : "grid-cols-2 md:grid-cols-4")}>
            {s.metrics.map((m, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur p-7 text-center">
                <div className="text-4xl md:text-5xl font-black text-white tracking-tight mb-2">{m.value}</div>
                <div className="text-sm font-bold text-white/80 mb-1.5">{m.label}</div>
                {m.desc && <div className="text-xs text-white/40 leading-snug">{m.desc}</div>}
              </motion.div>
            ))}
          </div>
          {s.points?.length ? (
            <ul className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-3">
              {s.points.map((pt, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-white/70">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" /> {pt}
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      </section>
    );
  }

  // ── comparison ─────────────────────────────────────────────────────────────
  if (s.type === "comparison" && s.comparison) {
    const { before_label, after_label, rows } = s.comparison;
    return (
      <section className={cn("py-20", altBg ? "bg-slate-50" : "bg-white")}>
        <div className="container mx-auto px-6 max-w-5xl">
          {s.title && <SectionHeading title={s.title} />}
          {s.content && <SectionProse content={s.content} className="mb-8" />}
          <div className="overflow-x-auto rounded-2xl border border-slate-200 shadow-sm">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr>
                  <th className="bg-rose-50 text-rose-600 font-black uppercase tracking-widest text-[10px] px-6 py-5 text-left w-1/2 border-b border-r border-slate-200">✕ {before_label || "Before"}</th>
                  <th className="bg-emerald-50 text-emerald-600 font-black uppercase tracking-widest text-[10px] px-6 py-5 text-left w-1/2 border-b border-slate-200">✓ {after_label || "After"}</th>
                </tr>
              </thead>
              <tbody>
                {rows.map(({ before, after }, i) => (
                  <tr key={i} className="border-b border-slate-100 last:border-0 hover:bg-slate-50/50">
                    <td className="px-6 py-5 text-slate-500 border-r border-slate-100"><div className="flex items-start gap-2.5"><XCircle className="w-4 h-4 text-rose-400 mt-0.5 flex-shrink-0" />{before}</div></td>
                    <td className="px-6 py-5 text-slate-700"><div className="flex items-start gap-2.5"><CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />{after}</div></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    );
  }

  // ── timeline ───────────────────────────────────────────────────────────────
  if (s.type === "timeline" && s.phases?.length) {
    return (
      <section className={cn("py-20", altBg ? "bg-slate-50" : "bg-white")}>
        <div className="container mx-auto px-6 max-w-4xl">
          {s.title && <SectionHeading title={s.title} />}
          {s.content && <SectionProse content={s.content} className="mb-10" />}
          <div className="relative">
            <div className="absolute left-5 top-0 bottom-0 w-px bg-slate-200 hidden sm:block" />
            <div className="space-y-6">
              {s.phases.map((p, i) => (
                <motion.div key={i} initial={{ opacity: 0, x: -16 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                  className="sm:pl-16 relative">
                  <div className="absolute left-0 top-4 w-10 h-10 rounded-full bg-brand text-white flex items-center justify-center text-xs font-black hidden sm:flex shadow-lg shadow-brand/20">
                    {String(i + 1).padStart(2, "0")}
                  </div>
                  <div className="rounded-2xl border border-border-subtle bg-white p-6 hover:border-brand/20 transition-all shadow-sm">
                    <span className="text-[9px] font-black uppercase tracking-widest text-brand/60 block mb-1">{p.phase}</span>
                    <p className="font-bold text-primary mb-2">{p.title}</p>
                    <p className="text-sm text-secondary/70 leading-relaxed">{p.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  // ── challenge / solution / overview / text (with optional image) ────────────
  const iconMap: Record<string, React.ReactNode> = {
    challenge: <AlertTriangle className="w-6 h-6 text-amber-500" />,
    solution:  <Lightbulb    className="w-6 h-6 text-brand"      />,
    overview:  <BookOpen     className="w-6 h-6 text-slate-500"  />,
  };

  const hasImage = !!s.image;
  const imgRight = index % 2 === 0; // challenge = image right, solution = image left

  return (
    <section className={cn("py-20", altBg ? "bg-slate-50" : "bg-white")}>
      <div className="container mx-auto px-6 max-w-6xl">
        <div className={cn("grid grid-cols-1 gap-12 items-center", hasImage ? "lg:grid-cols-2" : "lg:grid-cols-1 max-w-3xl")}>

          {/* Text block — order depends on image side */}
          <div className={cn(hasImage && !imgRight && "lg:order-2")}>
            {iconMap[s.type] && (
              <div className="w-12 h-12 rounded-2xl bg-brand/8 flex items-center justify-center mb-5">
                {iconMap[s.type]}
              </div>
            )}
            {s.title && (
              <h2 className="text-2xl md:text-3xl font-display font-bold text-primary mb-5 leading-snug">{s.title}</h2>
            )}
            {s.content && <SectionProse content={s.content} className="mb-6" />}
            {s.points?.length ? (
              <ul className="space-y-3">
                {s.points.map((pt, i) => (
                  <motion.li key={i} initial={{ opacity: 0, x: -8 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.07 }}
                    className="flex items-start gap-3 text-sm text-secondary/80">
                    {s.type === "challenge"
                      ? <XCircle      className="w-4 h-4 text-rose-400    mt-0.5 flex-shrink-0" />
                      : <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />}
                    {pt}
                  </motion.li>
                ))}
              </ul>
            ) : null}
          </div>

          {/* Image block */}
          {hasImage && (
            <motion.div initial={{ opacity: 0, x: imgRight ? 24 : -24 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}
              className={cn(hasImage && !imgRight && "lg:order-1")}>
              <div className="rounded-2xl overflow-hidden border border-slate-200 shadow-xl shadow-slate-200/60">
                <img src={s.image} alt={s.title || ""} className="w-full h-auto object-cover" />
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
}

// ── Helpers ───────────────────────────────────────────────────────────────────
function SectionHeading({ title, white = false }: { title: string; white?: boolean }) {
  return (
    <h2 className={cn("text-2xl md:text-3xl font-display font-bold mb-6 leading-snug", white ? "text-white" : "text-primary")}>
      {title}
    </h2>
  );
}

function SectionProse({ content, className }: { content: string; className?: string }) {
  return (
    <div className={cn("text-sm text-secondary/75 leading-relaxed space-y-4", className)}>
      {content.split("\n\n").map((p, i) => <p key={i}>{p}</p>)}
    </div>
  );
}

function RelatedCard({ c, index }: { c: RelatedCase; index: number }) {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.1 }}>
      <Link href={`/case-studies/${c.slug}`} className="group block rounded-3xl overflow-hidden border border-border-subtle bg-white hover:shadow-2xl hover:shadow-slate-200/60 transition-all duration-300">
        <div className="aspect-[16/10] overflow-hidden relative bg-slate-100">
          {c.image_url && <img src={c.image_url} alt={c.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />}
          <div className="absolute top-5 left-5">
            <span className="text-[9px] font-black uppercase tracking-widest bg-white/90 text-primary px-3 py-1.5 rounded-full shadow">{c.industry}</span>
          </div>
        </div>
        <div className="p-6">
          <p className="text-[9px] font-black uppercase tracking-widest text-brand/60 mb-2.5">{c.client_name}</p>
          <h3 className="font-bold text-primary text-sm leading-snug mb-2 group-hover:text-brand transition-colors line-clamp-2">{c.title}</h3>
          <p className="text-xs text-secondary/60 line-clamp-2 mb-4">{c.subtitle}</p>
          <div className="flex items-center gap-1.5 text-brand text-xs font-bold">
            Read Case Study <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

function Skeleton() {
  return (
    <main className="min-h-screen">
      <div className="h-[75vh] bg-slate-900 animate-pulse" />
      <div className="container mx-auto px-6 max-w-6xl py-20 space-y-8">
        {[1,2,3].map(i => <div key={i} className="h-48 bg-slate-100 rounded-3xl animate-pulse" />)}
      </div>
    </main>
  );
}

function NotFound() {
  return (
    <main className="min-h-screen bg-base flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-primary mb-4">Case Study Not Found</h1>
        <Link href="/case-studies"><Button>Browse All Case Studies</Button></Link>
      </div>
    </main>
  );
}
