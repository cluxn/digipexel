import type { Metadata } from 'next'
import ContactClient from './contact-client'

const API = process.env.NEXT_PUBLIC_API_URL || 'https://digipexel.cluxn.com/backend/api'

export async function generateMetadata(): Promise<Metadata> {
  const res = await fetch(`${API}/seo_meta.php?page=contact-us`).catch(() => null)
  const data = res ? await res.json().catch(() => null) : null
  const meta = data?.status === 'success' ? data.data : null
  return {
    title: meta?.seo_title || 'Contact Us — Digi Pexel',
    description: meta?.meta_description || 'Get in touch with Digi Pexel for a free AI automation consultation.',
    alternates: { canonical: 'https://www.digipexel.com/contact-us' },
    openGraph: {
      title: meta?.seo_title || 'Contact Us — Digi Pexel',
      description: meta?.meta_description || 'Get in touch with Digi Pexel for a free AI automation consultation.',
      url: 'https://www.digipexel.com/contact-us',
      images: meta?.og_image ? [{ url: meta.og_image }] : [],
    },
  }
}

export default function ContactPage() {
  return <ContactClient />
}
