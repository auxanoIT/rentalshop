import { NextRequest } from "next/server";

import { requireAdminRequest } from "@/lib/server/auth/session";
import { withApiError } from "@/lib/server/http";
import { recordAuditLog } from "@/lib/server/modules/audit/audit.service";
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
    const session = await requireAdminRequest(request);
    const rules = await updateAdminPricingRules(await request.json());
    await recordAuditLog(session, {
      action: "pricing.update.api",
      entityType: "PricingRule",
      entityId: rules.id,
      metadata: { name: rules.name }
    });
    return { rules };
  });
}
