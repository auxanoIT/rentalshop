import { NextRequest } from "next/server";

import { requireAdminRequest } from "@/lib/server/auth/session";
import { withApiError } from "@/lib/server/http";
import { recordAuditLog } from "@/lib/server/modules/audit/audit.service";
import { updateDelivery } from "@/lib/server/modules/deliveries/delivery.service";

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  return withApiError(async () => {
    const session = await requireAdminRequest(request);
    const { id } = await params;
    const delivery = await updateDelivery(id, await request.json());
    await recordAuditLog(session, {
      action: "delivery.update.api",
      entityType: "Delivery",
      entityId: id,
      metadata: { orderReference: delivery.order.reference, status: delivery.status }
    });
    return { delivery };
  });
}
