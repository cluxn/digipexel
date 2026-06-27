"use client";

import React, { useState, useEffect, useCallback } from "react";
import AdminLayout from "@/components/admin/admin-layout";
import { cn } from "@/lib/utils";
import { api } from "@/lib/api";
import { API_BASE_URL } from "@/lib/constants";
import {
  Trash2, Mail, Search, Phone, Building2, AlertTriangle,
  RefreshCw, Download, Plus, X, Calendar, FileSpreadsheet, FileText, Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";

// ── Types ─────────────────────────────────────────────────────────────────────

interface Lead {
  id: number;
  full_name: string;
  email: string;
  company: string;
  role: string;
  contact_number: string;
  service: string;
  source: string;
  message: string;
  notes: string;
  status: string;
  follow_up_date: string | null;
  created_at: string;
}

interface Subscriber {
  id: number;
  email: string;
  source: string;
  subscribed_at: string;
  status: "active" | "unsubscribed";
}

type MainTab    = "leads" | "newsletter";
type LeadStatus = "all" | "new" | "contacted" | "meeting_scheduled" | "converted" | "closed" | "lost" | "junk" | "follow_up";
type SubFilter  = "all" | "active" | "unsubscribed";

// ── Constants ──────────────────────────────────────────────────────────────────

const LEAD_STATUSES: { key: LeadStatus; label: string }[] = [
  { key: "all",               label: "All" },
  { key: "new",               label: "NEW" },
  { key: "contacted",         label: "CONTACTED" },
  { key: "meeting_scheduled", label: "MEETING SCHEDULED" },
  { key: "converted",        label: "CONVERTED" },
  { key: "closed",           label: "CLOSED" },
  { key: "lost",             label: "LOST" },
  { key: "junk",             label: "JUNK" },
  { key: "follow_up",        label: "Follow-Up" },
];

const STATUS_STYLE: Record<string, string> = {
  new:               "bg-emerald-50 text-emerald-600 border border-emerald-200",
  contacted:         "bg-blue-50 text-blue-600 border border-blue-200",
  meeting_scheduled: "bg-purple-50 text-purple-600 border border-purple-200",
  converted:         "bg-green-50 text-green-700 border border-green-300",
  closed:            "bg-slate-100 text-slate-500 border border-slate-200",
  lost:              "bg-rose-50 text-rose-600 border border-rose-200",
  junk:              "bg-orange-50 text-orange-500 border border-orange-200",
  follow_up:         "bg-amber-50 text-amber-600 border border-amber-200",
  archived:          "bg-slate-100 text-slate-400 border border-slate-200",
};

// ── Helpers ────────────────────────────────────────────────────────────────────

function age(dateStr: string): string {
  const d = Math.floor((Date.now() - new Date(dateStr).getTime()) / 86_400_000);
  if (d === 0) return "today";
  if (d < 30)  return `${d}d`;
  if (d < 365) return `${Math.floor(d / 30)}mo`;
  return `${Math.floor(d / 365)}y`;
}

const BLANK_LEAD = {
  full_name: "", email: "", company: "", role: "",
  contact_number: "", source: "manual_entry", service: "", message: "", notes: "",
};

// ── Component ──────────────────────────────────────────────────────────────────

export default function AdminLeadsPage() {
  const [mainTab, setMainTab] = useState<MainTab>("leads");

  // Leads
  const [leads, setLeads]               = useState<Lead[]>([]);
  const [loading, setLoading]           = useState(true);
  const [apiError, setApiError]         = useState(false);
  const [statusFilter, setStatusFilter] = useState<LeadStatus>("all");
  const [search, setSearch]             = useState("");
  const [sourceFilter, setSourceFilter] = useState("all");
  const [dateFrom, setDateFrom]         = useState("");
  const [dateTo, setDateTo]             = useState("");
  const [expandedId, setExpandedId]     = useState<number | null>(null);
  const [addOpen, setAddOpen]           = useState(false);
  const [newLead, setNewLead]           = useState(BLANK_LEAD);
  const [saving, setSaving]             = useState(false);
  const [editingNotes, setEditingNotes] = useState<Record<number, string>>({});
  const [editingFollowUp, setEditingFollowUp] = useState<Record<number, string>>({});
  const [savingField, setSavingField]   = useState<number | null>(null);

  // Newsletter
  const [subscribers, setSubscribers]   = useState<Subscriber[]>([]);
  const [subLoading, setSubLoading]     = useState(false);
  const [subFilter, setSubFilter]       = useState<SubFilter>("all");
  const [subSearch, setSubSearch]       = useState("");

  // ── Data fetching ────────────────────────────────────────────────────────────

  const fetchLeads = useCallback(async () => {
    setLoading(true);
    setApiError(false);
    const res = await api.get("leads");
    if (res?.status === "success" && Array.isArray(res.data)) {
      setLeads(res.data as Lead[]);
    } else {
      setApiError(true);
    }
    setLoading(false);
  }, []);

  const fetchSubscribers = useCallback(async () => {
    setSubLoading(true);
    const res = await api.get("newsletter");
    if (res?.status === "success" && Array.isArray(res.data)) {
      setSubscribers(res.data as Subscriber[]);
    }
    setSubLoading(false);
  }, []);

  useEffect(() => { fetchLeads(); }, [fetchLeads]);
  useEffect(() => {
    if (mainTab === "newsletter") fetchSubscribers();
  }, [mainTab, fetchSubscribers]);

  // ── Lead actions ─────────────────────────────────────────────────────────────

  const updateStatus = async (id: number, status: string) => {
    const res = await api.post("leads", { action: "update_status", id, status });
    if (res?.status === "success") {
      setLeads(prev => prev.map(l => l.id === id ? { ...l, status } : l));
    }
  };

  const deleteLead = async (id: number) => {
    if (!confirm("Delete this lead permanently?")) return;
    const res = await api.post("leads", { action: "delete_lead", id });
    if (res?.status === "success") {
      setLeads(prev => prev.filter(l => l.id !== id));
      if (expandedId === id) setExpandedId(null);
    }
  };

  const saveNotes = async (id: number) => {
    setSavingField(id);
    const notes = editingNotes[id] ?? leads.find(l => l.id === id)?.notes ?? "";
    const res = await api.post("leads", { action: "update_notes", id, notes });
    if (res?.status === "success") {
      setLeads(prev => prev.map(l => l.id === id ? { ...l, notes } : l));
    }
    setSavingField(null);
  };

  const saveFollowUp = async (id: number) => {
    setSavingField(id);
    const follow_up_date = editingFollowUp[id] ?? leads.find(l => l.id === id)?.follow_up_date ?? "";
    const res = await api.post("leads", { action: "update_follow_up", id, follow_up_date });
    if (res?.status === "success") {
      setLeads(prev => prev.map(l => l.id === id ? { ...l, follow_up_date: follow_up_date || null } : l));
    }
    setSavingField(null);
  };

  const saveLead = async () => {
    if (!newLead.full_name.trim()) return;
    setSaving(true);
    const res = await api.post("leads", { action: "add_lead", ...newLead });
    if (res?.status === "success") {
      setAddOpen(false);
      setNewLead(BLANK_LEAD);
      fetchLeads();
    }
    setSaving(false);
  };

  const exportCSV     = () => window.open(`${API_BASE_URL}/leads.php?action=export_csv`, "_blank");
  const exportExcel   = () => window.open(`${API_BASE_URL}/leads.php?action=export_excel`, "_blank");
  const downloadSample = () => window.open(`${API_BASE_URL}/leads.php?action=sample_csv`, "_blank");

  // ── Derived stats ────────────────────────────────────────────────────────────

  const now     = Date.now();
  const weekAgo = now - 7 * 86_400_000;
  const today   = new Date().toISOString().split("T")[0];

  const totalLeads     = leads.length;
  const thisWeek       = leads.filter(l => new Date(l.created_at).getTime() >= weekAgo).length;
  const followUpDue    = leads.filter(l => l.follow_up_date && l.follow_up_date <= today).length;
  const converted      = leads.filter(l => l.status === "converted").length;
  const conversionRate = totalLeads > 0 ? ((converted / totalLeads) * 100).toFixed(1) : "0.0";

  const sources  = Array.from(new Set(leads.map(l => l.source).filter(Boolean)));

  const filtered = leads.filter(l => {
    if (statusFilter !== "all" && l.status !== statusFilter) return false;
    if (sourceFilter !== "all" && l.source !== sourceFilter) return false;
    if (dateFrom && l.created_at.slice(0, 10) < dateFrom) return false;
    if (dateTo   && l.created_at.slice(0, 10) > dateTo)   return false;
    const q = search.toLowerCase();
    if (q && !l.full_name.toLowerCase().includes(q) &&
              !l.email.toLowerCase().includes(q) &&
              !(l.company || "").toLowerCase().includes(q)) return false;
    return true;
  });

  // ── Newsletter stats ─────────────────────────────────────────────────────────

  const activeSubs  = subscribers.filter(s => s.status === "active").length;
  const unsubscribed = subscribers.filter(s => s.status === "unsubscribed").length;
  const subThisWeek = subscribers.filter(s => new Date(s.subscribed_at).getTime() >= weekAgo).length;

  const filteredSubs = subscribers.filter(s => {
    if (subFilter !== "all" && s.status !== subFilter) return false;
    if (subSearch && !s.email.toLowerCase().includes(subSearch.toLowerCase())) return false;
    return true;
  });

  // ── Loading / error ──────────────────────────────────────────────────────────

  if (loading) return (
    <AdminLayout>
      <div className="flex items-center justify-center h-[60vh]">
        <div className="text-brand font-display text-xl animate-pulse">Syncing CRM…</div>
      </div>
    </AdminLayout>
  );

  // ── Render ───────────────────────────────────────────────────────────────────

  return (
    <AdminLayout>
      <div className="space-y-5 pb-10">

        {/* ── Main Tab Nav ──────────────────────────────────────────────────── */}
        <div className="border-b border-slate-200">
          <div className="flex gap-6">
            {(["leads", "newsletter"] as MainTab[]).map(tab => (
              <button
                key={tab}
                onClick={() => setMainTab(tab)}
                className={cn(
                  "pb-3 text-sm font-semibold capitalize border-b-2 transition-colors",
                  mainTab === tab
                    ? "border-blue-600 text-blue-600"
                    : "border-transparent text-slate-500 hover:text-slate-700"
                )}
              >
                {tab === "leads" ? "All Leads" : "Newsletter"}
              </button>
            ))}
          </div>
        </div>

        {/* API error banner */}
        {apiError && (
          <div className="flex items-center gap-3 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 text-sm text-amber-800">
            <AlertTriangle className="w-4 h-4 text-amber-500 flex-shrink-0" />
            <span>Backend unreachable — showing local data only.</span>
            <button onClick={fetchLeads} className="ml-auto text-amber-700 font-bold underline underline-offset-2 hover:no-underline flex items-center gap-1">
              <RefreshCw className="w-3.5 h-3.5" /> Retry
            </button>
          </div>
        )}

        {/* ══════════════════════════════ LEADS TAB ═══════════════════════════ */}
        {mainTab === "leads" && (
          <>
            <h1 className="text-2xl font-bold text-slate-900">Leads</h1>

            {/* Stat cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: "Total Leads",     value: totalLeads },
                { label: "This Week",       value: thisWeek },
                { label: "Follow-up Due",   value: followUpDue },
                { label: "Conversion Rate", value: `${conversionRate}%` },
              ].map(({ label, value }) => (
                <div key={label} className="bg-white border border-slate-200 rounded-xl p-5">
                  <p className="text-sm text-slate-500 mb-1">{label}</p>
                  <p className="text-2xl font-bold text-slate-900">{value}</p>
                </div>
              ))}
            </div>

            {/* Filter bar */}
            <div className="flex items-center gap-2 flex-wrap">
              <div className="relative flex-1 min-w-[180px]">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                <input
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Search name, email, company…"
                  className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-blue-400"
                />
              </div>

              <select
                value={sourceFilter}
                onChange={e => setSourceFilter(e.target.value)}
                className="border border-slate-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:border-blue-400"
              >
                <option value="all">All Sources</option>
                {sources.map(s => <option key={s} value={s}>{s}</option>)}
              </select>

              <input
                type="date"
                value={dateFrom}
                onChange={e => setDateFrom(e.target.value)}
                className="border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-400"
              />
              <input
                type="date"
                value={dateTo}
                onChange={e => setDateTo(e.target.value)}
                className="border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-400"
              />

              <div className="ml-auto flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={exportCSV} className="gap-1.5 text-sm">
                  <Download className="w-4 h-4" /> CSV
                </Button>
                <Button variant="outline" size="sm" onClick={exportExcel} className="gap-1.5 text-sm text-emerald-700 border-emerald-200 hover:bg-emerald-50">
                  <FileSpreadsheet className="w-4 h-4" /> Excel
                </Button>
                <Button variant="outline" size="sm" onClick={downloadSample} className="gap-1.5 text-sm text-slate-500">
                  <FileText className="w-4 h-4" /> Sample
                </Button>
                <Button size="sm" onClick={() => setAddOpen(true)} className="gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm">
                  <Plus className="w-4 h-4" /> Add Lead
                </Button>
              </div>
            </div>

            {/* Status sub-tabs */}
            <div className="border-b border-slate-200 flex gap-0 overflow-x-auto">
              {LEAD_STATUSES.map(({ key, label }) => {
                const cnt = key === "all" ? leads.length : leads.filter(l => l.status === key).length;
                return (
                  <button
                    key={key}
                    onClick={() => setStatusFilter(key)}
                    className={cn(
                      "whitespace-nowrap px-4 py-2.5 text-[11px] font-bold tracking-wider border-b-2 transition-colors",
                      statusFilter === key
                        ? "border-blue-600 text-blue-600"
                        : "border-transparent text-slate-500 hover:text-slate-700"
                    )}
                  >
                    {label}
                    {cnt > 0 && key !== "all" && (
                      <span className="ml-1.5 text-[10px] bg-slate-100 text-slate-500 rounded-full px-1.5 py-0.5">
                        {cnt}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Leads table */}
            <div className="bg-white border border-slate-200 rounded-xl overflow-hidden overflow-x-auto">
              <table className="w-full min-w-[800px]">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50">
                    <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-widest text-slate-400">Name</th>
                    <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-widest text-slate-400">Company</th>
                    <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-widest text-slate-400">Source</th>
                    <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-widest text-slate-400">Status</th>
                    <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-widest text-slate-400">Follow-Up</th>
                    <th className="px-4 py-3 text-right text-[10px] font-bold uppercase tracking-widest text-slate-400">Age</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(lead => (
                    <React.Fragment key={lead.id}>
                      {/* Row */}
                      <tr
                        onClick={() => setExpandedId(expandedId === lead.id ? null : lead.id)}
                        className="border-b border-slate-50 hover:bg-slate-50 cursor-pointer transition-colors"
                      >
                        {/* Name + email */}
                        <td className="px-4 py-3.5">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xs flex-shrink-0">
                              {lead.full_name.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <p className="text-sm font-semibold text-slate-900 leading-tight">{lead.full_name}</p>
                              <p className="text-[11px] text-slate-400 mt-0.5">{lead.email}</p>
                            </div>
                          </div>
                        </td>

                        {/* Company + role */}
                        <td className="px-4 py-3.5">
                          <p className="text-sm text-slate-700">{lead.company || "—"}</p>
                          {lead.role && <p className="text-[11px] text-slate-400 mt-0.5">{lead.role}</p>}
                        </td>

                        {/* Source */}
                        <td className="px-4 py-3.5">
                          <span className="inline-block text-[11px] bg-slate-100 text-slate-600 px-2.5 py-1 rounded-full font-medium">
                            {lead.source || lead.service || "—"}
                          </span>
                        </td>

                        {/* Status — inline dropdown */}
                        <td className="px-4 py-3.5" onClick={e => e.stopPropagation()}>
                          <select
                            value={lead.status}
                            onChange={e => updateStatus(lead.id, e.target.value)}
                            className={cn(
                              "text-[11px] font-semibold px-2.5 py-1 rounded-full cursor-pointer focus:outline-none appearance-none text-center",
                              STATUS_STYLE[lead.status] ?? "bg-slate-100 text-slate-500 border border-slate-200"
                            )}
                          >
                            {LEAD_STATUSES.filter(s => s.key !== "all").map(s => (
                              <option key={s.key} value={s.key}>{s.label}</option>
                            ))}
                          </select>
                        </td>

                        {/* Follow-up */}
                        <td className="px-4 py-3.5">
                          {lead.follow_up_date ? (
                            <span className={cn(
                              "text-[11px] font-medium",
                              lead.follow_up_date <= today ? "text-rose-500" : "text-slate-500"
                            )}>
                              {new Date(lead.follow_up_date).toLocaleDateString()}
                            </span>
                          ) : (
                            <span className="text-slate-300 text-sm">—</span>
                          )}
                        </td>

                        {/* Age */}
                        <td className="px-4 py-3.5 text-right text-[11px] text-slate-400 font-medium">
                          {age(lead.created_at)}
                        </td>
                      </tr>

                      {/* Expanded 360° detail row */}
                      {expandedId === lead.id && (
                        <tr className="bg-slate-50/80 border-b border-slate-100">
                          <td colSpan={6} className="px-6 py-5">
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-sm">

                              {/* Contact */}
                              <div>
                                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-3">Contact</p>
                                <div className="space-y-2">
                                  <div className="flex items-center gap-2 text-slate-600">
                                    <Mail className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                                    <span className="text-xs break-all">{lead.email || "—"}</span>
                                  </div>
                                  <div className="flex items-center gap-2 text-slate-600">
                                    <Phone className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                                    <span className="text-xs">{lead.contact_number || "—"}</span>
                                  </div>
                                  <div className="flex items-center gap-2 text-slate-600">
                                    <Building2 className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                                    <span className="text-xs">{lead.company || "—"}{lead.role ? ` · ${lead.role}` : ""}</span>
                                  </div>
                                </div>
                              </div>

                              {/* Service / Source */}
                              <div>
                                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-3">Lead Info</p>
                                <div className="space-y-2 text-xs text-slate-600">
                                  <div><span className="text-slate-400">Service: </span>{lead.service || "—"}</div>
                                  <div><span className="text-slate-400">Source: </span>{lead.source || "—"}</div>
                                  <div><span className="text-slate-400">Received: </span>{new Date(lead.created_at).toLocaleString()}</div>
                                </div>
                              </div>

                              {/* Message */}
                              <div>
                                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-3">Message</p>
                                <p className="text-xs text-slate-600 leading-relaxed whitespace-pre-wrap">
                                  {lead.message || "No message provided."}
                                </p>
                              </div>

                              {/* Follow-up date editor */}
                              <div>
                                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-3">Follow-Up Date</p>
                                <input
                                  type="date"
                                  defaultValue={lead.follow_up_date?.slice(0, 10) ?? ""}
                                  onClick={e => e.stopPropagation()}
                                  onChange={e => setEditingFollowUp(prev => ({ ...prev, [lead.id]: e.target.value }))}
                                  className="w-full border border-slate-200 rounded-lg px-2 py-1.5 text-xs focus:outline-none focus:border-blue-400 mb-2"
                                />
                                <button
                                  onClick={e => { e.stopPropagation(); saveFollowUp(lead.id); }}
                                  disabled={savingField === lead.id}
                                  className="text-[11px] text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1 disabled:opacity-50"
                                >
                                  <Check className="w-3 h-3" /> {savingField === lead.id ? "Saving…" : "Save Date"}
                                </button>
                              </div>

                              {/* Notes + actions */}
                              <div>
                                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-3">Notes</p>
                                <textarea
                                  rows={3}
                                  defaultValue={lead.notes ?? ""}
                                  onClick={e => e.stopPropagation()}
                                  onChange={e => setEditingNotes(prev => ({ ...prev, [lead.id]: e.target.value }))}
                                  placeholder="Add internal notes…"
                                  className="w-full border border-slate-200 rounded-lg px-2 py-1.5 text-xs focus:outline-none focus:border-blue-400 resize-none mb-2"
                                />
                                <div className="flex items-center gap-3 pt-2 border-t border-slate-200">
                                  <button
                                    onClick={e => { e.stopPropagation(); saveNotes(lead.id); }}
                                    disabled={savingField === lead.id}
                                    className="text-[11px] text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1 disabled:opacity-50"
                                  >
                                    <Check className="w-3 h-3" /> {savingField === lead.id ? "Saving…" : "Save Notes"}
                                  </button>
                                  <button
                                    onClick={e => { e.stopPropagation(); deleteLead(lead.id); }}
                                    className="text-[11px] text-rose-500 hover:text-rose-700 font-medium flex items-center gap-1 ml-auto"
                                  >
                                    <Trash2 className="w-3 h-3" /> Delete
                                  </button>
                                </div>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>

              {filtered.length === 0 && (
                <div className="text-center py-16">
                  <Search className="w-8 h-8 text-slate-200 mx-auto mb-3" />
                  <p className="text-slate-400 text-sm">No leads found</p>
                </div>
              )}
            </div>
          </>
        )}

        {/* ══════════════════════════ NEWSLETTER TAB ══════════════════════════ */}
        {mainTab === "newsletter" && (
          <>
            <h1 className="text-2xl font-bold text-slate-900">Newsletter Subscribers</h1>

            {/* Stat cards */}
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-white border border-slate-200 rounded-xl p-5">
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">Active</p>
                <p className="text-3xl font-bold text-emerald-500">{activeSubs}</p>
              </div>
              <div className="bg-white border border-slate-200 rounded-xl p-5">
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">Unsubscribed</p>
                <p className="text-3xl font-bold text-slate-700">{unsubscribed}</p>
              </div>
              <div className="bg-white border border-slate-200 rounded-xl p-5">
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">This Week</p>
                <p className="text-3xl font-bold text-blue-500">{subThisWeek}</p>
              </div>
            </div>

            {/* Sub-filter tabs + search */}
            <div className="flex items-end justify-between border-b border-slate-200 gap-4">
              <div className="flex">
                {(["all", "active", "unsubscribed"] as SubFilter[]).map(f => (
                  <button
                    key={f}
                    onClick={() => setSubFilter(f)}
                    className={cn(
                      "px-4 py-2.5 text-sm font-medium capitalize border-b-2 transition-colors",
                      subFilter === f
                        ? "border-blue-600 text-blue-600"
                        : "border-transparent text-slate-500 hover:text-slate-700"
                    )}
                  >
                    {f === "all" ? "All" : f.charAt(0).toUpperCase() + f.slice(1)}
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-2 mb-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
                  <input
                    value={subSearch}
                    onChange={e => setSubSearch(e.target.value)}
                    placeholder="Search…"
                    className="pl-8 pr-4 py-1.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-blue-400 w-44"
                  />
                </div>
                <Button variant="outline" size="sm" onClick={() => window.open(`${API_BASE_URL}/newsletter.php?action=export_csv`, "_blank")} className="gap-1.5 text-sm">
                  <Download className="w-3.5 h-3.5" /> CSV
                </Button>
                <Button variant="outline" size="sm" onClick={() => window.open(`${API_BASE_URL}/newsletter.php?action=export_excel`, "_blank")} className="gap-1.5 text-sm text-emerald-700 border-emerald-200 hover:bg-emerald-50">
                  <FileSpreadsheet className="w-3.5 h-3.5" /> Excel
                </Button>
                <Button variant="outline" size="sm" onClick={() => window.open(`${API_BASE_URL}/newsletter.php?action=sample_csv`, "_blank")} className="gap-1.5 text-sm text-slate-500">
                  <FileText className="w-3.5 h-3.5" /> Sample
                </Button>
              </div>
            </div>

            {/* Newsletter table */}
            <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
              {subLoading ? (
                <div className="text-center py-16 text-slate-400 animate-pulse text-sm">Loading…</div>
              ) : (
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-100 bg-slate-50">
                      <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-widest text-slate-400">Email</th>
                      <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-widest text-slate-400">Source</th>
                      <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-widest text-slate-400">Status</th>
                      <th className="px-4 py-3 text-right text-[10px] font-bold uppercase tracking-widest text-slate-400">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredSubs.map(sub => (
                      <tr key={sub.id} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                        <td className="px-4 py-3.5">
                          <div className="flex items-center gap-2">
                            <Mail className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                            <div>
                              <p className="text-sm text-slate-700">{sub.email}</p>
                              <p className="text-[11px] text-slate-400 mt-0.5">
                                {new Date(sub.subscribed_at).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3.5">
                          <span className="text-[11px] bg-slate-100 text-slate-600 px-2.5 py-1 rounded-full font-medium">
                            {sub.source || "website"}
                          </span>
                        </td>
                        <td className="px-4 py-3.5">
                          <span className={cn(
                            "text-[11px] font-semibold px-2.5 py-1 rounded-full",
                            sub.status === "active"
                              ? "bg-emerald-50 text-emerald-600"
                              : "bg-slate-100 text-slate-500"
                          )}>
                            {sub.status}
                          </span>
                        </td>
                        <td className="px-4 py-3.5 text-right">
                          <button
                            onClick={async () => {
                              if (!confirm("Delete this subscriber?")) return;
                              const res = await api.post("newsletter", { action: "delete_subscriber", id: sub.id });
                              if (res?.status === "success") {
                                setSubscribers(prev => prev.filter(x => x.id !== sub.id));
                              }
                            }}
                            className="text-slate-400 hover:text-rose-500 transition-colors p-1"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}

              {!subLoading && filteredSubs.length === 0 && (
                <div className="text-center py-16">
                  <p className="text-slate-400 text-sm">No subscribers</p>
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {/* ── Add Lead Modal ──────────────────────────────────────────────────── */}
      {addOpen && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-lg shadow-2xl">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold text-slate-900">Add Lead</h2>
              <button
                onClick={() => setAddOpen(false)}
                className="text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {[
                { key: "full_name",      label: "Full Name *" },
                { key: "email",          label: "Email" },
                { key: "company",        label: "Company" },
                { key: "role",           label: "Role / Title" },
                { key: "contact_number", label: "Phone" },
                { key: "source",         label: "Source" },
              ].map(({ key, label }) => (
                <div key={key}>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                    {label}
                  </label>
                  <input
                    value={(newLead as Record<string, string>)[key]}
                    onChange={e => setNewLead(prev => ({ ...prev, [key]: e.target.value }))}
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-400"
                  />
                </div>
              ))}
            </div>

            <div className="mt-4">
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">Message</label>
              <textarea
                value={newLead.message}
                onChange={e => setNewLead(prev => ({ ...prev, message: e.target.value }))}
                rows={3}
                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-400 resize-none"
              />
            </div>

            <div className="flex justify-end gap-3 mt-5">
              <Button variant="outline" onClick={() => setAddOpen(false)}>Cancel</Button>
              <Button
                disabled={saving || !newLead.full_name.trim()}
                onClick={saveLead}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                {saving ? "Saving…" : "Add Lead"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
