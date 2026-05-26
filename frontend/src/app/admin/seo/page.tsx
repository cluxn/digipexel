"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import AdminLayout from "@/components/admin/admin-layout";
import { api } from "@/lib/api";
import { Search, AlertTriangle, Loader2 } from "lucide-react";

// All public pages available for SEO meta editing
const PAGE_OPTIONS = [
  { label: "Homepage", value: "home" },
  { label: "Blog Listing", value: "blog" },
  { label: "Case Studies Listing", value: "case-studies" },
  { label: "Guides Listing", value: "guides" },
  { label: "Testimonials", value: "testimonials" },
  { label: "Contact Us", value: "contact-us" },
  { label: "Privacy Policy", value: "privacy-policy" },
  { label: "Terms & Conditions", value: "terms-and-conditions" },
  // Service pages
  { label: "Service: AI SEO", value: "services/ai-seo" },
  { label: "Service: Custom AI Solutions", value: "services/custom-ai-solutions" },
  { label: "Service: YouTube Automation", value: "services/youtube-automation" },
  { label: "Service: Instagram Automation", value: "services/instagram-automation" },
  { label: "Service: LinkedIn Automation", value: "services/linkedin-automation" },
  { label: "Service: Automation Flows", value: "services/automation-flows" },
  { label: "Service: AI Workflows", value: "services/ai-workflows" },
  { label: "Service: Workflow Creation", value: "services/workflow-creation" },
  { label: "Service: Accounting & Bookkeeping", value: "services/accounting-bookkeeping" },
  { label: "Service: Hiring & Recruitment", value: "services/hiring-recruitment" },
  { label: "Service: Sales Automation", value: "services/sales-automation" },
];

interface SeoFields {
  seo_title: string;
  meta_description: string;
  og_image: string;
}

const EMPTY_FIELDS: SeoFields = { seo_title: "", meta_description: "", og_image: "" };

type SaveStatus = "idle" | "saving" | "saved" | "error";

export default function AdminSeoPage() {
  const [selectedPage, setSelectedPage] = useState("home");
  const [fields, setFields] = useState<SeoFields>(EMPTY_FIELDS);
  const [loading, setLoading] = useState(false);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("idle");

  // Fetch meta for the selected page
  useEffect(() => {
    setLoading(true);
    setFields(EMPTY_FIELDS);
    api.get("seo_meta", { page: selectedPage }).then((res) => {
      if (res?.status === "success" && res.data) {
        const d = res.data as { seo_title?: string; meta_description?: string; og_image?: string };
        setFields({
          seo_title: d.seo_title || "",
          meta_description: d.meta_description || "",
          og_image: d.og_image || "",
        });
      }
    }).finally(() => setLoading(false));
  }, [selectedPage]);

  const handleSave = async () => {
    setSaveStatus("saving");
    const res = await api.post("seo_meta", {
      action: "save_seo_meta",
      page_key: selectedPage,
      seo_title: fields.seo_title,
      meta_description: fields.meta_description,
      og_image: fields.og_image,
    });
    setSaveStatus(res?.status === "success" ? "saved" : "error");
    setTimeout(() => setSaveStatus("idle"), 4000);
  };

  const inputClass = "w-full border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-700 focus:outline-none focus:border-brand/30 bg-white disabled:bg-slate-50 disabled:text-slate-400";
  const labelClass = "block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2";

  return (
    <AdminLayout>
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
        {/* Page Header */}
        <div className="border-b border-slate-100 pb-8 space-y-2">
          <Badge className="bg-brand/10 text-brand border-0 rounded-full px-3 py-1 text-[10px] font-bold tracking-widest uppercase">
            SEO
          </Badge>
          <h1 className="text-4xl font-display font-bold text-[#1A1C1E] tracking-tight flex items-center gap-3">
            <Search className="w-8 h-8 text-brand" />
            SEO Meta
          </h1>
          <p className="text-slate-400 text-sm">
            Edit the SEO title, meta description, and OG image for each public page.
          </p>
        </div>

        {/* Rebuild Notice Banner */}
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <p className="text-sm font-medium text-amber-800">
            Changes take effect after the next site rebuild. Trigger a rebuild from GitHub Actions or contact your developer.
          </p>
        </div>

        {/* Page Selector */}
        <div className="bg-white rounded-[2rem] border border-slate-100 p-8 shadow-sm space-y-6">
          <div>
            <label className={labelClass}>Select a page to edit</label>
            <select
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-brand/20"
              value={selectedPage}
              onChange={(e) => setSelectedPage(e.target.value)}
            >
              {PAGE_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {/* Fields */}
          {loading ? (
            <div className="flex items-center gap-2 py-4 opacity-50">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span className="text-sm text-slate-500">Loading saved meta...</span>
            </div>
          ) : (
            <div className="space-y-5">
              <div>
                <label className={labelClass}>SEO Title</label>
                <input
                  type="text"
                  className={inputClass}
                  placeholder="e.g. Digi Pexel — AI Automation Agency"
                  value={fields.seo_title}
                  onChange={(e) => setFields(f => ({ ...f, seo_title: e.target.value }))}
                />
                <p className="text-xs text-slate-400 mt-1">Recommended: under 60 characters</p>
              </div>
              <div>
                <label className={labelClass}>Meta Description</label>
                <textarea
                  rows={3}
                  className={inputClass}
                  placeholder="e.g. We design reliable AI workflows that move data, decisions, and actions across your stack."
                  value={fields.meta_description}
                  onChange={(e) => setFields(f => ({ ...f, meta_description: e.target.value }))}
                />
                <p className="text-xs text-slate-400 mt-1">Recommended: under 160 characters</p>
              </div>
              <div>
                <label className={labelClass}>OG Image URL</label>
                <input
                  type="url"
                  className={inputClass}
                  placeholder="https://digipexel.com/og-image.jpg"
                  value={fields.og_image}
                  onChange={(e) => setFields(f => ({ ...f, og_image: e.target.value }))}
                />
              </div>
            </div>
          )}

          {/* Save */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 pt-2">
            <Button
              onClick={handleSave}
              disabled={saveStatus === "saving" || loading}
              variant="brand"
              className="h-11 px-6 font-bold"
            >
              {saveStatus === "saving" ? "Saving..." : "Save Meta"}
            </Button>
            {saveStatus === "saved" && (
              <p className="text-sm font-semibold text-green-600">Meta saved. Rebuild to apply changes.</p>
            )}
            {saveStatus === "error" && (
              <p className="text-sm font-semibold text-red-600">Save failed. Check your connection and try again.</p>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
