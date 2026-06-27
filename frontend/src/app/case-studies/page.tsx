import type { Metadata } from 'next'
import CaseStudiesClient from './case-studies-client'

const API = process.env.NEXT_PUBLIC_API_URL || 'https://www.digipexel.com/backend/api'

export async function generateMetadata(): Promise<Metadata> {
  const res = await fetch(`${API}/seo_meta.php?page=case-studies`).catch(() => null)
  const data = res ? await res.json().catch(() => null) : null
  const meta = data?.status === 'success' ? data.data : null
  const title = meta?.seo_title || 'Case Studies — Digi Pexel'
  const description = meta?.meta_description || 'Real results from AI automation implementations by Digi Pexel.'
  const images = meta?.og_image ? [{ url: meta.og_image }] : []
  return {
    title,
    description,
    alternates: { canonical: 'https://www.digipexel.com/case-studies/' },
    openGraph: {
      title,
      description,
      url: 'https://www.digipexel.com/case-studies/',
      type: 'website',
      locale: 'en_US',
      images,
    },
    twitter: { card: 'summary_large_image', title, description },
  }
}

export default function CaseStudiesPage() {
  return <CaseStudiesClient />
}
