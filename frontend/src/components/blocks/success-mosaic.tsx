"use client";

import React from "react";
import { motion } from "framer-motion";
import { Play } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { safeFetch } from "@/lib/utils";

const PARTNER_LOGOS = [
  { src: "https://upload.wikimedia.org/wikipedia/commons/4/4b/Dish_Network_logo.svg", name: "Dish" },
  { src: "https://upload.wikimedia.org/wikipedia/commons/2/2b/Deloitte.svg", name: "Deloitte" },
  { src: "https://upload.wikimedia.org/wikipedia/commons/5/57/Pfizer_%282021%29.svg", name: "Pfizer" },
  { src: "https://upload.wikimedia.org/wikipedia/commons/a/af/Adobe_Experience_Cloud_logo.svg", name: "Adobe" },
  { src: "https://upload.wikimedia.org/wikipedia/commons/f/f6/American_Airlines_logo_2013.svg", name: "American Airlines" },
  { src: "https://upload.wikimedia.org/wikipedia/commons/c/ca/NBC_Universal_Logo.svg", name: "NBC Universal" },
];

const DEFAULT_VIDEOS = [
  {
    thumbnail: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=800&h=600&auto=format&fit=crop",
    label: "Scaling Enterprise AI",
  },
  {
    thumbnail: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=800&h=600&auto=format&fit=crop",
    label: "Client Voices of Success",
  },
  {
    thumbnail: "https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=800&h=600&auto=format&fit=crop",
    label: "Digital Transformation",
  },
];

// ── Grid layout (6 cols × 6 rows) ─────────────────────────────────────────
//  Col:  1    2    3    4    5    6
//  Row 1: L   [V1  V1]  L    L    L
//  Row 2: L   [V1  V1]  L    L    L
//  Row 3: L    L    L  [V2  V2]   L
//  Row 4: L    L    L  [V2  V2]   L
//  Row 5: L   [V3  V3]  L    L    L
//  Row 6: L   [V3  V3]  L    L    L
// ──────────────────────────────────────────────────────────────────────────

const VIDEO_PLACEMENTS = [
  { gridColumn: "2/4", gridRow: "1/3" }, // V1
  { gridColumn: "4/6", gridRow: "3/5" }, // V2
  { gridColumn: "2/4", gridRow: "5/7" }, // V3
];

// Explicit positions for 24 logo cells (remaining after video 2×2 spans)
const LOGO_POSITIONS: { gridColumn: string; gridRow: string }[] = [
  // Row 1 – cols 1, 4, 5, 6
  { gridColumn: "1/2", gridRow: "1/2" }, { gridColumn: "4/5", gridRow: "1/2" },
  { gridColumn: "5/6", gridRow: "1/2" }, { gridColumn: "6/7", gridRow: "1/2" },
  // Row 2 – cols 1, 4, 5, 6
  { gridColumn: "1/2", gridRow: "2/3" }, { gridColumn: "4/5", gridRow: "2/3" },
  { gridColumn: "5/6", gridRow: "2/3" }, { gridColumn: "6/7", gridRow: "2/3" },
  // Row 3 – cols 1, 2, 3, 6
  { gridColumn: "1/2", gridRow: "3/4" }, { gridColumn: "2/3", gridRow: "3/4" },
  { gridColumn: "3/4", gridRow: "3/4" }, { gridColumn: "6/7", gridRow: "3/4" },
  // Row 4 – cols 1, 2, 3, 6
  { gridColumn: "1/2", gridRow: "4/5" }, { gridColumn: "2/3", gridRow: "4/5" },
  { gridColumn: "3/4", gridRow: "4/5" }, { gridColumn: "6/7", gridRow: "4/5" },
  // Row 5 – cols 1, 4, 5, 6
  { gridColumn: "1/2", gridRow: "5/6" }, { gridColumn: "4/5", gridRow: "5/6" },
  { gridColumn: "5/6", gridRow: "5/6" }, { gridColumn: "6/7", gridRow: "5/6" },
  // Row 6 – cols 1, 4, 5, 6
  { gridColumn: "1/2", gridRow: "6/7" }, { gridColumn: "4/5", gridRow: "6/7" },
  { gridColumn: "5/6", gridRow: "6/7" }, { gridColumn: "6/7", gridRow: "6/7" },
];

interface VideoItem {
  thumbnail: string;
  label: string;
  url?: string;
}

export function SuccessMosaic() {
  const [videos, setVideos] = React.useState<VideoItem[]>(DEFAULT_VIDEOS);

  React.useEffect(() => {
    const loadData = async () => {
      try {
        const data = await safeFetch("/api/testimonials.php");
        if (data && data.status === "success" && Array.isArray(data.focus) && data.focus.length > 0) {
          const videoItems: VideoItem[] = data.focus
            .filter((f: any) => f.type === "video")
            .slice(0, 3)
            .map((f: any) => ({ thumbnail: f.thumbnail_url, label: f.label, url: f.url }));
          if (videoItems.length > 0) setVideos(videoItems);
        }
      } catch {
        // fall back to defaults
      }
    };
    loadData();
  }, []);

  return (
    <section className="py-12 relative overflow-hidden bg-white/30 border-y border-border-subtle/30">
      <div className="container mx-auto px-6 max-w-7xl">


        {/* ── Desktop grid (md+): logos + interspersed videos ── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="hidden md:grid grid-cols-6 gap-0.5 bg-border-subtle border border-border-subtle rounded-[2rem] overflow-hidden shadow-2xl shadow-black/5"
          style={{ gridTemplateRows: "repeat(6, minmax(110px, 1fr))" }}
        >
          {/* Video cells */}
          {VIDEO_PLACEMENTS.map((pos, vi) => {
            const vid = videos[vi] ?? DEFAULT_VIDEOS[vi];
            return (
              <div
                key={`video-${vi}`}
                style={pos}
                className="relative group cursor-pointer overflow-hidden bg-slate-900"
              >
                <img
                  src={vid.thumbnail}
                  alt={vid.label}
                  className="w-full h-full object-cover brightness-[0.65] group-hover:brightness-75 transition-all duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-4 text-center">
                  <div className="w-14 h-14 rounded-full bg-brand/90 backdrop-blur-sm flex items-center justify-center mb-3 group-hover:scale-110 transition-transform shadow-xl shadow-brand/40">
                    <Play className="w-6 h-6 fill-current translate-x-0.5" />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-white/90 leading-tight max-w-[130px]">
                    {vid.label}
                  </span>
                </div>
              </div>
            );
          })}

          {/* Logo cells */}
          {LOGO_POSITIONS.map((pos, li) => {
            const logo = PARTNER_LOGOS[li % PARTNER_LOGOS.length];
            return (
              <div
                key={`logo-${li}`}
                style={pos}
                className="bg-surface flex items-center justify-center p-7 group hover:bg-slate-50 transition-colors duration-300"
              >
                <img
                  src={logo.src}
                  alt={logo.name}
                  className="h-7 lg:h-9 w-auto opacity-25 grayscale group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-500"
                />
              </div>
            );
          })}
        </motion.div>

        {/* ── Mobile fallback ── */}
        <div className="md:hidden space-y-3">
          {/* Videos stacked */}
          {videos.map((vid, vi) => (
            <div key={vi} className="relative h-48 rounded-2xl overflow-hidden group cursor-pointer">
              <img src={vid.thumbnail} alt={vid.label} className="w-full h-full object-cover brightness-[0.65]" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
                <div className="w-12 h-12 rounded-full bg-brand/90 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                  <Play className="w-5 h-5 fill-current translate-x-0.5" />
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest text-white/80">{vid.label}</span>
              </div>
            </div>
          ))}
          {/* Logo grid */}
          <div className="grid grid-cols-3 gap-0.5 bg-border-subtle border border-border-subtle rounded-2xl overflow-hidden mt-4">
            {PARTNER_LOGOS.map((logo, li) => (
              <div key={li} className="bg-surface p-6 flex items-center justify-center">
                <img src={logo.src} alt={logo.name} className="h-7 w-auto opacity-30 grayscale" />
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
