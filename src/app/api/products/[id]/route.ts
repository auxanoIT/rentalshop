import { NextRequest } from "next/server";

import { requireAdminRequest } from "@/lib/server/auth/session";
import { withApiError } from "@/lib/server/http";
import { recordAuditLog } from "@/lib/server/modules/audit/audit.service";
import { getPublicProductByIdentifier, updateAdminProduct } from "@/lib/server/modules/products/product.service";

export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  return withApiError(async () => {
    const { id } = await params;
    return { product: await getPublicProductByIdentifier(id) };
  });
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  return withApiError(async () => {
    const session = await requireAdminRequest(request);
    const { id } = await params;
    const product = await updateAdminProduct(id, await request.json());
    await recordAuditLog(session, {
      action: "product.update.api",
      entityType: "Product",
      entityId: id,
      metadata: { name: product.name, slug: product.slug }
    });
    return { product };
  });
}
