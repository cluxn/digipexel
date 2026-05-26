"use client";
import React, { useEffect, useState } from "react";
import { safeFetch } from "@/lib/utils";
import { API_BASE_URL } from "@/lib/constants";

export function WhatsAppButton() {
  const [number, setNumber] = useState("");

  useEffect(() => {
    safeFetch(`${API_BASE_URL}/settings.php`).then(json => {
      if (json?.status === "success" && json.data) {
        const num = (json.data as Record<string, string>).whatsapp_number;
        if (num) setNumber(num.replace(/\D/g, ""));
      }
    }).catch(() => {});
  }, []);

  if (!number) return null;

  return (
    <a
      href={`https://wa.me/${number}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      style={{ backgroundColor: "#25D366" }}
      className="fixed bottom-24 right-6 z-[999] w-14 h-14 rounded-full flex items-center justify-center shadow-xl shadow-black/25 hover:scale-110 active:scale-95 transition-transform duration-200"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="white"
        className="w-7 h-7"
        aria-hidden="true"
      >
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.031-.967-.272-.099-.47-.148-.669.15-.198.297-.767.966-.94 1.164-.173.199-.347.223-.644.074-.297-.148-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.52.149-.174.198-.298.297-.497.1-.198.05-.372-.024-.521-.075-.149-.669-1.612-.916-2.207-.243-.579-.487-.5-.669-.51-.173-.008-.372-.01-.571-.01-.198 0-.52.074-.793.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.066 2.875 1.214 3.074.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.625.712.227 1.36.195 1.872.118.571-.085 1.757-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.571-.347zM12.001 2C6.478 2 2 6.478 2 12c0 1.852.502 3.587 1.38 5.079L2.05 21.95l4.991-1.31A9.955 9.955 0 0012.001 22C17.523 22 22 17.522 22 12S17.523 2 12.001 2zm0 18.18a8.165 8.165 0 01-4.164-1.14l-.299-.177-3.096.812.826-3.018-.195-.31A8.14 8.14 0 013.82 12c0-4.512 3.67-8.18 8.181-8.18 4.512 0 8.18 3.668 8.18 8.18 0 4.511-3.668 8.18-8.18 8.18z" />
      </svg>
    </a>
  );
}
