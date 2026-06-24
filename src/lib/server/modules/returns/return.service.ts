import { z } from "zod";

import { getPrisma, hasDatabaseUrl } from "@/lib/server/db/prisma";

export const returnStatuses = [
  "NOT_DUE",
  "DUE",
  "PICKUP_SCHEDULED",
  "RECEIVED",
  "UNDER_INSPECTION",
  "CLEARED",
  "DAMAGED",
  "LOST"
] as const;

const returnUpdateSchema = z.object({
  status: z.enum(returnStatuses),
  receivedAt: z.coerce.date().optional(),
  inspectionNotes: z.string().optional(),
  damageFee: z.coerce.number().nonnegative().optional()
});

export async function listReturns() {
  if (!hasDatabaseUrl()) return [];

  return getPrisma().returnRecord.findMany({
    include: { order: { include: { customer: true } } },
    orderBy: { dueDate: "asc" },
    take: 100
  });
}

export async function updateReturnRecord(id: string, payload: unknown) {
  const input = returnUpdateSchema.parse(payload);

  return getPrisma().returnRecord.update({
    where: { id },
    data: input,
    include: { order: { include: { customer: true } } }
  });
}
