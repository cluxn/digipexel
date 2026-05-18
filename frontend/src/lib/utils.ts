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

// Uses XHR instead of fetch to avoid interference from browser extensions that
// wrap window.fetch and create unhandled internal promise rejections.
export function fireWebhook(url: string, data: Record<string, unknown>): void {
  fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  }).catch(() => {});
}

export function safeFetch(url: string, options?: RequestInit, timeoutMs = 8000): Promise<Record<string, unknown>> {
  return new Promise((resolve) => {
    try {
      const xhr = new XMLHttpRequest();
      xhr.open((options?.method || "GET").toUpperCase(), url);
      xhr.timeout = timeoutMs;

      const headers = options?.headers;
      if (headers) {
        if (headers instanceof Headers) {
          headers.forEach((value, key) => xhr.setRequestHeader(key, value));
        } else if (Array.isArray(headers)) {
          (headers as [string, string][]).forEach(([k, v]) => xhr.setRequestHeader(k, v));
        } else {
          Object.entries(headers as Record<string, string>).forEach(([k, v]) =>
            xhr.setRequestHeader(k, v)
          );
        }
      }

      xhr.onload = () => {
        if (xhr.status < 200 || xhr.status >= 300) {
          resolve({ status: "error", message: `Server returned ${xhr.status}` });
          return;
        }
        try {
          resolve(JSON.parse(xhr.responseText));
        } catch {
          resolve({ status: "error", message: "Invalid server response format" });
        }
      };
      xhr.onerror   = () => resolve({ status: "error", message: "Connection failed" });
      xhr.ontimeout = () => resolve({ status: "error", message: "Request timed out" });
      xhr.onabort   = () => resolve({ status: "error", message: "Request timed out" });

      xhr.send((options?.body ?? null) as XMLHttpRequestBodyInit | null);
    } catch {
      resolve({ status: "error", message: "Connection failed" });
    }
  });
}
