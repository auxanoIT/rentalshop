import { NextRequest } from "next/server";

import { requireAdminRequest } from "@/lib/server/auth/session";
import { created, withApiError } from "@/lib/server/http";
import { createAdminProduct, getPublicProducts } from "@/lib/server/modules/products/product.service";

export async function GET() {
  return withApiError(async () => ({
    products: await getPublicProducts()
  }));
}

export async function POST(request: NextRequest) {
  return withApiError(async () => {
    await requireAdminRequest(request);
    const product = await createAdminProduct(await request.json());
    return created({ product });
  });
}
