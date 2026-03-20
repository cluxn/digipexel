"use client";

import React from "react";
import AdminLayout from "@/components/admin/admin-layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

type NudgeConfig = {
  banner: {
    enabled: boolean;
    text: string;
    ctaLabel: string;
    ctaLink: string;
  };
  popup: {
    enabled: boolean;
    title: string;
    body: string;
    ctaLabel: string;
    ctaLink: string;
    delayMs: number;
  };
  exitPopup: {
    enabled: boolean;
    title: string;
    body: string;
    ctaLabel: string;
    ctaLink: string;
  };
};

const DEFAULT_CONFIG: NudgeConfig = {
  banner: {
    enabled: true,
    text: "AI automation audit slots open for next week.",
    ctaLabel: "Book a Call",
    ctaLink: "/contact-us",
  },
  popup: {
    enabled: true,
    title: "Ready to automate your ops?",
    body: "Get a 20-minute discovery call and a quick automation roadmap.",
    ctaLabel: "Schedule a Call",
    ctaLink: "/contact-us",
    delayMs: 5000,
  },
  exitPopup: {
    enabled: true,
    title: "Before you go",
    body: "Want a quick audit checklist? We’ll send it in minutes.",
    ctaLabel: "Get the Checklist",
    ctaLink: "/contact-us",
  },
};

const CONFIG_KEY = "DP_NUDGES_CONFIG";

export default function AdminNudgesPage() {
  const [config, setConfig] = React.useState<NudgeConfig>(DEFAULT_CONFIG);
  const [saved, setSaved] = React.useState(false);

  React.useEffect(() => {
    const stored = localStorage.getItem(CONFIG_KEY);
    if (stored) {
      try {
        setConfig({ ...DEFAULT_CONFIG, ...JSON.parse(stored) });
      } catch {
        setConfig(DEFAULT_CONFIG);
      }
    }
  }, []);

  const handleSave = () => {
    localStorage.setItem(CONFIG_KEY, JSON.stringify(config));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <AdminLayout>
      <div className="space-y-10">
        <div className="space-y-2">
          <Badge className="rounded-full bg-brand/10 text-brand border border-brand/20 px-3 py-1 text-[10px] uppercase tracking-[0.2em]">
            Nudges Control
          </Badge>
          <h1 className="text-4xl font-display font-bold text-[#1A1C1E]">Nudges</h1>
          <p className="text-slate-400 text-sm">
            Configure banners and popups. Changes apply on refresh for the same browser session.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white border border-slate-100 rounded-[2rem] p-8 space-y-6">
            <h2 className="text-xl font-bold text-[#1A1C1E]">Banner</h2>
            <label className="flex items-center gap-3 text-sm text-slate-600">
              <input
                type="checkbox"
                checked={config.banner.enabled}
                onChange={(e) => setConfig({ ...config, banner: { ...config.banner, enabled: e.target.checked } })}
              />
              Enabled
            </label>
            <input
              className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm"
              value={config.banner.text}
              onChange={(e) => setConfig({ ...config, banner: { ...config.banner, text: e.target.value } })}
              placeholder="Banner text"
            />
            <div className="grid grid-cols-2 gap-4">
              <input
                className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm"
                value={config.banner.ctaLabel}
                onChange={(e) => setConfig({ ...config, banner: { ...config.banner, ctaLabel: e.target.value } })}
                placeholder="CTA label"
              />
              <input
                className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm"
                value={config.banner.ctaLink}
                onChange={(e) => setConfig({ ...config, banner: { ...config.banner, ctaLink: e.target.value } })}
                placeholder="CTA link"
              />
            </div>
          </div>

          <div className="bg-white border border-slate-100 rounded-[2rem] p-8 space-y-6">
            <h2 className="text-xl font-bold text-[#1A1C1E]">Popup</h2>
            <label className="flex items-center gap-3 text-sm text-slate-600">
              <input
                type="checkbox"
                checked={config.popup.enabled}
                onChange={(e) => setConfig({ ...config, popup: { ...config.popup, enabled: e.target.checked } })}
              />
              Enabled
            </label>
            <input
              className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm"
              value={config.popup.title}
              onChange={(e) => setConfig({ ...config, popup: { ...config.popup, title: e.target.value } })}
              placeholder="Popup title"
            />
            <textarea
              className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm"
              rows={3}
              value={config.popup.body}
              onChange={(e) => setConfig({ ...config, popup: { ...config.popup, body: e.target.value } })}
              placeholder="Popup body"
            />
            <div className="grid grid-cols-3 gap-4">
              <input
                className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm"
                value={config.popup.ctaLabel}
                onChange={(e) => setConfig({ ...config, popup: { ...config.popup, ctaLabel: e.target.value } })}
                placeholder="CTA label"
              />
              <input
                className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm"
                value={config.popup.ctaLink}
                onChange={(e) => setConfig({ ...config, popup: { ...config.popup, ctaLink: e.target.value } })}
                placeholder="CTA link"
              />
              <input
                className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm"
                type="number"
                value={config.popup.delayMs}
                onChange={(e) => setConfig({ ...config, popup: { ...config.popup, delayMs: Number(e.target.value) } })}
                placeholder="Delay (ms)"
              />
            </div>
          </div>

          <div className="bg-white border border-slate-100 rounded-[2rem] p-8 space-y-6">
            <h2 className="text-xl font-bold text-[#1A1C1E]">Exit Popup</h2>
            <label className="flex items-center gap-3 text-sm text-slate-600">
              <input
                type="checkbox"
                checked={config.exitPopup.enabled}
                onChange={(e) => setConfig({ ...config, exitPopup: { ...config.exitPopup, enabled: e.target.checked } })}
              />
              Enabled after closing the popup
            </label>
            <input
              className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm"
              value={config.exitPopup.title}
              onChange={(e) => setConfig({ ...config, exitPopup: { ...config.exitPopup, title: e.target.value } })}
              placeholder="Exit title"
            />
            <textarea
              className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm"
              rows={3}
              value={config.exitPopup.body}
              onChange={(e) => setConfig({ ...config, exitPopup: { ...config.exitPopup, body: e.target.value } })}
              placeholder="Exit body"
            />
            <div className="grid grid-cols-2 gap-4">
              <input
                className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm"
                value={config.exitPopup.ctaLabel}
                onChange={(e) => setConfig({ ...config, exitPopup: { ...config.exitPopup, ctaLabel: e.target.value } })}
                placeholder="CTA label"
              />
              <input
                className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm"
                value={config.exitPopup.ctaLink}
                onChange={(e) => setConfig({ ...config, exitPopup: { ...config.exitPopup, ctaLink: e.target.value } })}
                placeholder="CTA link"
              />
            </div>
          </div>

          <div className="bg-white border border-slate-100 rounded-[2rem] p-8 space-y-6">
            <h2 className="text-xl font-bold text-[#1A1C1E]">Publish</h2>
            <p className="text-slate-400 text-sm">
              Save updates and refresh the public site to see changes.
            </p>
            <Button
              className="rounded-full px-8 py-4 h-auto font-bold shadow-xl shadow-brand/10"
              onClick={handleSave}
            >
              {saved ? "Saved" : "Save Changes"}
            </Button>
            <pre className="text-xs bg-slate-50 border border-slate-100 rounded-xl p-4 overflow-auto">
{JSON.stringify(config, null, 2)}
            </pre>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
