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
            Your privacy,<br /><span className="hero-title-accent">protected by design.</span>
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
            <h2 className="text-xl font-semibold text-primary mb-3 mt-0">Information We Collect</h2>
            <p className="text-secondary text-sm leading-relaxed">
              We collect information you provide directly, including contact details, company name, and project
              requirements. We also gather usage analytics from website interactions, as well as IP address and browser
              data for security purposes.
            </p>
          </div>
          <div className="rounded-2xl border border-border-subtle bg-surface p-8">
            <h2 className="text-xl font-semibold text-primary mb-3 mt-0">How We Use Your Information</h2>
            <ul className="text-secondary text-sm space-y-2 leading-relaxed">
              <li>Deliver AI automation and digital marketing services</li>
              <li>Respond to inquiries and send relevant project proposals</li>
              <li>Improve platform performance and user experience</li>
              <li>Ensure legal compliance and fraud prevention</li>
              <li>Send service updates (opt-out available at any time)</li>
            </ul>
          </div>
          <div className="rounded-2xl border border-border-subtle bg-surface p-8">
            <h2 className="text-xl font-semibold text-primary mb-3 mt-0">AI Data Processing</h2>
            <p className="text-secondary text-sm leading-relaxed">
              Digi Pexel uses AI tools including large language models and automation platforms (n8n, Make, Zapier) to
              process workflow data. Client data processed through these systems is handled with strict access controls.
              We do not use your data to train AI models without explicit consent.
            </p>
          </div>
          <div className="rounded-2xl border border-border-subtle bg-surface p-8">
            <h2 className="text-xl font-semibold text-primary mb-3 mt-0">Third-Party Tools</h2>
            <p className="text-secondary text-sm leading-relaxed">
              We use the following third-party services that may process your data: Google Analytics (website analytics),
              Calendly (booking and scheduling), and email service providers (newsletter delivery). Each third party has
              their own privacy policy governing their data practices.
            </p>
          </div>
          <div className="rounded-2xl border border-border-subtle bg-surface p-8">
            <h2 className="text-xl font-semibold text-primary mb-3 mt-0">GDPR and Data Rights</h2>
            <p className="text-secondary text-sm leading-relaxed">
              If you are located in the EU/EEA: you have the right to access, rectify, erase, restrict, or port your
              data; you may withdraw consent at any time; you have the right to lodge a complaint with a supervisory
              authority. Contact us at info@digipexel.com to exercise these rights.
            </p>
          </div>
          <div className="rounded-2xl border border-border-subtle bg-surface p-8">
            <h2 className="text-xl font-semibold text-primary mb-3 mt-0">Data Security</h2>
            <p className="text-secondary text-sm leading-relaxed">
              We use TLS encryption for data in transit, access controls, and regular security reviews. Only authorized
              team members access client data for delivery or support purposes.
            </p>
          </div>
          <div className="rounded-2xl border border-border-subtle bg-surface p-8">
            <h2 className="text-xl font-semibold text-primary mb-3 mt-0">Data Retention</h2>
            <p className="text-secondary text-sm leading-relaxed">
              We retain client data for the duration of the service engagement and up to 3 years after project
              completion for legal and accounting purposes. Inquiry data is retained for up to 12 months.
            </p>
          </div>
          <div className="rounded-2xl border border-border-subtle bg-surface p-8">
            <h2 className="text-xl font-semibold text-primary mb-3 mt-0">Contact</h2>
            <p className="text-secondary text-sm leading-relaxed">
              For privacy requests, email us at info@digipexel.com. We aim to respond within 5 business days.
            </p>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
