import { NextRequest } from "next/server";

import { requireAdminRequest } from "@/lib/server/auth/session";
import { withApiError } from "@/lib/server/http";
import { getDashboardSummary } from "@/lib/server/modules/dashboard/dashboard.service";

export async function GET(request: NextRequest) {
  return withApiError(async () => {
    await requireAdminRequest(request);
    return getDashboardSummary();
  });
}
