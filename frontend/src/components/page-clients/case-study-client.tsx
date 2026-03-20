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
}

interface RelatedCase {
  id: number; title: string; slug: string; subtitle: string;
  image_url: string; industry: string; client_name: string;
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
  sections: [],
};

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
          fetch("/backend/api/case_studies.php")
            .then(r => r.json())
            .then(rd => {
              if (rd.status === "success") setRelated(rd.data.filter((c: any) => c.slug !== slug).slice(0, 3));
            });
        } else {
          setCs(DEMO_CASE);
        }
      })
      .catch(() => setCs(DEMO_CASE))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) return <div className="p-20 text-center">Loading...</div>;
  if (!cs) return <div className="p-20 text-center">Not Found</div>;

  return (
    <main className="min-h-screen bg-white">
      <Navbar className="top-0" darkHero={false} />
      <section className="relative overflow-hidden bg-slate-900 py-32 text-white">
         <div className="container mx-auto px-6 max-w-7xl">
            <h1 className="text-4xl md:text-6xl font-display font-bold mb-6">{cs.title}</h1>
            <p className="text-lg text-white/70 max-w-2xl">{cs.subtitle}</p>
         </div>
      </section>
      <section className="py-20">
         <div className="container mx-auto px-6 max-w-7xl">
             <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                 {cs.hero_stats.map((s, i) => (
                    <div key={i} className="text-center">
                        <div className="text-3xl font-black text-brand">{s.value}</div>
                        <div className="text-xs font-bold uppercase tracking-widest text-slate-400">{s.label}</div>
                    </div>
                 ))}
             </div>
         </div>
      </section>
      <Footer />
    </main>
  );
}
