import { z } from "zod";

export const pricingCalculateSchema = z.object({
  productSlug: z.string().min(1),
  quantity: z.coerce.number().int().positive(),
  startDate: z.coerce.date(),
  returnDate: z.coerce.date(),
  deliveryFeeEstimate: z.coerce.number().nonnegative().default(0)
});

export const pricingRuleUpdateSchema = z.object({
  name: z.string().min(2).default("Default rental pricing"),
  minDaysSingleUnit: z.coerce.number().int().positive(),
  bulkThreshold: z.coerce.number().int().positive(),
  minDaysBulk: z.coerce.number().int().positive(),
  maxStandardDays: z.coerce.number().int().positive(),
  bulkDiscountPercent: z.coerce.number().min(0).max(100),
  deliveryFeeDefault: z.coerce.number().nonnegative()
});
