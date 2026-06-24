import { NextRequest } from "next/server";

import { requireAdminRequest } from "@/lib/server/auth/session";
import { withApiError } from "@/lib/server/http";
import { listDeliveries } from "@/lib/server/modules/deliveries/delivery.service";

export async function GET(request: NextRequest) {
  return withApiError(async () => {
    await requireAdminRequest(request);
    return { deliveries: await listDeliveries() };
  });
}
