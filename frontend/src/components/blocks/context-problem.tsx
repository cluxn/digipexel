"use client";

import React from "react";
import { motion } from "motion/react";
import { Badge } from "@/components/ui/badge";
import {
  BrainCircuit,
  Layers,
  RefreshCw,
  Search,
  Slack,
  Mail,
  Github,
  Database,
  BarChart2,
  Calendar,
  X,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";

const TOOLS = [
  { icon: Slack,     label: "Slack",     color: "text-purple-500" },
  { icon: Mail,      label: "Email",     color: "text-blue-500"   },
  { icon: Github,    label: "GitHub",    color: "text-slate-500"  },
  { icon: Database,  label: "CRM",       color: "text-emerald-500"},
  { icon: BarChart2, label: "Analytics", color: "text-orange-500" },
  { icon: Calendar,  label: "Calendar",  color: "text-rose-500"   },
];

const PAIN_POINTS = [
  "Manual data re-entry across every tool",
  "Context lost at every team handoff",
  "No single source of truth",
  "Delayed follow-ups & missed responses",
];

const OUTCOMES = [
  "Zero-touch data sync across all tools",
  "Full context passed automatically",
  "One AI-ready unified workflow",
  "Instant action triggered on every event",
];

export function ContextProblem() {
  return (
    <section className="w-full py-32 bg-base relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-brand/[0.04] blur-[140px] rounded-full pointer-events-none" />

      <div className="container mx-auto px-6 max-w-7xl relative z-10">

        {/* ── Header ── */}
        <div className="flex flex-col items-center text-center mb-16">
          <Badge variant="outline" className="section-eyebrow mb-6">
            The Automation Gap
          </Badge>
          <h2 className="section-title max-w-3xl leading-[1.1] mb-5">
            Your tools are siloed{" "}
            <span className="section-title-accent">Your team pays the price</span>
          </h2>
          <p className="section-subtitle max-w-xl opacity-60">
            Every manual handoff costs time, context, and revenue. We bridge every gap with AI that connects your entire stack and acts 24/7.
          </p>
        </div>

        {/* ── Before / After comparison ── */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_72px_1fr] items-center gap-4 mb-12">
          <BeforePanel />

          {/* Arrow divider */}
          <div className="flex items-center justify-center">
            <div className="flex flex-col items-center gap-2">
              <div className="hidden lg:block w-px h-16 bg-gradient-to-b from-transparent via-slate-200 to-transparent" />
              <div className="w-11 h-11 rounded-full bg-brand flex items-center justify-center shadow-xl shadow-brand/25">
                <ArrowRight className="w-5 h-5 text-white" />
              </div>
              <span className="hidden lg:block text-[8px] font-black uppercase tracking-widest text-brand/50 whitespace-nowrap">
                Digi Pexel AI
              </span>
              <div className="hidden lg:block w-px h-16 bg-gradient-to-b from-transparent via-slate-200 to-transparent" />
            </div>
          </div>

          <AfterPanel />
        </div>

        {/* ── Bottom stat cards ── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <StatCard
            icon={<RefreshCw className="w-5 h-5" />}
            stat="14 hrs"
            detail="lost per team / week"
            title="Handoff Friction"
            body="Every tool switch and status update burns hours that should go toward delivering real outcomes."
            index={0}
          />
          <StatCard
            icon={<Layers className="w-5 h-5" />}
            stat="6+ tools"
            detail="disconnected on average"
            title="Siloed Systems"
            body="Fragmented data means your AI can't see the full picture — so the right action never gets triggered."
            index={1}
          />
          <StatCard
            icon={<Search className="w-5 h-5" />}
            stat="40%"
            detail="of all work is rework"
            title="Manual Rework"
            body="Teams spend nearly half their time re-entering, reformatting, or chasing down information."
            index={2}
          />
        </div>

      </div>
    </section>
  );
}

// ── Before Panel ─────────────────────────────────────────────────────────────
function BeforePanel() {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.55 }}
      className="rounded-3xl border border-rose-100 bg-gradient-to-br from-rose-50/70 via-white to-white p-7 flex flex-col gap-6 h-full"
    >
      {/* Header row */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-rose-400" />
          <span className="text-[10px] font-black uppercase tracking-widest text-rose-500">
            Without Automation
          </span>
        </div>
        <span className="text-[10px] font-bold text-rose-400 bg-rose-50 border border-rose-100 px-3 py-1 rounded-full">
          Disconnected
        </span>
      </div>

      {/* Tool grid — each has a broken ✗ badge */}
      <div className="grid grid-cols-3 gap-3">
        {TOOLS.map((Tool) => (
          <div key={Tool.label} className="flex flex-col items-center gap-1.5">
            <div className="relative w-12 h-12 rounded-2xl bg-white border border-rose-100 flex items-center justify-center shadow-sm">
              <Tool.icon className={`w-5 h-5 ${Tool.color} opacity-50`} strokeWidth={1.5} />
              <div className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-rose-100 border border-rose-200 flex items-center justify-center">
                <X className="w-2.5 h-2.5 text-rose-400" />
              </div>
            </div>
            <span className="text-[8px] font-bold text-slate-400 uppercase tracking-wide">
              {Tool.label}
            </span>
          </div>
        ))}
      </div>

      {/* Pain points */}
      <div className="space-y-2.5 border-t border-rose-100 pt-5">
        {PAIN_POINTS.map((pain, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -8 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08 + 0.3 }}
            className="flex items-start gap-2.5"
          >
            <X className="w-3.5 h-3.5 text-rose-400 mt-0.5 flex-shrink-0" />
            <span className="text-xs font-medium text-rose-600/70 leading-snug">{pain}</span>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

// ── After Panel ──────────────────────────────────────────────────────────────
function AfterPanel() {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.55, delay: 0.15 }}
      className="rounded-3xl border border-brand/15 bg-gradient-to-bl from-brand/5 via-white to-white p-7 flex flex-col gap-6 h-full"
    >
      {/* Header row */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-brand animate-pulse" />
          <span className="text-[10px] font-black uppercase tracking-widest text-brand">
            With Digi Pexel
          </span>
        </div>
        <span className="text-[10px] font-bold text-brand bg-brand/8 border border-brand/10 px-3 py-1 rounded-full">
          AI-Connected
        </span>
      </div>

      {/* Hub-and-spoke: [left 3 tools] ──── [AI brain] ──── [right 3 tools] */}
      <div className="flex items-center gap-3">

        {/* Left tools */}
        <div className="flex flex-col gap-3 flex-1 min-w-0">
          {TOOLS.slice(0, 3).map((Tool) => (
            <div key={Tool.label} className="flex items-center gap-2 min-w-0">
              <div className="w-10 h-10 rounded-xl bg-white border border-brand/15 flex items-center justify-center shadow-sm flex-shrink-0">
                <Tool.icon className={`w-4 h-4 ${Tool.color}`} strokeWidth={1.5} />
              </div>
              <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wide truncate">
                {Tool.label}
              </span>
              <div className="flex-1 h-px bg-gradient-to-r from-slate-200 to-brand/50 min-w-0" />
            </div>
          ))}
        </div>

        {/* AI Hub */}
        <div className="relative flex-shrink-0">
          <div className="absolute inset-0 bg-brand/20 blur-xl rounded-full" />
          <div className="relative w-14 h-14 rounded-[18px] bg-white border-2 border-brand/25 flex items-center justify-center shadow-xl shadow-brand/15 z-10">
            <BrainCircuit className="w-7 h-7 text-brand" />
          </div>
        </div>

        {/* Right tools */}
        <div className="flex flex-col gap-3 flex-1 min-w-0">
          {TOOLS.slice(3).map((Tool) => (
            <div key={Tool.label} className="flex items-center gap-2 min-w-0">
              <div className="flex-1 h-px bg-gradient-to-l from-slate-200 to-brand/50 min-w-0" />
              <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wide truncate">
                {Tool.label}
              </span>
              <div className="w-10 h-10 rounded-xl bg-white border border-brand/15 flex items-center justify-center shadow-sm flex-shrink-0">
                <Tool.icon className={`w-4 h-4 ${Tool.color}`} strokeWidth={1.5} />
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Outcomes */}
      <div className="space-y-2.5 border-t border-brand/10 pt-5">
        {OUTCOMES.map((outcome, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: 8 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08 + 0.3 }}
            className="flex items-start gap-2.5"
          >
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 mt-0.5 flex-shrink-0" />
            <span className="text-xs font-medium text-emerald-700/70 leading-snug">{outcome}</span>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

// ── Stat Card ─────────────────────────────────────────────────────────────────
function StatCard({
  icon, stat, detail, title, body, index,
}: {
  icon: React.ReactNode;
  stat: string;
  detail: string;
  title: string;
  body: string;
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.12 }}
      className="rounded-3xl border border-border-subtle/60 bg-surface/40 p-7 flex flex-col gap-4 hover:border-brand/20 hover:bg-surface/70 transition-all duration-300 group"
    >
      <div className="w-10 h-10 rounded-xl bg-brand/10 flex items-center justify-center text-brand group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <div>
        <div className="text-3xl font-black text-primary tracking-tight">{stat}</div>
        <div className="text-[10px] font-bold uppercase tracking-widest text-brand/60 mt-0.5">{detail}</div>
      </div>
      <div>
        <h3 className="text-sm font-bold text-primary mb-1.5">{title}</h3>
        <p className="text-xs text-secondary/60 leading-relaxed">{body}</p>
      </div>
    </motion.div>
  );
}
