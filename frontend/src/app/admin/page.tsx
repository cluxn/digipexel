"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import {
  Users,
  MessageSquare,
  Eye,
  Trash2,
  Sparkles,
  Briefcase,
  Layers,
  Bell,
  Clock,
  TrendingUp,
  FileText
} from "lucide-react";
import Link from "next/link";
import AdminLayout from "@/components/admin/admin-layout";
import { cn } from "@/lib/utils";

const stats = [
  { label: "Review Queue", value: "0", color: "text-amber-500", icon: Clock },
  { label: "Total Projects", value: "12", color: "text-[#1A1C1E]", icon: Briefcase },
  { label: "Web Inquiries", value: "24", color: "text-rose-500", icon: MessageSquare },
  { label: "Active Nudges", value: "3", color: "text-blue-500", icon: Sparkles },
  { label: "Active Banners", value: "1", color: "text-violet-500", icon: Layers },
  { label: "Waitlist Leads", value: "82", color: "text-emerald-500", icon: Users },
  { label: "Blog Posts", value: "15", color: "text-slate-500", icon: FileText },
];

export default function AdminDashboard() {
  return (
    <AdminLayout>
      <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
        {/* Header */}
        <div className="flex justify-between items-end">
          <div className="space-y-1">
            <h1 className="text-4xl font-display font-bold text-[#1A1C1E] tracking-tight">
              Admin Command Center
            </h1>
            <p className="text-slate-400 text-sm">Monitor agency growth and manage digital configurations.</p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" className="rounded-xl border-slate-200 text-slate-600 h-11 px-6 font-bold flex gap-2">
              <Bell className="w-4 h-4" />
              Notifications
            </Button>
            <Button className="bg-[#1A1C1E] hover:bg-[#2A2C2E] text-white rounded-xl h-11 px-6 font-bold flex gap-2 shadow-lg shadow-black/10">
              <TrendingUp className="w-4 h-4" />
              View Analytics
            </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {stats.map((stat, i) => (
            <div key={i} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-black/5 transition-all duration-500 group">
              <div className="space-y-4">
                <div className="flex justify-between items-start">
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 leading-tight">
                    {stat.label}
                  </span>
                  <stat.icon className={cn("w-4 h-4 opacity-20 group-hover:opacity-100 transition-opacity", stat.color)} />
                </div>
                <div className="flex items-baseline gap-2">
                  <span className={cn("text-4xl font-bold tracking-tight", stat.color)}>
                    {stat.value}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Recent Activity / Featured Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Quick Actions / Leads */}
          <div className="bg-white rounded-[3.5rem] border border-slate-100 p-12 shadow-sm space-y-8">
            <div className="flex justify-between items-center">
              <div className="space-y-1">
                <h3 className="text-2xl font-bold text-[#1A1C1E]">Captured Leads</h3>
                <p className="text-slate-400 text-xs">Recently submitted inquiries from Digi Pexel site.</p>
              </div>
              <Link href="/admin/leads">
                <Button variant="outline" className="rounded-2xl border-slate-100 text-[#1A1C1E] font-bold h-12 px-6">
                  Export Leads
                </Button>
              </Link>
            </div>

            <div className="space-y-4">
              {[
                { name: "John Adams", email: "john@techflow.ai", date: "12/03/2026", status: "New" },
                { name: "Vinay", email: "vinay13feb@mail.com", date: "11/03/2026", status: "Replied" },
              ].map((lead, i) => (
                <div key={i} className="flex items-center justify-between p-6 rounded-3xl bg-slate-50/50 border border-transparent hover:border-slate-100 hover:bg-white transition-all group">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-white border border-slate-100 flex items-center justify-center font-bold text-slate-400">
                      {lead.name[0]}
                    </div>
                    <div>
                      <p className="font-bold text-[#1A1C1E]">{lead.name}</p>
                      <p className="text-xs text-slate-400 tracking-tight">{lead.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6 text-right">
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-slate-300 mb-1">Received</p>
                      <p className="text-xs font-bold text-slate-500">{lead.date}</p>
                    </div>
                    <div className={cn(
                      "px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider",
                      lead.status === "New" ? "bg-brand/10 text-brand" : "bg-slate-100 text-slate-400"
                    )}>
                      {lead.status}
                    </div>
                    <Button variant="ghost" size="icon" className="rounded-xl opacity-0 group-hover:opacity-100 transition-opacity">
                      <Eye className="w-4 h-4 text-slate-400" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Nudge Campaigns */}
          <div className="bg-white rounded-[3.5rem] border border-slate-100 p-12 shadow-sm space-y-8">
            <div className="flex justify-between items-center">
              <div className="space-y-1">
                <h3 className="text-2xl font-bold text-[#1A1C1E]">Nudge Campaigns</h3>
                <p className="text-slate-400 text-xs">Active high-conversion popups and triggers.</p>
              </div>
              <Button className="bg-[#1A1C1E] text-white rounded-2xl font-bold h-12 px-6">
                + New Nudge
              </Button>
            </div>

            <div className="grid grid-cols-2 gap-6">
              {[
                { title: "Exit Intent Offer", trigger: "Exit Intent", active: true },
                { title: "Blog Sidebar", trigger: "Scroll 50%", active: false },
              ].map((nudge, i) => (
                <div key={i} className="p-6 rounded-[2.5rem] bg-slate-50 border border-slate-100 relative overflow-hidden group">
                   <div className="absolute top-4 right-4 h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                   <div className="space-y-4">
                      <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm">
                        <Sparkles className="w-5 h-5 text-brand" />
                      </div>
                      <div>
                        <p className="font-bold text-[#1A1C1E] mb-1">{nudge.title}</p>
                        <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest">{nudge.trigger}</p>
                      </div>
                      <div className="flex gap-2 pt-2">
                        <Button variant="white" size="sm" className="rounded-xl h-8 px-4 text-[10px] font-bold shadow-sm">Settings</Button>
                        <Button variant="ghost" size="icon" className="rounded-xl h-8 w-8 text-rose-500 hover:bg-rose-50"><Trash2 className="w-3.5 h-3.5" /></Button>
                      </div>
                   </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
