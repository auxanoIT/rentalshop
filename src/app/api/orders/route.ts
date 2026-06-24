import { NextRequest } from "next/server";

import { requireAdminRequest } from "@/lib/server/auth/session";
import { created, withApiError } from "@/lib/server/http";
import { createGuestOrder, listAdminOrders } from "@/lib/server/modules/orders/order.service";
import { assertRateLimit } from "@/lib/server/rate-limit";

export async function GET(request: NextRequest) {
  return withApiError(async () => {
    await requireAdminRequest(request);
    return { orders: await listAdminOrders() };
  });
}

export async function POST(request: NextRequest) {
  return withApiError(async () => {
    assertRateLimit(request, "orders", { limit: 6, windowMs: 60_000 });
    const order = await createGuestOrder(await request.json());
    return created({ order });
  });
}
