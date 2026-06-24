import { NextRequest } from "next/server";

import { requireAdminRequest } from "@/lib/server/auth/session";
import { withApiError } from "@/lib/server/http";
import { listInventory } from "@/lib/server/modules/inventory/inventory.service";

export async function GET(request: NextRequest) {
  return withApiError(async () => {
    await requireAdminRequest(request);
    return { inventory: await listInventory() };
  });
}
