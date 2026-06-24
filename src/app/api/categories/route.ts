import { NextRequest } from "next/server";

import { requireAdminRequest } from "@/lib/server/auth/session";
import { created, withApiError } from "@/lib/server/http";
import { createAdminCategory, getPublicCategories } from "@/lib/server/modules/categories/category.service";

export async function GET() {
  return withApiError(async () => ({
    categories: await getPublicCategories()
  }));
}

export async function POST(request: NextRequest) {
  return withApiError(async () => {
    await requireAdminRequest(request);
    const category = await createAdminCategory(await request.json());
    return created({ category });
  });
}
