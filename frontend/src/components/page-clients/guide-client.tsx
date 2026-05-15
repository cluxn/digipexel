"use client";

import React, { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Navbar } from "@/components/blocks/floating-icons-hero-demo";
import { Footer } from "@/components/ui/footer-section";
import { safeFetch } from "@/lib/utils";
import { API_BASE_URL } from "@/lib/constants";

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

function ContentPageBanner() {
  const [banner, setBanner] = React.useState<{enabled:boolean;text:string;ctaLabel:string;ctaLink:string;bgColor:string}|null>(null);
  React.useEffect(() => {
    safeFetch(`${API_BASE_URL}/banners.php`)
      .then(json => {
        if (json?.status === "success" && json.data?.banner?.enabled) {
          setBanner(json.data.banner);
        }
      });
  }, []);
  if (!banner) return null;
  return (
    <div className="my-8 rounded-2xl p-6 text-white flex items-center justify-between gap-4 flex-wrap" style={{ backgroundColor: banner.bgColor || "#2563EB" }}>
      <p className="font-semibold text-sm">{banner.text}</p>
      <a href={banner.ctaLink} className="shrink-0 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-xl text-sm font-bold transition-colors">
        {banner.ctaLabel}
      </a>
    </div>
  );
}

export default function GuideClient({ id }: { id: string }) {
  const [guide, setGuide] = useState<Guide | null>(null);
  const [loading, setLoading] = useState(true);
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [newsletterStatus, setNewsletterStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  useEffect(() => {
    async function fetchGuide() {
      try {
        const data = await safeFetch(`${API_BASE_URL}/guides.php`);
        if (data && data.status === "success") {
          const found = data.data.find((g: Guide) => g.id.toString() === id);
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

  const submitNewsletter = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail) return;
    setNewsletterStatus("sending");
    try {
      const res = await fetch(`${API_BASE_URL}/newsletter.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: newsletterEmail }),
      });
      const d = await res.json();
      setNewsletterStatus(d.status === "success" ? "sent" : "error");
    } catch {
      setNewsletterStatus("error");
    }
  };

  if (loading) return <div className="p-20 text-center">Loading...</div>;
  if (!guide) return <div className="p-20 text-center">Not Found</div>;

  return (
    <main className="min-h-screen bg-base">
      <Navbar className="top-0" darkHero={false} />

      {/* Hero */}
      <section className="relative pt-32 pb-14 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(37,99,235,0.05),transparent_50%)]" />
        <div className="container mx-auto px-6 max-w-7xl relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_440px] gap-14 items-start">
            <div>
              <Badge variant="outline" className="section-eyebrow mb-6">{guide.category}</Badge>
              <h1 className="text-3xl md:text-5xl font-display font-bold text-primary leading-[1.1] mb-6">{guide.title}</h1>
              <p className="text-secondary/70 text-lg leading-relaxed max-w-xl">{guide.description}</p>
            </div>
            {guide.image_url && (
              <div className="hidden lg:block rounded-3xl overflow-hidden border border-border-subtle shadow-2xl aspect-[4/3]">
                <img src={guide.image_url} alt={guide.title} className="w-full h-full object-cover" />
              </div>
            )}
          </div>
        </div>
      </section>

      <div className="border-t border-slate-100" />

      {/* Content */}
      <section className="py-16">
        <div className="container mx-auto px-6 max-w-4xl">
          {guide.content ? (
            <div
              className="prose prose-slate prose-lg max-w-none prose-headings:font-display prose-headings:font-bold prose-h2:text-2xl prose-h2:text-primary prose-h3:text-xl prose-h3:text-primary prose-p:text-secondary/75 prose-p:leading-relaxed prose-li:text-secondary/70 prose-strong:text-primary"
              dangerouslySetInnerHTML={{ __html: guide.content }}
            />
          ) : (
            <p className="text-secondary/60 text-base">Full guide content coming soon.</p>
          )}
        </div>
      </section>

      {/* Content Page Banner */}
      <ContentPageBanner />

      {/* Newsletter Block */}
      <section className="bg-slate-900 py-20">
        <div className="container mx-auto px-6 max-w-3xl text-center">
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-brand/70 mb-4 block">Stay Ahead</span>
          <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-4">
            Get the next playbook before it drops.
          </h2>
          <p className="text-white/60 text-base mb-10 leading-relaxed">
            Join operators and founders getting Digi Pexel&apos;s latest automation frameworks, case studies, and guides — direct to their inbox.
          </p>
          {newsletterStatus === "sent" ? (
            <p className="text-emerald-400 font-bold text-base">You are on the list. Watch your inbox.</p>
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
            <p className="text-red-400 text-xs mt-3">Something went wrong. Please try again.</p>
          )}
        </div>
      </section>

      <Footer />
    </main>
  );
}
