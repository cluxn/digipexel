"use client";

import React, { useState, useEffect, useCallback } from "react";
import AdminLayout from "@/components/admin/admin-layout";
import { api } from "@/lib/api";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Plus, ExternalLink, Check, AlertCircle, Loader2, X } from "lucide-react";

// ── Types ─────────────────────────────────────────────────────────────────────

type SeoTab   = "meta" | "sitemap" | "robots" | "scripts" | "redirects" | "404log";
type SaveSt   = "idle" | "saving" | "saved" | "error";

interface MetaFields   { seo_title: string; meta_description: string; og_image: string; }
interface AnalyticsCodes { google_analytics: string; search_console: string; custom_head_scripts: string; }
interface Redirect     { from: string; to: string; type: "301" | "302"; }

const PAGE_OPTIONS = [
  { label: "Homepage",                          value: "home" },
  { label: "Blog Listing",                      value: "blog" },
  { label: "Case Studies Listing",              value: "case-studies" },
  { label: "Guides Listing",                    value: "guides" },
  { label: "Testimonials",                      value: "testimonials" },
  { label: "Contact Us",                        value: "contact-us" },
  { label: "Privacy Policy",                    value: "privacy-policy" },
  { label: "Terms & Conditions",                value: "terms-and-conditions" },
  { label: "Service: AI SEO",                   value: "services/ai-seo" },
  { label: "Service: Custom AI Solutions",      value: "services/custom-ai-solutions" },
  { label: "Service: YouTube Automation",       value: "services/youtube-automation" },
  { label: "Service: Instagram Automation",     value: "services/instagram-automation" },
  { label: "Service: LinkedIn Automation",      value: "services/linkedin-automation" },
  { label: "Service: Automation Flows",         value: "services/automation-flows" },
  { label: "Service: AI Workflows",             value: "services/ai-workflows" },
  { label: "Service: Workflow Creation",        value: "services/workflow-creation" },
  { label: "Service: Accounting & Bookkeeping", value: "services/accounting-bookkeeping" },
  { label: "Service: Hiring & Recruitment",     value: "services/hiring-recruitment" },
  { label: "Service: Sales Automation",         value: "services/sales-automation" },
];

const TABS: { key: SeoTab; label: string }[] = [
  { key: "meta",      label: "Meta & OG" },
  { key: "sitemap",   label: "Sitemap" },
  { key: "robots",    label: "Robots.txt" },
  { key: "scripts",   label: "Scripts" },
  { key: "redirects", label: "Redirects" },
  { key: "404log",    label: "404 Log" },
];

const EMPTY_META: MetaFields = { seo_title: "", meta_description: "", og_image: "" };
const EMPTY_CODES: AnalyticsCodes = { google_analytics: "", search_console: "", custom_head_scripts: "" };

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

function SaveBar({ status, onSave, label = "Save" }: { status: SaveSt; onSave: () => void; label?: string }) {
  return (
    <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
      <Button onClick={onSave} disabled={status === "saving"} className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-5">
        {status === "saving" ? "Saving…" : label}
      </Button>
      {status === "saved" && <span className="text-xs text-emerald-600 font-semibold flex items-center gap-1"><Check className="w-3 h-3" /> Saved</span>}
      {status === "error" && <span className="text-xs text-rose-600 font-semibold flex items-center gap-1"><AlertCircle className="w-3 h-3" /> Error</span>}
    </div>
  );
}

// ── Component ──────────────────────────────────────────────────────────────────

export default function AdminSeoPage() {
  const [tab, setTab] = useState<SeoTab>("meta");

  // Meta & OG
  const [selectedPage, setSelectedPage] = useState("home");
  const [meta, setMeta]                 = useState<MetaFields>(EMPTY_META);
  const [metaLoading, setMetaLoading]   = useState(false);
  const [metaStatus, setMetaStatus]     = useState<SaveSt>("idle");

  // Robots.txt
  const [robots, setRobots]             = useState("User-agent: *\nAllow: /\nDisallow: /admin/\nSitemap: https://www.digipexel.com/sitemap.xml");
  const [robotsStatus, setRobotsStatus] = useState<SaveSt>("idle");

  // Scripts
  const [codes, setCodes]               = useState<AnalyticsCodes>(EMPTY_CODES);
  const [codesLoading, setCodesLoading] = useState(false);
  const [codesStatus, setCodesStatus]   = useState<SaveSt>("idle");

  // Redirects
  const [redirects, setRedirects]       = useState<Redirect[]>([]);
  const [redirectStatus, setRedirectStatus] = useState<SaveSt>("idle");

  // ── Load per-page meta ───────────────────────────────────────────────────────
  useEffect(() => {
    setMetaLoading(true);
    setMeta(EMPTY_META);
    api.get("seo_meta", { page: selectedPage }).then(res => {
      if (res?.status === "success" && res.data) {
        const d = res.data as Partial<MetaFields>;
        setMeta({ seo_title: d.seo_title || "", meta_description: d.meta_description || "", og_image: d.og_image || "" });
      }
    }).finally(() => setMetaLoading(false));
  }, [selectedPage]);

  // ── Load analytics codes & settings ─────────────────────────────────────────
  useEffect(() => {
    if (tab === "scripts") {
      setCodesLoading(true);
      api.get("analytics").then(res => {
        if (res?.status === "success" && res.data) {
          setCodes(prev => ({ ...prev, ...(res.data as typeof prev) }));
        }
      }).finally(() => setCodesLoading(false));
    }
    if (tab === "robots" || tab === "redirects") {
      api.get("settings").then(res => {
        if (res?.status === "success" && res.data) {
          const d = res.data as Record<string, string>;
          if (d.robots_txt) setRobots(d.robots_txt);
          if (d.url_redirects) {
            try { setRedirects(JSON.parse(d.url_redirects)); } catch { /* ok */ }
          }
        }
      });
    }
  }, [tab]);

  // ── Savers ───────────────────────────────────────────────────────────────────
  const saveMeta = async () => {
    setMetaStatus("saving");
    const res = await api.post("seo_meta", { action: "save_seo_meta", page_key: selectedPage, ...meta });
    setMetaStatus(res?.status === "success" ? "saved" : "error");
    setTimeout(() => setMetaStatus("idle"), 3000);
  };

  const saveRobots = async () => {
    setRobotsStatus("saving");
    const res = await api.post("settings", { action: "save_setting", key: "robots_txt", value: robots });
    setRobotsStatus(res?.status === "success" ? "saved" : "error");
    setTimeout(() => setRobotsStatus("idle"), 3000);
  };

  const saveCodes = async () => {
    setCodesStatus("saving");
    const res = await api.post("analytics", { action: "save_codes", codes });
    setCodesStatus(res?.status === "success" ? "saved" : "error");
    setTimeout(() => setCodesStatus("idle"), 3000);
  };

  const saveRedirects = async () => {
    setRedirectStatus("saving");
    const res = await api.post("settings", { action: "save_setting", key: "url_redirects", value: JSON.stringify(redirects) });
    setRedirectStatus(res?.status === "success" ? "saved" : "error");
    setTimeout(() => setRedirectStatus("idle"), 3000);
  };

  const addRedirect = () => setRedirects(prev => [...prev, { from: "", to: "", type: "301" }]);
  const removeRedirect = (i: number) => setRedirects(prev => prev.filter((_, j) => j !== i));
  const updRedirect = (i: number, patch: Partial<Redirect>) => setRedirects(prev => prev.map((r, j) => j === i ? { ...r, ...patch } : r));

  // ── Render ───────────────────────────────────────────────────────────────────
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

        {/* ── META & OG ───────────────────────────────────────────────────── */}
        {tab === "meta" && (
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold text-slate-900">SEO Meta & OG Tags</h1>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-5">
              <Field label="Select Page">
                <select
                  className={I}
                  value={selectedPage}
                  onChange={e => setSelectedPage(e.target.value)}
                >
                  {PAGE_OPTIONS.map(o => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
              </Field>

              {metaLoading ? (
                <div className="flex items-center gap-2 py-6 text-slate-400">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span className="text-sm">Loading…</span>
                </div>
              ) : (
                <>
                  <Field label="SEO Title" hint="Recommended: under 60 characters">
                    <div className="relative">
                      <input
                        className={I}
                        value={meta.seo_title}
                        onChange={e => setMeta(m => ({ ...m, seo_title: e.target.value }))}
                        placeholder="e.g. Digi Pexel — AI Automation Agency"
                        maxLength={80}
                      />
                      <span className={cn("absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-mono", meta.seo_title.length > 60 ? "text-amber-500" : "text-slate-300")}>
                        {meta.seo_title.length}/60
                      </span>
                    </div>
                  </Field>

                  <Field label="Meta Description" hint="Recommended: under 160 characters">
                    <div className="relative">
                      <textarea
                        className={I}
                        rows={3}
                        value={meta.meta_description}
                        onChange={e => setMeta(m => ({ ...m, meta_description: e.target.value }))}
                        placeholder="e.g. We design reliable AI workflows that move data, decisions, and actions across your stack."
                        maxLength={200}
                      />
                      <span className={cn("absolute right-3 bottom-3 text-[10px] font-mono", meta.meta_description.length > 160 ? "text-amber-500" : "text-slate-300")}>
                        {meta.meta_description.length}/160
                      </span>
                    </div>
                  </Field>

                  <Field label="OG Image URL" hint="Recommended size: 1200×630px">
                    <input
                      className={I}
                      type="url"
                      value={meta.og_image}
                      onChange={e => setMeta(m => ({ ...m, og_image: e.target.value }))}
                      placeholder="https://digipexel.com/og-image.jpg"
                    />
                  </Field>

                  {meta.og_image && (
                    <div className="rounded-lg overflow-hidden border border-slate-200 max-w-sm">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={meta.og_image} alt="OG preview" className="w-full h-auto object-cover" onError={e => (e.currentTarget.style.display = "none")} />
                      <p className="text-[10px] text-slate-400 px-3 py-2 bg-slate-50">OG Image Preview</p>
                    </div>
                  )}

                  <SaveBar status={metaStatus} onSave={saveMeta} label="Save Meta" />
                </>
              )}
            </div>

            {/* Summary table */}
            <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
              <div className="px-4 py-3 border-b border-slate-100 bg-slate-50">
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">All Configured Pages</p>
              </div>
              <div className="divide-y divide-slate-50">
                {PAGE_OPTIONS.slice(0, 8).map(p => (
                  <div key={p.value} className="flex items-center justify-between px-4 py-3 hover:bg-slate-50 cursor-pointer" onClick={() => setSelectedPage(p.value)}>
                    <span className="text-sm text-slate-700">{p.label}</span>
                    <span className="text-[10px] text-slate-400 font-mono">/{p.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── SITEMAP ─────────────────────────────────────────────────────── */}
        {tab === "sitemap" && (
          <div className="space-y-5">
            <h1 className="text-2xl font-bold text-slate-900">Sitemap</h1>
            <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-5">
              <p className="text-sm text-slate-600">Your sitemap is auto-generated at each build via <code className="bg-slate-100 px-1.5 py-0.5 rounded text-xs">next-sitemap</code>. It lists all public pages for search engine discovery.</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { label: "sitemap.xml", url: "https://www.digipexel.com/sitemap.xml", desc: "All public pages submitted to search engines", status: "Auto-generated" },
                  { label: "robots.txt",  url: "https://www.digipexel.com/robots.txt",  desc: "Crawler rules — /admin/* blocked, all else allowed", status: "Editable" },
                ].map(item => (
                  <a key={item.label} href={item.url} target="_blank" rel="noopener noreferrer"
                    className="flex items-start gap-4 border border-slate-200 hover:border-blue-300 rounded-xl p-5 transition-all group"
                  >
                    <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0">
                      <Check className="w-5 h-5 text-blue-500" />
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5 font-semibold text-sm text-slate-800 group-hover:text-blue-600">
                        {item.label} <ExternalLink className="w-3 h-3 opacity-40" />
                      </div>
                      <p className="text-xs text-slate-400 mt-0.5">{item.desc}</p>
                      <span className="text-[10px] text-slate-300 font-mono">{item.url}</span>
                    </div>
                  </a>
                ))}
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-sm text-amber-800">
                <strong>How to regenerate:</strong> Run <code className="bg-amber-100 px-1 rounded">npm run build</code> locally then deploy the <code className="bg-amber-100 px-1 rounded">out/</code> folder via SFTP. The postbuild script writes fresh sitemap.xml and robots.txt automatically.
              </div>

              <div>
                <p className={L + " mb-3"}>Pages currently in sitemap</p>
                <div className="bg-slate-50 rounded-lg border border-slate-200 divide-y divide-slate-100 max-h-80 overflow-y-auto">
                  {["/", "/blog", "/case-studies", "/guides", "/testimonials", "/contact-us",
                    "/services/ai-seo", "/services/custom-ai-solutions", "/services/youtube-automation",
                    "/services/instagram-automation", "/services/linkedin-automation", "/services/automation-flows",
                    "/services/ai-workflows", "/services/workflow-creation", "/services/accounting-bookkeeping",
                    "/services/hiring-recruitment", "/services/sales-automation"].map(path => (
                    <div key={path} className="flex items-center justify-between px-4 py-2.5">
                      <span className="text-xs font-mono text-slate-600">{path}</span>
                      <span className="text-[10px] text-emerald-500 font-semibold">Indexed</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── ROBOTS.TXT ──────────────────────────────────────────────────── */}
        {tab === "robots" && (
          <div className="space-y-5">
            <h1 className="text-2xl font-bold text-slate-900">Robots.txt</h1>
            <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-5">
              <p className="text-sm text-slate-600">
                Edit your robots.txt content. This is saved to the database and should be copied to your static <code className="bg-slate-100 px-1 rounded text-xs">out/robots.txt</code> at build time.
              </p>
              <Field label="Robots.txt Content">
                <textarea
                  className={cn(I, "font-mono text-xs h-52 resize-y")}
                  value={robots}
                  onChange={e => setRobots(e.target.value)}
                />
              </Field>
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 text-xs text-slate-500 space-y-1">
                <p><code className="bg-white px-1 rounded">User-agent: *</code> — applies to all crawlers</p>
                <p><code className="bg-white px-1 rounded">Allow: /</code> — allow all pages by default</p>
                <p><code className="bg-white px-1 rounded">Disallow: /admin/</code> — block admin panel from indexing</p>
                <p><code className="bg-white px-1 rounded">Sitemap:</code> — point crawlers to your sitemap</p>
              </div>
              <SaveBar status={robotsStatus} onSave={saveRobots} label="Save Robots.txt" />
            </div>
          </div>
        )}

        {/* ── SCRIPTS ─────────────────────────────────────────────────────── */}
        {tab === "scripts" && (
          <div className="space-y-5">
            <h1 className="text-2xl font-bold text-slate-900">Scripts</h1>
            <p className="text-sm text-slate-500">Analytics and tracking scripts injected into &lt;head&gt; on every page.</p>

            {codesLoading ? (
              <div className="flex items-center gap-2 py-10 text-slate-400">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span className="text-sm">Loading scripts…</span>
              </div>
            ) : (
              <>
                {[
                  { key: "google_analytics" as const, label: "Google Analytics (GA4)", placeholder: "<!-- Google tag (gtag.js) -->\n<script async src=\"https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX\"></script>", hint: "Paste the full <script async src=...></script> tag from GA4." },
                  { key: "search_console"   as const, label: "Google Search Console Verification", placeholder: "<meta name='google-site-verification' content='...' />", hint: "Paste the meta verification tag from Search Console." },
                  { key: "custom_head_scripts" as const, label: "Custom Head Scripts", placeholder: "<!-- Any additional <script> or <link> tags -->", hint: "Injected into <head> on every page. Use carefully." },
                ].map(({ key, label, placeholder, hint }) => (
                  <div key={key} className="bg-white border border-slate-200 rounded-xl p-6 space-y-3">
                    <div>
                      <h2 className="text-base font-bold text-slate-800">{label}</h2>
                      <p className="text-[11px] text-slate-400 mt-0.5">{hint}</p>
                    </div>
                    <textarea
                      className={cn(I, "font-mono text-xs h-28 resize-none")}
                      value={codes[key]}
                      onChange={e => setCodes(p => ({ ...p, [key]: e.target.value }))}
                      placeholder={placeholder}
                    />
                  </div>
                ))}

                <div className="bg-white border border-slate-200 rounded-xl p-6">
                  <SaveBar status={codesStatus} onSave={saveCodes} label="Save Scripts" />
                </div>
              </>
            )}
          </div>
        )}

        {/* ── REDIRECTS ───────────────────────────────────────────────────── */}
        {tab === "redirects" && (
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-slate-900">Redirects</h1>
                <p className="text-sm text-slate-500 mt-1">URL redirect rules. These are stored in the database for reference — implement them in your server config or Next.js next.config.ts redirects.</p>
              </div>
              <Button onClick={addRedirect} className="bg-blue-600 hover:bg-blue-700 text-white gap-1.5 text-sm">
                <Plus className="w-4 h-4" /> Add Redirect
              </Button>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50">
                    <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-widest text-slate-400">From</th>
                    <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-widest text-slate-400">To</th>
                    <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-widest text-slate-400">Type</th>
                    <th className="px-4 py-3 w-10"></th>
                  </tr>
                </thead>
                <tbody>
                  {redirects.map((r, i) => (
                    <tr key={i} className="border-b border-slate-50">
                      <td className="px-4 py-2.5">
                        <input className={cn(I, "font-mono text-xs")} value={r.from} onChange={e => updRedirect(i, { from: e.target.value })} placeholder="/old-path" />
                      </td>
                      <td className="px-4 py-2.5">
                        <input className={cn(I, "font-mono text-xs")} value={r.to} onChange={e => updRedirect(i, { to: e.target.value })} placeholder="/new-path" />
                      </td>
                      <td className="px-4 py-2.5 w-28">
                        <select className={I} value={r.type} onChange={e => updRedirect(i, { type: e.target.value as "301" | "302" })}>
                          <option value="301">301 Permanent</option>
                          <option value="302">302 Temporary</option>
                        </select>
                      </td>
                      <td className="px-4 py-2.5">
                        <button onClick={() => removeRedirect(i)} className="text-slate-300 hover:text-rose-500 transition-colors">
                          <X className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {redirects.length === 0 && (
                <div className="text-center py-12 text-slate-400 text-sm">No redirects configured. Click "Add Redirect" to create one.</div>
              )}
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-6">
              <SaveBar status={redirectStatus} onSave={saveRedirects} label="Save Redirects" />
            </div>
          </div>
        )}

        {/* ── 404 LOG ─────────────────────────────────────────────────────── */}
        {tab === "404log" && (
          <div className="space-y-5">
            <h1 className="text-2xl font-bold text-slate-900">404 Log</h1>
            <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-5">
              <p className="text-sm text-slate-600">
                404 tracking requires server-side request logging. Since this site uses static export hosted on Hostinger shared hosting, server-level 404 logging is handled by the hosting provider's error logs.
              </p>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-800 space-y-2">
                <p className="font-semibold">How to check 404s:</p>
                <ol className="list-decimal list-inside space-y-1 text-xs text-blue-700">
                  <li>Log in to Hostinger control panel</li>
                  <li>Navigate to Hosting → Error Logs</li>
                  <li>Filter for HTTP 404 status codes</li>
                  <li>Add redirects above for any broken URLs you find</li>
                </ol>
              </div>
              <div className="grid grid-cols-3 gap-4">
                {[
                  { label: "Soft 404s", value: "—", desc: "Client-side routing" },
                  { label: "Crawl Errors", value: "—", desc: "Via Search Console" },
                  { label: "Custom 404 Page", value: "Active", desc: "/404.html in out/" },
                ].map(({ label, value, desc }) => (
                  <div key={label} className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">{label}</p>
                    <p className="text-xl font-bold text-slate-800">{value}</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">{desc}</p>
                  </div>
                ))}
              </div>
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">Tip: Monitor in Google Search Console</p>
                <p className="text-xs text-slate-600">Connect your site to <a href="https://search.google.com/search-console" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">Google Search Console</a> and check Coverage → Excluded → Not found (404) for a full list of broken URLs being crawled.</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
