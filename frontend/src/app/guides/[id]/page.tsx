import type { Metadata } from 'next'
import GuideClient from "@/components/page-clients/guide-client";

const API = process.env.NEXT_PUBLIC_API_URL || 'https://digipexel.cluxn.com/backend/api'

const FALLBACK_GUIDES = [
  { id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }, { id: 5 }, { id: 6 }
];

export async function generateStaticParams() {
  return FALLBACK_GUIDES.map((guide) => ({
    id: guide.id.toString(),
  }));
}

export async function generateMetadata(
  { params }: { params: Promise<{ id: string }> }
): Promise<Metadata> {
  const { id } = await params
  const res = await fetch(`${API}/seo_meta.php?page=guides/${id}`).catch(() => null)
  const data = res ? await res.json().catch(() => null) : null
  const meta = data?.status === 'success' ? data.data : null
  return {
    title: meta?.seo_title || 'Guide — Digi Pexel',
    description: meta?.meta_description || 'Learn AI automation strategies from Digi Pexel.',
    openGraph: {
      title: meta?.seo_title || 'Guide — Digi Pexel',
      description: meta?.meta_description || 'Learn AI automation strategies from Digi Pexel.',
      images: meta?.og_image ? [{ url: meta.og_image }] : [],
    },
  }
}

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  return <GuideClient id={resolvedParams.id} />;
}
