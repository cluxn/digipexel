"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import AdminLayout from "@/components/admin/admin-layout";
import { api } from "@/lib/api";
import { API_BASE_URL } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { AlertTriangle, RefreshCw } from "lucide-react";

interface Subscriber {
  id: number;
  email: string;
  subscribed_at: string;
  status: "active" | "unsubscribed";
}

type FilterType = "all" | "active" | "unsubscribed";

export default function AdminNewsletterPage() {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState(false);
  const [filter, setFilter] = useState<FilterType>("all");

  useEffect(() => {
    fetchSubscribers();
  }, []);

  const fetchSubscribers = async () => {
    setLoading(true);
    setApiError(false);
    const res = await api.get("newsletter");
    if (res?.status === "success" && Array.isArray(res.data)) {
      setSubscribers(res.data as Subscriber[]);
    } else {
      setApiError(true);
    }
    setLoading(false);
  };

  const handleUnsubscribe = async (id: number) => {
    if (!confirm("Mark this subscriber as unsubscribed?")) return;
    const res = await api.post("newsletter", { action: "unsubscribe", id });
    if (res?.status === "success") {
      fetchSubscribers();
    }
  };

  const filteredSubscribers =
    filter === "all"
      ? subscribers
      : subscribers.filter((s) => s.status === filter);

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-[60vh]">
          <div className="text-brand font-display text-xl animate-pulse">
            Loading subscribers...
          </div>
        </div>
      </AdminLayout>
    );
  }

  if (apiError) {
    return (
      <AdminLayout>
        <div className="flex flex-col items-center justify-center h-[60vh] gap-5 text-center">
          <div className="w-14 h-14 rounded-2xl bg-rose-50 flex items-center justify-center">
            <AlertTriangle className="w-7 h-7 text-rose-400" />
          </div>
          <div>
            <p className="font-bold text-[#1A1C1E] text-lg mb-1">Could not load subscribers</p>
            <p className="text-slate-400 text-sm max-w-xs">
              The API did not respond. Check that your backend is reachable at:<br />
              <code className="text-xs bg-slate-100 px-2 py-0.5 rounded mt-1 inline-block break-all">{API_BASE_URL}</code>
            </p>
          </div>
          <Button variant="outline" className="rounded-xl border-slate-200 gap-2" onClick={fetchSubscribers}>
            <RefreshCw className="w-4 h-4" /> Retry
          </Button>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-slate-100 pb-8">
          <div className="space-y-2">
            <Badge className="bg-brand/10 text-brand border-0 rounded-full px-3 py-1 text-[10px] font-bold tracking-widest uppercase">
              Newsletter
            </Badge>
            <h1 className="text-4xl font-display font-bold text-[#1A1C1E] tracking-tight">
              Subscribers
            </h1>
            <p className="text-slate-400 text-sm max-w-lg">
              Manage newsletter subscribers. Export to CSV for email campaigns.
            </p>
          </div>

          <Button
            variant="outline"
            className="rounded-xl border-slate-200 text-slate-700 hover:bg-slate-50"
            onClick={() =>
              window.open(
                `${API_BASE_URL}/newsletter.php?action=export_csv`,
                "_blank"
              )
            }
          >
            Export CSV
          </Button>
        </div>

        {/* Filter Tabs */}
        <div className="flex bg-slate-100 p-1.5 rounded-2xl w-fit">
          {(["all", "active", "unsubscribed"] as FilterType[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={cn(
                "px-6 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all",
                filter === tab
                  ? "bg-white text-brand shadow-sm"
                  : "text-slate-400 hover:text-slate-600"
              )}
            >
              {tab === "all"
                ? "All"
                : tab === "active"
                ? "Active"
                : "Unsubscribed"}
            </button>
          ))}
        </div>

        {/* Table Card */}
        <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden overflow-x-auto">
          {filteredSubscribers.length === 0 ? (
            <div className="text-center py-20 px-8">
              <p className="text-slate-400 font-bold tracking-widest text-[10px] uppercase mb-2">
                No subscribers yet.
              </p>
              <p className="text-slate-400 text-sm">
                The footer signup form will capture leads here.
              </p>
            </div>
          ) : (
            <table className="w-full text-sm min-w-[600px]">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100">
                  <th className="px-8 py-5 text-left text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">
                    Email
                  </th>
                  <th className="px-6 py-5 text-left text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">
                    Subscribed
                  </th>
                  <th className="px-6 py-5 text-left text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">
                    Status
                  </th>
                  <th className="px-6 py-5 text-right text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filteredSubscribers.map((sub) => (
                  <tr
                    key={sub.id}
                    className="group hover:bg-slate-50/50 transition-colors"
                  >
                    <td className="px-8 py-5">
                      <span className="font-bold text-[#1A1C1E] text-sm">
                        {sub.email}
                      </span>
                    </td>
                    <td className="px-6 py-5 text-slate-500 text-sm">
                      {new Date(sub.subscribed_at).toLocaleDateString("en-GB")}
                    </td>
                    <td className="px-6 py-5">
                      <span
                        className={cn(
                          "inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest",
                          sub.status === "active"
                            ? "bg-emerald-50 text-emerald-600"
                            : "bg-slate-100 text-slate-400"
                        )}
                      >
                        {sub.status}
                      </span>
                    </td>
                    <td className="px-6 py-5 text-right">
                      {sub.status === "active" && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-xl text-xs"
                          onClick={() => handleUnsubscribe(sub.id)}
                        >
                          Unsubscribe
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
