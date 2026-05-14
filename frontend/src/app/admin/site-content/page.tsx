"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import AdminLayout from "@/components/admin/admin-layout";
import { api } from "@/lib/api";

// ── Types ──────────────────────────────────────────────────────────────────

interface IconSlot {
  slot: number;
  icon: string;
  label: string;
}

interface HeroContent {
  heading: string;
  titleHighlight: string;
  subtitle: string;
  ctaText: string;
  ctaHref: string;
  iconSlots: IconSlot[];
}

interface NavContent {
  ctaText: string;
  ctaHref: string;
}

interface StatRow {
  label: string;
  value: string;
  description: string;
}

interface StatsContent {
  stats: StatRow[];
}

interface FooterContent {
  newsletterHeading: string;
  newsletterSubtext: string;
}

type TabId = "hero" | "nav" | "stats" | "footer";

// ── Constants ─────────────────────────────────────────────────────────────

const ICON_OPTIONS = [
  "openai", "n8n", "zapier", "make", "anthropic", "slack", "google", "github",
  "notion", "figma", "microsoft", "vercel", "stripe", "discord", "youtube",
  "linear", "x", "spotify", "dropbox", "twitch", "apple",
];

const DEFAULT_HERO: HeroContent = {
  heading: "Automate",
  titleHighlight: "with AI that ships",
  subtitle:
    "Digi Pexel is an AI automation agency. We design reliable workflows that move data, decisions, and actions across your stack so your team can scale without friction.",
  ctaText: "Book a Strategy Call",
  ctaHref: "/contact-us",
  iconSlots: [
    { slot: 1, icon: "openai",    label: "OpenAI"    },
    { slot: 2, icon: "n8n",       label: "n8n"       },
    { slot: 3, icon: "zapier",    label: "Zapier"    },
    { slot: 4, icon: "make",      label: "Make"      },
    { slot: 5, icon: "anthropic", label: "Anthropic" },
    { slot: 6, icon: "slack",     label: "Slack"     },
  ],
};

const DEFAULT_NAV: NavContent = {
  ctaText: "Book a Call",
  ctaHref: "/contact-us",
};

const DEFAULT_STATS: StatsContent = {
  stats: [
    {
      label: "FASTER SHIPPING",
      value: "42%",
      description:
        "Automation eliminates handoffs and approvals so teams ship at the speed of AI.",
    },
    {
      label: "LOWER OPS COST",
      value: "28%",
      description:
        "Saved on run-rate by removing manual steps, rework, and duplicate tooling.",
    },
    {
      label: "HOURS RECOVERED",
      value: "12k+",
      description:
        "Returned to teams by automating data movement, follow-ups, and reporting.",
    },
    {
      label: "TIME TO DEPLOY",
      value: "4-6 wks",
      description:
        "From discovery to production workflows with full monitoring and governance.",
    },
  ],
};

const DEFAULT_FOOTER: FooterContent = {
  newsletterHeading: "Stay ahead of AI automation",
  newsletterSubtext: "Weekly insights for automation leaders.",
};

const TABS: { id: TabId; label: string }[] = [
  { id: "hero",   label: "Hero"   },
  { id: "nav",    label: "Navbar" },
  { id: "stats",  label: "Stats"  },
  { id: "footer", label: "Footer" },
];

// ── Shared input style ─────────────────────────────────────────────────────

const inputCls =
  "w-full bg-white border border-slate-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand/30 focus:ring-4 focus:ring-brand/5 transition-all text-[#1A1C1E] font-medium";

const labelCls = "block text-[9px] font-bold uppercase tracking-widest text-slate-400 mb-1.5 ml-1";

// ── Page component ─────────────────────────────────────────────────────────

export default function AdminSiteContentPage() {
  const [activeTab, setActiveTab] = useState<TabId>("hero");
  const [loading, setLoading]     = useState(true);

  const [heroContent,   setHeroContent]   = useState<HeroContent>(DEFAULT_HERO);
  const [navContent,    setNavContent]    = useState<NavContent>(DEFAULT_NAV);
  const [statsContent,  setStatsContent]  = useState<StatsContent>(DEFAULT_STATS);
  const [footerContent, setFooterContent] = useState<FooterContent>(DEFAULT_FOOTER);

  const [heroStatus,   setHeroStatus]   = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [navStatus,    setNavStatus]    = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [statsStatus,  setStatsStatus]  = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [footerStatus, setFooterStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");

  // ── Fetch all sections on mount ─────────────────────────────────────────

  useEffect(() => {
    const fetchAll = async () => {
      const [heroRes, navRes, statsRes, footerRes] = await Promise.all([
        api.get("site_content", { section: "hero"   }),
        api.get("site_content", { section: "nav"    }),
        api.get("site_content", { section: "stats"  }),
        api.get("site_content", { section: "footer" }),
      ]);

      if (heroRes?.status === "success" && heroRes.data) {
        setHeroContent(heroRes.data as HeroContent);
      }
      if (navRes?.status === "success" && navRes.data) {
        setNavContent(navRes.data as NavContent);
      }
      if (statsRes?.status === "success" && statsRes.data) {
        setStatsContent(statsRes.data as StatsContent);
      }
      if (footerRes?.status === "success" && footerRes.data) {
        setFooterContent(footerRes.data as FooterContent);
      }

      setLoading(false);
    };

    fetchAll();
  }, []);

  // ── Save helpers ───────────────────────────────────────────────────────

  const autoReset = (
    setter: React.Dispatch<React.SetStateAction<"idle" | "saving" | "saved" | "error">>,
    value: "saved" | "error",
  ) => {
    setter(value);
    setTimeout(() => setter("idle"), 3000);
  };

  const saveSection = async (
    section: TabId,
    content: HeroContent | NavContent | StatsContent | FooterContent,
    setStatus: React.Dispatch<React.SetStateAction<"idle" | "saving" | "saved" | "error">>,
  ) => {
    setStatus("saving");
    const res = await api.post("site_content", {
      action: "save_section",
      section,
      content,
    });
    if (res?.status === "success") {
      autoReset(setStatus, "saved");
    } else {
      autoReset(setStatus, "error");
    }
  };

  // ── Icon slot updater ──────────────────────────────────────────────────

  const updateIconSlot = (index: number, field: keyof IconSlot, value: string | number) => {
    setHeroContent((prev) => {
      const slots = [...prev.iconSlots];
      slots[index] = { ...slots[index], [field]: value };
      return { ...prev, iconSlots: slots };
    });
  };

  // ── Stats row updater ──────────────────────────────────────────────────

  const updateStatRow = (index: number, field: keyof StatRow, value: string) => {
    setStatsContent((prev) => {
      const stats = [...prev.stats];
      stats[index] = { ...stats[index], [field]: value };
      return { ...prev, stats };
    });
  };

  // ── Loading state ──────────────────────────────────────────────────────

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-[60vh]">
          <div className="text-brand font-display text-xl animate-pulse">Synchronizing Data...</div>
        </div>
      </AdminLayout>
    );
  }

  // ── Render ─────────────────────────────────────────────────────────────

  return (
    <AdminLayout>
      <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">

        {/* Page Header */}
        <div className="space-y-2">
          <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-brand">Content Management</p>
          <h1 className="text-5xl font-display font-bold text-[#1A1C1E] tracking-tight">Site Content</h1>
          <p className="text-slate-400 text-sm max-w-lg">
            Edit the live copy for your Hero section, Navbar CTA, Agency Stats, and Footer newsletter signup.
          </p>
        </div>

        {/* Tab Row */}
        <div className="flex gap-2 flex-wrap">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={
                activeTab === tab.id
                  ? "px-5 py-2.5 rounded-full text-[11px] font-bold tracking-widest uppercase bg-brand text-white shadow-lg shadow-brand/20 transition-all"
                  : "px-5 py-2.5 rounded-full text-[11px] font-bold tracking-widest uppercase bg-slate-100 text-slate-500 hover:bg-slate-200 transition-all"
              }
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* ── HERO TAB ────────────────────────────────────────────────────── */}
        {activeTab === "hero" && (
          <div className="bg-white border border-slate-100 rounded-[2.5rem] p-10 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.03)] space-y-8">
            <div className="border-b border-slate-50 pb-8 space-y-1">
              <h3 className="text-2xl font-bold text-[#1A1C1E]">Hero Section</h3>
              <p className="text-xs text-slate-400">Controls the main headline, subtitle, CTA button, and floating icon strip.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className={labelCls}>Heading</label>
                <input
                  type="text"
                  value={heroContent.heading}
                  onChange={(e) => setHeroContent((p) => ({ ...p, heading: e.target.value }))}
                  className={inputCls}
                />
              </div>
              <div>
                <label className={labelCls}>Title Highlight</label>
                <input
                  type="text"
                  value={heroContent.titleHighlight}
                  onChange={(e) => setHeroContent((p) => ({ ...p, titleHighlight: e.target.value }))}
                  className={inputCls}
                />
              </div>
            </div>

            <div>
              <label className={labelCls}>Subtitle Paragraph</label>
              <textarea
                rows={3}
                value={heroContent.subtitle}
                onChange={(e) => setHeroContent((p) => ({ ...p, subtitle: e.target.value }))}
                className={inputCls + " resize-none"}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className={labelCls}>CTA Button Text</label>
                <input
                  type="text"
                  value={heroContent.ctaText}
                  onChange={(e) => setHeroContent((p) => ({ ...p, ctaText: e.target.value }))}
                  className={inputCls}
                />
              </div>
              <div>
                <label className={labelCls}>CTA Button URL</label>
                <input
                  type="text"
                  value={heroContent.ctaHref}
                  onChange={(e) => setHeroContent((p) => ({ ...p, ctaHref: e.target.value }))}
                  className={inputCls}
                />
              </div>
            </div>

            {/* Icon Slots */}
            <div>
              <p className={labelCls}>Floating Icon Slots (6)</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-2">
                {heroContent.iconSlots.map((slot, i) => (
                  <div key={slot.slot} className="bg-slate-50/70 border border-slate-100 rounded-2xl p-4 space-y-3">
                    <p className="text-[9px] font-bold uppercase tracking-widest text-slate-400">Icon Slot {slot.slot}</p>
                    <div>
                      <label className="block text-[9px] text-slate-400 mb-1 ml-1">Icon</label>
                      <select
                        value={slot.icon}
                        onChange={(e) => updateIconSlot(i, "icon", e.target.value)}
                        className={inputCls}
                      >
                        {ICON_OPTIONS.map((opt) => (
                          <option key={opt} value={opt}>{opt}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-[9px] text-slate-400 mb-1 ml-1">Display Label</label>
                      <input
                        type="text"
                        value={slot.label}
                        onChange={(e) => updateIconSlot(i, "label", e.target.value)}
                        className={inputCls}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Save */}
            <div className="flex items-center justify-end gap-4 pt-4 border-t border-slate-50">
              {heroStatus === "saved"  && <span className="text-sm font-semibold text-emerald-500">Saved!</span>}
              {heroStatus === "error"  && <span className="text-sm font-semibold text-rose-500">Save failed.</span>}
              <Button
                onClick={() => saveSection("hero", heroContent, setHeroStatus)}
                disabled={heroStatus === "saving"}
                className="bg-brand hover:bg-brand/90 text-white px-8 h-12 rounded-2xl font-bold shadow-xl shadow-brand/20 transition-all active:scale-95"
              >
                {heroStatus === "saving" ? "Saving..." : "Save Hero"}
              </Button>
            </div>
          </div>
        )}

        {/* ── NAVBAR TAB ──────────────────────────────────────────────────── */}
        {activeTab === "nav" && (
          <div className="bg-white border border-slate-100 rounded-[2.5rem] p-10 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.03)] space-y-8">
            <div className="border-b border-slate-50 pb-8 space-y-1">
              <h3 className="text-2xl font-bold text-[#1A1C1E]">Navbar</h3>
              <p className="text-xs text-slate-400">Edit the top-right CTA button text and destination URL.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className={labelCls}>CTA Button Text</label>
                <input
                  type="text"
                  value={navContent.ctaText}
                  onChange={(e) => setNavContent((p) => ({ ...p, ctaText: e.target.value }))}
                  className={inputCls}
                />
              </div>
              <div>
                <label className={labelCls}>CTA Button URL</label>
                <input
                  type="text"
                  value={navContent.ctaHref}
                  onChange={(e) => setNavContent((p) => ({ ...p, ctaHref: e.target.value }))}
                  className={inputCls}
                />
              </div>
            </div>

            <p className="text-xs text-slate-400 italic">
              Dropdown menu structure (Services, Work, Insights) is managed in code.
            </p>

            {/* Save */}
            <div className="flex items-center justify-end gap-4 pt-4 border-t border-slate-50">
              {navStatus === "saved"  && <span className="text-sm font-semibold text-emerald-500">Saved!</span>}
              {navStatus === "error"  && <span className="text-sm font-semibold text-rose-500">Save failed.</span>}
              <Button
                onClick={() => saveSection("nav", navContent, setNavStatus)}
                disabled={navStatus === "saving"}
                className="bg-brand hover:bg-brand/90 text-white px-8 h-12 rounded-2xl font-bold shadow-xl shadow-brand/20 transition-all active:scale-95"
              >
                {navStatus === "saving" ? "Saving..." : "Save Navbar"}
              </Button>
            </div>
          </div>
        )}

        {/* ── STATS TAB ───────────────────────────────────────────────────── */}
        {activeTab === "stats" && (
          <div className="bg-white border border-slate-100 rounded-[2.5rem] p-10 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.03)] space-y-8">
            <div className="border-b border-slate-50 pb-8 space-y-1">
              <h3 className="text-2xl font-bold text-[#1A1C1E]">Agency Stats</h3>
              <p className="text-xs text-slate-400">Edit the 4 metric cards shown in the Agency Stats section of the homepage.</p>
            </div>

            <div className="space-y-6">
              {statsContent.stats.map((stat, i) => (
                <div key={i} className="bg-slate-50/70 border border-slate-100 rounded-2xl p-6">
                  <p className="text-[9px] font-bold uppercase tracking-widest text-slate-400 mb-4">Stat Row {i + 1}</p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className={labelCls}>Label</label>
                      <input
                        type="text"
                        value={stat.label}
                        onChange={(e) => updateStatRow(i, "label", e.target.value)}
                        className={inputCls}
                      />
                    </div>
                    <div>
                      <label className={labelCls}>Value</label>
                      <input
                        type="text"
                        value={stat.value}
                        onChange={(e) => updateStatRow(i, "value", e.target.value)}
                        className={inputCls}
                      />
                    </div>
                    <div>
                      <label className={labelCls}>Description</label>
                      <input
                        type="text"
                        value={stat.description}
                        onChange={(e) => updateStatRow(i, "description", e.target.value)}
                        className={inputCls}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Save */}
            <div className="flex items-center justify-end gap-4 pt-4 border-t border-slate-50">
              {statsStatus === "saved"  && <span className="text-sm font-semibold text-emerald-500">Saved!</span>}
              {statsStatus === "error"  && <span className="text-sm font-semibold text-rose-500">Save failed.</span>}
              <Button
                onClick={() => saveSection("stats", statsContent, setStatsStatus)}
                disabled={statsStatus === "saving"}
                className="bg-brand hover:bg-brand/90 text-white px-8 h-12 rounded-2xl font-bold shadow-xl shadow-brand/20 transition-all active:scale-95"
              >
                {statsStatus === "saving" ? "Saving..." : "Save Stats"}
              </Button>
            </div>
          </div>
        )}

        {/* ── FOOTER TAB ──────────────────────────────────────────────────── */}
        {activeTab === "footer" && (
          <div className="bg-white border border-slate-100 rounded-[2.5rem] p-10 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.03)] space-y-8">
            <div className="border-b border-slate-50 pb-8 space-y-1">
              <h3 className="text-2xl font-bold text-[#1A1C1E]">Footer</h3>
              <p className="text-xs text-slate-400">Edit the newsletter signup copy displayed in the site footer.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className={labelCls}>Newsletter Section Heading</label>
                <input
                  type="text"
                  value={footerContent.newsletterHeading}
                  onChange={(e) => setFooterContent((p) => ({ ...p, newsletterHeading: e.target.value }))}
                  className={inputCls}
                />
              </div>
              <div>
                <label className={labelCls}>Newsletter Subtext</label>
                <input
                  type="text"
                  value={footerContent.newsletterSubtext}
                  onChange={(e) => setFooterContent((p) => ({ ...p, newsletterSubtext: e.target.value }))}
                  className={inputCls}
                />
              </div>
            </div>

            <p className="text-xs text-slate-400 italic">
              Footer navigation links and social links are managed in code.
            </p>

            {/* Save */}
            <div className="flex items-center justify-end gap-4 pt-4 border-t border-slate-50">
              {footerStatus === "saved"  && <span className="text-sm font-semibold text-emerald-500">Saved!</span>}
              {footerStatus === "error"  && <span className="text-sm font-semibold text-rose-500">Save failed.</span>}
              <Button
                onClick={() => saveSection("footer", footerContent, setFooterStatus)}
                disabled={footerStatus === "saving"}
                className="bg-brand hover:bg-brand/90 text-white px-8 h-12 rounded-2xl font-bold shadow-xl shadow-brand/20 transition-all active:scale-95"
              >
                {footerStatus === "saving" ? "Saving..." : "Save Footer"}
              </Button>
            </div>
          </div>
        )}

      </div>
    </AdminLayout>
  );
}
