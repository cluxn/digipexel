"use client";
import React from "react";
import { motion } from "motion/react";

interface Testimonial {
  text: string;
  image: string;
  name: string;
  role: string;
}

export const TestimonialsColumn = (props: {
  className?: string;
  testimonials: Testimonial[];
  duration?: number;
}) => {
  return (
    <div className={props.className}>
      <motion.div
        animate={{
          translateY: "-50%",
        }}
        transition={{
          duration: props.duration || 10,
          repeat: Infinity,
          ease: "linear",
          repeatType: "loop",
        }}
        className="flex flex-col gap-8 pb-8"
      >
        {[
          ...new Array(2).fill(0).map((_, index) => (
            <React.Fragment key={index}>
              {props.testimonials.map(({ text, image, name, role }, i) => (
                <div 
                  className="p-10 rounded-[2.5rem] border border-border-subtle bg-surface/30 backdrop-blur-md shadow-lg shadow-primary/5 max-w-xs w-full transition-all hover:border-brand/20 group" 
                  key={i}
                >
                  <p className="text-secondary/90 italic leading-relaxed text-sm">&quot;{text}&quot;</p>
                  <div className="flex items-center gap-4 mt-8 pt-6 border-t border-border-subtle/50">
                    <img
                      width={40}
                      height={40}
                      src={image}
                      alt={name}
                      className="h-10 w-10 rounded-full grayscale group-hover:grayscale-0 transition-all border border-border-subtle"
                    />
                    <div className="flex flex-col">
                      <div className="font-bold tracking-tight leading-5 text-primary text-sm">{name}</div>
                      <div className="text-[10px] grayscale uppercase tracking-widest text-secondary/40 font-bold leading-tight mt-1">{role}</div>
                    </div>
                  </div>
                </div>
              ))}
            </React.Fragment>
          )),
        ]}
      </motion.div>
    </div>
  );
};
