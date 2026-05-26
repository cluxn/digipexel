import type { Metadata } from 'next'
import BlogDetailsClient from "@/components/page-clients/blog-details-client";

const API = process.env.NEXT_PUBLIC_API_URL || 'https://digipexel.com/backend/api'

const FALLBACK_SLUGS = [
  "ai-automation-eliminates-manual-work",
  "seo-age-of-ai-llm-answers",
  "evaluate-ai-automation-agency-coo-guide",
  "crm-to-campaign-automation-stack",
];

export async function generateStaticParams() {
  try {
    const res = await fetch(`${API}/blogs.php`);
    const data = await res.json();
    if (data.status === "success" && Array.isArray(data.data)) {
      const apiSlugs: string[] = data.data.map((p: { slug: string }) => p.slug).filter(Boolean);
      return [...new Set([...FALLBACK_SLUGS, ...apiSlugs])].map(slug => ({ slug }));
    }
  } catch {}
  return FALLBACK_SLUGS.map(slug => ({ slug }));
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
    alternates: { canonical: `https://www.digipexel.com/blog/${slug}` },
    openGraph: {
      title: meta?.seo_title || 'Blog Post — Digi Pexel',
      description: meta?.meta_description || 'Read our latest AI automation insights.',
      url: `https://www.digipexel.com/blog/${slug}`,
      images: meta?.og_image ? [{ url: meta.og_image }] : [],
    },
  }
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  return <BlogDetailsClient slug={resolvedParams.slug} />;
}
