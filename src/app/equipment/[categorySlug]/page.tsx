import { notFound } from "next/navigation";

import { JsonLd } from "@/components/json-ld";
import { ProductCard } from "@/components/rental/product-card";
import { getCategoryBySlug, getProductsByCategory, launchCategories } from "@/lib/catalog";
import { breadcrumbJsonLd, buildMetadata } from "@/lib/seo";

export function generateStaticParams() {
  return launchCategories.map((category) => ({ categorySlug: category.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ categorySlug: string }> }) {
  const { categorySlug } = await params;
  const category = getCategoryBySlug(categorySlug);
  if (!category) return {};

  return buildMetadata({
    title: category.seoTitle,
    description: category.seoDescription,
    path: `/equipment/${category.slug}`
  });
}

export default async function CategoryPage({ params }: { params: Promise<{ categorySlug: string }> }) {
  const { categorySlug } = await params;
  const category = getCategoryBySlug(categorySlug);
  if (!category) notFound();

  const products = getProductsByCategory(category.slug);

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
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </main>
    </>
  );
}
