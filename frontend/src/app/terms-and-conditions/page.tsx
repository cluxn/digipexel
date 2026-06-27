import type { Metadata } from 'next'
import TermsClient from './terms-client'

const API = process.env.NEXT_PUBLIC_API_URL || 'https://www.digipexel.com/backend/api'

export async function generateMetadata(): Promise<Metadata> {
  const res = await fetch(`${API}/seo_meta.php?page=terms-and-conditions`).catch(() => null)
  const data = res ? await res.json().catch(() => null) : null
  const meta = data?.status === 'success' ? data.data : null
  const title = meta?.seo_title || 'Terms & Conditions — Digi Pexel'
  const description = meta?.meta_description || 'Digi Pexel service terms, IP ownership, and liability policy.'
  return {
    title,
    description,
    alternates: { canonical: 'https://www.digipexel.com/terms-and-conditions/' },
    openGraph: {
      title,
      description,
      url: 'https://www.digipexel.com/terms-and-conditions/',
      type: 'website',
      locale: 'en_US',
      images: meta?.og_image ? [{ url: meta.og_image }] : [],
    },
    twitter: { card: 'summary_large_image', title, description },
  }
}

export default function TermsAndConditionsPage() {
  return <TermsClient />
}
