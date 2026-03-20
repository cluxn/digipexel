import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Nudges } from "@/components/ui/nudges";
import { BackToTop } from "@/components/ui/back-to-top";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Digi Pexel — AI Automation Agency",
  description: "We design reliable AI workflows that move data, decisions, and actions across your stack — so your team can scale without friction.",
  keywords: ["AI automation", "workflow automation", "AI agency", "n8n", "make", "zapier", "digital transformation"],
  openGraph: {
    title: "Digi Pexel — AI Automation Agency",
    description: "We design reliable AI workflows that move data, decisions, and actions across your stack.",
    siteName: "Digi Pexel",
    type: "website",
  },
  icons: {
    icon: "/icon.svg",
    shortcut: "/icon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning
      >
        <Nudges />
        {children}
        <BackToTop />
      </body>
    </html>
  );
}
