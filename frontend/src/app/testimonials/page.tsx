"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/blocks/floating-icons-hero-demo";
import { Footer } from "@/components/ui/footer-section";
import { Connect } from "@/components/blocks/connect-cta";
import { SuccessMosaic } from "@/components/blocks/success-mosaic";
import { CheckCircle2, MessageSquare, Quote } from "lucide-react";
import { safeFetch } from "@/lib/utils";

interface Testimonial {
  id: number;
  name: string;
  role: string;
  company: string;
  content: string;
  image_url: string;
  category: string;
}

const FALLBACK_TESTIMONIALS: Testimonial[] = [
  {
    id: 1,
    name: "Sarah Chen",
    role: "Product Manager",
    company: "Stripe",
    content: "The AI workflows implemented by Digi Pexel transformed our support operations. We reduced response times by 70% while improving customer satisfaction scores.",
    image_url: "https://i.pravatar.cc/150?u=sarah",
    category: "Fintech"
  },
  {
    id: 2,
    name: "Marcus Rodriguez",
    role: "Founder",
    company: "GrowthLoop",
    content: "We tried building internal AI systems for 6 months with no luck. Digi Pexel delivered a production-ready lead scoring agent in 3 weeks.",
    image_url: "https://i.pravatar.cc/150?u=marcus",
    category: "SaaS"
  },
  {
    id: 3,
    name: "Emma Watson",
    role: "Director of Marketing",
    company: "Adobe",
    content: "Their AI SEO strategy is light years ahead. We went from zero AI citations to being the top result for critical industry prompts.",
    image_url: "https://i.pravatar.cc/150?u=emma",
    category: "Enterprise"
  },
  {
    id: 4,
    name: "David Miller",
    role: "COO",
    company: "NexGen Logistics",
    content: "Automating our route optimization with AI Agents has cut fuel costs by 18% and saved countless manual planning hours.",
    image_url: "https://i.pravatar.cc/150?u=david",
    category: "Logistics"
  },
  {
    id: 5,
    name: "Lisa Wong",
    role: "Head of Success",
    company: "ScaleFlow",
    content: "Digi Pexel didn't just give us tools; they gave us a complete automation architecture that scales as we grow.",
    image_url: "https://i.pravatar.cc/150?u=lisa",
    category: "Technology"
  },
  {
    id: 6,
    name: "James Anderson",
    role: "Managing Director",
    company: "Apex Capital",
    content: "Zero-touch accounting workflows have revolutionized our month-end close. No more manual data entry errors.",
    image_url: "https://i.pravatar.cc/150?u=james",
    category: "Finance"
  },
  {
    id: 7,
    name: "Sophie Bennett",
    role: "CTO",
    company: "DataVise",
    content: "The reliability of the agents Digi Pexel built is unprecedented. We've had zero downtime in 6 months of operation.",
    image_url: "https://i.pravatar.cc/150?u=sophie",
    category: "Cloud"
  },
  {
    id: 8,
    name: "Thomas Wright",
    role: "VP Marketing",
    company: "Vividly",
    content: "Our content production quadrupled without adding a single head to the team. The AI coordination is seamless.",
    image_url: "https://i.pravatar.cc/150?u=thomas",
    category: "Marketing"
  },
  {
    id: 9,
    name: "Elena Petrova",
    role: "Strategy Lead",
    company: "GlobalNet",
    content: "Digi Pexel is the only agency we've found that actually understands how to make LLMs safe for enterprise data.",
    image_url: "https://i.pravatar.cc/150?u=elena",
    category: "Security"
  }
];

export default function TestimonialsPage() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTestimonials() {
      try {
        const data = await safeFetch("/api/testimonials.php");
        if (data && data.status === "success" && data.data && data.data.length > 0) {
          setTestimonials(data.data);
        } else {
          setTestimonials(FALLBACK_TESTIMONIALS);
        }
      } catch (err) {
        setTestimonials(FALLBACK_TESTIMONIALS);
      } finally {
        setLoading(false);
      }
    }
    fetchTestimonials();
  }, []);

  return (
    <main className="min-h-screen bg-base">
      <Navbar className="top-0" darkHero={false} />

      {/* Hero Section - Standardized for Single Screen Fit */}
      <section className="relative min-h-[70vh] flex items-center pt-28 pb-6 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(37,99,235,0.05),transparent_50%)]" />
        <div className="container mx-auto px-6 max-w-6xl relative z-10 text-center">
          <Badge variant="outline" className="section-eyebrow mb-6 mx-auto">
            Testimonials
          </Badge>
          <h1 className="hero-title mb-6 leading-[1.05]">
            The <span className="hero-title-accent">Human Side</span> of <br />
            Our Software Success Stories
          </h1>
          <p className="section-subtitle max-w-2xl mx-auto opacity-70">
            Hear from industry peers like you and discover how we co-create meaningful partnerships with each client.
          </p>
        </div>
      </section>

      <SuccessMosaic />

      {/* Testimonials Grid */}
      <section className="py-20 relative">
        <div className="container mx-auto px-6 max-w-7xl relative z-10">
          {loading ? (
            <div className="text-center py-20">
              <div className="w-10 h-10 border-4 border-brand border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p className="text-secondary/50 font-medium">Loading success stories...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {testimonials.map((t, idx) => (
                <motion.div
                  key={t.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className="group relative bg-surface border border-border-subtle rounded-[2.5rem] p-10 hover:border-brand/30 transition-all duration-500 shadow-xl shadow-primary/5 flex flex-col h-full"
                >
                  <div className="absolute top-8 right-10 text-brand/10 group-hover:text-brand/20 transition-colors">
                    <Quote className="w-12 h-12 fill-current" />
                  </div>
                  
                  <div className="flex items-center gap-2 mb-8">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className="w-4 h-4 text-brand fill-current" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>

                  <p className="text-lg leading-relaxed text-secondary italic mb-10 flex-grow font-medium">
                    &quot;{t.content}&quot;
                  </p>

                  <div className="mt-auto pt-8 border-t border-border-subtle/50 flex items-center gap-5">
                    <div className="relative w-14 h-14 rounded-2xl overflow-hidden border border-border-subtle group-hover:border-brand/30 transition-all shadow-md">
                      <img
                        src={t.image_url}
                        alt={t.name}
                        className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                      />
                    </div>
                    <div>
                      <h4 className="font-bold text-primary group-hover:text-brand transition-colors tracking-tight">
                        {t.name}
                      </h4>
                      <p className="text-[10px] font-black uppercase tracking-widest text-secondary/40 mt-1">
                        {t.role} @ {t.company}
                      </p>
                    </div>
                  </div>

                  <div className="absolute bottom-6 right-10">
                    <Badge variant="outline" className="text-[9px] uppercase tracking-widest bg-highlight opacity-50 border-none px-3">
                      {t.category}
                    </Badge>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Decorative elements */}
        <div className="absolute top-[20%] left-[5%] w-[400px] h-[400px] bg-brand/5 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute bottom-[10%] right-[5%] w-[500px] h-[500px] bg-brand/5 blur-[150px] rounded-full pointer-events-none" />

        <Connect variant="light" />
      </section>

      <Footer />
    </main>
  );
}
