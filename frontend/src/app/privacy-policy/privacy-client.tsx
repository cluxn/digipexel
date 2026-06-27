"use client";

import React from "react";
import { Badge } from "@/components/ui/badge";
import { Navbar } from "@/components/blocks/floating-icons-hero-demo";
import { Footer } from "@/components/ui/footer-section";

const SECTIONS = [
  {
    title: "Information We Collect",
    body: "We collect information you provide directly — such as your name, email address, company, phone number, and message — when you fill out our contact form, subscribe to our newsletter, or engage with our services. We also collect basic usage analytics (page views, referral sources) through privacy-respecting tools.",
  },
  {
    title: "How We Use Your Information",
    body: "We use your information to respond to enquiries, deliver the services you requested, send relevant updates or newsletters (only with your consent), improve our website and offerings, and comply with legal obligations. We do not sell, rent, or trade your personal data to third parties.",
  },
  {
    title: "Data Storage & Security",
    body: "Your data is stored on secure servers hosted on Hostinger infrastructure located within the EU/US regions. We use industry-standard measures including HTTPS encryption, access controls, and regular security audits. Despite these measures, no method of transmission over the internet is 100% secure.",
  },
  {
    title: "Cookies",
    body: "We use essential cookies required for the website to function, and optional analytics cookies to understand how visitors use the site. You can manage cookie preferences via the cookie banner on your first visit. Disabling non-essential cookies will not affect your ability to use the site.",
  },
  {
    title: "Third-Party Services",
    body: "We use trusted third-party tools including n8n (workflow automation), Hostinger (hosting), and analytics providers. These services have their own privacy policies. We ensure any data shared with them is limited to what is necessary and handled according to their respective policies.",
  },
  {
    title: "Your Rights",
    body: "Depending on your jurisdiction, you may have the right to access, correct, delete, or export the personal data we hold about you. To exercise any of these rights, please contact us at info@digipexel.com. We will respond within 30 days.",
  },
  {
    title: "Data Retention",
    body: "We retain your data for as long as necessary to provide services and comply with legal obligations. Lead enquiry data is retained for up to 3 years. Newsletter subscriber data is retained until you unsubscribe. You may request earlier deletion at any time.",
  },
  {
    title: "Changes to This Policy",
    body: "We may update this Privacy Policy periodically. The 'Last updated' date at the top of this page reflects the most recent revision. Continued use of our website after changes constitutes acceptance of the updated policy.",
  },
  {
    title: "Contact Us",
    body: "For any privacy-related questions, requests, or concerns, please contact: Digi Pexel, Email: info@digipexel.com. We are committed to resolving any complaints about your privacy and our collection or use of your personal information.",
  },
];

export default function PrivacyClient() {
  return (
    <main className="min-h-screen bg-base">
      <Navbar className="top-0" darkHero={false} />

      {/* Hero */}
      <section className="relative min-h-[85vh] flex items-center pt-32 pb-12 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(37,99,235,0.08),transparent_45%)]" />
        <div className="container mx-auto px-6 max-w-5xl relative z-10 text-center">
          <Badge variant="outline" className="section-eyebrow mb-6">
            Privacy Policy
          </Badge>
          <h1 className="hero-title mb-6 leading-[1.05]">
            Your data,<br />
            <span className="hero-title-accent">your rights.</span>
          </h1>
          <p className="section-subtitle max-w-2xl mx-auto opacity-70">
            At Digi Pexel, we take your privacy seriously. This policy explains what we collect, why we collect it, and how we keep it safe.
          </p>
          <p className="text-secondary/40 text-xs mt-8 font-bold uppercase tracking-widest">Last updated: June 27, 2026</p>
        </div>
      </section>

      {/* Content */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6 max-w-3xl">
          <div className="space-y-10">
            {SECTIONS.map((s, i) => (
              <div key={i}>
                <h2 className="text-lg font-bold text-slate-900 mb-3">
                  {i + 1}. {s.title}
                </h2>
                <p className="text-slate-600 leading-relaxed text-[15px]">{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
