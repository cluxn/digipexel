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
        <div className="container mx-auto px-6 max-w-5xl relative z-10 text-center md:text-center">
          <Badge variant="outline" className="section-eyebrow mb-6">
            Terms & Conditions
          </Badge>
          <h1 className="hero-title mb-6 leading-[1.05]">
            Clear terms for <span className="hero-title-accent">reliable delivery</span><br />
            and long-term partnership.
          </h1>
          <p className="section-subtitle max-w-2xl mx-auto opacity-70">
            These terms govern your access to Digi Pexel services, platforms, and content. Please review them to
            understand responsibilities, limitations, and service guidelines.
          </p>
          <p className="text-secondary/40 text-xs mt-8 font-bold uppercase tracking-widest">Last updated: March 15, 2026</p>
        </div>
      </section>

      <section className="py-12">
        <div className="container mx-auto px-6 max-w-5xl space-y-10">
          <div className="rounded-2xl border border-border-subtle bg-surface p-8">
            <h2 className="text-xl font-semibold text-primary mb-3 mt-0">Service Usage</h2>
            <p className="text-secondary text-sm leading-relaxed">
              You agree to use Digi Pexel services in compliance with applicable laws. You are responsible for content,
              data, and configurations you provide. Prohibited activities include illegal use, misrepresentation, and
              reverse-engineering our proprietary systems.
            </p>
          </div>
          <div className="rounded-2xl border border-border-subtle bg-surface p-8">
            <h2 className="text-xl font-semibold text-primary mb-3 mt-0">Deliverables and Timelines</h2>
            <p className="text-secondary text-sm leading-relaxed">
              Project scope, milestones, and timelines are defined in written statements of work. Scope changes require a
              written change order. Delays caused by the client (late approvals, missing assets) adjust timelines
              accordingly and do not constitute breach by Digi Pexel.
            </p>
          </div>
          <div className="rounded-2xl border border-border-subtle bg-surface p-8">
            <h2 className="text-xl font-semibold text-primary mb-3 mt-0">Intellectual Property</h2>
            <p className="text-secondary text-sm leading-relaxed">
              Upon full payment, the client owns all custom deliverables created specifically for their project.
              Digi Pexel retains ownership of pre-existing tools, frameworks, and reusable components embedded in
              deliverables (licensed for client use). Third-party tools and libraries remain under their respective
              licenses.
            </p>
          </div>
          <div className="rounded-2xl border border-border-subtle bg-surface p-8">
            <h2 className="text-xl font-semibold text-primary mb-3 mt-0">Payments</h2>
            <p className="text-secondary text-sm leading-relaxed">
              Fees and billing schedules are defined in your proposal or agreement. A deposit (typically 50%) is due
              before work commences. Remaining balance is due on delivery or per milestone schedule. Late payments
              exceeding 14 days may pause active delivery.
            </p>
          </div>
          <div className="rounded-2xl border border-border-subtle bg-surface p-8">
            <h2 className="text-xl font-semibold text-primary mb-3 mt-0">Service Level and Liability</h2>
            <p className="text-secondary text-sm leading-relaxed">
              Digi Pexel targets response times of 24–48 hours for support inquiries during active projects. We are not
              liable for indirect or consequential damages, data loss caused by third-party platforms, outages of
              external tools (Google, Meta, n8n, etc.), or results dependent on client-provided assets or access. Our
              maximum liability is limited to fees paid in the 30 days preceding the claim.
            </p>
          </div>
          <div className="rounded-2xl border border-border-subtle bg-surface p-8">
            <h2 className="text-xl font-semibold text-primary mb-3 mt-0">Confidentiality</h2>
            <p className="text-secondary text-sm leading-relaxed">
              Both parties agree to keep proprietary information, business strategies, and client data confidential
              during and for 2 years after the project. This obligation does not apply to publicly available information.
            </p>
          </div>
          <div className="rounded-2xl border border-border-subtle bg-surface p-8">
            <h2 className="text-xl font-semibold text-primary mb-3 mt-0">Termination</h2>
            <p className="text-secondary text-sm leading-relaxed">
              Either party may terminate the engagement with 14 days written notice. The client is responsible for fees
              covering work completed through the termination date. Pre-paid fees for unstarted work are refunded within
              14 days.
            </p>
          </div>
          <div className="rounded-2xl border border-border-subtle bg-surface p-8">
            <h2 className="text-xl font-semibold text-primary mb-3 mt-0">Governing Law</h2>
            <p className="text-secondary text-sm leading-relaxed">
              These terms are governed by applicable laws. Disputes are first subject to good-faith negotiation, then
              mediation. For questions or disputes, contact us at info@digipexel.com.
            </p>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
