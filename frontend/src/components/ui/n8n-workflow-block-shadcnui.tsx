"use client";

import { motion, useMotionValue, MotionValue } from "framer-motion";
import React, { useEffect, useRef, useState } from "react";
import {
  Users, Bot, GitBranch, CalendarCheck, Mail, Database,
  CheckCircle2, ArrowRight,
} from "lucide-react";

// ── Layout constants ──────────────────────────────────────────────────────
const NW = 210;  // node width
const NH = 116;  // node height (increased for proper card spacing)
const CANVAS_W = 1280;
const CANVAS_H = 460;

// ── Node definitions ──────────────────────────────────────────────────────
const NODES = [
  { id: "lead",    type: "TRIGGER",   title: "New Lead Form",    desc: "Contact form submitted",       icon: Users,         color: "emerald", x: 30,   y: 172 },
  { id: "enrich",  type: "ACTION",    title: "AI Enrichment",    desc: "Score, qualify & tag lead",    icon: Bot,           color: "indigo",  x: 275,  y: 172 },
  { id: "route",   type: "CONDITION", title: "Route Decision",   desc: "High-value vs nurture path",   icon: GitBranch,     color: "amber",   x: 520,  y: 172 },
  { id: "demo",    type: "ACTION",    title: "Book Discovery",   desc: "Calendar invite + brief sent", icon: CalendarCheck, color: "blue",    x: 765,  y: 52  },
  { id: "nurture", type: "ACTION",    title: "Nurture Sequence", desc: "5-step email drip started",    icon: Mail,          color: "purple",  x: 765,  y: 292 },
  { id: "crm",     type: "ACTION",    title: "Update CRM",       desc: "Synced to HubSpot & Slack",   icon: Database,      color: "rose",    x: 1010, y: 172 },
] as const;

const CONNECTIONS: { from: string; to: string; label?: string }[] = [
  { from: "lead",    to: "enrich" },
  { from: "enrich",  to: "route"   },
  { from: "route",   to: "demo",    label: "High Value" },
  { from: "route",   to: "nurture", label: "Standard"   },
  { from: "demo",    to: "crm"    },
  { from: "nurture", to: "crm"    },
];

// ── Colour maps ───────────────────────────────────────────────────────────
const COLOR: Record<string, { border: string; iconBg: string; icon: string; badge: string }> = {
  emerald: { border: "border-emerald-300/60", iconBg: "bg-emerald-50", icon: "text-emerald-500", badge: "bg-emerald-50 text-emerald-600 border-emerald-200" },
  indigo:  { border: "border-indigo-300/60",  iconBg: "bg-indigo-50",  icon: "text-indigo-500",  badge: "bg-indigo-50  text-indigo-600  border-indigo-200"  },
  amber:   { border: "border-amber-300/60",   iconBg: "bg-amber-50",   icon: "text-amber-500",   badge: "bg-amber-50   text-amber-600   border-amber-200"   },
  blue:    { border: "border-blue-300/60",    iconBg: "bg-blue-50",    icon: "text-blue-500",    badge: "bg-blue-50    text-blue-600    border-blue-200"    },
  purple:  { border: "border-purple-300/60",  iconBg: "bg-purple-50",  icon: "text-purple-500",  badge: "bg-purple-50  text-purple-600  border-purple-200"  },
  rose:    { border: "border-rose-300/60",    iconBg: "bg-rose-50",    icon: "text-rose-500",    badge: "bg-rose-50    text-rose-600    border-rose-200"    },
};

const LINE_COLOR: Record<string, string> = {
  emerald: "#10b981", indigo: "#6366f1", amber: "#f59e0b",
  blue: "#3b82f6", purple: "#a855f7", rose: "#f43f5e",
};

// ── Live counter ──────────────────────────────────────────────────────────
function LiveCounter() {
  const [count, setCount] = useState(847);
  useEffect(() => {
    const t = setInterval(() => setCount((c) => c + Math.floor(Math.random() * 3)), 3200);
    return () => clearInterval(t);
  }, []);
  return <span className="tabular-nums">{count.toLocaleString()}</span>;
}

// ── Draggable node ────────────────────────────────────────────────────────
function WorkflowNode({
  node, i, onRegister,
}: {
  node: (typeof NODES)[number];
  i: number;
  onRegister: (id: string, x: MotionValue<number>, y: MotionValue<number>) => void;
}) {
  const x = useMotionValue<number>(node.x);
  const y = useMotionValue<number>(node.y);
  const Icon = node.icon;
  const c = COLOR[node.color];

  useEffect(() => {
    onRegister(node.id, x, y);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <motion.div
      drag
      dragMomentum={false}
      style={{ x, y, width: NW, position: "absolute", top: 0, left: 0 }}
      className="cursor-grab active:cursor-grabbing"
      whileDrag={{ scale: 1.05, zIndex: 50 }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4, delay: i * 0.1 }}
    >
      <div
        className={`relative w-full rounded-2xl border-2 ${c.border} bg-white shadow-md shadow-slate-100 hover:shadow-lg transition-shadow select-none`}
        style={{ height: NH, padding: "14px 14px 12px" }}
      >
        {/* Active pulse ring on trigger */}
        {node.type === "TRIGGER" && (
          <span className="absolute -top-1.5 -right-1.5 flex h-4 w-4">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-40" />
            <span className="relative inline-flex h-4 w-4 rounded-full bg-emerald-500" />
          </span>
        )}

        {/* Top row: icon + type badge */}
        <div className="flex items-center justify-between mb-2.5">
          <div className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-xl ${c.iconBg}`}>
            <Icon className={`h-4.5 w-4.5 ${c.icon}`} strokeWidth={1.8} />
          </div>
          <span className={`rounded-full border px-2 py-0.5 text-[8px] font-black uppercase tracking-widest ${c.badge}`}>
            {node.type}
          </span>
        </div>

        {/* Title */}
        <p className="text-[12.5px] font-bold text-slate-800 leading-tight mb-1">{node.title}</p>
        {/* Description — now has room to breathe */}
        <p className="text-[10px] text-slate-400 leading-snug">{node.desc}</p>

        {/* Status row */}
        <div className="mt-2.5 flex items-center gap-1.5">
          <ArrowRight className="h-3 w-3 text-brand flex-shrink-0" />
          <span className="text-[9px] font-black uppercase tracking-widest text-brand">Connected</span>
        </div>
      </div>
    </motion.div>
  );
}

// ── Helpers ───────────────────────────────────────────────────────────────
function buildPath(fp: { x: number; y: number }, tp: { x: number; y: number }) {
  const sx = fp.x + NW, sy = fp.y + NH / 2;
  const ex = tp.x,      ey = tp.y + NH / 2;
  const mx = (sx + ex) / 2;
  return `M${sx},${sy} C${mx},${sy} ${mx},${ey} ${ex},${ey}`;
}

// ── Main component ────────────────────────────────────────────────────────
export function N8nWorkflowBlock() {
  const canvasWrapRef = useRef<HTMLDivElement>(null);
  const [canvasScale, setCanvasScale] = useState(1);

  useEffect(() => {
    function updateScale() {
      if (canvasWrapRef.current) {
        setCanvasScale(canvasWrapRef.current.offsetWidth / CANVAS_W);
      }
    }
    updateScale();
    window.addEventListener("resize", updateScale);
    return () => window.removeEventListener("resize", updateScale);
  }, []);

  // Refs to the actual SVG path DOM elements — updated directly, no setState
  const basePathRefs = useRef<Record<string, SVGPathElement | null>>({});
  const animPathRefs = useRef<Record<string, SVGPathElement | null>>({});
  const labelFORef   = useRef<Record<string, SVGForeignObjectElement | null>>({});

  // Current logical positions of nodes (driven by motion values)
  const positions = useRef<Record<string, { x: number; y: number }>>(
    Object.fromEntries(NODES.map((nd) => [nd.id, { x: nd.x, y: nd.y }]))
  );

  /** Recalculate + apply all SVG paths directly via DOM — zero re-renders */
  function refreshPaths() {
    CONNECTIONS.forEach((conn) => {
      const fp = positions.current[conn.from];
      const tp = positions.current[conn.to];
      if (!fp || !tp) return;

      const d = buildPath(fp, tp);
      const key = `${conn.from}-${conn.to}`;

      basePathRefs.current[key]?.setAttribute("d", d);
      animPathRefs.current[key]?.setAttribute("d", d);

      if (conn.label) {
        const midX = (fp.x + NW + tp.x) / 2;
        const midY = (fp.y + tp.y + NH) / 2;
        const fo = labelFORef.current[key];
        if (fo) {
          fo.setAttribute("x", String(midX - 36));
          fo.setAttribute("y", String(midY - 12));
        }
      }
    });
  }

  /** Called by each WorkflowNode on mount to register its motion values */
  function handleRegister(id: string, xMV: MotionValue<number>, yMV: MotionValue<number>) {
    xMV.on("change", (v) => { positions.current[id] = { ...positions.current[id], x: v }; refreshPaths(); });
    yMV.on("change", (v) => { positions.current[id] = { ...positions.current[id], y: v }; refreshPaths(); });
  }

  // Compute initial paths for first render
  const initialPaths = CONNECTIONS.map((conn) => ({
    key: `${conn.from}-${conn.to}`,
    d: buildPath(
      { x: NODES.find((n) => n.id === conn.from)!.x, y: NODES.find((n) => n.id === conn.from)!.y },
      { x: NODES.find((n) => n.id === conn.to)!.x,   y: NODES.find((n) => n.id === conn.to)!.y   }
    ),
    fromColor: NODES.find((n) => n.id === conn.from)!.color,
    label: conn.label,
    midX: (NODES.find((n) => n.id === conn.from)!.x + NW + NODES.find((n) => n.id === conn.to)!.x) / 2,
    midY: (NODES.find((n) => n.id === conn.from)!.y + NODES.find((n) => n.id === conn.to)!.y + NH) / 2,
  }));

  return (
    <div className="w-full overflow-hidden rounded-2xl bg-white border border-slate-200/80 shadow-xl shadow-slate-200/60">

      {/* ── Browser chrome — traffic light dots only in outer frame ── */}
      <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/80 px-5 py-3">
        <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
          <span className="text-[11px] font-bold uppercase tracking-widest text-slate-400">
            Digi Pexel AI Engine — Live
          </span>
        </div>
        <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-widest text-slate-400">
          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
          <span>All systems active</span>
        </div>
      </div>

      {/* ── Canvas ── */}
      <div
        ref={canvasWrapRef}
        className="relative w-full overflow-hidden bg-[radial-gradient(circle,#e2e8f0_1px,transparent_1px)] bg-[length:28px_28px]"
        style={{ height: Math.round(CANVAS_H * canvasScale) }}
      >
        <div style={{ width: CANVAS_W, height: CANVAS_H, transform: `scale(${canvasScale})`, transformOrigin: "top left" }} className="relative">


          {/* SVG connection layer — paths updated via DOM refs, no re-renders */}
          <svg
            className="absolute inset-0 overflow-visible pointer-events-none"
            width={CANVAS_W}
            height={CANVAS_H}
          >
            <style>{`
              @keyframes dash-flow { to { stroke-dashoffset: -24; } }
              .dash-anim { animation: dash-flow 1.2s linear infinite; }
            `}</style>

            {initialPaths.map((p) => (
              <g key={p.key}>
                {/* Base static dashed line */}
                <path
                  ref={(el) => { basePathRefs.current[p.key] = el; }}
                  d={p.d}
                  fill="none"
                  stroke="#cbd5e1"
                  strokeWidth={2}
                  strokeDasharray="7 5"
                  strokeLinecap="round"
                />
                {/* Flowing coloured line */}
                <path
                  ref={(el) => { animPathRefs.current[p.key] = el; }}
                  d={p.d}
                  fill="none"
                  stroke={LINE_COLOR[p.fromColor]}
                  strokeWidth={2}
                  strokeDasharray="7 5"
                  strokeLinecap="round"
                  strokeDashoffset={0}
                  opacity={0.55}
                  className="dash-anim"
                />
                {/* Branch label */}
                {p.label && (
                  <foreignObject
                    ref={(el) => { labelFORef.current[p.key] = el; }}
                    x={p.midX - 36}
                    y={p.midY - 12}
                    width={72}
                    height={24}
                  >
                    <div className="flex h-full items-center justify-center">
                      <span className="rounded-full bg-white border border-slate-200 px-2 py-0.5 text-[9px] font-black uppercase tracking-widest text-slate-500 shadow-sm whitespace-nowrap">
                        {p.label}
                      </span>
                    </div>
                  </foreignObject>
                )}
              </g>
            ))}
          </svg>

          {/* Draggable nodes */}
          {NODES.map((node, i) => (
            <WorkflowNode
              key={node.id}
              node={node}
              i={i}
              onRegister={handleRegister}
            />
          ))}

        </div>
      </div>

      {/* ── Stats bar ── */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-t border-slate-100 bg-slate-50/60 px-6 py-3">
        <div className="flex flex-wrap items-center gap-6">
          <Stat dot="bg-emerald-500" label="Leads processed today" value={<LiveCounter />} />
          <Stat dot="bg-brand" label="Avg. qualification time" value="1.4 s" />
          <Stat dot="bg-indigo-500" label="Pipeline accuracy" value="94.7%" />
        </div>
        <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
          Powered by Digi Pexel AI Engine
        </span>
      </div>
    </div>
  );
}

function Stat({ dot, label, value }: { dot: string; label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2">
      <span className={`h-1.5 w-1.5 rounded-full ${dot}`} />
      <span className="text-[10px] font-semibold uppercase tracking-widest text-slate-500">{label}:</span>
      <span className="text-[10px] font-black uppercase tracking-widest text-slate-800">{value}</span>
    </div>
  );
}
