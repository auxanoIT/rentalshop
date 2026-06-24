import { notFound } from "next/navigation";

import { JsonLd } from "@/components/json-ld";
import { ProductCard } from "@/components/rental/product-card";
import { breadcrumbJsonLd, buildMetadata } from "@/lib/seo";
import {
  getPublicCategory,
  getPublicCategoryParams
} from "@/lib/server/modules/categories/category.service";
import { getPublicProductsByCategory } from "@/lib/server/modules/products/product.service";

export async function generateStaticParams() {
  return getPublicCategoryParams();
}

export async function generateMetadata({ params }: { params: Promise<{ categorySlug: string }> }) {
  const { categorySlug } = await params;
  const category = await getPublicCategory(categorySlug);
  if (!category) return {};

  return buildMetadata({
    title: category.seoTitle,
    description: category.seoDescription,
    path: `/equipment/${category.slug}`,
    noIndex: category.status !== "ACTIVE"
  });
}

export default async function CategoryPage({ params }: { params: Promise<{ categorySlug: string }> }) {
  const { categorySlug } = await params;
  const category = await getPublicCategory(categorySlug);
  if (!category) notFound();

  const products = await getPublicProductsByCategory(category.slug);

  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", href: "/" },
          { name: "Equipment", href: "/equipment" },
          { name: category.name, href: `/equipment/${category.slug}` }
        ])}
      />
      <main className="container-page py-12">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold text-primary">Equipment category</p>
          <h1 className="mt-2 text-4xl font-semibold">{category.name} rental</h1>
          <p className="mt-4 text-muted-foreground">{category.description}</p>
        </div>
        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {products.length ? (
            products.map((product, index) => (
              <ProductCard key={product.id} product={product} priority={index === 0} />
            ))
          ) : (
            <div className="rounded-lg border bg-card p-5 text-sm text-muted-foreground md:col-span-3">
              This category is available by request. Send the required specifications, quantity, and rental dates for admin review.
            </div>
          )}
        </div>
      </main>
    </>
  );
}
