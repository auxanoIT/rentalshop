import Link from "next/link";
import { notFound } from "next/navigation";

import { Button } from "@/components/ui/button";
import { locationPages } from "@/lib/catalog";
import { buildMetadata } from "@/lib/seo";

export function generateStaticParams() {
  return Object.keys(locationPages).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const page = locationPages[slug as keyof typeof locationPages];
  if (!page) return {};
  return buildMetadata({
    title: `${page.title} | ITShop Equipment Leasing`,
    description: page.body,
    path: `/locations/${slug}`
  });
}

export default async function LocationPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const page = locationPages[slug as keyof typeof locationPages];
  if (!page) notFound();

  return (
    <main className="container-page py-12">
      <div className="max-w-3xl">
        <p className="text-sm font-semibold text-primary">Location</p>
        <h1 className="mt-2 text-4xl font-semibold">{page.title}</h1>
        <p className="mt-4 leading-7 text-muted-foreground">{page.body}</p>
        <div className="mt-8 flex gap-3">
          <Button asChild>
            <Link href="/equipment/laptops">Browse laptops</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/bulk-laptop-rental">Bulk rental</Link>
          </Button>
        </div>
      </div>
    </main>
  );
}
