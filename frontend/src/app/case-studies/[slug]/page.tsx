import type { Metadata } from 'next'
import CaseStudyClient from "@/components/page-clients/case-study-client";

const API = process.env.NEXT_PUBLIC_API_URL || 'https://www.digipexel.com/backend/api'

const FALLBACK_SLUGS = [
  "finflows-back-office-automation",
  "growthloop-linkedin-scale",
  "meditrack-patient-onboarding-automation",
  "nexaretail-inventory-reporting-automation",
];

export async function generateStaticParams() {
  try {
    const res = await fetch(`${API}/case_studies.php`);
    const data = await res.json();
    if (data.status === "success" && Array.isArray(data.data)) {
      const apiSlugs: string[] = data.data.map((c: { slug: string }) => c.slug).filter(Boolean);
      return [...new Set([...FALLBACK_SLUGS, ...apiSlugs])].map(slug => ({ slug }));
    }
  } catch {}
  return FALLBACK_SLUGS.map(slug => ({ slug }));
}

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params
  const res = await fetch(`${API}/seo_meta.php?page=case-studies/${slug}`).catch(() => null)
  const data = res ? await res.json().catch(() => null) : null
  const meta = data?.status === 'success' ? data.data : null
  const title = meta?.seo_title || 'Case Study — Digi Pexel'
  const description = meta?.meta_description || 'See how Digi Pexel delivered measurable results.'
  const images = meta?.og_image ? [{ url: meta.og_image }] : []
  return {
    title,
    description,
    alternates: { canonical: `https://www.digipexel.com/case-studies/${slug}/` },
    openGraph: {
      title,
      description,
      url: `https://www.digipexel.com/case-studies/${slug}/`,
      type: 'article',
      locale: 'en_US',
      images,
    },
    twitter: { card: 'summary_large_image', title, description },
  }
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  return <CaseStudyClient slug={resolvedParams.slug} />;
}
