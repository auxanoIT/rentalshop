import { faqItem } from "@/sanity/schemas/faq-item";
import { guideArticle } from "@/sanity/schemas/guide-article";
import { homepageSection } from "@/sanity/schemas/homepage-section";
import { policyPage } from "@/sanity/schemas/policy-page";
import { seoLandingPage } from "@/sanity/schemas/seo-landing-page";
import { testimonial } from "@/sanity/schemas/testimonial";

export const schemaTypes = [
  seoLandingPage,
  guideArticle,
  faqItem,
  homepageSection,
  policyPage,
  testimonial
];
