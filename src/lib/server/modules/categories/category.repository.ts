import type { Prisma } from "@prisma/client";

import { launchCategories, type LaunchCategory } from "@/lib/catalog";
import { getPrisma, hasDatabaseUrl } from "@/lib/server/db/prisma";

type DbCategory = Prisma.CategoryGetPayload<object>;

function mapDbCategory(category: DbCategory): LaunchCategory {
  return {
    id: category.id,
    name: category.name,
    slug: category.slug,
    description: category.description ?? "",
    status: category.status,
    seoTitle: category.seoTitle ?? category.name,
    seoDescription: category.seoDescription ?? category.description ?? ""
  };
}

function listFallbackPublicCategories() {
  return launchCategories.filter((category) => category.status !== "HIDDEN");
}

export async function listCategories() {
  if (!hasDatabaseUrl()) {
    return launchCategories;
  }

  const prisma = getPrisma();
  return prisma.category.findMany({
    orderBy: { name: "asc" }
  });
}

export async function listPublicCategories() {
  if (!hasDatabaseUrl()) {
    return listFallbackPublicCategories();
  }

  try {
    const prisma = getPrisma();
    const categories = await prisma.category.findMany({
      where: { status: { not: "HIDDEN" } },
      orderBy: [{ status: "asc" }, { name: "asc" }]
    });

    return categories.map(mapDbCategory);
  } catch {
    return listFallbackPublicCategories();
  }
}

export async function findPublicCategoryBySlug(slug: string) {
  if (!hasDatabaseUrl()) {
    return listFallbackPublicCategories().find((category) => category.slug === slug) ?? null;
  }

  try {
    const prisma = getPrisma();
    const category = await prisma.category.findFirst({
      where: {
        slug,
        status: { not: "HIDDEN" }
      }
    });

    return category ? mapDbCategory(category) : null;
  } catch {
    return listFallbackPublicCategories().find((category) => category.slug === slug) ?? null;
  }
}

export async function listPublicCategoryParams() {
  const categories = await listPublicCategories();
  return categories.map((category) => ({ categorySlug: category.slug }));
}

export async function createCategory(data: {
  name: string;
  slug: string;
  description?: string;
  status?: "ACTIVE" | "REQUEST_ONLY" | "COMING_SOON" | "HIDDEN";
  seoTitle?: string;
  seoDescription?: string;
}) {
  const prisma = getPrisma();
  return prisma.category.create({ data });
}

export async function updateCategory(
  id: string,
  data: {
    name?: string;
    slug?: string;
    description?: string;
    status?: "ACTIVE" | "REQUEST_ONLY" | "COMING_SOON" | "HIDDEN";
    seoTitle?: string;
    seoDescription?: string;
  }
) {
  const prisma = getPrisma();
  return prisma.category.update({ where: { id }, data });
}
