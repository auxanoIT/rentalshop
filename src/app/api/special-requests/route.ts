import { NextRequest } from "next/server";

import { requireAdminRequest } from "@/lib/server/auth/session";
import { created, withApiError } from "@/lib/server/http";
import {
  createSpecialRequest,
  listSpecialRequests
} from "@/lib/server/modules/special-requests/special-request.service";
import { assertRateLimit } from "@/lib/server/rate-limit";

export async function GET(request: NextRequest) {
  return withApiError(async () => {
    await requireAdminRequest(request);
    return { requests: await listSpecialRequests() };
  });
}

export async function POST(request: NextRequest) {
  return withApiError(async () => {
    assertRateLimit(request, "special-requests", { limit: 8, windowMs: 60_000 });
    const requestRecord = await createSpecialRequest(await request.json());
    return created({ request: requestRecord });
  });
}
