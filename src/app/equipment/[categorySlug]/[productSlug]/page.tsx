import { CheckCircle2 } from "lucide-react";
import Image from "next/image";
import { notFound } from "next/navigation";

import { JsonLd } from "@/components/json-ld";
import { RentActions } from "@/components/rental/rent-actions";
import { RentalCalculator } from "@/components/rental/rental-calculator";
import { Badge } from "@/components/ui/badge";
import { getProductBySlug, launchProducts } from "@/lib/catalog";
import { breadcrumbJsonLd, buildMetadata, productJsonLd } from "@/lib/seo";
import { formatNaira } from "@/lib/utils";

export function generateStaticParams() {
  return launchProducts.map((product) => ({
    categorySlug: product.categorySlug,
    productSlug: product.slug
  }));
}

export async function generateMetadata({
  params
}: {
  params: Promise<{ categorySlug: string; productSlug: string }>;
}) {
  const { productSlug } = await params;
  const product = getProductBySlug(productSlug);
  if (!product) return {};

  return buildMetadata({
    title: product.seoTitle,
    description: product.seoDescription,
    path: `/equipment/${product.categorySlug}/${product.slug}`,
    image: product.image,
    noIndex: product.status !== "ACTIVE"
  });
}

export default async function ProductPage({
  params
}: {
  params: Promise<{ categorySlug: string; productSlug: string }>;
}) {
  const { categorySlug, productSlug } = await params;
  const product = getProductBySlug(productSlug);
  if (!product || product.categorySlug !== categorySlug) notFound();

  return (
    <>
      {product.status === "ACTIVE" && product.dailyRate > 0 ? <JsonLd data={productJsonLd(product)} /> : null}
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", href: "/" },
          { name: "Laptops", href: "/equipment/laptops" },
          { name: product.name, href: `/equipment/${product.categorySlug}/${product.slug}` }
        ])}
      />
      <main className="container-page py-12">
        <div className="grid gap-8 lg:grid-cols-[1fr_420px]">
          <div>
            <div className="relative aspect-[4/3] overflow-hidden rounded-lg border bg-muted">
              <Image
                src={product.image}
                alt={product.imageAlt}
                fill
                priority
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 60vw"
              />
            </div>
            <section className="mt-8">
              <h2 className="text-2xl font-semibold">Rental details</h2>
              <p className="mt-3 leading-7 text-muted-foreground">{product.description}</p>
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                {Object.entries(product.specs).map(([key, value]) => (
                  <div key={key} className="rounded-lg border bg-card p-4">
                    <dt className="text-xs uppercase text-muted-foreground">{key}</dt>
                    <dd className="mt-1 font-medium">{value}</dd>
                  </div>
                ))}
              </div>
            </section>
          </div>

          <aside className="grid h-fit gap-5">
            <div className="rounded-lg border bg-card p-5">
              <Badge variant={product.status === "ACTIVE" ? "success" : "warning"}>
                {product.status === "ACTIVE" ? "Available" : "Request only"}
              </Badge>
              <h1 className="mt-4 text-3xl font-semibold">{product.name}</h1>
              <p className="mt-3 text-muted-foreground">{product.shortDesc}</p>
              <div className="mt-5">
                <p className="text-sm text-muted-foreground">Daily rate</p>
                <p className="text-3xl font-semibold">
                  {product.dailyRate > 0 ? formatNaira(product.dailyRate) : "Custom pricing"}
                </p>
              </div>
              <div className="mt-5 grid gap-2 text-sm">
                {[
                  "Minimum 7 days for 1 unit",
                  "Bulk review from 10 laptops",
                  "Security deposit handled by admin"
                ].map((item) => (
                  <div key={item} className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-primary" aria-hidden />
                    {item}
                  </div>
                ))}
              </div>
              <div className="mt-5">
                <RentActions product={product} />
              </div>
            </div>
            {product.dailyRate > 0 ? <RentalCalculator product={product} /> : null}
          </aside>
        </div>
      </main>
    </>
  );
}
