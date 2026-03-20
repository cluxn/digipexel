"use client";

import React from "react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export function ContactUs() {
  return (
    <section className="py-40 bg-base relative overflow-hidden">
      <div className="container mx-auto px-8 max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-32 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="space-y-10"
          >
            <div className="space-y-6 text-center lg:text-left">
              <Badge variant="outline" className="section-eyebrow">
                Enterprise Intake
              </Badge>
              <h2 className="section-title leading-tight">
                Secure Your <span className="section-title-accent">Automation</span> Roadmap
              </h2>
              <p className="text-secondary text-lg opacity-70 max-w-lg mx-auto lg:mx-0">
                Submit your project parameters and our architecture team will provide a feasibility audit within 24 hours.
              </p>
            </div>
          </motion.div>

          {/* Right Graphic/Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 0.9 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="relative"
          >
            {/* Decorative Background Glows */}
            <div className="absolute -top-32 -right-32 w-96 h-96 bg-brand/5 blur-[120px] rounded-full -z-10" />
            
            <div className="relative rounded-[3rem] border border-border-subtle bg-surface/20 backdrop-blur-md p-3 shadow-xl overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-brand/5 via-transparent to-transparent pointer-events-none" />
              
              <div className="relative rounded-[2.5rem] overflow-hidden border border-border-subtle/30 bg-base shadow-inner">
                {/* Simulated Dashboard UI */}
                <div className="p-8 space-y-8">
                  <div className="flex items-center justify-between border-b border-border-subtle pb-4">
                    <div className="flex gap-2">
                       <div className="w-3 h-3 rounded-full bg-rose-500/50" />
                       <div className="w-3 h-3 rounded-full bg-amber-500/50" />
                       <div className="w-3 h-3 rounded-full bg-emerald-500/50" />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-secondary/50">Performance Dashboard</span>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="h-4 w-1/3 bg-brand/20 rounded-full" />
                    <div className="h-48 w-full bg-gradient-to-t from-brand/5 to-transparent rounded-xl relative flex items-end px-4 gap-2">
                      {/* Simulated Chart Bars */}
                      {[40, 70, 45, 90, 65, 80, 55, 95, 75, 85].map((h, i) => (
                        <motion.div 
                          key={i}
                          initial={{ height: 0 }}
                          whileInView={{ height: `${h}%` }}
                          transition={{ delay: 0.5 + (i * 0.1), duration: 1 }}
                          className="flex-1 bg-brand/40 rounded-t-md" 
                        />
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 rounded-xl border border-border-subtle bg-surface/50">
                      <p className="text-[10px] uppercase tracking-widest text-secondary mb-1">AI Citations</p>
                      <p className="text-xl font-bold text-primary">+127%</p>
                    </div>
                    <div className="p-4 rounded-xl border border-border-subtle bg-surface/50">
                      <p className="text-[10px] uppercase tracking-widest text-secondary mb-1">Search Pipeline</p>
                      <p className="text-xl font-bold text-primary">$1.4M</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
