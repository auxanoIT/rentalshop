import { NextRequest } from "next/server";

import { requireAdminRequest } from "@/lib/server/auth/session";
import { withApiError } from "@/lib/server/http";
import { recordAuditLog } from "@/lib/server/modules/audit/audit.service";
import { updatePaymentStatus } from "@/lib/server/modules/payments/payment.repository";

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  return withApiError(async () => {
    const session = await requireAdminRequest(request);
    const { id } = await params;
    const payment = await updatePaymentStatus(id, await request.json());
    await recordAuditLog(session, {
      action: "payment.update.api",
      entityType: "Payment",
      entityId: id,
      metadata: { reference: payment.reference, status: payment.status }
    });
    return { payment };
  });
}
