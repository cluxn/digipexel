"use client";

import React from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/blocks/floating-icons-hero-demo";
import { Footer } from "@/components/ui/footer-section";

export default function ThankYouPage() {
  return (
    <main className="min-h-screen bg-base">
      <Navbar className="top-0" darkHero={false} />
      <section className="relative min-h-[90vh] flex items-center pt-32 pb-12 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(37,99,235,0.08),transparent_45%)]" />
        <div className="container mx-auto px-6 max-w-4xl relative z-10 text-center">
          <Badge variant="outline" className="section-eyebrow mb-6 mx-auto">
            Message Received
          </Badge>
          <h1 className="hero-title mb-6 leading-[1.05]">
            <span className="hero-title-accent">Transmission Success</span>.<br /> 
            Thank You for Reaching Out.
          </h1>
          <p className="section-subtitle opacity-70 mb-10">
            Your inquiry is in our secure queue. An specialized automation architect will review the details and get back to you within 24 hours.
          </p>
          <div className="flex flex-wrap justify-center gap-6">
            <Button asChild variant="brand" className="px-8 h-14 font-bold">
              <Link href="/">Back to Station</Link>
            </Button>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
