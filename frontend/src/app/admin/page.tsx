"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { LayoutDashboard, Image, Settings, Users, MessageSquare, ExternalLink, ArrowRight } from "lucide-react";
import Link from "next/link";
import AdminLayout from "@/components/admin/admin-layout";
import { cn } from "@/lib/utils";

export default function AdminDashboard() {
  return (
    <AdminLayout>
      <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
        {/* Header */}
        <div className="space-y-2">
          <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-brand">Overview</p>
          <h1 className="text-5xl font-display font-bold text-[#1A1C1E] tracking-tight">
            Dashboard
          </h1>
          <p className="text-slate-400 text-sm max-w-lg">Welcome to Digi Pexel Control Station. Manage your agency's digital presence and performance from one central hub.</p>
        </div>

        {/* Big Action Card */}
        <div className="bg-white rounded-[3rem] border border-slate-100 p-12 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.03)] relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-12 opacity-[0.03] group-hover:scale-110 transition-transform duration-700">
            <LayoutDashboard size={200} />
          </div>
          
          <div className="relative z-10 space-y-8">
            <div className="space-y-2">
               <h3 className="text-3xl font-bold text-[#1A1C1E]">Quick Workflow</h3>
               <p className="text-slate-500 max-w-md leading-relaxed">System is running at 100% capacity. Your AI automation flows are currently processing leads across 3 active channels.</p>
            </div>
            
            <div className="flex gap-4">
              <Link href="/admin/logos">
                <Button className="bg-[#1A1C1E] hover:bg-[#2A2C2E] text-white rounded-2xl px-8 py-6 h-auto font-bold transition-all shadow-xl shadow-black/10">
                  Manage Logos <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
              <Button variant="outline" className="border-slate-200 text-slate-600 rounded-2xl px-8 py-6 h-auto font-bold">
                Check Integrations
              </Button>
            </div>
          </div>
        </div>

        {/* Mini Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { label: "Active Sections", value: "4/6", color: "text-emerald-500" },
            { label: "Client Inquiries", value: "12", color: "text-brand" },
            { label: "System Health", value: "Optimum", color: "text-amber-500" }
          ].map((stat, i) => (
            <div key={i} className="bg-white p-8 rounded-3xl border border-slate-100 flex justify-between items-center">
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">{stat.label}</span>
              <span className={cn("text-xl font-bold", stat.color)}>{stat.value}</span>
            </div>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
}
