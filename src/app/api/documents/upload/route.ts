import { NextRequest } from "next/server";

import { created, withApiError } from "@/lib/server/http";
import { uploadCustomerDocument } from "@/lib/server/modules/documents/document.service";
import { assertRateLimit } from "@/lib/server/rate-limit";

export async function POST(request: NextRequest) {
  return withApiError(async () => {
    assertRateLimit(request, "documents", { limit: 5, windowMs: 60_000 });
    const document = await uploadCustomerDocument(await request.formData());
    return created({ document });
  });
}
