"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import AdminLayout from "@/components/admin/admin-layout";
import { api } from "@/lib/api";
import { cn } from "@/lib/utils";
import { SERVICES, DEFAULT_SECTIONS } from "@/app/services/[slug]/service-page-client";

// ── Types ──────────────────────────────────────────────────────────────────

type TabId = "hero" | "features" | "roadmap" | "market_impact" | "cta" | "testimonials";
type SaveStatus = "idle" | "saving" | "saved" | "error";

interface HeroContent {
  badge: string;
  heroLine1: string;
  heroLine2: string;
  heroCopy: string;
  ctaPrimary: string;
  pills: [string, string, string];
  snapshotTitle: string;
  snapshotRows: [string, string, string, string];
  statLabel1: string;
  statValue1: string;
  statLabel2: string;
  statValue2: string;
}

interface FeatureCard { title: string; description: string; }
interface FeaturesContent { cards: [FeatureCard, FeatureCard, FeatureCard]; }

interface RoadmapItem { step: string; title: string; desc: string; }
interface RoadmapContent {
  roadmapTitle: string;
  roadmapTitleAccent: string;
  roadmapCopy: string;
  items: [RoadmapItem, RoadmapItem, RoadmapItem, RoadmapItem, RoadmapItem, RoadmapItem];
}

interface OutcomeCard { quote: string; company: string; sector: string; metricValue: string; metricLabel: string; }
interface OutcomeStat { value: string; label: string; }
interface MarketImpactContent {
  outcomesTitle: string;
  outcomesTitleAccent: string;
  outcomesCopy: string;
  cards: [OutcomeCard, OutcomeCard];
  stats: [OutcomeStat, OutcomeStat, OutcomeStat, OutcomeStat];
}

interface CtaContent { ctaBadge: string; ctaTitle: string; ctaCopy: string; }

interface TestimonialItem { quote: string; role: string; company: string; }
interface TestimonialsContent { items: TestimonialItem[]; }

// ── Defaults ───────────────────────────────────────────────────────────────

const DEFAULT_HERO: HeroContent = {
  badge: "",
  heroLine1: "",
  heroLine2: "",
  heroCopy: "",
  ctaPrimary: "Book a Strategy Call",
  pills: ["", "", ""],
  snapshotTitle: "",
  snapshotRows: ["", "", "", ""],
  statLabel1: "",
  statValue1: "",
  statLabel2: "",
  statValue2: "",
};

const DEFAULT_FEATURES: FeaturesContent = {
  cards: [
    { title: "", description: "" },
    { title: "", description: "" },
    { title: "", description: "" },
  ],
};

const DEFAULT_ROADMAP: RoadmapContent = {
  roadmapTitle: "The 6-step delivery",
  roadmapTitleAccent: "roadmap",
  roadmapCopy: "",
  items: [
    { step: "01", title: "Discovery",    desc: "" },
    { step: "02", title: "Architecture", desc: "" },
    { step: "03", title: "Engineering",  desc: "" },
    { step: "04", title: "Validation",   desc: "" },
    { step: "05", title: "Deployment",   desc: "" },
    { step: "06", title: "Scale",        desc: "" },
  ],
};

const DEFAULT_MARKET_IMPACT: MarketImpactContent = {
  outcomesTitle: "Partnering for",
  outcomesTitleAccent: "high-velocity growth",
  outcomesCopy: "",
  cards: [
    { quote: "", company: "", sector: "", metricValue: "", metricLabel: "" },
    { quote: "", company: "", sector: "", metricValue: "", metricLabel: "" },
  ],
  stats: [
    { value: "", label: "" },
    { value: "", label: "" },
    { value: "", label: "" },
    { value: "", label: "" },
  ],
};

const DEFAULT_CTA: CtaContent = {
  ctaBadge: "Deployment Ready",
  ctaTitle: "Ship faster with automation.",
  ctaCopy: "Get a tailored plan and deployment timeline in days, not weeks.",
};

const DEFAULT_TESTIMONIALS: TestimonialsContent = {
  items: [{ quote: "", role: "", company: "" }],
};

// ── Constants ──────────────────────────────────────────────────────────────

const SERVICE_OPTIONS = [
  { slug: "ai-seo",                 label: "AI SEO Services"          },
  { slug: "custom-ai-solutions",    label: "Custom AI Solutions"       },
  { slug: "youtube-automation",     label: "YouTube Automation"        },
  { slug: "instagram-automation",   label: "Instagram Automation"      },
  { slug: "linkedin-automation",    label: "LinkedIn Automation"       },
  { slug: "automation-flows",       label: "Automation Flows"          },
  { slug: "ai-workflows",           label: "AI Workflows"              },
  { slug: "workflow-creation",      label: "Workflow Creation"         },
  { slug: "accounting-bookkeeping", label: "Accounting & Bookkeeping"  },
  { slug: "hiring-recruitment",     label: "Hiring & Recruitment"      },
  { slug: "sales-automation",       label: "Sales Automation"          },
];

const TABS: { id: TabId; label: string }[] = [
  { id: "hero",          label: "Hero"          },
  { id: "features",      label: "Features"      },
  { id: "roadmap",       label: "Roadmap"       },
  { id: "market_impact", label: "Market Impact" },
  { id: "cta",           label: "CTA"           },
  { id: "testimonials",  label: "Testimonials"  },
];

const inputCls =
  "w-full bg-white border border-slate-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand/30 focus:ring-4 focus:ring-brand/5 transition-all text-[#1A1C1E] font-medium";
const labelCls =
  "block text-[9px] font-bold uppercase tracking-widest text-slate-400 mb-1.5 ml-1";
const textareaCls = inputCls + " resize-none";

// ── Static fallback builder ────────────────────────────────────────────────

function buildFromStatic(slug: string) {
  const s = SERVICES[slug];
  if (!s) return null;

  const hero: HeroContent = {
    badge: s.badge,
    heroLine1: s.heroLine1,
    heroLine2: s.heroLine2,
    heroCopy: s.heroCopy,
    ctaPrimary: s.ctaPrimary,
    pills: s.pills,
    snapshotTitle: s.snapshotTitle,
    snapshotRows: ([...s.snapshotRows, "", "", "", ""].slice(0, 4)) as [string, string, string, string],
    statLabel1: s.statLabel1,
    statValue1: s.statValue1,
    statLabel2: s.statLabel2,
    statValue2: s.statValue2,
  };

  const rawCards = (s.features ?? []).map(f => ({ title: f.title, description: f.description }));
  while (rawCards.length < 3) rawCards.push({ title: "", description: "" });
  const features: FeaturesContent = {
    cards: rawCards.slice(0, 3) as [FeatureCard, FeatureCard, FeatureCard],
  };

  const roadmap: RoadmapContent = {
    roadmapTitle: DEFAULT_SECTIONS.roadmapTitle,
    roadmapTitleAccent: DEFAULT_SECTIONS.roadmapTitleAccent,
    roadmapCopy: DEFAULT_SECTIONS.roadmapCopy,
    items: DEFAULT_SECTIONS.roadmapItems as RoadmapContent["items"],
  };

  const mi = s.marketImpact;
  let marketImpact: MarketImpactContent;
  if (mi) {
    const cards = mi.outcomesCards.slice(0, 2).map(c => ({
      quote: c[0], company: c[1], sector: c[2], metricValue: c[3], metricLabel: c[4],
    }));
    while (cards.length < 2) cards.push({ quote: "", company: "", sector: "", metricValue: "", metricLabel: "" });
    const stats = mi.outcomesStats.slice(0, 4).map(st => ({ value: st[0], label: st[1] }));
    while (stats.length < 4) stats.push({ value: "", label: "" });
    marketImpact = {
      outcomesTitle: mi.outcomesTitle,
      outcomesTitleAccent: mi.outcomesTitleAccent,
      outcomesCopy: mi.outcomesCopy,
      cards: cards as [OutcomeCard, OutcomeCard],
      stats: stats as [OutcomeStat, OutcomeStat, OutcomeStat, OutcomeStat],
    };
  } else {
    marketImpact = DEFAULT_MARKET_IMPACT;
  }

  const cta: CtaContent = {
    ctaBadge: DEFAULT_SECTIONS.ctaBadge,
    ctaTitle: DEFAULT_SECTIONS.ctaTitle,
    ctaCopy: DEFAULT_SECTIONS.ctaCopy,
  };

  const rawItems = (s.testimonials ?? []).slice(0, 2).map(t => ({
    quote: t.quote, role: t.role, company: t.company ?? "",
  }));
  const testimonials: TestimonialsContent = {
    items: rawItems.length > 0 ? rawItems : [{ quote: "", role: "", company: "" }],
  };

  return { hero, features, roadmap, marketImpact, cta, testimonials };
}

// ── SaveButton helper ──────────────────────────────────────────────────────

function SaveButton({
  status,
  label,
  onSave,
}: {
  status: SaveStatus;
  label: string;
  onSave: () => void;
}) {
  return (
    <div className="flex items-center gap-3 pt-2">
      <Button
        variant="brand"
        size="sm"
        disabled={status === "saving"}
        onClick={onSave}
        className="px-6"
      >
        {status === "saving" ? "Saving…" : `Save ${label}`}
      </Button>
      {status === "saved" && (
        <span className="text-green-600 text-xs font-bold uppercase tracking-widest">Saved</span>
      )}
      {status === "error" && (
        <span className="text-red-500 text-xs font-bold uppercase tracking-widest">Error saving</span>
      )}
    </div>
  );
}

// ── Page component ─────────────────────────────────────────────────────────

export default function AdminServicesPage() {
  const [selectedSlug, setSelectedSlug] = useState("ai-seo");
  const [activeTab, setActiveTab]       = useState<TabId>("hero");
  const [loading, setLoading]           = useState(true);
  const [apiWarn, setApiWarn]           = useState(false);

  const [heroContent,         setHeroContent]         = useState<HeroContent>(DEFAULT_HERO);
  const [featuresContent,     setFeaturesContent]     = useState<FeaturesContent>(DEFAULT_FEATURES);
  const [roadmapContent,      setRoadmapContent]      = useState<RoadmapContent>(DEFAULT_ROADMAP);
  const [marketImpactContent, setMarketImpactContent] = useState<MarketImpactContent>(DEFAULT_MARKET_IMPACT);
  const [ctaContent,          setCtaContent]          = useState<CtaContent>(DEFAULT_CTA);
  const [testimonialsContent, setTestimonialsContent] = useState<TestimonialsContent>(DEFAULT_TESTIMONIALS);

  const [heroStatus,          setHeroStatus]          = useState<SaveStatus>("idle");
  const [featuresStatus,      setFeaturesStatus]      = useState<SaveStatus>("idle");
  const [roadmapStatus,       setRoadmapStatus]       = useState<SaveStatus>("idle");
  const [marketImpactStatus,  setMarketImpactStatus]  = useState<SaveStatus>("idle");
  const [ctaStatus,           setCtaStatus]           = useState<SaveStatus>("idle");
  const [testimonialsStatus,  setTestimonialsStatus]  = useState<SaveStatus>("idle");

  // Fetch all sections when selectedSlug changes
  useEffect(() => {
    const fetchService = async () => {
      setLoading(true);
      setApiWarn(false);
      const res = await api.get("service_content", { slug: selectedSlug });
      if (res?.status === "success" && res.data) {
        const d = res.data as Record<string, Record<string, unknown>>;
        const hasAny = d.hero || d.features || d.roadmap || d.market_impact || d.cta || d.testimonials;
        if (hasAny) {
          if (d.hero)          setHeroContent({ ...DEFAULT_HERO,          ...d.hero });
          if (d.features)      setFeaturesContent({ ...DEFAULT_FEATURES,  ...d.features });
          if (d.roadmap)       setRoadmapContent({ ...DEFAULT_ROADMAP,    ...d.roadmap });
          if (d.market_impact) setMarketImpactContent({ ...DEFAULT_MARKET_IMPACT, ...d.market_impact });
          if (d.cta)           setCtaContent({ ...DEFAULT_CTA,            ...d.cta });
          if (d.testimonials)  setTestimonialsContent({ ...DEFAULT_TESTIMONIALS, ...d.testimonials });
        } else {
          const fallback = buildFromStatic(selectedSlug);
          if (fallback) {
            setHeroContent(fallback.hero);
            setFeaturesContent(fallback.features);
            setRoadmapContent(fallback.roadmap);
            setMarketImpactContent(fallback.marketImpact);
            setCtaContent(fallback.cta);
            setTestimonialsContent(fallback.testimonials);
          }
          setApiWarn(true);
        }
      } else {
        const fallback = buildFromStatic(selectedSlug);
        if (fallback) {
          setHeroContent(fallback.hero);
          setFeaturesContent(fallback.features);
          setRoadmapContent(fallback.roadmap);
          setMarketImpactContent(fallback.marketImpact);
          setCtaContent(fallback.cta);
          setTestimonialsContent(fallback.testimonials);
        }
        setApiWarn(true);
      }
      setLoading(false);
    };
    fetchService().catch(() => {
      const fallback = buildFromStatic(selectedSlug);
      if (fallback) {
        setHeroContent(fallback.hero);
        setFeaturesContent(fallback.features);
        setRoadmapContent(fallback.roadmap);
        setMarketImpactContent(fallback.marketImpact);
        setCtaContent(fallback.cta);
        setTestimonialsContent(fallback.testimonials);
      }
      setApiWarn(true);
      setLoading(false);
    });
  }, [selectedSlug]);

  // ── Save helpers ───────────────────────────────────────────────────────

  const autoReset = (
    setter: React.Dispatch<React.SetStateAction<SaveStatus>>,
    value: "saved" | "error",
  ) => {
    setter(value);
    setTimeout(() => setter("idle"), 3000);
  };

  const saveSection = async (
    section: TabId,
    content: HeroContent | FeaturesContent | RoadmapContent | MarketImpactContent | CtaContent | TestimonialsContent,
    setStatus: React.Dispatch<React.SetStateAction<SaveStatus>>,
  ) => {
    setStatus("saving");
    const res = await api.post("service_content", {
      action: "save_section",
      slug: selectedSlug,
      section,
      content,
    });
    if (res?.status === "success") {
      autoReset(setStatus, "saved");
    } else {
      autoReset(setStatus, "error");
    }
  };

  // ── Loading state ──────────────────────────────────────────────────────

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <p className="text-slate-400 font-bold tracking-widest text-[10px] uppercase">
            Synchronizing Data…
          </p>
        </div>
      </AdminLayout>
    );
  }

  // ── Main render ────────────────────────────────────────────────────────

  return (
    <AdminLayout>
      <div className="max-w-4xl">

        {/* Page header */}
        <div className="mb-8">
          <h1 className="text-2xl font-display font-bold text-[#1A1C1E] tracking-tight">Service Pages</h1>
          <p className="text-slate-400 text-sm mt-1">Edit per-service content across all 11 services.</p>
        </div>

        {apiWarn && (
          <div className="mb-6 px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-500 text-xs font-medium flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-400 flex-shrink-0" />
            Loaded from site defaults — no database record found yet. Edit and Save to store a database record that overrides these values on the live site.
          </div>
        )}

        {/* Service selector */}
        <div className="mb-8">
          <label className={labelCls}>Select Service</label>
          <select
            value={selectedSlug}
            onChange={(e) => setSelectedSlug(e.target.value)}
            className="h-10 px-3 rounded-md border border-slate-200 bg-white text-sm font-medium text-[#1A1C1E] focus:outline-none focus:border-brand/30 focus:ring-4 focus:ring-brand/5 transition-all"
          >
            {SERVICE_OPTIONS.map((opt) => (
              <option key={opt.slug} value={opt.slug}>{opt.label}</option>
            ))}
          </select>
        </div>

        {/* Tab navigation */}
        <div className="flex gap-1 border-b border-slate-100 mb-8 flex-wrap">
          {TABS.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "px-4 py-2 text-xs font-bold uppercase tracking-widest rounded-md transition-colors mb-[-1px]",
                  isActive ? "bg-brand text-white" : "text-slate-400 hover:text-slate-700",
                )}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* ── HERO TAB ────────────────────────────────────────────────────── */}
        {activeTab === "hero" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>Badge (Eyebrow)</label>
                <input
                  className={inputCls}
                  value={heroContent.badge}
                  onChange={(e) => setHeroContent((p) => ({ ...p, badge: e.target.value }))}
                />
              </div>
              <div>
                <label className={labelCls}>CTA Button Label</label>
                <input
                  className={inputCls}
                  value={heroContent.ctaPrimary}
                  onChange={(e) => setHeroContent((p) => ({ ...p, ctaPrimary: e.target.value }))}
                />
              </div>
            </div>

            <div>
              <label className={labelCls}>Hero Line 1</label>
              <input
                className={inputCls}
                value={heroContent.heroLine1}
                onChange={(e) => setHeroContent((p) => ({ ...p, heroLine1: e.target.value }))}
              />
            </div>

            <div>
              <label className={labelCls}>Hero Line 2 (Accent)</label>
              <input
                className={inputCls}
                value={heroContent.heroLine2}
                onChange={(e) => setHeroContent((p) => ({ ...p, heroLine2: e.target.value }))}
              />
            </div>

            <div>
              <label className={labelCls}>Hero Copy (max 2 sentences)</label>
              <textarea
                className={textareaCls}
                rows={3}
                value={heroContent.heroCopy}
                onChange={(e) => setHeroContent((p) => ({ ...p, heroCopy: e.target.value }))}
              />
            </div>

            {/* Pills */}
            <div className="border border-slate-100 rounded-xl p-6 space-y-3">
              <p className={labelCls}>Pill Chips (3)</p>
              {([0, 1, 2] as const).map((i) => (
                <input
                  key={i}
                  className={inputCls}
                  value={heroContent.pills[i]}
                  onChange={(e) => {
                    const pills = [...heroContent.pills] as [string, string, string];
                    pills[i] = e.target.value;
                    setHeroContent((p) => ({ ...p, pills }));
                  }}
                />
              ))}
            </div>

            {/* Snapshot card */}
            <div className="border border-slate-100 rounded-xl p-6 space-y-3">
              <p className={labelCls}>Snapshot Card</p>
              <div>
                <label className={labelCls}>Snapshot Title</label>
                <input
                  className={inputCls}
                  value={heroContent.snapshotTitle}
                  onChange={(e) => setHeroContent((p) => ({ ...p, snapshotTitle: e.target.value }))}
                />
              </div>
              {([0, 1, 2, 3] as const).map((i) => (
                <input
                  key={i}
                  className={inputCls}
                  placeholder={`Row ${i + 1}`}
                  value={heroContent.snapshotRows[i]}
                  onChange={(e) => {
                    const rows = [...heroContent.snapshotRows] as [string, string, string, string];
                    rows[i] = e.target.value;
                    setHeroContent((p) => ({ ...p, snapshotRows: rows }));
                  }}
                />
              ))}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border border-slate-100 rounded-xl p-4 space-y-2">
                <label className={labelCls}>Stat 1 Label</label>
                <input
                  className={inputCls}
                  value={heroContent.statLabel1}
                  onChange={(e) => setHeroContent((p) => ({ ...p, statLabel1: e.target.value }))}
                />
                <label className={labelCls}>Stat 1 Value</label>
                <input
                  className={inputCls}
                  value={heroContent.statValue1}
                  onChange={(e) => setHeroContent((p) => ({ ...p, statValue1: e.target.value }))}
                />
              </div>
              <div className="border border-slate-100 rounded-xl p-4 space-y-2">
                <label className={labelCls}>Stat 2 Label</label>
                <input
                  className={inputCls}
                  value={heroContent.statLabel2}
                  onChange={(e) => setHeroContent((p) => ({ ...p, statLabel2: e.target.value }))}
                />
                <label className={labelCls}>Stat 2 Value</label>
                <input
                  className={inputCls}
                  value={heroContent.statValue2}
                  onChange={(e) => setHeroContent((p) => ({ ...p, statValue2: e.target.value }))}
                />
              </div>
            </div>

            <SaveButton
              status={heroStatus}
              label="Hero"
              onSave={() => saveSection("hero", heroContent, setHeroStatus)}
            />
          </div>
        )}

        {/* ── FEATURES TAB ────────────────────────────────────────────────── */}
        {activeTab === "features" && (
          <div className="space-y-6">
            {([0, 1, 2] as const).map((i) => (
              <div key={i} className="border border-slate-100 rounded-xl p-6 space-y-4">
                <p className={labelCls}>Feature Card {i + 1}</p>
                <div>
                  <label className={labelCls}>Title</label>
                  <input
                    className={inputCls}
                    value={featuresContent.cards[i].title}
                    onChange={(e) => {
                      const cards = [...featuresContent.cards] as [FeatureCard, FeatureCard, FeatureCard];
                      cards[i] = { ...cards[i], title: e.target.value };
                      setFeaturesContent((p) => ({ ...p, cards }));
                    }}
                  />
                </div>
                <div>
                  <label className={labelCls}>Description</label>
                  <textarea
                    className={textareaCls}
                    rows={3}
                    value={featuresContent.cards[i].description}
                    onChange={(e) => {
                      const cards = [...featuresContent.cards] as [FeatureCard, FeatureCard, FeatureCard];
                      cards[i] = { ...cards[i], description: e.target.value };
                      setFeaturesContent((p) => ({ ...p, cards }));
                    }}
                  />
                </div>
              </div>
            ))}
            <SaveButton
              status={featuresStatus}
              label="Features"
              onSave={() => saveSection("features", featuresContent, setFeaturesStatus)}
            />
          </div>
        )}

        {/* ── ROADMAP TAB ─────────────────────────────────────────────────── */}
        {activeTab === "roadmap" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>Roadmap Title</label>
                <input
                  className={inputCls}
                  value={roadmapContent.roadmapTitle}
                  onChange={(e) => setRoadmapContent((p) => ({ ...p, roadmapTitle: e.target.value }))}
                />
              </div>
              <div>
                <label className={labelCls}>Title Accent (highlighted word)</label>
                <input
                  className={inputCls}
                  value={roadmapContent.roadmapTitleAccent}
                  onChange={(e) => setRoadmapContent((p) => ({ ...p, roadmapTitleAccent: e.target.value }))}
                />
              </div>
            </div>
            <div>
              <label className={labelCls}>Roadmap Copy</label>
              <textarea
                className={textareaCls}
                rows={2}
                value={roadmapContent.roadmapCopy}
                onChange={(e) => setRoadmapContent((p) => ({ ...p, roadmapCopy: e.target.value }))}
              />
            </div>

            {roadmapContent.items.map((item, i) => (
              <div key={i} className="border border-slate-100 rounded-xl p-4 space-y-2">
                <p className={labelCls}>Step {item.step}</p>
                <div>
                  <label className={labelCls}>Title</label>
                  <input
                    className={inputCls}
                    value={item.title}
                    onChange={(e) => {
                      const items = [...roadmapContent.items] as RoadmapContent["items"];
                      items[i] = { ...items[i], title: e.target.value };
                      setRoadmapContent((p) => ({ ...p, items }));
                    }}
                  />
                </div>
                <div>
                  <label className={labelCls}>Description</label>
                  <textarea
                    className={textareaCls}
                    rows={2}
                    value={item.desc}
                    onChange={(e) => {
                      const items = [...roadmapContent.items] as RoadmapContent["items"];
                      items[i] = { ...items[i], desc: e.target.value };
                      setRoadmapContent((p) => ({ ...p, items }));
                    }}
                  />
                </div>
              </div>
            ))}

            <SaveButton
              status={roadmapStatus}
              label="Roadmap"
              onSave={() => saveSection("roadmap", roadmapContent, setRoadmapStatus)}
            />
          </div>
        )}

        {/* ── MARKET IMPACT TAB ───────────────────────────────────────────── */}
        {activeTab === "market_impact" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>Outcomes Title</label>
                <input
                  className={inputCls}
                  value={marketImpactContent.outcomesTitle}
                  onChange={(e) => setMarketImpactContent((p) => ({ ...p, outcomesTitle: e.target.value }))}
                />
              </div>
              <div>
                <label className={labelCls}>Title Accent</label>
                <input
                  className={inputCls}
                  value={marketImpactContent.outcomesTitleAccent}
                  onChange={(e) => setMarketImpactContent((p) => ({ ...p, outcomesTitleAccent: e.target.value }))}
                />
              </div>
            </div>
            <div>
              <label className={labelCls}>Outcomes Copy</label>
              <textarea
                className={textareaCls}
                rows={2}
                value={marketImpactContent.outcomesCopy}
                onChange={(e) => setMarketImpactContent((p) => ({ ...p, outcomesCopy: e.target.value }))}
              />
            </div>

            {/* Outcome cards */}
            {([0, 1] as const).map((i) => (
              <div key={i} className="border border-slate-100 rounded-xl p-6 space-y-4">
                <p className={labelCls}>Outcome Card {i + 1}</p>
                <div>
                  <label className={labelCls}>Quote</label>
                  <textarea
                    className={textareaCls}
                    rows={2}
                    value={marketImpactContent.cards[i].quote}
                    onChange={(e) => {
                      const cards = [...marketImpactContent.cards] as [OutcomeCard, OutcomeCard];
                      cards[i] = { ...cards[i], quote: e.target.value };
                      setMarketImpactContent((p) => ({ ...p, cards }));
                    }}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className={labelCls}>Company</label>
                    <input
                      className={inputCls}
                      value={marketImpactContent.cards[i].company}
                      onChange={(e) => {
                        const cards = [...marketImpactContent.cards] as [OutcomeCard, OutcomeCard];
                        cards[i] = { ...cards[i], company: e.target.value };
                        setMarketImpactContent((p) => ({ ...p, cards }));
                      }}
                    />
                  </div>
                  <div>
                    <label className={labelCls}>Sector</label>
                    <input
                      className={inputCls}
                      value={marketImpactContent.cards[i].sector}
                      onChange={(e) => {
                        const cards = [...marketImpactContent.cards] as [OutcomeCard, OutcomeCard];
                        cards[i] = { ...cards[i], sector: e.target.value };
                        setMarketImpactContent((p) => ({ ...p, cards }));
                      }}
                    />
                  </div>
                  <div>
                    <label className={labelCls}>Metric Value</label>
                    <input
                      className={inputCls}
                      value={marketImpactContent.cards[i].metricValue}
                      onChange={(e) => {
                        const cards = [...marketImpactContent.cards] as [OutcomeCard, OutcomeCard];
                        cards[i] = { ...cards[i], metricValue: e.target.value };
                        setMarketImpactContent((p) => ({ ...p, cards }));
                      }}
                    />
                  </div>
                  <div>
                    <label className={labelCls}>Metric Label</label>
                    <input
                      className={inputCls}
                      value={marketImpactContent.cards[i].metricLabel}
                      onChange={(e) => {
                        const cards = [...marketImpactContent.cards] as [OutcomeCard, OutcomeCard];
                        cards[i] = { ...cards[i], metricLabel: e.target.value };
                        setMarketImpactContent((p) => ({ ...p, cards }));
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}

            {/* Stats */}
            <div className="border border-slate-100 rounded-xl p-6 space-y-4">
              <p className={labelCls}>Stats (4)</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {([0, 1, 2, 3] as const).map((i) => (
                  <div key={i} className="space-y-2">
                    <p className={labelCls}>Stat {i + 1}</p>
                    <div>
                      <label className={labelCls}>Value</label>
                      <input
                        className={inputCls}
                        value={marketImpactContent.stats[i].value}
                        onChange={(e) => {
                          const stats = [...marketImpactContent.stats] as [OutcomeStat, OutcomeStat, OutcomeStat, OutcomeStat];
                          stats[i] = { ...stats[i], value: e.target.value };
                          setMarketImpactContent((p) => ({ ...p, stats }));
                        }}
                      />
                    </div>
                    <div>
                      <label className={labelCls}>Label</label>
                      <input
                        className={inputCls}
                        value={marketImpactContent.stats[i].label}
                        onChange={(e) => {
                          const stats = [...marketImpactContent.stats] as [OutcomeStat, OutcomeStat, OutcomeStat, OutcomeStat];
                          stats[i] = { ...stats[i], label: e.target.value };
                          setMarketImpactContent((p) => ({ ...p, stats }));
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <SaveButton
              status={marketImpactStatus}
              label="Market Impact"
              onSave={() => saveSection("market_impact", marketImpactContent, setMarketImpactStatus)}
            />
          </div>
        )}

        {/* ── CTA TAB ─────────────────────────────────────────────────────── */}
        {activeTab === "cta" && (
          <div className="space-y-6">
            <div>
              <label className={labelCls}>CTA Badge</label>
              <input
                className={inputCls}
                value={ctaContent.ctaBadge}
                onChange={(e) => setCtaContent((p) => ({ ...p, ctaBadge: e.target.value }))}
              />
            </div>
            <div>
              <label className={labelCls}>CTA Title</label>
              <input
                className={inputCls}
                value={ctaContent.ctaTitle}
                onChange={(e) => setCtaContent((p) => ({ ...p, ctaTitle: e.target.value }))}
              />
            </div>
            <div>
              <label className={labelCls}>CTA Copy</label>
              <textarea
                className={textareaCls}
                rows={3}
                value={ctaContent.ctaCopy}
                onChange={(e) => setCtaContent((p) => ({ ...p, ctaCopy: e.target.value }))}
              />
            </div>
            <SaveButton
              status={ctaStatus}
              label="CTA"
              onSave={() => saveSection("cta", ctaContent, setCtaStatus)}
            />
          </div>
        )}

        {/* ── TESTIMONIALS TAB ────────────────────────────────────────────── */}
        {activeTab === "testimonials" && (
          <div className="space-y-6">
            {testimonialsContent.items.map((item, i) => (
              <div key={i} className="border border-slate-100 rounded-xl p-6 space-y-4">
                <p className={labelCls}>Testimonial {i + 1}</p>
                <div>
                  <label className={labelCls}>Quote</label>
                  <textarea
                    className={textareaCls}
                    rows={3}
                    value={item.quote}
                    onChange={(e) => {
                      const items = [...testimonialsContent.items];
                      items[i] = { ...items[i], quote: e.target.value };
                      setTestimonialsContent((p) => ({ ...p, items }));
                    }}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className={labelCls}>Role</label>
                    <input
                      className={inputCls}
                      value={item.role}
                      onChange={(e) => {
                        const items = [...testimonialsContent.items];
                        items[i] = { ...items[i], role: e.target.value };
                        setTestimonialsContent((p) => ({ ...p, items }));
                      }}
                    />
                  </div>
                  <div>
                    <label className={labelCls}>Company</label>
                    <input
                      className={inputCls}
                      value={item.company}
                      onChange={(e) => {
                        const items = [...testimonialsContent.items];
                        items[i] = { ...items[i], company: e.target.value };
                        setTestimonialsContent((p) => ({ ...p, items }));
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}

            <button
              onClick={() =>
                setTestimonialsContent((p) => ({
                  ...p,
                  items: [...p.items, { quote: "", role: "", company: "" }],
                }))
              }
              className="px-4 py-2 text-xs font-bold uppercase tracking-widest border border-slate-200 rounded-xl text-slate-500 hover:text-slate-700 hover:border-slate-300 transition-colors"
            >
              + Add Testimonial
            </button>

            <SaveButton
              status={testimonialsStatus}
              label="Testimonials"
              onSave={() => saveSection("testimonials", testimonialsContent, setTestimonialsStatus)}
            />
          </div>
        )}

      </div>
    </AdminLayout>
  );
}
