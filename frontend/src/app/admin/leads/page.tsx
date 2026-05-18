"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trash2, Mail, Search, CheckCircle2, Phone, Building2, AlertTriangle, RefreshCw } from "lucide-react";
import AdminLayout from "@/components/admin/admin-layout";
import { cn } from "@/lib/utils";
import { api } from "@/lib/api";
import { API_BASE_URL } from "@/lib/constants";

interface Lead {
  id: number;
  full_name: string;
  email: string;
  company: string;
  contact_number: string;
  service: string;
  message: string;
  status: 'new' | 'contacted' | 'archived';
  created_at: string;
}

export default function AdminLeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState(false);
  const [filter, setFilter] = useState<Lead['status'] | 'all'>('all');

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    setLoading(true);
    setApiError(false);
    const res = await api.get("leads");
    if (res?.status === "success" && Array.isArray(res.data)) {
      setLeads(res.data as Lead[]);
    } else {
      setApiError(true);
    }
    setLoading(false);
  };

  const updateStatus = async (id: number, status: Lead['status']) => {
    const res = await api.post("leads", { action: "update_status", id, status });
    if (res?.status === "success") {
      setLeads(leads.map(lead => lead.id === id ? { ...lead, status } : lead));
    }
  };

  const deleteLead = async (id: number) => {
    if (!confirm("Are you sure you want to delete this lead?")) return;
    const res = await api.post("leads", { action: "delete_lead", id });
    if (res?.status === "success") {
      setLeads(leads.filter(lead => lead.id !== id));
    }
  };

  const filteredLeads = leads.filter(lead => filter === 'all' ? true : lead.status === filter);

  if (loading) return (
    <AdminLayout>
      <div className="flex items-center justify-center h-[60vh]">
        <div className="text-brand font-display text-xl animate-pulse">Syncing CRM...</div>
      </div>
    </AdminLayout>
  );

  if (apiError) return (
    <AdminLayout>
      <div className="flex flex-col items-center justify-center h-[60vh] gap-5 text-center">
        <div className="w-14 h-14 rounded-2xl bg-rose-50 flex items-center justify-center">
          <AlertTriangle className="w-7 h-7 text-rose-400" />
        </div>
        <div>
          <p className="font-bold text-[#1A1C1E] text-lg mb-1">Could not load leads</p>
          <p className="text-slate-400 text-sm max-w-xs">
            The API did not respond. Check that your backend is reachable at:<br />
            <code className="text-xs bg-slate-100 px-2 py-0.5 rounded mt-1 inline-block break-all">{API_BASE_URL}</code>
          </p>
        </div>
        <Button variant="outline" className="rounded-xl border-slate-200 gap-2" onClick={fetchLeads}>
          <RefreshCw className="w-4 h-4" /> Retry
        </Button>
      </div>
    </AdminLayout>
  );

  return (
    <AdminLayout>
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-slate-100 pb-8">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
               <span className="w-2 h-2 rounded-full bg-brand animate-ping" />
               <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-brand">Live Lead Capture</p>
            </div>
            <h1 className="text-4xl font-display font-bold text-[#1A1C1E] tracking-tight">Contact Inbox</h1>
            <p className="text-slate-400 text-sm max-w-lg">Manage inquiries from your automation discovery forms.</p>
          </div>
          
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" className="rounded-xl border-slate-200 gap-2 text-xs" onClick={fetchLeads}>
              <RefreshCw className="w-3.5 h-3.5" /> Refresh
            </Button>
            <div className="flex bg-slate-100 p-1.5 rounded-2xl">
            {(['all', 'new', 'contacted', 'archived'] as const).map((s) => (
              <button
                key={s}
                onClick={() => setFilter(s)}
                className={cn(
                  "px-6 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all",
                  filter === s
                    ? "bg-white text-brand shadow-sm"
                    : "text-slate-400 hover:text-slate-600 font-bold"
                )}
              >
                {s}
              </button>
            ))}
          </div>
          </div>
        </div>

        {/* Table Area */}
        <div className="bg-white border border-slate-100 rounded-[2.5rem] shadow-sm overflow-hidden overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[1000px]">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">Lead Source</th>
                <th className="px-6 py-5 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">Company & Role</th>
                <th className="px-6 py-5 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">Contact Details</th>
                <th className="px-6 py-5 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">Status</th>
                <th className="px-6 py-5 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredLeads.map((lead) => (
                <tr key={lead.id} className="group hover:bg-slate-50/50 transition-colors">
                  {/* Lead Source */}
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                       <div className="w-10 h-10 rounded-full bg-brand/5 flex items-center justify-center text-brand font-bold text-xs">
                          {lead.full_name.charAt(0)}
                       </div>
                       <div>
                          <p className="text-sm font-bold text-primary">{lead.full_name}</p>
                          <p className="text-[10px] font-medium text-slate-400 uppercase tracking-tighter mt-0.5">
                            {new Date(lead.created_at).toLocaleDateString()}
                          </p>
                       </div>
                    </div>
                  </td>

                  {/* Company & Role */}
                  <td className="px-6 py-6 font-display">
                     <div className="flex flex-col">
                        <div className="flex items-center gap-2 text-primary font-bold text-sm">
                           <Building2 className="w-3 h-3 text-slate-300" />
                           {lead.company || "N/A"}
                        </div>
                        <p className="text-[11px] text-slate-400 font-medium mt-1">{lead.service || "General Inquiry"}</p>
                     </div>
                  </td>

                  {/* Contact Info */}
                  <td className="px-6 py-6">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2 text-[11px] font-bold text-slate-500">
                         <Mail className="w-3 h-3 text-slate-300" />
                         {lead.email}
                      </div>
                      <div className="flex items-center gap-2 text-[11px] font-bold text-slate-400">
                         <Phone className="w-3 h-3 text-slate-300" />
                         {lead.contact_number || "No number"}
                      </div>
                    </div>
                  </td>

                  {/* Status */}
                  <td className="px-6 py-6">
                    <Badge variant="outline" className={cn(
                      "rounded-full px-3 py-1 text-[9px] font-bold tracking-widest uppercase border-0",
                      lead.status === 'new' ? "bg-emerald-400/10 text-emerald-500" :
                      lead.status === 'contacted' ? "bg-brand/10 text-brand" :
                      "bg-slate-100 text-slate-400"
                    )}>
                      {lead.status}
                    </Badge>
                  </td>

                  {/* Actions */}
                  <td className="px-6 py-6 text-right">
                    <div className="flex items-center justify-end gap-2">
                       <Button 
                         variant="ghost" 
                         size="icon" 
                         className="h-10 w-10 rounded-xl text-slate-300 hover:text-brand hover:bg-white hover:shadow-sm border border-transparent hover:border-slate-100 transition-all"
                         onClick={() => updateStatus(lead.id, 'contacted')}
                         title="Mark Contacted"
                       >
                         <CheckCircle2 className="w-4 h-4" />
                       </Button>
                       <Button 
                         variant="ghost" 
                         size="icon" 
                         className="h-10 w-10 rounded-xl text-slate-300 hover:text-rose-500 hover:bg-white hover:shadow-sm border border-transparent hover:border-slate-100 transition-all"
                         onClick={() => deleteLead(lead.id)}
                         title="Delete Lead"
                       >
                         <Trash2 className="w-4 h-4" />
                       </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredLeads.length === 0 && (
            <div className="text-center py-20">
               <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-100">
                 <Search className="text-slate-200 w-6 h-6" />
               </div>
               <p className="text-slate-400 font-bold tracking-widest text-[10px] uppercase">No matching leads in inbox.</p>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
