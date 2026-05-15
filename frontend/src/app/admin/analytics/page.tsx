"use client";

import React, { useState, useEffect } from "react";
import AdminLayout from "@/components/admin/admin-layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";

export default function AdminAnalyticsPage() {
  const [codes, setCodes] = useState({
    google_analytics: '',
    search_console: '',
    custom_head_scripts: '',
  });
  const [loading, setLoading] = useState(true);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');

  useEffect(() => {
    api.get("analytics").then(res => {
      if (res?.status === "success" && res.data) {
        setCodes(prev => ({ ...prev, ...res.data }));
      }
    }).finally(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    setSaveStatus('saving');
    const res = await api.post("analytics", { action: "save_codes", codes });
    setSaveStatus(res?.status === "success" ? 'saved' : 'error');
    setTimeout(() => setSaveStatus('idle'), 3000);
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-[60vh]">
          <div className="text-brand font-display text-xl animate-pulse">Loading analytics config...</div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-10">
        <div className="space-y-2">
          <Badge className="rounded-full bg-brand/10 text-brand border border-brand/20 px-3 py-1 text-[10px] uppercase tracking-[0.2em]">
            Analytics
          </Badge>
          <h1 className="text-4xl font-display font-bold text-[#1A1C1E]">Analytics & Tracking</h1>
          <p className="text-slate-400 text-sm">Paste embed codes for analytics and tracking. Changes are saved to the database.</p>
        </div>

        <div className="space-y-8">
          {/* Card 1 — Google Analytics */}
          <div className="bg-white rounded-[2rem] border border-slate-100 p-8 shadow-sm space-y-4">
            <div className="space-y-1">
              <h2 className="text-xl font-bold text-[#1A1C1E]">Google Analytics (GA4)</h2>
              <p className="text-slate-400 text-sm">Paste your full <code className="bg-slate-100 px-1 rounded text-xs">&lt;script async src=...&gt;&lt;/script&gt;</code> tag here.</p>
            </div>
            <textarea
              className="w-full font-mono text-xs border border-slate-200 rounded-xl px-4 py-3 h-32 resize-none text-slate-700 focus:outline-none focus:border-brand/30"
              value={codes.google_analytics}
              onChange={e => setCodes(p => ({ ...p, google_analytics: e.target.value }))}
              placeholder="<!-- Google tag (gtag.js) -->"
            />
          </div>

          {/* Card 2 — Search Console */}
          <div className="bg-white rounded-[2rem] border border-slate-100 p-8 shadow-sm space-y-4">
            <div className="space-y-1">
              <h2 className="text-xl font-bold text-[#1A1C1E]">Google Search Console Verification</h2>
              <p className="text-slate-400 text-sm">Paste the <code className="bg-slate-100 px-1 rounded text-xs">&lt;meta name=&apos;google-site-verification&apos; ...&gt;</code> tag here.</p>
            </div>
            <textarea
              className="w-full font-mono text-xs border border-slate-200 rounded-xl px-4 py-3 h-32 resize-none text-slate-700 focus:outline-none focus:border-brand/30"
              value={codes.search_console}
              onChange={e => setCodes(p => ({ ...p, search_console: e.target.value }))}
              placeholder="<meta name='google-site-verification' content='...' />"
            />
          </div>

          {/* Card 3 — Custom Head Scripts */}
          <div className="bg-white rounded-[2rem] border border-slate-100 p-8 shadow-sm space-y-4">
            <div className="space-y-1">
              <h2 className="text-xl font-bold text-[#1A1C1E]">Custom Head Scripts</h2>
              <p className="text-slate-400 text-sm">Any additional <code className="bg-slate-100 px-1 rounded text-xs">&lt;script&gt;</code> or <code className="bg-slate-100 px-1 rounded text-xs">&lt;link&gt;</code> tags to inject into <code className="bg-slate-100 px-1 rounded text-xs">&lt;head&gt;</code> on every page.</p>
            </div>
            <textarea
              className="w-full font-mono text-xs border border-slate-200 rounded-xl px-4 py-3 h-32 resize-none text-slate-700 focus:outline-none focus:border-brand/30"
              value={codes.custom_head_scripts}
              onChange={e => setCodes(p => ({ ...p, custom_head_scripts: e.target.value }))}
              placeholder="<!-- Custom scripts here -->"
            />
          </div>

          {/* Save Card */}
          <div className="bg-white rounded-[2rem] border border-slate-100 p-8 shadow-sm space-y-4">
            <h2 className="text-xl font-bold text-[#1A1C1E]">Save Changes</h2>
            <p className="text-slate-400 text-sm">Scripts are injected client-side via the root layout AnalyticsInjector component. Changes require a page refresh to take effect.</p>
            <Button
              onClick={handleSave}
              disabled={saveStatus === 'saving'}
              className="bg-[#1A1C1E] hover:bg-[#2A2C2E] text-white rounded-xl h-11 px-8 font-bold"
            >
              {saveStatus === 'saving' ? 'Saving...' : saveStatus === 'saved' ? 'Saved!' : saveStatus === 'error' ? 'Error — Retry' : 'Save Changes'}
            </Button>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
