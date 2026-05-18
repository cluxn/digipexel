"use client";

import React, { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Navbar } from "@/components/blocks/floating-icons-hero-demo";
import { Footer } from "@/components/ui/footer-section";
import { Connect } from "@/components/blocks/connect-cta";
import { motion } from "framer-motion";
import { ArrowRight, Search } from "lucide-react";
import Link from "next/link";
import { api, endpoints } from "@/lib/api";
import { cn } from "@/lib/utils";

interface Guide {
  id: number;
  title: string;
  description: string;
  image_url: string;
  category: string;
  cta_label: string;
  cta_link: string;
  position: number;
}

const PAGE_SIZE = 10;

const FALLBACK_GUIDES: Guide[] = [
  { id: 1, title: "The AI Automation Roadmap: A 12-Month Playbook for B2B Teams", description: "A step-by-step framework for auditing your operations, identifying high-ROI automation opportunities, and building a deployment plan that delivers measurable results within 90 days.", image_url: "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=800", category: "Strategy", cta_label: "Read the Playbook", cta_link: "#", position: 0 },
  { id: 2, title: "GEO vs SEO: The Complete Guide to Getting Your Brand Cited by AI", description: "Everything B2B marketing leaders need to know about Generative Engine Optimisation — how AI assistants select citations, what signals matter, and how to build a content strategy that wins in the AI answer era.", image_url: "https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?auto=format&fit=crop&q=80&w=800", category: "SEO", cta_label: "Read the Guide", cta_link: "#", position: 1 },
  { id: 3, title: "The AI Vendor Selection Scorecard: 7 Criteria Every Ops Leader Must Evaluate", description: "A structured evaluation framework for B2B operations leaders vetting AI automation partners. Score vendors across 7 weighted criteria and make a confident, data-backed selection decision.", image_url: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80&w=800", category: "Strategy", cta_label: "Download the Scorecard", cta_link: "#", position: 2 },
  { id: 4, title: "The 90-Day Ops Transformation Playbook: From Manual to Automated", description: "A week-by-week implementation guide for founders and COOs who want to automate their core operations without disrupting the business. Covers audit methodology, tool selection, build sprints, and go-live validation.", image_url: "https://images.unsplash.com/photo-1611532736597-de2d4265fba3?auto=format&fit=crop&q=80&w=800", category: "Operations", cta_label: "Read the Playbook", cta_link: "#", position: 3 },
];

export default function GuidesPage() {
  const [guides, setGuides] = useState<Guide[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState<"popular" | "recent">("popular");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    async function fetchGuides() {
      try {
        const res = await api.get(endpoints.guides);
        if (res.status === "success" && res.data) {
          setGuides(res.data as Guide[]);
        } else {
          setGuides(FALLBACK_GUIDES);
        }
      } catch (err) {
        console.error("Failed to fetch guides", err);
        setGuides(FALLBACK_GUIDES);
      } finally {
        setLoading(false);
      }
    }
    fetchGuides();
  }, []);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedCategory, sortBy]);

  const categories = ["All", ...Array.from(new Set(guides.map(g => g.category).filter(Boolean)))];

  // Step 1: filter
  const filteredGuides = guides.filter(g => {
    const matchesSearch =
      g.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      g.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "All" || g.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Step 2: sort
  const sortedGuides = [...filteredGuides].sort((a, b) => {
    if (sortBy === "popular") return (a.position ?? 0) - (b.position ?? 0);
    // Recent: fall back to position DESC for "newest" order (guides have no published_at)
    return (b.position ?? 0) - (a.position ?? 0);
  });

  // Step 3: paginate
  const totalPages = Math.ceil(sortedGuides.length / PAGE_SIZE);
  const paginatedGuides = sortedGuides.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  return (
    <main className="min-h-screen bg-base">
      <Navbar className="top-0" darkHero={false} />

      {/* Hero Section */}
      <section className="relative min-h-[70vh] flex items-center pt-32 pb-12 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(37,99,235,0.05),transparent_50%)]" />
        <div className="container mx-auto px-6 max-w-6xl relative z-10 text-center">
          <Badge variant="outline" className="section-eyebrow mb-6 mx-auto">
            Resources &amp; Guides
          </Badge>
          <h1 className="hero-title mb-6 leading-[1.05]">
            The <span className="hero-title-accent">Digi Pexel</span><br />Playbooks
          </h1>
          <p className="section-subtitle max-w-2xl mx-auto mb-10 opacity-70">
            Step-by-step deep dives and technical whitepapers on building high-performance AI workflows for your scale.
          </p>

          <div className="max-w-xl mx-auto relative group">
            <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none text-secondary/40 group-focus-within:text-brand transition-colors">
              <Search className="w-5 h-5" />
            </div>
            <input
              type="text"
              placeholder="Search guides by title or category..."
              className="w-full h-16 bg-surface border border-border-subtle rounded-3xl pl-14 pr-6 text-sm focus:outline-none focus:ring-4 focus:ring-brand/5 focus:border-brand/30 transition-all shadow-xl shadow-black/5"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </section>

      {/* Category Filter + Sort */}
      <section className="pb-8 pt-4">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
            {/* Category chips */}
            <div className="flex flex-wrap gap-2">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={cn(
                    "px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest border transition-all duration-200",
                    selectedCategory === cat
                      ? "bg-brand border-brand text-white shadow-lg shadow-brand/20"
                      : "bg-surface border-border-subtle text-secondary/60 hover:border-brand/30 hover:text-brand"
                  )}
                >
                  {cat}
                </button>
              ))}
            </div>
            {/* Sort buttons */}
            <div className="flex items-center gap-2 flex-shrink-0">
              <span className="text-[10px] font-black uppercase tracking-widest text-secondary/40 mr-1">Sort:</span>
              {(["popular", "recent"] as const).map(opt => (
                <button
                  key={opt}
                  onClick={() => setSortBy(opt)}
                  className={cn(
                    "px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest border transition-all",
                    sortBy === opt
                      ? "bg-brand border-brand text-white shadow-lg shadow-brand/20"
                      : "bg-surface border-border-subtle text-secondary/60 hover:border-brand/30 hover:text-brand"
                  )}
                >
                  {opt === "popular" ? "Popular" : "Recent"}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Guides Grid */}
      <section className="pb-20">
        <div className="container mx-auto px-6 max-w-6xl">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-[450px] rounded-[2.5rem] bg-surface/50 animate-pulse border border-border-subtle" />
              ))}
            </div>
          ) : paginatedGuides.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {paginatedGuides.map((guide, idx) => (
                <GuideCard key={guide.id} guide={guide} index={idx} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-surface border border-border-subtle mb-6">
                <Search className="w-8 h-8 text-secondary/40" />
              </div>
              <h3 className="text-xl font-bold text-primary">No guides found</h3>
              <p className="text-secondary/60 mt-2">Try adjusting your search terms or filters.</p>
            </div>
          )}

          {/* Pagination */}
          {!loading && totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-16">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-5 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest border border-border-subtle bg-surface text-secondary/60 hover:border-brand/30 hover:text-brand disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              >
                Prev
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={cn(
                    "w-10 h-10 rounded-full text-[10px] font-black border transition-all",
                    currentPage === page
                      ? "bg-brand border-brand text-white shadow-lg shadow-brand/20"
                      : "bg-surface border-border-subtle text-secondary/60 hover:border-brand/30 hover:text-brand"
                  )}
                >
                  {page}
                </button>
              ))}
              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="px-5 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest border border-border-subtle bg-surface text-secondary/60 hover:border-brand/30 hover:text-brand disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </section>

      <Connect variant="light" />

      <Footer />
    </main>
  );
}

function GuideCard({ guide, index }: { guide: Guide; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="group relative h-full flex flex-col rounded-[2.5rem] border border-border-subtle bg-surface/40 backdrop-blur-sm overflow-hidden hover:border-brand/30 hover:shadow-2xl hover:shadow-brand/5 transition-all duration-500"
    >
      <Link href={`/guides/${guide.id}`} className="absolute inset-0 z-10" />
      <div className="relative h-60 overflow-hidden">
        <img
          src={guide.image_url}
          alt={guide.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
        />
        <div className="absolute top-6 left-6">
          <Badge className="bg-brand/90 backdrop-blur text-white border-none px-4 py-1.5 text-[10px] font-bold uppercase tracking-widest rounded-full">
            {guide.category}
          </Badge>
        </div>
      </div>

      <div className="p-10 flex flex-col flex-1">
        <h3 className="text-xl font-bold text-primary mb-4 leading-tight group-hover:text-brand transition-colors">
          {guide.title}
        </h3>
        <p className="text-secondary/70 text-sm leading-relaxed mb-8 line-clamp-3">
          {guide.description}
        </p>

        <div className="mt-auto pt-8 border-t border-border-subtle/30">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-primary group-hover:text-brand transition-colors">
              {guide.cta_label || "Read Guide"}
            </span>
            <div className="w-10 h-10 rounded-full border border-border-subtle flex items-center justify-center group-hover:bg-brand group-hover:border-brand group-hover:text-white transition-all duration-300">
              <ArrowRight className="w-4 h-4" />
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
