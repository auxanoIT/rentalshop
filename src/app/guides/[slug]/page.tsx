import Link from "next/link";
import { notFound } from "next/navigation";

import { JsonLd } from "@/components/json-ld";
import { Button } from "@/components/ui/button";
import { guideArticles } from "@/lib/catalog";
import { buildMetadata, faqJsonLd } from "@/lib/seo";
import { getGuideArticleFromSanity } from "@/lib/sanity/queries";

export function generateStaticParams() {
  return guideArticles.map((guide) => ({ slug: guide.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const guide = (await getGuideArticleFromSanity(slug)) ?? guideArticles.find((item) => item.slug === slug);
  if (!guide) return {};
  return buildMetadata({
    title: `${guide.title} | ITShop Equipment Leasing`,
    description: guide.excerpt,
    path: `/guides/${slug}`
  });
}

export default async function GuidePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const sanityGuide = await getGuideArticleFromSanity(slug);
  const guide = sanityGuide ?? guideArticles.find((item) => item.slug === slug);
  if (!guide) notFound();
  const body =
    sanityGuide?.body.length
      ? sanityGuide.body
      : [
          "Start by confirming quantity, rental dates, delivery city, software requirements, and the specification level each participant needs. For business and training rentals, standardising specifications reduces setup friction.",
          "Use the calculator on product pages to estimate rental charges, then submit checkout details with the rental agreement accepted. Admin review covers documents, security deposit, delivery, and return logistics."
        ];
  const relatedPages =
    sanityGuide?.relatedPages.length
      ? sanityGuide.relatedPages
      : [
          { href: "/equipment/laptops", label: "View laptops" },
          { href: "/bulk-laptop-rental", label: "Bulk rental page" }
        ];

  return (
    <main className="container-page py-12">
      {sanityGuide?.faqs.length ? <JsonLd data={faqJsonLd(sanityGuide.faqs)} /> : null}
      <article className="max-w-3xl">
        <p className="text-sm font-semibold text-primary">Guide</p>
        <h1 className="mt-2 text-4xl font-semibold">{guide.title}</h1>
        <p className="mt-4 leading-7 text-muted-foreground">{guide.excerpt}</p>
        <div className="mt-8 grid gap-5 leading-7 text-muted-foreground">
          {body.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
        <div className="mt-8 flex gap-3">
          {relatedPages.map((link, index) => (
            <Button key={link.href} asChild variant={index === 0 ? "default" : "outline"}>
              <Link href={link.href}>{link.label}</Link>
            </Button>
          ))}
        </div>
      </article>
    </main>
  );
}
