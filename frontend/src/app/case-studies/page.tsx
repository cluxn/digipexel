import type { Metadata } from 'next'
import CaseStudiesClient from './case-studies-client'

const API = process.env.NEXT_PUBLIC_API_URL || 'https://digipexel.cluxn.com/backend/api'

export async function generateMetadata(): Promise<Metadata> {
  const res = await fetch(`${API}/seo_meta.php?page=case-studies`).catch(() => null)
  const data = res ? await res.json().catch(() => null) : null
  const meta = data?.status === 'success' ? data.data : null
  return {
    title: meta?.seo_title || 'Case Studies — Digi Pexel',
    description: meta?.meta_description || 'Real results from AI automation implementations by Digi Pexel.',
    openGraph: {
      title: meta?.seo_title || 'Case Studies — Digi Pexel',
      description: meta?.meta_description || 'Real results from AI automation implementations by Digi Pexel.',
      images: meta?.og_image ? [{ url: meta.og_image }] : [],
    },
  }
}

export default function CaseStudiesPage() {
  return <CaseStudiesClient />
}
