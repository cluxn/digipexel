"use client";

import React from "react";
import { API_BASE_URL } from "@/lib/constants";
import { safeFetch } from "@/lib/utils";

export function AnalyticsInjector() {
  React.useEffect(() => {
    const inject = async () => {
      const json = await safeFetch(`${API_BASE_URL}/analytics.php`);
      if (json?.status !== "success" || !json.data) return;

      const codes: Record<string, string> = json.data;
      const keys = ["google_analytics", "search_console", "custom_head_scripts"];

      keys.forEach(key => {
        const code = (codes[key] || "").trim();
        if (!code) return;

        // Create a temporary container to parse the HTML string
        const container = document.createElement("div");
        container.innerHTML = code;

        // Move all child nodes to document.head
        Array.from(container.children).forEach(el => {
          // Avoid duplicate injection — check by src/content
          const tagName = el.tagName.toLowerCase();
          if (tagName === "script") {
            const src = el.getAttribute("src");
            if (src && document.querySelector(`script[src="${src}"]`)) return;
            const newScript = document.createElement("script");
            Array.from(el.attributes).forEach(attr => newScript.setAttribute(attr.name, attr.value));
            newScript.textContent = el.textContent;
            document.head.appendChild(newScript);
          } else if (tagName === "meta") {
            const name = el.getAttribute("name");
            if (name && document.querySelector(`meta[name="${name}"]`)) return;
            document.head.appendChild(el.cloneNode(true));
          } else {
            document.head.appendChild(el.cloneNode(true));
          }
        });
      });
      // safeFetch already handles errors silently — no try/catch needed here
    };
    inject();
  }, []);

  return null; // Renders nothing — side-effect only
}
