import { ServicePageClient } from "./service-page-client";

const SERVICE_SLUGS = [
  "ai-seo", "custom-ai-solutions", "youtube-automation",
  "instagram-automation", "linkedin-automation", "automation-flows",
  "ai-workflows", "workflow-creation", "accounting-bookkeeping",
  "hiring-recruitment", "sales-automation",
];

export async function generateStaticParams() {
  return SERVICE_SLUGS.map((slug) => ({ slug }));
}

export default async function ServicePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <ServicePageClient slug={slug} />;
}
