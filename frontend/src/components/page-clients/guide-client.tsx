"use client";

import React, { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/blocks/floating-icons-hero-demo";
import { Footer } from "@/components/ui/footer-section";
import { motion } from "framer-motion";
import { CheckCircle2, ArrowRight, FileText, Sparkles, Zap, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { Connect } from "@/components/blocks/connect-cta";
import { safeFetch } from "@/lib/utils";

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

const FALLBACK_GUIDES: Guide[] = [
  {
    id: 1,
    title: "The 2024 AI Automation Roadmap",
    slug: "ai-automation-roadmap",
    description: "How to audit your business for high-ROI automation opportunities and build a 12-month deployment plan.",
    content: "Detailed content for the AI Automation Roadmap playbook including auditing frameworks and deployment schedules.",
    image_url: "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=800",
    category: "Strategy",
    cta_label: "Playbook",
    cta_link: "#"
  },
  {
    id: 2,
    title: "n8n for Enterprise: A Scaling Guide",
    slug: "n8n-enterprise-guide",
    description: "Advanced patterns for managing hundreds of workflows with error handling, version control, and security.",
    content: "Enterprise-grade patterns for n8n deployment including self-hosting, queue management, and CI/CD for workflows.",
    image_url: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800",
    category: "Technical",
    cta_label: "Technical Guide",
    cta_link: "#"
  },
  {
    id: 3,
    title: "Scaling YouTube with AI Agents",
    slug: "youtube-ai-agents",
    description: "Our proprietary framework for automating research, scriptwriting, and production coordination on YouTube.",
    content: "Step-by-step guide to using custom AI agents for video discovery, script generation, and team coordination.",
    image_url: "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?auto=format&fit=crop&q=80&w=800",
    category: "Social",
    cta_label: "Framework",
    cta_link: "#"
  },
  {
    id: 4,
    title: "Zero-Touch Accounting Workflows",
    slug: "accounting-automation",
    description: "How to automate AP/AR and reconciliation using AI and modern fintech integrations safely.",
    content: "Financial automation workflows for modern businesses, ensuring compliance and speed without human overhead.",
    image_url: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&q=80&w=800",
    category: "Operations",
    cta_label: "Operations Playbook",
    cta_link: "#"
  },
  {
    id: 5,
    title: "Lead Scoring and Nurture at Scale",
    slug: "lead-nurture-automation",
    description: "Building autonomous sales systems that identify intent and follow up 24/7 without losing the human touch.",
    content: "Predictive lead scoring and automated follow-up sequences that convert leads while you sleep.",
    image_url: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800",
    category: "Sales",
    cta_label: "Sales Guide",
    cta_link: "#"
  },
  {
    id: 6,
    title: "The AI SEO Playbook",
    slug: "ai-seo-playbook",
    description: "Everything you need to know about Generative Engine Optimization (GEO) and owning AI answers.",
    content: "Mastering GEO to ensure your brand appears in AI-generated search results and LLM chat sessions.",
    image_url: "https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?auto=format&fit=crop&q=80&w=800",
    category: "Marketing",
    cta_label: "SEO Playbook",
    cta_link: "#"
  }
];

export default function GuideClient({ id }: { id: string }) {
  const [guide, setGuide] = useState<Guide | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchGuide() {
      try {
        const data = await safeFetch("/backend/api/guides.php");
        if (data && data.status === "success") {
          const found = data.data.find((g: any) => g.id.toString() === id);
          if (found) setGuide(found);
          else setGuide(FALLBACK_GUIDES.find(g => g.id.toString() === id) || null);
        } else {
          setGuide(FALLBACK_GUIDES.find(g => g.id.toString() === id) || null);
        }
      } catch (err) {
        setGuide(FALLBACK_GUIDES.find(g => g.id.toString() === id) || null);
      } finally {
        setLoading(false);
      }
    }
    fetchGuide();
  }, [id]);

  if (loading) return <div className="p-20 text-center">Loading...</div>;
  if (!guide) return <div className="p-20 text-center">Not Found</div>;

  return (
    <main className="min-h-screen bg-base">
       <Navbar className="top-0" darkHero={false} />
       <section className="relative pt-32 pb-14 overflow-hidden bg-base">
         <div className="container mx-auto px-6 max-w-7xl">
            <h1 className="text-4xl md:text-6xl font-display font-bold mb-6">{guide.title}</h1>
            <p className="text-lg text-secondary/70 max-w-2xl">{guide.description}</p>
         </div>
       </section>
       <Footer />
    </main>
  );
}
