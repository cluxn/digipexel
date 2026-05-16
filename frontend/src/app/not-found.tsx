import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <section className="relative min-h-screen flex items-center justify-center py-32 overflow-hidden bg-base">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(124,58,237,0.06),transparent_70%)]" />
      <div className="relative z-10 max-w-2xl mx-auto px-6 text-center">
        <Badge variant="outline" className="section-eyebrow mb-6 mx-auto">
          404 — Signal Lost
        </Badge>
        <h1 className="hero-title mb-6 leading-[1.05]">
          Lost in the{" "}
          <span className="hero-title-accent">automation void</span>?
        </h1>
        <p className="section-subtitle opacity-70 mb-10">
          This page doesn&apos;t exist in our system. Let&apos;s get you back on track.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Button asChild variant="brand" className="h-12 px-8 font-bold">
            <Link href="/">Return to Mission Control</Link>
          </Button>
          <Button asChild variant="outline" className="h-12 px-8 font-bold">
            <Link href="/services">View Our Services</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
