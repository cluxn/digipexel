import type { Metadata } from 'next'
import BlogClient from './blog-client'

const API = process.env.NEXT_PUBLIC_API_URL || 'https://digipexel.com/backend/api'

export async function generateMetadata(): Promise<Metadata> {
  const res = await fetch(`${API}/seo_meta.php?page=blog`).catch(() => null)
  const data = res ? await res.json().catch(() => null) : null
  const meta = data?.status === 'success' ? data.data : null
  return {
    title: meta?.seo_title || 'Blog — Digi Pexel',
    description: meta?.meta_description || 'AI automation insights, tutorials and agency updates from Digi Pexel.',
    alternates: { canonical: 'https://www.digipexel.com/blog' },
    openGraph: {
      title: meta?.seo_title || 'Blog — Digi Pexel',
      description: meta?.meta_description || 'AI automation insights, tutorials and agency updates from Digi Pexel.',
      url: 'https://www.digipexel.com/blog',
      images: meta?.og_image ? [{ url: meta.og_image }] : [],
    },
  }
}

export default function BlogPage() {
  return <BlogClient />
}
