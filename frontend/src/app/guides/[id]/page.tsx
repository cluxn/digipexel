import type { Metadata } from 'next'
import GuideClient from "@/components/page-clients/guide-client";

const API = process.env.NEXT_PUBLIC_API_URL || 'https://www.digipexel.com/backend/api'

const FALLBACK_IDS = ["1", "2", "3", "4", "5", "6"];

export async function generateStaticParams() {
  try {
    const res = await fetch(`${API}/guides.php`);
    const data = await res.json();
    if (data.status === "success" && Array.isArray(data.data)) {
      const apiIds: string[] = data.data.map((g: { id: number }) => g.id.toString()).filter(Boolean);
      return [...new Set([...FALLBACK_IDS, ...apiIds])].map(id => ({ id }));
    }
  } catch {}
  return FALLBACK_IDS.map(id => ({ id }));
}

export async function generateMetadata(
  { params }: { params: Promise<{ id: string }> }
): Promise<Metadata> {
  const { id } = await params
  const res = await fetch(`${API}/seo_meta.php?page=guides/${id}`).catch(() => null)
  const data = res ? await res.json().catch(() => null) : null
  const meta = data?.status === 'success' ? data.data : null
  const title = meta?.seo_title || 'Guide — Digi Pexel'
  const description = meta?.meta_description || 'Learn AI automation strategies from Digi Pexel.'
  const images = meta?.og_image ? [{ url: meta.og_image }] : []
  return {
    title,
    description,
    alternates: { canonical: `https://www.digipexel.com/guides/${id}/` },
    openGraph: {
      title,
      description,
      url: `https://www.digipexel.com/guides/${id}/`,
      type: 'article',
      locale: 'en_US',
      images,
    },
    twitter: { card: 'summary_large_image', title, description },
  }
}

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  return <GuideClient id={resolvedParams.id} />;
}
