"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Trash2, Plus, Save, User, ExternalLink,
  Briefcase, Building, Quote, Tag, MessageSquare,
  Video, Star, Image as ImageIcon, Globe2
} from "lucide-react";
import AdminLayout from "@/components/admin/admin-layout";
import { cn } from "@/lib/utils";
import { API_BASE_URL } from "@/lib/constants";

interface Testimonial {
  id?: number;
  name: string;
  role: string;
  company: string;
  content: string;
  image_url: string;
  category: string;
  position: number;
  star_rating: number;     // 0 = no stars shown, 1-5 = show N stars
  video_url: string;       // if set, renders video embed instead of image
  logo_url: string;        // company logo shown in card footer
  display_context: string; // comma-separated: "homepage", "service", "testimonials-page"
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
  { value: "homepage", label: "Homepage Block" },
  { value: "service", label: "Service Pages" },
  { value: "testimonials-page", label: "Testimonials Page" },
];

export default function AdminTestimonialsPage() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [focusAssets, setFocusAssets] = useState<FocusAsset[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingIndex, setSavingIndex] = useState<number | null>(null);
  const [savingFocus, setSavingFocus] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/testimonials.php?with_focus=1`);
      const data = await response.json();
      if (data.status === "success") {
        // Handle both response shapes: {items, focus} or flat array
        if (data.data?.items) {
          setTestimonials(data.data.items || []);
          setFocusAssets(data.data.focus || []);
        } else if (Array.isArray(data.data)) {
          setTestimonials(data.data);
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
      setTestimonials([
        {
          name: "Sarah Chen",
          role: "Product Manager",
          company: "Stripe",
          content: "Working with Digi Pexel transformed our marketing pipeline completely.",
          image_url: "https://i.pravatar.cc/150?u=sarah",
          category: "Fintech",
          position: 0,
          star_rating: 5,
          video_url: "",
          logo_url: "",
          display_context: "homepage,testimonials-page",
        },
      ]);
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
    setTestimonials([
      ...testimonials,
      {
        name: "",
        role: "",
        company: "",
        content: "",
        image_url: "",
        category: "General",
        position: testimonials.length,
        star_rating: 5,
        video_url: "",
        logo_url: "",
        display_context: "homepage,testimonials-page",
      },
    ]);
  };

  const removeTestimonial = async (index: number) => {
    if (!confirm("Delete this testimonial?")) return;
    const t = testimonials[index];
    if (t.id) {
      try {
        await fetch(`${API_BASE_URL}/testimonials.php`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "delete_testimonial", id: t.id }),
        });
      } catch (error) {
        console.error("Failed to delete testimonial:", error);
      }
    }
    setTestimonials(testimonials.filter((_, i) => i !== index));
  };

  const updateTestimonial = (
    index: number,
    field: keyof Testimonial,
    value: string | number
  ) => {
    const nextItems = [...testimonials];
    (nextItems[index] as unknown as Record<string, unknown>)[field] = value;
    setTestimonials(nextItems);
  };

  const toggleContext = (index: number, val: string) => {
    const t = testimonials[index];
    const contexts = new Set(
      (t.display_context || "").split(",").map((s) => s.trim()).filter(Boolean)
    );
    if (contexts.has(val)) {
      contexts.delete(val);
    } else {
      contexts.add(val);
    }
    updateTestimonial(index, "display_context", Array.from(contexts).join(","));
  };

  const saveTestimonial = async (t: Testimonial, index: number) => {
    setSavingIndex(index);
    try {
      const res = await fetch(`${API_BASE_URL}/testimonials.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "save_testimonial",
          testimonial: { ...t, position: index },
        }),
      });
      const data = await res.json();
      if (data.status === "success" && data.data?.id) {
        // Update local state with returned id if this was a new testimonial
        const updated = [...testimonials];
        updated[index] = { ...t, id: data.data.id ?? t.id, position: index };
        setTestimonials(updated);
      }
    } catch (error) {
      console.error("Failed to save testimonial:", error);
    }
    setSavingIndex(null);
  };

  const getFormatBadge = (t: Testimonial) => {
    if (t.video_url) return { label: "Video", color: "bg-purple-100 text-purple-700" };
    if (t.image_url) return { label: "Image", color: "bg-blue-100 text-blue-700" };
    return { label: "Text Only", color: "bg-slate-100 text-slate-600" };
  };

  const addFocusAsset = () => {
    const newItem: FocusAsset = { type: "logo", url: "", position: focusAssets.length };
    setFocusAssets([...focusAssets, newItem]);
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
      await fetch(`${API_BASE_URL}/testimonials.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "update_focus", focus: focusAssets }),
      });
      alert("Focus grid updated!");
    } catch (error) {
      console.error("Failed to save focus grid:", error);
    }
    setSavingFocus(false);
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
      <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div className="space-y-2">
            <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-brand">
              Client Proof
            </p>
            <h1 className="text-5xl font-display font-bold text-[#1A1C1E] tracking-tight">
              Testimonials
            </h1>
            <p className="text-slate-400 text-sm max-w-lg">
              Manage partner success stories and endorsements. Each testimonial can be
              assigned to specific pages via Display Context.
            </p>
          </div>

          <div className="flex gap-4">
            <Button
              asChild
              variant="outline"
              className="border-slate-200 text-slate-600 rounded-2xl px-6 h-14 font-bold"
            >
              <a href="/testimonials" target="_blank">
                <ExternalLink className="w-4 h-4 mr-2" />
                View Page
              </a>
            </Button>
          </div>
        </div>

        {/* Testimonials List */}
        <div className="space-y-8 pb-20">
          <div className="flex items-center justify-between px-2">
            <h3 className="text-sm font-black uppercase tracking-[0.2em] text-slate-400">
              Success Stack ({testimonials.length})
            </h3>
            <Button
              onClick={addTestimonial}
              size="sm"
              className="bg-[#1A1C1E] hover:bg-black text-white rounded-xl px-4 h-10 font-bold"
            >
              <Plus className="w-4 h-4 mr-2" /> New Testimonial
            </Button>
          </div>

          <div className="grid grid-cols-1 gap-6">
            {testimonials.map((t, index) => {
              const badge = getFormatBadge(t);
              const contexts = (t.display_context || "")
                .split(",")
                .map((s) => s.trim())
                .filter(Boolean);

              return (
                <Card
                  key={index}
                  className="bg-white border-slate-100 rounded-[2.5rem] p-8 shadow-[0_10px_40px_-15px_rgba(0,0,0,0.02)] group hover:border-brand/20 transition-all duration-500"
                >
                  <div className="flex flex-col gap-10">
                    {/* Top row: photo + core fields + delete */}
                    <div className="flex flex-col lg:flex-row gap-10">
                      {/* User Photo Preview */}
                      <div className="w-full lg:w-48 shrink-0">
                        <div className="relative aspect-square rounded-3xl overflow-hidden bg-slate-50 border border-slate-100 group-hover:shadow-lg transition-all duration-500">
                          {t.image_url ? (
                            <img
                              src={t.image_url}
                              alt=""
                              className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                            />
                          ) : (
                            <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-200 gap-2">
                              <User className="w-8 h-8" />
                              <span className="text-[10px] font-bold uppercase tracking-widest">
                                No Photo
                              </span>
                            </div>
                          )}
                        </div>
                        <div className="mt-4 space-y-2">
                          <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">
                            Photo URL
                          </label>
                          <input
                            type="text"
                            placeholder="https://..."
                            value={t.image_url}
                            onChange={(e) =>
                              updateTestimonial(index, "image_url", e.target.value)
                            }
                            className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-2 text-[11px] focus:outline-none focus:border-brand/30 transition-all font-mono"
                          />
                        </div>

                        {/* Format badge */}
                        <div className="mt-3">
                          <span
                            className={cn(
                              "inline-block px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest",
                              badge.color
                            )}
                          >
                            {badge.label}
                          </span>
                        </div>
                      </div>

                      {/* Info Section */}
                      <div className="flex-1 space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                          <div className="space-y-2">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">
                              Full Name
                            </label>
                            <div className="relative">
                              <div className="absolute inset-y-0 left-4 flex items-center text-slate-300">
                                <User className="w-4 h-4" />
                              </div>
                              <input
                                type="text"
                                placeholder="e.g. Sarah Chen"
                                value={t.name}
                                onChange={(e) =>
                                  updateTestimonial(index, "name", e.target.value)
                                }
                                className="w-full bg-slate-50 border border-slate-100 rounded-2xl pl-11 pr-4 py-4 text-sm font-bold text-[#1A1C1E] focus:outline-none focus:border-brand/30 transition-all"
                              />
                            </div>
                          </div>
                          <div className="space-y-2">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">
                              Job Role
                            </label>
                            <div className="relative">
                              <div className="absolute inset-y-0 left-4 flex items-center text-slate-300">
                                <Briefcase className="w-4 h-4" />
                              </div>
                              <input
                                type="text"
                                placeholder="e.g. Product Manager"
                                value={t.role}
                                onChange={(e) =>
                                  updateTestimonial(index, "role", e.target.value)
                                }
                                className="w-full bg-slate-50 border border-slate-100 rounded-2xl pl-11 pr-4 py-4 text-sm font-medium text-slate-600 focus:outline-none focus:border-brand/30 transition-all"
                              />
                            </div>
                          </div>
                          <div className="space-y-2">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">
                              Company
                            </label>
                            <div className="relative">
                              <div className="absolute inset-y-0 left-4 flex items-center text-slate-300">
                                <Building className="w-4 h-4" />
                              </div>
                              <input
                                type="text"
                                placeholder="e.g. Stripe"
                                value={t.company}
                                onChange={(e) =>
                                  updateTestimonial(index, "company", e.target.value)
                                }
                                className="w-full bg-slate-50 border border-slate-100 rounded-2xl pl-11 pr-4 py-4 text-sm font-medium text-slate-600 focus:outline-none focus:border-brand/30 transition-all"
                              />
                            </div>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1 flex items-center gap-2">
                            <Quote className="w-3 h-3" /> Testimonial Content
                          </label>
                          <textarea
                            rows={3}
                            placeholder="What did the client say?"
                            value={t.content}
                            onChange={(e) =>
                              updateTestimonial(index, "content", e.target.value)
                            }
                            className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-sm text-[#1A1C1E] focus:outline-none focus:border-brand/30 transition-all resize-none font-medium italic"
                          />
                        </div>

                        <div className="space-y-2 w-full md:w-1/3">
                          <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">
                            Industry / Category
                          </label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-4 flex items-center text-slate-300">
                              <Tag className="w-4 h-4" />
                            </div>
                            <input
                              type="text"
                              placeholder="e.g. Fintech"
                              value={t.category}
                              onChange={(e) =>
                                updateTestimonial(index, "category", e.target.value)
                              }
                              className="w-full bg-slate-50 border border-slate-100 rounded-2xl pl-11 pr-4 py-3 text-[11px] font-bold text-slate-600 focus:outline-none focus:border-brand/30 transition-all uppercase tracking-widest"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Delete Action */}
                      <div className="flex lg:flex-col justify-end">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeTestimonial(index)}
                          className="h-14 w-14 text-rose-300 hover:text-rose-500 hover:bg-rose-50 rounded-2xl transition-all"
                        >
                          <Trash2 className="w-6 h-6" />
                        </Button>
                      </div>
                    </div>

                    {/* Extended fields row */}
                    <div className="border-t border-slate-50 pt-8 space-y-8">
                      {/* Star Rating */}
                      <div className="space-y-3">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1 flex items-center gap-2">
                          <Star className="w-3 h-3" /> Star Rating
                        </label>
                        <div className="flex items-center flex-wrap gap-2">
                          {[0, 1, 2, 3, 4, 5].map((n) => (
                            <button
                              key={n}
                              type="button"
                              onClick={() => updateTestimonial(index, "star_rating", n)}
                              className={cn(
                                "px-3 py-1.5 rounded-xl text-xs font-bold transition-all",
                                t.star_rating === n
                                  ? "bg-brand text-white shadow-md shadow-brand/20"
                                  : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                              )}
                            >
                              {n === 0 ? "None" : `${n}★`}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Video URL + Company Logo URL */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Video URL */}
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1 flex items-center gap-2">
                            <Video className="w-3 h-3" /> Video URL (optional)
                          </label>
                          <input
                            type="text"
                            placeholder="Embed link or direct video URL"
                            value={t.video_url}
                            onChange={(e) =>
                              updateTestimonial(index, "video_url", e.target.value)
                            }
                            className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3 text-[11px] focus:outline-none focus:border-brand/30 transition-all font-mono"
                          />
                          {t.video_url && (
                            <div className="flex items-center gap-2 px-3 py-2 bg-purple-50 border border-purple-100 rounded-xl">
                              <Video className="w-3 h-3 text-purple-500 shrink-0" />
                              <span className="text-[10px] text-purple-600 font-bold truncate">
                                Video set — card will render as video format
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Company Logo URL */}
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1 flex items-center gap-2">
                            <ImageIcon className="w-3 h-3" /> Company Logo URL (optional)
                          </label>
                          <input
                            type="text"
                            placeholder="https://logo.clearbit.com/company.com"
                            value={t.logo_url}
                            onChange={(e) =>
                              updateTestimonial(index, "logo_url", e.target.value)
                            }
                            className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3 text-[11px] focus:outline-none focus:border-brand/30 transition-all font-mono"
                          />
                          {t.logo_url && (
                            <div className="flex items-center gap-3 px-3 py-2 bg-slate-50 border border-slate-100 rounded-xl">
                              <img
                                src={t.logo_url}
                                alt="logo preview"
                                className="w-8 h-8 object-contain rounded"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).style.display = "none";
                                }}
                              />
                              <span className="text-[10px] text-slate-500 font-bold truncate">
                                Logo preview
                              </span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Display Context */}
                      <div className="space-y-3">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1 flex items-center gap-2">
                          <Globe2 className="w-3 h-3" /> Display Context
                        </label>
                        <div className="flex items-center flex-wrap gap-4">
                          {CONTEXT_OPTIONS.map(({ value, label }) => {
                            const checked = contexts.includes(value);
                            return (
                              <label
                                key={value}
                                className={cn(
                                  "flex items-center gap-2 px-4 py-2.5 rounded-2xl border cursor-pointer transition-all select-none text-xs font-bold",
                                  checked
                                    ? "bg-brand/10 border-brand/30 text-brand"
                                    : "bg-slate-50 border-slate-100 text-slate-500 hover:border-slate-200"
                                )}
                              >
                                <input
                                  type="checkbox"
                                  className="sr-only"
                                  checked={checked}
                                  onChange={() => toggleContext(index, value)}
                                />
                                <span
                                  className={cn(
                                    "w-3.5 h-3.5 rounded flex items-center justify-center border text-white text-[8px] font-black",
                                    checked
                                      ? "bg-brand border-brand"
                                      : "border-slate-300"
                                  )}
                                >
                                  {checked && "✓"}
                                </span>
                                {label}
                              </label>
                            );
                          })}
                        </div>
                        {contexts.length === 0 && (
                          <p className="text-[10px] text-amber-500 ml-1 font-bold">
                            No context selected — this testimonial will not appear anywhere.
                          </p>
                        )}
                      </div>

                      {/* Per-card Save button */}
                      <div className="flex justify-end">
                        <Button
                          onClick={() => saveTestimonial(t, index)}
                          disabled={savingIndex === index}
                          className="bg-brand hover:bg-brand/90 text-white px-6 h-11 rounded-2xl font-bold shadow-lg shadow-brand/20 transition-all active:scale-95"
                        >
                          {savingIndex === index ? (
                            "Saving..."
                          ) : (
                            <>
                              <Save className="w-4 h-4 mr-2" /> Save
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              );
            })}

            {testimonials.length === 0 && (
              <div className="text-center py-24 border-2 border-dashed border-slate-100 rounded-[3rem] bg-slate-50/30">
                <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-sm">
                  <MessageSquare className="w-10 h-10 text-slate-200" />
                </div>
                <h4 className="text-slate-400 font-bold text-lg mb-2">No Proof Found</h4>
                <p className="text-slate-400/60 max-w-xs mx-auto text-sm italic">
                  Collect and publish client success stories here to build trust and
                  authority.
                </p>
              </div>
            )}
          </div>

          {/* Focus Grid Management */}
          <div className="pt-20 border-t border-slate-100">
            <div className="flex items-center justify-between mb-8">
              <div className="space-y-1">
                <h3 className="text-sm font-black uppercase tracking-[0.2em] text-[#1A1C1E]">
                  Mosaic In-Focus Stack
                </h3>
                <p className="text-xs text-slate-400">
                  Manage logos, photos, and videos for the &quot;Human Side&quot; mosaic grid.
                </p>
              </div>
              <div className="flex gap-4">
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
                  className="bg-brand text-white px-6 h-10 rounded-xl font-bold transition-all shadow-lg shadow-brand/10"
                >
                  {savingFocus ? "Saving..." : "Save Focus Grid"}
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {focusAssets.map((asset, index) => (
                <Card
                  key={index}
                  className="p-6 bg-slate-50/50 border-slate-100 rounded-3xl relative group"
                >
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-[9px] font-bold uppercase tracking-widest text-slate-400">
                          Type
                        </label>
                        <select
                          value={asset.type}
                          onChange={(e) =>
                            updateFocusAsset(index, "type", e.target.value as "logo" | "video" | "photo")
                          }
                          className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold focus:outline-none focus:border-brand"
                        >
                          <option value="logo">Logo / Text</option>
                          <option value="video">Video Asset</option>
                        </select>
                      </div>
                      <div className="space-y-1 text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFocusAsset(index)}
                          className="h-8 w-8 text-rose-300 hover:text-rose-500 hover:bg-rose-50 rounded-lg"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] font-bold uppercase tracking-widest text-slate-400">
                        Source URL / Embed
                      </label>
                      <input
                        type="text"
                        placeholder="URL"
                        value={asset.url}
                        onChange={(e) => updateFocusAsset(index, "url", e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-[10px] focus:outline-none focus:border-brand font-mono"
                      />
                    </div>
                    {asset.type === "video" && (
                      <div className="space-y-1">
                        <label className="text-[9px] font-bold uppercase tracking-widest text-slate-400">
                          Thumbnail URL
                        </label>
                        <input
                          type="text"
                          placeholder="Image URL"
                          value={asset.thumbnail_url || ""}
                          onChange={(e) =>
                            updateFocusAsset(index, "thumbnail_url", e.target.value)
                          }
                          className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-[10px] focus:outline-none focus:border-brand font-mono"
                        />
                      </div>
                    )}
                    <div className="space-y-1">
                      <label className="text-[9px] font-bold uppercase tracking-widest text-slate-400">
                        Label / Alt Text
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Google Logo"
                        value={asset.label || ""}
                        onChange={(e) => updateFocusAsset(index, "label", e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-[10px] focus:outline-none focus:border-brand"
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
