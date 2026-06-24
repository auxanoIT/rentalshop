import type { MetadataRoute } from "next";

import { staticSeoRoutes } from "@/lib/catalog";
import { getPublishedIndexableSanitySlugs } from "@/lib/sanity/queries";
import { getActiveProductPaths } from "@/lib/server/modules/products/product.service";
import { getSiteUrl } from "@/lib/utils";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = getSiteUrl();
  const [productPaths, sanitySlugs] = await Promise.all([
    getActiveProductPaths(),
    getPublishedIndexableSanitySlugs()
  ]);

  return [
    ...staticSeoRoutes.map((route) => ({
      url: `${baseUrl}${route}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: route === "/" ? 1 : 0.8
    })),
    ...productPaths.map(({ categorySlug, productSlug }) => ({
      url: `${baseUrl}/equipment/${categorySlug}/${productSlug}`,
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
