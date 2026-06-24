import { z } from "zod";

import { getPrisma, hasDatabaseUrl } from "@/lib/server/db/prisma";

const businessSettingsSchema = z.object({
  contact: z.object({
    email: z.string().email(),
    phone: z.string().optional(),
    market: z.string().optional()
  }),
  bankTransfer: z.object({
    details: z.string().optional()
  }),
  emailTemplates: z.object({
    notes: z.string().optional()
  })
});

export async function getBusinessSettings() {
  if (!hasDatabaseUrl()) {
    return {
      contact: {
        email: "support@itshop.ng",
        market: "Nigeria"
      },
      rentalRules: {
        minDaysSingleUnit: 7,
        bulkThreshold: 10,
        minDaysBulk: 2,
        maxStandardDays: 183
      }
    };
  }

  const settings = Object.fromEntries(
    (await getPrisma().businessSetting.findMany()).map((setting) => [setting.key, setting.value])
  ) as Record<string, unknown>;

  if (!settings.contact && settings.business_contact) {
    settings.contact = settings.business_contact;
  }

  return settings;
}

export async function updateBusinessSettings(payload: unknown) {
  const input = businessSettingsSchema.parse(payload);
  const prisma = getPrisma();

  await Promise.all(
    Object.entries(input).map(([key, value]) =>
      prisma.businessSetting.upsert({
        where: { key },
        update: { value },
        create: { key, value }
      })
    )
  );

  return input;
}
