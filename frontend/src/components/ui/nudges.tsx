"use client";

import React from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import { safeFetch } from "@/lib/utils";
import { API_BASE_URL } from "@/lib/constants";

type NudgeConfig = {
  banner: {
    enabled: boolean;
    text: string;
    ctaLabel: string;
    ctaLink: string;
  };
  popup: {
    enabled: boolean;
    title: string;
    body: string;
    ctaLabel: string;
    ctaLink: string;
    delayMs: number;
  };
  exitPopup: {
    enabled: boolean;
    title: string;
    body: string;
    ctaLabel: string;
    ctaLink: string;
  };
};

const DEFAULT_CONFIG: NudgeConfig = {
  banner: {
    enabled: true,
    text: "AI automation audit slots open for next week.",
    ctaLabel: "Book a Call",
    ctaLink: "/contact-us",
  },
  popup: {
    enabled: true,
    title: "Ready to automate your ops?",
    body: "Get a 20-minute discovery call and a quick automation roadmap.",
    ctaLabel: "Schedule a Call",
    ctaLink: "/contact-us",
    delayMs: 5000,
  },
  exitPopup: {
    enabled: true,
    title: "Before you go",
    body: "Want a quick audit checklist? We’ll send it in minutes.",
    ctaLabel: "Get the Checklist",
    ctaLink: "/contact-us",
  },
};

const BANNER_DISMISS_KEY = "DP_BANNER_DISMISSED";
const POPUP_DISMISS_KEY = "DP_POPUP_DISMISSED";
const EXIT_DISMISS_KEY = "DP_EXIT_DISMISSED";

export function Nudges() {
  const [config, setConfig] = React.useState<NudgeConfig>(DEFAULT_CONFIG);
  const [showBanner, setShowBanner] = React.useState(false);
  const [showPopup, setShowPopup] = React.useState(false);
  const [showExit, setShowExit] = React.useState(false);

  React.useEffect(() => {
    const loadFromDB = async () => {
      const json = await safeFetch(`${API_BASE_URL}/banners.php`);
      if (json?.status === "success" && json.data) {
        const d = json.data;
        // Map from DB shape (exit_popup snake_case) to internal shape (exitPopup camelCase)
        const cfg: NudgeConfig = {
          banner: {
            enabled: d.banner?.enabled ?? DEFAULT_CONFIG.banner.enabled,
            text: d.banner?.text ?? DEFAULT_CONFIG.banner.text,
            ctaLabel: d.banner?.ctaLabel ?? DEFAULT_CONFIG.banner.ctaLabel,
            ctaLink: d.banner?.ctaLink ?? DEFAULT_CONFIG.banner.ctaLink,
          },
          popup: {
            enabled: d.popup?.enabled ?? DEFAULT_CONFIG.popup.enabled,
            title: d.popup?.title ?? DEFAULT_CONFIG.popup.title,
            body: d.popup?.body ?? DEFAULT_CONFIG.popup.body,
            ctaLabel: d.popup?.ctaLabel ?? DEFAULT_CONFIG.popup.ctaLabel,
            ctaLink: d.popup?.ctaLink ?? DEFAULT_CONFIG.popup.ctaLink,
            delayMs: d.popup?.delayMs ?? DEFAULT_CONFIG.popup.delayMs,
          },
          exitPopup: {
            enabled: d.exit_popup?.enabled ?? DEFAULT_CONFIG.exitPopup.enabled,
            title: d.exit_popup?.title ?? DEFAULT_CONFIG.exitPopup.title,
            body: d.exit_popup?.body ?? DEFAULT_CONFIG.exitPopup.body,
            ctaLabel: d.exit_popup?.ctaLabel ?? DEFAULT_CONFIG.exitPopup.ctaLabel,
            ctaLink: d.exit_popup?.ctaLink ?? DEFAULT_CONFIG.exitPopup.ctaLink,
          },
        };
        setConfig(cfg);

        // Now handle show/dismiss logic exactly as before
        const bannerDismissed = localStorage.getItem(BANNER_DISMISS_KEY) === "true";
        const popupDismissed = localStorage.getItem(POPUP_DISMISS_KEY) === "true";
        const exitDismissed = localStorage.getItem(EXIT_DISMISS_KEY) === "true";

        if (cfg.banner.enabled && !bannerDismissed) setShowBanner(true);
        if (cfg.popup.enabled && !popupDismissed) {
          const timer = setTimeout(() => setShowPopup(true), cfg.popup.delayMs || 5000);
          return () => clearTimeout(timer);
        }
        if (cfg.exitPopup.enabled && popupDismissed && !exitDismissed) {
          const onExit = (e: MouseEvent) => {
            if (e.clientY <= 0) { setShowExit(true); window.removeEventListener("mousemove", onExit); }
          };
          window.addEventListener("mousemove", onExit);
          return () => window.removeEventListener("mousemove", onExit);
        }
      }
      // safeFetch returns { status: "error" } on failure — fall back to DEFAULT_CONFIG (all disabled)
    };
    loadFromDB();
  }, []);

  const closeBanner = () => {
    setShowBanner(false);
    localStorage.setItem(BANNER_DISMISS_KEY, "true");
  };

  const closePopup = () => {
    setShowPopup(false);
    localStorage.setItem(POPUP_DISMISS_KEY, "true");
  };

  const closeExit = () => {
    setShowExit(false);
    localStorage.setItem(EXIT_DISMISS_KEY, "true");
  };

  React.useEffect(() => {
    if (showBanner) {
      document.documentElement.style.setProperty('--banner-height', '36px');
    } else {
      document.documentElement.style.setProperty('--banner-height', '0px');
    }
  }, [showBanner]);

  return (
    <>
      {showBanner && (
        <div className="fixed top-0 inset-x-0 z-[60] bg-brand text-white h-9">
          <div className="container mx-auto h-full px-6 flex items-center justify-center text-xs font-semibold tracking-wide relative">
            <div className="flex items-center gap-2">
              <span>{config.banner.text}</span>
              <Link href={config.banner.ctaLink} className="underline underline-offset-4 ml-1">
                {config.banner.ctaLabel}
              </Link>
            </div>
            <button onClick={closeBanner} className="absolute right-6 hover:text-white/80">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {showPopup && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
          <div className="w-full max-w-md rounded-[2rem] border border-border-subtle bg-surface p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <Badge
                variant="outline"
                className="rounded-full border-brand/10 bg-brand/5 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-brand/60"
              >
                Quick Nudge
              </Badge>
              <button onClick={closePopup} className="text-secondary/50 hover:text-secondary">
                <X className="w-4 h-4" />
              </button>
            </div>
            <h3 className="text-xl font-bold text-primary mb-2">{config.popup.title}</h3>
            <p className="text-sm text-secondary/70 mb-6">{config.popup.body}</p>
            <div className="flex items-center gap-3">
              <Link
                href={config.popup.ctaLink}
                className="btn-brand nav-btn"
              >
                {config.popup.ctaLabel}
              </Link>
              <button onClick={closePopup} className="text-sm text-secondary/60">
                Not now
              </button>
            </div>
          </div>
        </div>
      )}

      {showExit && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
          <div className="w-full max-w-md rounded-[2rem] border border-border-subtle bg-surface p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <Badge
                variant="outline"
                className="rounded-full border-brand/10 bg-brand/5 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-brand/60"
              >
                Before You Go
              </Badge>
              <button onClick={closeExit} className="text-secondary/50 hover:text-secondary">
                <X className="w-4 h-4" />
              </button>
            </div>
            <h3 className="text-xl font-bold text-primary mb-2">{config.exitPopup.title}</h3>
            <p className="text-sm text-secondary/70 mb-6">{config.exitPopup.body}</p>
            <div className="flex items-center gap-3">
              <Link
                href={config.exitPopup.ctaLink}
                className="btn-brand nav-btn"
              >
                {config.exitPopup.ctaLabel}
              </Link>
              <button onClick={closeExit} className="text-sm text-secondary/60">
                Maybe later
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
