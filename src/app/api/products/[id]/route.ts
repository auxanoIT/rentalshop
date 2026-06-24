import { NextRequest } from "next/server";

import { requireAdminRequest } from "@/lib/server/auth/session";
import { withApiError } from "@/lib/server/http";
import { getAdminProduct, updateAdminProduct } from "@/lib/server/modules/products/product.service";

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  return withApiError(async () => {
    await requireAdminRequest(request);
    const { id } = await params;
    return { product: await getAdminProduct(id) };
  });
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  return withApiError(async () => {
    await requireAdminRequest(request);
    const { id } = await params;
    return { product: await updateAdminProduct(id, await request.json()) };
  });
}
