import { z } from "zod";

export const productCreateSchema = z.object({
  categoryId: z.string().min(1),
  name: z.string().min(2),
  slug: z.string().min(2),
  shortDesc: z.string().optional(),
  description: z.string().optional(),
  status: z.enum(["ACTIVE", "INACTIVE", "REQUEST_ONLY", "COMING_SOON"]).default("ACTIVE"),
  rentable: z.coerce.boolean().default(true),
  sellable: z.coerce.boolean().default(false),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
  imageUrl: z.string().url().optional().or(z.literal("")),
  imageAlt: z.string().optional(),
  variantName: z.string().optional(),
  variantSlug: z.string().optional(),
  dailyRate: z.coerce.number().nonnegative(),
  weeklyRate: z.coerce.number().nonnegative().optional(),
  monthlyRate: z.coerce.number().nonnegative().optional(),
  availableQty: z.coerce.number().int().nonnegative().default(0),
  specs: z
    .object({
      brand: z.string().optional(),
      model: z.string().optional(),
      processor: z.string().optional(),
      ram: z.string().optional(),
      storage: z.string().optional(),
      operatingSystem: z.string().optional(),
      screenSize: z.string().optional(),
      condition: z.string().optional()
    })
    .default({})
});

export const productUpdateSchema = productCreateSchema.partial();
