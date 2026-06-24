import { z } from "zod";

export const pricingLineItemSchema = z.object({
  productSlug: z.string().min(1),
  quantity: z.coerce.number().int().positive()
});

export const pricingCalculateSchema = z.object({
  productSlug: z.string().min(1),
  quantity: z.coerce.number().int().positive(),
  startDate: z.coerce.date(),
  returnDate: z.coerce.date(),
  deliveryFeeEstimate: z.coerce.number().nonnegative().optional()
});

export const pricingCartCalculateSchema = z.object({
  items: z.array(pricingLineItemSchema).min(1),
  startDate: z.coerce.date(),
  returnDate: z.coerce.date(),
  deliveryFeeEstimate: z.coerce.number().nonnegative().optional()
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
