"use client";

import React, { useEffect, useState } from "react";
import { motion } from "motion/react";
import { Badge } from "@/components/ui/badge";
import { TestimonialsColumn } from "@/components/ui/testimonials-columns-1";
import { safeFetch } from "@/lib/utils";
import { API_BASE_URL } from "@/lib/constants";
import { FALLBACK_TESTIMONIALS } from "@/lib/testimonials-data";

interface ApiTestimonial {
  id: number;
  name: string;
  role: string;
  company: string;
  content: string;
  image_url: string;
  display_context: string;
}

interface ColumnTestimonial {
  name: string;
  role: string;
  text: string;
  image: string;
}

// Map shared fallback format → column display format
const FALLBACK_COLUMN: ColumnTestimonial[] = FALLBACK_TESTIMONIALS.map((t) => ({
  name: t.name,
  role: `${t.role}, ${t.company}`,
  text: t.content,
  image: t.image_url,
}));

export function Testimonials() {
  const [allTestimonials, setAllTestimonials] = useState<ColumnTestimonial[]>(FALLBACK_COLUMN);

  useEffect(() => {
    async function fetchTestimonials() {
      const json = await safeFetch(`${API_BASE_URL}/testimonials.php`);
      if (json.status === "success" && Array.isArray(json.data) && json.data.length > 0) {
        // Filter to homepage context only, then take first 9
        const mapped: ColumnTestimonial[] = (json.data as ApiTestimonial[])
          .filter((t) => (t.display_context || '').split(',').map(s => s.trim()).includes('homepage'))
          .slice(0, 9)
          .map((t) => ({
            name:  t.name,
            role:  t.role + (t.company ? `, ${t.company}` : ""),
            text:  t.content,
            image: t.image_url,
          }));
        setAllTestimonials(mapped);
      }
      // On failure: keep FALLBACK_TESTIMONIALS in state
    }
    fetchTestimonials();
  }, []);

  const firstColumn  = allTestimonials.slice(0, 3);
  const secondColumn = allTestimonials.slice(3, 6);
  const thirdColumn  = allTestimonials.slice(6, 9);

  return (
    <section className="py-40 bg-base relative overflow-hidden">
      <div className="container mx-auto px-4 max-w-7xl relative z-10">
        <div className="flex flex-col items-center justify-center text-center mb-24 max-w-3xl mx-auto">
          <Badge variant="outline" className="section-eyebrow mb-6">
            Client Success Stories
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
