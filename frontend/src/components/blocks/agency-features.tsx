"use client";

import React from "react";
import { Features } from "@/components/ui/features-8";
import { Badge } from "@/components/ui/badge";

export function AgencyFeatures() {
  return (
    <section className="w-full bg-base relative overflow-hidden">
      <div className="container mx-auto px-4 max-w-7xl pt-20">
        <div className="flex flex-col items-center text-center">
          <Badge variant="outline" className="section-eyebrow">
            Automation Capabilities
          </Badge>
          <h2 className="section-title mb-6">
            Built for<br /><span className="section-title-accent">Reliable Automation</span>
          </h2>
          <p className="section-subtitle max-w-2xl text-base md:text-lg">
            Beyond scripts. We deliver governed AI workflows with security, observability, and measurable outcomes.
          </p>
        </div>
      </div>
      <Features />
    </section>
  );
}
