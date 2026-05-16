"use client";

import { PopupWidget } from 'react-calendly';
import { useEffect, useState } from 'react';

interface CalendlyButtonProps {
  url: string;
  label: string;
  className?: string;
}

export function CalendlyButton({ url, label, className }: CalendlyButtonProps) {
  const [rootEl, setRootEl] = useState<HTMLElement | null>(null);

  useEffect(() => {
    // rootElement must be set after mount — document not available during SSR/build
    setRootEl(document.getElementById('__next') || document.body);
  }, []);

  if (!rootEl || !url) return null;

  return (
    <PopupWidget
      url={url}
      rootElement={rootEl}
      text={label}
      textColor="#ffffff"
      color="#7C3AED"
    />
  );
}
