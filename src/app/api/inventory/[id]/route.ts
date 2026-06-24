import { NextRequest } from "next/server";

import { requireAdminRequest } from "@/lib/server/auth/session";
import { withApiError } from "@/lib/server/http";
import { updateInventoryUnit } from "@/lib/server/modules/inventory/inventory.service";

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  return withApiError(async () => {
    await requireAdminRequest(request);
    const { id } = await params;
    return { inventoryUnit: await updateInventoryUnit(id, await request.json()) };
  });
}
