"use client";

import React from "react";
import { Badge } from "@/components/ui/badge";
import { Navbar } from "@/components/blocks/floating-icons-hero-demo";
import { Footer } from "@/components/ui/footer-section";

export default function TermsAndConditionsPage() {
  return (
    <main className="min-h-screen bg-base">
      <Navbar className="top-0" darkHero={false} />
      {/* Hero Section - Standardized for Single Screen Fit */}
      <section className="relative min-h-[85vh] flex items-center pt-32 pb-12 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(37,99,235,0.08),transparent_45%)]" />
        <div className="container mx-auto px-6 max-w-5xl relative z-10 text-center md:text-left">
          <Badge variant="outline" className="section-eyebrow mb-6">
            Terms & Conditions
          </Badge>
          <h1 className="hero-title mb-6 leading-[1.05]">
            Clear terms for <span className="hero-title-accent">reliable delivery</span><br /> 
            and long-term partnership.
          </h1>
          <p className="section-subtitle max-w-2xl opacity-70">
            These terms govern your access to Digi Pexel services, platforms, and content. Please review them to
            understand responsibilities, limitations, and service guidelines.
          </p>
          <p className="text-secondary/40 text-xs mt-8 font-bold uppercase tracking-widest">Last updated: March 15, 2026</p>
        </div>
      </section>

      <section className="py-12">
        <div className="container mx-auto px-6 max-w-5xl space-y-10">
          <div className="rounded-2xl border border-border-subtle bg-surface p-8">
            <h2 className="text-2xl font-bold text-primary mb-3">Service usage</h2>
            <p className="text-secondary text-sm leading-relaxed">
              You agree to use Digi Pexel services in compliance with applicable laws and platform policies. You are
              responsible for any content, data, or configurations you provide.
            </p>
          </div>
          <div className="rounded-2xl border border-border-subtle bg-surface p-8">
            <h2 className="text-2xl font-bold text-primary mb-3">Deliverables & timelines</h2>
            <p className="text-secondary text-sm leading-relaxed">
              Project scopes, milestones, and timelines are defined in written statements of work. Changes in scope may
              require updated timelines or fees.
            </p>
          </div>
          <div className="rounded-2xl border border-border-subtle bg-surface p-8">
            <h2 className="text-2xl font-bold text-primary mb-3">Payments</h2>
            <p className="text-secondary text-sm leading-relaxed">
              Fees, billing schedules, and payment terms are defined in your proposal or agreement. Late payments may
              pause delivery until accounts are current.
            </p>
          </div>
          <div className="rounded-2xl border border-border-subtle bg-surface p-8">
            <h2 className="text-2xl font-bold text-primary mb-3">Intellectual property</h2>
            <p className="text-secondary text-sm leading-relaxed">
              Ownership of deliverables and IP is specified in your agreement. Pre-existing tools and libraries remain
              the property of their respective owners.
            </p>
          </div>
          <div className="rounded-2xl border border-border-subtle bg-surface p-8">
            <h2 className="text-2xl font-bold text-primary mb-3">Limitations</h2>
            <p className="text-secondary text-sm leading-relaxed">
              Digi Pexel is not liable for indirect damages, data loss, or third-party platform outages. We aim for
              reliable delivery but cannot guarantee external system performance.
            </p>
          </div>
          <div className="rounded-2xl border border-border-subtle bg-surface p-8">
            <h2 className="text-2xl font-bold text-primary mb-3">Contact</h2>
            <p className="text-secondary text-sm leading-relaxed">
              For questions about these terms, email support@digipexel.com or reach out through the contact form.
            </p>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
