"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trash2, Plus, Save, BookOpen, ExternalLink, Image as ImageIcon, Type, Layout, Tag, Fingerprint, AlignLeft, Sparkles } from "lucide-react";
import AdminLayout from "@/components/admin/admin-layout";
import { cn } from "@/lib/utils";

interface Guide {
  id?: number;
  title: string;
  slug: string;
  description: string;
  content: string;
  image_url: string;
  category: string;
  cta_label: string;
  cta_link: string;
  feature1?: string;
  feature2?: string;
  feature3?: string;
  feature4?: string;
  stat1_label?: string;
  stat1_value?: string;
  stat2_label?: string;
  stat2_value?: string;
  position: number;
}

export default function AdminGuidesPage() {
  const [guides, setGuides] = useState<Guide[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch("/api/guides.php");
      const data = await response.json();
      if (data.status === "success") {
        setGuides(data.data);
        setLoading(false);
        return;
      }
    } catch (error) {
      console.log("PHP Backend not detected, loading preview data...");
    }

    // Preview Fallback
    const previewData = localStorage.getItem("PREVIEW_GUIDES");
    if (previewData) {
      setGuides(JSON.parse(previewData));
    } else {
      setGuides([
        {
            title: "The 2024 AI Automation Roadmap",
            slug: "ai-automation-roadmap-2024",
            description: "How to audit your business for high-ROI automation opportunities and build a 12-month deployment plan.",
            content: "# High ROI Automation\n\nIdentifying opportunities is the first step...",
            image_url: "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=800",
            category: "Strategy",
            cta_label: "Download Guide",
            cta_link: "#",
            position: 0
          }
      ]);
    }
    setLoading(false);
  };

  const addGuide = () => {
    const newGuide: Guide = {
      title: "New Playbook",
      slug: "new-playbook-" + Date.now(),
      description: "Short description of the guide content...",
      content: "",
      image_url: "",
      category: "Automation",
      cta_label: "Download Guide",
      cta_link: "#",
      position: guides.length
    };
    setGuides([...guides, newGuide]);
  };

  const removeGuide = (index: number) => {
    if (confirm("Are you sure you want to delete this guide?")) {
        setGuides(guides.filter((_, i) => i !== index));
    }
  };

  const updateGuide = (index: number, field: keyof Guide, value: string) => {
    const newGuides = [...guides];
    (newGuides[index] as any)[field] = value;
    setGuides(newGuides);
  };

  const saveChanges = async () => {
    setSaving(true);
    localStorage.setItem("PREVIEW_GUIDES", JSON.stringify(guides));
    
    try {
      const response = await fetch("/api/guides.php", {
        method: "POST",
        body: JSON.stringify({ action: "update_guides", guides }),
      });
      const data = await response.json();
      if (data.status === "success") {
        alert("Guides updated successfully!");
      }
    } catch (error) {
      alert("Changes saved to PREVIEW. (Backend sync skipped in preview mode)");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-[60vh]">
          <div className="text-brand font-display text-xl animate-pulse">Accessing Playbooks...</div>
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
            <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-brand">Content Management</p>
            <h1 className="text-5xl font-display font-bold text-[#1A1C1E] tracking-tight">Insights & Guides</h1>
            <p className="text-slate-400 text-sm max-w-lg">Create and manage high-value resources. These will appear in the main /guides section and detailed pages.</p>
          </div>
          
          <div className="flex gap-4">
            <Button 
                asChild
                variant="outline"
                className="border-slate-200 text-slate-600 rounded-2xl px-6 h-14 font-bold"
            >
              <a href="/guides" target="_blank">
                <ExternalLink className="w-4 h-4 mr-2" />
                View Library
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
                <h3 className="text-sm font-black uppercase tracking-[0.2em] text-slate-400">Library Stack ({guides.length})</h3>
                <Button onClick={addGuide} size="sm" className="bg-[#1A1C1E] hover:bg-black text-white rounded-xl px-4 h-10 font-bold">
                    <Plus className="w-4 h-4 mr-2" /> New Guide
                </Button>
            </div>

            <div className="grid grid-cols-1 gap-6">
                {guides.map((guide, index) => (
                    <Card key={index} className="bg-white border-slate-100 rounded-[2.5rem] p-8 shadow-[0_10px_40px_-15px_rgba(0,0,0,0.02)] group hover:border-brand/20 transition-all duration-500">
                        <div className="flex flex-col gap-10">
                            <div className="flex flex-col lg:flex-row gap-10">
                                {/* Visual Preview Section */}
                                <div className="w-full lg:w-72 shrink-0">
                                    <div className="relative aspect-[4/3] rounded-3xl overflow-hidden bg-slate-50 border border-slate-100 group-hover:shadow-lg transition-all duration-500">
                                        {guide.image_url ? (
                                            <img src={guide.image_url} alt="" className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-200 gap-2">
                                                <ImageIcon className="w-8 h-8" />
                                                <span className="text-[10px] font-bold uppercase tracking-widest">No Cover</span>
                                            </div>
                                        )}
                                    </div>
                                    <div className="mt-4 space-y-2">
                                        <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Cover Image Source</label>
                                        <div className="relative group/url">
                                            <div className="absolute inset-y-0 left-4 flex items-center text-slate-300">
                                                <ImageIcon className="w-3.5 h-3.5" />
                                            </div>
                                            <input 
                                                type="text" 
                                                placeholder="https://..."
                                                value={guide.image_url}
                                                onChange={(e) => updateGuide(index, "image_url", e.target.value)}
                                                className="w-full bg-slate-50 border border-slate-100 rounded-xl pl-10 pr-4 py-2.5 text-[11px] focus:outline-none focus:border-brand/30 transition-all font-mono"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Info Section */}
                                <div className="flex-1 space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Title</label>
                                            <div className="relative">
                                                <div className="absolute inset-y-0 left-4 flex items-center text-slate-300">
                                                    <Type className="w-4 h-4" />
                                                </div>
                                                <input 
                                                    type="text" 
                                                    placeholder="Guide Title"
                                                    value={guide.title}
                                                    onChange={(e) => updateGuide(index, "title", e.target.value)}
                                                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl pl-11 pr-4 py-4 text-sm font-bold text-[#1A1C1E] focus:outline-none focus:border-brand/30 transition-all"
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Slug (URL Path)</label>
                                            <div className="relative">
                                                <div className="absolute inset-y-0 left-4 flex items-center text-slate-300">
                                                    <Fingerprint className="w-4 h-4" />
                                                </div>
                                                <input 
                                                    type="text" 
                                                    placeholder="e.g. ai-roadmap-2024"
                                                    value={guide.slug}
                                                    onChange={(e) => updateGuide(index, "slug", e.target.value)}
                                                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl pl-11 pr-4 py-4 text-sm font-mono text-brand focus:outline-none focus:border-brand/30 transition-all"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        <div className="space-y-2 md:col-span-2">
                                            <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Short Synopsis</label>
                                            <input 
                                                type="text" 
                                                placeholder="Enter a brief summary..."
                                                value={guide.description}
                                                onChange={(e) => updateGuide(index, "description", e.target.value)}
                                                className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-sm text-[#1A1C1E] focus:outline-none focus:border-brand/30 transition-all"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Category</label>
                                            <div className="relative">
                                                <div className="absolute inset-y-0 left-4 flex items-center text-slate-300">
                                                    <Tag className="w-4 h-4" />
                                                </div>
                                                <input 
                                                    type="text" 
                                                    placeholder="e.g. Strategy"
                                                    value={guide.category}
                                                    onChange={(e) => updateGuide(index, "category", e.target.value)}
                                                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl pl-11 pr-4 py-4 text-sm font-bold text-[#1A1C1E] focus:outline-none focus:border-brand/30 transition-all"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-6 border-b border-slate-50">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">CTA Text</label>
                                            <input 
                                                type="text" 
                                                placeholder="Download Guide"
                                                value={guide.cta_label}
                                                onChange={(e) => updateGuide(index, "cta_label", e.target.value)}
                                                className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-3 text-xs font-bold text-slate-600 focus:outline-none focus:border-brand/30 transition-all font-mono"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Action Link (PDF/Form/URL)</label>
                                            <input 
                                                type="text" 
                                                placeholder="/contact-us or https://..."
                                                value={guide.cta_link}
                                                onChange={(e) => updateGuide(index, "cta_link", e.target.value)}
                                                className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-3 text-xs font-bold text-slate-600 focus:outline-none focus:border-brand/30 transition-all font-mono"
                                            />
                                        </div>
                                    </div>

                                    {/* Detailed Sections Management */}
                                    <div className="space-y-6 pt-2">
                                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-brand ml-1 flex items-center gap-2">
                                            <Sparkles className="w-3 h-3" /> Detailed Template Sections
                                        </label>
                                        
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-3">
                                                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Key Features / Takeaways</label>
                                                <div className="space-y-2">
                                                    {[1, 2, 3, 4].map((fNum) => (
                                                        <input 
                                                            key={fNum}
                                                            type="text" 
                                                            placeholder={`Feature ${fNum}`}
                                                            value={(guide as any)[`feature${fNum}`] || ""}
                                                            onChange={(e) => updateGuide(index, `feature${fNum}` as any, e.target.value)}
                                                            className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-2 text-[11px] focus:outline-none focus:border-brand/30 transition-all"
                                                        />
                                                    ))}
                                                </div>
                                            </div>

                                            <div className="space-y-6">
                                                <div className="space-y-3">
                                                    <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Stat 1 (Label & Value)</label>
                                                    <div className="flex gap-2">
                                                        <input 
                                                            type="text" placeholder="Label"
                                                            value={guide.stat1_label || ""}
                                                            onChange={(e) => updateGuide(index, "stat1_label" as any, e.target.value)}
                                                            className="w-1/2 bg-slate-50 border border-slate-100 rounded-xl px-4 py-2 text-[11px] focus:outline-none focus:border-brand/30 transition-all"
                                                        />
                                                        <input 
                                                            type="text" placeholder="Value"
                                                            value={guide.stat1_value || ""}
                                                            onChange={(e) => updateGuide(index, "stat1_value" as any, e.target.value)}
                                                            className="w-1/2 bg-slate-50 border border-slate-100 rounded-xl px-4 py-2 text-[11px] font-bold text-brand focus:outline-none focus:border-brand/30 transition-all"
                                                        />
                                                    </div>
                                                </div>
                                                <div className="space-y-3">
                                                    <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Stat 2 (Label & Value)</label>
                                                    <div className="flex gap-2">
                                                        <input 
                                                            type="text" placeholder="Label"
                                                            value={guide.stat2_label || ""}
                                                            onChange={(e) => updateGuide(index, "stat2_label" as any, e.target.value)}
                                                            className="w-1/2 bg-slate-50 border border-slate-100 rounded-xl px-4 py-2 text-[11px] focus:outline-none focus:border-brand/30 transition-all"
                                                        />
                                                        <input 
                                                            type="text" placeholder="Value"
                                                            value={guide.stat2_value || ""}
                                                            onChange={(e) => updateGuide(index, "stat2_value" as any, e.target.value)}
                                                            className="w-1/2 bg-slate-50 border border-slate-100 rounded-xl px-4 py-2 text-[11px] font-bold text-brand focus:outline-none focus:border-brand/30 transition-all"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Delete Action */}
                                <div className="flex lg:flex-col justify-end">
                                    <Button 
                                        variant="ghost" 
                                        size="icon" 
                                        onClick={() => removeGuide(index)}
                                        className="h-14 w-14 text-rose-300 hover:text-rose-500 hover:bg-rose-50 rounded-2xl transition-all"
                                    >
                                        <Trash2 className="w-6 h-6" />
                                    </Button>
                                </div>
                            </div>
                            
                            {/* Rich Content Section */}
                            <div className="pt-8 border-t border-slate-50">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1 mb-2 block flex items-center gap-2">
                                    <AlignLeft className="w-3 h-3" /> Detailed Guide Content (Markdown/HTML Supported)
                                </label>
                                <textarea 
                                    rows={8}
                                    placeholder="Enter the full guide content here. This will appear on the detailed page..."
                                    value={guide.content}
                                    onChange={(e) => updateGuide(index, "content", e.target.value)}
                                    className="w-full bg-slate-50 border border-slate-100 rounded-3xl px-8 py-6 text-sm text-[#1A1C1E] focus:outline-none focus:border-brand/30 transition-all resize-none shadow-inner"
                                />
                            </div>
                        </div>
                    </Card>
                ))}

                {guides.length === 0 && (
                    <div className="text-center py-24 border-2 border-dashed border-slate-100 rounded-[3rem] bg-slate-50/30">
                        <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-sm">
                            <BookOpen className="w-10 h-10 text-slate-200" />
                        </div>
                        <h4 className="text-slate-400 font-bold text-lg mb-2">No Guides Published</h4>
                        <p className="text-slate-400/60 max-w-xs mx-auto text-sm italic">You haven't added any resources yet. Click 'New Guide' above to start building your library.</p>
                    </div>
                )}
            </div>
        </div>
      </div>
    </AdminLayout>
  );
}
