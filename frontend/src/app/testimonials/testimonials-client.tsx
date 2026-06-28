"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Navbar } from "@/components/blocks/floating-icons-hero-demo";
import { Footer } from "@/components/ui/footer-section";
import { Connect } from "@/components/blocks/connect-cta";
import { Quote } from "lucide-react";
import { safeFetch } from "@/lib/utils";
import { API_BASE_URL } from "@/lib/constants";
import { testimonialsPageItems } from "@/lib/testimonials-data";

interface Testimonial {
  id: number;
  name: string;
  role: string;
  company: string;
  content: string;
  image_url: string;
  category: string;
  star_rating: number;
  video_url: string;
  logo_url: string;
  display_context: string;
}

const FALLBACK_TESTIMONIALS: Testimonial[] = testimonialsPageItems().map((t, i) => ({
  id: i + 1,
  name: t.name,
  role: t.role,
  company: t.company,
  content: t.content,
  image_url: t.image_url,
  category: t.category,
  star_rating: t.star_rating,
  video_url: t.video_url,
  logo_url: t.logo_url,
  display_context: t.display_context,
}));

export default function TestimonialsPage() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTestimonials() {
      try {
        const data = await safeFetch(`${API_BASE_URL}/testimonials.php`);
        if (data && data.status === "success" && Array.isArray(data.data) && data.data.length > 0) {
          const filtered = data.data.filter((t: Testimonial) =>
            (t.display_context || '').split(',').map((s: string) => s.trim()).includes('testimonials-page')
          );
          setTestimonials(filtered.length > 0 ? filtered : data.data);
        } else {
          setTestimonials(FALLBACK_TESTIMONIALS);
        }
      } catch {
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

      {/* Hero Section */}
      <section className="relative min-h-[70vh] flex items-center pt-28 pb-6 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(37,99,235,0.05),transparent_50%)]" />
        <div className="container mx-auto px-6 max-w-6xl relative z-10 text-center">
          <Badge variant="outline" className="section-eyebrow mb-6 mx-auto">
            Testimonials
          </Badge>
          <h1 className="hero-title mb-6 leading-[1.05]">
            The Human Side of<br />
            <span className="hero-title-accent">Our Success Stories</span>
          </h1>
          <p className="section-subtitle max-w-2xl mx-auto opacity-70">
            Hear from industry peers like you and discover how we co-create meaningful partnerships with each client.
          </p>
        </div>
      </section>

      {/* Testimonials Grid */}
      <section className="py-20 relative">
        <div className="container mx-auto px-6 max-w-7xl relative z-10">
          {loading ? (
            <div className="text-center py-20">
              <div className="w-10 h-10 border-4 border-brand border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p className="text-secondary/50 font-medium">Loading success stories...</p>
            </div>
          ) : (
            <div className={[
                "grid grid-cols-1 md:grid-cols-2 gap-8 mx-auto",
                testimonials.length >= 3 ? "lg:grid-cols-3" :
                testimonials.length === 2 ? "lg:grid-cols-2 max-w-3xl" :
                "lg:grid-cols-1 max-w-lg"
              ].join(" ")}>
              {testimonials.map((t, idx) => (
                <motion.div
                  key={t.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className="group relative bg-surface border border-border-subtle rounded-[2.5rem] p-10 hover:border-brand/30 transition-all duration-500 shadow-xl shadow-primary/5 flex flex-col h-full"
                >
                  {/* Quote icon decorative */}
                  <div className="absolute top-8 right-10 text-brand/10 group-hover:text-brand/20 transition-colors">
                    <Quote className="w-12 h-12 fill-current" />
                  </div>

                  {/* Star rating */}
                  {t.star_rating > 0 && (
                    <div className="flex items-center gap-1 mb-6">
                      {[...Array(5)].map((_, i) => (
                        <svg key={i} className={`w-4 h-4 ${i < t.star_rating ? 'text-amber-400 fill-current' : 'text-slate-200 fill-current'}`} viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                  )}

                  {/* Video embed if video_url present */}
                  {t.video_url && (
                    <div className="aspect-video rounded-2xl overflow-hidden mb-6 bg-slate-100">
                      <iframe
                        src={t.video_url}
                        className="w-full h-full"
                        allowFullScreen
                        title={`Testimonial from ${t.name}`}
                      />
                    </div>
                  )}

                  {/* Quote text */}
                  <p className="text-lg leading-relaxed text-secondary italic mb-10 flex-grow font-medium">
                    &quot;{t.content}&quot;
                  </p>

                  {/* Divider + footer */}
                  <div className="mt-auto pt-8 border-t border-border-subtle/50 flex items-center gap-5">
                    <div className="relative w-14 h-14 rounded-2xl overflow-hidden border border-border-subtle group-hover:border-brand/30 transition-all shadow-md shrink-0">
                      <img
                        src={t.image_url}
                        alt={t.name}
                        className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                      />
                    </div>
                    <div className="flex-grow min-w-0">
                      <h4 className="font-bold text-primary group-hover:text-brand transition-colors tracking-tight truncate">
                        {t.name}
                      </h4>
                      <p className="text-[10px] font-black uppercase tracking-widest text-secondary/40 mt-1 truncate">
                        {t.role} @ {t.company}
                      </p>
                    </div>
                    {t.logo_url && (
                      <img
                        src={t.logo_url}
                        alt={t.company}
                        className="h-6 w-auto object-contain grayscale opacity-60 group-hover:opacity-100 transition-opacity ml-auto shrink-0"
                      />
                    )}
                  </div>

                  {/* Category badge */}
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
