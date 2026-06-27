import type { Metadata } from 'next'
import GuidesClient from './guides-client'

const API = process.env.NEXT_PUBLIC_API_URL || 'https://www.digipexel.com/backend/api'

export async function generateMetadata(): Promise<Metadata> {
  const res = await fetch(`${API}/seo_meta.php?page=guides`).catch(() => null)
  const data = res ? await res.json().catch(() => null) : null
  const meta = data?.status === 'success' ? data.data : null
  const title = meta?.seo_title || 'Guides — Digi Pexel'
  const description = meta?.meta_description || 'Free AI automation guides and resources from Digi Pexel.'
  const images = meta?.og_image ? [{ url: meta.og_image }] : []
  return {
    title,
    description,
    alternates: { canonical: 'https://www.digipexel.com/guides/' },
    openGraph: {
      title,
      description,
      url: 'https://www.digipexel.com/guides/',
      type: 'website',
      locale: 'en_US',
      images,
    },
    twitter: { card: 'summary_large_image', title, description },
  }
}

export default function GuidesPage() {
  return <GuidesClient />
}
