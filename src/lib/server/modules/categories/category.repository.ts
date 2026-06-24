import { launchCategories } from "@/lib/catalog";
import { getPrisma, hasDatabaseUrl } from "@/lib/server/db/prisma";

export async function listCategories() {
  if (!hasDatabaseUrl()) {
    return launchCategories;
  }

  const prisma = getPrisma();
  return prisma.category.findMany({
    orderBy: { name: "asc" }
  });
}

export async function createCategory(data: {
  name: string;
  slug: string;
  description?: string;
  status?: "ACTIVE" | "REQUEST_ONLY" | "COMING_SOON" | "HIDDEN";
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
  }
) {
  const prisma = getPrisma();
  return prisma.category.update({ where: { id }, data });
}
