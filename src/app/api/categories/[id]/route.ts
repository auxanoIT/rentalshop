import { NextRequest } from "next/server";

import { requireAdminRequest } from "@/lib/server/auth/session";
import { withApiError } from "@/lib/server/http";
import { recordAuditLog } from "@/lib/server/modules/audit/audit.service";
import { updateAdminCategory } from "@/lib/server/modules/categories/category.service";

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  return withApiError(async () => {
    const session = await requireAdminRequest(request);
    const { id } = await params;
    const category = await updateAdminCategory(id, await request.json());
    await recordAuditLog(session, {
      action: "category.update.api",
      entityType: "Category",
      entityId: id,
      metadata: { name: category.name, slug: category.slug }
    });
    return { category };
  });
}
