import { NextRequest } from "next/server";

import { requireAdminRequest } from "@/lib/server/auth/session";
import { created, withApiError } from "@/lib/server/http";
import { recordAuditLog } from "@/lib/server/modules/audit/audit.service";
import { createAdminProduct, getPublicProducts } from "@/lib/server/modules/products/product.service";

export async function GET() {
  return withApiError(async () => ({
    products: await getPublicProducts()
  }));
}

export async function POST(request: NextRequest) {
  return withApiError(async () => {
    const session = await requireAdminRequest(request);
    const product = await createAdminProduct(await request.json());
    await recordAuditLog(session, {
      action: "product.create.api",
      entityType: "Product",
      entityId: product.id,
      metadata: { name: product.name, slug: product.slug }
    });
    return created({ product });
  });
}
