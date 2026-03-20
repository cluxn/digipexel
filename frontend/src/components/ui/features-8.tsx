"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Sparkles, Zap, Lock, Cpu, Check, ArrowRight, Activity } from 'lucide-react';
import { cn } from '@/lib/utils';

// ── Card 1: Autonomous — animated task runner ─────────────────────────────────
function AutonomousCard() {
  const tasks = [
    { label: "Lead enrichment",   done: true  },
    { label: "CRM sync",          done: true  },
    { label: "Email sequence",    done: false },
    { label: "Slack notification",done: false },
  ];
  const [step, setStep] = useState(2);

  useEffect(() => {
    const t = setInterval(() => {
      setStep(s => (s >= tasks.length ? 0 : s + 1));
    }, 1200);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="relative col-span-full flex flex-col overflow-hidden lg:col-span-2 border border-border-subtle bg-surface rounded-3xl shadow-xl shadow-brand/5 group hover:border-brand/30 hover:shadow-2xl hover:shadow-brand/10 transition-all duration-500">
      {/* Hover glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-brand/0 via-brand/0 to-brand/0 group-hover:from-brand/3 group-hover:to-accent/3 transition-all duration-700 rounded-3xl pointer-events-none" />

      <div className="relative p-8 flex flex-col items-center pt-10 pb-10">
        {/* Big metric */}
        <div className="relative flex h-24 w-56 items-center justify-center mb-2">
          <svg className="text-brand/8 absolute inset-0 size-full group-hover:text-brand/15 transition-colors duration-500" viewBox="0 0 254 104" fill="none">
            <path d="M112.891 97.7022C140.366 97.0802 171.004 94.6715 201.087 87.5116C210.43 85.2881 219.615 82.6412 228.284 78.2473C232.198 76.3179 235.905 73.9942 239.348 71.3124C241.85 69.2557 243.954 66.7571 245.555 63.9408C249.34 57.3235 248.281 50.5341 242.498 45.6109C239.033 42.7237 235.228 40.2703 231.169 38.3054C219.443 32.7209 207.141 28.4382 194.482 25.534C184.013 23.1927 173.358 21.7755 162.64 21.2989C161.376 21.3512 160.113 21.181 158.908 20.796C158.034 20.399 156.857 19.1682 156.962 18.4535C157.115 17.8927 157.381 17.3689 157.743 16.9139C158.104 16.4588 158.555 16.0821 159.067 15.8066C160.14 15.4683 161.274 15.3733 162.389 15.5286C179.805 15.3566 196.626 18.8373 212.998 24.462C220.978 27.2494 228.798 30.4747 236.423 34.1232C240.476 36.1159 244.202 38.7131 247.474 41.8258C254.342 48.2578 255.745 56.9397 251.841 65.4892C249.793 69.8582 246.736 73.6777 242.921 76.6327C236.224 82.0192 228.522 85.4602 220.502 88.2924C205.017 93.7847 188.964 96.9081 172.738 99.2109C153.442 101.949 133.993 103.478 114.506 103.79C91.1468 104.161 67.9334 102.97 45.1169 97.5831C36.0094 95.5616 27.2626 92.1655 19.1771 87.5116C13.839 84.5746 9.1557 80.5802 5.41318 75.7725C-0.54238 67.7259 -1.13794 59.1763 3.25594 50.2827C5.82447 45.3918 9.29572 41.0315 13.4863 37.4319C24.2989 27.5721 37.0438 20.9681 50.5431 15.7272C68.1451 8.8849 86.4883 5.1395 105.175 2.83669C129.045 0.0992292 153.151 0.134761 177.013 2.94256C197.672 5.23215 218.04 9.01724 237.588 16.3889C240.089 17.3418 242.498 18.5197 244.933 19.6446C246.627 20.4387 247.725 21.6695 246.997 23.615C246.455 25.1105 244.814 25.5605 242.63 24.5811C230.322 18.9961 217.233 16.1904 204.117 13.4376C188.761 10.3438 173.2 8.36665 157.558 7.52174C129.914 5.70776 102.154 8.06792 75.2124 14.5228C60.6177 17.8788 46.5758 23.2977 33.5102 30.6161C26.6595 34.3329 20.4123 39.0673 14.9818 44.658C12.9433 46.8071 11.1336 49.1622 9.58207 51.6855C4.87056 59.5336 5.61172 67.2494 11.9246 73.7608C15.2064 77.0494 18.8775 79.925 22.8564 82.3236C31.6176 87.7101 41.3848 90.5291 51.3902 92.5804C70.6068 96.5773 90.0219 97.7419 112.891 97.7022Z" fill="currentColor"/>
          </svg>
          <span className="text-5xl font-black tracking-tighter text-brand">100%</span>
        </div>

        <h2 className="text-center text-3xl font-display font-bold text-primary group-hover:text-brand transition-colors duration-300">
          Autonomous by Design
        </h2>
        <p className="mt-2 text-center text-sm text-secondary px-6 opacity-60">
          AI workflows that execute routine work while humans approve exceptions.
        </p>

        {/* Animated task queue */}
        <div className="mt-6 w-full max-w-xs space-y-2">
          {tasks.map((task, i) => {
            const isActive  = i === step;
            const isDone    = i < step;
            return (
              <motion.div
                key={task.label}
                animate={{ opacity: isActive ? 1 : isDone ? 0.5 : 0.3 }}
                className={cn(
                  "flex items-center gap-3 rounded-xl px-4 py-2.5 text-xs font-semibold transition-all duration-300",
                  isDone  ? "bg-emerald-50 text-emerald-700 border border-emerald-200/60" :
                  isActive ? "bg-brand/8 text-brand border border-brand/20 shadow-sm" :
                             "bg-slate-50 text-slate-400 border border-transparent"
                )}
              >
                <span className={cn(
                  "w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0",
                  isDone   ? "bg-emerald-500" :
                  isActive ? "bg-brand animate-pulse" :
                             "bg-slate-200"
                )}>
                  {isDone && <Check className="w-2.5 h-2.5 text-white" strokeWidth={3} />}
                  {isActive && <span className="w-1.5 h-1.5 bg-white rounded-full" />}
                </span>
                {task.label}
                {isActive && (
                  <span className="ml-auto text-[9px] text-brand/60 font-bold uppercase tracking-wider animate-pulse">Running…</span>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ── Card 2: Security — shield scan animation ──────────────────────────────────
function SecurityCard() {
  const checks = [
    { label: "End-to-end encryption",   sublabel: "All data in transit & at rest" },
    { label: "Role-based access control", sublabel: "Least-privilege enforcement"   },
    { label: "Full audit logging",       sublabel: "Every action, timestamped"     },
    { label: "Zero data leakage",        sublabel: "Secrets never leave your stack" },
  ];

  return (
    <div className="relative col-span-full overflow-hidden sm:col-span-3 lg:col-span-2 border border-border-subtle bg-surface rounded-3xl shadow-xl shadow-brand/5 group hover:border-brand/30 hover:shadow-2xl hover:shadow-brand/10 transition-all duration-500">
      <div className="absolute inset-0 bg-gradient-to-br from-brand/0 to-brand/0 group-hover:from-brand/3 group-hover:to-accent/2 transition-all duration-700 rounded-3xl pointer-events-none" />

      <div className="p-8 pt-10 flex flex-col items-center">
        {/* Shield icon with pulsing rings */}
        <div className="relative w-20 h-20 flex items-center justify-center mb-5">
          <div className="absolute inset-0 rounded-full border border-brand/10 group-hover:border-brand/30 group-hover:scale-110 transition-all duration-500" />
          <div className="absolute inset-2 rounded-full border border-brand/8 group-hover:border-brand/20 group-hover:scale-105 transition-all duration-700" />
          <div className="relative flex items-center justify-center w-14 h-14 rounded-2xl border border-border-subtle bg-brand/5 group-hover:bg-brand/10 group-hover:border-brand/20 transition-all duration-400">
            <Lock className="h-7 w-7 text-brand" strokeWidth={1.5} />
          </div>
          {/* Scan line on hover */}
          <div className="absolute inset-0 overflow-hidden rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <motion.div
              className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent to-transparent"
              animate={{ top: ['10%', '90%', '10%'] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: 'linear' }}
            />
          </div>
        </div>

        <h2 className="text-xl font-display font-bold text-primary group-hover:text-brand transition-colors duration-300 mb-1">
          Security First
        </h2>
        <p className="text-xs text-secondary/50 text-center mb-4">
          Access controls, audit trails, and safe-by-default automation.
        </p>

        {/* Badge row */}
        <div className="flex gap-1.5 flex-wrap justify-center mb-6">
          {['SOC2', 'Audit Logs', 'RBAC'].map(tag => (
            <span key={tag} className="text-[9px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full bg-brand/8 text-brand border border-brand/15">
              {tag}
            </span>
          ))}
        </div>

        {/* Security checklist */}
        <div className="w-full space-y-2.5">
          {checks.map((c, i) => (
            <motion.div
              key={c.label}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1, duration: 0.4 }}
              className="flex items-center gap-3 rounded-xl px-3.5 py-2.5 bg-base border border-border-subtle group-hover:border-brand/15 transition-colors"
            >
              <span className="w-5 h-5 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center flex-shrink-0">
                <Check className="w-2.5 h-2.5 text-emerald-500" strokeWidth={3} />
              </span>
              <div className="min-w-0">
                <p className="text-[11px] font-bold text-primary leading-none mb-0.5">{c.label}</p>
                <p className="text-[10px] text-secondary/50 truncate">{c.sublabel}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Card 3: Real-Time — live signal wave + event feed ─────────────────────────
function RealTimeCard() {
  const [tick, setTick] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setTick(n => n + 1), 800);
    return () => clearInterval(t);
  }, []);

  const bars = [55, 35, 70, 45, 85, 30, 65, 80, 40, 70, 50, 90, 55, 25, 78];

  const events = [
    { trigger: "Lead captured",  action: "Email sequence started", ms: "94ms"  },
    { trigger: "Form submitted", action: "CRM record created",     ms: "112ms" },
    { trigger: "Deal closed",    action: "Slack alert sent",       ms: "78ms"  },
    { trigger: "Doc uploaded",   action: "Summary generated",      ms: "210ms" },
  ];

  const offset = tick % events.length;
  const visible = [...events, ...events].slice(offset, offset + 3);

  return (
    <div className="relative col-span-full overflow-hidden sm:col-span-3 lg:col-span-2 border border-border-subtle bg-surface rounded-3xl shadow-xl shadow-brand/5 group hover:border-brand/30 hover:shadow-2xl hover:shadow-brand/10 transition-all duration-500">
      <div className="absolute inset-0 bg-gradient-to-br from-accent/0 to-accent/0 group-hover:from-accent/3 group-hover:to-brand/3 transition-all duration-700 rounded-3xl pointer-events-none" />

      <div className="p-8 pt-10 flex flex-col">
        {/* ── Header ── */}
        <div className="flex items-start justify-between mb-5">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-8 h-8 rounded-xl bg-brand/8 border border-brand/15 flex items-center justify-center">
                <Zap className="h-4 w-4 text-brand" strokeWidth={1.5} />
              </div>
              <h2 className="text-xl font-display font-bold text-primary group-hover:text-brand transition-colors duration-300">
                Real-Time Responses
              </h2>
            </div>
            <p className="text-xs text-secondary/50 pl-10">
              Trigger-to-action in milliseconds, 24/7.
            </p>
          </div>
          {/* Live pill */}
          <div className="flex items-center gap-1.5 rounded-full bg-accent/10 border border-accent/20 px-2.5 py-1 flex-shrink-0">
            <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
            <span className="text-[9px] font-black text-accent/80 uppercase tracking-wider">Live</span>
          </div>
        </div>

        {/* ── KPI stats row ── */}
        <div className="grid grid-cols-3 gap-2 mb-5">
          {[
            { value: "120ms", label: "Avg response" },
            { value: "99.9%", label: "Uptime SLA"   },
            { value: "2.4k",  label: "Events / day" },
          ].map(stat => (
            <div key={stat.label} className="rounded-xl bg-base border border-border-subtle px-3 py-2.5 text-center">
              <p className="text-base font-black text-brand leading-none mb-0.5">{stat.value}</p>
              <p className="text-[9px] font-bold text-secondary/50 uppercase tracking-wider">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* ── Waveform panel ── */}
        <div className="relative rounded-2xl bg-slate-950 border border-white/5 px-4 pt-3 pb-4 mb-5">
          <p className="text-[8px] font-black uppercase tracking-widest text-white/30 mb-3">Response latency — last 15 events</p>
          <div className="flex items-end gap-[3px] h-12">
            {bars.map((h, i) => (
              <motion.div
                key={i}
                className="flex-1 rounded-t-sm"
                style={{
                  background: `linear-gradient(to top, var(--color-brand), var(--color-accent))`,
                  opacity: 0.5 + (h / 100) * 0.5,
                }}
                animate={{ height: `${h + (tick % 2 === 0 && i % 4 === 0 ? 12 : 0)}%` }}
                transition={{ duration: 0.4, ease: 'easeInOut' }}
              />
            ))}
          </div>
          <div className="flex justify-between mt-1.5">
            <span className="text-[8px] text-white/20">fastest</span>
            <span className="text-[8px] text-white/20">slowest</span>
          </div>
        </div>

        {/* ── Live event feed ── */}
        <div className="space-y-2 overflow-hidden">
          <AnimatePresence mode="popLayout">
            {visible.map((ev, i) => (
              <motion.div
                key={`${ev.trigger}-${(offset + i) % events.length}`}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.3 }}
                className="flex items-center gap-2.5 rounded-xl px-3.5 py-2.5 bg-base border border-border-subtle text-[11px]"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-accent flex-shrink-0" />
                <span className="text-secondary/60 truncate flex-1">
                  <span className="font-bold text-primary">{ev.trigger}</span>
                  <span className="text-secondary/40"> → </span>
                  {ev.action}
                </span>
                <span className="font-black text-[10px] text-accent/80 flex-shrink-0 tabular-nums">{ev.ms}</span>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

// ── Card 4: Elastic Orchestration — node graph ────────────────────────────────
function ElasticCard() {
  const nodes = [
    { cx: 50, cy: 50, r: 18, label: 'Core' },
    { cx: 20, cy: 20, r: 10, label: 'A' },
    { cx: 80, cy: 20, r: 10, label: 'B' },
    { cx: 20, cy: 80, r: 10, label: 'C' },
    { cx: 80, cy: 80, r: 10, label: 'D' },
  ];
  const edges = [[0,1],[0,2],[0,3],[0,4]];

  return (
    <div className="relative col-span-full overflow-hidden lg:col-span-3 border border-border-subtle bg-surface rounded-3xl shadow-xl shadow-brand/5 group hover:border-brand/30 hover:shadow-2xl hover:shadow-brand/10 transition-all duration-500">
      <div className="absolute inset-0 bg-gradient-to-br from-brand/0 to-brand/0 group-hover:from-brand/3 group-hover:to-accent/2 transition-all duration-700 rounded-3xl pointer-events-none" />

      <div className="grid sm:grid-cols-2 h-full pt-10 p-8">
        <div className="flex flex-col justify-between space-y-8 lg:space-y-6 pb-6 sm:pb-0">
          <div className="flex items-center justify-center w-12 h-12 rounded-2xl border border-border-subtle bg-brand/5 group-hover:bg-brand/10 group-hover:border-brand/20 transition-all duration-300">
            <Cpu className="size-6 text-brand" strokeWidth={1.5} />
          </div>
          <div className="space-y-3 pr-4">
            <h2 className="text-2xl font-display font-bold text-primary group-hover:text-brand transition-colors duration-300">
              Elastic Orchestration
            </h2>
            <p className="text-sm text-secondary leading-relaxed opacity-60">
              Scale from one workflow to hundreds without rewriting the system.
            </p>
            <div className="flex items-center gap-2 text-xs font-bold text-brand opacity-0 group-hover:opacity-100 transition-all duration-400">
              <ArrowRight className="w-3 h-3" /> Add nodes without downtime
            </div>
          </div>
        </div>

        {/* Interactive node graph */}
        <div className="rounded-tl-[2.5rem] relative -mb-8 -mr-8 border-l border-t border-border-subtle bg-base p-4 sm:ml-4 flex items-center justify-center overflow-hidden">
          <svg viewBox="0 0 100 100" className="w-full h-40 sm:h-full" style={{ maxHeight: '180px' }}>
            {/* Edges */}
            {edges.map(([a, b], i) => (
              <line
                key={i}
                x1={nodes[a].cx} y1={nodes[a].cy}
                x2={nodes[b].cx} y2={nodes[b].cy}
                stroke="currentColor"
                strokeWidth="1"
                className="text-brand/20 group-hover:text-brand/50 transition-colors duration-500"
                strokeDasharray="3 2"
              />
            ))}
            {/* Nodes */}
            {nodes.map((n, i) => (
              <g key={i}>
                <circle
                  cx={n.cx} cy={n.cy} r={n.r}
                  className={cn(
                    "transition-all duration-500",
                    i === 0
                      ? "fill-brand/10 stroke-brand/40 group-hover:fill-brand/20 group-hover:stroke-brand"
                      : "fill-base stroke-border-subtle group-hover:fill-brand/8 group-hover:stroke-brand/40"
                  )}
                  strokeWidth="1"
                />
                {i === 0 && (
                  <>
                    <circle cx={n.cx} cy={n.cy} r={n.r + 4}
                      className="fill-none stroke-brand/10 group-hover:stroke-brand/25 transition-all duration-700"
                      strokeWidth="1"
                    />
                    <text x={n.cx} y={n.cy + 4} textAnchor="middle" className="fill-brand text-[5px] font-black select-none" fontSize="7">AI</text>
                  </>
                )}
                {i > 0 && (
                  <text x={n.cx} y={n.cy + 3} textAnchor="middle" className="fill-secondary/60 select-none" fontSize="6">{n.label}</text>
                )}
              </g>
            ))}
          </svg>
        </div>
      </div>
    </div>
  );
}

// ── Card 5: Governed AI — approval flow ───────────────────────────────────────
function GovernedCard() {
  const [approved, setApproved] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setApproved(n => (n + 1) % 4), 900);
    return () => clearInterval(t);
  }, []);

  const steps = [
    { label: 'Trigger', pct: '100%' },
    { label: 'AI Decision', pct: '85%' },
    { label: 'Human Review', pct: '70%' },
    { label: 'Executed', pct: '60%' },
  ];

  return (
    <div className="relative col-span-full overflow-hidden lg:col-span-3 border border-border-subtle bg-surface rounded-3xl shadow-xl shadow-brand/5 group hover:border-brand/30 hover:shadow-2xl hover:shadow-brand/10 transition-all duration-500">
      <div className="absolute inset-0 bg-gradient-to-br from-brand/0 to-brand/0 group-hover:from-accent/3 group-hover:to-brand/2 transition-all duration-700 rounded-3xl pointer-events-none" />

      <div className="grid sm:grid-cols-2 h-full pt-10 p-8">
        <div className="flex flex-col justify-between space-y-8 lg:space-y-6 pb-6 sm:pb-0">
          <div className="flex items-center justify-center w-12 h-12 rounded-2xl border border-border-subtle bg-brand/5 group-hover:bg-brand/10 group-hover:border-brand/20 transition-all duration-300">
            <Shield className="size-6 text-brand" strokeWidth={1.5} />
          </div>
          <div className="space-y-3">
            <h2 className="text-2xl font-display font-bold text-primary group-hover:text-brand transition-colors duration-300">
              Governed AI
            </h2>
            <p className="text-sm text-secondary leading-relaxed opacity-60">
              Approvals, fallbacks, and monitoring keep every action in bounds.
            </p>
            <div className="flex items-center gap-2 text-xs font-bold text-accent opacity-0 group-hover:opacity-100 transition-all duration-400">
              <Sparkles className="w-3 h-3" /> Zero rogue actions
            </div>
          </div>
        </div>

        {/* Animated approval pipeline */}
        <div className="sm:ml-4 flex items-center justify-center">
          <div className="w-full space-y-3">
            {steps.map((s, i) => {
              const isDone   = i <= approved;
              const isActive = i === (approved + 1) % steps.length;
              return (
                <div key={s.label} className="flex items-center gap-3">
                  <motion.div
                    animate={{ scale: isActive ? [1, 1.15, 1] : 1 }}
                    transition={{ duration: 0.5, repeat: isActive ? Infinity : 0 }}
                    className={cn(
                      "w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-400",
                      isDone ? "bg-brand" : "bg-slate-100 border border-slate-200"
                    )}
                  >
                    {isDone && <Check className="w-3 h-3 text-white" strokeWidth={3} />}
                  </motion.div>
                  <div className="flex-1">
                    <div className="flex justify-between text-[11px] font-bold text-primary mb-1">
                      <span>{s.label}</span>
                      {isDone && <span className="text-brand">{s.pct}</span>}
                    </div>
                    <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full rounded-full"
                        style={{ background: 'linear-gradient(90deg, var(--color-brand), var(--color-accent))' }}
                        animate={{ width: isDone ? s.pct : '0%' }}
                        transition={{ duration: 0.5, ease: 'easeOut' }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Main export ───────────────────────────────────────────────────────────────
export function Features() {
  return (
    <section className="bg-base py-16 md:py-24 overflow-hidden">
      <div className="mx-auto max-w-3xl lg:max-w-5xl px-6">
        <div className="grid grid-cols-6 gap-5">
          <AutonomousCard />
          <SecurityCard />
          <RealTimeCard />
          <ElasticCard />
          <GovernedCard />
        </div>
      </div>
    </section>
  );
}
