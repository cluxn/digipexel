"use client";

import React, { useState, useEffect } from "react";
import AdminLayout from "@/components/admin/admin-layout";
import { api } from "@/lib/api";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Check, AlertCircle } from "lucide-react";

// ── Types ─────────────────────────────────────────────────────────────────────

type SettingsSubTab = "general" | "social" | "appearance" | "cookie";
type SaveSt = "idle" | "saving" | "saved" | "error";

interface AllSettings {
  // General
  whatsapp_number:   string;
  whatsapp_enabled:  string;
  company_email:     string;
  company_phone:     string;
  company_address:   string;
  // Social
  facebook_url:      string;
  instagram_url:     string;
  youtube_url:       string;
  linkedin_url:      string;
  twitter_url:       string;
  // Appearance
  site_name:         string;
  tagline:           string;
  logo_url:          string;
  default_cta_link:  string;
  calendly_url:      string;
  // Cookie consent
  cookie_consent_enabled:   string;
  cookie_consent_text:      string;
  cookie_consent_link_text: string;
  cookie_consent_link_url:  string;
}

const DEFAULTS: AllSettings = {
  whatsapp_number:   "",
  whatsapp_enabled:  "true",
  company_email:     "",
  company_phone:     "",
  company_address:   "",
  facebook_url:      "",
  instagram_url:     "",
  youtube_url:       "",
  linkedin_url:      "",
  twitter_url:       "",
  site_name:         "Digi Pexel",
  tagline:           "Building the future of AI automation.",
  logo_url:          "",
  default_cta_link:  "/contact-us",
  calendly_url:      "",
  cookie_consent_enabled:   "false",
  cookie_consent_text:      "We use cookies to improve your experience. By continuing, you agree to our Privacy Policy.",
  cookie_consent_link_text: "Privacy Policy",
  cookie_consent_link_url:  "/privacy-policy",
};

const SUB_TABS: { key: SettingsSubTab; label: string }[] = [
  { key: "general",    label: "General" },
  { key: "social",     label: "Social" },
  { key: "appearance", label: "Appearance" },
  { key: "cookie",     label: "Cookie Consent" },
];

// ── Shared helpers ─────────────────────────────────────────────────────────────

const I = "w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-blue-400 bg-white";
const L = "block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5";

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className={L}>{label}</label>
      {children}
      {hint && <p className="text-[11px] text-slate-400 mt-1">{hint}</p>}
    </div>
  );
}

function Toggle({ checked, onChange, label, desc }: { checked: boolean; onChange: (v: boolean) => void; label: string; desc?: string }) {
  return (
    <div className="flex items-center justify-between py-3">
      <div>
        <p className="text-sm font-semibold text-slate-800">{label}</p>
        {desc && <p className="text-[11px] text-slate-400 mt-0.5">{desc}</p>}
      </div>
      <label className="relative inline-flex items-center cursor-pointer flex-shrink-0 ml-4">
        <input type="checkbox" className="sr-only peer" checked={checked} onChange={e => onChange(e.target.checked)} />
        <div className="w-10 h-5 bg-slate-200 rounded-full peer peer-checked:bg-blue-600 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-5" />
      </label>
    </div>
  );
}

function SaveBtn({ status, onSave, label }: { status: SaveSt; onSave: () => void; label: string }) {
  return (
    <div className="flex items-center gap-3 pt-5 border-t border-slate-100">
      <Button
        onClick={onSave}
        disabled={status === "saving"}
        className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-6"
      >
        {status === "saving" ? "Saving…" : label}
      </Button>
      {status === "saved" && <span className="text-xs text-emerald-600 font-semibold flex items-center gap-1"><Check className="w-3 h-3" /> Saved</span>}
      {status === "error" && <span className="text-xs text-rose-600 font-semibold flex items-center gap-1"><AlertCircle className="w-3 h-3" /> Error — retry</span>}
    </div>
  );
}

// ── Component ──────────────────────────────────────────────────────────────────

export default function AdminSettingsPage() {
  const [subTab, setSubTab]   = useState<SettingsSubTab>("general");
  const [s, setS]             = useState<AllSettings>(DEFAULTS);
  const [loading, setLoading] = useState(true);

  const [genStatus,  setGenStatus]  = useState<SaveSt>("idle");
  const [socStatus,  setSocStatus]  = useState<SaveSt>("idle");
  const [appStatus,  setAppStatus]  = useState<SaveSt>("idle");
  const [cookStatus, setCookStatus] = useState<SaveSt>("idle");

  useEffect(() => {
    api.get("settings").then(res => {
      if (res?.status === "success" && res.data) {
        setS(prev => ({ ...prev, ...(res.data as Partial<AllSettings>) }));
      }
    }).finally(() => setLoading(false));
  }, []);

  const upd = (patch: Partial<AllSettings>) => setS(prev => ({ ...prev, ...patch }));

  const saveGroup = async (keys: (keyof AllSettings)[], setStatus: (s: SaveSt) => void) => {
    setStatus("saving");
    const settings: Record<string, string> = {};
    keys.forEach(k => { settings[k] = s[k]; });
    const res = await api.post("settings", { action: "save_all_settings", settings });
    setStatus(res?.status === "success" ? "saved" : "error");
    setTimeout(() => setStatus("idle"), 3000);
  };

  if (loading) return (
    <AdminLayout>
      <div className="flex items-center justify-center h-[60vh] text-slate-400 animate-pulse text-sm">Loading settings…</div>
    </AdminLayout>
  );

  return (
    <AdminLayout>
      <div className="space-y-5 pb-10">

        {/* ── Outer nav (Site Settings | Users) ──────────────────────────── */}
        <div className="border-b border-slate-200">
          <div className="flex gap-0">
            <a
              href="/admin/settings"
              className="px-4 py-3 text-sm font-medium border-b-2 border-blue-600 text-blue-600"
            >
              Site Settings
            </a>
            {typeof window !== "undefined" && localStorage.getItem("admin_access_level") !== "custom" && (
              <a
                href="/admin/users"
                className="px-4 py-3 text-sm font-medium border-b-2 border-transparent text-slate-500 hover:text-slate-700"
              >
                Users
              </a>
            )}
          </div>
        </div>

        <h1 className="text-2xl font-bold text-slate-900">Site Settings</h1>

        {/* ── Inner card with sub-tabs ────────────────────────────────────── */}
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
          {/* Sub-tab nav */}
          <div className="border-b border-slate-200 px-6 pt-4">
            <div className="flex gap-0">
              {SUB_TABS.map(t => (
                <button
                  key={t.key}
                  onClick={() => setSubTab(t.key)}
                  className={cn(
                    "px-4 py-2.5 text-sm font-medium border-b-2 -mb-px transition-colors whitespace-nowrap",
                    subTab === t.key
                      ? "border-blue-600 text-blue-600"
                      : "border-transparent text-slate-500 hover:text-slate-700"
                  )}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          <div className="p-6 space-y-5">

            {/* ── GENERAL ─────────────────────────────────────────────────── */}
            {subTab === "general" && (
              <>
                <Field label="WhatsApp Number" hint="International format without +, e.g. 911234567890">
                  <input className={I} value={s.whatsapp_number} onChange={e => upd({ whatsapp_number: e.target.value })} placeholder="+1234567890" />
                </Field>
                <Toggle
                  checked={s.whatsapp_enabled === "true"}
                  onChange={v => upd({ whatsapp_enabled: v ? "true" : "false" })}
                  label="Show WhatsApp Button"
                  desc="Floating chat button on all public pages"
                />
                <Field label="Company Email">
                  <input className={I} type="email" value={s.company_email} onChange={e => upd({ company_email: e.target.value })} placeholder="info@digipexel.com" />
                </Field>
                <Field label="Company Phone">
                  <input className={I} type="tel" value={s.company_phone} onChange={e => upd({ company_phone: e.target.value })} placeholder="08299406767" />
                </Field>
                <Field label="Company Address">
                  <textarea className={cn(I, "resize-none")} rows={2} value={s.company_address} onChange={e => upd({ company_address: e.target.value })} placeholder="457/10A, 117/Q, Indrapuri Road, Kanpur, UP 208025" />
                </Field>
                <SaveBtn status={genStatus} onSave={() => saveGroup(["whatsapp_number","whatsapp_enabled","company_email","company_phone","company_address"], setGenStatus)} label="Save General" />
              </>
            )}

            {/* ── SOCIAL ──────────────────────────────────────────────────── */}
            {subTab === "social" && (
              <>
                {[
                  { key: "facebook_url"  as const, label: "Facebook URL",   placeholder: "https://facebook.com/digipexel" },
                  { key: "instagram_url" as const, label: "Instagram URL",  placeholder: "https://instagram.com/digipexel" },
                  { key: "youtube_url"   as const, label: "YouTube URL",    placeholder: "https://youtube.com/@digipexel" },
                  { key: "linkedin_url"  as const, label: "LinkedIn URL",   placeholder: "https://linkedin.com/company/digipexel" },
                  { key: "twitter_url"   as const, label: "Twitter / X URL",placeholder: "https://x.com/digipexel" },
                ].map(({ key, label, placeholder }) => (
                  <Field key={key} label={label}>
                    <input className={I} type="url" value={s[key]} onChange={e => upd({ [key]: e.target.value } as Partial<AllSettings>)} placeholder={placeholder} />
                  </Field>
                ))}
                <SaveBtn status={socStatus} onSave={() => saveGroup(["facebook_url","instagram_url","youtube_url","linkedin_url","twitter_url"], setSocStatus)} label="Save Social" />
              </>
            )}

            {/* ── APPEARANCE ──────────────────────────────────────────────── */}
            {subTab === "appearance" && (
              <>
                <Field label="Site Name">
                  <input className={I} value={s.site_name} onChange={e => upd({ site_name: e.target.value })} placeholder="Digi Pexel" />
                </Field>
                <Field label="Tagline">
                  <textarea className={cn(I, "resize-none")} rows={2} value={s.tagline} onChange={e => upd({ tagline: e.target.value })} placeholder="Building the future of AI automation." />
                </Field>
                <Field label="Logo URL" hint="Paste a URL to your logo image. Leave empty to use the text logo.">
                  <input className={I} type="url" value={s.logo_url} onChange={e => upd({ logo_url: e.target.value })} placeholder="https://digipexel.com/logo.svg" />
                </Field>
                <Field label="Default CTA Link" hint="Used for all primary 'Book a Call' and 'Get Started' buttons site-wide">
                  <input className={I} value={s.default_cta_link} onChange={e => upd({ default_cta_link: e.target.value })} placeholder="/contact-us" />
                </Field>
                <Field label="Calendly / Calendar URL" hint="Used for 'Book a Meeting' buttons. Leave empty to show contact form instead.">
                  <input className={I} type="url" value={s.calendly_url} onChange={e => upd({ calendly_url: e.target.value })} placeholder="https://calendly.com/yourname/30min" />
                </Field>
                <SaveBtn status={appStatus} onSave={() => saveGroup(["site_name","tagline","logo_url","default_cta_link","calendly_url"], setAppStatus)} label="Save Appearance" />
              </>
            )}

            {/* ── COOKIE CONSENT ──────────────────────────────────────────── */}
            {subTab === "cookie" && (
              <>
                <Toggle
                  checked={s.cookie_consent_enabled === "true"}
                  onChange={v => upd({ cookie_consent_enabled: v ? "true" : "false" })}
                  label="Enable Cookie Consent Banner"
                  desc="Shows a cookie notice bar at the bottom of the page for first-time visitors"
                />
                <Field label="Banner Message">
                  <textarea
                    className={cn(I, "resize-none")}
                    rows={3}
                    value={s.cookie_consent_text}
                    onChange={e => upd({ cookie_consent_text: e.target.value })}
                    placeholder="We use cookies to improve your experience. By continuing, you agree to our Privacy Policy."
                  />
                </Field>
                <div className="grid grid-cols-2 gap-4">
                  <Field label="Policy Link Text">
                    <input className={I} value={s.cookie_consent_link_text} onChange={e => upd({ cookie_consent_link_text: e.target.value })} placeholder="Privacy Policy" />
                  </Field>
                  <Field label="Policy Link URL">
                    <input className={I} value={s.cookie_consent_link_url} onChange={e => upd({ cookie_consent_link_url: e.target.value })} placeholder="/privacy-policy" />
                  </Field>
                </div>

                {/* Live preview */}
                <div className="rounded-lg overflow-hidden border border-slate-200">
                  <div className="bg-slate-900 px-5 py-3 flex items-center justify-between gap-4">
                    <p className="text-white text-xs flex-1">
                      {s.cookie_consent_text}{" "}
                      <span className="underline text-blue-400">{s.cookie_consent_link_text}</span>
                    </p>
                    <button className="bg-white text-slate-900 text-xs font-semibold px-3 py-1.5 rounded-lg flex-shrink-0">Accept</button>
                  </div>
                  <p className="text-[10px] text-slate-400 text-center py-1.5 bg-slate-50">Live Preview</p>
                </div>

                <SaveBtn status={cookStatus} onSave={() => saveGroup(["cookie_consent_enabled","cookie_consent_text","cookie_consent_link_text","cookie_consent_link_url"], setCookStatus)} label="Save Cookie Settings" />
              </>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
