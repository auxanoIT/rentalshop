import { z } from "zod";

import { getPrisma, hasDatabaseUrl } from "@/lib/server/db/prisma";
import { sendAdminOrderAlert } from "@/lib/server/modules/notifications/resend.service";

const contactSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().optional(),
  subject: z.string().optional(),
  message: z.string().min(5)
});

export async function createContactSubmission(payload: unknown) {
  const input = contactSchema.parse(payload);

  if (!hasDatabaseUrl()) {
    await sendAdminOrderAlert({
      reference: "CONTACT",
      customerName: input.name,
      total: 0
    });
    return { id: `local_contact_${Date.now()}`, ...input };
  }

  const submission = await getPrisma().contactSubmission.create({ data: input });
  await sendAdminOrderAlert({
    reference: submission.id,
    customerName: input.name,
    total: 0
  });

  return submission;
}
