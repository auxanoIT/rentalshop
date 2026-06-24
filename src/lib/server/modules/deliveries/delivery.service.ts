import { z } from "zod";

import { getPrisma, hasDatabaseUrl } from "@/lib/server/db/prisma";

export const deliveryStatuses = ["NOT_READY", "SCHEDULED", "OUT_FOR_DELIVERY", "DELIVERED", "FAILED"] as const;

const deliveryUpdateSchema = z.object({
  status: z.enum(deliveryStatuses),
  scheduledAt: z.coerce.date().optional(),
  deliveredAt: z.coerce.date().optional(),
  notes: z.string().optional()
});

export async function listDeliveries() {
  if (!hasDatabaseUrl()) return [];

  return getPrisma().delivery.findMany({
    include: { order: { include: { customer: true } } },
    orderBy: { updatedAt: "desc" },
    take: 100
  });
}

export async function updateDelivery(id: string, payload: unknown) {
  const input = deliveryUpdateSchema.parse(payload);

  return getPrisma().delivery.update({
    where: { id },
    data: input,
    include: { order: { include: { customer: true } } }
  });
}
