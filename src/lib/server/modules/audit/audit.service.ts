import type { Prisma } from "@prisma/client";

import type { AdminSession } from "@/lib/server/auth/session";
import { getPrisma, hasDatabaseUrl } from "@/lib/server/db/prisma";

export async function recordAuditLog(
  session: AdminSession,
  input: {
    action: string;
    entityType: string;
    entityId?: string;
    metadata?: Record<string, unknown>;
  }
) {
  if (!hasDatabaseUrl()) return;

  const metadata = input.metadata
    ? (JSON.parse(JSON.stringify(input.metadata)) as Prisma.InputJsonValue)
    : undefined;

  await getPrisma().auditLog.create({
    data: {
      adminUserId: session.adminId === "local-admin" ? null : session.adminId,
      action: input.action,
      entityType: input.entityType,
      entityId: input.entityId,
      metadata
    }
  });
}
