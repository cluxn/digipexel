// frontend/src/lib/api.ts
import { safeFetch } from "./utils";
import { API_BASE_URL as API_BASE } from "./constants";

export const api = {
  get: async (endpoint: string, params?: Record<string, string>) => {
    let url = `${API_BASE}/${endpoint}.php`;
    if (params) {
      const search = new URLSearchParams(params).toString();
      url += `?${search}`;
    }
    return safeFetch(url);
  },
  post: async (endpoint: string, body: any) => {
    return safeFetch(`${API_BASE}/${endpoint}.php`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
  },
};

export const endpoints = {
  blogs: "blogs",
  caseStudies: "case_studies",
  guides: "guides",
  leads: "leads",
  logos: "logos",
  testimonials: "testimonials",
};
