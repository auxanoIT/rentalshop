import { NextRequest } from "next/server";

import { requireAdminRequest } from "@/lib/server/auth/session";
import { withApiError } from "@/lib/server/http";
import { listPayments } from "@/lib/server/modules/payments/payment.repository";

export async function GET(request: NextRequest) {
  return withApiError(async () => {
    await requireAdminRequest(request);
    return { payments: await listPayments() };
  });
}
