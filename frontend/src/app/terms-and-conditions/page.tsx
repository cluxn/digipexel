import type { Metadata } from 'next'
import TermsClient from './terms-client'

const API = process.env.NEXT_PUBLIC_API_URL || 'https://digipexel.cluxn.com/backend/api'

export async function generateMetadata(): Promise<Metadata> {
  const res = await fetch(`${API}/seo_meta.php?page=terms-and-conditions`).catch(() => null)
  const data = res ? await res.json().catch(() => null) : null
  const meta = data?.status === 'success' ? data.data : null
  return {
    title: meta?.seo_title || 'Terms & Conditions — Digi Pexel',
    description: meta?.meta_description || 'Digi Pexel service terms, IP ownership, and liability policy.',
    openGraph: {
      title: meta?.seo_title || 'Terms & Conditions — Digi Pexel',
      description: meta?.meta_description || 'Digi Pexel service terms, IP ownership, and liability policy.',
      images: meta?.og_image ? [{ url: meta.og_image }] : [],
    },
  }
}

export default function TermsAndConditionsPage() {
  return <TermsClient />
}
