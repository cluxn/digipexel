"use client";

import React, { useEffect, useState } from "react";
import { motion } from "motion/react";
import { cn, safeFetch } from "@/lib/utils";

interface Logo {
  name: string;
  src: string;
  display_type?: 'image' | 'text' | 'both';
}

export function LogoMarquee() {
  const [logos, setLogos] = useState<Logo[]>([]);
  const [isVisible, setIsVisible] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchLogos() {
      const json = await safeFetch("/api/logos.php");
      if (json.status === "success") {
        setLogos(json.data);
        setIsVisible(json.enabled);
        setLoading(false);
        return;
      }

      // Preview Fallback
      const previewData = localStorage.getItem("PREVIEW_LOGOS");
      const previewVisible = localStorage.getItem("PREVIEW_LOGOS_ENABLED") !== "false";
      
      if (previewData) {
        setLogos(JSON.parse(previewData));
        setIsVisible(previewVisible);
      } else {
        // Default static logos for first-time preview
        const defaults: Logo[] = [
          { name: "Dish", src: "https://upload.wikimedia.org/wikipedia/commons/4/4b/Dish_Network_logo.svg", display_type: 'image' },
          { name: "Deloitte", src: "https://upload.wikimedia.org/wikipedia/commons/2/2b/Deloitte.svg", display_type: 'image' },
          { name: "Pfizer", src: "https://upload.wikimedia.org/wikipedia/commons/5/57/Pfizer_%282021%29.svg", display_type: 'image' },
        ];
        setLogos(defaults);
        setIsVisible(true);
      }
      setLoading(false);
    }
    fetchLogos();
  }, []);

  if (!isVisible || loading || logos.length === 0) return null;

  return (
    <section className="w-full py-20 border-y border-border-subtle/20 bg-base overflow-hidden">
      <div className="container mx-auto px-8 max-w-7xl flex flex-col md:flex-row items-center justify-between gap-12 md:gap-24">
        {/* Fixed Heading */}
        <div className="shrink-0 flex items-center">
          <h3 className="text-xs font-bold uppercase tracking-[0.4em] text-secondary opacity-40 whitespace-nowrap">
            Trusted By Automation Teams
          </h3>
        </div>

        {/* Scrolling Logos */}
        <div className="relative flex-1 flex items-center overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)] h-12">
          <motion.div
            className="flex items-center gap-16 md:gap-24 shrink-0"
            animate={{
              x: [0, -1000],
            }}
            transition={{
              duration: 30,
              repeat: Infinity,
              ease: "linear",
            }}
            style={{ width: "max-content" }}
          >
            {/* Double the logos for seamless loop */}
            {[...logos, ...logos, ...logos].map((logo, idx) => (
              <div key={idx} className="h-8 md:h-10 w-auto opacity-30 hover:opacity-100 transition-opacity grayscale hover:grayscale-0 duration-500 flex items-center gap-4">
                {(logo.display_type === 'image' || logo.display_type === 'both' || !logo.display_type) && logo.src && (
                  <img
                    src={logo.src}
                    alt={logo.name}
                    className="h-full w-auto object-contain pointer-events-none"
                  />
                )}
                {(logo.display_type === 'text' || logo.display_type === 'both') && (
                  <span className="text-xl md:text-2xl font-bold tracking-tighter text-primary whitespace-nowrap">
                    {logo.name}
                  </span>
                )}
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
