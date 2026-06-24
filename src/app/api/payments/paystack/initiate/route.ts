import { NextRequest } from "next/server";

import { withApiError } from "@/lib/server/http";
import { initiatePaystackPayment } from "@/lib/server/modules/payments/paystack.service";

export async function POST(request: NextRequest) {
  return withApiError(async () => ({
    payment: await initiatePaystackPayment(await request.json())
  }));
}
