import { NextRequest } from "next/server";

import { requireAdminRequest } from "@/lib/server/auth/session";
import { withApiError } from "@/lib/server/http";
import {
  getAdminPricingRules,
  updateAdminPricingRules
} from "@/lib/server/modules/pricing/pricing.service";

export async function GET(request: NextRequest) {
  return withApiError(async () => {
    await requireAdminRequest(request);
    return { rules: await getAdminPricingRules() };
  });
}

export async function PATCH(request: NextRequest) {
  return withApiError(async () => {
    await requireAdminRequest(request);
    return { rules: await updateAdminPricingRules(await request.json()) };
  });
}
