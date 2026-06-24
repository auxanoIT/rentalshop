import { z } from "zod";

import { launchProducts } from "@/lib/catalog";
import { getPrisma, hasDatabaseUrl } from "@/lib/server/db/prisma";

export const inventoryStatuses = [
  "AVAILABLE",
  "RESERVED",
  "OUT_FOR_DELIVERY",
  "RENTED",
  "AWAITING_RETURN",
  "RETURNED",
  "UNDER_INSPECTION",
  "DAMAGED",
  "LOST",
  "UNDER_MAINTENANCE"
] as const;

const inventoryUpdateSchema = z.object({
  status: z.enum(inventoryStatuses),
  condition: z.string().optional(),
  notes: z.string().optional()
});

export async function listInventory() {
  if (!hasDatabaseUrl()) {
    return launchProducts.map((product) => ({
      id: product.id,
      variant: product.name,
      availableQty: product.availableQty,
      status: product.status === "ACTIVE" ? "AVAILABLE" : "REQUEST_ONLY"
    }));
  }

  return getPrisma().inventoryUnit.findMany({
    include: { variant: { include: { product: true } } },
    orderBy: [{ status: "asc" }, { serialNo: "asc" }]
  });
}

export async function updateInventoryUnit(id: string, payload: unknown) {
  const input = inventoryUpdateSchema.parse(payload);

  return getPrisma().inventoryUnit.update({
    where: { id },
    data: input,
    include: { variant: { include: { product: true } } }
  });
}
