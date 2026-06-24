import { NextRequest } from "next/server";

import { requireAdminRequest } from "@/lib/server/auth/session";
import { withApiError } from "@/lib/server/http";
import { getAdminOrder, updateAdminOrder } from "@/lib/server/modules/orders/order.service";

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  return withApiError(async () => {
    await requireAdminRequest(request);
    const { id } = await params;
    return { order: await getAdminOrder(id) };
  });
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  return withApiError(async () => {
    await requireAdminRequest(request);
    const { id } = await params;
    return { order: await updateAdminOrder(id, await request.json()) };
  });
}
