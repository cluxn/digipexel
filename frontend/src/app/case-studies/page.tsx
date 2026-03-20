"use client";

import React, { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/blocks/floating-icons-hero-demo";
import { Footer } from "@/components/ui/footer-section";
import { Connect } from "@/components/blocks/connect-cta";
import { motion } from "framer-motion";
import { Search, ArrowRight, ExternalLink, Globe, Layout, TrendingUp } from "lucide-react";
import Link from "next/link";
import { api, endpoints } from "@/lib/api";
import { cn } from "@/lib/utils";

interface CaseStudy {
  id: number;
  title: string;
  subtitle: string;
  image_url: string;
  industry: string;
  client_name: string;
  slug: string;
}

export default function CaseStudiesPage() {
  const [cases, setCases] = useState<CaseStudy[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIndustry, setSelectedIndustry] = useState("All");

  useEffect(() => {
    async function fetchCases() {
      try {
        const res = await api.get(endpoints.caseStudies);
        if (res.status === "success" && res.data) {
          setCases(res.data);
        }
      } catch (err) {
        console.error("Failed to fetch case studies", err);
      } finally {
        setLoading(false);
      }
    }
    fetchCases();
  }, []);

  const industries = ["All", ...Array.from(new Set(cases.map(c => c.industry)))];

  const filteredCases = cases.filter(c => {
    const matchesSearch = c.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          c.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          c.client_name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesIndustry = selectedIndustry === "All" || c.industry === selectedIndustry;
    return matchesSearch && matchesIndustry;
  });

  return (
    <main className="min-h-screen bg-base">
      <Navbar className="top-0" darkHero={false} />
      
      {/* Hero Section */}
      <section className="relative min-h-[72vh] flex items-center pt-32 pb-16 overflow-hidden">
        {/* Subtle radial glow */}
        <div className="absolute inset-x-0 top-0 h-[500px] bg-gradient-to-b from-brand/6 to-transparent pointer-events-none" />
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[300px] bg-brand/5 blur-[100px] rounded-full pointer-events-none" />

        <div className="container mx-auto px-6 max-w-4xl relative z-10 w-full text-center">
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <Badge variant="outline" className="section-eyebrow mb-6 mx-auto">
              Proven Results
            </Badge>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.08 }}
            className="hero-title mb-6 leading-[1.05]"
          >
            Engineering <span className="hero-title-accent">Autonomous Success.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.18 }}
            className="text-lg md:text-xl text-secondary/60 max-w-2xl mx-auto leading-relaxed font-medium mb-10"
          >
            Real-world applications of AI agents, complex automations, and digital transformation across diverse industries.
          </motion.p>

          {/* CTA + Search row */}
          <motion.div
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.28 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            {/* Search bar */}
            <div className="relative w-full max-w-sm group">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary/40 group-focus-within:text-brand transition-all" />
              <input
                type="text"
                placeholder="Search by industry or keyword…"
                className="w-full h-14 bg-surface border border-border-subtle rounded-full pl-12 pr-5 text-sm focus:outline-none focus:ring-4 focus:ring-brand/8 focus:border-brand/30 transition-all shadow-lg shadow-black/5"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* CTA button */}
            <Link href="/contact-us">
              <Button className="h-14 px-8 rounded-full bg-brand text-white font-bold text-sm hover:bg-brand-hover shadow-xl shadow-brand/30 flex items-center gap-2 whitespace-nowrap">
                Start Your Project <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Grid Section */}
      <section className="pb-32">
        <div className="container mx-auto px-6 max-w-7xl">
            {/* Industry Filter */}
            <div className="flex flex-wrap gap-2 mb-16 border-b border-border-subtle pb-8">
                {industries.map(ind => (
                    <button
                        key={ind}
                        onClick={() => setSelectedIndustry(ind)}
                        className={cn(
                            "px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all",
                            selectedIndustry === ind 
                                ? "bg-primary text-white shadow-xl" 
                                : "bg-surface text-secondary/50 hover:bg-slate-50 border border-border-subtle"
                        )}
                    >
                        {ind}
                    </button>
                ))}
            </div>

            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    {[1, 2].map(i => (
                        <div key={i} className="h-[600px] rounded-[3.5rem] bg-surface/50 animate-pulse" />
                    ))}
                </div>
            ) : filteredCases.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16">
                    {filteredCases.map((cs, idx) => (
                        <CaseStudyCard key={cs.id} study={cs} index={idx} />
                    ))}
                </div>
            ) : (
                <div className="py-32 text-center rounded-[3rem] bg-surface/30 border-2 border-dashed border-border-subtle">
                    <p className="text-secondary/60 font-bold uppercase tracking-widest">No matching case studies</p>
                </div>
            )}
        </div>
      </section>

      <Connect variant="light" />

      <Footer />
    </main>
  );
}

function CaseStudyCard({ study, index }: { study: CaseStudy; index: number }) {
  return (
    <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: index * 0.1, duration: 0.8 }}
        className="group relative flex flex-col"
    >
        <Link href={`/case-studies/${study.slug || study.id}`} className="absolute inset-0 z-20" />
        <div className="relative aspect-[16/10] rounded-[3.5rem] overflow-hidden mb-8 border border-border-subtle shadow-2xl shadow-black/5">
            <img src={study.image_url} alt={study.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" />
            <div className="absolute inset-0 bg-gradient-to-tr from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            <div className="absolute top-8 left-8">
                <Badge className="bg-white/90 backdrop-blur text-primary border-none shadow-xl px-4 py-2 text-[10px] font-black uppercase tracking-widest rounded-2xl">
                    {study.industry}
                </Badge>
            </div>

            <div className="absolute bottom-8 right-8 overflow-hidden">
                <div className="bg-brand text-white w-14 h-14 rounded-full flex items-center justify-center translate-y-20 group-hover:translate-y-0 transition-transform duration-500 shadow-2xl">
                    <ArrowRight className="w-6 h-6" />
                </div>
            </div>
        </div>

        <div className="px-4">
            <span className="text-xs font-black uppercase tracking-[0.3em] text-brand/60 mb-3 block">{study.client_name}</span>
            <h3 className="text-2xl md:text-3xl font-display font-bold text-primary mb-4 leading-tight group-hover:text-brand transition-colors">
                {study.title}
            </h3>
            <p className="text-secondary/70 text-base leading-relaxed line-clamp-2">
                {study.subtitle}
            </p>
        </div>
    </motion.div>
  );
}
