"use client";

import React, { useRef, useState } from "react";
import Link from "next/link";
import { useAnimate } from "framer-motion";
import { Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Particles } from "@/components/ui/highlighter";
import { cn, safeFetch } from "@/lib/utils";
import { useRouter } from "next/navigation";

interface ConnectProps {
  variant?: "dark" | "light";
  isHomepage?: boolean;
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
export function Connect({ variant = "light", isHomepage = false }: ConnectProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

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
      const data = await safeFetch("/api/leads.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (data && data.status === "success") {
        form.reset();
        router.push("/thank-you");
      }
    } catch {
      alert("There was a connection issue. Please try again.");
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

                  <Button
                    type="submit"
                    disabled={loading}
                    variant="brand"
                    className="w-full h-12 font-bold uppercase tracking-widest text-xs disabled:opacity-50 hover:-translate-y-0.5 active:scale-[0.98]"
                  >
                    {loading ? "Submitting…" : "Initialize Roadmap →"}
                  </Button>
                  <p className={cn("text-center text-[11px] italic", isDark ? "text-white/20" : "text-secondary/40")}>
                    Guaranteed response within 24 hours. Your data is secure.
                  </p>
                </form>
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
                Deployment Ready
              </Badge>
              <h2 className={cn("text-4xl md:text-6xl font-display font-bold tracking-tight leading-[1.1]", isDark ? "text-white" : "text-primary")}>
                Ready to architect your <br />
                <span className="text-brand">autonomous future?</span>
              </h2>
              <p className={cn("text-lg font-medium leading-relaxed max-w-2xl mx-auto", isDark ? "text-white/50" : "text-secondary/70")}>
                Get a tailored plan and deployment timeline in days, not weeks. Start building your autonomous future today.
              </p>
              <div className="pt-4 flex justify-center">
                <Button asChild variant="brand" className="h-16 px-12 text-xl font-bold uppercase tracking-wider hover:-translate-y-1">
                  <Link href="/contact-us">Start Building Now</Link>
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
