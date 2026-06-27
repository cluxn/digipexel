import type { Metadata } from 'next'
import TestimonialsClient from './testimonials-client'

const API = process.env.NEXT_PUBLIC_API_URL || 'https://www.digipexel.com/backend/api'

export async function generateMetadata(): Promise<Metadata> {
  const res = await fetch(`${API}/seo_meta.php?page=testimonials`).catch(() => null)
  const data = res ? await res.json().catch(() => null) : null
  const meta = data?.status === 'success' ? data.data : null
  const title = meta?.seo_title || 'Client Testimonials — Digi Pexel'
  const description = meta?.meta_description || 'What our clients say about Digi Pexel AI automation services.'
  const images = meta?.og_image ? [{ url: meta.og_image }] : []
  return {
    title,
    description,
    alternates: { canonical: 'https://www.digipexel.com/testimonials/' },
    openGraph: {
      title,
      description,
      url: 'https://www.digipexel.com/testimonials/',
      type: 'website',
      locale: 'en_US',
      images,
    },
    twitter: { card: 'summary_large_image', title, description },
  }
}

export default function TestimonialsPage() {
  const aggregateRatingSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Digi Pexel',
    url: 'https://www.digipexel.com',
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.9',
      reviewCount: '47',
      bestRating: '5',
      worstRating: '1',
    },
  }
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(aggregateRatingSchema).replace(/</g, '\\u003c'),
        }}
      />
      <TestimonialsClient />
    </>
  )
}
