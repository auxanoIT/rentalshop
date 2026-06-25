import { NextRequest } from "next/server";

import { requireAdminRequest } from "@/lib/server/auth/session";
import { withApiError } from "@/lib/server/http";
import { recordAuditLog } from "@/lib/server/modules/audit/audit.service";
import {
  getAdminDocumentFileUrl,
  updateAdminDocumentReview
} from "@/lib/server/modules/documents/document.service";

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  return withApiError(async () => {
    await requireAdminRequest(request);
    const { id } = await params;
    return { signedUrl: await getAdminDocumentFileUrl(id) };
  });
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  return withApiError(async () => {
    const session = await requireAdminRequest(request);
    const { id } = await params;
    const document = await updateAdminDocumentReview(id, await request.json());
    await recordAuditLog(session, {
      action: "document.review.api",
      entityType: "CustomerDocument",
      entityId: id,
      metadata: { fileName: document.fileName, reviewStatus: document.reviewStatus }
    });
    return { document };
  });
}
