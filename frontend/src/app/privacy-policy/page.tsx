import type { Metadata } from 'next'
import PrivacyClient from './privacy-client'

const API = process.env.NEXT_PUBLIC_API_URL || 'https://www.digipexel.com/backend/api'

export async function generateMetadata(): Promise<Metadata> {
  const res = await fetch(`${API}/seo_meta.php?page=privacy-policy`).catch(() => null)
  const data = res ? await res.json().catch(() => null) : null
  const meta = data?.status === 'success' ? data.data : null
  const title = meta?.seo_title || 'Privacy Policy — Digi Pexel'
  const description = meta?.meta_description || 'How Digi Pexel collects, uses, and protects your personal data.'
  return {
    title,
    description,
    alternates: { canonical: 'https://www.digipexel.com/privacy-policy/' },
    openGraph: {
      title,
      description,
      url: 'https://www.digipexel.com/privacy-policy/',
      type: 'website',
      locale: 'en_US',
      images: meta?.og_image ? [{ url: meta.og_image }] : [],
    },
    twitter: { card: 'summary_large_image', title, description },
  }
}

export default function PrivacyPolicyPage() {
  return <PrivacyClient />
}
