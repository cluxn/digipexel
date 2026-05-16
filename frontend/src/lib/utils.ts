import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function uploadFile(url: string, formData: FormData): Promise<Record<string, unknown>> {
  return new Promise((resolve) => {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", url);
    xhr.timeout = 30000;
    xhr.onload = () => {
      try {
        resolve(JSON.parse(xhr.responseText));
      } catch {
        resolve({ status: "error", message: "Invalid response" });
      }
    };
    xhr.onerror = () => resolve({ status: "error", message: "Upload failed" });
    xhr.ontimeout = () => resolve({ status: "error", message: "Upload timed out" });
    xhr.send(formData);
  });
}

export async function safeFetch(url: string, options?: RequestInit, timeoutMs = 8000) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const fetchPromise = fetch(url, { ...options, signal: controller.signal });
    fetchPromise.catch(() => {});
    const res = await fetchPromise;
    clearTimeout(timeoutId);
    if (!res.ok) {
      console.warn(`Fetch to ${url} returned status ${res.status}`);
      return { status: "error", message: `Server returned ${res.status}` };
    }
    const text = await res.text();
    try {
      return JSON.parse(text);
    } catch {
      console.warn(`Fetch to ${url} returned invalid JSON: ${text.slice(0, 100)}...`);
      return { status: "error", message: "Invalid server response format" };
    }
  } catch (err) {
    clearTimeout(timeoutId);
    if (err instanceof Error && err.name === "AbortError") {
      console.warn(`Fetch to ${url} timed out after ${timeoutMs}ms`);
      return { status: "error", message: "Request timed out" };
    }
    console.warn(`Fetch to ${url} failed:`, err);
    return { status: "error", message: "Connection failed" };
  }
}
