"use client";

import React, { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ArrowRight, CheckCircle2, AlertCircle } from "lucide-react";
import { safeFetch, fireWebhook } from "@/lib/utils";
import { API_BASE_URL, WEBHOOK_LEAD } from "@/lib/constants";

interface LeadData { name: string; phone: string; }

async function submitLead(data: LeadData, source: string) {
  return safeFetch(`${API_BASE_URL}/leads.php`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      action: "add_lead",
      full_name: data.name,
      email: "",
      company: "",
      message: `Quick lead capture. Phone: ${data.phone}`,
      service: source,
    }),
  });
}

// ── Inline banner (injected mid-content and at end) ────────────────────────────
export function InlineLeadForm({
  heading = "Want to see how this applies to your business?",
  subheading,
  cta = "Get Free Consultation",
  source,
}: {
  heading?: string;
  subheading?: string;
  cta?: string;
  source: string;
}) {
  const [form, setForm] = useState<LeadData>({ name: "", phone: "" });
  const [sent, setSent] = useState(false);
  const [error, setError] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(false);
    const res = await submitLead(form, source);
    if (res.status === "success") {
      fireWebhook(WEBHOOK_LEAD, {
        full_name: form.name,
        contact_number: form.phone,
        source,
        action: "add_lead",
      });
      setSent(true);
    } else {
      setError(true);
    }
    setSubmitting(false);
  };

  if (sent) {
    return (
      <div className="my-10 rounded-2xl border border-border-subtle bg-white p-8 text-center shadow-sm">
        <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 className="w-6 h-6 text-emerald-500" />
        </div>
        <p className="font-bold text-primary text-base mb-1">We&apos;ll be in touch soon!</p>
        <p className="text-secondary/55 text-sm">Our team typically responds within 24 hours.</p>
      </div>
    );
  }

  return (
    <div className="mt-10 mb-16 rounded-2xl border border-brand/15 bg-brand/[0.03] p-6 md:p-8">
      <div className="mb-5">
        <div className="inline-flex items-center gap-1.5 bg-brand/10 border border-brand/15 rounded-full px-3 py-1 mb-3">
          <span className="w-1.5 h-1.5 rounded-full bg-brand animate-pulse" />
          <span className="text-[10px] font-black uppercase tracking-widest text-brand/80">Free Consultation</span>
        </div>
        <p className="text-primary font-bold text-base leading-snug">{heading}</p>
        {subheading && <p className="text-secondary/60 text-sm mt-1.5 leading-relaxed">{subheading}</p>}
      </div>
      <form onSubmit={submit} className="flex flex-col gap-3">
        <div className="flex gap-3">
          <input
            required
            placeholder="Your name"
            value={form.name}
            onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
            className="flex-1 min-w-0 h-11 px-4 rounded-xl border border-border-subtle bg-white text-sm focus:outline-none focus:border-brand/40 focus:ring-2 focus:ring-brand/10 placeholder:text-secondary/35 transition-all"
          />
          <input
            required
            type="tel"
            placeholder="Phone number"
            value={form.phone}
            onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
            className="flex-1 min-w-0 h-11 px-4 rounded-xl border border-border-subtle bg-white text-sm focus:outline-none focus:border-brand/40 focus:ring-2 focus:ring-brand/10 placeholder:text-secondary/35 transition-all"
          />
        </div>
        <button
          type="submit"
          disabled={submitting}
          className="w-full h-11 px-6 bg-brand hover:bg-brand/90 text-white font-bold text-sm rounded-xl transition-all disabled:opacity-60 whitespace-nowrap shadow-sm shadow-brand/20"
        >
          {submitting ? "Sending…" : cta}
        </button>
      </form>
      {error && (
        <div className="flex items-center gap-2 mt-3 rounded-xl bg-rose-50 border border-rose-100 px-3 py-2.5">
          <AlertCircle className="w-4 h-4 text-rose-500 flex-shrink-0" />
          <p className="text-xs text-rose-700">Something went wrong. Please try again.</p>
        </div>
      )}
    </div>
  );
}

// ── Auto-opening side popup ────────────────────────────────────────────────────
export function LeadPopup({
  source,
  heading = "Get a free demo",
  subheading = "See how Digi Pexel helps automate your operations and grow revenue — no commitment required.",
  cta = "Get Free Demo",
  delayMs = 4000,
}: {
  source: string;
  heading?: string;
  subheading?: string;
  cta?: string;
  delayMs?: number;
}) {
  const [visible, setVisible] = useState(false);
  const [form, setForm] = useState<LeadData>({ name: "", phone: "" });
  const [sent, setSent] = useState(false);
  const [error, setError] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const fired = useRef(false);

  useEffect(() => {
    const key = `ldpop_${source.replace(/\s/g, "_").slice(0, 40)}`;
    if (sessionStorage.getItem(key)) return;
    const t = setTimeout(() => {
      if (fired.current) return;
      fired.current = true;
      setVisible(true);
      sessionStorage.setItem(key, "1");
    }, delayMs);
    return () => clearTimeout(t);
  }, [source, delayMs]);

  const close = () => setVisible(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(false);
    const res = await submitLead(form, `Popup: ${source}`);
    if (res.status === "success") {
      fireWebhook(WEBHOOK_LEAD, {
        full_name: form.name,
        contact_number: form.phone,
        source: `Popup: ${source}`,
        action: "add_lead",
      });
      setSent(true);
    } else {
      setError(true);
    }
    setSubmitting(false);
  };

  return (
    <AnimatePresence>
      {visible && (
        <>
          {/* Backdrop (mobile only) */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={close}
            className="fixed inset-0 z-[60] bg-black/30 sm:hidden"
          />

          {/* Popup card */}
          <motion.div
            key="popup"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
            transition={{ type: "spring", damping: 24, stiffness: 280 }}
            className="fixed bottom-6 right-6 z-[60] w-full max-w-sm"
          >
            <div className="bg-white rounded-3xl shadow-2xl border border-border-subtle overflow-hidden">
              {/* Close row */}
              <div className="flex items-center justify-between px-5 pt-4 pb-2">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-brand animate-pulse" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-brand/70">Digi Pexel</span>
                </div>
                <button
                  onClick={close}
                  className="p-1.5 rounded-full bg-surface hover:bg-border-subtle transition-colors text-secondary/50"
                  aria-label="Close"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="px-6 pb-6">
                {!sent ? (
                  <>
                    <h3 className="text-primary font-bold text-lg mb-1.5">{heading}</h3>
                    <p className="text-secondary/55 text-sm mb-5 leading-relaxed">{subheading}</p>
                    <form onSubmit={submit} className="space-y-3">
                      <input
                        required
                        placeholder="Your name"
                        value={form.name}
                        onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                        className="w-full h-11 px-4 rounded-xl border border-border-subtle bg-base text-sm focus:outline-none focus:border-brand/40 focus:ring-2 focus:ring-brand/10 placeholder:text-secondary/35 transition-all"
                      />
                      <input
                        required
                        type="tel"
                        placeholder="Phone number"
                        value={form.phone}
                        onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                        className="w-full h-11 px-4 rounded-xl border border-border-subtle bg-base text-sm focus:outline-none focus:border-brand/40 focus:ring-2 focus:ring-brand/10 placeholder:text-secondary/35 transition-all"
                      />
                      {error && (
                        <div className="flex items-center gap-2 rounded-xl bg-rose-50 border border-rose-100 px-3 py-2.5">
                          <AlertCircle className="w-4 h-4 text-rose-500 flex-shrink-0" />
                          <p className="text-xs text-rose-700">Something went wrong. Please try again.</p>
                        </div>
                      )}
                      <button
                        type="submit"
                        disabled={submitting}
                        className="w-full h-12 bg-brand hover:bg-brand/90 text-white font-bold text-sm rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-60 shadow-sm shadow-brand/20"
                      >
                        {submitting ? "Sending…" : cta}
                        {!submitting && <ArrowRight className="w-4 h-4" />}
                      </button>
                    </form>
                  </>
                ) : (
                  <div className="text-center py-4">
                    <div className="w-14 h-14 rounded-full bg-emerald-50 flex items-center justify-center mx-auto mb-4">
                      <CheckCircle2 className="w-7 h-7 text-emerald-500" />
                    </div>
                    <p className="font-bold text-primary mb-1">You&apos;re all set!</p>
                    <p className="text-secondary/55 text-sm">We&apos;ll reach out within 24 hours.</p>
                  </div>
                )}
              </div>

              <div className="border-t border-border-subtle px-6 py-3 bg-surface/60">
                <p className="text-[10px] text-secondary/40 text-center">
                  Powered by <span className="font-bold text-brand">Digi Pexel</span> · No spam, ever.
                </p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
