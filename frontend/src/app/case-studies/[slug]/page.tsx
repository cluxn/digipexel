import CaseStudyClient from "@/components/page-clients/case-study-client";

export async function generateStaticParams() {
  return [
    { slug: "finflows-automation" },
    { slug: "retailbot-ai-support" },
    { slug: "proptrack-lead-automation" },
    { slug: "medsync-clinic-automation" },
  ];
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  return <CaseStudyClient slug={resolvedParams.slug} />;
}
