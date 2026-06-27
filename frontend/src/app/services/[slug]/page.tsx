import type { Metadata } from 'next'
import { ServicePageClient } from "./service-page-client";

const API = process.env.NEXT_PUBLIC_API_URL || 'https://www.digipexel.com/backend/api'

const SERVICE_SLUGS = [
  "ai-seo", "custom-ai-solutions", "youtube-automation",
  "instagram-automation", "linkedin-automation", "automation-flows",
  "ai-workflows", "workflow-creation", "accounting-bookkeeping",
  "hiring-recruitment", "sales-automation",
];

export async function generateStaticParams() {
  return SERVICE_SLUGS.map((slug) => ({ slug }));
}

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params
  const res = await fetch(`${API}/seo_meta.php?page=services/${slug}`).catch(() => null)
  const data = res ? await res.json().catch(() => null) : null
  const meta = data?.status === 'success' ? data.data : null
  const fallbackTitle = `${slug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())} — Digi Pexel`
  const title = meta?.seo_title || fallbackTitle
  const description = meta?.meta_description || 'AI automation and digital marketing services from Digi Pexel.'
  const images = meta?.og_image ? [{ url: meta.og_image }] : []
  return {
    title,
    description,
    alternates: { canonical: `https://www.digipexel.com/services/${slug}/` },
    openGraph: {
      title,
      description,
      url: `https://www.digipexel.com/services/${slug}/`,
      type: 'website',
      locale: 'en_US',
      images,
    },
    twitter: { card: 'summary_large_image', title, description },
  }
}

export default async function ServicePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const serviceSchema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: `${slug.replace(/-/g, ' ').replace(/\b\w/g, (c: string) => c.toUpperCase())} — Digi Pexel`,
    provider: {
      '@type': 'Organization',
      name: 'Digi Pexel',
      url: 'https://www.digipexel.com',
    },
    url: `https://www.digipexel.com/services/${slug}/`,
    description: 'AI automation and digital marketing service by Digi Pexel',
    areaServed: 'Worldwide',
    serviceType: 'AI Automation',
  }
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(serviceSchema).replace(/</g, '\\u003c'),
        }}
      />
      <ServicePageClient slug={slug} />
    </>
  );
}
