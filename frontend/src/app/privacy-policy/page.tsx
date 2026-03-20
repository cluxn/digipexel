"use client";

import React from "react";
import { Badge } from "@/components/ui/badge";
import { Navbar } from "@/components/blocks/floating-icons-hero-demo";
import { Footer } from "@/components/ui/footer-section";

export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen bg-base">
      <Navbar className="top-0" darkHero={false} />
      {/* Hero Section - Standardized for Single Screen Fit */}
      <section className="relative min-h-[85vh] flex items-center pt-32 pb-12 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(37,99,235,0.08),transparent_45%)]" />
        <div className="container mx-auto px-6 max-w-5xl relative z-10 text-center md:text-center">
          <Badge variant="outline" className="section-eyebrow mb-6">
            Privacy Policy
          </Badge>
          <h1 className="hero-title mb-6 leading-[1.05]">
            Your privacy, <span className="hero-title-accent">protected by design</span><br />
            in every automation.
          </h1>
          <p className="section-subtitle max-w-2xl mx-auto opacity-70">
            This policy explains how Digi Pexel collects, uses, and safeguards information when you engage with our
            services, website, and automation systems.
          </p>
          <p className="text-secondary/40 text-xs mt-8 font-bold uppercase tracking-widest">Last updated: March 15, 2026</p>
        </div>
      </section>

      <section className="py-12">
        <div className="container mx-auto px-6 max-w-5xl space-y-10">
          <div className="rounded-2xl border border-border-subtle bg-surface p-8">
            <h2 className="text-2xl font-bold text-primary mb-3">Information we collect</h2>
            <p className="text-secondary text-sm leading-relaxed">
              We collect information you provide directly, such as contact details, company data, and project
              requirements. We also gather usage data from our website and platforms to improve performance, security,
              and user experience.
            </p>
          </div>
          <div className="rounded-2xl border border-border-subtle bg-surface p-8">
            <h2 className="text-2xl font-bold text-primary mb-3">How we use information</h2>
            <ul className="text-secondary text-sm space-y-2">
              <li>Deliver and support AI automation services</li>
              <li>Respond to inquiries and provide proposals</li>
              <li>Improve product performance and reliability</li>
              <li>Maintain compliance, security, and fraud prevention</li>
            </ul>
          </div>
          <div className="rounded-2xl border border-border-subtle bg-surface p-8">
            <h2 className="text-2xl font-bold text-primary mb-3">Data security</h2>
            <p className="text-secondary text-sm leading-relaxed">
              We use access controls, encryption at rest and in transit, and strict vendor reviews to protect sensitive
              data. Only authorized team members may access client data for delivery or support.
            </p>
          </div>
          <div className="rounded-2xl border border-border-subtle bg-surface p-8">
            <h2 className="text-2xl font-bold text-primary mb-3">Your choices</h2>
            <p className="text-secondary text-sm leading-relaxed">
              You may request access, updates, or deletion of your data at any time. Contact us to review your data
              profile or change communication preferences.
            </p>
          </div>
          <div className="rounded-2xl border border-border-subtle bg-surface p-8">
            <h2 className="text-2xl font-bold text-primary mb-3">Contact</h2>
            <p className="text-secondary text-sm leading-relaxed">
              For privacy questions, email us at info@digipexel.com or submit a request through the contact form.
            </p>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
