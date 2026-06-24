import { NextRequest } from "next/server";

import { withApiError } from "@/lib/server/http";
import { handlePaystackWebhook } from "@/lib/server/modules/payments/paystack.service";

export async function POST(request: NextRequest) {
  return withApiError(async () => {
    const rawBody = await request.text();
    return handlePaystackWebhook(rawBody, request.headers.get("x-paystack-signature"));
  });
}
