"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowUp, ArrowDown, Trash2, Plus, Save, Power, Image as ImageIcon } from "lucide-react";
import AdminLayout from "@/components/admin/admin-layout";
import { cn, safeFetch } from "@/lib/utils";

interface Logo {
  id?: number;
  name: string;
  src: string;
  display_type: 'image' | 'text' | 'both';
  position: number;
}

export default function AdminLogosPage() {
  const [logos, setLogos] = useState<Logo[]>([]);
  const [isEnabled, setIsEnabled] = useState(true);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const data = await safeFetch("/api/logos.php");
      if (data && data.status === "success") {
        setLogos(data.data);
        setIsEnabled(data.enabled);
        setLoading(false);
        return;
      }
    } catch (error) {
      console.log("PHP Backend not detected, loading preview data...");
    }

    // Preview Fallback
    const previewData = localStorage.getItem("PREVIEW_LOGOS");
    const previewVisible = localStorage.getItem("PREVIEW_LOGOS_ENABLED") !== "false";
    
    if (previewData) {
      setLogos(JSON.parse(previewData));
      setIsEnabled(previewVisible);
    } else {
      setLogos([
        { name: "Dish", src: "https://upload.wikimedia.org/wikipedia/commons/4/4b/Dish_Network_logo.svg", display_type: 'image', position: 0 },
        { name: "Deloitte", src: "https://upload.wikimedia.org/wikipedia/commons/2/2b/Deloitte.svg", display_type: 'image', position: 1 },
      ]);
    }
    setLoading(false);
  };

  const handleToggleSection = async () => {
    try {
      const nuevoEstado = !isEnabled;
      setIsEnabled(nuevoEstado);
      localStorage.setItem("PREVIEW_LOGOS_ENABLED", String(nuevoEstado));
      
      await fetch("/api/logos.php", {
        method: "POST",
        body: JSON.stringify({ action: "toggle_section", enabled: nuevoEstado }),
      });
    } catch (error) {
      console.log("PHP update skipped in preview mode");
    }
  };

  const addLogo = () => {
    setLogos([...logos, { name: "New Brand", src: "", display_type: 'image', position: logos.length }]);
  };

  const removeLogo = (index: number) => {
    setLogos(logos.filter((_, i) => i !== index));
  };

  const moveLogo = (index: number, direction: "up" | "down") => {
    const newLogos = [...logos];
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex >= 0 && targetIndex < newLogos.length) {
      const temp = newLogos[index];
      newLogos[index] = newLogos[targetIndex];
      newLogos[targetIndex] = temp;
      setLogos(newLogos);
    }
  };

  const updateLogo = (index: number, field: keyof Logo, value: string) => {
    const newLogos = [...logos];
    (newLogos[index] as any)[field] = value;
    setLogos(newLogos);
  };

  const saveChanges = async () => {
    setSaving(true);
    localStorage.setItem("PREVIEW_LOGOS", JSON.stringify(logos));
    
    try {
      const data = await safeFetch("/api/logos.php", {
        method: "POST",
        body: JSON.stringify({ action: "update_logos", logos }),
      });
      if (data && data.status === "success") {
        alert("Logos updated successfully!");
      }
    } catch (error) {
      alert("Changes saved to PREVIEW. (PHP Backend not detected, will sync on hostinger)");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-[60vh]">
          <div className="text-brand font-display text-xl animate-pulse">Synchronizing Data...</div>
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
            <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-brand">Portfolio Management</p>
            <h1 className="text-5xl font-display font-bold text-[#1A1C1E] tracking-tight">Logo Marquee</h1>
            <p className="text-slate-400 text-sm max-w-lg">Curate the list of partners and clients that appear in your landing page's main scrolling marquee.</p>
          </div>
          
          <div className="flex gap-4">
            <Button 
               onClick={handleToggleSection}
               variant="outline"
               className={isEnabled 
                ? "border-emerald-100 bg-emerald-50/50 text-emerald-600 rounded-2xl px-6 h-14 font-bold" 
                : "border-slate-200 text-slate-400 rounded-2xl px-6 h-14 font-bold"
               }
            >
               <Power className="w-4 h-4 mr-2" />
               {isEnabled ? "Live on Site" : "Hidden from Site"}
            </Button>
            <Button 
              onClick={saveChanges} 
              disabled={saving}
              className="bg-brand hover:bg-brand/90 text-white px-8 h-14 rounded-2xl font-bold shadow-xl shadow-brand/20 transition-all active:scale-95"
            >
              {saving ? "Saving..." : <><Save className="w-4 h-4 mr-2" /> Update Section</>}
            </Button>
          </div>
        </div>

        {/* Content Card */}
        <Card className="bg-white border-slate-100 rounded-[2.5rem] p-10 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.03)] overflow-visible">
          <div className="flex justify-between items-center mb-12 border-b border-slate-50 pb-8">
            <div className="space-y-1">
              <h3 className="text-2xl font-bold text-[#1A1C1E]">Logo Sequence</h3>
              <p className="text-xs text-slate-400">Drag items to reorder or use the arrow controls.</p>
            </div>
            <Button onClick={addLogo} size="sm" className="bg-[#1A1C1E] hover:bg-black text-white rounded-xl px-4 h-10 font-bold">
              <Plus className="w-4 h-4 mr-2" /> Add Client
            </Button>
          </div>

          <div className="space-y-4">
            {logos.map((logo, index) => (
              <div 
                key={index} 
                className="group flex flex-col md:flex-row items-center gap-6 p-6 rounded-3xl bg-slate-50/50 border border-transparent hover:border-slate-100 hover:bg-white hover:shadow-xl hover:shadow-black/[0.02] transition-all duration-300"
              >
                {/* Preview */}
                <div className="w-24 h-14 flex items-center justify-center bg-white border border-slate-100 p-3 rounded-2xl shadow-sm">
                  {logo.src ? (
                    <img src={logo.src} alt={logo.name} className="max-h-full max-w-full object-contain" />
                  ) : (
                    <div className="text-[10px] uppercase font-bold tracking-widest text-slate-300 italic">Nil</div>
                  )}
                </div>

                {/* Inputs */}
                <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-bold uppercase tracking-widest text-slate-400 ml-1">Brand Name</label>
                    <input 
                      type="text" 
                      placeholder="Brand Name"
                      value={logo.name}
                      onChange={(e) => updateLogo(index, "name", e.target.value)}
                      className="w-full bg-white border border-slate-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand/30 focus:ring-4 focus:ring-brand/5 transition-all text-[#1A1C1E] font-medium"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-bold uppercase tracking-widest text-slate-400 ml-1">SVG URL / Path</label>
                    <input 
                      type="text" 
                      placeholder="Logo SVG URL"
                      value={logo.src}
                      onChange={(e) => updateLogo(index, "src", e.target.value)}
                      disabled={logo.display_type === 'text'}
                      className={cn(
                        "w-full border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand/30 focus:ring-4 focus:ring-brand/5 transition-all text-slate-500 font-medium h-[46px]",
                        logo.display_type === 'text' ? "bg-slate-50 text-slate-300 border-slate-100 cursor-not-allowed" : "bg-white text-slate-500 border-slate-100"
                      )}
                    />
                  </div>
                  <div className="space-y-1.5 flex flex-col justify-end">
                    <label className="text-[9px] font-bold uppercase tracking-widest text-slate-400 ml-1">Display Mode</label>
                    <div className="flex bg-slate-100 p-1 rounded-xl h-[46px]">
                      {(['image', 'text', 'both'] as const).map((mode) => (
                        <button
                          key={mode}
                          onClick={() => updateLogo(index, "display_type", mode)}
                          className={cn(
                            "flex-1 text-[10px] font-bold uppercase tracking-tighter rounded-lg transition-all",
                            logo.display_type === mode 
                              ? "bg-white text-brand shadow-sm" 
                              : "text-slate-400 hover:text-slate-600"
                          )}
                        >
                          {mode}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1.5 pt-4 md:pt-0">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => moveLogo(index, "up")}
                    disabled={index === 0}
                    className="h-10 w-10 text-slate-400 hover:text-brand hover:bg-brand/5 rounded-xl transition-all"
                  >
                    <ArrowUp className="w-4 h-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => moveLogo(index, "down")}
                    disabled={index === logos.length - 1}
                    className="h-10 w-10 text-slate-400 hover:text-brand hover:bg-brand/5 rounded-xl transition-all"
                  >
                    <ArrowDown className="w-4 h-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => removeLogo(index)}
                    className="h-10 w-10 text-rose-300 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}

            {logos.length === 0 && (
              <div className="text-center py-24 border-2 border-dashed border-slate-100 rounded-[2.5rem] bg-slate-50/30">
                <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm">
                   <ImageIcon className="text-slate-200" />
                </div>
                <p className="text-slate-400 font-medium italic">Your client portfolio is currently empty.</p>
              </div>
            )}
          </div>
        </Card>
      </div>
    </AdminLayout>
  );
}
