import { z } from "zod";

import {
  createCategory,
  findPublicCategoryBySlug,
  listCategories,
  listPublicCategories,
  listPublicCategoryParams,
  updateCategory
} from "@/lib/server/modules/categories/category.repository";

const categoryCreateSchema = z.object({
  name: z.string().min(2),
  slug: z.string().min(2),
  description: z.string().optional(),
  status: z.enum(["ACTIVE", "REQUEST_ONLY", "COMING_SOON", "HIDDEN"]).default("ACTIVE"),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional()
});

const categoryUpdateSchema = categoryCreateSchema.partial();

export async function getCategories() {
  return listCategories();
}

export async function getPublicCategories() {
  return listPublicCategories();
}

export async function getPublicCategory(slug: string) {
  return findPublicCategoryBySlug(slug);
}

export async function getPublicCategoryParams() {
  return listPublicCategoryParams();
}

export async function createAdminCategory(payload: unknown) {
  return createCategory(categoryCreateSchema.parse(payload));
}

export async function updateAdminCategory(id: string, payload: unknown) {
  return updateCategory(id, categoryUpdateSchema.parse(payload));
}
