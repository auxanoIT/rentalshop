import { NextRequest } from "next/server";

import { requireAdminRequest } from "@/lib/server/auth/session";
import { withApiError } from "@/lib/server/http";
import { updateDelivery } from "@/lib/server/modules/deliveries/delivery.service";

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  return withApiError(async () => {
    await requireAdminRequest(request);
    const { id } = await params;
    return { delivery: await updateDelivery(id, await request.json()) };
  });
}
