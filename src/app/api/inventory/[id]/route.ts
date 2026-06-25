import { NextRequest } from "next/server";

import { requireAdminRequest } from "@/lib/server/auth/session";
import { withApiError } from "@/lib/server/http";
import { recordAuditLog } from "@/lib/server/modules/audit/audit.service";
import { updateInventoryUnit } from "@/lib/server/modules/inventory/inventory.service";

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  return withApiError(async () => {
    const session = await requireAdminRequest(request);
    const { id } = await params;
    const inventoryUnit = await updateInventoryUnit(id, await request.json());
    await recordAuditLog(session, {
      action: "inventory.update.api",
      entityType: "InventoryUnit",
      entityId: id,
      metadata: { serialNo: inventoryUnit.serialNo, status: inventoryUnit.status }
    });
    return { inventoryUnit };
  });
}
