import type { Metadata } from 'next'
import ContactClient from './contact-client'

const API = process.env.NEXT_PUBLIC_API_URL || 'https://www.digipexel.com/backend/api'

export async function generateMetadata(): Promise<Metadata> {
  const res = await fetch(`${API}/seo_meta.php?page=contact-us`).catch(() => null)
  const data = res ? await res.json().catch(() => null) : null
  const meta = data?.status === 'success' ? data.data : null
  const title = meta?.seo_title || 'Contact Us — Digi Pexel'
  const description = meta?.meta_description || 'Get in touch with Digi Pexel for a free AI automation consultation.'
  const images = meta?.og_image ? [{ url: meta.og_image }] : []
  return {
    title,
    description,
    alternates: { canonical: 'https://www.digipexel.com/contact-us/' },
    openGraph: {
      title,
      description,
      url: 'https://www.digipexel.com/contact-us/',
      type: 'website',
      locale: 'en_US',
      images,
    },
    twitter: { card: 'summary_large_image', title, description },
  }
}

export default function ContactPage() {
  return <ContactClient />
}
