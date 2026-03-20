"use client";
import React from "react";
import { motion, Transition } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { ChevronDown, ChevronRight } from "lucide-react";

import { cn } from "@/lib/utils";

const transition: Transition = {
  type: "spring",
  mass: 0.5,
  damping: 11.5,
  stiffness: 100,
  restDelta: 0.001,
  restSpeed: 0.001,
};

export const MenuItem = ({
  setActive,
  active,
  item,
  children,
}: {
  setActive: (item: string) => void;
  active: string | null;
  item: string;
  children?: React.ReactNode;
}) => {
  return (
    <div onMouseEnter={() => setActive(item)} className="relative">
      <motion.p
        transition={{ duration: 0.3 }}
        className="cursor-pointer text-sm font-medium hover:text-brand flex items-center gap-1.5 transition-colors duration-300"
      >
        <span>{item}</span>
        <ChevronDown
          className={cn(
            "h-4 w-4 transition-transform duration-200 text-secondary/70",
            active === item ? "rotate-180 text-brand" : "rotate-0"
          )}
        />
      </motion.p>
      {active !== null && children && (
        <motion.div
          initial={{ opacity: 0, scale: 0.85, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={transition}
        >
          {active === item && (
            <div className="absolute top-[calc(100%_+_1.2rem)] left-1/2 transform -translate-x-1/2 pt-4">
              <motion.div
                transition={transition}
                layoutId="active"
                className="bg-surface dark:bg-black backdrop-blur-sm rounded-2xl overflow-hidden border border-border-subtle shadow-xl"
              >
                <motion.div layout className="w-max h-full p-4">
                  {children}
                </motion.div>
              </motion.div>
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
};

export const Menu = ({
  setActive,
  children,
  className,
}: {
  setActive: (item: string | null) => void;
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <nav
      onMouseLeave={() => setActive(null)}
      className={cn(
        "relative flex items-center justify-between w-full",
        className
      )}
    >
      {children}
    </nav>
  );
};

export const ProductItem = ({
  title,
  description,
  href,
  src,
}: {
  title: string;
  description: string;
  href: string;
  src: string;
}) => {
  return (
    <Link href={href} className="flex gap-4 group/product">
      <Image
        src={src}
        width={140}
        height={70}
        alt={title}
        className="flex-shrink-0 rounded-xl shadow-xl object-cover h-[70px] w-[120px] group-hover/product:scale-105 transition-transform duration-300"
      />
      <div className="flex flex-col justify-center">
        <h4 className="text-base font-bold mb-1 text-primary dark:text-zinc-100 group-hover/product:text-brand transition-colors">
          {title}
        </h4>
        <p className="text-secondary text-xs max-w-[14rem] dark:text-zinc-400 leading-relaxed opacity-70 group-hover/product:opacity-100 transition-opacity">
          {description}
        </p>
      </div>
    </Link>
  );
};

export const HoveredLink = ({ children, ...rest }: any) => {
  return (
    <Link
      {...rest}
      className="text-secondary dark:text-zinc-300 hover:text-brand transition-colors text-sm"
    >
      {children}
    </Link>
  );
};

export const ServiceMenu = ({
  categories,
  active,
  onChange,
}: {
  categories: {
    id: string;
    label: string;
    items: { title: string; description: string; href: string; icon?: React.FC<React.SVGProps<SVGSVGElement>> }[];
  }[];
  active: string;
  onChange: (id: string) => void;
}) => {
  const current = categories.find((cat) => cat.id === active) || categories[0];

  return (
    <div className="w-[860px]">
      <div className="flex h-[420px] overflow-hidden rounded-2xl border border-border-subtle bg-surface/90">
        <div className="w-[260px] h-full border-r border-border-subtle bg-brand/5 p-4">
          <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-brand/70 px-2 pb-4">
            Services
          </div>
          <div className="flex flex-col gap-1">
            {categories.map((cat) => {
              const isActive = cat.id === active;
              return (
                <button
                  key={cat.id}
                  onMouseEnter={() => onChange(cat.id)}
                  onFocus={() => onChange(cat.id)}
                  className={cn(
                    "flex items-center justify-between rounded-xl px-4 py-3 text-left text-sm font-semibold transition-all",
                    isActive
                      ? "bg-brand text-white shadow-sm"
                      : "text-secondary hover:bg-white/70 hover:text-primary"
                  )}
                  type="button"
                >
                  <span>{cat.label}</span>
                  <ChevronRight className={cn("h-4 w-4", isActive ? "text-white/80" : "text-secondary/40")} />
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex-1 p-6 h-full flex flex-col">
          <div className="mb-6">
            <h4 className="text-base font-bold text-primary">{current.label}</h4>
          </div>
          <div className="flex-1 overflow-y-auto scroll-smooth pr-2">
            <div className="grid grid-cols-2 gap-5">
              {current.items.map((item) => (
                <Link
                  key={item.title}
                  href={item.href}
                  className="group flex gap-3 rounded-xl border border-border-subtle bg-white/70 p-4 hover:border-brand/30 hover:shadow-lg hover:shadow-brand/10 transition-all"
                >
                  <div className="mt-1 h-9 w-9 rounded-lg bg-brand/10 text-brand flex items-center justify-center flex-shrink-0">
                    {item.icon ? <item.icon className="w-4 h-4" /> : <span className="text-sm font-bold">{item.title.slice(0, 1)}</span>}
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-primary group-hover:text-brand transition-colors">
                      {item.title}
                    </div>
                    <div className="text-xs text-secondary/70 leading-relaxed mt-1">{item.description}</div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
          <div className="mt-6 pt-4 border-t border-border-subtle flex items-center justify-between">
            <div className="text-xs text-secondary/60">
              24/7 automation coverage with monitored workflows and governance.
            </div>
            <Link href="/contact-us" className="text-sm font-semibold text-brand hover:text-brand-hover">
              Talk to an Expert &gt;
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export const WorkMenu = ({
  items,
}: {
  items: { title: string; description: string; href: string; image: string }[];
}) => {
  return (
    <div className="w-[720px]">
      <div className="rounded-2xl border border-border-subtle bg-surface/90 p-6">
        <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-brand/70 mb-4">
          Work
        </div>
        <div className="grid grid-cols-2 gap-6">
          {items.map((item) => (
            <Link
              key={item.title}
              href={item.href}
              className="group rounded-2xl border border-border-subtle bg-white/70 overflow-hidden hover:border-brand/30 hover:shadow-lg hover:shadow-brand/10 transition-all"
            >
              <div className="relative h-36 overflow-hidden">
                <Image
                  src={item.image}
                  alt={item.title}
                  width={420}
                  height={220}
                  className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-4">
                <div className="text-sm font-semibold text-primary group-hover:text-brand transition-colors">
                  {item.title}
                </div>
                <div className="text-xs text-secondary/70 leading-relaxed mt-1">{item.description}</div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export const InsightsMenu = ({
  items,
}: {
  items: { title: string; description: string; href: string; icon: React.FC<React.SVGProps<SVGSVGElement>> }[];
}) => {
  return (
    <div className="w-[640px]">
      <div className="rounded-2xl border border-border-subtle bg-surface/90 p-6">
        <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-brand/70 mb-4">
          Insights
        </div>
        <div className="grid grid-cols-2 gap-4">
          {items.map((item) => (
            <Link
              key={item.title}
              href={item.href}
              className="group flex items-center gap-4 rounded-xl border border-border-subtle bg-white/70 p-4 hover:border-brand/30 hover:shadow-lg hover:shadow-brand/10 transition-all"
            >
              <div className="h-10 w-10 rounded-lg bg-brand/10 text-brand flex items-center justify-center flex-shrink-0 transition-colors group-hover:bg-brand group-hover:text-white">
                <item.icon className="w-5 h-5" />
              </div>
              <div>
                <div className="text-sm font-semibold text-primary group-hover:text-brand transition-colors">
                  {item.title}
                </div>
                <div className="text-[11px] text-secondary/60 leading-tight mt-0.5">{item.description}</div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};
