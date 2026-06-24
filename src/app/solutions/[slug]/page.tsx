import Link from "next/link";
import { notFound } from "next/navigation";

import { Button } from "@/components/ui/button";
import { solutionPages } from "@/lib/catalog";
import { buildMetadata } from "@/lib/seo";

export function generateStaticParams() {
  return Object.keys(solutionPages).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const page = solutionPages[slug as keyof typeof solutionPages];
  if (!page) return {};
  return buildMetadata({
    title: `${page.title} | ITShop Equipment Leasing`,
    description: page.body,
    path: `/solutions/${slug}`
  });
}

export default async function SolutionPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const page = solutionPages[slug as keyof typeof solutionPages];
  if (!page) notFound();

  return (
    <main className="container-page py-12">
      <div className="max-w-3xl">
        <p className="text-sm font-semibold text-primary">Solution</p>
        <h1 className="mt-2 text-4xl font-semibold">{page.title}</h1>
        <p className="mt-4 leading-7 text-muted-foreground">{page.body}</p>
        <div className="mt-8 flex gap-3">
          <Button asChild>
            <Link href="/equipment/laptops">Choose laptops</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/contact">Request quote</Link>
          </Button>
        </div>
      </div>
    </main>
  );
}
