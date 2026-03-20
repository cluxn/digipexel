"use client";

import React from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/blocks/floating-icons-hero-demo";
import { Footer } from "@/components/ui/footer-section";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="min-h-screen bg-base">
      <Navbar className="top-0" darkHero={false} />
      <section className="relative min-h-[90vh] flex items-center pt-32 pb-12 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(37,99,235,0.08),transparent_45%)]" />
        <div className="container mx-auto px-6 max-w-4xl relative z-10 text-center">
          <Badge variant="outline" className="section-eyebrow mb-6 mx-auto">
            Something Went Wrong
          </Badge>
          <h1 className="hero-title mb-6 leading-[1.05]">
            We hit an <span className="hero-title-accent">unexpected error</span>.<br /> 
            Protocol Interrupted.
          </h1>
          <p className="section-subtitle opacity-70 mb-10">
            Please retry the action or head back to the main station. If the issue persists, our support grid is available for inquiry.
          </p>
          <div className="flex flex-wrap justify-center gap-6">
            <Button
              type="button"
              onClick={() => reset()}
              variant="brand"
              className="px-8 h-14 font-bold active:scale-95"
            >
              Retry Protocol
            </Button>
          </div>
          {error?.digest && (
            <p className="text-secondary/50 text-xs mt-6">Error ID: {error.digest}</p>
          )}
        </div>
      </section>
      <Footer />
    </main>
  );
}
