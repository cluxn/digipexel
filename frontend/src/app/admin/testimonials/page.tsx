"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Trash2, Plus, Save, User, ExternalLink,
  Briefcase, Building, Quote, Tag, MessageSquare,
  Video, Star, Image as ImageIcon, Globe2, ChevronDown, ChevronUp,
} from "lucide-react";
import AdminLayout from "@/components/admin/admin-layout";
import { cn, safeFetch } from "@/lib/utils";
import { API_BASE_URL } from "@/lib/constants";
import { FALLBACK_TESTIMONIALS as SHARED_FALLBACK } from "@/lib/testimonials-data";
import { SERVICES } from "@/app/services/[slug]/service-page-client";

interface Testimonial {
  id?: number;
  name: string;
  role: string;
  company: string;
  content: string;
  image_url: string;
  category: string;
  position: number;
  star_rating: number;
  video_url: string;
  logo_url: string;
  display_context: string;
  service_section?: string;
}

interface FocusAsset {
  id?: number;
  type: "logo" | "video" | "photo";
  url: string;
  thumbnail_url?: string;
  label?: string;
  position: number;
}

const CONTEXT_OPTIONS = [
  { value: "homepage", label: "Homepage" },
  { value: "service", label: "Services" },
  { value: "testimonials-page", label: "Testimonials" },
];

const CONTEXT_COLORS: Record<string, string> = {
  homepage: "bg-brand/10 text-brand",
  service: "bg-violet-100 text-violet-600",
  "testimonials-page": "bg-emerald-100 text-emerald-600",
};

const SERVICE_SECTION_OPTIONS = [
  { value: "testimonials", label: "Testimonials Section", color: "bg-violet-50 text-violet-700 border-violet-200" },
  { value: "impact",       label: "Impact Section",       color: "bg-orange-50 text-orange-600 border-orange-200" },
];

export default function AdminTestimonialsPage() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [focusAssets, setFocusAssets] = useState<FocusAsset[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const [savingIndex, setSavingIndex] = useState<number | null>(null);
  const [savedIndex, setSavedIndex] = useState<number | null>(null);
  const [savingFocus, setSavingFocus] = useState(false);
  const [focusSaved, setFocusSaved] = useState(false);
  const [showServiceTestimonials, setShowServiceTestimonials] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const data = await safeFetch(`${API_BASE_URL}/testimonials.php?with_focus=1`);
      if (data.status === "success") {
        const d = data.data as { items?: typeof testimonials; focus?: typeof focusAssets } | typeof testimonials;
        if (d && !Array.isArray(d) && (d as { items?: unknown }).items) {
          const typed = d as { items: typeof testimonials; focus?: typeof focusAssets };
          setTestimonials(typed.items || []);
          setFocusAssets(typed.focus || []);
        } else if (Array.isArray(d)) {
          setTestimonials(d);
        }
        setLoading(false);
        return;
      }
    } catch (error) {
      console.error("Failed to fetch testimonials:", error);
    }

    // Fallback preview data
    const previewData = localStorage.getItem("PREVIEW_TESTIMONIALS");
    const previewFocus = localStorage.getItem("PREVIEW_FOCUS_ASSETS");
    if (previewData) {
      setTestimonials(JSON.parse(previewData));
    } else {
      // Use the same 9 testimonials shown on the public site
      setTestimonials(SHARED_FALLBACK);
    }
    if (previewFocus) {
      setFocusAssets(JSON.parse(previewFocus));
    } else {
      setFocusAssets([
        {
          type: "video",
          url: "#",
          thumbnail_url:
            "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=800",
          label: "Voices of Success",
          position: 0,
        },
      ]);
    }
    setLoading(false);
  };

  const addTestimonial = () => {
    const newIndex = testimonials.length;
    setTestimonials([
      ...testimonials,
      {
        name: "",
        role: "",
        company: "",
        content: "",
        image_url: "",
        category: "General",
        position: newIndex,
        star_rating: 5,
        video_url: "",
        logo_url: "",
        display_context: "homepage,testimonials-page",
      },
    ]);
    setExpandedIndex(newIndex);
  };

  const removeTestimonial = async (index: number) => {
    if (!confirm("Delete this testimonial?")) return;
    const t = testimonials[index];
    if (t.id) {
      try {
        await safeFetch(`${API_BASE_URL}/testimonials.php`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "delete_testimonial", id: t.id }),
        });
      } catch (error) {
        console.error("Failed to delete testimonial:", error);
      }
    }
    const next = testimonials.filter((_, i) => i !== index);
    setTestimonials(next);
    if (expandedIndex === index) setExpandedIndex(null);
    else if (expandedIndex !== null && expandedIndex > index) setExpandedIndex(expandedIndex - 1);
  };

  const updateTestimonial = (index: number, field: keyof Testimonial, value: string | number) => {
    const nextItems = [...testimonials];
    (nextItems[index] as unknown as Record<string, unknown>)[field] = value;
    setTestimonials(nextItems);
  };

  const toggleContext = (index: number, val: string) => {
    const t = testimonials[index];
    const contexts = new Set(
      (t.display_context || "").split(",").map((s) => s.trim()).filter(Boolean)
    );
    if (contexts.has(val)) contexts.delete(val);
    else contexts.add(val);
    updateTestimonial(index, "display_context", Array.from(contexts).join(","));
  };

  const saveTestimonial = async (t: Testimonial, index: number) => {
    setSavingIndex(index);
    try {
      const data = await safeFetch(`${API_BASE_URL}/testimonials.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "save_testimonial",
          testimonial: { ...t, position: index },
        }),
      });
      const saved = data.data as { id?: number } | undefined;
      if (data.status === "success" && saved?.id) {
        const updated = [...testimonials];
        updated[index] = { ...t, id: saved.id ?? t.id, position: index };
        setTestimonials(updated);
      }
      setSavedIndex(index);
      setTimeout(() => setSavedIndex(null), 2000);
    } catch (error) {
      console.error("Failed to save testimonial:", error);
    }
    setSavingIndex(null);
  };

  const addFocusAsset = () => {
    setFocusAssets([...focusAssets, { type: "logo", url: "", position: focusAssets.length }]);
  };

  const removeFocusAsset = (index: number) => {
    setFocusAssets(focusAssets.filter((_, i) => i !== index));
  };

  const updateFocusAsset = (index: number, field: keyof FocusAsset, value: string) => {
    const nextItems = [...focusAssets];
    (nextItems[index] as unknown as Record<string, unknown>)[field] = value;
    setFocusAssets(nextItems);
  };

  const saveFocusChanges = async () => {
    setSavingFocus(true);
    localStorage.setItem("PREVIEW_FOCUS_ASSETS", JSON.stringify(focusAssets));
    try {
      await safeFetch(`${API_BASE_URL}/testimonials.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "update_focus", focus: focusAssets }),
      });
    } catch (error) {
      console.error("Failed to save focus grid:", error);
    }
    setSavingFocus(false);
    setFocusSaved(true);
    setTimeout(() => setFocusSaved(false), 2000);
  };

  const importServiceTestimonial = (
    serviceSlug: string,
    quote: string,
    role: string,
    company: string,
    section: "testimonials" | "impact"
  ) => {
    const newIndex = testimonials.length;
    setTestimonials([
      ...testimonials,
      {
        name: "",
        role,
        company,
        content: quote,
        image_url: "",
        category: serviceSlug,
        position: newIndex,
        star_rating: 5,
        video_url: "",
        logo_url: "",
        display_context: "service",
        service_section: section,
      },
    ]);
    setExpandedIndex(newIndex);
    setTimeout(() => window.scrollTo({ top: 0, behavior: "smooth" }), 100);
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-[60vh]">
          <div className="text-brand font-display text-xl animate-pulse">
            Accessing Success Stories...
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">

        {/* Content-type tabs */}
        <div className="flex items-center gap-0 border-b border-slate-200 overflow-x-auto">
          {[
            { label: "Blog", href: "/admin/blog" },
            { label: "Case Studies", href: "/admin/case-studies" },
            { label: "Guides", href: "/admin/guides" },
            { label: "Testimonials", href: "/admin/testimonials" },
            { label: "Client Logos", href: "/admin/logos" },
            { label: "Authors", href: "/admin/authors" },
            { label: "Categories", href: "/admin/categories" },
          ].map(tab => (
            <a key={tab.href} href={tab.href}
              className={cn("px-4 py-2.5 text-sm font-semibold border-b-2 -mb-px transition-colors whitespace-nowrap",
                tab.href === "/admin/testimonials"
                  ? "border-brand text-brand"
                  : "border-transparent text-slate-500 hover:text-slate-800"
              )}>
              {tab.label}
            </a>
          ))}
        </div>

        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-slate-100 pb-8">
          <div className="space-y-2">
            <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-brand">
              Client Proof
            </p>
            <h1 className="text-4xl font-display font-bold text-[#1A1C1E] tracking-tight">
              Testimonials
            </h1>
            <p className="text-slate-400 text-sm max-w-lg">
              {testimonials.length} success {testimonials.length === 1 ? "story" : "stories"} — click any row to edit.
            </p>
          </div>
          <div className="flex gap-3">
            <Button
              asChild
              variant="outline"
              className="border-slate-200 text-slate-600 rounded-2xl px-5 h-12 font-bold"
            >
              <a href="/testimonials" target="_blank">
                <ExternalLink className="w-4 h-4 mr-2" />
                View Page
              </a>
            </Button>
            <Button
              onClick={addTestimonial}
              className="bg-[#1A1C1E] hover:bg-black text-white rounded-2xl px-5 h-12 font-bold"
            >
              <Plus className="w-4 h-4 mr-2" /> New Testimonial
            </Button>
          </div>
        </div>

        {/* ── Testimonials List ── */}
        <div className="space-y-6 pb-20">
          <div className="bg-white border border-slate-100 rounded-[2rem] shadow-sm overflow-hidden">

            {testimonials.length === 0 && (
              <div className="text-center py-20">
                <div className="w-14 h-14 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-100">
                  <MessageSquare className="text-slate-200 w-5 h-5" />
                </div>
                <p className="text-slate-400 font-bold tracking-widest text-[10px] uppercase">
                  No testimonials yet — add one above.
                </p>
              </div>
            )}

            {testimonials.map((t, index) => {
              const isOpen = expandedIndex === index;
              const contexts = (t.display_context || "")
                .split(",").map((s) => s.trim()).filter(Boolean);
              const initials = t.name
                ? t.name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase()
                : "?";

              return (
                <div key={index} className="border-b border-slate-50 last:border-b-0">

                  {/* ── Compact list row ── */}
                  <div
                    className={cn(
                      "flex items-start gap-4 px-5 py-4 cursor-pointer transition-colors",
                      isOpen ? "bg-brand/[0.03]" : "hover:bg-slate-50/60"
                    )}
                    onClick={() => setExpandedIndex(isOpen ? null : index)}
                  >
                    {/* Avatar — small */}
                    <div className="w-10 h-10 rounded-full overflow-hidden bg-slate-100 flex items-center justify-center shrink-0 mt-0.5">
                      {t.image_url ? (
                        <img src={t.image_url} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-[10px] font-black text-slate-400">{initials}</span>
                      )}
                    </div>

                    {/* Main content column */}
                    <div className="flex-1 min-w-0">
                      {/* Row 1: name + badges + stars + actions */}
                      <div className="flex items-center gap-3 flex-wrap">
                        <span className="text-sm font-bold text-[#1A1C1E] truncate">
                          {t.name || <span className="text-slate-300 italic font-normal">Unnamed</span>}
                        </span>
                        <span className="text-[11px] text-slate-400 font-medium truncate">
                          {[t.role, t.company].filter(Boolean).join(", ") || "—"}
                        </span>
                        {t.star_rating > 0 && (
                          <span className="text-amber-400 text-[11px] leading-none">{"★".repeat(t.star_rating)}</span>
                        )}
                        <div className="flex gap-1 flex-wrap ml-auto">
                          {contexts.length === 0 ? (
                            <span className="text-[9px] text-amber-400 font-bold px-2 py-0.5 bg-amber-50 rounded-full">Not shown</span>
                          ) : contexts.map((ctx) => (
                            <span key={ctx} className={cn("px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wide", CONTEXT_COLORS[ctx] ?? "bg-slate-100 text-slate-500")}>
                              {CONTEXT_OPTIONS.find((o) => o.value === ctx)?.label ?? ctx}
                            </span>
                          ))}
                          {contexts.includes("service") && t.category && SERVICES[t.category] && (
                            <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-blue-50 text-blue-600 border border-blue-200">
                              {SERVICES[t.category].name}
                            </span>
                          )}
                          {contexts.includes("service") && t.service_section && (
                            <span className={cn(
                              "px-2 py-0.5 rounded-full text-[9px] font-bold border",
                              SERVICE_SECTION_OPTIONS.find((o) => o.value === t.service_section)?.color ?? "bg-slate-50 text-slate-400 border-slate-200"
                            )}>
                              {SERVICE_SECTION_OPTIONS.find((o) => o.value === t.service_section)?.label ?? t.service_section}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Row 2: quote preview */}
                      {t.content ? (
                        <p className="text-[12px] text-slate-500 italic mt-1 line-clamp-2 leading-relaxed">
                          &ldquo;{t.content}&rdquo;
                        </p>
                      ) : (
                        <p className="text-[11px] text-slate-300 mt-1 italic">No quote yet — click to edit</p>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-1 shrink-0 mt-0.5" onClick={(e) => e.stopPropagation()}>
                      <Button variant="ghost" size="icon" onClick={() => removeTestimonial(index)}
                        className="h-8 w-8 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-all" title="Delete">
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => setExpandedIndex(isOpen ? null : index)}
                        className={cn("h-8 w-8 rounded-lg transition-all", isOpen ? "text-brand bg-brand/10" : "text-slate-300 hover:text-brand hover:bg-brand/5")}
                        title={isOpen ? "Collapse" : "Edit"}>
                        {isOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                      </Button>
                    </div>
                  </div>

                  {/* ── Inline editor (expanded) ── */}
                  {isOpen && (
                    <div className="px-5 pb-6 pt-3 bg-slate-50/50 border-t border-slate-100 space-y-4">

                      {/* Row A: avatar + name / role / company */}
                      <div className="flex items-start gap-4">
                        {/* Small avatar with URL below */}
                        <div className="shrink-0 space-y-1.5">
                          <div className="w-14 h-14 rounded-xl overflow-hidden bg-white border border-slate-200 flex items-center justify-center">
                            {t.image_url ? (
                              <img src={t.image_url} alt="" className="w-full h-full object-cover" />
                            ) : (
                              <User className="w-5 h-5 text-slate-300" />
                            )}
                          </div>
                          <input
                            type="text"
                            placeholder="Photo URL"
                            value={t.image_url}
                            onChange={(e) => updateTestimonial(index, "image_url", e.target.value)}
                            className="w-14 bg-white border border-slate-200 rounded-lg px-1.5 py-1 text-[8px] focus:outline-none focus:border-brand/40 font-mono text-slate-500"
                          />
                        </div>

                        {/* Name / Role / Company grid */}
                        <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-3">
                          <div className="space-y-1">
                            <label className="text-[9px] font-bold uppercase tracking-widest text-slate-400">Full Name</label>
                            <input type="text" placeholder="e.g. Sarah Chen" value={t.name}
                              onChange={(e) => updateTestimonial(index, "name", e.target.value)}
                              className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm font-bold text-[#1A1C1E] focus:outline-none focus:border-brand/40" />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[9px] font-bold uppercase tracking-widest text-slate-400">Job Role</label>
                            <input type="text" placeholder="e.g. COO" value={t.role}
                              onChange={(e) => updateTestimonial(index, "role", e.target.value)}
                              className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-600 focus:outline-none focus:border-brand/40" />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[9px] font-bold uppercase tracking-widest text-slate-400">Company</label>
                            <input type="text" placeholder="e.g. Stripe" value={t.company}
                              onChange={(e) => updateTestimonial(index, "company", e.target.value)}
                              className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-600 focus:outline-none focus:border-brand/40" />
                          </div>
                        </div>
                      </div>

                      {/* Row B: testimonial content */}
                      <div className="space-y-1">
                        <label className="text-[9px] font-bold uppercase tracking-widest text-slate-400 flex items-center gap-1">
                          <Quote className="w-2.5 h-2.5" /> Quote
                        </label>
                        <textarea rows={3} placeholder="What did the client say?"
                          value={t.content}
                          onChange={(e) => updateTestimonial(index, "content", e.target.value)}
                          className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2.5 text-sm text-[#1A1C1E] focus:outline-none focus:border-brand/40 resize-none italic leading-relaxed" />
                      </div>

                      {/* Row C: category + logo + video */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div className="space-y-1">
                          <label className="text-[9px] font-bold uppercase tracking-widest text-slate-400 flex items-center gap-1"><Tag className="w-2.5 h-2.5" /> Category</label>
                          <input type="text" placeholder="e.g. SaaS" value={t.category}
                            onChange={(e) => updateTestimonial(index, "category", e.target.value)}
                            className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs font-bold text-slate-600 uppercase tracking-widest focus:outline-none focus:border-brand/40" />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[9px] font-bold uppercase tracking-widest text-slate-400 flex items-center gap-1"><ImageIcon className="w-2.5 h-2.5" /> Company Logo URL</label>
                          <input type="text" placeholder="https://logo.clearbit.com/…" value={t.logo_url}
                            onChange={(e) => updateTestimonial(index, "logo_url", e.target.value)}
                            className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-[10px] font-mono focus:outline-none focus:border-brand/40" />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[9px] font-bold uppercase tracking-widest text-slate-400 flex items-center gap-1"><Video className="w-2.5 h-2.5" /> Video URL</label>
                          <input type="text" placeholder="Optional embed URL" value={t.video_url}
                            onChange={(e) => updateTestimonial(index, "video_url", e.target.value)}
                            className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-[10px] font-mono focus:outline-none focus:border-brand/40" />
                        </div>
                      </div>

                      {/* Row D: rating + context + save */}
                      <div className="flex flex-wrap items-center gap-4 pt-3 border-t border-slate-100">
                        {/* Stars */}
                        <div className="flex items-center gap-1.5">
                          <span className="text-[9px] font-bold uppercase tracking-widest text-slate-400 mr-1">Rating</span>
                          {[0, 1, 2, 3, 4, 5].map((n) => (
                            <button key={n} type="button" onClick={() => updateTestimonial(index, "star_rating", n)}
                              className={cn("px-2 py-0.5 rounded text-xs font-bold transition-all",
                                t.star_rating === n ? "bg-brand text-white" : "bg-white border border-slate-200 text-slate-500 hover:border-brand/30")}>
                              {n === 0 ? "Off" : "★".repeat(n)}
                            </button>
                          ))}
                        </div>

                        {/* Context */}
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-[9px] font-bold uppercase tracking-widest text-slate-400">Show on</span>
                          {CONTEXT_OPTIONS.map(({ value, label }) => {
                            const checked = contexts.includes(value);
                            return (
                              <label key={value} className={cn(
                                "flex items-center gap-1 px-2.5 py-1 rounded-lg border cursor-pointer transition-all select-none text-[11px] font-bold",
                                checked ? "bg-brand/10 border-brand/30 text-brand" : "bg-white border-slate-200 text-slate-500 hover:border-slate-300"
                              )}>
                                <input type="checkbox" className="sr-only" checked={checked} onChange={() => toggleContext(index, value)} />
                                <span className={cn("w-2.5 h-2.5 rounded-sm flex items-center justify-center border text-white text-[6px] font-black",
                                  checked ? "bg-brand border-brand" : "border-slate-300")}>
                                  {checked && "✓"}
                                </span>
                                {label}
                              </label>
                            );
                          })}
                          {contexts.length === 0 && <span className="text-[10px] text-amber-500 font-bold">Not shown anywhere</span>}
                        </div>

                        {/* Service subcategory — only when service context is active */}
                        {contexts.includes("service") && (
                          <div className="flex items-center gap-2 flex-wrap w-full border-t border-slate-100 pt-3">
                            <span className="text-[9px] font-bold uppercase tracking-widest text-slate-400">Service Section</span>
                            {SERVICE_SECTION_OPTIONS.map(({ value, label, color }) => {
                              const active = t.service_section === value;
                              return (
                                <button key={value} type="button"
                                  onClick={() => updateTestimonial(index, "service_section", active ? "" : value)}
                                  className={cn(
                                    "px-3 py-1 rounded-lg border text-[11px] font-bold transition-all",
                                    active ? color : "bg-white border-slate-200 text-slate-400 hover:border-slate-300"
                                  )}>
                                  {label}
                                </button>
                              );
                            })}
                            {!t.service_section && (
                              <span className="text-[10px] text-amber-500 font-bold">Select which section this quote appears in</span>
                            )}
                          </div>
                        )}

                        {/* Save — pushed right */}
                        <Button onClick={() => saveTestimonial(t, index)} disabled={savingIndex === index}
                          className={cn("ml-auto shrink-0 px-5 h-9 rounded-xl font-bold text-sm transition-all active:scale-95",
                            savedIndex === index ? "bg-emerald-500 hover:bg-emerald-500 text-white" : "bg-brand hover:bg-brand/90 text-white")}>
                          {savingIndex === index ? "Saving…" : savedIndex === index ? "Saved ✓" : <><Save className="w-3.5 h-3.5 mr-1.5" />Save</>}
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* ── Service Page Testimonials (Static) ── */}
          <div className="pt-8 border-t border-slate-100">
            <div className="flex items-center justify-between mb-4">
              <div className="space-y-1">
                <h3 className="text-sm font-black uppercase tracking-[0.2em] text-[#1A1C1E]">
                  Service Page Testimonials
                </h3>
                <p className="text-xs text-slate-400">
                  Embedded quotes from each service page. Click &ldquo;Add to CMS&rdquo; to make a quote editable.
                </p>
              </div>
              <Button variant="outline" size="sm"
                onClick={() => setShowServiceTestimonials(!showServiceTestimonials)}
                className="border-slate-200 text-slate-500 rounded-xl px-4 h-9 font-bold text-xs">
                {showServiceTestimonials ? <ChevronUp className="w-3.5 h-3.5 mr-1.5" /> : <ChevronDown className="w-3.5 h-3.5 mr-1.5" />}
                {showServiceTestimonials ? "Collapse" : "Browse"}
              </Button>
            </div>

            {showServiceTestimonials && (
              <div className="space-y-6">
                {Object.entries(SERVICES).map(([slug, svc]) => {
                  const testimonialItems = svc.testimonials ?? [];
                  const impactItems = svc.marketImpact?.outcomesCards ?? [];
                  if (testimonialItems.length === 0 && impactItems.length === 0) return null;
                  return (
                    <div key={slug} className="bg-white border border-slate-100 rounded-[2rem] shadow-sm overflow-hidden">
                      <div className="px-5 py-3 bg-slate-50/50 border-b border-slate-100 flex items-center gap-2">
                        <Globe2 className="w-3.5 h-3.5 text-slate-400" />
                        <h4 className="text-xs font-black uppercase tracking-[0.2em] text-[#1A1C1E]">{svc.name}</h4>
                        <span className="text-[10px] text-slate-400 font-medium ml-auto">/services/{slug}</span>
                      </div>

                      {testimonialItems.map((t, i) => (
                        <div key={`t-${i}`} className="flex items-start gap-4 px-5 py-4 border-b border-slate-50 last:border-b-0 hover:bg-slate-50/40 transition-colors">
                          <div className="flex-1 min-w-0 space-y-1.5">
                            <span className={cn("inline-block px-2 py-0.5 rounded-full text-[9px] font-bold border", SERVICE_SECTION_OPTIONS[0].color)}>
                              Testimonials Section
                            </span>
                            <p className="text-[12px] text-slate-600 italic leading-relaxed line-clamp-2">&ldquo;{t.quote}&rdquo;</p>
                            <p className="text-[11px] text-slate-400 font-medium">{[t.role, t.company].filter(Boolean).join(", ")}</p>
                          </div>
                          <Button size="sm" variant="outline"
                            onClick={() => importServiceTestimonial(slug, t.quote, t.role, t.company ?? "", "testimonials")}
                            className="shrink-0 text-[10px] font-bold border-brand/30 text-brand hover:bg-brand/5 rounded-lg h-8 px-3">
                            <Plus className="w-3 h-3 mr-1" /> Add to CMS
                          </Button>
                        </div>
                      ))}

                      {impactItems.map(([quote, company, sector, value, label], i) => (
                        <div key={`imp-${i}`} className="flex items-start gap-4 px-5 py-4 border-b border-slate-50 last:border-b-0 hover:bg-slate-50/40 transition-colors">
                          <div className="flex-1 min-w-0 space-y-1.5">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className={cn("px-2 py-0.5 rounded-full text-[9px] font-bold border", SERVICE_SECTION_OPTIONS[1].color)}>
                                Impact Section
                              </span>
                              <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-slate-100 text-slate-500 border border-slate-200">
                                {value} {label}
                              </span>
                            </div>
                            <p className="text-[12px] text-slate-600 italic leading-relaxed line-clamp-2">&ldquo;{quote}&rdquo;</p>
                            <p className="text-[11px] text-slate-400 font-medium">{[company, sector].filter(Boolean).join(" · ")}</p>
                          </div>
                          <Button size="sm" variant="outline"
                            onClick={() => importServiceTestimonial(slug, quote, sector, company, "impact")}
                            className="shrink-0 text-[10px] font-bold border-brand/30 text-brand hover:bg-brand/5 rounded-lg h-8 px-3">
                            <Plus className="w-3 h-3 mr-1" /> Add to CMS
                          </Button>
                        </div>
                      ))}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* ── Focus Grid Management ── */}
          <div className="pt-8 border-t border-slate-100">
            <div className="flex items-center justify-between mb-6">
              <div className="space-y-1">
                <h3 className="text-sm font-black uppercase tracking-[0.2em] text-[#1A1C1E]">
                  Mosaic In-Focus Stack
                </h3>
                <p className="text-xs text-slate-400">
                  Logos, photos, and videos for the &quot;Human Side&quot; mosaic grid.
                </p>
              </div>
              <div className="flex gap-3">
                <Button
                  onClick={addFocusAsset}
                  size="sm"
                  className="bg-[#1A1C1E] hover:bg-black text-white rounded-xl px-4 h-10 font-bold"
                >
                  <Plus className="w-4 h-4 mr-2" /> New Asset
                </Button>
                <Button
                  onClick={saveFocusChanges}
                  disabled={savingFocus}
                  className={cn(
                    "px-6 h-10 rounded-xl font-bold transition-all shadow-sm",
                    focusSaved
                      ? "bg-emerald-500 hover:bg-emerald-500 text-white"
                      : "bg-brand text-white shadow-brand/10"
                  )}
                >
                  {savingFocus ? "Saving..." : focusSaved ? "Saved ✓" : "Save Focus Grid"}
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {focusAssets.map((asset, index) => (
                <Card key={index} className="p-5 bg-white border-slate-100 rounded-2xl">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <select
                        value={asset.type}
                        onChange={(e) =>
                          updateFocusAsset(index, "type", e.target.value as "logo" | "video" | "photo")
                        }
                        className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-bold focus:outline-none focus:border-brand"
                      >
                        <option value="logo">Logo / Text</option>
                        <option value="video">Video Asset</option>
                      </select>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeFocusAsset(index)}
                        className="h-8 w-8 text-rose-300 hover:text-rose-500 hover:bg-rose-50 rounded-lg"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] font-bold uppercase tracking-widest text-slate-400">Source URL</label>
                      <input
                        type="text"
                        placeholder="URL"
                        value={asset.url}
                        onChange={(e) => updateFocusAsset(index, "url", e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-[10px] focus:outline-none focus:border-brand font-mono"
                      />
                    </div>
                    {asset.type === "video" && (
                      <div className="space-y-1">
                        <label className="text-[9px] font-bold uppercase tracking-widest text-slate-400">Thumbnail URL</label>
                        <input
                          type="text"
                          placeholder="Image URL"
                          value={asset.thumbnail_url || ""}
                          onChange={(e) => updateFocusAsset(index, "thumbnail_url", e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-[10px] focus:outline-none focus:border-brand font-mono"
                        />
                      </div>
                    )}
                    <div className="space-y-1">
                      <label className="text-[9px] font-bold uppercase tracking-widest text-slate-400">Label</label>
                      <input
                        type="text"
                        placeholder="e.g. Google Logo"
                        value={asset.label || ""}
                        onChange={(e) => updateFocusAsset(index, "label", e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-[10px] focus:outline-none focus:border-brand"
                      />
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
