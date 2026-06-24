import { NextRequest } from "next/server";

import { withApiError } from "@/lib/server/http";
import { calculateRentalPrice } from "@/lib/server/modules/pricing/pricing.service";

export async function POST(request: NextRequest) {
  return withApiError(async () => ({
    price: await calculateRentalPrice(await request.json())
  }));
}
