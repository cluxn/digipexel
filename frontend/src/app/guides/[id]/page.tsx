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
  feature1?: string;
  feature2?: string;
  feature3?: string;
  feature4?: string;
  stat1_label?: string;
  stat1_value?: string;
  stat2_label?: string;
  stat2_value?: string;
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
    cta_link: "#",
    feature1: "Optimize content for AI-driven search engines.",
    feature2: "Dominate LLM chat sessions with authoritative answers.",
    feature3: "Implement strategies for Generative Engine Optimization.",
    feature4: "Track and analyze AI search performance.",
    stat1_label: "Visibility",
    stat1_value: "Top 3",
    stat2_label: "Authority",
    stat2_value: "Leading"
  }
];

export default function GuideDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = React.use(params);
  const [guide, setGuide] = useState<Guide | null>(null);
  const [loading, setLoading] = useState(true);
  const [formState, setFormState] = useState({ name: "", email: "", submitted: false, loading: false });

  useEffect(() => {
    async function fetchGuide() {
      try {
        const data = await safeFetch("/api/guides.php");
        if (data && data.status === "success") {
          const found = data.data.find((g: any) => g.id.toString() === id);
          if (found) {
            setGuide(found);
          } else {
            const fFound = FALLBACK_GUIDES.find(g => g.id.toString() === id);
            if (fFound) setGuide(fFound);
          }
        }
      } catch (err) {
        console.error("Failed to fetch guide", err);
        const fFound = FALLBACK_GUIDES.find(g => g.id.toString() === id);
        if (fFound) setGuide(fFound);
      } finally {
        setLoading(false);
      }
    }
    fetchGuide();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!formState.name || !formState.email) return;
      
      setFormState(prev => ({ ...prev, loading: true }));
      try {
          const data = await safeFetch("/api/leads.php", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                  action: "add_lead",
                  full_name: formState.name,
                  email: formState.email,
                  service: `Guide Download: ${guide?.title}`,
                  message: `User requested ${guide?.cta_label} from ${guide?.title}.`
              })
          });
          if (data && data.status === "success") {
              setFormState(prev => ({ ...prev, submitted: true }));
          }
      } catch (err) {
          console.error("Submission failed", err);
          alert("Something went wrong. Please try again.");
      } finally {
          setFormState(prev => ({ ...prev, loading: false }));
      }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-base flex flex-col items-center justify-center">
         <div className="w-12 h-12 border-4 border-brand/20 border-t-brand rounded-full animate-spin" />
         <p className="mt-4 text-xs font-bold uppercase tracking-widest text-secondary/40">Loading Playbook...</p>
      </div>
    );
  }

  if (!guide) {
    return (
      <main className="min-h-screen bg-base flex flex-col">
        <Navbar className="top-0" darkHero={false} />
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
          <h1 className="text-4xl font-bold text-primary mb-4">Guide Not Found</h1>
          <p className="text-secondary mb-8">The resource you&apos;re looking for might have been moved or deleted.</p>
          <Button asChild variant="brand" size="lg">
            <Link href="/guides">Back to Library</Link>
          </Button>
        </div>
        <Footer />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-base">
      <Navbar className="top-0" darkHero={false} />

      {/* Hero Section - Standardized for Single Screen Fit */}
      <section className="relative min-h-[80vh] flex items-center pt-32 pb-12 overflow-hidden">
         <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(37,99,235,0.05),transparent_50%),radial-gradient(circle_at_bottom_left,rgba(37,99,235,0.03),transparent_40%)]" />
         
         <div className="container mx-auto px-6 max-w-7xl relative z-10 w-full">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
                {/* Text & Form */}
                <div className="animate-in fade-in slide-in-from-left-8 duration-1000">
                    <div className="section-eyebrow mb-6 w-fit">
                        {guide.category} • Professional Guide
                    </div>
                    <h1 className="hero-title mb-6 max-w-2xl leading-[1.05] line-clamp-2">
                        {guide.title}
                    </h1>
                    <p className="text-lg text-secondary/70 leading-relaxed max-w-xl mb-10">
                        {guide.description}
                    </p>

                    <div className="p-8 rounded-[2.5rem] border border-border-subtle bg-surface/80 backdrop-blur-xl shadow-2xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-6 opacity-5">
                            <FileText className="w-16 h-16" />
                        </div>
                        
                        {formState.submitted ? (
                            <div className="text-center py-4 space-y-4">
                                <div className="w-16 h-16 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center mx-auto">
                                    <CheckCircle2 className="w-8 h-8" />
                                </div>
                                <h3 className="text-xl font-bold text-primary">Transmission Successful</h3>
                                <p className="text-secondary/60 text-sm">Check your inbox for the {guide.cta_label}.</p>
                            </div>
                        ) : (
                            <>
                                <h3 className="text-lg font-bold text-primary mb-6">Access the full roadmap</h3>
                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <input 
                                            required
                                            type="text" 
                                            placeholder="Full Name" 
                                            className="h-14 bg-base border border-border-subtle rounded-2xl px-6 text-sm focus:outline-none focus:border-brand/30 transition-all font-medium"
                                            value={formState.name}
                                            onChange={(e) => setFormState(prev => ({ ...prev, name: e.target.value }))}
                                        />
                                        <input 
                                            required
                                            type="email" 
                                            placeholder="Work Email" 
                                            className="h-14 bg-base border border-border-subtle rounded-2xl px-6 text-sm focus:outline-none focus:border-brand/30 transition-all font-medium"
                                            value={formState.email}
                                            onChange={(e) => setFormState(prev => ({ ...prev, email: e.target.value }))}
                                        />
                                    </div>
                                    <Button 
                                        type="submit"
                                        disabled={formState.loading}
                                        className="w-full h-14 rounded-2xl bg-brand text-white font-bold text-lg shadow-xl shadow-brand/20 hover:scale-[1.02] transition-transform active:scale-95 disabled:opacity-50"
                                    >
                                        {formState.loading ? "Processing..." : `Send My ${guide.cta_label}`}
                                    </Button>
                                    <p className="text-[10px] text-center text-secondary/40 font-medium tracking-wide">
                                        BY ACCESSING, YOU AGREE TO OUR PRIVACY PROTOCOLS.
                                    </p>
                                </form>
                            </>
                        )}
                    </div>
                </div>

                {/* Guide Mockup */}
                <div className="relative group animate-in fade-in zoom-in-95 duration-1000 delay-200 hidden lg:block">
                    <div className="absolute -inset-20 bg-brand/10 blur-[120px] rounded-full opacity-50 group-hover:scale-110 transition-transform duration-700" />
                    <div className="relative aspect-[3/4] max-w-sm ml-auto rounded-[3rem] overflow-hidden shadow-[0_50px_100px_-20px_rgba(0,0,0,0.3)] border border-white/10 ring-1 ring-white/20">
                        <img src={guide.image_url} alt={guide.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                        <div className="absolute bottom-10 left-10 right-10">
                             <div className="h-1 w-16 bg-brand rounded-full mb-6" />
                             <h4 className="text-3xl font-display font-bold text-white leading-tight tracking-tight">
                                {guide.title}
                             </h4>
                             <p className="text-white/60 text-xs mt-4 font-bold uppercase tracking-[0.2em]">{guide.category} Edition</p>
                        </div>
                    </div>
                </div>
            </div>
         </div>
      </section>

      {/* Why Section - Extended for Manageability */}
      <section className="py-32 relative overflow-hidden bg-surface/30 border-y border-border-subtle/30">
        <div className="container mx-auto px-6 max-w-5xl relative z-10">
            <div className="text-center mb-20 max-w-3xl mx-auto">
                <Badge variant="outline" className="mb-4 bg-brand/10 text-brand border-brand/20">Operational Alpha</Badge>
                <h2 className="section-title leading-tight">
                    Transform your team with <br /><span className="section-title-accent">{guide.category} Automation</span>
                </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-start">
                <div className="space-y-8">
                    <p className="text-lg text-secondary leading-relaxed font-medium opacity-80">
                        Companies that fail to integrate AI into their core workflows spend 4x more on routine operations than their automated peers.
                    </p>
                    <div className="p-10 rounded-[2.5rem] bg-brand text-white space-y-4 shadow-2xl shadow-brand/20 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-8 opacity-10">
                            <Sparkles className="w-20 h-20" />
                        </div>
                        <p className="text-[10px] font-black uppercase tracking-[0.4em] opacity-50">Insights</p>
                        <p className="text-xl font-display font-bold leading-relaxed relative z-10">
                            &quot;The automated enterprise isn&apos;t just faster—it&apos;s fundamentally more agile in a volatile market.&quot;
                        </p>
                    </div>
                </div>
                <div className="grid grid-cols-1 gap-5">
                    {[guide.feature1, guide.feature2, guide.feature3, guide.feature4].map((f, i) => f && (
                        <div key={i} className="flex items-start gap-5 p-6 rounded-[2rem] border border-border-subtle bg-surface/50 hover:border-brand/30 transition-all group">
                            <div className="w-12 h-12 rounded-2xl bg-brand/5 flex items-center justify-center group-hover:bg-brand group-hover:text-white transition-all shrink-0">
                                <CheckCircle2 className="w-6 h-6 text-brand group-hover:text-white transition-colors" />
                            </div>
                            <div className="pt-2">
                                <span className="text-sm font-bold text-primary opacity-80 group-hover:opacity-100 transition-opacity leading-tight">{f}</span>
                            </div>
                        </div>
                    ))}
                    {!guide.feature1 && (
                        <>
                            <FeatureItem text="Audit your current workflows for high-ROI gaps." />
                            <FeatureItem text="Step-by-step logic for 100% autonomous cycles." />
                            <FeatureItem text="Governance patterns for secure AI deployment." />
                            <FeatureItem text="Measurable KPIs for automation success." />
                        </>
                    )}
                </div>
            </div>
        </div>
      </section>

      {/* Main Content / eBook Details */}
      <section className="py-40 relative">
          <div className="container mx-auto px-6 max-w-6xl relative z-10">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
                  <div className="relative group">
                      <div className="absolute inset-0 bg-brand/5 blur-[100px] rounded-full" />
                      <div className="relative z-10 rounded-[3rem] overflow-hidden shadow-2xl skew-y-2 group-hover:skew-y-0 transition-transform duration-700 ring-1 ring-border-subtle">
                          <img src={guide.image_url} alt="" className="w-full aspect-square object-cover grayscale group-hover:grayscale-0 transition-all duration-700" />
                      </div>
                  </div>
                  <div className="space-y-12">
                      <div>
                          <Badge variant="outline" className="mb-6">The Content</Badge>
                          <h2 className="text-4xl md:text-5xl font-display font-bold text-primary mb-8 leading-[1.1] tracking-tight">
                             Get Your <span className="hero-title-accent">Free Playbook</span> <br />Today!
                          </h2>
                          <div className="prose prose-slate prose-invert max-w-none text-secondary/70 leading-relaxed font-medium text-lg">
                             {guide.content ? (
                                <div dangerouslySetInnerHTML={{ __html: guide.content.split('\n').join('<br/>') }} />
                             ) : (
                                <p>
                                    Our proprietary automation framework is designed for teams who need to scale fast without increasing headcount. Inside this guide, we break down the exact strategies we use to deliver measurable ROI across diverse industries.
                                </p>
                             )}
                          </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-8">
                          <StatBox 
                            icon={<Zap className="w-5 h-5" />} 
                            label={guide.stat1_label || "Execution"} 
                            value={guide.stat1_value || "Real-time"} 
                          />
                          <StatBox 
                            icon={<ShieldCheck className="w-5 h-5" />} 
                            label={guide.stat2_label || "Security"} 
                            value={guide.stat2_value || "Enterprise"} 
                          />
                      </div>
                  </div>
              </div>
          </div>
      </section>

      {/* Call to Action Box - Unified Dark Theme */}
      <Connect variant="light" />

      {/* Newsletter Banner - Light Theme Clean Style */}
      <section className="py-24 bg-white border-y border-border-subtle/40">
          <div className="container mx-auto px-6 text-center max-w-3xl">
              <Badge variant="outline" className="section-eyebrow mb-6 mx-auto">Stay Informed</Badge>
              <h2 className="text-3xl font-display font-bold text-primary mb-4 leading-tight">
                  Get insights from our <br /><span className="text-brand">Technology Experts.</span>
              </h2>
              <p className="text-sm text-secondary/60 mb-8 max-w-lg mx-auto font-medium leading-relaxed">
                  Join 2,500+ leaders receiving weekly playbooks on AI automation.
              </p>
              
              <div className="max-w-md mx-auto">
                  <div className="relative flex gap-2">
                    <input 
                        type="email" 
                        placeholder="Work Email" 
                        className="flex-1 h-12 bg-base border border-border-subtle rounded-xl px-4 text-sm text-primary placeholder:text-secondary/30 focus:outline-none focus:border-brand/30 transition-all font-medium" 
                    />
                    <button className="h-12 px-6 bg-brand text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-brand-hover transition-all active:scale-95 shadow-lg shadow-brand/10">
                        Join
                    </button>
                  </div>
              </div>
          </div>
      </section>

      <Footer />
    </main>
  );
}

function FeatureItem({ text }: { text: string }) {
    return (
        <div className="flex items-start gap-5 p-6 rounded-[2rem] border border-border-subtle bg-surface/50 hover:border-brand/30 transition-all group">
            <div className="w-12 h-12 rounded-2xl bg-brand/5 flex items-center justify-center group-hover:bg-brand group-hover:text-white transition-all shrink-0">
                <CheckCircle2 className="w-6 h-6 text-brand group-hover:text-white transition-colors" />
            </div>
            <div className="pt-2">
                <span className="text-sm font-bold text-primary opacity-80 group-hover:opacity-100 transition-opacity leading-tight">{text}</span>
            </div>
        </div>
    );
}

function StatBox({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
    return (
        <div className="space-y-2 p-6 rounded-3xl bg-surface border border-border-subtle shadow-sm">
            <div className="flex items-center gap-2 text-brand">
                {icon}
                <span className="text-[10px] font-black uppercase tracking-widest">{label}</span>
            </div>
            <div className="text-2xl font-display font-bold text-primary">{value}</div>
        </div>
    );
}
