import GuideClient from "@/components/page-clients/guide-client";

const FALLBACK_GUIDES = [
  { id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }, { id: 5 }, { id: 6 }
];

export async function generateStaticParams() {
  return FALLBACK_GUIDES.map((guide) => ({
    id: guide.id.toString(),
  }));
}

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  return <GuideClient id={resolvedParams.id} />;
}
