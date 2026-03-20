"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/blocks/floating-icons-hero-demo";
import { Footer } from "@/components/ui/footer-section";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Phone, Mail, MapPin, ExternalLink } from "lucide-react";

export default function ContactPage() {
  const router = useRouter();

  return (
    <main className="min-h-screen bg-base">
      <Navbar className="top-0" darkHero={false} />
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center pt-32 pb-12 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(124,58,237,0.07),transparent_50%)]" />
        <div className="container mx-auto px-6 max-w-6xl relative z-10 text-center">
          <Badge variant="outline" className="section-eyebrow mb-6 mx-auto">
            Contact Station
          </Badge>
          <h1 className="hero-title mb-6 leading-[1.05]">
            Let&apos;s Build Your <span className="hero-title-accent">Automation Stack</span>
            <br />from the Ground Up.
          </h1>
          <p className="section-subtitle max-w-2xl mx-auto mb-10 opacity-70">
            Share your goals and we will respond within 24 hours with a custom roadmap for your digital transformation.
          </p>
          <div className="flex justify-center flex-wrap gap-4">
            <Button variant="brand" className="px-8 h-14 font-bold">
              Start Your Project
            </Button>
          </div>
        </div>
      </section>


      <section className="py-20">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            <div className="rounded-[2rem] border border-border-subtle bg-surface p-8 shadow-xl">
              <form
                className="space-y-6"
                onSubmit={async (e) => {
                  e.preventDefault();
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
                    const res = await fetch("/api/leads.php", {
                      method: "POST",
                      body: JSON.stringify(formData),
                    });
                    const data = await res.json();
                    if (data.status === "success") {
                      form.reset();
                      router.push("/thank-you");
                    }
                  } catch (err) {
                    alert("There was a connection issue. Please try again.");
                  }
                }}
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label htmlFor="name" className="text-[10px] uppercase tracking-widest text-secondary/70 font-bold ml-1">
                      Full Name
                    </label>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      required
                      placeholder="John Doe"
                      className="w-full bg-base border border-border-subtle rounded-2xl px-5 py-4 text-sm focus:outline-none focus:ring-2 focus:ring-brand/10 transition-all font-medium placeholder:text-secondary/30"
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-[10px] uppercase tracking-widest text-secondary/70 font-bold ml-1">
                      Work Email
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      placeholder="john@company.com"
                      className="w-full bg-base border border-border-subtle rounded-2xl px-5 py-4 text-sm focus:outline-none focus:ring-2 focus:ring-brand/10 transition-all font-medium placeholder:text-secondary/30"
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="company" className="text-[10px] uppercase tracking-widest text-secondary/70 font-bold ml-1">
                      Company Name
                    </label>
                    <input
                      id="company"
                      name="company"
                      type="text"
                      placeholder="Acme Corp"
                      className="w-full bg-base border border-border-subtle rounded-2xl px-5 py-4 text-sm focus:outline-none focus:ring-2 focus:ring-brand/10 transition-all font-medium placeholder:text-secondary/30"
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="service" className="text-[10px] uppercase tracking-widest text-secondary/70 font-bold ml-1">
                      Service Focus
                    </label>
                    <input
                      id="service"
                      name="service"
                      type="text"
                      placeholder="AI workflows, automation, AI SEO"
                      className="w-full bg-base border border-border-subtle rounded-2xl px-5 py-4 text-sm focus:outline-none focus:ring-2 focus:ring-brand/10 transition-all font-medium placeholder:text-secondary/30"
                    />
                  </div>
                  <div className="sm:col-span-2 space-y-2">
                    <label htmlFor="contact" className="text-[10px] uppercase tracking-widest text-secondary/70 font-bold ml-1">
                      Contact Number
                    </label>
                    <input
                      id="contact"
                      name="contact"
                      type="tel"
                      placeholder="+1 (555) 000-0000"
                      className="w-full bg-base border border-border-subtle rounded-2xl px-5 py-4 text-sm focus:outline-none focus:ring-2 focus:ring-brand/10 transition-all font-medium placeholder:text-secondary/30"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label htmlFor="message" className="text-[10px] uppercase tracking-widest text-secondary/70 font-bold ml-1">
                    What are we building?
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    placeholder="Tell us about your automation goals..."
                    rows={4}
                    className="w-full bg-base border border-border-subtle rounded-2xl px-5 py-4 text-sm focus:outline-none focus:ring-2 focus:ring-brand/10 transition-all resize-none font-medium placeholder:text-secondary/30"
                  />
                </div>
                <Button
                  variant="brand"
                  className="w-full h-14 font-bold active:scale-[0.98]"
                  type="submit"
                >
                  Submit Inquiry
                </Button>
                <p className="text-[11px] text-center text-secondary/40 font-medium italic mt-6">
                  Guaranteed response within 24 hours. Your data is secure.
                </p>
              </form>
            </div>

            <div className="rounded-[2rem] border border-border-subtle bg-surface shadow-xl flex flex-col overflow-hidden">

              {/* ── Contact info header ── */}
              <div className="px-8 pt-8 pb-6">
                <h3 className="text-xl font-bold text-primary mb-1">Get in Touch</h3>
                <p className="text-secondary/60 text-sm">Our team is ready to help. Reach out through any channel below.</p>
              </div>

              {/* ── Contact detail rows ── */}
              <div className="px-8 pb-6 flex flex-col gap-3">

                {/* Phone */}
                <a
                  href="tel:+918299406767"
                  className="group flex items-center gap-4 rounded-2xl border border-border-subtle bg-base px-5 py-3.5 transition-all hover:border-brand/30 hover:shadow-sm"
                >
                  <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-brand/8 border border-brand/12">
                    <Phone className="h-4 w-4 text-brand/70" strokeWidth={1.6} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] font-medium uppercase tracking-wider text-secondary/40 mb-0.5">Phone</p>
                    <p className="text-sm font-normal text-primary/80 group-hover:text-brand transition-colors truncate">
                      +91 8299406767
                    </p>
                  </div>
                </a>

                {/* Email */}
                <a
                  href="mailto:info@digipexel.com"
                  className="group flex items-center gap-4 rounded-2xl border border-border-subtle bg-base px-5 py-3.5 transition-all hover:border-brand/30 hover:shadow-sm"
                >
                  <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-brand/8 border border-brand/12">
                    <Mail className="h-4 w-4 text-brand/70" strokeWidth={1.6} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] font-medium uppercase tracking-wider text-secondary/40 mb-0.5">Email</p>
                    <p className="text-sm font-normal text-primary/80 group-hover:text-brand transition-colors truncate">
                      info@digipexel.com
                    </p>
                  </div>
                </a>

                {/* Address */}
                <a
                  href="https://maps.app.goo.gl/sEVWaEjJcjZexGTQ9"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-start gap-4 rounded-2xl border border-border-subtle bg-base px-5 py-3.5 transition-all hover:border-brand/30 hover:shadow-sm"
                >
                  <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-brand/8 border border-brand/12 mt-0.5">
                    <MapPin className="h-4 w-4 text-brand/70" strokeWidth={1.6} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[10px] font-medium uppercase tracking-wider text-secondary/40 mb-0.5">Address</p>
                    <p className="text-sm font-normal text-primary/80 group-hover:text-brand transition-colors leading-relaxed">
                      457/10A, 117/Q, Indrapuri Road, Sharda Nagar,<br />
                      Kanpur, Uttar Pradesh 208025
                    </p>
                  </div>
                  <ExternalLink className="h-3.5 w-3.5 text-secondary/25 flex-shrink-0 mt-1 group-hover:text-brand/40 transition-colors" />
                </a>
              </div>

              {/* ── Google Maps embed ── */}
              <div className="flex-1 min-h-[240px] border-t border-border-subtle">
                <iframe
                  title="Digi Pexel Office Location"
                  src="https://www.google.com/maps/embed?pb=!1m26!1m12!1m3!1d8493.997770320004!2d80.28159263314232!3d26.478730371116587!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!4m11!3e6!4m3!3m2!1d26.4785154!2d80.2896512!4m5!1s0x399c3907361d9dcb%3A0x5810d45fcc75b9b3!2s457%2F10A%2C%20117%2FQ%2C%20Indrapuri%20Road%2C%20Sharda%20Nagar%2C%20Kanpur%2C%20Uttar%20Pradesh%20208025!3m2!1d26.484149!2d80.2831573!5e0!3m2!1sen!2sin!4v1756625993253!5m2!1sen!2sin"
                  className="w-full h-full min-h-[240px] border-0"
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
