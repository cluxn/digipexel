"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Users, MessageSquare, Eye, Trash2, Sparkles,
  Briefcase, Bell, Clock, TrendingUp,
  FileText, HelpCircle, RefreshCw,
} from "lucide-react";
import Link from "next/link";
import AdminLayout from "@/components/admin/admin-layout";
import { cn } from "@/lib/utils";
import { api } from "@/lib/api";

interface Lead {
  id: number;
  full_name: string;
  email: string;
  status?: string;
  created_at: string;
}

interface NudgeConfig {
  banner:    { enabled: boolean; text: string; ctaLabel: string; ctaLink: string };
  popup:     { enabled: boolean; title: string; body: string; ctaLabel: string; ctaLink: string; delayMs: number };
  exitPopup: { enabled: boolean; title: string; body: string; ctaLabel: string; ctaLink: string };
}

const DEFAULT_NUDGE: NudgeConfig = {
  banner:    { enabled: true, text: "AI automation audit slots open for next week.", ctaLabel: "Book a Call", ctaLink: "/contact-us" },
  popup:     { enabled: true, title: "Ready to automate your ops?", body: "", ctaLabel: "Schedule a Call", ctaLink: "/contact-us", delayMs: 5000 },
  exitPopup: { enabled: true, title: "Before you go", body: "", ctaLabel: "Get the Checklist", ctaLink: "/contact-us" },
};

const NUDGE_KEY = "DP_NUDGES_CONFIG";

// Counts derived from hardcoded fallback arrays used by public pages
const OFFLINE_COUNTS = { blogs: 5, case_studies: 5, guides: 6, testimonials: 8, leads: 0, subscribers: 0 };

function fmtDate(d: string) {
  try { return new Date(d).toLocaleDateString("en-GB"); } catch { return d; }
}

export default function AdminDashboard() {
  const [loading, setLoading]             = useState(true);
  const [refreshKey, setRefreshKey]       = useState(0);
  const [isOffline, setIsOffline]         = useState(false);
  const [blogCount, setBlogCount]         = useState(0);
  const [csCount, setCsCount]             = useState(0);
  const [guideCount, setGuideCount]       = useState(0);
  const [testimonialCount, setTestimonialCount] = useState(0);
  const [subscriberCount, setSubscriberCount]   = useState(0);
  const [totalLeadsCount, setTotalLeadsCount]   = useState(0);
  const [leads, setLeads]                 = useState<Lead[]>([]);
  const [nudge, setNudge]                 = useState<NudgeConfig>(DEFAULT_NUDGE);

  useEffect(() => {
    const stored = localStorage.getItem(NUDGE_KEY);
    if (stored) { try { setNudge({ ...DEFAULT_NUDGE, ...JSON.parse(stored) }); } catch {} }

    async function loadDashboard() {
      setIsOffline(false);
      let liveData = false;

      // Primary: single stats endpoint
      const [s, l] = await Promise.all([
        api.get("stats"),
        api.get("leads"),
      ]);

      if (l?.status === "success" && Array.isArray(l.data)) {
        setLeads(l.data);
        liveData = true;
      }

      if (s?.status === "success" && s.data) {
        setBlogCount((s.data as Record<string,number>).blogs ?? 0);
        setCsCount((s.data as Record<string,number>).case_studies ?? 0);
        setGuideCount((s.data as Record<string,number>).guides ?? 0);
        setTestimonialCount((s.data as Record<string,number>).testimonials ?? 0);
        setSubscriberCount((s.data as Record<string,number>).subscribers ?? 0);
        setTotalLeadsCount((s.data as Record<string,number>).leads ?? 0);
        liveData = true;
      } else {
        // Fallback: count directly from each content endpoint
        const [blogs, cs, guides, testimonials] = await Promise.all([
          api.get("blogs", { admin: "1" }),
          api.get("case_studies"),
          api.get("guides"),
          api.get("testimonials"),
        ]);
        if (blogs?.status === "success" && Array.isArray(blogs.data)) {
          setBlogCount((blogs.data as unknown[]).length);
          liveData = true;
        }
        if (cs?.status === "success" && Array.isArray(cs.data)) {
          setCsCount((cs.data as unknown[]).length);
          liveData = true;
        }
        if (guides?.status === "success" && Array.isArray(guides.data)) {
          setGuideCount((guides.data as unknown[]).length);
          liveData = true;
        }
        if (testimonials?.status === "success" && Array.isArray(testimonials.data)) {
          setTestimonialCount((testimonials.data as unknown[]).length);
          liveData = true;
        }
        if (l?.status === "success" && Array.isArray(l.data))
          setTotalLeadsCount((l.data as unknown[]).length);
      }

      // API completely unreachable — fall back to demo counts
      if (!liveData) {
        setIsOffline(true);
        setBlogCount(OFFLINE_COUNTS.blogs);
        setCsCount(OFFLINE_COUNTS.case_studies);
        setGuideCount(OFFLINE_COUNTS.guides);
        setTestimonialCount(OFFLINE_COUNTS.testimonials);
        setTotalLeadsCount(OFFLINE_COUNTS.leads);
        setSubscriberCount(OFFLINE_COUNTS.subscribers);
      }
    }

    loadDashboard().catch(() => { setIsOffline(true); }).finally(() => setLoading(false));
  }, [refreshKey]);

  const newLeads = leads.filter(l => (l.status ?? "new").toLowerCase() === "new").length;

  const stats = [
    { label: "New Leads",    value: loading ? "—" : String(newLeads),          color: "text-amber-500",   icon: Clock },
    { label: "Total Leads",  value: loading ? "—" : String(totalLeadsCount),    color: "text-rose-500",    icon: MessageSquare },
    { label: "Blog Posts",   value: loading ? "—" : String(blogCount),          color: "text-slate-500",   icon: FileText },
    { label: "Case Studies", value: loading ? "—" : String(csCount),            color: "text-[#1A1C1E]",   icon: Briefcase },
    { label: "Guides",       value: loading ? "—" : String(guideCount),         color: "text-emerald-500", icon: HelpCircle },
    { label: "Testimonials", value: loading ? "—" : String(testimonialCount),   color: "text-violet-500",  icon: MessageSquare },
    { label: "Subscribers",  value: loading ? "—" : String(subscriberCount),    color: "text-blue-500",    icon: Users },
  ];

  const disableNudge = (key: keyof NudgeConfig) => {
    const updated = { ...nudge, [key]: { ...(nudge[key] as object), enabled: false } } as NudgeConfig;
    setNudge(updated);
    localStorage.setItem(NUDGE_KEY, JSON.stringify(updated));
  };

  const nudgeCampaigns = [
    { key: "banner"    as const, title: "Top Banner",         trigger: "Always visible",                  enabled: nudge.banner.enabled },
    { key: "popup"     as const, title: "Timed Popup",        trigger: `Delay ${nudge.popup.delayMs / 1000}s`, enabled: nudge.popup.enabled },
    { key: "exitPopup" as const, title: "Exit Intent Popup",  trigger: "Exit intent",                     enabled: nudge.exitPopup.enabled },
  ];

  const recentLeads = leads.slice(0, 5);

  return (
    <AdminLayout>
      <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">

        {/* Offline notice */}
        {isOffline && !loading && (
          <div className="flex items-center gap-3 px-5 py-3 rounded-2xl bg-amber-50 border border-amber-200 text-amber-800 text-xs font-medium">
            <span className="w-2 h-2 rounded-full bg-amber-400 flex-shrink-0" />
            <span>
              <strong>API offline</strong> — showing demo counts. Deploy or start your local PHP server to load live data.
            </span>
          </div>
        )}

        {/* Header */}
        <div className="flex justify-between items-end flex-wrap gap-4">
          <div className="space-y-1">
            <h1 className="text-4xl font-display font-bold text-[#1A1C1E] tracking-tight">Admin Command Center</h1>
            <p className="text-slate-400 text-sm">Monitor agency growth and manage digital configurations.</p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              onClick={() => { setLoading(true); setRefreshKey(k => k + 1); }}
              disabled={loading}
              className="rounded-xl border-slate-200 text-slate-600 h-11 px-5 font-bold flex gap-2"
              title="Refresh live data"
            >
              <RefreshCw className={cn("w-4 h-4", loading && "animate-spin")} />
              {loading ? "Syncing…" : "Sync"}
            </Button>
            <Link href="/admin/leads">
              <Button variant="outline" className="rounded-xl border-slate-200 text-slate-600 h-11 px-6 font-bold flex gap-2">
                <Bell className="w-4 h-4" />
                {!loading && newLeads > 0 ? `${newLeads} New` : "Notifications"}
              </Button>
            </Link>
            <Link href="/admin/analytics">
              <Button className="bg-[#1A1C1E] hover:bg-[#2A2C2E] text-white rounded-xl h-11 px-6 font-bold flex gap-2 shadow-lg shadow-black/10">
                <TrendingUp className="w-4 h-4" />
                View Analytics
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
          {stats.map((stat, i) => (
            <div key={i} className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-black/5 transition-all duration-500 group">
              <div className="space-y-3">
                <div className="flex justify-between items-start">
                  <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-slate-400 leading-tight">{stat.label}</span>
                  <stat.icon className={cn("w-4 h-4 opacity-20 group-hover:opacity-100 transition-opacity", stat.color)} />
                </div>
                <span className={cn("text-3xl font-bold tracking-tight block", stat.color)}>{stat.value}</span>
                {isOffline && !loading && (
                  <span className="text-[8px] font-bold uppercase tracking-widest text-amber-500">Demo</span>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Captured Leads + Nudge Campaigns */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">

          {/* Captured Leads */}
          <div className="bg-white rounded-[3.5rem] border border-slate-100 p-12 shadow-sm space-y-8">
            <div className="flex justify-between items-center">
              <div className="space-y-1">
                <h3 className="text-2xl font-bold text-[#1A1C1E]">Captured Leads</h3>
                <p className="text-slate-400 text-xs">Recently submitted inquiries from Digi Pexel site.</p>
              </div>
              <Link href="/admin/leads">
                <Button variant="outline" className="rounded-2xl border-slate-100 text-[#1A1C1E] font-bold h-12 px-6">
                  View All
                </Button>
              </Link>
            </div>

            <div className="space-y-4">
              {loading && (
                <div className="text-center py-10 text-slate-300 text-sm animate-pulse">Loading leads…</div>
              )}
              {!loading && recentLeads.length === 0 && (
                <div className="text-center py-10 border-2 border-dashed border-slate-100 rounded-3xl">
                  <Users className="w-8 h-8 text-slate-200 mx-auto mb-3" />
                  <p className="text-slate-400 text-sm font-medium">No leads yet</p>
                  <p className="text-slate-300 text-xs mt-1">Leads submitted through the site will appear here.</p>
                </div>
              )}
              {recentLeads.map((lead) => {
                const st = (lead.status ?? "new").toLowerCase();
                return (
                  <div key={lead.id} className="flex items-center justify-between p-5 rounded-3xl bg-slate-50/50 border border-transparent hover:border-slate-100 hover:bg-white transition-all group">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-2xl bg-white border border-slate-100 flex items-center justify-center font-bold text-slate-400 text-sm">
                        {lead.full_name?.[0] ?? "?"}
                      </div>
                      <div>
                        <p className="font-bold text-[#1A1C1E] text-sm">{lead.full_name}</p>
                        <p className="text-xs text-slate-400">{lead.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <p className="text-xs font-bold text-slate-400 hidden sm:block">{fmtDate(lead.created_at)}</p>
                      <span className={cn(
                        "px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider",
                        st === "new"        ? "bg-brand/10 text-brand" :
                        st === "contacted"  ? "bg-emerald-50 text-emerald-600" :
                                             "bg-slate-100 text-slate-400"
                      )}>
                        {lead.status ?? "New"}
                      </span>
                      <Link href="/admin/leads">
                        <Button variant="ghost" size="icon" className="rounded-xl opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8">
                          <Eye className="w-4 h-4 text-slate-400" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Nudge Campaigns */}
          <div className="bg-white rounded-[3.5rem] border border-slate-100 p-12 shadow-sm space-y-8">
            <div className="flex justify-between items-center">
              <div className="space-y-1">
                <h3 className="text-2xl font-bold text-[#1A1C1E]">Nudge Campaigns</h3>
                <p className="text-slate-400 text-xs">Active high-conversion popups and triggers.</p>
              </div>
              <Link href="/admin/nudges">
                <Button className="bg-[#1A1C1E] text-white rounded-2xl font-bold h-12 px-6">
                  Manage
                </Button>
              </Link>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {nudgeCampaigns.map((n) => (
                <div key={n.key} className={cn(
                  "p-6 rounded-[2rem] border relative overflow-hidden group flex items-center justify-between gap-4",
                  n.enabled ? "bg-slate-50 border-slate-100" : "bg-white border-slate-100 opacity-50"
                )}>
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm flex-shrink-0">
                      <Sparkles className="w-5 h-5 text-brand" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-bold text-[#1A1C1E] text-sm">{n.title}</p>
                        {n.enabled && <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />}
                      </div>
                      <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest">{n.trigger}</p>
                    </div>
                  </div>
                  <div className="flex gap-2 flex-shrink-0">
                    <Link href="/admin/nudges">
                      <Button variant="outline" size="sm" className="rounded-xl h-8 px-4 text-[10px] font-bold border-slate-200">
                        Settings
                      </Button>
                    </Link>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => disableNudge(n.key)}
                      disabled={!n.enabled}
                      className="rounded-xl h-8 w-8 text-rose-400 hover:bg-rose-50 disabled:opacity-30"
                      title="Disable this nudge"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </AdminLayout>
  );
}
