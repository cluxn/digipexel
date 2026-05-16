import type { Metadata } from 'next'
import BlogDetailsClient from "@/components/page-clients/blog-details-client";

const API = process.env.NEXT_PUBLIC_API_URL || 'https://digipexel.cluxn.com/backend/api'

export async function generateStaticParams() {
  return [
    { slug: "ai-automation-eliminates-manual-work" },
    { slug: "seo-age-of-ai-llm-answers" },
  ];
}

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params
  const res = await fetch(`${API}/seo_meta.php?page=blog/${slug}`).catch(() => null)
  const data = res ? await res.json().catch(() => null) : null
  const meta = data?.status === 'success' ? data.data : null
  return {
    title: meta?.seo_title || 'Blog Post — Digi Pexel',
    description: meta?.meta_description || 'Read our latest AI automation insights.',
    openGraph: {
      title: meta?.seo_title || 'Blog Post — Digi Pexel',
      description: meta?.meta_description || 'Read our latest AI automation insights.',
      images: meta?.og_image ? [{ url: meta.og_image }] : [],
    },
  }
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  return <BlogDetailsClient slug={resolvedParams.slug} />;
}
