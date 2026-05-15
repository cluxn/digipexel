import CaseStudyClient from "@/components/page-clients/case-study-client";

export async function generateStaticParams() {
  return [
    { slug: "finflows-back-office-automation" },
    { slug: "growthloop-linkedin-scale" },
  ];
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  return <CaseStudyClient slug={resolvedParams.slug} />;
}
