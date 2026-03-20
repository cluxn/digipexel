"use client";

import * as React from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { MovingBorder } from '@/components/ui/moving-border';

interface IconProps {
  id: number;
  icon?: React.FC<React.SVGProps<SVGSVGElement>>;
  imageUrl?: string;
  label?: string;
  className: string;
}

export interface FloatingIconsHeroProps {
  title: string;
  titleHighlight?: string;
  subtitle: string;
  ctaText: string;
  ctaHref: string;
  icons: IconProps[];
  pointers?: { name: string; icon: React.ReactNode }[];
  className?: string;
}

// Single icon with spring physics repulsion
const Icon = ({
  mouseX,
  mouseY,
  iconData,
  index,
}: {
  mouseX: React.MutableRefObject<number>;
  mouseY: React.MutableRefObject<number>;
  iconData: IconProps;
  index: number;
}) => {
  const ref = React.useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 300, damping: 20 });
  const springY = useSpring(y, { stiffness: 300, damping: 20 });

  React.useEffect(() => {
    const handleMouseMove = () => {
      if (ref.current) {
        const rect = ref.current.getBoundingClientRect();
        const distance = Math.sqrt(
          Math.pow(mouseX.current - (rect.left + rect.width / 2), 2) +
            Math.pow(mouseY.current - (rect.top + rect.height / 2), 2)
        );
        if (distance < 160) {
          const angle = Math.atan2(
            mouseY.current - (rect.top + rect.height / 2),
            mouseX.current - (rect.left + rect.width / 2)
          );
          const force = (1 - distance / 160) * 60;
          x.set(-Math.cos(angle) * force);
          y.set(-Math.sin(angle) * force);
        } else {
          x.set(0);
          y.set(0);
        }
      }
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [x, y, mouseX, mouseY]);

  return (
    <motion.div
      ref={ref}
      style={{ x: springX, y: springY }}
      initial={{ opacity: 0, scale: 0.4 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.1, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className={cn('absolute', iconData.className)}
    >
      <motion.div
        animate={{ y: [0, -10, 0, 10, 0], rotate: [0, 4, 0, -4, 0] }}
        transition={{
          duration: 5 + (index * 1.3),
          repeat: Infinity,
          repeatType: 'mirror',
          ease: 'easeInOut',
        }}
      >
        {iconData.icon ? (
          /* AI tool card — premium frosted glass */
          <div
            className="flex flex-col items-center gap-3 px-5 pt-5 pb-4 rounded-2xl"
            style={{
              background: 'rgba(12, 8, 28, 0.60)',
              backdropFilter: 'blur(24px)',
              WebkitBackdropFilter: 'blur(24px)',
              border: '1px solid rgba(255,255,255,0.10)',
              boxShadow: '0 8px 32px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.10), 0 0 0 1px rgba(0,0,0,0.25)',
            }}
          >
            <div
              className="flex items-center justify-center rounded-xl"
              style={{
                width: '52px',
                height: '52px',
                background: 'rgba(255,255,255,0.07)',
                border: '1px solid rgba(255,255,255,0.12)',
                boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.15), 0 4px 12px rgba(0,0,0,0.3)',
              }}
            >
              <iconData.icon className="w-7 h-7 text-white" style={{ filter: 'drop-shadow(0 0 6px rgba(167,139,250,0.35))' }} />
            </div>
            {iconData.label && (
              <span className="text-[9px] font-black uppercase tracking-[0.18em] text-white/50 whitespace-nowrap">{iconData.label}</span>
            )}
          </div>
        ) : null}
      </motion.div>
    </motion.div>
  );
};

const FloatingIconsHero = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & FloatingIconsHeroProps
>(({ className, title, titleHighlight, subtitle, ctaText, ctaHref, icons, pointers, ...props }, ref) => {
  const mouseX = React.useRef(0);
  const mouseY = React.useRef(0);

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    mouseX.current = event.clientX;
    mouseY.current = event.clientY;
  };

  return (
    <section
      ref={ref}
      onMouseMove={handleMouseMove}
      className={cn('relative w-full min-h-screen flex items-center justify-center overflow-hidden pt-36 pb-16', className)}
      style={{ background: 'linear-gradient(135deg, #0C0618 0%, #100820 45%, #080E1C 100%)' }}
      {...props}
    >
      {/* Dot-grid mesh — very subtle */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            'radial-gradient(circle, rgba(255,255,255,0.18) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
          opacity: 0.08,
        }}
      />

      {/* Brand glow orb — top-left */}
      <div
        className="absolute pointer-events-none rounded-full"
        style={{
          top: '5%',
          left: '10%',
          width: '520px',
          height: '520px',
          background: 'radial-gradient(circle, rgba(124,58,237,0.25) 0%, transparent 70%)',
          filter: 'blur(60px)',
        }}
      />
      {/* Accent glow orb — bottom-right */}
      <div
        className="absolute pointer-events-none rounded-full"
        style={{
          bottom: '8%',
          right: '8%',
          width: '420px',
          height: '420px',
          background: 'radial-gradient(circle, rgba(16,217,176,0.18) 0%, transparent 70%)',
          filter: 'blur(60px)',
        }}
      />
      {/* Center deep glow */}
      <div
        className="absolute pointer-events-none rounded-full"
        style={{
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '700px',
          height: '300px',
          background: 'radial-gradient(ellipse, rgba(124,58,237,0.10) 0%, transparent 70%)',
          filter: 'blur(40px)',
        }}
      />

      {/* Floating icons */}
      <div className="absolute inset-0 pointer-events-none">
        {icons.map((iconData, index) => (
          <Icon key={iconData.id} mouseX={mouseX} mouseY={mouseY} iconData={iconData} index={index} />
        ))}
      </div>

      {/* ── Hero content ── */}
      <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">

        {/* Animated eyebrow tag */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 backdrop-blur px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.24em] text-white/50 mb-6"
        >
          AI Automation Agency
        </motion.div>

        {/* H1 — commanding 56–80px */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="hero-title text-white"
        >
          {title}{' '}
          {titleHighlight && (
            <span className="hero-title-accent">{titleHighlight}</span>
          )}
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="mt-5 text-lg md:text-xl text-white/50 max-w-2xl mx-auto leading-relaxed font-medium"
        >
          {subtitle}
        </motion.p>

        {/* Pointer pills */}
        {pointers && pointers.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.35 }}
            className="mt-6 flex flex-wrap items-center justify-center gap-3 md:gap-4"
          >
            {pointers.map((pointer, idx) => (
              <div key={idx} className="relative p-[1px] overflow-hidden rounded-full group">
                <div className="absolute inset-0">
                  <MovingBorder rx="50%" ry="50%" duration={3500}>
                    <div className="h-12 w-12 bg-[radial-gradient(var(--color-brand)_40%,transparent_60%)] opacity-30 group-hover:opacity-80 transition-opacity" />
                  </MovingBorder>
                </div>
                <div className="relative flex items-center gap-2.5 px-5 py-2 rounded-full bg-white/5 border border-white/8 backdrop-blur-md">
                  <div className="text-accent shrink-0">{pointer.icon}</div>
                  <span className="text-sm font-bold tracking-tight text-white/65 whitespace-nowrap">
                    {pointer.name}
                  </span>
                </div>
              </div>
            ))}
          </motion.div>
        )}

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.45 }}
          className="mt-8 flex justify-center"
        >
          <a href={ctaHref} className="btn-brand hero-btn">
            {ctaText}
          </a>
        </motion.div>
      </div>
    </section>
  );
});

FloatingIconsHero.displayName = 'FloatingIconsHero';
export { FloatingIconsHero };
