import {
  Zap, Globe, Cpu, MessageSquare, Terminal, Activity,
  Search, Code, FileText, Users, Shield, Mail,
  Workflow, Sparkles, Bot, Layers, Brain,
  BarChart2, PenTool, Megaphone, Server,
  MonitorSmartphone, Boxes, ScanSearch, Wand2,
} from "lucide-react";
import { cn } from "@/lib/utils";

// ── Category colour tokens ─────────────────────────────────────────────────
// ai = indigo  |  seo = emerald  |  dev = blue  |  brand = violet  |  ops = amber

type Category = "ai" | "seo" | "dev" | "brand" | "ops";

type IntegrationItem = {
  name: string;
  icon: any;
  category: Category;
};

const CATEGORY_STYLES: Record<Category, { cell: string; icon: string; text: string }> = {
  ai:    { cell: "hover:bg-indigo-50",   icon: "text-indigo-400 group-hover:text-indigo-600",  text: "text-indigo-400 group-hover:text-indigo-600" },
  seo:   { cell: "hover:bg-emerald-50",  icon: "text-emerald-400 group-hover:text-emerald-600", text: "text-emerald-400 group-hover:text-emerald-600" },
  dev:   { cell: "hover:bg-blue-50",     icon: "text-blue-400 group-hover:text-blue-600",       text: "text-blue-400 group-hover:text-blue-600" },
  brand: { cell: "hover:bg-violet-50",   icon: "text-violet-400 group-hover:text-violet-600",   text: "text-violet-400 group-hover:text-violet-600" },
  ops:   { cell: "hover:bg-amber-50",    icon: "text-amber-400 group-hover:text-amber-600",     text: "text-amber-400 group-hover:text-amber-600" },
};

// 32 perimeter cells (6×6 grid minus the 2×2 centre = 32 cells)
const PERIMETER_ICONS: IntegrationItem[] = [
  // AI tools & models
  { name: "GPT-4o",      icon: Bot,              category: "ai"    },
  { name: "Claude",      icon: Brain,            category: "ai"    },
  { name: "Gemini",      icon: Sparkles,         category: "ai"    },
  { name: "LangChain",   icon: Layers,           category: "ai"    },
  { name: "n8n",         icon: Workflow,         category: "ai"    },
  { name: "Zapier",      icon: Zap,              category: "ai"    },
  { name: "Make",        icon: Cpu,              category: "ai"    },

  // SEO / Content
  { name: "AI SEO",      icon: ScanSearch,       category: "seo"   },
  { name: "Ahrefs",      icon: BarChart2,        category: "seo"   },
  { name: "Surfer",      icon: Activity,         category: "seo"   },
  { name: "Schema",      icon: FileText,         category: "seo"   },
  { name: "GBP",         icon: Search,           category: "seo"   },

  // Web / Dev
  { name: "Next.js",     icon: Code,             category: "dev"   },
  { name: "React",       icon: MonitorSmartphone,category: "dev"   },
  { name: "Webflow",     icon: Globe,            category: "dev"   },
  { name: "Shopify",     icon: Boxes,            category: "dev"   },
  { name: "API",         icon: Terminal,         category: "dev"   },
  { name: "Server",      icon: Server,           category: "dev"   },
  { name: "WordPress",   icon: FileText,         category: "dev"   },

  // Branding / Design
  { name: "Figma",       icon: PenTool,          category: "brand" },
  { name: "Brand ID",    icon: Wand2,            category: "brand" },
  { name: "Motion",      icon: Sparkles,         category: "brand" },
  { name: "Copy",        icon: MessageSquare,    category: "brand" },

  // Ops / CRM
  { name: "HubSpot",     icon: Users,            category: "ops"   },
  { name: "Slack",       icon: MessageSquare,    category: "ops"   },
  { name: "Email",       icon: Mail,             category: "ops"   },
  { name: "Analytics",   icon: BarChart2,        category: "ops"   },
  { name: "CRM",         icon: Shield,           category: "ops"   },
  { name: "Ads",         icon: Megaphone,        category: "ops"   },
  { name: "Meta",        icon: Globe,            category: "ops"   },
  { name: "Google",      icon: Search,           category: "ops"   },
  { name: "Reports",     icon: Activity,         category: "ops"   },
];

// ── Core service cards (2×2 centre) ───────────────────────────────────────
const CORE_SERVICES = [
  {
    title: "AI Agents",
    desc: "Autonomous workflows",
    icon: <Bot className="w-5 h-5 text-indigo-500" />,
    bar1: "w-3/4", bar2: "w-1/2",
  },
  {
    title: "AI SEO",
    desc: "Rank in AI search",
    icon: <ScanSearch className="w-5 h-5 text-emerald-500" />,
    bar1: "w-4/5", bar2: "w-3/5",
  },
  {
    title: "Web & Apps",
    desc: "Build at speed",
    icon: <Code className="w-5 h-5 text-blue-500" />,
    bar1: "w-2/3", bar2: "w-1/2",
  },
  {
    title: "Branding",
    desc: "Distinct identity",
    icon: <Wand2 className="w-5 h-5 text-violet-500" />,
    bar1: "w-3/4", bar2: "w-2/5",
  },
];

// ── Legend ─────────────────────────────────────────────────────────────────
const LEGEND: { label: string; color: string }[] = [
  { label: "AI & Automation", color: "bg-indigo-400" },
  { label: "SEO & Content",   color: "bg-emerald-400" },
  { label: "Web & Dev",       color: "bg-blue-400" },
  { label: "Branding",        color: "bg-violet-400" },
  { label: "Ops & CRM",       color: "bg-amber-400" },
];

export function LogoCloud({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "relative w-full bg-slate-50 border border-slate-200 rounded-[2.5rem] overflow-hidden shadow-2xl",
        className,
      )}
      {...props}
    >
      {/* subtle radial glow in the centre */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_50%_at_50%_50%,rgba(99,102,241,0.06),transparent)] pointer-events-none" />

      <div
        className="grid grid-cols-6 w-full"
        style={{ gridTemplateRows: "repeat(6, minmax(72px, 1fr))" }}
      >
        {renderCells()}

        {/* ── 2×2 centre: core services ── */}
        <div className="col-start-3 col-end-5 row-start-3 row-end-5 grid grid-cols-2 grid-rows-2 gap-px bg-slate-200/80 relative z-20 shadow-[0_0_0_1px_rgba(99,102,241,0.15)]">
          {CORE_SERVICES.map((s) => (
            <div
              key={s.title}
              className="bg-white flex flex-col justify-center p-4 group cursor-default relative overflow-hidden hover:bg-slate-50 transition-colors"
            >
              <div className="flex items-center gap-2 mb-2">
                {s.icon}
                <div>
                  <p className="text-xs font-display font-bold text-primary leading-none">{s.title}</p>
                  <p className="text-[9px] text-secondary/50 mt-0.5 leading-none">{s.desc}</p>
                </div>
              </div>
              <div className="space-y-1.5">
                <div className="h-1 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div className={cn("h-full bg-slate-200 rounded-full", s.bar1)} />
                </div>
                <div className="h-1 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div className={cn("h-full bg-slate-200 rounded-full", s.bar2)} />
                </div>
              </div>
            </div>
          ))}
          {/* connector dot */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3.5 h-3.5 bg-white border border-indigo-200 rounded-full shadow z-30" />
        </div>
      </div>

      {/* ── Legend bar ── */}
      <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 px-6 py-4 border-t border-slate-200 bg-white/70 backdrop-blur-sm">
        {LEGEND.map((l) => (
          <div key={l.label} className="flex items-center gap-1.5">
            <span className={cn("w-2 h-2 rounded-full", l.color)} />
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">{l.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function renderCells() {
  const cells: React.ReactNode[] = [];
  let iconIdx = 0;
  for (let y = 1; y <= 6; y++) {
    for (let x = 1; x <= 6; x++) {
      if ((x === 3 || x === 4) && (y === 3 || y === 4)) continue;
      const item = PERIMETER_ICONS[iconIdx % PERIMETER_ICONS.length];
      cells.push(<Cell key={`${x}-${y}`} x={x} y={y} {...item} />);
      iconIdx++;
    }
  }
  return cells;
}

function Cell({ name, icon: Icon, x, y, category }: IntegrationItem & { x: number; y: number }) {
  const styles = CATEGORY_STYLES[category];
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-1.5 border-[0.5px] border-slate-200 p-2 group transition-colors cursor-default",
        styles.cell,
        `col-start-${x} row-start-${y}`,
      )}
    >
      <Icon className={cn("w-4 h-4 transition-colors", styles.icon)} strokeWidth={1.5} />
      <span
        className={cn(
          "text-[8px] font-bold uppercase tracking-tight transition-colors whitespace-nowrap overflow-hidden text-ellipsis w-full text-center",
          styles.text,
        )}
      >
        {name}
      </span>
    </div>
  );
}
