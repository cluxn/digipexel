import type { Metadata } from 'next'
import BlogDetailsClient from "@/components/page-clients/blog-details-client";

const API = process.env.NEXT_PUBLIC_API_URL || 'https://www.digipexel.com/backend/api'

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
  const title = meta?.seo_title || 'Blog Post — Digi Pexel'
  const description = meta?.meta_description || 'Read our latest AI automation insights.'
  const images = meta?.og_image ? [{ url: meta.og_image }] : []
  return {
    title,
    description,
    alternates: { canonical: `https://www.digipexel.com/blog/${slug}/` },
    openGraph: {
      title,
      description,
      url: `https://www.digipexel.com/blog/${slug}/`,
      type: 'article',
      locale: 'en_US',
      images,
    },
    twitter: { card: 'summary_large_image', title, description },
  }
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const { slug } = resolvedParams;
  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: slug.replace(/-/g, ' ').replace(/\b\w/g, (c: string) => c.toUpperCase()),
    publisher: {
      '@type': 'Organization',
      name: 'Digi Pexel',
      url: 'https://www.digipexel.com',
      logo: { '@type': 'ImageObject', url: 'https://www.digipexel.com/icon.svg' },
    },
    url: `https://www.digipexel.com/blog/${slug}/`,
    mainEntityOfPage: { '@type': 'WebPage', '@id': `https://www.digipexel.com/blog/${slug}/` },
  }
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema).replace(/</g, '\\u003c') }}
      />
      <BlogDetailsClient slug={slug} />
    </>
  );
}
