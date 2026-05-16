import type { Metadata } from 'next'
import CaseStudyClient from "@/components/page-clients/case-study-client";

const API = process.env.NEXT_PUBLIC_API_URL || 'https://digipexel.cluxn.com/backend/api'

export async function generateStaticParams() {
  return [
    { slug: "finflows-back-office-automation" },
    { slug: "growthloop-linkedin-scale" },
  ];
}

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params
  const res = await fetch(`${API}/seo_meta.php?page=case-studies/${slug}`).catch(() => null)
  const data = res ? await res.json().catch(() => null) : null
  const meta = data?.status === 'success' ? data.data : null
  return {
    title: meta?.seo_title || 'Case Study — Digi Pexel',
    description: meta?.meta_description || 'See how Digi Pexel delivered measurable results.',
    openGraph: {
      title: meta?.seo_title || 'Case Study — Digi Pexel',
      description: meta?.meta_description || 'See how Digi Pexel delivered measurable results.',
      images: meta?.og_image ? [{ url: meta.og_image }] : [],
    },
  }
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  return <CaseStudyClient slug={resolvedParams.slug} />;
}
