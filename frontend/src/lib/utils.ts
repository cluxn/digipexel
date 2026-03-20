import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export async function safeFetch(url: string, options?: RequestInit) {
  try {
    const res = await fetch(url, options);
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
    console.error(`Fetch to ${url} failed:`, err);
    return { status: "error", message: "Connection failed" };
  }
}
