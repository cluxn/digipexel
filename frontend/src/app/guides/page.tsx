import type { Metadata } from 'next'
import GuidesClient from './guides-client'

const API = process.env.NEXT_PUBLIC_API_URL || 'https://digipexel.com/backend/api'

export async function generateMetadata(): Promise<Metadata> {
  const res = await fetch(`${API}/seo_meta.php?page=guides`).catch(() => null)
  const data = res ? await res.json().catch(() => null) : null
  const meta = data?.status === 'success' ? data.data : null
  return {
    title: meta?.seo_title || 'Guides — Digi Pexel',
    description: meta?.meta_description || 'Free AI automation guides and resources from Digi Pexel.',
    alternates: { canonical: 'https://www.digipexel.com/guides' },
    openGraph: {
      title: meta?.seo_title || 'Guides — Digi Pexel',
      description: meta?.meta_description || 'Free AI automation guides and resources from Digi Pexel.',
      url: 'https://www.digipexel.com/guides',
      images: meta?.og_image ? [{ url: meta.og_image }] : [],
    },
  }
}

export default function GuidesPage() {
  return <GuidesClient />
}
