"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";

const stats = [
  {
    label: "FASTER SHIPPING",
    value: "42%",
    description: "Automation eliminates handoffs and approvals so teams ship at the speed of AI.",
  },
  {
    label: "LOWER OPS COST",
    value: "28%",
    description: "Saved on run-rate by removing manual steps, rework, and duplicate tooling.",
  },
  {
    label: "HOURS RECOVERED",
    value: "12k+",
    description: "Returned to teams by automating data movement, follow-ups, and reporting.",
  },
  {
    label: "TIME TO DEPLOY",
    value: "4-6 wks",
    description: "From discovery to production workflows with full monitoring and governance.",
  },
];

export function AgencyStats() {
  return (
    <section className="w-full py-24 md:py-32 bg-base relative overflow-hidden">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header Block */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-10 mb-20">
          <div className="max-w-3xl">
            <Badge variant="outline" className="section-eyebrow mb-6">
              Proven Results
            </Badge>
            <h2 className="section-title leading-[1.1] mb-6">
              It&apos;s like adding an<br /><span className="section-title-accent">automation team</span> overnight
            </h2>
            <p className="section-subtitle max-w-2xl">
              Digi Pexel designs AI systems that eliminate bottlenecks, reduce manual work, and keep performance visible.
            </p>
          </div>
          <Button
            className="px-10 py-6 h-auto text-base font-semibold"
            variant="brand"
          >
            Start an Audit
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 border border-border-subtle rounded-[2.5rem] bg-surface overflow-hidden divide-y md:divide-y-0 md:divide-x divide-border-subtle shadow-2xl shadow-brand/5">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="p-10 flex flex-col h-full group hover:bg-slate-50/50 transition-colors"
            >
              <span className="text-[11px] font-bold uppercase tracking-[0.3em] text-brand/60 mb-6 drop-shadow-sm">
                {stat.label}
              </span>
              <div className="text-5xl font-display font-bold text-primary tracking-tighter mb-10 group-hover:scale-105 transition-transform origin-left">
                {stat.value}
              </div>
              <div className="mt-auto">
                <p className="text-sm text-secondary leading-relaxed opacity-60 group-hover:opacity-100 transition-opacity">
                  {stat.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Footnote */}
        <div className="mt-12 flex items-center justify-start gap-4 text-[11px] text-secondary opacity-40 font-bold uppercase tracking-widest">
          <span>*from Digi Pexel automation delivery summaries</span>
        </div>
      </div>
    </section>
  );
}
