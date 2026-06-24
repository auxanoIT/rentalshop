import { z } from "zod";

import {
  createCategory,
  listCategories,
  updateCategory
} from "@/lib/server/modules/categories/category.repository";

const categoryCreateSchema = z.object({
  name: z.string().min(2),
  slug: z.string().min(2),
  description: z.string().optional(),
  status: z.enum(["ACTIVE", "REQUEST_ONLY", "COMING_SOON", "HIDDEN"]).default("ACTIVE")
});

const categoryUpdateSchema = categoryCreateSchema.partial();

export async function getCategories() {
  return listCategories();
}

export async function createAdminCategory(payload: unknown) {
  return createCategory(categoryCreateSchema.parse(payload));
}

export async function updateAdminCategory(id: string, payload: unknown) {
  return updateCategory(id, categoryUpdateSchema.parse(payload));
}
