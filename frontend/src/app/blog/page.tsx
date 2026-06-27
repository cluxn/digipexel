import type { Metadata } from 'next'
import BlogClient from './blog-client'

const API = process.env.NEXT_PUBLIC_API_URL || 'https://www.digipexel.com/backend/api'

export async function generateMetadata(): Promise<Metadata> {
  const res = await fetch(`${API}/seo_meta.php?page=blog`).catch(() => null)
  const data = res ? await res.json().catch(() => null) : null
  const meta = data?.status === 'success' ? data.data : null
  const title = meta?.seo_title || 'Blog — Digi Pexel'
  const description = meta?.meta_description || 'AI automation insights, tutorials and agency updates from Digi Pexel.'
  const images = meta?.og_image ? [{ url: meta.og_image }] : []
  return {
    title,
    description,
    alternates: { canonical: 'https://www.digipexel.com/blog/' },
    openGraph: {
      title,
      description,
      url: 'https://www.digipexel.com/blog/',
      type: 'website',
      locale: 'en_US',
      images,
    },
    twitter: { card: 'summary_large_image', title, description },
  }
}

export default function BlogPage() {
  return <BlogClient />
}
