import type { Metadata } from "next";

import { getSiteUrl } from "@/lib/utils";

type SeoOptions = {
  title: string;
  description: string;
  path?: string;
  image?: string;
  noIndex?: boolean;
};

export function buildMetadata({ title, description, path = "/", image, noIndex }: SeoOptions): Metadata {
  const siteUrl = getSiteUrl();
  const canonical = new URL(path, siteUrl).toString();
  const ogImage = image ?? new URL("/opengraph-image", siteUrl).toString();

  return {
    title,
    description,
    metadataBase: new URL(siteUrl),
    alternates: {
      canonical
    },
    robots: noIndex ? { index: false, follow: false } : { index: true, follow: true },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: "ITShop Equipment Leasing",
      images: [{ url: ogImage, width: 1200, height: 630 }],
      locale: "en_NG",
      type: "website"
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage]
    }
  };
}

export function organizationJsonLd() {
  const siteUrl = getSiteUrl();
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "ITShop Equipment Leasing",
    url: siteUrl,
    parentOrganization: {
      "@type": "Organization",
      name: "ITShop.ng",
      url: "https://itshop.ng"
    },
    areaServed: "Nigeria",
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "sales",
      email: "support@itshop.ng",
      areaServed: "NG"
    }
  };
}

export function productJsonLd(product: {
  name: string;
  description: string;
  image: string;
  slug: string;
  dailyRate: number;
}) {
  const url = `${getSiteUrl()}/equipment/laptops/${product.slug}`;
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image: product.image,
    url,
    brand: {
      "@type": "Brand",
      name: "Dell"
    },
    offers: {
      "@type": "Offer",
      priceCurrency: "NGN",
      price: product.dailyRate,
      availability: "https://schema.org/InStock",
      url
    }
  };
}

export function faqJsonLd(faqs: Array<{ question: string; answer: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer
      }
    }))
  };
}

export function breadcrumbJsonLd(items: Array<{ name: string; href: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `${getSiteUrl()}${item.href}`
    }))
  };
}
