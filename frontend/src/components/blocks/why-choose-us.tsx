"use client";

import React from "react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Check, X, Zap, Target, Users, BarChart3 } from "lucide-react";
import { cn } from "@/lib/utils";

const comparisonCards = [
  {
    title: "The AI Gap",
    type: "pain",
    items: [
      "87% of AI projects never make it past pilot - yours might be one of them",
      "Your team is drowning in tool demos but shipping nothing to production",
      "Consultants hand you a strategy PDF and disappear before anything gets built",
      "No one has mapped AI to your actual P&L, unit economics, or growth levers"
    ],
    bgColor: "bg-red-500/5",
    borderColor: "border-red-500/10",
    iconColor: "text-red-500/60",
    dotColor: "bg-red-500/40"
  },
  {
    title: "The Digi Pexel Way",
    type: "solution",
    items: [
      "Proprietary 8-phase audit starts with your business model, not the tech",
      "We don't just recommend - we build, deploy, train your team, and stay",
      "Every engagement is tied to ROI metrics you already track and care about",
      "From C-suite strategy to hands-on implementation, one team end to end"
    ],
    bgColor: "bg-emerald-500/5",
    borderColor: "border-emerald-500/10",
    iconColor: "text-emerald-500/60",
    dotColor: "bg-emerald-500/40"
  }
];

const pillars = [
  { label: "AI Strategy & Roadmap", icon: Zap },
  { label: "End-to-End Implementation", icon: Target },
  { label: "ROI-Driven Results", icon: BarChart3 },
  { label: "Team Training & Enablement", icon: Users }
];

export function WhyChooseUs() {
  return (
    <section className="py-40 bg-base relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-brand/5 blur-[150px] rounded-full -translate-y-1/2" />

      <div className="container mx-auto px-8 max-w-7xl relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-start">
          
          {/* Left Column: Heading & Pillars */}
          <div className="space-y-12">
            <div>
              <Badge variant="outline" className="section-eyebrow mb-6">
                Philosophy
              </Badge>
              <h2 className="section-title leading-[1.1] mb-6">
                Your competitors are experimenting with AI.{" "}
                <span className="section-title-accent">You should be deploying it.</span>
              </h2>
              <p className="section-subtitle max-w-xl opacity-60">
                Digi Pexel gives B2B companies a strategic AI audit, implementation plan, and the team to execute - so you skip the pilot graveyard and ship systems that actually move the needle.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {pillars.map((pillar, idx) => (
                <div 
                  key={idx}
                  className="flex items-center gap-4 p-5 rounded-2xl bg-surface/30 border border-border-subtle group hover:border-brand/30 hover:bg-surface/50 transition-all duration-300"
                >
                  <div className="w-10 h-10 rounded-xl bg-brand/5 border border-brand/10 flex items-center justify-center text-brand group-hover:scale-110 transition-transform">
                    <pillar.icon className="w-5 h-5" />
                  </div>
                  <span className="font-bold text-sm tracking-tight text-primary/80">{pillar.label}</span>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap items-center gap-8 pt-6">
              <Button
                variant="brand"
                className="px-8 py-4 h-auto text-base font-semibold"
              >
                Book Your Strategy Call
              </Button>
              <span className="text-xs font-bold text-secondary/40 uppercase tracking-widest flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-500" />
                Trusted by 50+ Enterprise Brands
              </span>
            </div>
          </div>

          {/* Right Column: Comparison Cards */}
          <div className="grid grid-cols-1 gap-8">
            <h3 className="text-center text-sm font-bold uppercase tracking-[0.3em] text-secondary/30 mb-2">The gap between AI hype and results</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-6">
              {comparisonCards.map((card, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className={cn(
                    "p-8 rounded-[2.5rem] border-2 flex flex-col h-full shadow-2xl relative overflow-hidden",
                    card.bgColor,
                    card.borderColor
                  )}
                >
                  <div className="flex items-center gap-3 mb-8">
                    <div className={cn("w-2 h-2 rounded-full", card.dotColor)} />
                    <h4 className="text-xl font-bold tracking-tight text-primary">{card.title}</h4>
                  </div>
                  
                  <ul className="space-y-6 flex-grow">
                    {card.items.map((item, i) => (
                      <li key={i} className="flex gap-4">
                        <div className="mt-1 flex-shrink-0">
                          {card.type === "pain" ? (
                            <X className="w-4 h-4 text-red-500/50" />
                          ) : (
                            <Check className="w-4 h-4 text-emerald-500/50" />
                          )}
                        </div>
                        <span className="text-sm font-medium leading-relaxed text-secondary/80 italic">
                          {item}
                        </span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}


