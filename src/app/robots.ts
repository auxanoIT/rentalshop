import type { MetadataRoute } from "next";

import { getSiteUrl } from "@/lib/utils";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = getSiteUrl();

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/admin/", "/studio", "/cart", "/checkout", "/payment/", "/api/"]
      }
    ],
    sitemap: `${baseUrl}/sitemap.xml`
  };
}
