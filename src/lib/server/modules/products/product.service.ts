import { notFound } from "@/lib/server/errors";
import {
  createProduct,
  findAdminProductById,
  findPublicProductByIdentifier,
  findPublicProductBySlug,
  listAdminProducts,
  listActiveProductPaths,
  listPublicProductParams,
  listPublicProducts,
  listPublicProductsByCategorySlug,
  updateProduct
} from "@/lib/server/modules/products/product.repository";
import { productCreateSchema, productUpdateSchema } from "@/lib/server/modules/products/product.validation";

export async function getPublicProducts() {
  return listPublicProducts();
}

export async function getPublicProductsByCategory(categorySlug: string) {
  return listPublicProductsByCategorySlug(categorySlug);
}

export async function getPublicProductParams() {
  return listPublicProductParams();
}

export async function getActiveProductPaths() {
  return listActiveProductPaths();
}

export async function getAdminProducts() {
  return listAdminProducts();
}

export async function getPublicProduct(slug: string) {
  const product = await findPublicProductBySlug(slug);
  if (!product) throw notFound("Product not found");
  return product;
}

export async function getPublicProductByIdentifier(identifier: string) {
  const product = await findPublicProductByIdentifier(identifier);
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
