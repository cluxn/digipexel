"use client";

import React, { useRef, useState, useEffect } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { useAnimate } from "framer-motion";
import { Sparkles, CheckCircle2, AlertCircle, RotateCcw } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Particles } from "@/components/ui/highlighter";
import { cn, safeFetch, fireWebhook } from "@/lib/utils";
import { API_BASE_URL, WEBHOOK_LEAD } from "@/lib/constants";
const CalendlyButton = dynamic(
  () => import("@/components/ui/calendly-button").then(m => m.CalendlyButton),
  { ssr: false }
);

interface ConnectProps {
  variant?: "dark" | "light";
  isHomepage?: boolean;
  badge?: string;     // per-service CTA badge override (e.g. "Deployment Ready")
  title?: string;     // per-service CTA heading override (plain text — do NOT split into line1/line2)
  copy?: string;      // per-service CTA body copy override
  ctaHref?: string;   // per-page CTA link override — takes precedence over settings DB value
}

/* ─── Animated service tags panel ────────────────────────────────────────── */
function ServiceAnimation() {
  const [scope, animate] = useAnimate();

  React.useEffect(() => {
    animate(
      [
        ["#cursor", { left: 210, top: 55 }, { duration: 0 }],
        ["#tag-branding", { opacity: 1 }, { duration: 0.3 }],
        [
          "#cursor",
          { left: 48, top: 100 },
          { at: "+0.5", duration: 0.5, ease: "easeInOut" },
        ],
        ["#tag-branding", { opacity: 0.4 }, { at: "-0.3", duration: 0.1 }],
        ["#tag-design", { opacity: 1 }, { duration: 0.3 }],
        [
          "#cursor",
          { left: 220, top: 175 },
          { at: "+0.5", duration: 0.5, ease: "easeInOut" },
        ],
        ["#tag-design", { opacity: 0.4 }, { at: "-0.3", duration: 0.1 }],
        ["#tag-webapps", { opacity: 1 }, { duration: 0.3 }],
        [
          "#cursor",
          { left: 82, top: 202 },
          { at: "+0.5", duration: 0.5, ease: "easeInOut" },
        ],
        ["#tag-webapps", { opacity: 0.4 }, { at: "-0.3", duration: 0.1 }],
        ["#tag-ai", { opacity: 1 }, { duration: 0.3 }],
        [
          "#cursor",
          { left: 210, top: 55 },
          { at: "+0.5", duration: 0.5, ease: "easeInOut" },
        ],
        ["#tag-ai", { opacity: 0.5 }, { at: "-0.3", duration: 0.1 }],
      ],
      { repeat: Number.POSITIVE_INFINITY },
    );
  }, [animate]);

  return (
    <div className="relative mx-auto h-[270px] w-[300px]" ref={scope}>
      {/* Center icon */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-brand/20 border border-brand/30 flex items-center justify-center">
        <Sparkles className="w-5 h-5 text-brand" />
      </div>

      {/* Floating service tags */}
      <div
        id="tag-ai"
        className="absolute right-10 top-10 rounded-2xl border border-slate-300/60 bg-white/80 backdrop-blur-sm px-3 py-1.5 text-xs font-semibold text-slate-700 opacity-50 shadow-sm"
      >
        AI Workflows
      </div>
      <div
        id="tag-design"
        className="absolute left-2 top-20 rounded-2xl border border-slate-300/60 bg-white/80 backdrop-blur-sm px-3 py-1.5 text-xs font-semibold text-slate-700 opacity-50 shadow-sm"
      >
        UI/UX Design
      </div>
      <div
        id="tag-webapps"
        className="absolute bottom-20 right-1 rounded-2xl border border-slate-300/60 bg-white/80 backdrop-blur-sm px-3 py-1.5 text-xs font-semibold text-slate-700 opacity-50 shadow-sm"
      >
        Web Apps
      </div>
      <div
        id="tag-branding"
        className="absolute bottom-12 left-14 rounded-2xl border border-slate-300/60 bg-white/80 backdrop-blur-sm px-3 py-1.5 text-xs font-semibold text-slate-700 opacity-50 shadow-sm"
      >
        Branding
      </div>

      {/* Animated cursor */}
      <div id="cursor" className="absolute pointer-events-none">
        <svg
          width="16"
          height="18"
          viewBox="0 0 12 13"
          className="fill-brand drop-shadow-md"
          stroke="white"
          strokeWidth="1"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M12 5.50676L0 0L2.83818 13L6.30623 7.86537L12 5.50676V5.50676Z"
          />
        </svg>
        <span className="relative -top-1 left-3 rounded-2xl bg-brand px-2 py-0.5 text-[10px] font-bold text-white shadow-md">
          Digi
        </span>
      </div>
    </div>
  );
}

/* ─── Main Component ──────────────────────────────────────────────────────── */
export function Connect({ variant = "light", isHomepage = false, badge, title, copy, ctaHref }: ConnectProps) {
  const [loading, setLoading] = useState(false);
  const [formStatus, setFormStatus] = useState<"idle" | "success" | "error">("idle");
  const formRef = useRef<HTMLFormElement>(null);
  const [fetchedLink, setFetchedLink] = useState("/contact-us");
  const [calendlyUrl, setCalendlyUrl] = useState("");
  const [whatsappNumber, setWhatsappNumber] = useState("");
  const effectiveCtaLink = ctaHref || fetchedLink;

  useEffect(() => {
    safeFetch(`${API_BASE_URL}/settings.php`).then(json => {
      if (json?.status === "success" && json.data) {
        const d = json.data as Record<string, string>;
        if (d.default_cta_link) setFetchedLink(d.default_cta_link);
        if (d.calendly_url) setCalendlyUrl(d.calendly_url);
        if (d.whatsapp_number) setWhatsappNumber(d.whatsapp_number.replace(/\D/g, ""));
      }
    }).catch(() => {});
  }, []);

  const isDark = variant === "dark";

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const form = e.currentTarget;
    const formData = {
      action: "add_lead",
      full_name: (form.elements.namedItem("name") as HTMLInputElement).value,
      email: (form.elements.namedItem("email") as HTMLInputElement).value,
      company: (form.elements.namedItem("company") as HTMLInputElement).value,
      contact_number: (form.elements.namedItem("contact") as HTMLInputElement).value,
      service: (form.elements.namedItem("service") as HTMLInputElement).value,
      message: (form.elements.namedItem("message") as HTMLTextAreaElement).value,
    };
    try {
      const data = await safeFetch(`${API_BASE_URL}/leads.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (data && data.status === "success") {
        fireWebhook(WEBHOOK_LEAD, { ...formData, source: "connect_cta", site_name: "Digi Pexel" });
        form.reset();
        setFormStatus("success");
      } else {
        setFormStatus("error");
      }
    } catch {
      setFormStatus("error");
    } finally {
      setLoading(false);
    }
  };

  const inputCls = cn(
    "w-full rounded-2xl px-5 py-4 text-sm focus:outline-none focus:ring-2 transition-all font-medium placeholder:text-secondary/30",
    isDark
      ? "bg-white/5 border border-white/10 text-white placeholder:text-white/20 focus:ring-brand/20"
      : "bg-base border border-border-subtle focus:ring-brand/10"
  );

  const labelCls = "text-[10px] uppercase tracking-widest font-bold ml-1 " + (isDark ? "text-white/50" : "text-secondary/70");

  return (
    <section className="py-24 w-full relative z-10">
      <div className="container mx-auto px-6 max-w-7xl">
        {isHomepage ? (
          /* ── Homepage: animation left + full form right ── */
          <div
            className={cn(
              "relative rounded-[3rem] border overflow-hidden",
              /* 3-D layered shadow */
              "shadow-[0_2px_0_rgba(255,255,255,0.8)_inset,0_40px_80px_-10px_rgba(37,99,235,0.12),0_20px_40px_-8px_rgba(0,0,0,0.10),0_8px_16px_-4px_rgba(0,0,0,0.06)]",
              isDark
                ? "bg-[#0F172A] border-brand/20"
                : "bg-white border-border-subtle"
            )}
          >
            {/* Ambient glows */}
            <div className="absolute top-0 right-0 w-1/2 h-2/3 blur-[140px] rounded-full -mr-32 -mt-32 pointer-events-none bg-brand/8" />
            <div className="absolute bottom-0 left-0 w-1/2 h-2/3 blur-[140px] rounded-full -ml-32 -mb-32 pointer-events-none bg-brand/5" />

            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2">

              {/* ── Left: Animation ── */}
              <div
                className={cn(
                  "relative flex flex-col items-center justify-center min-h-[520px] px-10 py-14 overflow-hidden",
                  isDark ? "border-b lg:border-b-0 lg:border-r border-white/10" : "border-b lg:border-b-0 lg:border-r border-border-subtle"
                )}
              >
                {/* Particles fill full left panel */}
                <Particles
                  className="absolute inset-0 -z-0"
                  quantity={120}
                  color={isDark ? "#6366f1" : "#2563eb"}
                  vy={-0.15}
                  staticity={60}
                  ease={60}
                />

                {/* Heading */}
                <div className="relative z-10 text-center mb-10 space-y-3">
                  <Badge
                    variant="outline"
                    className={cn(
                      "tracking-[0.4em] uppercase py-1.5 px-4 rounded-full text-[10px] font-bold",
                      isDark
                        ? "border-white/10 bg-white/5 text-white/60"
                        : "border-brand/10 bg-brand/5 text-brand/70"
                    )}
                  >
                    Secure Intake
                  </Badge>
                  <h2
                    className={cn(
                      "text-3xl md:text-4xl font-display font-bold tracking-tight leading-[1.15]",
                      isDark ? "text-white" : "text-primary"
                    )}
                  >
                    Ready to architect your{" "}
                    <span className="text-brand">autonomous future?</span>
                  </h2>
                  <p className={cn("text-sm leading-relaxed max-w-xs mx-auto", isDark ? "text-white/45" : "text-secondary/65")}>
                    Submit your parameters and our architecture team will respond within 24 hours.
                  </p>
                </div>

                {/* Animated service tags + cursor */}
                <div className="relative z-10">
                  <ServiceAnimation />
                </div>
              </div>

              {/* ── Right: Full contact form ── */}
              <div className={cn("px-10 py-14", isDark ? "" : "")}>

                {formStatus === "success" ? (
                  <div className="flex flex-col items-center justify-center text-center min-h-[420px] gap-5">
                    <div className="w-16 h-16 rounded-full bg-emerald-500/15 flex items-center justify-center">
                      <CheckCircle2 className="w-8 h-8 text-emerald-400" />
                    </div>
                    <div>
                      <h3 className={cn("text-xl font-display font-bold mb-2", isDark ? "text-white" : "text-primary")}>
                        We&apos;ve Got Your Details!
                      </h3>
                      <p className={cn("text-sm leading-relaxed max-w-xs mx-auto", isDark ? "text-white/50" : "text-secondary/60")}>
                        Thank you for reaching out. Our team will respond within 24 hours with a tailored roadmap.
                      </p>
                    </div>
                    <button
                      onClick={() => setFormStatus("idle")}
                      className={cn("flex items-center gap-2 text-xs font-bold transition-colors mt-2", isDark ? "text-white/30 hover:text-white/60" : "text-secondary/40 hover:text-brand")}
                    >
                      <RotateCcw className="w-3.5 h-3.5" /> Submit another inquiry
                    </button>
                  </div>
                ) : (
                <>
                <div className="mb-8">
                  <h3 className={cn("text-xl font-display font-bold tracking-tight mb-1", isDark ? "text-white" : "text-primary")}>
                    Start the conversation
                  </h3>
                  <p className={cn("text-sm", isDark ? "text-white/40" : "text-secondary/55")}>
                    We&apos;ll get back to you within 24 hours.
                  </p>
                </div>

                <form ref={formRef} onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="space-y-1.5">
                      <label className={labelCls}>Full Name</label>
                      <input
                        name="name"
                        type="text"
                        required
                        placeholder="John Doe"
                        className={inputCls}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className={labelCls}>Work Email</label>
                      <input
                        name="email"
                        type="email"
                        required
                        placeholder="john@company.com"
                        className={inputCls}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className={labelCls}>Company Name</label>
                      <input
                        name="company"
                        type="text"
                        placeholder="Acme Corp"
                        className={inputCls}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className={labelCls}>Service Focus</label>
                      <input
                        name="service"
                        type="text"
                        placeholder="AI workflows, automation…"
                        className={inputCls}
                      />
                    </div>
                    <div className="sm:col-span-2 space-y-1.5">
                      <label className={labelCls}>Contact Number</label>
                      <input
                        name="contact"
                        type="tel"
                        placeholder="+1 (555) 000-0000"
                        className={inputCls}
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className={labelCls}>What are we building?</label>
                    <textarea
                      name="message"
                      placeholder="Tell us about your automation goals..."
                      rows={4}
                      className={cn(inputCls, "resize-none")}
                    />
                  </div>

                  {formStatus === "error" && (
                    <div className={cn("flex items-start gap-3 rounded-2xl px-4 py-3 border", isDark ? "bg-rose-500/10 border-rose-500/20" : "bg-rose-50 border-rose-100")}>
                      <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5" />
                      <p className={cn("text-sm", isDark ? "text-rose-300" : "text-rose-600")}>
                        Something went wrong. Please try again or email{" "}
                        <a href="mailto:info@digipexel.com" className="font-semibold underline">info@digipexel.com</a>.
                      </p>
                    </div>
                  )}
                  <Button
                    type="submit"
                    disabled={loading}
                    variant="brand"
                    className="w-full h-12 font-bold uppercase tracking-widest text-xs disabled:opacity-50 hover:-translate-y-0.5 active:scale-[0.98]"
                  >
                    {loading ? "Submitting…" : "Initialize Roadmap →"}
                  </Button>
                  {whatsappNumber && (
                    <div className="flex items-center justify-center gap-3">
                      <span className={cn("text-xs font-medium", isDark ? "text-white/25" : "text-secondary/30")}>or</span>
                      <a
                        href={`https://wa.me/${whatsappNumber}?text=Hi%2C%20I%27d%20like%20to%20discuss%20a%20project`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-sm font-semibold text-[#25D366] hover:underline"
                      >
                        <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4" aria-hidden="true"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.031-.967-.272-.099-.47-.148-.669.15-.198.297-.767.966-.94 1.164-.173.199-.347.223-.644.074-.297-.148-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.52.149-.174.198-.298.297-.497.1-.198.05-.372-.024-.521-.075-.149-.669-1.612-.916-2.207-.243-.579-.487-.5-.669-.51-.173-.008-.372-.01-.571-.01-.198 0-.52.074-.793.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.066 2.875 1.214 3.074.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.625.712.227 1.36.195 1.872.118.571-.085 1.757-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.571-.347zM12.001 2C6.478 2 2 6.478 2 12c0 1.852.502 3.587 1.38 5.079L2.05 21.95l4.991-1.31A9.955 9.955 0 0012.001 22C17.523 22 22 17.522 22 12S17.523 2 12.001 2zm0 18.18a8.165 8.165 0 01-4.164-1.14l-.299-.177-3.096.812.826-3.018-.195-.31A8.14 8.14 0 013.82 12c0-4.512 3.67-8.18 8.181-8.18 4.512 0 8.18 3.668 8.18 8.18 0 4.511-3.668 8.18-8.18 8.18z"/></svg>
                        Chat on WhatsApp
                      </a>
                    </div>
                  )}
                  <p className={cn("text-center text-[11px] italic", isDark ? "text-white/20" : "text-secondary/40")}>
                    Guaranteed response within 24 hours. Your data is secure.
                  </p>
                </form>
                </>
                )}
              </div>

            </div>
          </div>
        ) : (
          /* ── Non-homepage: simple centered CTA ── */
          <div
            className={cn(
              "relative rounded-[4rem] border p-12 md:p-20 overflow-hidden group transition-all duration-700 text-center",
              "shadow-[0_2px_0_rgba(255,255,255,0.8)_inset,0_40px_80px_-10px_rgba(37,99,235,0.12),0_20px_40px_-8px_rgba(0,0,0,0.10),0_8px_16px_-4px_rgba(0,0,0,0.06)]",
              isDark
                ? "bg-[#0F172A] border-brand/20"
                : "bg-white border-border-subtle"
            )}
          >
            <div className={cn("absolute top-0 right-0 w-1/3 h-full blur-[120px] rounded-full -mr-32 -mt-32 transition-transform group-hover:scale-125 pointer-events-none", isDark ? "bg-brand/10" : "bg-brand/5")} />
            <div className={cn("absolute bottom-0 left-0 w-1/3 h-full blur-[120px] rounded-full -ml-32 -mb-32 transition-transform group-hover:scale-125 pointer-events-none", isDark ? "bg-brand/5" : "bg-brand/10")} />
            <div className="relative z-10 space-y-8 max-w-4xl mx-auto">
              <Badge variant="outline" className={cn("tracking-[0.4em] uppercase py-1.5 px-4 rounded-full text-[10px] font-bold", isDark ? "border-white/10 bg-white/5 text-white/60" : "border-brand/10 bg-brand/5 text-brand/70")}>
                {badge ?? "Deployment Ready"}
              </Badge>
              <h2 className={cn("text-4xl md:text-6xl font-display font-bold tracking-tight leading-[1.1]", isDark ? "text-white" : "text-primary")}>
                {title ?? (
                  <>
                    Ready to architect your <br />
                    <span className="text-brand">autonomous future?</span>
                  </>
                )}
              </h2>
              <p className={cn("text-lg font-medium leading-relaxed max-w-2xl mx-auto", isDark ? "text-white/50" : "text-secondary/70")}>
                {copy ?? "Get a tailored plan and deployment timeline in days, not weeks. Start building your autonomous future today."}
              </p>
              <div className="pt-4 flex justify-center">
                {calendlyUrl ? (
                  <CalendlyButton
                    url={calendlyUrl}
                    label="Start Building Now"
                    className="h-16 px-12 text-xl font-bold uppercase tracking-wider"
                  />
                ) : (
                  <Button asChild variant="brand" className="h-16 px-12 text-xl font-bold uppercase tracking-wider hover:-translate-y-1">
                    <Link href={effectiveCtaLink}>Start Building Now</Link>
                  </Button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
