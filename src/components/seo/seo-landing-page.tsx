import { ArrowRight, CheckCircle2 } from "lucide-react";
import Link from "next/link";

import { JsonLd } from "@/components/json-ld";
import { ProductCard } from "@/components/rental/product-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { SeoLandingPage as SeoLandingPageType } from "@/lib/catalog";
import { faqJsonLd } from "@/lib/seo";
import { getPublicProducts } from "@/lib/server/modules/products/product.service";

export async function SeoLandingPage({ page }: { page: SeoLandingPageType }) {
  const products = (await getPublicProducts()).filter(
    (product) => product.categorySlug === "laptops" && product.status === "ACTIVE"
  );

  return (
    <>
      <JsonLd data={faqJsonLd(page.faqs)} />
      <main>
        <section className="border-b bg-card">
          <div className="container-page grid gap-10 py-14 lg:grid-cols-[1.1fr_0.9fr] lg:py-20">
            <div className="flex flex-col justify-center">
              <p className="text-sm font-semibold text-primary">{page.eyebrow}</p>
              <h1 className="mt-4 max-w-3xl text-4xl font-semibold leading-tight text-foreground md:text-5xl">
                {page.h1}
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-7 text-muted-foreground md:text-lg">
                {page.intro}
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Button asChild size="lg">
                  <Link href="/equipment/laptops">
                    {page.primaryCta}
                    <ArrowRight aria-hidden />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link href="/bulk-laptop-rental">{page.secondaryCta}</Link>
                </Button>
              </div>
            </div>
            <div className="grid gap-3 rounded-lg border bg-background p-4">
              {page.sections.map((section) => (
                <div key={section.title} className="rounded-md bg-card p-4">
                  <CheckCircle2 className="h-5 w-5 text-primary" aria-hidden />
                  <h2 className="mt-3 text-lg font-semibold">{section.title}</h2>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">{section.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="container-page py-12">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <p className="text-sm font-semibold text-primary">Available launch devices</p>
              <h2 className="mt-2 text-2xl font-semibold">Choose a Dell Latitude rental laptop</h2>
            </div>
            <Button asChild variant="outline">
              <Link href="/laptop-rental-price">Compare prices</Link>
            </Button>
          </div>
          <div className="mt-6 grid gap-5 md:grid-cols-3">
            {products.map((product, index) => (
              <ProductCard key={product.id} product={product} priority={index === 0} />
            ))}
          </div>
        </section>

        <section className="border-y bg-card">
          <div className="container-page grid gap-8 py-12 lg:grid-cols-[0.8fr_1fr]">
            <div>
              <p className="text-sm font-semibold text-primary">Rental questions</p>
              <h2 className="mt-2 text-2xl font-semibold">Common questions before checkout</h2>
            </div>
            <div className="grid gap-3">
              {page.faqs.map((faq) => (
                <Card key={faq.question}>
                  <CardContent className="p-5">
                    <h3 className="font-semibold">{faq.question}</h3>
                    <p className="mt-2 text-sm leading-6 text-muted-foreground">{faq.answer}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="container-page py-12">
          <h2 className="text-2xl font-semibold">Related rental pages</h2>
          <div className="mt-5 grid gap-3 md:grid-cols-3">
            {page.links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-lg border bg-card p-4 text-sm font-medium hover:border-primary"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </section>
      </main>
    </>
  );
}
