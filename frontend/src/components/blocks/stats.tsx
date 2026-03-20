"use client";

import React, { useEffect, useState, useRef } from "react";
import { motion, useInView, animate } from "framer-motion";

const stats = [
  {
    value: 150,
    suffix: "+",
    label: "Satisfied",
    subLabel: "SEO Clients",
  },
  {
    value: 22,
    suffix: "+",
    label: "Industries",
    subLabel: "Served",
  },
  {
    value: 117,
    suffix: "+",
    label: "AI Automation",
    subLabel: "Templates",
  },
];

function Counter({ value }: { value: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [count, setCount] = useState(0);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  useEffect(() => {
    if (isInView) {
      const controls = animate(0, value, {
        duration: 2,
        ease: "easeOut",
        onUpdate: (latest: number) => setCount(Math.round(latest)),
      });
      return () => controls.stop();
    }
  }, [isInView, value]);

  return <span ref={ref}>{count}</span>;
}

export function Statistics() {
  return (
    <section className="w-full bg-slate-950 py-32 md:py-48 relative overflow-hidden">
      {/* Decorative Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-brand/5 blur-[180px] rounded-full" />
      </div>

      <div className="container mx-auto px-12 max-w-6xl relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-24 items-center justify-center">
          {stats.map((stat, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1, duration: 0.8 }}
              className="flex items-center justify-center md:justify-start gap-8 group"
            >
              {/* Number Container */}
              <div className="flex items-baseline">
                <span className="text-6xl md:text-8xl font-display font-bold text-white tracking-tighter">
                  <Counter value={stat.value} />
                  <span className="text-brand/80 ml-1 font-medium">{stat.suffix}</span>
                </span>
              </div>

              {/* Label Container */}
              <div className="flex flex-col border-l border-white/5 pl-8 py-2">
                <span className="text-xl md:text-2xl font-bold text-white/80 leading-tight">
                  {stat.label}
                </span>
                <span className="text-xs md:text-sm font-semibold text-white/30 uppercase tracking-[0.2em] mt-2">
                  {stat.subLabel}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
