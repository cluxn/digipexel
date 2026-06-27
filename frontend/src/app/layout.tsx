import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Nudges } from "@/components/ui/nudges";
import { BackToTop } from "@/components/ui/back-to-top";
import { WhatsAppButton } from "@/components/ui/whatsapp-button";
import { AnalyticsInjector } from "@/components/ui/analytics-injector";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.digipexel.com"),
  title: {
    default: "Digi Pexel — AI Automation Agency",
    template: "%s | Digi Pexel",
  },
  description: "We design reliable AI workflows that move data, decisions, and actions across your stack — so your team can scale without friction.",
  keywords: ["AI automation", "workflow automation", "AI agency", "n8n", "make", "zapier", "digital transformation"],
  alternates: { canonical: "https://www.digipexel.com/" },
  openGraph: {
    title: "Digi Pexel — AI Automation Agency",
    description: "We design reliable AI workflows that move data, decisions, and actions across your stack.",
    siteName: "Digi Pexel",
    type: "website",
    locale: "en_US",
    url: "https://www.digipexel.com/",
  },
  twitter: {
    card: "summary_large_image",
    site: "@digipexel",
    title: "Digi Pexel — AI Automation Agency",
    description: "We design reliable AI workflows that move data, decisions, and actions across your stack.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-snippet": -1, "max-image-preview": "large", "max-video-preview": -1 },
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
        <AnalyticsInjector />
        {/* Organization JSON-LD Schema — SEO-04 */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Organization',
              name: 'Digi Pexel',
              url: 'https://www.digipexel.com',
              logo: 'https://www.digipexel.com/icon.svg',
              description: 'AI automation and digital marketing agency for B2B decision makers',
              contactPoint: {
                '@type': 'ContactPoint',
                contactType: 'customer service',
                url: 'https://www.digipexel.com/contact-us/',
              },
              sameAs: [
                'https://www.linkedin.com/company/digipexel',
              ],
            }).replace(/</g, '\\u003c'),
          }}
        />
        <Nudges />
        {children}
        <BackToTop />
        <WhatsAppButton />
      </body>
    </html>
  );
}
