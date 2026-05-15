"use client";
import { API_BASE_URL } from "@/lib/constants";

import React, { useEffect, useState } from "react";
import { safeFetch } from "@/lib/utils";

export function WhatsAppButton() {
  const [whatsappEnabled, setWhatsappEnabled] = useState(true);
  const [whatsappNumber, setWhatsappNumber] = useState("911234567890"); // fallback default

  useEffect(() => {
    safeFetch(`${API_BASE_URL}/settings.php`).then(json => {
      if (json?.status === "success" && json.data) {
        // whatsapp_enabled is stored as string "true"/"false" in settings table
        setWhatsappEnabled(json.data.whatsapp_enabled !== "false");
        if (json.data.whatsapp_number) {
          setWhatsappNumber(json.data.whatsapp_number.replace(/\D/g, ''));
        }
      }
      // On fetch failure safeFetch returns { status: "error" } — keep defaults (button stays visible with fallback number)
    });
  }, []);

  if (!whatsappEnabled) return null;

  return (
    <a
      href={`https://wa.me/${whatsappNumber}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      className="fixed bottom-6 right-6 z-50 w-[52px] h-[52px] rounded-full bg-[#25D366] flex items-center justify-center shadow-lg shadow-black/20 hover:scale-110 transition-transform duration-200"
    >
      <svg viewBox="0 0 24 24" fill="white" className="w-6 h-6" aria-hidden="true">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
        <path d="M12.006 2C6.477 2 2 6.477 2 12.003c0 1.765.463 3.478 1.34 4.988L2 22l5.14-1.315A9.988 9.988 0 0 0 12.006 22C17.524 22 22 17.524 22 12.003 22 6.477 17.524 2 12.006 2zm5.99 14.027c-.248.694-1.435 1.328-2.006 1.413-.511.077-1.159.109-1.871-.118-.432-.136-.985-.319-1.694-.625-2.981-1.287-4.928-4.289-5.077-4.487-.148-.199-1.213-1.612-1.213-3.074 0-1.463.768-2.182 1.04-2.479.272-.298.594-.372.792-.372.199 0 .397.002.57.01.182.01.427-.069.669.51.247.595.841 2.058.916 2.207.075.149.124.322.025.52-.1.199-.149.323-.298.497-.148.173-.312.387-.446.52-.148.148-.303.309-.13.606.173.298.77 1.271 1.653 2.059 1.135 1.012 2.093 1.325 2.39 1.475.297.148.471.124.644-.075.173-.198.743-.867.94-1.164.199-.298.397-.249.67-.15.272.1 1.733.818 2.03.967.298.149.496.223.57.347.075.124.075.719-.173 1.413z"/>
      </svg>
    </a>
  );
}
