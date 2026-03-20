"use client";

import * as React from 'react';
import { useState } from 'react';
import { FloatingIconsHero } from '@/components/ui/floating-icons-hero-section';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore — Youtube/Instagram/Linkedin are deprecated in lucide but still functional
import { Sparkles, Plug, Activity, Cpu, Search, Youtube, Instagram, Linkedin, Database, Workflow, Layers, Calculator, UserPlus, TrendingUp, FileText, HelpCircle, Phone } from 'lucide-react';
import { Menu, MenuItem, ServiceMenu, WorkMenu, InsightsMenu } from "@/components/ui/navbar-menu";
import { cn } from "@/lib/utils";
import Link from "next/link";

// --- Original Stylized Company Logo SVG Components ---

const IconGoogle = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M21.9999 12.24C21.9999 11.4933 21.9333 10.76 21.8066 10.0533H12.3333V14.16H17.9533C17.7333 15.3467 17.0133 16.3733 15.9666 17.08V19.68H19.5266C21.1933 18.16 21.9999 15.4533 21.9999 12.24Z" fill="#4285F4"/>
        <path d="M12.3333 22C15.2333 22 17.6866 21.0533 19.5266 19.68L15.9666 17.08C15.0199 17.7333 13.7933 18.16 12.3333 18.16C9.52659 18.16 7.14659 16.28 6.27992 13.84H2.59326V16.5133C4.38659 20.0267 8.05992 22 12.3333 22Z" fill="#34A853"/>
        <path d="M6.2799 13.84C6.07324 13.2267 5.9599 12.58 5.9599 11.92C5.9599 11.26 6.07324 10.6133 6.2799 10L2.59326 7.32667C1.86659 8.78667 1.45326 10.32 1.45326 11.92C1.45326 13.52 1.86659 15.0533 2.59326 16.5133L6.2799 13.84Z" fill="#FBBC05"/>
        <path d="M12.3333 5.68C13.8933 5.68 15.3133 6.22667 16.3866 7.24L19.6 4.02667C17.68 2.29333 15.2266 1.33333 12.3333 1.33333C8.05992 1.33333 4.38659 3.97333 2.59326 7.32667L6.27992 10C7.14659 7.56 9.52659 5.68 12.3333 5.68Z" fill="#EA4335"/>
    </svg>
);

const IconApple = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} viewBox="0 0 24 24" fill="currentColor" className="text-secondary" xmlns="http://www.w3.org/2000/svg">
      <path d="M17.482 15.334C16.274 16.146 15.238 17.554 15.238 19.138C15.238 21.694 17.062 22.846 19.33 22.99C21.682 23.122 23.53 21.73 23.53 19.138C23.53 16.57 21.742 15.334 19.438 15.334C18.23 15.334 17.482 15.334 17.482 15.334ZM19.438 1.018C17.074 1.018 15.238 2.41 15.238 4.982C15.238 7.554 17.062 8.702 19.33 8.842C21.682 8.974 23.53 7.582 23.53 4.982C23.518 2.41 21.742 1.018 19.438 1.018Z" />
    </svg>
);

const IconMicrosoft = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M11.4 2H2v9.4h9.4V2Z" fill="#F25022"/>
        <path d="M22 2h-9.4v9.4H22V2Z" fill="#7FBA00"/>
        <path d="M11.4 12.6H2V22h9.4V12.6Z" fill="#00A4EF"/>
        <path d="M22 12.6h-9.4V22H22V12.6Z" fill="#FFB900"/>
    </svg>
);

const IconFigma = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2a10 10 0 0 1 10 10 10 10 0 0 1-10 10A10 10 0 0 1 2 12 10 10 0 0 1 12 2z" fill="#2C2C2C"/>
        <path d="M12 7a5 5 0 0 1 5 5 5 5 0 0 1-5 5V7z" fill="#0ACF83"/>
        <path d="M12 12a5 5 0 0 1-5-5 5 5 0 0 1 5-5v10z" fill="#A259FF"/>
        <path d="M12 17a5 5 0 0 1-5-5h10a5 5 0 0 1-5 5z" fill="#F24E1E"/>
        <path d="M7 12a5 5 0 0 1 5 5v-5H7z" fill="#FF7262"/>
    </svg>
);

const IconGitHub = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} viewBox="0 0 24 24" fill="currentColor" className="text-secondary" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
    </svg>
);

const IconSlack = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M8.5 10a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Z" fill="#36C5F0"/><path d="M9 15.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z" fill="#2EB67D"/><path d="M14 8.5a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0Z" fill="#ECB22E"/><path d="M15.5 15a1.5 1.5 0 1 0-3 0 1.5 1.5 0 0 0 3 0Z" fill="#E01E5A"/><path d="M10 14h4v-1.5a1.5 1.5 0 0 0-1.5-1.5h-1a1.5 1.5 0 0 0-1.5 1.5V14Z" fill="#E01E5A"/><path d="M8.5 14a1.5 1.5 0 0 0 1.5 1.5h1.5v-1a1.5 1.5 0 0 0-1.5-1.5H8.5v1Z" fill="#ECB22E"/><path d="M15.5 10a1.5 1.5 0 0 0-1.5-1.5H12.5v4a1.5 1.5 0 0 0 1.5 1.5h1.5v-4Z" fill="#36C5F0"/><path d="M14 8.5a1.5 1.5 0 0 0-1.5-1.5h-1v4a1.5 1.5 0 0 0 1.5 1.5h1v-4Z" fill="#2EB67D"/>
    </svg>
);

const IconNotion = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} viewBox="0 0 24 24" fill="currentColor" className="text-secondary" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2c5.523 0 10 4.477 10 10s-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2zm.111 5.889h3.222v10.222h-3.222V7.889zm-4.333 0h3.222v10.222H7.778V7.889z"/>
    </svg>
);

// --- New Unique SVG Icons ---
const IconVercel = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} viewBox="0 0 24 24" fill="currentColor" className="text-primary" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2L2 22h20L12 2z"/>
    </svg>
);

const IconStripe = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12Z" fill="#635BFF"/><path d="M6 7H18V9H6V7Z" fill="white"/><path d="M6 11H18V13H6V11Z" fill="white"/><path d="M6 15H14V17H6V15Z" fill="white"/>
    </svg>
);

const IconDiscord = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M20.317 4.482a1.88 1.88 0 0 0-1.635-.482C17.398 3.42 16.02 3 12 3s-5.398.42-6.682 1.001a1.88 1.88 0 0 0-1.635.483c-1.875 1.2-2.325 3.61-1.568 5.711 1.62 4.47 5.063 7.8 9.885 7.8s8.265-3.33 9.885-7.8c.757-2.1-.307-4.51-1.568-5.711ZM8.45 13.4c-.825 0-1.5-.75-1.5-1.65s.675-1.65 1.5-1.65c.825 0 1.5.75 1.5 1.65s-.675 1.65-1.5 1.65Zm7.1 0c-.825 0-1.5-.75-1.5-1.65s.675-1.65 1.5-1.65c.825 0 1.5.75 1.5 1.65s-.675 1.65-1.5 1.65Z" fill="#5865F2"/>
    </svg>
);

const IconX = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} viewBox="0 0 24 24" fill="currentColor" className="text-primary" xmlns="http://www.w3.org/2000/svg">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231L18.244 2.25zM17.03 19.75h1.866L7.156 4.25H5.16l11.874 15.5z"/>
    </svg>
);

const IconSpotify = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2C6.486 2 2 6.486 2 12s4.486 10 10 10 10-4.486 10-10S17.514 2 12 2zm4.125 14.175c-.188.3-.563.413-.863.225-2.437-1.5-5.5-1.725-9.15-1.012-.338.088-.675-.15-.763-.488-.088-.337.15-.675.488-.762 3.937-.787 7.287-.525 9.975 1.125.3.187.412.562.225.862zm.9-2.7c-.225.363-.675.488-1.037.263-2.7-1.65-6.825-2.1-9.975-1.162-.413.113-.825-.15-1-.562-.15-.413.15-.825.563-1 .362-.112 3.487-.975 6.6 1.312.362.225.487.675.262 1.038v.112zm.113-2.887c-3.225-1.875-8.55-2.025-11.512-1.125-.487.15-.975-.15-1.125-.637-.15-.488.15-.975.638-1.125 3.337-.975 9.15-.787 12.825 1.312.45.263.6.825.337 1.275-.263.45-.825.6-1.275.337v-.038z" fill="#1DB954"/>
    </svg>
);

const IconDropbox = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 8l-6 4 6 4 6-4-6-4z" fill="#0061FF"/><path d="M6 12l6 4 6-4-6-4-6 4z" fill="#007BFF"/><path d="M12 16l6-4-6-4-6 4 6 4z" fill="#4DA3FF"/><path d="M18 12l-6-4-6 4 6 4 6-4z" fill="#0061FF"/>
    </svg>
);

const IconTwitch = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M2.149 0L.707 3.028v17.944h5.66v3.028h3.028l3.028-3.028h4.243l7.07-7.07V0H2.15zm19.799 13.434l-3.535 3.535h-4.95l-3.029 3.029v-3.03H5.14V1.414h16.808v12.02z" fill="#9146FF"/><path d="M15.53 5.303h2.12v6.36h-2.12v-6.36zm-4.95 0h2.12v6.36h-2.12v-6.36z" fill="#9146FF"/>
    </svg>
);

const IconLinear = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs><linearGradient id="linear-grad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#5E5CE6" /><stop offset="100%" stopColor="#2C2C2C" /></linearGradient></defs><path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm-4 9h8v2H8v-2z" fill="url(#linear-grad)"/>
    </svg>
);

const IconYouTube = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M21.582 6.186A2.482 2.482 0 0 0 19.82 4.42C18.1 4 12 4 12 4s-6.1 0-7.82.42c-.98.26-1.74.98-1.762 1.766C2 7.94 2 12 2 12s0 4.06.418 5.814c.022.786.782 1.506 1.762 1.766C6.1 20 12 20 12 20s6.1 0 7.82-.42c.98-.26 1.74-.98 1.762-1.766C22 16.06 22 12 22 12s0-4.06-.418-5.814zM9.75 15.5V8.5L15.75 12 9.75 15.5z" fill="#FF0000"/>
    </svg>
);

const IconOpenAI = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M22.28 7.51a5.45 5.45 0 0 0-1.12-1.63c-3-3-8.15-2-10.74 1a.34.34 0 0 1-.5 0C7.38 4 2.23 3 1.12 6.5s-1 8.84 2.45 11a4.85 4.85 0 0 0 1.54.8c3 1.22 6.35-.44 8.71-3.13a.34.34 0 0 1 .5 0c2.37 2.69 5.68 4.35 8.71 3.13a4.25 4.25 0 0 0 1.54-.8c3.51-2.12 3.51-7.46 2.45-11.02zM12 12a1.5 1.5 0 1 1 1.5-1.5A1.5 1.5 0 0 1 12 12z" />
  </svg>
);

const IconN8N = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="2" y="2" width="20" height="20" rx="4" fill="#FF6D5A" />
    <path d="M7 17V7h2l6 10h2V7h-2v10h-2L7 7H7v10z" fill="white" />
  </svg>
);

const IconZapier = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} viewBox="0 0 24 24" fill="#FF4F00" xmlns="http://www.w3.org/2000/svg">
    <path d="M11.625 0C10.781 0 10.093.688 10.093 1.531c0 .844.688 1.532 1.532 1.532.844 0 1.531-.688 1.531-1.532C13.156.688 12.469 0 11.625 0zM10.125 5.25L4.5 13.5h5.25L7.5 24l12-12.75h-6.75l3.75-6H10.125z" />
  </svg>
);

const IconMake = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="10" fill="#6B1DED" />
    <path d="M12 7l5 5-5 5-5-5 5-5z" fill="white" />
  </svg>
);

const IconAnthropic = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm0 18a8 8 0 1 1 8-8 8 8 0 0 1-8 8z" />
    <path d="M12 6a6 6 0 1 0 6 6 6 6 0 0 0-6-6zm0 10a4 4 0 1 1 4-4 4 4 0 0 1-4 4z" />
  </svg>
);

export default function FloatingIconsHeroDemo() {
  const pointers = [
    { name: "Remove manual handoffs", icon: <Sparkles /> },
    { name: "Connect every system", icon: <Plug /> },
    { name: "Measure ROI every week", icon: <Activity /> },
  ];

  const aiIcons = [
    // Left cluster — shifted down to clear navbar
    { id: 1, icon: IconOpenAI,    label: "OpenAI",    className: "top-[22%] left-[4%] md:top-[24%] md:left-[7%]" },
    { id: 6, icon: IconSlack,     label: "Slack",     className: "top-[67%] left-[2%] md:top-[68%] md:left-[4%]" },
    { id: 3, icon: IconZapier,    label: "Zapier",    className: "top-[44%] left-[-1%] md:top-[46%] md:left-[1%]" },
    // Right cluster — mirrored stagger
    { id: 2, icon: IconN8N,       label: "n8n",       className: "top-[22%] right-[4%] md:top-[24%] md:right-[7%]" },
    { id: 5, icon: IconAnthropic, label: "Anthropic", className: "top-[67%] right-[2%] md:top-[68%] md:right-[4%]" },
    { id: 4, icon: IconMake,      label: "Make",      className: "top-[44%] right-[-1%] md:top-[46%] md:right-[1%]" },
  ];

  return (
    <div className="relative w-full">
      <Navbar className="top-0" />
      <FloatingIconsHero
        title="Automate"
        titleHighlight="with AI that ships"
        subtitle="Digi Pexel is an AI automation agency. We design reliable workflows that move data, decisions, and actions across your stack so your team can scale without friction."
        ctaText="Book a Strategy Call"
        ctaHref="/contact-us"
        icons={aiIcons}
        pointers={pointers}
      />
    </div>
  );
}

export function Navbar({ className, darkHero = true }: { className?: string; darkHero?: boolean }) {
  const [active, setActive] = useState<string | null>(null);
  const [serviceCategory, setServiceCategory] = useState("strategic");
  const [scrolled, setScrolled] = React.useState(false);

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 72);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // On dark-hero pages: transparent at top, frosted on scroll.
  // On light-hero pages: always frosted (dark text) — never show white text.
  const isLight = !darkHero || scrolled;
  const workItems = [
    {
      title: "Testimonials",
      description: "Words of appreciation from automation leaders.",
      href: "/testimonials",
      image: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&q=80&w=800",
    },
    {
      title: "Case Studies",
      description: "Real projects, proven automation results.",
      href: "/case-studies",
      image: "https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?auto=format&fit=crop&q=80&w=800",
    },
  ];

  const serviceCategories = [
    {
      id: "strategic",
      label: "Strategic AI",
      items: [
        {
          title: "Custom AI Solutions",
          description: "Bespoke AI systems tailored to your data and workflows.",
          href: "/services/custom-ai-solutions",
          icon: Cpu,
        },
        {
          title: "AI SEO Automation",
          description: "Own the AI answer with GEO and entity authority.",
          href: "/services/ai-seo",
          icon: Search,
        },
      ],
    },
    {
      id: "social",
      label: "Social Growth",
      items: [
        {
          title: "YouTube Automation",
          description: "Automate scripting, production, and publishing.",
          href: "/services/youtube-automation",
          icon: Youtube,
        },
        {
          title: "Instagram Automation",
          description: "Always-on content and engagement workflows.",
          href: "/services/instagram-automation",
          icon: Instagram,
        },
        {
          title: "LinkedIn Automation",
          description: "Authority and lead generation at scale.",
          href: "/services/linkedin-automation",
          icon: Linkedin,
        },
      ],
    },
    {
      id: "workflow",
      label: "Automations",
      items: [
        {
          title: "Automation Flows",
          description: "Connect tools with reliable data movement.",
          href: "/services/automation-flows",
          icon: Database,
        },
        {
          title: "AI Workflows",
          description: "Decision chains with human-in-loop control.",
          href: "/services/ai-workflows",
          icon: Workflow,
        },
        {
          title: "Workflow Creation",
          description: "Design dependable operations with clear ownership.",
          href: "/services/workflow-creation",
          icon: Layers,
        },
      ],
    },
    {
      id: "operations",
      label: "Operations",
      items: [
        {
          title: "Accounting Automation",
          description: "Automated reconciliation and reporting.",
          href: "/services/accounting-bookkeeping",
          icon: Calculator,
        },
        {
          title: "Hiring Automation",
          description: "Source, screen, and schedule at scale.",
          href: "/services/hiring-recruitment",
          icon: UserPlus,
        },
        {
          title: "Sales Automation",
          description: "Lead scoring, sequences, and pipeline hygiene.",
          href: "/services/sales-automation",
          icon: TrendingUp,
        },
      ],
    },
  ];

  const insightItems = [
    {
      title: "Blogs",
      description: "Deep dives into AI strategy and implementation.",
      href: "/blog",
      icon: FileText,
    },
    {
      title: "Guides",
      description: "Step-by-step automation playbooks.",
      href: "/guides",
      icon: HelpCircle,
    },
    {
      title: "Contact Us",
      description: "Get in touch for custom workflows.",
      href: "/contact-us",
      icon: Phone,
    },
  ];
  
  return (
    <div
      className={cn("fixed inset-x-0 z-50 transition-all duration-300", className)}
      style={{
        top: 'var(--banner-height, 0px)',
        background: isLight ? 'rgba(255,255,255,0.85)' : 'transparent',
        backdropFilter: 'saturate(180%) blur(20px)',
        WebkitBackdropFilter: 'saturate(180%) blur(20px)',
        borderBottom: isLight
          ? '1px solid rgba(0,0,0,0.07)'
          : '1px solid rgba(255,255,255,0.08)',
      }}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <Menu setActive={setActive} className="border-none bg-transparent shadow-none px-0 py-4">
          {/* LOGO */}
          <Link href="/" className="font-display font-bold flex flex-shrink-0 items-center gap-2 group mr-auto">
            <span className={`text-2xl tracking-tight hidden sm:block transition-colors duration-300 ${isLight ? 'text-primary' : 'text-white'}`}>Digi Pexel</span>
          </Link>

          {/* LINKS & BUTTON GROUP */}
          <div className="flex items-center gap-8 sm:gap-12">
            <div className={`flex items-center gap-6 sm:gap-10 transition-colors duration-300 ${isLight ? 'text-primary/80' : 'text-white/80'}`}>
              <MenuItem setActive={setActive} active={active} item="Services">
                <ServiceMenu
                  categories={serviceCategories}
                  active={serviceCategory}
                  onChange={setServiceCategory}
                />
              </MenuItem>
              <MenuItem setActive={setActive} active={active} item="Work">
                <WorkMenu items={workItems} />
              </MenuItem>
              <MenuItem setActive={setActive} active={active} item="Insights">
              <InsightsMenu items={insightItems} />
            </MenuItem>
            </div>

            <div className="hidden sm:flex">
              <Link href="/contact-us" className="btn-brand nav-btn">Book a Call</Link>
            </div>
          </div>
        </Menu>
      </div>
    </div>
  );
}
