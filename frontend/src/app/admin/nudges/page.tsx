"use client";

import React, { useState, useEffect, useCallback } from "react";
import AdminLayout from "@/components/admin/admin-layout";
import { api } from "@/lib/api";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, Edit2, Check, AlertCircle } from "lucide-react";

// ── Types ─────────────────────────────────────────────────────────────────────

interface BannerCfg   { enabled: boolean; text: string; ctaLabel: string; ctaLink: string; bgColor: string; }
interface PopupCfg    { enabled: boolean; title: string; body: string; ctaLabel: string; ctaLink: string; delayMs: number; targetUrl: string; }
interface ExitCfg     { enabled: boolean; title: string; body: string; ctaLabel: string; ctaLink: string; }
interface NudgeCfg    { enabled: boolean; message: string; ctaLabel: string; ctaLink: string; position: string; delayMs: number; }
interface MiniCTA     { label: string; url: string; style: string; }
interface MiniCtasCfg { items: MiniCTA[]; }
interface LeadFormCfg { heading: string; subtext: string; ctaLabel: string; fields: string[]; }

interface AllConfigs {
  banner:     BannerCfg;
  popup:      PopupCfg;
  exit_popup: ExitCfg;
  nudge:      NudgeCfg;
  mini_ctas:  MiniCtasCfg;
  lead_form:  LeadFormCfg;
}

type Tab = "popups" | "announcement" | "nudge" | "banners" | "mini_ctas" | "lead_forms";
type SaveState = "idle" | "saving" | "saved" | "error";

const TABS: { key: Tab; label: string }[] = [
  { key: "popups",       label: "Popups" },
  { key: "announcement", label: "Announcement Bar" },
  { key: "nudge",        label: "Nudge" },
  { key: "banners",      label: "Banners" },
  { key: "mini_ctas",    label: "Mini CTAs" },
  { key: "lead_forms",   label: "Lead Forms" },
];

const DEFAULTS: AllConfigs = {
  banner:     { enabled: false, text: "AI automation audit slots open for next week.", ctaLabel: "Book a Call", ctaLink: "/contact-us", bgColor: "#2563EB" },
  popup:      { enabled: false, title: "Ready to automate your ops?", body: "Get a 20-minute discovery call and a quick automation roadmap.", ctaLabel: "Schedule a Call", ctaLink: "/contact-us", delayMs: 5000, targetUrl: "/*" },
  exit_popup: { enabled: false, title: "Before you go", body: "Want a quick audit checklist? We will send it in minutes.", ctaLabel: "Get the Checklist", ctaLink: "/contact-us" },
  nudge:      { enabled: false, message: "Limited automation audit slots available this week!", ctaLabel: "Claim your spot", ctaLink: "/contact-us", position: "bottom-right", delayMs: 3000 },
  mini_ctas:  { items: [{ label: "Free Audit", url: "/contact-us", style: "filled" }, { label: "Book a Call", url: "/contact-us", style: "outline" }] },
  lead_form:  { heading: "Ready to automate your ops?", subtext: "Fill in your details and we will send a custom automation roadmap in 24 hours.", ctaLabel: "Send My Roadmap", fields: ["name","email","company","phone","service"] },
};

// ── Shared helpers ─────────────────────────────────────────────────────────────

const I = "w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-400 bg-white";
const L = "block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className={L}>{label}</label>
      {children}
    </div>
  );
}

function Toggle({ checked, onChange, label, desc }: { checked: boolean; onChange: (v: boolean) => void; label: string; desc?: string }) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-slate-100">
      <div>
        <p className="text-sm font-semibold text-slate-800">{label}</p>
        {desc && <p className="text-[11px] text-slate-400 mt-0.5">{desc}</p>}
      </div>
      <label className="relative inline-flex items-center cursor-pointer">
        <input type="checkbox" className="sr-only peer" checked={checked} onChange={e => onChange(e.target.checked)} />
        <div className="w-10 h-5 bg-slate-200 rounded-full peer peer-checked:bg-blue-600 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-5" />
      </label>
    </div>
  );
}

function SaveBar({ status, onSave, label = "Save Changes" }: { status: SaveState; onSave: () => void; label?: string }) {
  return (
    <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
      <Button
        onClick={onSave}
        disabled={status === "saving"}
        className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-5"
      >
        {status === "saving" ? "Saving…" : label}
      </Button>
      {status === "saved" && <span className="text-xs text-emerald-600 font-semibold flex items-center gap-1"><Check className="w-3 h-3" /> Saved</span>}
      {status === "error" && <span className="text-xs text-rose-600 font-semibold flex items-center gap-1"><AlertCircle className="w-3 h-3" /> Error</span>}
    </div>
  );
}

// ── Component ──────────────────────────────────────────────────────────────────

export default function AdminMarketingPage() {
  const [tab, setTab]       = useState<Tab>("popups");
  const [cfg, setCfg]       = useState<AllConfigs>(DEFAULTS);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<SaveState>("idle");

  const load = useCallback(async () => {
    setLoading(true);
    const res = await api.get("banners");
    if (res?.status === "success" && res.data) {
      const d = res.data as Partial<AllConfigs>;
      setCfg({
        banner:     { ...DEFAULTS.banner,     ...(d.banner     || {}) },
        popup:      { ...DEFAULTS.popup,      ...(d.popup      || {}) },
        exit_popup: { ...DEFAULTS.exit_popup, ...(d.exit_popup || {}) },
        nudge:      { ...DEFAULTS.nudge,      ...(d.nudge      || {}) },
        mini_ctas:  { ...DEFAULTS.mini_ctas,  ...(d.mini_ctas  || {}) },
        lead_form:  { ...DEFAULTS.lead_form,  ...(d.lead_form  || {}) },
      });
    }
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const save = async (partial: Partial<AllConfigs>) => {
    setStatus("saving");
    const res = await api.post("banners", { action: "save_banners", configs: { ...cfg, ...partial } });
    if (res?.status === "success") {
      setCfg(prev => ({ ...prev, ...partial }));
      setStatus("saved");
    } else {
      setStatus("error");
    }
    setTimeout(() => setStatus("idle"), 3000);
  };

  const upd = <K extends keyof AllConfigs>(key: K, patch: Partial<AllConfigs[K]>) => {
    setCfg(prev => ({ ...prev, [key]: { ...prev[key], ...patch } }));
  };

  if (loading) return (
    <AdminLayout>
      <div className="flex items-center justify-center h-[60vh] text-slate-400 animate-pulse text-sm">Loading marketing config…</div>
    </AdminLayout>
  );

  return (
    <AdminLayout>
      <div className="space-y-5 pb-10">

        {/* Tab nav */}
        <div className="border-b border-slate-200">
          <div className="flex gap-0 overflow-x-auto">
            {TABS.map(t => (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className={cn(
                  "whitespace-nowrap px-4 py-3 text-sm font-medium border-b-2 transition-colors",
                  tab === t.key
                    ? "border-blue-600 text-blue-600"
                    : "border-transparent text-slate-500 hover:text-slate-700"
                )}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* ── POPUPS ──────────────────────────────────────────────────────── */}
        {tab === "popups" && (
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold text-slate-900">Popups</h1>
            </div>

            {/* Timed Popup */}
            <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-bold text-slate-800">Timed Popup</h2>
                <span className={cn(
                  "text-[11px] font-semibold px-2.5 py-1 rounded-full",
                  cfg.popup.enabled ? "bg-emerald-50 text-emerald-600" : "bg-slate-100 text-slate-400"
                )}>
                  {cfg.popup.enabled ? "Live" : "Disabled"}
                </span>
              </div>
              <Toggle checked={cfg.popup.enabled} onChange={v => upd("popup", { enabled: v })} label="Enable on save" desc="Shows automatically after the delay" />
              <Field label="Name / Internal Label">
                <input className={I} value={cfg.popup.title} onChange={e => upd("popup", { title: e.target.value })} placeholder="e.g. Homepage timed popup" />
              </Field>
              <div className="grid grid-cols-2 gap-4">
                <Field label="Target URL Pattern">
                  <input className={I} value={cfg.popup.targetUrl} onChange={e => upd("popup", { targetUrl: e.target.value })} placeholder="/*" />
                </Field>
                <Field label="Delay (ms)">
                  <input className={I} type="number" value={cfg.popup.delayMs} onChange={e => upd("popup", { delayMs: Number(e.target.value) })} placeholder="5000" />
                </Field>
              </div>
              <Field label="Body Text">
                <textarea className={I} rows={2} value={cfg.popup.body} onChange={e => upd("popup", { body: e.target.value })} placeholder="Popup message" />
              </Field>
              <div className="grid grid-cols-2 gap-4">
                <Field label="CTA Label">
                  <input className={I} value={cfg.popup.ctaLabel} onChange={e => upd("popup", { ctaLabel: e.target.value })} />
                </Field>
                <Field label="CTA Link">
                  <input className={I} value={cfg.popup.ctaLink} onChange={e => upd("popup", { ctaLink: e.target.value })} />
                </Field>
              </div>
            </div>

            {/* Exit Intent */}
            <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-bold text-slate-800">Exit-Intent Popup</h2>
                <span className={cn(
                  "text-[11px] font-semibold px-2.5 py-1 rounded-full",
                  cfg.exit_popup.enabled ? "bg-emerald-50 text-emerald-600" : "bg-slate-100 text-slate-400"
                )}>
                  {cfg.exit_popup.enabled ? "Live" : "Disabled"}
                </span>
              </div>
              <Toggle checked={cfg.exit_popup.enabled} onChange={v => upd("exit_popup", { enabled: v })} label="Enable on save" desc="Triggers when cursor moves to browser chrome" />
              <Field label="Title">
                <input className={I} value={cfg.exit_popup.title} onChange={e => upd("exit_popup", { title: e.target.value })} placeholder="Before you go…" />
              </Field>
              <Field label="Body">
                <textarea className={I} rows={2} value={cfg.exit_popup.body} onChange={e => upd("exit_popup", { body: e.target.value })} />
              </Field>
              <div className="grid grid-cols-2 gap-4">
                <Field label="CTA Label">
                  <input className={I} value={cfg.exit_popup.ctaLabel} onChange={e => upd("exit_popup", { ctaLabel: e.target.value })} />
                </Field>
                <Field label="CTA Link">
                  <input className={I} value={cfg.exit_popup.ctaLink} onChange={e => upd("exit_popup", { ctaLink: e.target.value })} />
                </Field>
              </div>
            </div>

            {/* Popup status table */}
            <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50">
                    <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-widest text-slate-400">Name</th>
                    <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-widest text-slate-400">Target</th>
                    <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-widest text-slate-400">Live</th>
                    <th className="px-4 py-3 text-right text-[10px] font-bold uppercase tracking-widest text-slate-400">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { name: cfg.popup.title || "Timed Popup", target: cfg.popup.targetUrl || "/*", live: cfg.popup.enabled, editTo: () => {} },
                    { name: cfg.exit_popup.title || "Exit-Intent Popup", target: "All pages", live: cfg.exit_popup.enabled, editTo: () => {} },
                  ].map((row, i) => (
                    <tr key={i} className="border-b border-slate-50 hover:bg-slate-50">
                      <td className="px-4 py-3 text-sm text-slate-800">{row.name}</td>
                      <td className="px-4 py-3 text-sm text-slate-500 font-mono">{row.target}</td>
                      <td className="px-4 py-3">
                        <span className={cn("text-[11px] font-semibold px-2 py-0.5 rounded-full", row.live ? "bg-emerald-50 text-emerald-600" : "bg-slate-100 text-slate-400")}>
                          {row.live ? "Live" : "Off"}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <button onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} className="text-slate-400 hover:text-blue-600 transition-colors">
                          <Edit2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <SaveBar status={status} onSave={() => save({ popup: cfg.popup, exit_popup: cfg.exit_popup })} label="Save Popups" />
          </div>
        )}

        {/* ── ANNOUNCEMENT BAR ────────────────────────────────────────────── */}
        {tab === "announcement" && (
          <div className="space-y-5">
            <h1 className="text-2xl font-bold text-slate-900">Announcement Bar</h1>
            <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-5">
              <Toggle
                checked={cfg.banner.enabled}
                onChange={v => upd("banner", { enabled: v })}
                label="Enable Announcement Bar"
                desc="Shows a thin strip at the very top of every page"
              />
              <Field label="Message Text">
                <input className={I} value={cfg.banner.text} onChange={e => upd("banner", { text: e.target.value })} placeholder="AI automation audit slots open for next week." />
              </Field>
              <div className="grid grid-cols-2 gap-4">
                <Field label="CTA Label">
                  <input className={I} value={cfg.banner.ctaLabel} onChange={e => upd("banner", { ctaLabel: e.target.value })} />
                </Field>
                <Field label="CTA Link">
                  <input className={I} value={cfg.banner.ctaLink} onChange={e => upd("banner", { ctaLink: e.target.value })} />
                </Field>
              </div>
              <Field label="Background Color">
                <div className="flex items-center gap-3">
                  <input type="color" value={cfg.banner.bgColor} onChange={e => upd("banner", { bgColor: e.target.value })} className="w-10 h-10 rounded-lg border border-slate-200 cursor-pointer p-1" />
                  <code className="text-sm text-slate-600 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200">{cfg.banner.bgColor}</code>
                </div>
              </Field>

              {/* Live preview */}
              <div className="rounded-lg overflow-hidden border border-slate-200">
                <div style={{ backgroundColor: cfg.banner.bgColor }} className="flex items-center justify-center gap-4 px-4 py-2.5 text-white text-sm">
                  <span>{cfg.banner.text}</span>
                  <span className="bg-white/20 rounded px-3 py-1 text-xs font-semibold">{cfg.banner.ctaLabel}</span>
                </div>
                <p className="text-[10px] text-slate-400 text-center py-1.5 bg-slate-50">Live Preview</p>
              </div>

              <SaveBar status={status} onSave={() => save({ banner: cfg.banner })} label="Save Announcement Bar" />
            </div>
          </div>
        )}

        {/* ── NUDGE ───────────────────────────────────────────────────────── */}
        {tab === "nudge" && (
          <div className="space-y-5">
            <h1 className="text-2xl font-bold text-slate-900">Nudge</h1>
            <p className="text-sm text-slate-500">A floating corner notification that appears after a delay — softer than a popup.</p>
            <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-5">
              <Toggle
                checked={cfg.nudge.enabled}
                onChange={v => upd("nudge", { enabled: v })}
                label="Enable Nudge"
                desc="Floating toast notification in the corner of the page"
              />
              <Field label="Message">
                <input className={I} value={cfg.nudge.message} onChange={e => upd("nudge", { message: e.target.value })} placeholder="Limited automation audit slots available this week!" />
              </Field>
              <div className="grid grid-cols-2 gap-4">
                <Field label="CTA Label">
                  <input className={I} value={cfg.nudge.ctaLabel} onChange={e => upd("nudge", { ctaLabel: e.target.value })} />
                </Field>
                <Field label="CTA Link">
                  <input className={I} value={cfg.nudge.ctaLink} onChange={e => upd("nudge", { ctaLink: e.target.value })} />
                </Field>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Field label="Position">
                  <select className={I} value={cfg.nudge.position} onChange={e => upd("nudge", { position: e.target.value })}>
                    <option value="bottom-right">Bottom Right</option>
                    <option value="bottom-left">Bottom Left</option>
                    <option value="top-right">Top Right</option>
                    <option value="top-left">Top Left</option>
                  </select>
                </Field>
                <Field label="Delay (ms)">
                  <input className={I} type="number" value={cfg.nudge.delayMs} onChange={e => upd("nudge", { delayMs: Number(e.target.value) })} placeholder="3000" />
                </Field>
              </div>

              {/* Preview */}
              <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                <p className="text-[10px] text-slate-400 uppercase tracking-wider mb-3">Preview</p>
                <div className="bg-white border border-slate-200 rounded-xl shadow-lg p-4 inline-block max-w-xs">
                  <p className="text-sm font-semibold text-slate-800">{cfg.nudge.message || "Your nudge message"}</p>
                  <button className="mt-2 text-xs text-blue-600 font-semibold">{cfg.nudge.ctaLabel || "CTA Label"} →</button>
                </div>
              </div>

              <SaveBar status={status} onSave={() => save({ nudge: cfg.nudge })} label="Save Nudge" />
            </div>
          </div>
        )}

        {/* ── BANNERS ─────────────────────────────────────────────────────── */}
        {tab === "banners" && (
          <div className="space-y-5">
            <h1 className="text-2xl font-bold text-slate-900">Banners</h1>
            <p className="text-sm text-slate-500">Configure the announcement bar and popup banners in one place.</p>

            <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-5">
              <h2 className="text-base font-bold text-slate-800">Announcement Bar</h2>
              <div className="grid grid-cols-3 gap-3">
                <div className={cn("border-2 rounded-lg p-3 text-center cursor-pointer text-xs font-semibold transition-colors", cfg.banner.enabled ? "border-blue-500 bg-blue-50 text-blue-600" : "border-slate-200 text-slate-400")} onClick={() => upd("banner", { enabled: !cfg.banner.enabled })}>
                  {cfg.banner.enabled ? "● Enabled" : "○ Disabled"}
                </div>
                <div className="col-span-2">
                  <input className={I} value={cfg.banner.text} onChange={e => upd("banner", { text: e.target.value })} placeholder="Banner message" />
                </div>
              </div>

              <h2 className="text-base font-bold text-slate-800 pt-2 border-t border-slate-100">Timed Popup</h2>
              <div className="grid grid-cols-3 gap-3">
                <div className={cn("border-2 rounded-lg p-3 text-center cursor-pointer text-xs font-semibold transition-colors", cfg.popup.enabled ? "border-blue-500 bg-blue-50 text-blue-600" : "border-slate-200 text-slate-400")} onClick={() => upd("popup", { enabled: !cfg.popup.enabled })}>
                  {cfg.popup.enabled ? "● Enabled" : "○ Disabled"}
                </div>
                <div className="col-span-2">
                  <input className={I} value={cfg.popup.title} onChange={e => upd("popup", { title: e.target.value })} placeholder="Popup title" />
                </div>
              </div>

              <h2 className="text-base font-bold text-slate-800 pt-2 border-t border-slate-100">Exit-Intent</h2>
              <div className="grid grid-cols-3 gap-3">
                <div className={cn("border-2 rounded-lg p-3 text-center cursor-pointer text-xs font-semibold transition-colors", cfg.exit_popup.enabled ? "border-blue-500 bg-blue-50 text-blue-600" : "border-slate-200 text-slate-400")} onClick={() => upd("exit_popup", { enabled: !cfg.exit_popup.enabled })}>
                  {cfg.exit_popup.enabled ? "● Enabled" : "○ Disabled"}
                </div>
                <div className="col-span-2">
                  <input className={I} value={cfg.exit_popup.title} onChange={e => upd("exit_popup", { title: e.target.value })} placeholder="Exit popup title" />
                </div>
              </div>

              <SaveBar status={status} onSave={() => save({ banner: cfg.banner, popup: cfg.popup, exit_popup: cfg.exit_popup })} label="Save All Banners" />
            </div>
          </div>
        )}

        {/* ── MINI CTAs ───────────────────────────────────────────────────── */}
        {tab === "mini_ctas" && (
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-slate-900">Mini CTAs</h1>
                <p className="text-sm text-slate-500 mt-1">Small inline call-to-action buttons shown in content sections.</p>
              </div>
              <Button
                onClick={() => setCfg(prev => ({ ...prev, mini_ctas: { items: [...prev.mini_ctas.items, { label: "New CTA", url: "/contact-us", style: "filled" }] } }))}
                className="bg-blue-600 hover:bg-blue-700 text-white gap-1.5 text-sm"
              >
                <Plus className="w-4 h-4" /> Add CTA
              </Button>
            </div>

            <div className="space-y-3">
              {cfg.mini_ctas.items.map((item, i) => (
                <div key={i} className="bg-white border border-slate-200 rounded-xl p-4 flex items-center gap-4">
                  <div className="grid grid-cols-3 gap-3 flex-1">
                    <Field label="Label">
                      <input className={I} value={item.label} onChange={e => {
                        const items = [...cfg.mini_ctas.items];
                        items[i] = { ...items[i], label: e.target.value };
                        upd("mini_ctas", { items });
                      }} />
                    </Field>
                    <Field label="URL">
                      <input className={I} value={item.url} onChange={e => {
                        const items = [...cfg.mini_ctas.items];
                        items[i] = { ...items[i], url: e.target.value };
                        upd("mini_ctas", { items });
                      }} />
                    </Field>
                    <Field label="Style">
                      <select className={I} value={item.style} onChange={e => {
                        const items = [...cfg.mini_ctas.items];
                        items[i] = { ...items[i], style: e.target.value };
                        upd("mini_ctas", { items });
                      }}>
                        <option value="filled">Filled</option>
                        <option value="outline">Outline</option>
                        <option value="text">Text Link</option>
                      </select>
                    </Field>
                  </div>
                  <button
                    onClick={() => setCfg(prev => ({ ...prev, mini_ctas: { items: prev.mini_ctas.items.filter((_, j) => j !== i) } }))}
                    className="text-slate-300 hover:text-rose-500 transition-colors flex-shrink-0 mt-4"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
              {cfg.mini_ctas.items.length === 0 && (
                <div className="bg-white border border-dashed border-slate-300 rounded-xl p-10 text-center text-slate-400 text-sm">
                  No mini CTAs yet. Click "Add CTA" to create one.
                </div>
              )}
            </div>

            <SaveBar status={status} onSave={() => save({ mini_ctas: cfg.mini_ctas })} label="Save Mini CTAs" />
          </div>
        )}

        {/* ── LEAD FORMS ──────────────────────────────────────────────────── */}
        {tab === "lead_forms" && (
          <div className="space-y-5">
            <h1 className="text-2xl font-bold text-slate-900">Lead Forms</h1>
            <p className="text-sm text-slate-500">Configure the lead capture form that appears on service pages and the contact page.</p>

            <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-5">
              <Field label="Form Heading">
                <input className={I} value={cfg.lead_form.heading} onChange={e => upd("lead_form", { heading: e.target.value })} placeholder="Ready to automate your ops?" />
              </Field>
              <Field label="Sub-text">
                <textarea className={I} rows={2} value={cfg.lead_form.subtext} onChange={e => upd("lead_form", { subtext: e.target.value })} />
              </Field>
              <Field label="Submit Button Label">
                <input className={I} value={cfg.lead_form.ctaLabel} onChange={e => upd("lead_form", { ctaLabel: e.target.value })} placeholder="Send My Roadmap" />
              </Field>

              <div>
                <p className={L}>Visible Fields</p>
                <div className="flex flex-wrap gap-2 mt-2">
                  {["name","email","company","phone","service","message"].map(field => {
                    const active = cfg.lead_form.fields.includes(field);
                    return (
                      <button
                        key={field}
                        onClick={() => {
                          const fields = active
                            ? cfg.lead_form.fields.filter(f => f !== field)
                            : [...cfg.lead_form.fields, field];
                          upd("lead_form", { fields });
                        }}
                        className={cn(
                          "px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors capitalize",
                          active ? "bg-blue-50 border-blue-300 text-blue-600" : "border-slate-200 text-slate-400 hover:border-slate-300"
                        )}
                      >
                        {field}
                      </button>
                    );
                  })}
                </div>
                <p className="text-[11px] text-slate-400 mt-2">Click to toggle. Name and Email are always required.</p>
              </div>

              {/* Preview */}
              <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                <p className="text-[10px] text-slate-400 uppercase tracking-wider mb-3">Preview</p>
                <div className="bg-white border border-slate-200 rounded-xl p-5">
                  <h3 className="text-base font-bold text-slate-900">{cfg.lead_form.heading}</h3>
                  <p className="text-xs text-slate-500 mt-1 mb-4">{cfg.lead_form.subtext}</p>
                  <div className="grid grid-cols-2 gap-2">
                    {cfg.lead_form.fields.map(f => (
                      <div key={f} className="border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-300 capitalize">{f}…</div>
                    ))}
                  </div>
                  <button className="mt-3 bg-blue-600 text-white text-xs font-semibold rounded-lg px-4 py-2 w-full">{cfg.lead_form.ctaLabel}</button>
                </div>
              </div>

              <SaveBar status={status} onSave={() => save({ lead_form: cfg.lead_form })} label="Save Lead Form" />
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
