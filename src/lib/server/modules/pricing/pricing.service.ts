import { getProductBySlug } from "@/lib/catalog";
import { getPrisma, hasDatabaseUrl } from "@/lib/server/db/prisma";
import { badRequest, notFound } from "@/lib/server/errors";
import {
  pricingCartCalculateSchema,
  pricingCalculateSchema,
  pricingRuleUpdateSchema
} from "@/lib/server/modules/pricing/pricing.validation";

const defaultRules = {
  name: "Default rental pricing",
  minDaysSingleUnit: 7,
  bulkThreshold: 10,
  minDaysBulk: 2,
  maxStandardDays: 183,
  bulkDiscountRate: 0.05,
  deliveryFeeDefault: 0
};

async function getActiveRules() {
  if (!hasDatabaseUrl()) return defaultRules;

  try {
    const rule = await getPrisma().pricingRule.findFirst({
      where: { isActive: true },
      orderBy: { updatedAt: "desc" }
    });

    return rule
      ? {
          name: rule.name,
          minDaysSingleUnit: rule.minDaysSingleUnit,
          bulkThreshold: rule.bulkThreshold,
          minDaysBulk: rule.minDaysBulk,
          maxStandardDays: rule.maxStandardDays,
          bulkDiscountRate: Number(rule.bulkDiscountRate),
          deliveryFeeDefault: Number(rule.deliveryFeeDefault)
        }
      : defaultRules;
  } catch {
    return defaultRules;
  }
}

export async function getAdminPricingRules() {
  return getActiveRules();
}

export async function updateAdminPricingRules(payload: unknown) {
  const input = pricingRuleUpdateSchema.parse(payload);

  const data = {
    name: input.name,
    minDaysSingleUnit: input.minDaysSingleUnit,
    bulkThreshold: input.bulkThreshold,
    minDaysBulk: input.minDaysBulk,
    maxStandardDays: input.maxStandardDays,
    bulkDiscountRate: input.bulkDiscountPercent / 100,
    deliveryFeeDefault: input.deliveryFeeDefault,
    isActive: true
  };

  const prisma = getPrisma();
  const activeRule = await prisma.pricingRule.findFirst({
    where: { isActive: true },
    orderBy: { updatedAt: "desc" }
  });

  if (activeRule) {
    return prisma.pricingRule.update({
      where: { id: activeRule.id },
      data
    });
  }

  return prisma.pricingRule.create({ data });
}

async function getRate(productSlug: string) {
  if (!hasDatabaseUrl()) {
    const product = getProductBySlug(productSlug);
    if (!product) throw notFound("Product not found");
    return product.dailyRate;
  }

  try {
    const variant = await getPrisma().productVariant.findUnique({
      where: { slug: productSlug },
      select: { dailyRate: true }
    });

    if (!variant) throw notFound("Product variant not found");
    return Number(variant.dailyRate);
  } catch (error) {
    if (error instanceof Error && error.name === "AppError") throw error;

    const product = getProductBySlug(productSlug);
    if (!product) throw notFound("Product variant not found");
    return product.dailyRate;
  }
}

export async function calculateRentalPrice(payload: unknown) {
  const input = pricingCalculateSchema.parse(payload);
  const quote = await calculateRentalCartPrice({
    items: [{ productSlug: input.productSlug, quantity: input.quantity }],
    startDate: input.startDate,
    returnDate: input.returnDate,
    deliveryFeeEstimate: input.deliveryFeeEstimate
  });
  const line = quote.items[0];

  return {
    ...line,
    minimumDays: quote.minimumDays,
    deliveryFeeEstimate: quote.deliveryFeeEstimate,
    total: quote.total,
    securityDepositIncluded: false
  };
}

export async function calculateRentalCartPrice(payload: unknown) {
  const input = pricingCartCalculateSchema.parse(payload);
  const rentalDays = Math.ceil(
    (input.returnDate.getTime() - input.startDate.getTime()) / 86_400_000
  );

  if (rentalDays <= 0) {
    throw badRequest("Return date must be after start date");
  }

  const rules = await getActiveRules();
  const totalQuantity = input.items.reduce((sum, item) => sum + item.quantity, 0);
  const isBulkOrder = totalQuantity >= rules.bulkThreshold;
  const minimumDays = isBulkOrder ? rules.minDaysBulk : rules.minDaysSingleUnit;

  if (rentalDays < minimumDays) {
    throw badRequest(`Minimum rental period is ${minimumDays} days for this quantity`, {
      minimumDays,
      rentalDays
    });
  }

  if (rentalDays > rules.maxStandardDays) {
    throw badRequest("Maximum standard rental period is 6 months", {
      maxStandardDays: rules.maxStandardDays
    });
  }

  const items = await Promise.all(
    input.items.map(async (item) => {
      const dailyRate = await getRate(item.productSlug);
      const subtotal = dailyRate * item.quantity * rentalDays;
      const discount = isBulkOrder ? Math.round(subtotal * rules.bulkDiscountRate) : 0;

      return {
        productSlug: item.productSlug,
        quantity: item.quantity,
        rentalDays,
        dailyRate,
        subtotal,
        discount,
        total: subtotal - discount
      };
    })
  );

  const subtotal = items.reduce((sum, item) => sum + item.subtotal, 0);
  const discount = items.reduce((sum, item) => sum + item.discount, 0);
  const deliveryFeeEstimate = input.deliveryFeeEstimate ?? rules.deliveryFeeDefault;
  const total = subtotal - discount + deliveryFeeEstimate;

  return {
    items,
    quantity: totalQuantity,
    rentalDays,
    minimumDays,
    subtotal,
    discount,
    deliveryFeeEstimate,
    total,
    securityDepositIncluded: false
  };
}
