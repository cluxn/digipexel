import type { Metadata } from 'next'
import PrivacyClient from './privacy-client'

const API = process.env.NEXT_PUBLIC_API_URL || 'https://digipexel.cluxn.com/backend/api'

export async function generateMetadata(): Promise<Metadata> {
  const res = await fetch(`${API}/seo_meta.php?page=privacy-policy`).catch(() => null)
  const data = res ? await res.json().catch(() => null) : null
  const meta = data?.status === 'success' ? data.data : null
  return {
    title: meta?.seo_title || 'Privacy Policy — Digi Pexel',
    description: meta?.meta_description || 'Digi Pexel privacy policy for data collection and processing.',
    openGraph: {
      title: meta?.seo_title || 'Privacy Policy — Digi Pexel',
      description: meta?.meta_description || 'Digi Pexel privacy policy for data collection and processing.',
      images: meta?.og_image ? [{ url: meta.og_image }] : [],
    },
  }
}

export default function PrivacyPolicyPage() {
  return <PrivacyClient />
}
