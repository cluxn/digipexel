"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import AdminLayout from "@/components/admin/admin-layout";
import { api } from "@/lib/api";

interface SiteSettings {
  facebook_url: string;
  instagram_url: string;
  youtube_url: string;
  linkedin_url: string;
  phone_number: string;
  contact_email: string;
  site_name: string;
  tagline: string;
  whatsapp_number: string;
  whatsapp_enabled: string; // "true" or "false" — stored as string in settings table
  default_cta_link: string;
}

const DEFAULT_SETTINGS: SiteSettings = {
  facebook_url: "",
  instagram_url: "",
  youtube_url: "",
  linkedin_url: "",
  phone_number: "",
  contact_email: "",
  site_name: "Digi Pexel",
  tagline: "Building the future of AI automation.",
  whatsapp_number: "",
  whatsapp_enabled: "true",
  default_cta_link: "/contact-us",
};

type SaveStatus = "idle" | "saving" | "saved" | "error";

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<SiteSettings>(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("idle");

  useEffect(() => {
    api
      .get("settings")
      .then((res) => {
        if (res?.status === "success" && res.data) {
          setSettings((prev) => ({ ...prev, ...res.data }));
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (
    key: keyof SiteSettings,
    value: string
  ) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    setSaveStatus("saving");
    const res = await api.post("settings", {
      action: "save_all_settings",
      settings,
    });
    setSaveStatus(res?.status === "success" ? "saved" : "error");
    setTimeout(() => setSaveStatus("idle"), 3000);
  };

  const inputClass =
    "w-full border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-700 focus:outline-none focus:border-brand/30 bg-white disabled:bg-slate-50 disabled:text-slate-400";
  const labelClass = "block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2";

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-[60vh]">
          <div className="text-brand font-display text-xl animate-pulse">
            Loading settings...
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
        {/* Page Header */}
        <div className="border-b border-slate-100 pb-8 space-y-2">
          <Badge className="bg-brand/10 text-brand border-0 rounded-full px-3 py-1 text-[10px] font-bold tracking-widest uppercase">
            Settings
          </Badge>
          <h1 className="text-4xl font-display font-bold text-[#1A1C1E] tracking-tight">
            Site Settings
          </h1>
          <p className="text-slate-400 text-sm">
            Configure social links, contact info, WhatsApp, and global site defaults.
          </p>
        </div>

        {/* Settings Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Card 1 — Social Links */}
          <div className="bg-white rounded-[2rem] border border-slate-100 p-8 shadow-sm space-y-6">
            <h2 className="text-lg font-display font-bold text-[#1A1C1E]">
              Social Links
            </h2>
            <div className="space-y-4">
              <div>
                <label className={labelClass}>Facebook URL</label>
                <input
                  type="url"
                  className={inputClass}
                  placeholder="https://facebook.com/digipexel"
                  value={settings.facebook_url}
                  onChange={(e) => handleChange("facebook_url", e.target.value)}
                />
              </div>
              <div>
                <label className={labelClass}>Instagram URL</label>
                <input
                  type="url"
                  className={inputClass}
                  placeholder="https://instagram.com/digipexel"
                  value={settings.instagram_url}
                  onChange={(e) =>
                    handleChange("instagram_url", e.target.value)
                  }
                />
              </div>
              <div>
                <label className={labelClass}>YouTube URL</label>
                <input
                  type="url"
                  className={inputClass}
                  placeholder="https://youtube.com/@digipexel"
                  value={settings.youtube_url}
                  onChange={(e) => handleChange("youtube_url", e.target.value)}
                />
              </div>
              <div>
                <label className={labelClass}>LinkedIn URL</label>
                <input
                  type="url"
                  className={inputClass}
                  placeholder="https://linkedin.com/company/digipexel"
                  value={settings.linkedin_url}
                  onChange={(e) => handleChange("linkedin_url", e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Card 2 — Contact Info */}
          <div className="bg-white rounded-[2rem] border border-slate-100 p-8 shadow-sm space-y-6">
            <h2 className="text-lg font-display font-bold text-[#1A1C1E]">
              Contact Info
            </h2>
            <div className="space-y-4">
              <div>
                <label className={labelClass}>Phone Number</label>
                <input
                  type="tel"
                  className={inputClass}
                  placeholder="+1 (555) 000-0000"
                  value={settings.phone_number}
                  onChange={(e) =>
                    handleChange("phone_number", e.target.value)
                  }
                />
              </div>
              <div>
                <label className={labelClass}>Contact Email</label>
                <input
                  type="email"
                  className={inputClass}
                  placeholder="hello@digipexel.com"
                  value={settings.contact_email}
                  onChange={(e) =>
                    handleChange("contact_email", e.target.value)
                  }
                />
              </div>
            </div>
          </div>

          {/* Card 3 — Site Identity */}
          <div className="bg-white rounded-[2rem] border border-slate-100 p-8 shadow-sm space-y-6">
            <h2 className="text-lg font-display font-bold text-[#1A1C1E]">
              Site Identity
            </h2>
            <div className="space-y-4">
              <div>
                <label className={labelClass}>Site Name</label>
                <input
                  type="text"
                  className={inputClass}
                  placeholder="Digi Pexel"
                  value={settings.site_name}
                  onChange={(e) => handleChange("site_name", e.target.value)}
                />
              </div>
              <div>
                <label className={labelClass}>Tagline</label>
                <textarea
                  rows={2}
                  className={inputClass}
                  placeholder="Building the future of AI automation."
                  value={settings.tagline}
                  onChange={(e) => handleChange("tagline", e.target.value)}
                />
              </div>
              <div>
                <label className={labelClass}>Default CTA Link</label>
                <input
                  type="text"
                  className={inputClass}
                  placeholder="/contact-us"
                  value={settings.default_cta_link}
                  onChange={(e) =>
                    handleChange("default_cta_link", e.target.value)
                  }
                />
              </div>
            </div>
          </div>

          {/* Card 4 — WhatsApp Button */}
          <div className="bg-white rounded-[2rem] border border-slate-100 p-8 shadow-sm space-y-6">
            <h2 className="text-lg font-display font-bold text-[#1A1C1E]">
              WhatsApp Button
            </h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold text-[#1A1C1E]">
                    Enable WhatsApp Button
                  </p>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Shows a floating chat button on all public pages
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={settings.whatsapp_enabled === "true"}
                    onChange={(e) =>
                      handleChange(
                        "whatsapp_enabled",
                        e.target.checked ? "true" : "false"
                      )
                    }
                  />
                  <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand" />
                </label>
              </div>

              <div>
                <label className={labelClass}>WhatsApp Number</label>
                <input
                  type="text"
                  className={inputClass}
                  placeholder="911234567890"
                  value={settings.whatsapp_number}
                  disabled={settings.whatsapp_enabled !== "true"}
                  onChange={(e) =>
                    handleChange("whatsapp_number", e.target.value)
                  }
                />
                <p className="text-xs text-slate-400 mt-2">
                  Number format: international without +, e.g. 911234567890
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Save Section */}
        <div className="bg-white rounded-[2rem] border border-slate-100 p-8 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <p className="font-bold text-[#1A1C1E]">Save All Settings</p>
            <p className="text-slate-400 text-sm">
              Changes take effect after the next site build and deploy.
            </p>
          </div>
          <Button
            onClick={handleSave}
            disabled={saveStatus === "saving"}
            className="bg-[#1A1C1E] hover:bg-[#2A2C2E] text-white rounded-xl h-11 px-6 font-bold shrink-0"
          >
            {saveStatus === "saving"
              ? "Saving..."
              : saveStatus === "saved"
              ? "Saved!"
              : saveStatus === "error"
              ? "Error — retry"
              : "Save Settings"}
          </Button>
        </div>
      </div>
    </AdminLayout>
  );
}
