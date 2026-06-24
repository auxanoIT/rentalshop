import { z } from "zod";

import { getPrisma, hasDatabaseUrl } from "@/lib/server/db/prisma";
import { sendAdminOrderAlert } from "@/lib/server/modules/notifications/resend.service";

export const specialRequestStatuses = ["NEW", "CONTACTED", "QUOTED", "WON", "LOST", "CLOSED"] as const;

const specialRequestSchema = z.object({
  name: z.string().min(2),
  companyName: z.string().optional(),
  phone: z.string().min(7),
  email: z.string().email(),
  city: z.string().optional(),
  state: z.string().optional(),
  quantity: z.coerce.number().int().positive().optional(),
  startDate: z.coerce.date().optional(),
  returnDate: z.coerce.date().optional(),
  requirements: z.string().min(10)
});

const specialRequestUpdateSchema = z.object({
  status: z.enum(specialRequestStatuses),
  adminNotes: z.string().optional()
});

export async function createSpecialRequest(payload: unknown) {
  const input = specialRequestSchema.parse(payload);

  if (!hasDatabaseUrl()) {
    await sendAdminOrderAlert({
      reference: "SPECIAL-REQUEST",
      customerName: input.name,
      total: 0
    });
    return { id: `local_request_${Date.now()}`, status: "NEW", ...input };
  }

  const request = await getPrisma().specialRequest.create({
    data: input
  });

  await sendAdminOrderAlert({
    reference: request.id,
    customerName: input.name,
    total: 0
  });

  return request;
}

export async function listSpecialRequests() {
  if (!hasDatabaseUrl()) return [];

  return getPrisma().specialRequest.findMany({
    orderBy: { createdAt: "desc" },
    take: 100
  });
}

export async function updateSpecialRequest(id: string, payload: unknown) {
  const input = specialRequestUpdateSchema.parse(payload);

  return getPrisma().specialRequest.update({
    where: { id },
    data: input
  });
}
