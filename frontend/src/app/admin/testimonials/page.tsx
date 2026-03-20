"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trash2, Plus, Save, User, ExternalLink, Image as ImageIcon, Briefcase, Building, Quote, Tag, MessageSquare } from "lucide-react";
import AdminLayout from "@/components/admin/admin-layout";
import { cn } from "@/lib/utils";

interface Testimonial {
  id?: number;
  name: string;
  role: string;
  company: string;
  content: string;
  image_url: string;
  category: string;
  position: number;
}

interface FocusAsset {
  id?: number;
  type: 'logo' | 'video' | 'photo';
  url: string;
  thumbnail_url?: string;
  label?: string;
  position: number;
}

export default function AdminTestimonialsPage() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [focusAssets, setFocusAssets] = useState<FocusAsset[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savingFocus, setSavingFocus] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch("/api/testimonials.php");
      const data = await response.json();
      if (data.status === "success") {
        setTestimonials(data.data || []);
        setFocusAssets(data.focus || []);
        setLoading(false);
        return;
      }
    } catch (error) {
      console.log("PHP Backend not detected, loading preview data...");
    }

    const previewData = localStorage.getItem("PREVIEW_TESTIMONIALS");
    const previewFocus = localStorage.getItem("PREVIEW_FOCUS_ASSETS");
    
    if (previewData) setTestimonials(JSON.parse(previewData));
    else setTestimonials([{ name: "Sarah Chen", role: "Product Manager", company: "Stripe", content: "...", image_url: "https://i.pravatar.cc/150?u=sarah", category: "Fintech", position: 0 }]);
    
    if (previewFocus) setFocusAssets(JSON.parse(previewFocus));
    else setFocusAssets([
        { type: 'video', url: '#', thumbnail_url: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=800', label: 'Voices of Success', position: 0 }
    ]);

    setLoading(false);
  };

  const addTestimonial = () => {
    const nextItem: Testimonial = {
      name: "Client Name",
      role: "Job Title",
      company: "Company Name",
      content: "Enter the testimonial text here...",
      image_url: "",
      category: "Finance",
      position: testimonials.length
    };
    setTestimonials([...testimonials, nextItem]);
  };

  const removeTestimonial = (index: number) => {
    if (confirm("Are you sure you want to delete this testimonial?")) {
      setTestimonials(testimonials.filter((_, i) => i !== index));
    }
  };

  const updateTestimonial = (index: number, field: keyof Testimonial, value: string) => {
    const nextItems = [...testimonials];
    (nextItems[index] as any)[field] = value;
    setTestimonials(nextItems);
  };

  const addFocusAsset = () => {
    const newItem: FocusAsset = { type: 'logo', url: '', position: focusAssets.length };
    setFocusAssets([...focusAssets, newItem]);
  };

  const removeFocusAsset = (index: number) => {
    setFocusAssets(focusAssets.filter((_, i) => i !== index));
  };

  const updateFocusAsset = (index: number, field: keyof FocusAsset, value: string) => {
    const nextItems = [...focusAssets];
    (nextItems[index] as any)[field] = value;
    setFocusAssets(nextItems);
  };

  const saveChanges = async () => {
    setSaving(true);
    localStorage.setItem("PREVIEW_TESTIMONIALS", JSON.stringify(testimonials));
    try {
      await fetch("/api/testimonials.php", {
        method: "POST",
        body: JSON.stringify({ action: "update_testimonials", testimonials }),
      });
      alert("Testimonials updated!");
    } catch (error) {}
    setSaving(false);
  };

  const saveFocusChanges = async () => {
    setSavingFocus(true);
    localStorage.setItem("PREVIEW_FOCUS_ASSETS", JSON.stringify(focusAssets));
    try {
      await fetch("/api/testimonials.php", {
        method: "POST",
        body: JSON.stringify({ action: "update_focus", focus: focusAssets }),
      });
      alert("Focus grid updated!");
    } catch (error) {}
    setSavingFocus(false);
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-[60vh]">
          <div className="text-brand font-display text-xl animate-pulse">Accessing Success Stories...</div>
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
            <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-brand">Client Proof</p>
            <h1 className="text-5xl font-display font-bold text-[#1A1C1E] tracking-tight">Testimonials</h1>
            <p className="text-slate-400 text-sm max-w-lg">Manage partner success stories and endorsements. These appear on the homepage and /testimonials page.</p>
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
            <Button 
              onClick={saveChanges} 
              disabled={saving}
              className="bg-brand hover:bg-brand/90 text-white px-8 h-14 rounded-2xl font-bold shadow-xl shadow-brand/20 transition-all active:scale-95"
            >
              {saving ? "Saving..." : <><Save className="w-4 h-4 mr-2" /> Publish Changes</>}
            </Button>
          </div>
        </div>

        {/* List Content */}
        <div className="space-y-8 pb-20">
            <div className="flex items-center justify-between px-2">
                <h3 className="text-sm font-black uppercase tracking-[0.2em] text-slate-400">Success Stack ({testimonials.length})</h3>
                <Button onClick={addTestimonial} size="sm" className="bg-[#1A1C1E] hover:bg-black text-white rounded-xl px-4 h-10 font-bold">
                    <Plus className="w-4 h-4 mr-2" /> New Testimonial
                </Button>
            </div>

            <div className="grid grid-cols-1 gap-6">
                {testimonials.map((t, index) => (
                    <Card key={index} className="bg-white border-slate-100 rounded-[2.5rem] p-8 shadow-[0_10px_40px_-15px_rgba(0,0,0,0.02)] group hover:border-brand/20 transition-all duration-500">
                        <div className="flex flex-col gap-10">
                            <div className="flex flex-col lg:flex-row gap-10">
                                {/* User Photo Preview */}
                                <div className="w-full lg:w-48 shrink-0">
                                    <div className="relative aspect-square rounded-3xl overflow-hidden bg-slate-50 border border-slate-100 group-hover:shadow-lg transition-all duration-500">
                                        {t.image_url ? (
                                            <img src={t.image_url} alt="" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" />
                                        ) : (
                                            <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-200 gap-2">
                                                <User className="w-8 h-8" />
                                                <span className="text-[10px] font-bold uppercase tracking-widest">No Photo</span>
                                            </div>
                                        )}
                                    </div>
                                    <div className="mt-4 space-y-2">
                                        <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Photo URL</label>
                                        <input 
                                            type="text" 
                                            placeholder="https://..."
                                            value={t.image_url}
                                            onChange={(e) => updateTestimonial(index, "image_url", e.target.value)}
                                            className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-2 text-[11px] focus:outline-none focus:border-brand/30 transition-all font-mono"
                                        />
                                    </div>
                                </div>

                                {/* Info Section */}
                                <div className="flex-1 space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Full Name</label>
                                            <div className="relative">
                                                <div className="absolute inset-y-0 left-4 flex items-center text-slate-300">
                                                    <User className="w-4 h-4" />
                                                </div>
                                                <input 
                                                    type="text" 
                                                    placeholder="e.g. Sarah Chen"
                                                    value={t.name}
                                                    onChange={(e) => updateTestimonial(index, "name", e.target.value)}
                                                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl pl-11 pr-4 py-4 text-sm font-bold text-[#1A1C1E] focus:outline-none focus:border-brand/30 transition-all"
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Job Role</label>
                                            <div className="relative">
                                                <div className="absolute inset-y-0 left-4 flex items-center text-slate-300">
                                                    <Briefcase className="w-4 h-4" />
                                                </div>
                                                <input 
                                                    type="text" 
                                                    placeholder="e.g. Product Manager"
                                                    value={t.role}
                                                    onChange={(e) => updateTestimonial(index, "role", e.target.value)}
                                                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl pl-11 pr-4 py-4 text-sm font-medium text-slate-600 focus:outline-none focus:border-brand/30 transition-all"
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Company</label>
                                            <div className="relative">
                                                <div className="absolute inset-y-0 left-4 flex items-center text-slate-300">
                                                    <Building className="w-4 h-4" />
                                                </div>
                                                <input 
                                                    type="text" 
                                                    placeholder="e.g. Stripe"
                                                    value={t.company}
                                                    onChange={(e) => updateTestimonial(index, "company", e.target.value)}
                                                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl pl-11 pr-4 py-4 text-sm font-medium text-slate-600 focus:outline-none focus:border-brand/30 transition-all"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1 block flex items-center gap-2">
                                            <Quote className="w-3 h-3" /> Testimonial Content
                                        </label>
                                        <textarea 
                                            rows={3}
                                            placeholder="What did the client say?"
                                            value={t.content}
                                            onChange={(e) => updateTestimonial(index, "content", e.target.value)}
                                            className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-sm text-[#1A1C1E] focus:outline-none focus:border-brand/30 transition-all resize-none font-medium italic"
                                        />
                                    </div>

                                    <div className="space-y-2 w-full md:w-1/3">
                                        <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Industry / Category</label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-4 flex items-center text-slate-300">
                                                <Tag className="w-4 h-4" />
                                            </div>
                                            <input 
                                                type="text" 
                                                placeholder="e.g. Fintech"
                                                value={t.category}
                                                onChange={(e) => updateTestimonial(index, "category", e.target.value)}
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
                        </div>
                    </Card>
                ))}

                {testimonials.length === 0 && (
                    <div className="text-center py-24 border-2 border-dashed border-slate-100 rounded-[3rem] bg-slate-50/30">
                        <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-sm">
                            <MessageSquare className="w-10 h-10 text-slate-200" />
                        </div>
                        <h4 className="text-slate-400 font-bold text-lg mb-2">No Proof Found</h4>
                        <p className="text-slate-400/60 max-w-xs mx-auto text-sm italic">Collect and publish client success stories here to build trust and authority.</p>
                    </div>
                )}
            </div>

            {/* Focus Grid Management */}
            <div className="pt-20 border-t border-slate-100">
                <div className="flex items-center justify-between mb-8">
                    <div className="space-y-1">
                        <h3 className="text-sm font-black uppercase tracking-[0.2em] text-[#1A1C1E]">Mosaic In-Focus Stack</h3>
                        <p className="text-xs text-slate-400">Manage logos, photos, and videos for the "Human Side" mosaic grid.</p>
                    </div>
                    <div className="flex gap-4">
                        <Button onClick={addFocusAsset} size="sm" className="bg-[#1A1C1E] hover:bg-black text-white rounded-xl px-4 h-10 font-bold">
                            <Plus className="w-4 h-4 mr-2" /> New Asset
                        </Button>
                        <Button onClick={saveFocusChanges} disabled={savingFocus} className="bg-brand text-white px-6 h-10 rounded-xl font-bold transition-all shadow-lg shadow-brand/10">
                            {savingFocus ? "Saving..." : "Save Focus Grid"}
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {focusAssets.map((asset, index) => (
                        <Card key={index} className="p-6 bg-slate-50/50 border-slate-100 rounded-3xl relative group">
                            <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="space-y-1">
                                        <label className="text-[9px] font-bold uppercase tracking-widest text-slate-400">Type</label>
                                        <select 
                                            value={asset.type} 
                                            onChange={(e) => updateFocusAsset(index, "type", e.target.value as any)}
                                            className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold focus:outline-none focus:border-brand"
                                        >
                                            <option value="logo">Logo / Text</option>
                                            <option value="video">Video Asset</option>
                                        </select>
                                    </div>
                                    <div className="space-y-1 text-right">
                                        <Button variant="ghost" size="sm" onClick={() => removeFocusAsset(index)} className="h-8 w-8 text-rose-300 hover:text-rose-500 hover:bg-rose-50 rounded-lg">
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[9px] font-bold uppercase tracking-widest text-slate-400">Source URL / Embed</label>
                                    <input 
                                        type="text" placeholder="URL"
                                        value={asset.url}
                                        onChange={(e) => updateFocusAsset(index, "url", e.target.value)}
                                        className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-[10px] focus:outline-none focus:border-brand font-mono"
                                    />
                                </div>
                                {asset.type === 'video' && (
                                    <div className="space-y-1">
                                        <label className="text-[9px] font-bold uppercase tracking-widest text-slate-400">Thumbnail URL</label>
                                        <input 
                                            type="text" placeholder="Image URL"
                                            value={asset.thumbnail_url || ""}
                                            onChange={(e) => updateFocusAsset(index, "thumbnail_url", e.target.value)}
                                            className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-[10px] focus:outline-none focus:border-brand font-mono"
                                        />
                                    </div>
                                )}
                                <div className="space-y-1">
                                    <label className="text-[9px] font-bold uppercase tracking-widest text-slate-400">Label / Alt Text</label>
                                    <input 
                                        type="text" placeholder="e.g. Google Logo"
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
