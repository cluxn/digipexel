"use client";

import React, { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Navbar } from "@/components/blocks/floating-icons-hero-demo";
import { Footer } from "@/components/ui/footer-section";
import { Connect } from "@/components/blocks/connect-cta";
import { motion } from "framer-motion";
import { Search, Calendar, User, ArrowRight, Clock } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { api, endpoints } from "@/lib/api";
import { cn } from "@/lib/utils";

interface BlogPost {
  id: number;
  title: string;
  excerpt: string;
  image_url: string;
  category: string;
  published_at: string;
  slug: string;
  position: number;
  status: string;
}

const FALLBACK_POSTS: BlogPost[] = [
  { id: 1, title: "How AI Automation Eliminates 14 Hours of Manual Work Per Week", excerpt: "Every knowledge worker loses hours each week on repetitive tasks. Here is how to reclaim that time with autonomous AI workflows.", image_url: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&q=80&w=800", category: "AI Strategy", published_at: "2025-03-14", slug: "ai-automation-eliminates-manual-work", position: 0, status: "published" },
  { id: 2, title: "SEO in the Age of AI: How to Win When LLMs Answer Instead of Google", excerpt: "Search is changing. AI assistants now answer questions directly. Here is how to ensure your brand is the one they cite.", image_url: "https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?auto=format&fit=crop&q=80&w=800", category: "SEO", published_at: "2025-04-02", slug: "seo-age-of-ai-llm-answers", position: 1, status: "published" },
  { id: 3, title: "How to Evaluate an AI Automation Agency: 8 Questions Every COO Must Ask", excerpt: "Most agencies overpromise and underdeliver on AI. Here is exactly what to ask before committing budget.", image_url: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&q=80&w=800", category: "Strategy", published_at: "2025-04-18", slug: "evaluate-ai-automation-agency-coo-guide", position: 2, status: "published" },
  { id: 4, title: "CRM-to-Campaign in 12 Days: The Automation Stack That Runs Your Outbound", excerpt: "Stop running campaigns manually. Here is the exact automation stack that moves CRM signals into personalised outreach without touching a spreadsheet.", image_url: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800", category: "Growth", published_at: "2025-05-06", slug: "crm-to-campaign-automation-stack", position: 3, status: "published" },
];

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState<"popular" | "recent">("popular");
  const [currentPage, setCurrentPage] = useState(1);
  const PAGE_SIZE = 10;

  useEffect(() => {
    async function fetchPosts() {
      try {
        const res = await api.get(endpoints.blogs);
        if (res.status === "success" && res.data) {
          setPosts(res.data as BlogPost[]);
        } else {
          setPosts(FALLBACK_POSTS);
        }
      } catch (err) {
        console.error("Failed to fetch blog posts", err);
        setPosts(FALLBACK_POSTS);
      } finally {
        setLoading(false);
      }
    }
    fetchPosts();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedCategory, sortBy]);

  const categories = ["All", ...Array.from(new Set(posts.map(p => p.category)))];

  // Step 1: filter
  const filteredPosts = posts.filter(p => {
    const matchesSearch =
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "All" || p.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Step 2: sort
  const sortedPosts = [...filteredPosts].sort((a, b) => {
    if (sortBy === "popular") return (a.position ?? 0) - (b.position ?? 0);
    return new Date(b.published_at).getTime() - new Date(a.published_at).getTime();
  });

  // Step 3: paginate
  const totalPages = Math.ceil(sortedPosts.length / PAGE_SIZE);
  const paginatedPosts = sortedPosts.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  return (
    <main className="min-h-screen bg-base">
      <Navbar className="top-0" darkHero={false} />
      
      {/* Hero Section */}
      <section className="relative min-h-[72vh] flex items-center pt-32 pb-16 overflow-hidden">
        {/* Top brand gradient */}
        <div className="absolute inset-x-0 top-0 h-[520px] bg-gradient-to-b from-brand/8 to-transparent pointer-events-none" />
        {/* Centre glow blob */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[300px] bg-brand/8 blur-[100px] rounded-full pointer-events-none" />
        {/* Right teal accent */}
        <div className="absolute top-1/4 right-0 w-[360px] h-[360px] bg-accent/6 blur-[100px] rounded-full pointer-events-none" />

        <div className="container mx-auto px-6 max-w-4xl relative z-10 w-full text-center">
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <Badge variant="outline" className="section-eyebrow mb-6 mx-auto">
              Insights & Perspectives
            </Badge>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.08 }}
            className="hero-title mb-6 leading-[1.05]"
          >
            Ideas That Drive<br /><span className="hero-title-accent">Real Decisions.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.18 }}
            className="text-lg md:text-xl text-secondary/60 max-w-2xl mx-auto leading-relaxed font-medium mb-10"
          >
            Deep dives on AI automation, growth strategy, and the tools reshaping how modern businesses scale — written for decision makers.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.28 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12"
          >
            <div className="relative w-full max-w-sm group">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary/40 group-focus-within:text-brand transition-all" />
              <input
                type="text"
                placeholder="Search articles..."
                className="w-full h-14 bg-surface border border-border-subtle rounded-full pl-12 pr-5 text-sm focus:outline-none focus:ring-4 focus:ring-brand/8 focus:border-brand/30 transition-all shadow-lg shadow-black/5"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Link href="/contact-us">
              <Button className="h-14 px-8 rounded-full bg-brand text-white font-bold text-sm hover:bg-brand-hover shadow-xl shadow-brand/30 flex items-center gap-2 whitespace-nowrap">
                Talk to an Expert <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </motion.div>

          {/* Stats strip */}
          <motion.div
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.4 }}
            className="flex flex-wrap items-center justify-center gap-x-10 gap-y-4"
          >
            {[
              { value: "24+", label: "Articles" },
              { value: "6",   label: "Topics" },
              { value: "Weekly", label: "New Insights" },
              { value: "B2B", label: "Focused" },
            ].map((s, i) => (
              <div key={s.label} className="flex items-center gap-10">
                <div className="text-center">
                  <p className="text-2xl font-black text-brand leading-none">{s.value}</p>
                  <p className="text-[10px] font-semibold uppercase tracking-widest text-secondary/40 mt-1">{s.label}</p>
                </div>
                {i < 3 && <div className="hidden sm:block w-px h-8 bg-border-subtle" />}
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Filter & List */}
      <section className="pb-32">
        <div className="container mx-auto px-6 max-w-6xl">
          {/* Category Pills */}
          <div className="flex flex-wrap items-center justify-center gap-3 mb-16">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={cn(
                  "px-6 py-2.5 rounded-full text-[11px] font-black uppercase tracking-widest border transition-all duration-300",
                  selectedCategory === cat
                    ? "bg-brand border-brand text-white shadow-lg shadow-brand/20"
                    : "bg-surface border-border-subtle text-secondary/60 hover:border-brand/30 hover:text-brand"
                )}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Sort Controls */}
          <div className="flex items-center justify-end gap-2 mb-10 -mt-10">
            <span className="text-[10px] font-black uppercase tracking-widest text-secondary/40 mr-2">Sort:</span>
            {(["popular", "recent"] as const).map(opt => (
              <button
                key={opt}
                onClick={() => setSortBy(opt)}
                className={cn(
                  "px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest border transition-all duration-200",
                  sortBy === opt
                    ? "bg-brand border-brand text-white shadow-lg shadow-brand/20"
                    : "bg-surface border-border-subtle text-secondary/60 hover:border-brand/30 hover:text-brand"
                )}
              >
                {opt === "popular" ? "Popular" : "Recent"}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-96 rounded-[2.5rem] bg-surface/50 animate-pulse border border-border-subtle" />
              ))}
            </div>
          ) : paginatedPosts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {paginatedPosts.map((post, idx) => (
                <BlogPostCard key={post.id} post={post} index={idx} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-surface/50 rounded-[3rem] border border-dashed border-border-subtle">
              <h3 className="text-xl font-bold text-primary">No stories match your search</h3>
              <p className="text-secondary/60 mt-2">Try adjusting your filters or search terms.</p>
            </div>
          )}

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-16">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="w-10 h-10 rounded-full border border-border-subtle flex items-center justify-center text-secondary/60 hover:border-brand hover:text-brand disabled:opacity-30 transition-all"
              >
                &#8249;
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={cn(
                    "w-10 h-10 rounded-full text-[11px] font-black transition-all",
                    currentPage === page
                      ? "bg-brand text-white shadow-lg shadow-brand/20"
                      : "border border-border-subtle text-secondary/60 hover:border-brand hover:text-brand"
                  )}
                >
                  {page}
                </button>
              ))}
              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="w-10 h-10 rounded-full border border-border-subtle flex items-center justify-center text-secondary/60 hover:border-brand hover:text-brand disabled:opacity-30 transition-all"
              >
                &#8250;
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

function BlogPostCard({ post, index }: { post: BlogPost; index: number }) {
  const formattedDate = post.published_at
    ? new Date(post.published_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
    : "";

  return (
    <Link href={`/blog/${post.slug || post.id}`} className="flex flex-col h-full">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1 }}
        className="group flex flex-col h-full bg-surface border border-border-subtle rounded-[2.5rem] overflow-hidden hover:border-brand/30 hover:shadow-2xl hover:shadow-brand/8 transition-all duration-500 cursor-pointer"
      >
        {/* Image */}
        <div className="relative h-52 overflow-hidden">
          <img
            src={post.image_url}
            alt={post.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          />
          {/* Dark-to-transparent gradient so badge is always readable */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
          <div className="absolute top-5 left-5">
            <Badge className="bg-brand text-white border-none px-4 py-1.5 text-[10px] font-bold uppercase tracking-widest rounded-full shadow-lg shadow-brand/30">
              {post.category}
            </Badge>
          </div>
        </div>

        {/* Content */}
        <div className="p-7 flex flex-col flex-1">
          <div className="flex items-center gap-4 mb-3 text-[10px] font-semibold uppercase tracking-widest text-secondary/40">
            <span className="flex items-center gap-1.5"><Calendar className="w-3 h-3" />{formattedDate}</span>
            <span className="flex items-center gap-1.5"><Clock className="w-3 h-3" />5 min read</span>
          </div>

          <h3 className="text-lg font-bold text-primary mb-3 leading-snug group-hover:text-brand transition-colors duration-300">
            {post.title}
          </h3>
          <p className="text-secondary/60 text-sm leading-relaxed mb-6 line-clamp-2">
            {post.excerpt}
          </p>

          <div className="mt-auto flex items-center justify-between">
            <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-brand group-hover:gap-3 transition-all duration-200">
              Read Article <ArrowRight className="w-3.5 h-3.5" />
            </span>
            <span className="flex items-center gap-1.5 text-[10px] font-semibold text-secondary/30">
              <User className="w-3 h-3" /> Digi Pexel
            </span>
          </div>
        </div>

        {/* Brand accent line — grows on hover */}
        <div className="h-[3px] w-0 group-hover:w-full bg-gradient-to-r from-brand via-brand/80 to-accent transition-all duration-500 ease-out" />
      </motion.div>
    </Link>
  );
}
