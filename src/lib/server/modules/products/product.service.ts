import { notFound } from "@/lib/server/errors";
import {
  createProduct,
  findAdminProductById,
  findPublicProductBySlug,
  listAdminProducts,
  listPublicProducts,
  updateProduct
} from "@/lib/server/modules/products/product.repository";
import { productCreateSchema, productUpdateSchema } from "@/lib/server/modules/products/product.validation";

export async function getPublicProducts() {
  return listPublicProducts();
}

export async function getAdminProducts() {
  return listAdminProducts();
}

export async function getPublicProduct(slug: string) {
  const product = await findPublicProductBySlug(slug);
  if (!product) throw notFound("Product not found");
  return product;
}

export async function getAdminProduct(id: string) {
  const product = await findAdminProductById(id);
  if (!product) throw notFound("Product not found");
  return product;
}

export async function createAdminProduct(payload: unknown) {
  const data = productCreateSchema.parse(payload);
  return createProduct(data);
}

export async function updateAdminProduct(id: string, payload: unknown) {
  const data = productUpdateSchema.parse(payload);
  return updateProduct(id, data);
}
