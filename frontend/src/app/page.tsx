import type { Metadata } from 'next'
import HomeClient from './home-client'

const API = process.env.NEXT_PUBLIC_API_URL || 'https://digipexel.cluxn.com/backend/api'

export async function generateMetadata(): Promise<Metadata> {
  const res = await fetch(`${API}/seo_meta.php?page=home`).catch(() => null)
  const data = res ? await res.json().catch(() => null) : null
  const meta = data?.status === 'success' ? data.data : null
  return {
    title: meta?.seo_title || 'Digi Pexel — AI Automation Agency',
    description: meta?.meta_description || 'We design reliable AI workflows that move data, decisions, and actions across your stack — so your team can scale without friction.',
    openGraph: {
      title: meta?.seo_title || 'Digi Pexel — AI Automation Agency',
      description: meta?.meta_description || 'We design reliable AI workflows.',
      images: meta?.og_image ? [{ url: meta.og_image }] : [],
    },
  }
}

export default function Page() {
  return <HomeClient />
}
