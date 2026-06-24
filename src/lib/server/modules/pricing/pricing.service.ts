import { getProductBySlug } from "@/lib/catalog";
import { getPrisma, hasDatabaseUrl } from "@/lib/server/db/prisma";
import { badRequest, notFound } from "@/lib/server/errors";
import {
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

  const variant = await getPrisma().productVariant.findUnique({
    where: { slug: productSlug },
    select: { dailyRate: true }
  });

  if (!variant) throw notFound("Product variant not found");
  return Number(variant.dailyRate);
}

export async function calculateRentalPrice(payload: unknown) {
  const input = pricingCalculateSchema.parse(payload);
  const rentalDays = Math.ceil(
    (input.returnDate.getTime() - input.startDate.getTime()) / 86_400_000
  );

  if (rentalDays <= 0) {
    throw badRequest("Return date must be after start date");
  }

  const rules = await getActiveRules();
  const minimumDays = input.quantity >= rules.bulkThreshold ? rules.minDaysBulk : rules.minDaysSingleUnit;

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

  const dailyRate = await getRate(input.productSlug);
  const subtotal = dailyRate * input.quantity * rentalDays;
  const discount =
    input.quantity >= rules.bulkThreshold ? Math.round(subtotal * rules.bulkDiscountRate) : 0;
  const deliveryFeeEstimate =
    input.deliveryFeeEstimate > 0 ? input.deliveryFeeEstimate : rules.deliveryFeeDefault;
  const total = subtotal - discount + deliveryFeeEstimate;

  return {
    productSlug: input.productSlug,
    quantity: input.quantity,
    rentalDays,
    minimumDays,
    dailyRate,
    subtotal,
    discount,
    deliveryFeeEstimate,
    total,
    securityDepositIncluded: false
  };
}
