import { NextRequest } from "next/server";

import { requireAdminRequest } from "@/lib/server/auth/session";
import { withApiError } from "@/lib/server/http";
import { recordAuditLog } from "@/lib/server/modules/audit/audit.service";
import { updateReturnRecord } from "@/lib/server/modules/returns/return.service";

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  return withApiError(async () => {
    const session = await requireAdminRequest(request);
    const { id } = await params;
    const returnRecord = await updateReturnRecord(id, await request.json());
    await recordAuditLog(session, {
      action: "return.update.api",
      entityType: "ReturnRecord",
      entityId: id,
      metadata: { orderReference: returnRecord.order.reference, status: returnRecord.status }
    });
    return { returnRecord };
  });
}
