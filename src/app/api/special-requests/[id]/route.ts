import { NextRequest } from "next/server";

import { requireAdminRequest } from "@/lib/server/auth/session";
import { withApiError } from "@/lib/server/http";
import { recordAuditLog } from "@/lib/server/modules/audit/audit.service";
import { updateSpecialRequest } from "@/lib/server/modules/special-requests/special-request.service";

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  return withApiError(async () => {
    const session = await requireAdminRequest(request);
    const { id } = await params;
    const requestRecord = await updateSpecialRequest(id, await request.json());
    await recordAuditLog(session, {
      action: "special-request.update.api",
      entityType: "SpecialRequest",
      entityId: id,
      metadata: { email: requestRecord.email, status: requestRecord.status }
    });
    return { request: requestRecord };
  });
}
