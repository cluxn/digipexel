"use client";

import React from "react";
import { LogoCloud } from "@/components/ui/logo-cloud-2";
import { Badge } from "@/components/ui/badge";

export function ConvergedPlatform() {
  return (
    <section className="w-full py-32 bg-base overflow-hidden relative">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex flex-col items-center text-center mb-20">
          <Badge variant="outline" className="section-eyebrow">
            Connected Ecosystem
          </Badge>
          <h2 className="section-title mb-6 max-w-4xl">
            Every service Every tool<br />
            <span className="section-title-accent">One unified agency</span>
          </h2>
          <p className="section-subtitle max-w-2xl">
            From AI agents and SEO to web apps and brand identity — we connect your entire growth stack and run it end-to-end.
          </p>
        </div>

        <div className="relative">
          {/* Subtle background glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] bg-brand/5 blur-[120px] rounded-full pointer-events-none" />
          
          <div className="relative z-10 mx-auto max-w-4xl border border-border-subtle rounded-[2.5rem] overflow-hidden shadow-2xl">
             <LogoCloud className="border-none" />
          </div>
          
          <div className="mt-12 text-center" />
        </div>
      </div>
    </section>
  );
}
