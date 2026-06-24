import { getSanityClient } from "@/lib/sanity/client";
import type { SeoLandingPage } from "@/lib/catalog";

type PortableTextBlock = {
  children?: Array<{ text?: string }>;
};

type SanitySeoLandingPage = {
  title?: string;
  slug?: string;
  metaTitle?: string;
  metaDescription?: string;
  eyebrow?: string;
  h1?: string;
  intro?: string;
  sections?: Array<{ title?: string; body?: PortableTextBlock[] }>;
  faqs?: Array<{ question?: string; answer?: string }>;
  links?: Array<{ href?: string; label?: string }>;
};

export type SanityGuideArticle = {
  title: string;
  slug: string;
  excerpt: string;
  body: string[];
  relatedPages: Array<{ href: string; label: string }>;
  faqs: Array<{ question: string; answer: string }>;
};

function blockText(blocks?: PortableTextBlock[]) {
  return (
    blocks
      ?.map((block) => block.children?.map((child) => child.text).filter(Boolean).join(" "))
      .filter(Boolean)
      .join(" ") ?? ""
  );
}

export async function getPublishedIndexableSanitySlugs() {
  const client = getSanityClient();
  if (!client) return [];

  const query = `*[
    (_type == "seoLandingPage" || _type == "guideArticle" || _type == "policyPage")
    && defined(slug.current)
    && (indexStatus == "index" || !defined(indexStatus))
  ]{ "slug": slug.current }`;

  const pages = await client.fetch<Array<{ slug: string }>>(query, {}, { next: { tags: ["sanity-pages"] } });
  return pages.map((page) => page.slug);
}

export async function getSeoLandingPageFromSanity(slug: string, fallback: SeoLandingPage) {
  const client = getSanityClient();
  if (!client) return fallback;

  const query = `*[
    _type == "seoLandingPage"
    && slug.current == $slug
    && (indexStatus == "index" || !defined(indexStatus))
  ][0]{
    title,
    "slug": slug.current,
    metaTitle,
    metaDescription,
    "eyebrow": hero.eyebrow,
    "h1": hero.heading,
    "intro": hero.body,
    sections[]{ title, body[]{ children[]{ text } } },
    faqs[]{ question, answer },
    "links": internalLinks[]{ href, label }
  }`;

  const page = await client.fetch<SanitySeoLandingPage | null>(
    query,
    { slug },
    { next: { tags: ["sanity-pages", `sanity-page-${slug}`] } }
  );

  if (!page) return fallback;

  return {
    ...fallback,
    title: page.title ?? fallback.title,
    metaTitle: page.metaTitle ?? fallback.metaTitle,
    metaDescription: page.metaDescription ?? fallback.metaDescription,
    eyebrow: page.eyebrow ?? fallback.eyebrow,
    h1: page.h1 ?? fallback.h1,
    intro: page.intro ?? fallback.intro,
    sections: page.sections?.length
      ? page.sections
          .map((section) => ({
            title: section.title ?? "",
            body: blockText(section.body)
          }))
          .filter((section) => section.title && section.body)
      : fallback.sections,
    faqs: page.faqs?.length
      ? page.faqs
          .map((faq) => ({
            question: faq.question ?? "",
            answer: faq.answer ?? ""
          }))
          .filter((faq) => faq.question && faq.answer)
      : fallback.faqs,
    links: page.links?.length
      ? page.links
          .map((link) => ({
            href: link.href ?? "",
            label: link.label ?? ""
          }))
          .filter((link) => link.href && link.label)
      : fallback.links
  } satisfies SeoLandingPage;
}

export async function getGuideArticleFromSanity(slug: string) {
  const client = getSanityClient();
  if (!client) return null;

  const query = `*[
    _type == "guideArticle"
    && slug.current == $slug
  ][0]{
    title,
    "slug": slug.current,
    excerpt,
    body[]{ children[]{ text } },
    relatedPages[]{ href, label },
    faqs[]{ question, answer }
  }`;

  const guide = await client.fetch<{
    title?: string;
    slug?: string;
    excerpt?: string;
    body?: PortableTextBlock[];
    relatedPages?: Array<{ href?: string; label?: string }>;
    faqs?: Array<{ question?: string; answer?: string }>;
  } | null>(query, { slug }, { next: { tags: ["sanity-pages", `sanity-guide-${slug}`] } });

  if (!guide?.title || !guide.slug || !guide.excerpt) return null;

  const bodyText = blockText(guide.body);

  return {
    title: guide.title,
    slug: guide.slug,
    excerpt: guide.excerpt,
    body: bodyText ? bodyText.split(/\n{2,}/).filter(Boolean) : [],
    relatedPages:
      guide.relatedPages
        ?.map((link) => ({ href: link.href ?? "", label: link.label ?? "" }))
        .filter((link) => link.href && link.label) ?? [],
    faqs:
      guide.faqs
        ?.map((faq) => ({ question: faq.question ?? "", answer: faq.answer ?? "" }))
        .filter((faq) => faq.question && faq.answer) ?? []
  } satisfies SanityGuideArticle;
}
