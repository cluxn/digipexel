"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Navbar } from "@/components/blocks/floating-icons-hero-demo";
import { Footer } from "@/components/ui/footer-section";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Connect } from "@/components/blocks/connect-cta";
import { CheckCircle2, ArrowRight } from "lucide-react";

// Types
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
  published_date?: string;
  position?: number;
}

interface RelatedCase {
  id: number; title: string; slug: string; subtitle: string;
  image_url: string; industry: string; client_name: string;
  published_date?: string; position?: number;
}

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
  hero_cta_label: "Start Your Project",
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
      id: "challenge",
      type: "challenge",
      title: "The Challenge",
      content: "FinFlows was processing over 5,000 loan applications monthly — entirely manually. Loan officers spent 70% of their time on data entry, document verification, and cross-system reconciliation, leaving little bandwidth for client relationships or strategic work.",
      points: [
        "5,000+ monthly applications processed manually",
        "70% of ops time spent on repetitive data tasks",
        "Error rate of 3.2% causing downstream compliance issues",
        "No real-time visibility into pipeline bottlenecks",
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
  ],
};

function CaseSectionBlock({ section: s }: { section: CaseSection }) {
  return (
    <div className="space-y-4">
      {s.title && (
        <h2 className="text-2xl md:text-3xl font-display font-bold text-primary leading-tight">{s.title}</h2>
      )}
      {s.content && (
        <p className="text-secondary/75 text-base leading-relaxed">{s.content}</p>
      )}
      {s.points && s.points.length > 0 && (
        <ul className="space-y-2 mt-4">
          {s.points.map((pt, i) => (
            <li key={i} className="flex items-start gap-3 text-sm text-secondary/70">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
              <span>{pt}</span>
            </li>
          ))}
        </ul>
      )}
      {s.metrics && s.metrics.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          {s.metrics.map((m, i) => (
            <div key={i} className="bg-surface border border-border-subtle rounded-2xl p-6 text-center">
              <div className="text-2xl font-black text-brand">{m.value}</div>
              <div className="text-xs font-bold text-primary mt-1">{m.label}</div>
              <div className="text-[10px] text-secondary/50 mt-0.5">{m.desc}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function CaseStudyClient({ slug }: { slug: string }) {
  const [cs, setCs] = useState<CaseStudy | null>(null);
  const [related, setRelated] = useState<RelatedCase[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/backend/api/case_studies.php?slug=${slug}`)
      .then(r => r.json())
      .then(d => {
        if (d.status === "success") {
          setCs(d.data);
          // Fetch all for related case studies
          fetch("/backend/api/case_studies.php")
            .then(r => r.json())
            .then(rd => {
              if (rd.status === "success") {
                const allOtherCases = rd.data.filter((c: any) => c.slug !== slug);
                const sameIndustry = allOtherCases
                  .filter((c: any) => c.industry === d.data.industry)
                  .sort((a: any, b: any) => new Date(b.published_date ?? 0).getTime() - new Date(a.published_date ?? 0).getTime());
                const otherIndustry = allOtherCases
                  .filter((c: any) => c.industry !== d.data.industry)
                  .sort((a: any, b: any) => (a.position ?? 0) - (b.position ?? 0));
                setRelated([...sameIndustry, ...otherIndustry].slice(0, 3));
              }
            });
        } else {
          setCs(DEMO_CASE);
        }
      })
      .catch(() => setCs(DEMO_CASE))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) return <div className="p-20 text-center text-secondary/60">Loading...</div>;
  if (!cs) return <div className="p-20 text-center text-secondary/60">Not Found</div>;

  return (
    <main className="min-h-screen bg-base">
      <Navbar className="top-0" darkHero={false} />

      {/* Hero */}
      <section className="relative overflow-hidden bg-slate-900 py-28 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(37,99,235,0.15),transparent_60%)]" />
        <div className="container mx-auto px-6 max-w-7xl relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_500px] gap-16 items-center">
            <div>
              <Badge className="bg-brand/20 text-brand/90 border border-brand/30 text-[10px] font-bold uppercase tracking-widest mb-6 px-4 py-1.5 rounded-full">
                {cs.eyebrow || "Case Study"}
              </Badge>
              <h1 className="text-4xl md:text-5xl font-display font-bold leading-[1.1] mb-6">{cs.title}</h1>
              <p className="text-lg text-white/70 max-w-xl leading-relaxed mb-8">{cs.subtitle}</p>
              <div className="flex flex-wrap gap-2 mb-10">
                {cs.service_tags?.map(tag => (
                  <span key={tag} className="bg-white/10 border border-white/15 text-white/70 text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full">{tag}</span>
                ))}
              </div>
              <Link href={cs.hero_cta_url || "/contact-us"}>
                <Button className="bg-brand text-white px-8 h-12 rounded-full font-bold text-sm hover:bg-brand/90 shadow-xl shadow-brand/30">
                  {cs.hero_cta_label || "Start Your Project"} <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
            {cs.hero_stats?.length > 0 && (
              <div className="grid grid-cols-2 gap-4">
                {cs.hero_stats.map((stat, i) => (
                  <div key={i} className="bg-white/[0.06] border border-white/10 rounded-3xl p-8 text-center backdrop-blur">
                    <div className="text-3xl md:text-4xl font-black text-white mb-2">{stat.value}</div>
                    <div className="text-[10px] font-black uppercase tracking-widest text-white/50">{stat.label}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Sections */}
      {cs.sections?.length > 0 && (
        <section className="py-20">
          <div className="container mx-auto px-6 max-w-4xl">
            <div className="space-y-14">
              {cs.sections.map((section, i) => (
                <CaseSectionBlock key={section.id || i} section={section} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Related Case Studies */}
      {related.length > 0 && (
        <section className="border-t border-slate-100 py-16 bg-surface/30">
          <div className="container mx-auto px-6 max-w-7xl">
            <h2 className="text-2xl font-display font-bold text-primary mb-10">
              Related <span className="text-brand">Case Studies</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {related.map(rel => (
                <Link key={rel.id} href={`/case-studies/${rel.slug || rel.id}`} className="group flex flex-col rounded-3xl border border-border-subtle bg-surface overflow-hidden hover:border-brand/30 hover:shadow-xl hover:shadow-brand/5 transition-all duration-300">
                  {rel.image_url && (
                    <div className="h-44 overflow-hidden">
                      <img src={rel.image_url} alt={rel.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                    </div>
                  )}
                  <div className="p-6">
                    <span className="text-[9px] font-black uppercase tracking-widest text-brand/60 mb-2 block">{rel.client_name}</span>
                    <h3 className="text-sm font-bold text-primary leading-tight group-hover:text-brand transition-colors">{rel.title}</h3>
                    <p className="text-xs text-secondary/60 mt-2 line-clamp-2">{rel.subtitle}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <Connect variant="light" />
      <Footer />
    </main>
  );
}
