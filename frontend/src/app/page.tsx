"use client";

import FloatingIconsHeroDemo from "@/components/blocks/floating-icons-hero-demo";
import { WorkflowDemo } from "@/components/blocks/workflow-demo";
import { LogoMarquee } from "@/components/blocks/logo-marquee";
import { ContextProblem } from "@/components/blocks/context-problem";
import { ConvergedPlatform } from "@/components/blocks/converged-platform";
import { AgencyFeatures } from "@/components/blocks/agency-features";
import { Services } from "@/components/blocks/services";
import { AgencyStats } from "@/components/blocks/agency-stats";
import { Testimonials } from "@/components/blocks/testimonials";
import { Connect } from "@/components/blocks/connect-cta";
import { Footer } from "@/components/ui/footer-section";

export default function Home() {
  return (
    <main className="min-h-screen bg-base w-full flex flex-col items-center">
      <FloatingIconsHeroDemo />
      <WorkflowDemo />
      <LogoMarquee />
      <ContextProblem />
      <ConvergedPlatform />
      <AgencyFeatures />
      <Services />
      <AgencyStats />
      <Testimonials />
      <Connect isHomepage={true} />
      <Footer />
    </main>
  );
}
