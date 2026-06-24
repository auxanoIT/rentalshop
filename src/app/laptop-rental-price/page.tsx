import { SeoLandingPage } from "@/components/seo/seo-landing-page";
import { seoLandingPages } from "@/lib/catalog";
import { buildMetadata } from "@/lib/seo";
import { getSeoLandingPageFromSanity } from "@/lib/sanity/queries";

const page = seoLandingPages["laptop-rental-price"];

export async function generateMetadata() {
  const resolvedPage = await getSeoLandingPageFromSanity(page.slug, page);
  return buildMetadata({
    title: resolvedPage.metaTitle,
    description: resolvedPage.metaDescription,
    path: `/${resolvedPage.slug}`
  });
}

export default async function LaptopRentalPricePage() {
  const resolvedPage = await getSeoLandingPageFromSanity(page.slug, page);
  return <SeoLandingPage page={resolvedPage} />;
}
