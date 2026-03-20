import React from "react";
import { motion } from "motion/react";
import { Badge } from "@/components/ui/badge";
import { TestimonialsColumn } from "@/components/ui/testimonials-columns-1";

const testimonials = [
  {
    name: "Aarav Mehta",
    role: "COO, Lumina Health",
    text: "Digi Pexel replaced manual handoffs with AI workflows. Our operations now run in half the time with clear ownership.",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150",
  },
  {
    name: "Priya Nair",
    role: "Head of Ops, Arrow Logistics",
    text: "The automation system removed our QA bottleneck. We ship faster and miss fewer deadlines.",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150",
  },
  {
    name: "Kabir Singh",
    role: "VP Growth, Northbridge SaaS",
    text: "AI-driven lead workflows turned our response time from hours to minutes. Pipeline quality improved immediately.",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150",
  },
  {
    name: "Neha Joshi",
    role: "Director, FinOps Hub",
    text: "Reconciliation workflows now run nightly without human intervention. We trust the numbers every morning.",
    image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=150",
  },
  {
    name: "Zara Sheikh",
    role: "Product Lead, CloudNorth",
    text: "The AI workflows reduced escalation volume by 60%. Our support team focuses on high-value cases now.",
    image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=150",
  },
  {
    name: "Rahul Verma",
    role: "Head of RevOps, Signalstack",
    text: "We finally have a clean pipeline and predictable follow-up. The automation stack just works.",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=150",
  },
  {
    name: "Anika Roy",
    role: "Operations Manager, Crest Labs",
    text: "Our onboarding workflows went from chaotic to repeatable. New hires ramp in days, not weeks.",
    image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=150",
  },
  {
    name: "Vikram Patel",
    role: "CEO, Atlas Retail",
    text: "Digi Pexel delivered a complete automation roadmap and executed it on time. The results are visible weekly.",
    image: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=150",
  },
  {
    name: "Amit Saxena",
    role: "CEO, TechFlow",
    text: "The automation workflows implemented by Digi Pexel save our team dozens of hours every week.",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150",
  },
];

const firstColumn = testimonials.slice(0, 3);
const secondColumn = testimonials.slice(3, 6);
const thirdColumn = testimonials.slice(6, 9);

export function Testimonials() {
  return (
    <section className="py-40 bg-base relative overflow-hidden">
      <div className="container mx-auto px-4 max-w-7xl relative z-10">
        <div className="flex flex-col items-center justify-center text-center mb-24 max-w-3xl mx-auto">
          <Badge variant="outline" className="section-eyebrow">
            Client Outcomes
          </Badge>
          <h2 className="section-title leading-tight">
            Trusted by Ops Leaders <span className="section-title-accent">Scaling with AI</span>
          </h2>
          <p className="section-subtitle text-lg text-secondary/60">
            Teams rely on Digi Pexel to automate critical workflows and deliver measurable outcomes.
          </p>
        </div>

        <div className="flex justify-center gap-8 mt-16 mt-10 [mask-image:linear-gradient(to_bottom,transparent,black_15%,black_85%,transparent)] max-h-[840px] overflow-hidden">
          <TestimonialsColumn testimonials={firstColumn} duration={25} />
          <TestimonialsColumn 
            testimonials={secondColumn} 
            className="hidden md:block" 
            duration={32} 
          />
          <TestimonialsColumn 
            testimonials={thirdColumn} 
            className="hidden lg:block" 
            duration={28} 
          />
        </div>
      </div>
      
      {/* Decorative gradient background */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-brand/5 rounded-full blur-[120px] pointer-events-none opacity-50" />
    </section>
  );
}
