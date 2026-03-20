"use client";

import React, { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/blocks/floating-icons-hero-demo";
import { Footer } from "@/components/ui/footer-section";
import { Connect } from "@/components/blocks/connect-cta";
import { motion } from "framer-motion";
import { Search, Calendar, User, ArrowRight } from "lucide-react";
import Link from "next/link";
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
}

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  useEffect(() => {
    async function fetchPosts() {
      try {
        const res = await api.get(endpoints.blogs);
        if (res.status === "success" && res.data) {
          setPosts(res.data);
        }
      } catch (err) {
        console.error("Failed to fetch blog posts", err);
        // Fallback dummy data
        setPosts([
          {
            id: 1,
            title: "The Future of AI in Modern Business",
            excerpt: "Explore how artificial intelligence is reshaping industries and what it means for your company's future.",
            image_url: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&q=80&w=800",
            category: "Technology",
            published_at: "2024-03-15",
            slug: "future-of-ai-business"
          },
          {
             id: 2,
             title: "Scaling Operations with Smart Automation",
             excerpt: "Practical tips for integrating automation into your daily workflows without losing the human touch.",
             image_url: "https://images.unsplash.com/photo-1518186285589-2f7649de83e0?auto=format&fit=crop&q=80&w=800",
             category: "Operations",
             published_at: "2024-03-10",
             slug: "scaling-operations-automation"
          }
        ]);
      } finally {
        setLoading(false);
      }
    }
    fetchPosts();
  }, []);

  const categories = ["All", ...Array.from(new Set(posts.map(p => p.category)))];

  const filteredPosts = posts.filter(p => {
    const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "All" || p.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <main className="min-h-screen bg-base">
      <Navbar className="top-0" darkHero={false} />
      
      {/* Hero Section */}
      <section className="relative min-h-[70vh] flex items-center pt-32 pb-12 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(37,99,235,0.05),transparent_50%)]" />
        <div className="container mx-auto px-6 max-w-6xl relative z-10 text-center">
          <Badge variant="outline" className="section-eyebrow mb-6 mx-auto">
            Insights & Perspectives
          </Badge>
          <h1 className="hero-title mb-6 leading-[1.05]">
            The <span className="hero-title-accent">Digi Pexel</span> Journal
          </h1>
          <p className="section-subtitle max-w-2xl mx-auto mb-10 opacity-70 text-balance">
            Deep dives into the intersection of technology, human creativity, and the autonomous future.
          </p>
          
          <div className="max-w-xl mx-auto flex flex-col md:flex-row gap-4">
            <div className="relative flex-1 group">
              <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none text-secondary/40 group-focus-within:text-brand transition-colors">
                <Search className="w-5 h-5" />
              </div>
              <input 
                type="text" 
                placeholder="Search articles..."
                className="w-full h-14 bg-surface border border-border-subtle rounded-2xl pl-14 pr-6 text-sm focus:outline-none focus:ring-4 focus:ring-brand/5 focus:border-brand/30 transition-all shadow-xl shadow-black/5"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
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

          {loading ? (
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
               {[1, 2, 3].map(i => (
                 <div key={i} className="h-96 rounded-[2.5rem] bg-surface/50 animate-pulse border border-border-subtle" />
               ))}
             </div>
          ) : filteredPosts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredPosts.map((post, idx) => (
                <BlogPostCard key={post.id} post={post} index={idx} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-surface/50 rounded-[3rem] border border-dashed border-border-subtle">
              <h3 className="text-xl font-bold text-primary">No stories match your search</h3>
              <p className="text-secondary/60 mt-2">Try adjusting your filters or search terms.</p>
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
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="group flex flex-col h-full bg-surface border border-border-subtle rounded-[2.5rem] overflow-hidden hover:border-brand/30 hover:shadow-2xl hover:shadow-brand/5 transition-all duration-500"
    >
      <div className="relative h-64 overflow-hidden">
        <img 
          src={post.image_url} 
          alt={post.title} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
        />
        <div className="absolute top-6 left-6">
          <Badge className="bg-brand/90 backdrop-blur text-white border-none px-4 py-1.5 text-[10px] font-bold uppercase tracking-widest rounded-full">
            {post.category}
          </Badge>
        </div>
      </div>
      
      <div className="p-8 flex flex-col flex-1">
        <div className="flex items-center gap-4 mb-4 text-[10px] font-black uppercase tracking-[0.1em] text-secondary/40">
           <span className="flex items-center gap-1.5"><Calendar className="w-3 h-3" /> {post.published_at}</span>
           <span className="flex items-center gap-1.5"><User className="w-3 h-3" /> Digi Pexel Team</span>
        </div>
        <h3 className="text-xl font-bold text-primary mb-4 leading-tight group-hover:text-brand transition-colors">
          {post.title}
        </h3>
        <p className="text-secondary/70 text-sm leading-relaxed mb-8 line-clamp-3">
          {post.excerpt}
        </p>
        
        <div className="mt-auto">
          <Link 
            href={`/blog/${post.slug || post.id}`} 
            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-primary group-hover:text-brand transition-all"
          >
            Read Full Story <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
