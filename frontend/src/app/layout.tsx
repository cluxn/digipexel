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
        <AnalyticsInjector />
        {/* Organization JSON-LD Schema — SEO-04 */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Organization',
              name: 'Digi Pexel',
              url: 'https://digipexel.cluxn.com',
              logo: 'https://digipexel.cluxn.com/icon.svg',
              description: 'AI automation and digital marketing agency for B2B decision makers',
              contactPoint: {
                '@type': 'ContactPoint',
                contactType: 'customer service',
                url: 'https://digipexel.cluxn.com/contact-us',
              },
              sameAs: [
                'https://linkedin.com/company/digipexel',
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
