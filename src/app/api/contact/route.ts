import { NextRequest } from "next/server";

import { created, withApiError } from "@/lib/server/http";
import { createContactSubmission } from "@/lib/server/modules/contact/contact.service";
import { assertRateLimit } from "@/lib/server/rate-limit";

export async function POST(request: NextRequest) {
  return withApiError(async () => {
    assertRateLimit(request, "contact", { limit: 8, windowMs: 60_000 });
    const submission = await createContactSubmission(await request.json());
    return created({ submission });
  });
}
