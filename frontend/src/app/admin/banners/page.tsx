"use client";

import React, { useState, useEffect } from "react";
import AdminLayout from "@/components/admin/admin-layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";

interface BannerConfig {
  enabled: boolean;
  text: string;
  ctaLabel: string;
  ctaLink: string;
  bgColor: string;
}
interface PopupConfig {
  enabled: boolean;
  title: string;
  body: string;
  ctaLabel: string;
  ctaLink: string;
  delayMs: number;
}
interface ExitPopupConfig {
  enabled: boolean;
  title: string;
  body: string;
  ctaLabel: string;
  ctaLink: string;
}
interface BannersState {
  banner: BannerConfig;
  popup: PopupConfig;
  exit_popup: ExitPopupConfig;
}

const DEFAULT: BannersState = {
  banner: { enabled: false, text: "AI automation audit slots open for next week.", ctaLabel: "Book a Call", ctaLink: "/contact-us", bgColor: "#2563EB" },
  popup: { enabled: false, title: "Ready to automate your ops?", body: "Get a 20-minute discovery call and a quick automation roadmap.", ctaLabel: "Schedule a Call", ctaLink: "/contact-us", delayMs: 5000 },
  exit_popup: { enabled: false, title: "Before you go", body: "Want a quick audit checklist? We will send it in minutes.", ctaLabel: "Get the Checklist", ctaLink: "/contact-us" },
};

export default function AdminBannersPage() {
  const [state, setState] = useState<BannersState>(DEFAULT);
  const [loading, setLoading] = useState(true);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');

  useEffect(() => {
    api.get("banners").then(res => {
      if (res?.status === "success" && res.data) {
        setState({
          banner: { ...DEFAULT.banner, ...(res.data.banner || {}) },
          popup: { ...DEFAULT.popup, ...(res.data.popup || {}) },
          exit_popup: { ...DEFAULT.exit_popup, ...(res.data.exit_popup || {}) },
        });
      }
    }).finally(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    setSaveStatus('saving');
    const res = await api.post("banners", { action: "save_banners", configs: state });
    setSaveStatus(res?.status === "success" ? 'saved' : 'error');
    setTimeout(() => setSaveStatus('idle'), 3000);
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-[60vh]">
          <div className="text-brand font-display text-xl animate-pulse">Loading banners config...</div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-10">
        <div className="space-y-2">
          <Badge className="rounded-full bg-brand/10 text-brand border border-brand/20 px-3 py-1 text-[10px] uppercase tracking-[0.2em]">
            Banners & Popups
          </Badge>
          <h1 className="text-4xl font-display font-bold text-[#1A1C1E]">Banners & Popups</h1>
          <p className="text-slate-400 text-sm">Configure announcement bar and popup messages. Saved to database.</p>
        </div>

        <div className="space-y-8">
          {/* Card 1 — Announcement Bar */}
          <div className="bg-white rounded-[2rem] border border-slate-100 p-8 shadow-sm space-y-6">
            <h2 className="text-xl font-bold text-[#1A1C1E]">Announcement Bar</h2>
            <label className="flex items-center gap-3 text-sm text-slate-600 cursor-pointer">
              <input
                type="checkbox"
                checked={state.banner.enabled}
                onChange={e => setState(prev => ({ ...prev, banner: { ...prev.banner, enabled: e.target.checked } }))}
                className="w-4 h-4 rounded"
              />
              Enabled
            </label>
            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">Banner Text</label>
              <input
                className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-700 focus:outline-none focus:border-brand/30"
                value={state.banner.text}
                onChange={e => setState(prev => ({ ...prev, banner: { ...prev.banner, text: e.target.value } }))}
                placeholder="Banner text"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">CTA Label</label>
                <input
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-700 focus:outline-none focus:border-brand/30"
                  value={state.banner.ctaLabel}
                  onChange={e => setState(prev => ({ ...prev, banner: { ...prev.banner, ctaLabel: e.target.value } }))}
                  placeholder="CTA label"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">CTA Link</label>
                <input
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-700 focus:outline-none focus:border-brand/30"
                  value={state.banner.ctaLink}
                  onChange={e => setState(prev => ({ ...prev, banner: { ...prev.banner, ctaLink: e.target.value } }))}
                  placeholder="CTA link"
                />
              </div>
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">Background Color</label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={state.banner.bgColor}
                  onChange={e => setState(prev => ({ ...prev, banner: { ...prev.banner, bgColor: e.target.value } }))}
                  className="w-10 h-10 rounded-lg border border-slate-200 cursor-pointer"
                />
                <span className="text-sm text-slate-500 font-mono">{state.banner.bgColor}</span>
              </div>
            </div>
          </div>

          {/* Card 2 — Timed Popup */}
          <div className="bg-white rounded-[2rem] border border-slate-100 p-8 shadow-sm space-y-6">
            <h2 className="text-xl font-bold text-[#1A1C1E]">Timed Popup</h2>
            <label className="flex items-center gap-3 text-sm text-slate-600 cursor-pointer">
              <input
                type="checkbox"
                checked={state.popup.enabled}
                onChange={e => setState(prev => ({ ...prev, popup: { ...prev.popup, enabled: e.target.checked } }))}
                className="w-4 h-4 rounded"
              />
              Enabled
            </label>
            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">Title</label>
              <input
                className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-700 focus:outline-none focus:border-brand/30"
                value={state.popup.title}
                onChange={e => setState(prev => ({ ...prev, popup: { ...prev.popup, title: e.target.value } }))}
                placeholder="Popup title"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">Body</label>
              <textarea
                className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-700 focus:outline-none focus:border-brand/30 resize-none"
                rows={3}
                value={state.popup.body}
                onChange={e => setState(prev => ({ ...prev, popup: { ...prev.popup, body: e.target.value } }))}
                placeholder="Popup body text"
              />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">CTA Label</label>
                <input
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-700 focus:outline-none focus:border-brand/30"
                  value={state.popup.ctaLabel}
                  onChange={e => setState(prev => ({ ...prev, popup: { ...prev.popup, ctaLabel: e.target.value } }))}
                  placeholder="CTA label"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">CTA Link</label>
                <input
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-700 focus:outline-none focus:border-brand/30"
                  value={state.popup.ctaLink}
                  onChange={e => setState(prev => ({ ...prev, popup: { ...prev.popup, ctaLink: e.target.value } }))}
                  placeholder="CTA link"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">Delay (ms)</label>
                <input
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-700 focus:outline-none focus:border-brand/30"
                  type="number"
                  value={state.popup.delayMs}
                  onChange={e => setState(prev => ({ ...prev, popup: { ...prev.popup, delayMs: Number(e.target.value) } }))}
                  placeholder="5000"
                />
              </div>
            </div>
          </div>

          {/* Card 3 — Exit-Intent Popup */}
          <div className="bg-white rounded-[2rem] border border-slate-100 p-8 shadow-sm space-y-6">
            <h2 className="text-xl font-bold text-[#1A1C1E]">Exit-Intent Popup</h2>
            <label className="flex items-center gap-3 text-sm text-slate-600 cursor-pointer">
              <input
                type="checkbox"
                checked={state.exit_popup.enabled}
                onChange={e => setState(prev => ({ ...prev, exit_popup: { ...prev.exit_popup, enabled: e.target.checked } }))}
                className="w-4 h-4 rounded"
              />
              Enabled
            </label>
            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">Title</label>
              <input
                className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-700 focus:outline-none focus:border-brand/30"
                value={state.exit_popup.title}
                onChange={e => setState(prev => ({ ...prev, exit_popup: { ...prev.exit_popup, title: e.target.value } }))}
                placeholder="Exit popup title"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">Body</label>
              <textarea
                className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-700 focus:outline-none focus:border-brand/30 resize-none"
                rows={3}
                value={state.exit_popup.body}
                onChange={e => setState(prev => ({ ...prev, exit_popup: { ...prev.exit_popup, body: e.target.value } }))}
                placeholder="Exit popup body text"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">CTA Label</label>
                <input
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-700 focus:outline-none focus:border-brand/30"
                  value={state.exit_popup.ctaLabel}
                  onChange={e => setState(prev => ({ ...prev, exit_popup: { ...prev.exit_popup, ctaLabel: e.target.value } }))}
                  placeholder="CTA label"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">CTA Link</label>
                <input
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-700 focus:outline-none focus:border-brand/30"
                  value={state.exit_popup.ctaLink}
                  onChange={e => setState(prev => ({ ...prev, exit_popup: { ...prev.exit_popup, ctaLink: e.target.value } }))}
                  placeholder="CTA link"
                />
              </div>
            </div>
          </div>

          {/* Publish Card */}
          <div className="bg-white rounded-[2rem] border border-slate-100 p-8 shadow-sm space-y-4">
            <h2 className="text-xl font-bold text-[#1A1C1E]">Publish</h2>
            <p className="text-slate-400 text-sm">Save all banner and popup configuration to the database.</p>
            <Button
              onClick={handleSave}
              disabled={saveStatus === 'saving'}
              className="bg-[#1A1C1E] hover:bg-[#2A2C2E] text-white rounded-xl h-11 px-8 font-bold"
            >
              {saveStatus === 'saving' ? 'Saving...' : saveStatus === 'saved' ? 'Saved!' : saveStatus === 'error' ? 'Error — Retry' : 'Save Changes'}
            </Button>
            <p className="text-xs text-amber-600 mt-2">Changes take effect on next page load. Announcement Bar and Exit-Intent Popup must be enabled here AND in code to display on the public site.</p>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
