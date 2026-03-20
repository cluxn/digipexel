"use client";

import React, { useState } from "react";
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Sparkles, Megaphone, Workflow, Briefcase, ChevronRight, Cpu, Search, Youtube, Instagram, Linkedin, Database, Layers, Calculator, UserPlus, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

const categories = [
  { id: "strategic", label: "Strategic AI", icon: Sparkles },
  { id: "social", label: "Social Growth", icon: Megaphone },
  { id: "workflow", label: "Automations", icon: Workflow },
  { id: "operations", label: "Operations", icon: Briefcase },
];

const allServices = {
  strategic: [
    {
      title: "Custom AI Solutions",
      description: "Bespoke AI implementations tailored to your unique business logic and data structure.",
      color: "from-blue-500/20 to-cyan-500/20",
      icon: Cpu,
      href: "/services/custom-ai-solutions",
    },
    {
      title: "AI SEO Services",
      description: "Generative Engine Optimization (GEO) to ensure your brand is the primary citation for AI models.",
      color: "from-purple-500/20 to-pink-500/20",
      icon: Search,
      href: "/services/ai-seo",
    },
  ],
  social: [
    { title: "YouTube Automation", description: "End-to-end video pipeline automation from script to upload.", color: "from-red-500/20 to-orange-500/20", icon: Youtube, href: "/services/youtube-automation" },
    { title: "Instagram Automation", description: "Intelligent engagement and content scheduling powered by vision AI.", color: "from-pink-500/20 to-rose-500/20", icon: Instagram, href: "/services/instagram-automation" },
    { title: "LinkedIn Automation", description: "Authority building and lead gen through automated expert-level networking.", color: "from-blue-600/20 to-indigo-600/20", icon: Linkedin, href: "/services/linkedin-automation" },
  ],
  workflow: [
    { title: "Automation Flows", description: "Seamless data movements between your existing tech stack.", color: "from-emerald-500/20 to-teal-500/20", icon: Database, href: "/services/automation-flows" },
    { title: "AI Workflows", description: "Complex decision-making chains that operate autonomously 24/7.", color: "from-cyan-500/20 to-blue-500/20", icon: Workflow, href: "/services/ai-workflows" },
    { title: "Workflow Creation", description: "Professional architecture of high-reliability business systems.", color: "from-violet-500/20 to-purple-500/20", icon: Layers, href: "/services/workflow-creation" },
  ],
  operations: [
    { title: "Accounting & Bookkeeping", description: "Zero-touch financial tracking and automated reconciliation.", color: "from-slate-500/20 to-zinc-500/20", icon: Calculator, href: "/services/accounting-bookkeeping" },
    { title: "Hiring & Recruitment", description: "AI-powered candidate sourcing, screening, and outreach at scale.", color: "from-indigo-500/20 to-blue-500/20", icon: UserPlus, href: "/services/hiring-recruitment" },
    { title: "Sales Automation", description: "Predictive lead scoring and automated high-conversion follow-ups.", color: "from-orange-500/20 to-amber-500/20", icon: TrendingUp, href: "/services/sales-automation" },
  ],
};

export function Services() {
  const [activeTab, setActiveTab] = useState("strategic");

  return (
    <section className="py-20 bg-base relative overflow-hidden">
      {/* Background Decorative Element */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full pointer-events-none opacity-20">
        <div className="absolute top-0 left-1/4 w-[800px] h-[800px] bg-brand/5 blur-[120px] rounded-full" />
      </div>

      <div className="container mx-auto px-8 max-w-7xl relative z-10">
        <div className="flex flex-col items-center text-center mb-10">
          <Badge variant="outline" className="section-eyebrow mb-4 px-6">
            Our Ecosystem
          </Badge>
          <h2 className="section-title mb-4">
            AI Automation<br /><span className="section-title-accent">Services</span>
          </h2>
          <p className="section-subtitle max-w-2xl opacity-60">
            We build AI systems that connect your stack, reduce handoffs, and deliver measurable outcomes.
          </p>
        </div>

        {/* Category Switcher */}
        <div className="flex flex-wrap justify-center gap-3 mb-8">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveTab(cat.id)}
              className={cn(
                "flex items-center gap-2 h-10 px-6 rounded-full border transition-all duration-300 font-bold tracking-tight text-sm",
                activeTab === cat.id
                  ? "bg-brand/10 border-brand/30 text-brand shadow-lg shadow-brand/5"
                  : "bg-surface/50 border-border-subtle text-secondary hover:bg-surface hover:text-primary"
              )}
            >
              <cat.icon className="w-4 h-4" />
              {cat.label}
            </button>
          ))}
        </div>

        {/* Services Grid */}
        <div className="min-h-[300px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {(allServices as any)[activeTab].map((service: any, idx: number) => (
                <ServiceCard key={idx} service={service} index={idx} />
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}

function ServiceCard({ service, index }: { service: any; index: number }) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x);
  const mouseYSpring = useSpring(y);

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["10deg", "-10deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-10deg", "10deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.1 }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
      }}
      className="group relative h-full rounded-[2rem] border border-border-subtle bg-surface/20 backdrop-blur-md overflow-hidden hover:border-brand/30 transition-shadow duration-500 hover:shadow-[0_20px_50px_-12px_rgba(37,99,235,0.2)]"
    >
      <Link href={service.href || "#"} className="flex flex-col h-full p-6 cursor-pointer">
        {/* 3D Inner Content */}
        <div style={{ transform: "translateZ(50px)" }} className="relative z-10 flex flex-col h-full">
          {/* Icon Tile */}
          <div className="relative mb-6 flex items-center justify-start">
            <div className="relative w-14 h-14 rotate-[6deg] transition-transform duration-700 group-hover:scale-110 group-hover:rotate-[12deg]">
              {/* Outer ambient glow */}
              <div className={cn("absolute -inset-3 rounded-2xl bg-gradient-to-br blur-xl opacity-50 group-hover:opacity-80 transition-opacity", service.color)} />
              {/* Main gradient tile */}
              <div className={cn("absolute inset-0 rounded-2xl bg-gradient-to-br border border-white/15", service.color)} />
              {/* Subtle glass sheen */}
              <div className="absolute inset-0 rounded-2xl bg-white/5 backdrop-blur-sm border-t border-white/20" />
              {/* Icon centered */}
              <div className="absolute inset-0 flex items-center justify-center">
                <service.icon className="text-brand w-6 h-6 drop-shadow-sm" />
              </div>
            </div>
          </div>

          <h3 className="text-lg font-bold text-primary mb-2 tracking-tight">
            {service.title}
          </h3>
          <p className="text-secondary text-sm leading-relaxed mb-4 opacity-60 font-medium">
            {service.description}
          </p>

          <div className="mt-auto pt-4 border-t border-border-subtle/30 flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-widest text-brand/60 group-hover:text-brand transition-colors">
              Learn More
            </span>
            <div className="w-10 h-10 rounded-full border border-border-subtle flex items-center justify-center group-hover:bg-brand group-hover:border-brand group-hover:text-white transition-all duration-300">
              <ArrowRight className="w-4 h-4" />
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
