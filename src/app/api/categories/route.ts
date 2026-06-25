import { NextRequest } from "next/server";

import { requireAdminRequest } from "@/lib/server/auth/session";
import { created, withApiError } from "@/lib/server/http";
import { recordAuditLog } from "@/lib/server/modules/audit/audit.service";
import { createAdminCategory, getPublicCategories } from "@/lib/server/modules/categories/category.service";

export async function GET() {
  return withApiError(async () => ({
    categories: await getPublicCategories()
  }));
}

export async function POST(request: NextRequest) {
  return withApiError(async () => {
    const session = await requireAdminRequest(request);
    const category = await createAdminCategory(await request.json());
    await recordAuditLog(session, {
      action: "category.create.api",
      entityType: "Category",
      entityId: category.id,
      metadata: { name: category.name, slug: category.slug }
    });
    return created({ category });
  });
}
