"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Navbar } from "@/components/blocks/floating-icons-hero-demo";
import { Footer } from "@/components/ui/footer-section";
import { Connect } from "@/components/blocks/connect-cta";
import {
  CheckCircle2, ArrowRight, Quote, Layers,
  CalendarDays, Star, Zap, BarChart3,
  TrendingUp, AlertCircle, XCircle, Building2, BarChart2,
} from "lucide-react";
import { API_BASE_URL } from "@/lib/constants";
import { cn, safeFetch } from "@/lib/utils";
import { InlineLeadForm, LeadPopup } from "@/components/ui/lead-capture";

// ─── Types ────────────────────────────────────────────────────────────────────
interface HeroStat   { label: string; value: string }
interface Metric     { label: string; value: string; desc: string }
interface Phase      { phase: string; title: string; desc: string }
interface CompRow    { before: string; after: string }
interface GalleryImg { url: string; caption?: string }

interface TechItem    { name: string; desc: string }
interface OutcomeCard { icon?: string; title: string; desc: string }

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
  tech_items?: TechItem[];
  gallery?: GalleryImg[];
  outcomes?: OutcomeCard[];
  scope_items?: string[];
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
  published_date?: string;
  position?: number;
}

interface RelatedCase {
  id: number; title: string; slug: string; subtitle: string;
  image_url: string; industry: string; client_name: string;
  published_date?: string; position?: number;
}

// ─── Demo Data ────────────────────────────────────────────────────────────────
const DEMO_RELATED: RelatedCase[] = [
  {
    id: 1,
    title: "How RetailX Increased Online Revenue by 3× in 6 Months",
    slug: "retailx-revenue-growth",
    subtitle: "A full-funnel digital strategy that tripled ecommerce revenue through SEO, paid ads, and conversion optimization.",
    image_url: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&q=80",
    industry: "E-commerce",
    client_name: "RetailX",
    published_date: "2025-02-10",
  },
  {
    id: 2,
    title: "LeadGen Pro: 5× More Qualified Leads with AI Outbound",
    slug: "leadgen-pro-ai-outbound",
    subtitle: "AI-powered outbound automation that quintupled qualified pipeline in under 60 days.",
    image_url: "https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=800&q=80",
    industry: "SaaS",
    client_name: "LeadGen Pro",
    published_date: "2025-03-05",
  },
  {
    id: 3,
    title: "MedCore Clinic: Patient Booking Automated End-to-End",
    slug: "medcore-booking-automation",
    subtitle: "Automated appointment scheduling and follow-up flows that cut admin workload by 70%.",
    image_url: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80",
    industry: "Healthcare",
    client_name: "MedCore Clinic",
    published_date: "2025-01-20",
  },
];

const DEMO_CASE: CaseStudy = {
  id: 0,
  title: "How FinFlows Automated 90% of Their Back-Office Ops",
  slug: "finflows-automation",
  eyebrow: "Case Study",
  subtitle: "AI-powered workflow automation that eliminated manual processing and cut operational costs by 60%.",
  description: "FinFlows, a fast-growing fintech platform, partnered with Digi Pexel to automate their loan processing, KYC verification, and reporting pipelines.",
  client_name: "FinFlows Inc.",
  client_logo: "",
  client_image: "",
  industry: "Fintech",
  service_tags: ["AI Automation", "Workflow Design", "System Integration"],
  hero_cta_label: "Start Your Project",
  hero_cta_url: "/contact-us",
  hero_stats: [
    { label: "Ops Cost Reduction", value: "60%" },
    { label: "Processes Automated", value: "40+" },
    { label: "Hours Saved / Week", value: "320h" },
    { label: "ROI in 90 Days", value: "4.2×" },
  ],
  image_url: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&q=80",
  show_related: true,
  published_date: "2025-01-15",
  sections: [
    {
      id: "challenge",
      type: "challenge",
      title: "The Challenge",
      content: "FinFlows was processing over 5,000 loan applications monthly — entirely manually. Loan officers spent 70% of their time on data entry, document verification, and cross-system reconciliation, leaving little bandwidth for client relationships or strategic work.",
      points: [
        "5,000+ monthly applications processed entirely by hand",
        "70% of ops time consumed by repetitive data tasks",
        "Error rate of 3.2% causing downstream compliance issues",
        "No real-time visibility into pipeline bottlenecks",
      ],
    },
    {
      id: "overview",
      type: "overview",
      title: "Project Overview",
      content: "Digi Pexel was engaged to design and deploy an end-to-end automation layer that would eliminate manual touchpoints across FinFlows' loan processing pipeline. The engagement covered process discovery, system architecture, AI model training, and a phased production rollout.",
      points: [
        "Scope: end-to-end automation of loan intake, KYC, and compliance reporting",
        "Duration: 10 weeks across three delivery sprints",
        "Team: 2 automation engineers, 1 AI specialist, 1 project lead",
        "Outcome: 90% of manual ops volume eliminated within the first quarter",
      ],
    },
    {
      id: "solution",
      type: "solution",
      title: "Our Approach",
      content: "We designed a multi-agent automation system using n8n and custom AI models to handle the end-to-end loan processing pipeline — from application intake to KYC checks, credit scoring, and compliance reporting.",
      points: [
        "Multi-agent AI orchestration for application intake and routing",
        "Automated KYC verification using computer vision and OCR",
        "Real-time compliance reporting dashboard for management",
        "Integration with 6 existing third-party systems via REST APIs",
      ],
    },
    {
      id: "timeline",
      type: "timeline",
      title: "Project Roadmap",
      content: "Delivered in three focused sprints over 10 weeks.",
      phases: [
        { phase: "Phase 1", title: "Discovery & Mapping", desc: "Audited existing workflows, identified 40+ automation candidates, and designed the system architecture." },
        { phase: "Phase 2", title: "Build & Integrate", desc: "Built the n8n orchestration layer, trained OCR models, and wired into 6 external APIs." },
        { phase: "Phase 3", title: "Test & Deploy", desc: "Ran parallel processing in staging for 2 weeks, resolved edge cases, and handed over to the ops team." },
      ],
    },
    {
      id: "scope",
      type: "solution_scope",
      title: "Solution Scope",
      content: "The engagement was scoped to cover the following systems and workflows:",
      scope_items: [
        "Loan application intake and intelligent triage routing",
        "Automated KYC document verification using OCR and AI",
        "Credit scoring pipeline integration with 3 external bureaus",
        "Real-time compliance reporting and SLA tracking dashboard",
        "Staff notification system for exceptions and edge cases",
        "Audit trail and data retention compliance layer",
      ],
    },
    {
      id: "comparison",
      type: "comparison",
      title: "Before vs. After",
      comparison: {
        before_label: "Before Digi Pexel",
        after_label: "After Digi Pexel",
        rows: [
          { before: "5,000 apps/month processed manually", after: "5,000 apps/month processed automatically" },
          { before: "3.2% error rate across workflows", after: "<0.1% error rate post-automation" },
          { before: "72-hour processing turnaround", after: "Under 4 hours end-to-end" },
          { before: "No pipeline visibility", after: "Live dashboard with real-time alerts" },
          { before: "$180k annual ops overhead", after: "$72k annual ops overhead" },
        ],
      },
    },
    {
      id: "gallery",
      type: "image_gallery",
      title: "Project Snapshots",
      gallery: [
        { url: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80", caption: "Ops Dashboard — Real-time pipeline visibility" },
        { url: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80", caption: "KYC Verification Flow — Document processing in seconds" },
        { url: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&q=80", caption: "Compliance Report — Auto-generated weekly summaries" },
        { url: "https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=800&q=80", caption: "System Architecture — Multi-agent orchestration layer" },
      ],
    },
    {
      id: "tech",
      type: "tech_stack",
      title: "Technology Stack",
      content: "We selected best-in-class tools for reliability, scalability, and maintainability.",
      tech_items: [
        { name: "n8n", desc: "Used as the core workflow orchestration engine to wire together all automation nodes — from application intake triggers to cross-system API calls — without custom glue code." },
        { name: "Python + OpenAI API", desc: "Custom scoring models built in Python called GPT-4 for document summarisation and anomaly detection during the KYC step, reducing manual review queues by 90%." },
        { name: "Tesseract OCR", desc: "Extracted structured data (names, dates, document IDs) from uploaded PDFs and images, feeding clean records directly into the PostgreSQL pipeline database." },
        { name: "PostgreSQL + Redis", desc: "PostgreSQL stored the canonical application records; Redis handled ephemeral job queues and distributed locking so parallel workers never double-processed an application." },
        { name: "Docker + Nginx", desc: "All services containerised for consistent staging/production parity; Nginx proxied traffic and handled SSL termination on the Hostinger VPS." },
      ],
    },
    {
      id: "final_outcomes",
      type: "final_outcomes",
      title: "Final Outcomes",
      content: "The transformation delivered compounding benefits across every layer of the business:",
      outcomes: [
        { icon: "🎯", title: "Ops Team Freed for High-Value Work", desc: "With 320 hours per week reclaimed from manual tasks, the ops team shifted focus to client relationships, exception handling, and strategic initiatives." },
        { icon: "⚙️", title: "Near-Zero Error Rate Across Workflows", desc: "Automated KYC and reconciliation cut the error rate from 3.2% to under 0.1%, eliminating costly downstream compliance remediation." },
        { icon: "💰", title: "60% Reduction in Operational Overhead", desc: "Annual ops cost dropped from $180k to $72k — a saving that paid back the project investment within the first 90 days." },
        { icon: "📊", title: "Real-Time Pipeline Visibility", desc: "Management gained a live dashboard showing every application's status, SLA compliance, and bottleneck alerts — replacing weekly manual reports." },
      ],
    },
    {
      id: "mid_cta",
      type: "mid_cta",
      cta_text: "Ready to achieve similar results?",
      cta_label: "Book Free Strategy Call",
    },
    {
      id: "results",
      type: "metrics",
      title: "Measurable Results",
      content: "Within 90 days of deployment, FinFlows achieved transformational operational improvements:",
      metrics: [
        { value: "60%", label: "Cost Reduction", desc: "Ops overhead cut in half" },
        { value: "40+", label: "Processes Automated", desc: "End-to-end workflows" },
        { value: "320h", label: "Saved Per Week", desc: "Team hours reallocated" },
        { value: "4.2×", label: "ROI Achieved", desc: "Within first 90 days" },
      ],
    },
    {
      id: "testimonial",
      type: "testimonial",
      quote: "Digi Pexel didn't just build us a tool — they redesigned how our entire operations team works. We went from drowning in paperwork to running a lean, automated machine in under 90 days.",
      author: "Sarah Mitchell",
      author_role: "Chief Operating Officer",
      author_company: "FinFlows Inc.",
      author_avatar: "",
    },
  ],
};

// ─── Section heading helper ───────────────────────────────────────────────────

function SectionLabel({ icon: Icon, text, color = "brand" }: {
  icon: React.ElementType;
  text: string;
  color?: "brand" | "secondary" | "warning" | "success";
}) {
  const palette = {
    brand:     { wrap: "bg-brand/10",        icon: "text-brand",        label: "text-brand/70"    },
    secondary: { wrap: "bg-secondary/10",    icon: "text-secondary/60", label: "text-secondary/50"},
    warning:   { wrap: "bg-amber-100",       icon: "text-amber-500",    label: "text-amber-600"   },
    success:   { wrap: "bg-emerald-100/80",  icon: "text-emerald-500",  label: "text-emerald-600" },
  };
  const p = palette[color];
  return (
    <div className="flex items-center gap-2.5 mb-4">
      <div className={cn("w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0", p.wrap)}>
        <Icon className={cn("w-3.5 h-3.5", p.icon)} />
      </div>
      <span className={cn("text-[10px] font-black uppercase tracking-widest", p.label)}>{text}</span>
    </div>
  );
}

function SectionHeading({ title }: { title?: string }) {
  if (!title) return null;
  return (
    <h2 className="text-3xl md:text-4xl font-display font-bold text-primary leading-tight mb-6">
      {title}
    </h2>
  );
}

function PointsList({ points, variant = "check" }: { points: string[]; variant?: "check" | "warning" }) {
  return (
    <ul className="space-y-3 mt-5">
      {points.map((pt, i) => (
        <li key={i} className="flex items-start gap-3 text-[15px] leading-relaxed">
          {variant === "warning"
            ? <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-amber-400" />
            : <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5 text-brand" />}
          <span className={variant === "warning" ? "text-secondary/65" : "text-secondary/70"}>{pt}</span>
        </li>
      ))}
    </ul>
  );
}

// ─── Section Components ───────────────────────────────────────────────────────

function ChallengeSection({ s }: { s: CaseSection }) {
  return (
    <div>
      <SectionLabel icon={AlertCircle} text="The Challenge" color="warning" />
      <SectionHeading title={s.title} />
      {s.content && <p className="text-secondary/70 text-[15px] leading-relaxed">{s.content}</p>}
      {s.points && s.points.length > 0 && <PointsList points={s.points} variant="warning" />}
    </div>
  );
}

function SolutionSection({ s }: { s: CaseSection }) {
  return (
    <div>
      <SectionLabel icon={Zap} text="Our Approach" color="brand" />
      <SectionHeading title={s.title} />
      {s.content && <p className="text-secondary/70 text-[15px] leading-relaxed">{s.content}</p>}
      {s.points && s.points.length > 0 && <PointsList points={s.points} />}
    </div>
  );
}

function TimelineSection({ s }: { s: CaseSection }) {
  if (!s.phases || s.phases.length === 0) return null;
  return (
    <div>
      <SectionLabel icon={CalendarDays} text="Delivery Timeline" />
      <SectionHeading title={s.title} />
      {s.content && <p className="text-secondary/65 text-[15px] mb-8">{s.content}</p>}
      <div className="mt-2 space-y-0">
        {s.phases.map((ph, i) => (
          <div key={i} className="flex gap-5">
            <div className="flex flex-col items-center flex-shrink-0">
              <div className="w-8 h-8 rounded-full bg-brand flex items-center justify-center text-white text-[10px] font-black shadow-sm shadow-brand/30 flex-shrink-0">
                {i + 1}
              </div>
              {i < (s.phases?.length ?? 0) - 1 && (
                <div className="w-px flex-1 bg-brand/20 my-2 min-h-[20px]" />
              )}
            </div>
            <div className="pb-7 last:pb-0 flex-1 pt-1">
              <span className="text-[10px] font-black uppercase tracking-widest text-brand/70 mb-1 block">{ph.phase}</span>
              <h4 className="text-base font-bold text-primary mb-1.5">{ph.title}</h4>
              <p className="text-sm text-secondary/65 leading-relaxed">{ph.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ComparisonSection({ s }: { s: CaseSection }) {
  if (!s.comparison) return null;
  const { before_label, after_label, rows } = s.comparison;
  return (
    <div>
      <SectionHeading title={s.title} />
      <div className="mt-4 rounded-xl border border-border-subtle overflow-hidden">
        <div className="grid grid-cols-2 border-b border-border-subtle">
          <div className="px-6 py-3.5 bg-red-50/60 text-[10px] font-black uppercase tracking-widest text-red-400 flex items-center gap-2">
            <XCircle className="w-3.5 h-3.5 text-red-300" />
            {before_label}
          </div>
          <div className="px-6 py-3.5 bg-brand/5 text-[10px] font-black uppercase tracking-widest text-brand flex items-center gap-2 border-l border-border-subtle">
            <CheckCircle2 className="w-3.5 h-3.5 text-brand" />
            {after_label}
          </div>
        </div>
        {rows.map((row, i) => (
          <div
            key={i}
            className={cn(
              "grid grid-cols-2 border-t border-border-subtle",
              i % 2 === 0 ? "bg-white" : "bg-surface/40"
            )}
          >
            <div className="px-6 py-4 text-sm text-secondary/50 flex items-start gap-2.5">
              <XCircle className="w-4 h-4 text-red-200 flex-shrink-0 mt-0.5" />
              {row.before}
            </div>
            <div className="px-6 py-4 text-sm text-secondary/80 font-medium flex items-start gap-2.5 border-l border-border-subtle">
              <CheckCircle2 className="w-4 h-4 text-brand flex-shrink-0 mt-0.5" />
              {row.after}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function GallerySection({ s }: { s: CaseSection }) {
  if (!s.gallery || s.gallery.length === 0) return null;
  return (
    <div>
      <SectionHeading title={s.title} />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
        {s.gallery.map((img, i) => (
          <div key={i} className="group overflow-hidden rounded-xl border border-border-subtle bg-surface">
            <div className="h-52 overflow-hidden">
              <img
                src={img.url}
                alt={img.caption || `Gallery image ${i + 1}`}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
            </div>
            {img.caption && (
              <div className="px-5 py-3 border-t border-border-subtle">
                <p className="text-xs text-secondary/55 leading-snug">{img.caption}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function TechStackSection({ s }: { s: CaseSection }) {
  const hasItems = s.tech_items && s.tech_items.length > 0;
  return (
    <div>
      <SectionLabel icon={Layers} text="Technology Stack" color="brand" />
      <SectionHeading title={s.title} />
      {s.content && <p className="text-secondary/65 text-[15px] mb-6">{s.content}</p>}
      {hasItems && (
        <div className="space-y-0 mt-2">
          {s.tech_items!.map((item, i) => (
            <div key={i} className="flex gap-4 py-4 border-b border-border-subtle last:border-0">
              <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-brand/8 border border-brand/15 flex items-center justify-center mt-0.5">
                <Layers className="w-4 h-4 text-brand" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-primary mb-1">{item.name}</h4>
                <p className="text-xs text-secondary/60 leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      )}
      {!hasItems && s.tech_tags && s.tech_tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-2">
          {s.tech_tags.map((tag, i) => (
            <span
              key={i}
              className="flex items-center gap-1.5 bg-brand/8 border border-brand/20 rounded-full px-4 py-2 text-xs font-bold text-brand"
            >
              <Layers className="w-3 h-3 opacity-70" />
              {tag}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

function MetricsSection({ s }: { s: CaseSection }) {
  if (!s.metrics || s.metrics.length === 0) return null;
  return (
    <div>
      <SectionLabel icon={TrendingUp} text="Results" color="brand" />
      <SectionHeading title={s.title || "Measurable Results"} />
      {s.content && <p className="text-secondary/65 text-[15px] leading-relaxed mb-8">{s.content}</p>}
      <div className="grid grid-cols-2 divide-x divide-y divide-border-subtle border border-border-subtle rounded-xl overflow-hidden">
        {s.metrics.map((m, i) => (
          <div key={i} className="p-7 bg-white hover:bg-brand/[0.02] transition-colors">
            <div className="text-4xl md:text-5xl font-black text-primary leading-none mb-2">{m.value}</div>
            <div className="text-[10px] font-black uppercase tracking-widest text-brand mb-1">{m.label}</div>
            <div className="text-xs text-secondary/45 leading-relaxed">{m.desc}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function TestimonialSection({ s }: { s: CaseSection }) {
  if (!s.quote) return null;
  return (
    <div className="rounded-xl bg-brand/[0.04] border border-brand/15 p-8 md:p-10">
      <div className="flex gap-0.5 mb-6">
        {[...Array(5)].map((_, i) => (
          <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
        ))}
      </div>
      <Quote className="w-10 h-10 text-brand/20 mb-5" />
      <blockquote className="text-xl md:text-2xl font-medium text-primary leading-relaxed mb-8 italic">
        &ldquo;{s.quote}&rdquo;
      </blockquote>
      <div className="flex items-center gap-4 pt-6 border-t border-brand/15">
        {s.author_avatar ? (
          <img src={s.author_avatar} alt={s.author} className="w-12 h-12 rounded-full object-cover border-2 border-brand/20" />
        ) : (
          <div className="w-12 h-12 rounded-full bg-brand/10 border border-brand/20 flex items-center justify-center text-brand font-black text-base flex-shrink-0">
            {s.author?.charAt(0) ?? "?"}
          </div>
        )}
        <div>
          <div className="font-bold text-primary text-sm">{s.author}</div>
          <div className="text-secondary/50 text-xs mt-0.5">
            {s.author_role}{s.author_company ? ` · ${s.author_company}` : ""}
          </div>
        </div>
      </div>
    </div>
  );
}

function TextSection({ s }: { s: CaseSection }) {
  return (
    <div>
      <SectionHeading title={s.title} />
      {s.content && <p className="text-secondary/70 text-[15px] leading-relaxed">{s.content}</p>}
      {s.points && s.points.length > 0 && <PointsList points={s.points} />}
    </div>
  );
}

function ProjectOverviewSection({ s }: { s: CaseSection }) {
  return (
    <div>
      <SectionLabel icon={BarChart2} text="Project Overview" color="brand" />
      <SectionHeading title={s.title} />
      {s.content && <p className="text-secondary/70 text-[15px] leading-relaxed">{s.content}</p>}
      {s.points && s.points.length > 0 && <PointsList points={s.points} />}
    </div>
  );
}

function SolutionScopeSection({ s }: { s: CaseSection }) {
  return (
    <div>
      <SectionLabel icon={CheckCircle2} text="Solution Scope" color="brand" />
      <SectionHeading title={s.title} />
      {s.content && <p className="text-secondary/70 text-[15px] leading-relaxed mb-5">{s.content}</p>}
      {s.scope_items && s.scope_items.length > 0 && <PointsList points={s.scope_items} />}
    </div>
  );
}

function FinalOutcomesSection({ s }: { s: CaseSection }) {
  if (!s.outcomes || s.outcomes.length === 0) return null;
  return (
    <div>
      <SectionLabel icon={TrendingUp} text="Final Outcomes" color="success" />
      <SectionHeading title={s.title} />
      {s.content && <p className="text-secondary/70 text-[15px] leading-relaxed mb-6">{s.content}</p>}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
        {s.outcomes.map((outcome, i) => (
          <div key={i} className="rounded-xl border border-border-subtle bg-white p-6 hover:border-brand/20 hover:shadow-sm transition-all">
            {outcome.icon && (
              <div className="w-10 h-10 rounded-lg bg-brand/8 flex items-center justify-center text-xl mb-4">
                {outcome.icon}
              </div>
            )}
            <h4 className="text-base font-bold text-primary mb-2">{outcome.title}</h4>
            <p className="text-sm text-secondary/65 leading-relaxed">{outcome.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function MidCtaSection({ s }: { s: CaseSection }) {
  return (
    <div className="rounded-xl border border-border-subtle bg-surface/60 p-8 md:p-10 text-center">
      <div className="w-11 h-11 rounded-xl bg-white border border-border-subtle flex items-center justify-center mx-auto mb-5 shadow-sm">
        <BarChart3 className="w-5 h-5 text-secondary/50" />
      </div>
      <h3 className="text-xl md:text-2xl font-display font-bold text-primary mb-2">
        {s.cta_text || "Ready to achieve similar results?"}
      </h3>
      <p className="text-secondary/55 text-sm mb-7 max-w-sm mx-auto leading-relaxed">
        Book a free 30-min strategy call and we&apos;ll map your automation roadmap.
      </p>
      <Link href="/contact-us">
        <button className="inline-flex items-center gap-2 bg-brand text-white font-black text-xs uppercase tracking-widest px-8 h-12 rounded-full hover:bg-brand/90 transition-all shadow-lg shadow-brand/20">
          {s.cta_label || "Book Free Strategy Call"} <ArrowRight className="w-4 h-4" />
        </button>
      </Link>
    </div>
  );
}

function renderSection(s: CaseSection) {
  switch (s.type) {
    case "challenge":        return <ChallengeSection       s={s} />;
    case "overview":         return <ProjectOverviewSection s={s} />;
    case "solution":         return <SolutionSection        s={s} />;
    case "solution_scope":   return <SolutionScopeSection   s={s} />;
    case "timeline":         return <TimelineSection        s={s} />;
    case "comparison":       return <ComparisonSection      s={s} />;
    case "gallery":
    case "image_gallery":    return <GallerySection         s={s} />;
    case "tech_stack":       return <TechStackSection       s={s} />;
    case "metrics":
    case "results":          return <MetricsSection         s={s} />;
    case "final_outcomes":   return <FinalOutcomesSection   s={s} />;
    case "testimonial":      return <TestimonialSection     s={s} />;
    case "mid_cta":          return <MidCtaSection          s={s} />;
    default:                 return <TextSection            s={s} />;
  }
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function CaseStudyClient({ slug }: { slug: string }) {
  const [cs, setCs] = useState<CaseStudy | null>(null);
  const [related, setRelated] = useState<RelatedCase[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const d = await safeFetch(`${API_BASE_URL}/case_studies.php?slug=${slug}`);
      if (d.status === "success") {
        setCs(d.data as CaseStudy);
        const rd = await safeFetch(`${API_BASE_URL}/case_studies.php`);
        if (rd.status === "success" && Array.isArray(rd.data)) {
          const allOther = (rd.data as RelatedCase[]).filter((c) => c.slug !== slug);
          const industry = (d.data as CaseStudy).industry;
          const sameIndustry = allOther
            .filter((c) => c.industry === industry)
            .sort((a, b) => new Date(b.published_date ?? 0).getTime() - new Date(a.published_date ?? 0).getTime());
          const otherIndustry = allOther
            .filter((c) => c.industry !== industry)
            .sort((a, b) => (a.position ?? 0) - (b.position ?? 0));
          setRelated([...sameIndustry, ...otherIndustry].slice(0, 3));
        }
      } else {
        setCs(DEMO_CASE);
        setRelated(DEMO_RELATED);
      }
      setLoading(false);
    }
    load().catch(() => { setCs(DEMO_CASE); setRelated(DEMO_RELATED); setLoading(false); });
  }, [slug]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-base">
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 border-4 border-brand border-t-transparent rounded-full animate-spin" />
        <p className="text-secondary/40 text-sm font-medium">Loading case study…</p>
      </div>
    </div>
  );

  if (!cs) return (
    <div className="min-h-screen flex items-center justify-center bg-base">
      <div className="text-secondary/40 text-sm">Case study not found.</div>
    </div>
  );

  return (
    <main className="min-h-screen bg-base">
      <Navbar className="top-0" darkHero={false} />

      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <section className="relative pt-32 pb-8 overflow-hidden bg-base">
        <div className="absolute inset-x-0 top-0 h-[600px] bg-gradient-to-b from-brand/[0.05] to-transparent pointer-events-none" />
        <div className="absolute top-1/3 right-0 w-[500px] h-[400px] bg-accent/4 blur-[120px] rounded-full pointer-events-none" />

        <div className="container mx-auto px-6 max-w-6xl relative z-10">

          {/* Two-column: content left | project table right */}
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-10 xl:gap-14 items-start">

            {/* ── Left: content ── */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              {/* Badge row */}
              <div className="flex items-center gap-3 mb-5 flex-wrap">
                <span className="inline-flex items-center rounded-full border border-brand/15 bg-brand/8 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.24em] text-brand/80">
                  {cs.eyebrow || "Case Study"}
                </span>
                {cs.industry && (
                  <span className="inline-flex items-center rounded-full border border-brand/20 bg-brand/10 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-brand">
                    {cs.industry}
                  </span>
                )}
              </div>

              <h1 className="text-3xl md:text-4xl lg:text-[2.75rem] font-display font-bold text-primary leading-[1.1] mb-4">
                {cs.title}
              </h1>
              <p className="text-secondary/70 text-base leading-relaxed mb-4">
                {cs.subtitle}
              </p>
              {cs.description && (
                <p className="text-secondary/50 text-sm leading-relaxed mb-7">
                  {cs.description}
                </p>
              )}

              <Link href={cs.hero_cta_url || "/contact-us"}>
                <button className="btn-brand hero-btn inline-flex items-center gap-2 rounded-full px-7 h-11 text-sm font-bold">
                  {cs.hero_cta_label || "Start Your Project"}
                  <ArrowRight className="w-4 h-4" />
                </button>
              </Link>
            </motion.div>

            {/* ── Right: Project Details Table ── */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.15 }}
            >
              <div className="rounded-2xl border border-border-subtle bg-white shadow-sm overflow-hidden">

                {/* Card header — light */}
                <div className="px-5 py-3.5 border-b border-border-subtle flex items-center gap-2 bg-surface/60">
                  <TrendingUp className="w-3.5 h-3.5 text-secondary/40" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-secondary/50">Project Overview</span>
                </div>

                {/* Client + Industry in one row */}
                <div className="grid grid-cols-2 divide-x divide-border-subtle border-b border-border-subtle">
                  <div className="px-4 py-3">
                    <span className="text-[9px] font-black uppercase tracking-widest text-secondary/40 block mb-1.5">Client</span>
                    <div className="flex items-center gap-2">
                      {cs.client_logo ? (
                        <img src={cs.client_logo} alt={cs.client_name} className="h-4 object-contain" />
                      ) : (
                        <div className="w-5 h-5 rounded bg-brand/10 flex items-center justify-center text-brand font-black text-[9px] flex-shrink-0">
                          {cs.client_name.charAt(0)}
                        </div>
                      )}
                      <span className="text-sm font-bold text-primary truncate">{cs.client_name}</span>
                    </div>
                  </div>
                  <div className="px-4 py-3">
                    <span className="text-[9px] font-black uppercase tracking-widest text-secondary/40 block mb-1.5">Industry</span>
                    <span className="text-sm font-medium text-primary">{cs.industry}</span>
                  </div>
                </div>

                {/* Services */}
                {cs.service_tags?.length > 0 && (
                  <div className="px-4 py-3 border-b border-border-subtle">
                    <span className="text-[9px] font-black uppercase tracking-widest text-secondary/40 block mb-2">Services</span>
                    <div className="flex flex-wrap gap-1.5">
                      {cs.service_tags.map(tag => (
                        <span key={tag} className="bg-surface border border-border-subtle text-secondary/60 text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Key Results */}
                {cs.hero_stats?.length > 0 && (
                  <div>
                    <div className="px-4 py-2.5 bg-surface/40 border-b border-border-subtle">
                      <span className="text-[9px] font-black uppercase tracking-widest text-secondary/40">Key Results</span>
                    </div>
                    <div className="grid grid-cols-2 divide-x divide-y divide-border-subtle">
                      {cs.hero_stats.map((stat, i) => (
                        <div key={i} className="px-4 py-3">
                          <div className="text-xl font-black text-primary leading-none mb-1">{stat.value}</div>
                          <div className="text-[9px] font-semibold uppercase tracking-widest text-secondary/50 leading-tight">{stat.label}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}


              </div>
            </motion.div>
          </div>

          {/* Hero image — centered below the two-column grid */}
          {cs.image_url && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="mt-20 mx-auto max-w-4xl rounded-3xl overflow-hidden border border-border-subtle shadow-2xl"
              style={{ aspectRatio: "16/7" }}
            >
              <img src={cs.image_url} alt={cs.title} className="w-full h-full object-cover" />
            </motion.div>
          )}

        </div>
      </section>

      {/* ── Body: single-column (About the Client + all sections) ─────────── */}
      <div className="container mx-auto px-6 max-w-4xl py-16">
        <div className="flex flex-col">

          {/* About the Client */}
          <div className="pb-16">
            <div className="flex items-center gap-2.5 mb-6">
              <div className="w-7 h-7 rounded-lg bg-brand/10 flex items-center justify-center flex-shrink-0">
                <Building2 className="w-3.5 h-3.5 text-brand" />
              </div>
              <span className="text-[10px] font-black uppercase tracking-widest text-brand/70">About the Client</span>
            </div>
            <div className="flex flex-col sm:flex-row gap-6 items-start">
              <div className="flex-shrink-0">
                {cs.client_logo ? (
                  <img src={cs.client_logo} alt={cs.client_name} className="h-16 object-contain" />
                ) : (
                  <div className="w-16 h-16 rounded-2xl bg-brand/10 flex items-center justify-center text-brand font-black text-2xl">
                    {cs.client_name.charAt(0)}
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-3 mb-3">
                  <h3 className="text-3xl md:text-4xl font-display font-bold text-primary leading-tight">{cs.client_name}</h3>
                  {cs.industry && (
                    <span className="bg-brand/8 border border-brand/15 text-brand text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full">
                      {cs.industry}
                    </span>
                  )}
                </div>
                {cs.description && (
                  <p className="text-secondary/65 text-[15px] leading-relaxed mb-5">{cs.description}</p>
                )}
                {cs.service_tags?.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {cs.service_tags.map(tag => (
                      <span key={tag} className="bg-surface border border-border-subtle text-secondary/55 text-[10px] font-semibold uppercase tracking-widest px-3 py-1.5 rounded-full">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Dynamic sections with inline lead forms */}
          {(cs.sections ?? []).map((section, i) => (
            <React.Fragment key={section.id ?? i}>
              <div className="py-14">
                {renderSection(section)}
              </div>
              {(cs.sections ?? []).length > 1 && i === Math.floor((cs.sections ?? []).length / 2) - 1 && (
                <div className="px-0">
                  <InlineLeadForm
                    heading="Achieve similar results for your business?"
                    subheading="Our team will show you exactly how to replicate this outcome in your industry."
                    source={`Case Study 50%: ${cs.title}`}
                  />
                </div>
              )}
            </React.Fragment>
          ))}
          {/* 100% inline lead form */}
          {(cs.sections ?? []).length > 0 && (
            <InlineLeadForm
              heading="Ready to transform your operations?"
              subheading="Tell us your name and number — we'll get back with a roadmap in 48 hours."
              cta="Start Your Project"
              source={`Case Study 100%: ${cs.title}`}
            />
          )}

        </div>
      </div>

      {/* ── Related Case Studies ─────────────────────────────────────────── */}
      {related.length > 0 && (
        <section className="border-t border-border-subtle bg-white py-20">
          <div className="container mx-auto px-6 max-w-6xl">
            <div className="flex items-end justify-between mb-10">
              <h2 className="text-2xl md:text-3xl font-display font-bold text-primary">
                See more <span className="text-brand">relatable case studies</span>
              </h2>
              <Link
                href="/case-studies"
                className="text-sm font-bold text-brand hover:text-brand/75 flex items-center gap-1 transition-colors flex-shrink-0"
              >
                View All <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {related.map(rel => (
                <Link
                  key={rel.id}
                  href={`/case-studies/${rel.slug || rel.id}`}
                  className="group flex flex-col rounded-2xl bg-white shadow-[0_2px_16px_rgba(0,0,0,0.07)] hover:shadow-[0_8px_32px_rgba(0,0,0,0.12)] transition-all duration-300"
                >
                  {/* Image inset with all-round rounded corners */}
                  {rel.image_url && (
                    <div className="p-3 pb-0">
                      <div className="relative h-52 rounded-xl overflow-hidden">
                        <img
                          src={rel.image_url}
                          alt={rel.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        />
                      </div>
                    </div>
                  )}

                  {/* Content */}
                  <div className="p-5 pt-4 flex-1 flex flex-col">
                    {rel.industry && (
                      <span className="inline-block w-fit bg-brand/10 text-brand text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-3">
                        {rel.industry}
                      </span>
                    )}
                    <h3 className="text-[15px] font-bold text-primary leading-snug group-hover:text-brand transition-colors mb-2 flex-1">
                      {rel.title}
                    </h3>
                    <p className="text-sm text-secondary/55 leading-relaxed line-clamp-2">{rel.subtitle}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <Connect variant="light" />
      <Footer />
      <LeadPopup
        source={`Case Study: ${cs.title}`}
        heading="Get a free strategy session"
        subheading="See how Digi Pexel can achieve similar results for your business."
        cta="Book Free Session"
      />
    </main>
  );
}
