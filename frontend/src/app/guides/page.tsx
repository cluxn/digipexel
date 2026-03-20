"use client";

import React, { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/blocks/floating-icons-hero-demo";
import { Footer } from "@/components/ui/footer-section";
import { Connect } from "@/components/blocks/connect-cta";
import { motion } from "framer-motion";
import { BookOpen, ArrowRight, Download, Search } from "lucide-react";
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
}

export default function GuidesPage() {
  const [guides, setGuides] = useState<Guide[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    async function fetchGuides() {
      try {
        const res = await api.get(endpoints.guides);
        if (res.status === "success" && res.data) {
          setGuides(res.data);
        }
      } catch (err) {
        console.error("Failed to fetch guides", err);
      } finally {
        setLoading(false);
      }
    }
    fetchGuides();
  }, []);

  const filteredGuides = guides.filter(g => 
    g.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    g.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <main className="min-h-screen bg-base">
      <Navbar className="top-0" darkHero={false} />
      
      {/* Hero Section - Standardized for Single Screen Fit */}
      <section className="relative min-h-[85vh] flex items-center pt-32 pb-12 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(37,99,235,0.05),transparent_50%)]" />
        <div className="container mx-auto px-6 max-w-6xl relative z-10 text-center">
          <Badge variant="outline" className="section-eyebrow mb-6 mx-auto">
            Resources & Guides
          </Badge>
          <h1 className="hero-title mb-6 leading-[1.05]">
            Master the <span className="hero-title-accent">Automation Era</span><br /> 
            with Our Playbooks
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

      {/* Guides Grid */}
      <section className="pb-40">
        <div className="container mx-auto px-6 max-w-6xl">
          {loading ? (
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
               {[1, 2, 3].map(i => (
                 <div key={i} className="h-[450px] rounded-[2.5rem] bg-surface/50 animate-pulse border border-border-subtle" />
               ))}
             </div>
          ) : filteredGuides.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredGuides.map((guide, idx) => (
                <GuideCard key={guide.id} guide={guide} index={idx} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-surface border border-border-subtle mb-6">
                 <Search className="w-8 h-8 text-secondary/40" />
              </div>
              <h3 className="text-xl font-bold text-primary">No guides found</h3>
              <p className="text-secondary/60 mt-2">Try adjusting your search terms.</p>
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
          <a 
            href={guide.cta_link} 
            className="flex items-center justify-between group/link"
          >
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-primary group-hover/link:text-brand transition-colors">
              {guide.cta_label}
            </span>
            <div className="w-10 h-10 rounded-full border border-border-subtle flex items-center justify-center group-hover/link:bg-brand group-hover/link:border-brand group-hover/link:text-white transition-all duration-300">
              <Download className="w-4 h-4" />
            </div>
          </a>
        </div>
      </div>
    </motion.div>
  );
}
