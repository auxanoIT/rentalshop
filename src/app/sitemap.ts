import type { MetadataRoute } from "next";

import { staticSeoRoutes } from "@/lib/catalog";
import { getPublishedIndexableSanitySlugs } from "@/lib/sanity/queries";
import { listActiveProductSlugs } from "@/lib/server/modules/products/product.repository";
import { getSiteUrl } from "@/lib/utils";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = getSiteUrl();
  const [productSlugs, sanitySlugs] = await Promise.all([
    listActiveProductSlugs(),
    getPublishedIndexableSanitySlugs()
  ]);

  return [
    ...staticSeoRoutes.map((route) => ({
      url: `${baseUrl}${route}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: route === "/" ? 1 : 0.8
    })),
    ...productSlugs.map((slug) => ({
      url: `${baseUrl}/equipment/laptops/${slug}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.75
    })),
    ...sanitySlugs.map((slug) => ({
      url: `${baseUrl}/${slug}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.7
    }))
  ];
}
