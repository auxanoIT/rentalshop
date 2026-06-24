import { NextRequest } from "next/server";

import { withApiError } from "@/lib/server/http";
import {
  calculateRentalCartPrice,
  calculateRentalPrice
} from "@/lib/server/modules/pricing/pricing.service";

function isCartPricingPayload(payload: unknown) {
  return typeof payload === "object" && payload !== null && "items" in payload;
}

export async function POST(request: NextRequest) {
  return withApiError(async () => {
    const payload = await request.json();

    return {
      price: isCartPricingPayload(payload)
        ? await calculateRentalCartPrice(payload)
        : await calculateRentalPrice(payload)
    };
  });
}
