import BlogDetailsClient from "@/components/page-clients/blog-details-client";

export async function generateStaticParams() {
  return [
    { slug: "ai-automation-eliminating-manual-work" },
    { slug: "lead-qualification-bot" },
    { slug: "automation-platform-comparison" },
    { slug: "roi-framework-ai-automation" },
  ];
}

export default function Page({ params }: { params: Promise<{ slug: string }> }) {
  // Directly pass params through to client; no 'use' or 'await' needed if not used on server.
  // Actually, for static export, slug is available at runtime.
  return <BlogDetailsClientWrapper params={params} />;
}

async function BlogDetailsClientWrapper({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  return <BlogDetailsClient slug={resolvedParams.slug} />;
}
