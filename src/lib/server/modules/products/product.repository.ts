import type { Prisma } from "@prisma/client";

import {
  getActiveProducts,
  getProductBySlug,
  getProductsByCategory,
  launchProducts,
  type LaunchProduct,
  type ProductStatus
} from "@/lib/catalog";
import { getPrisma, hasDatabaseUrl } from "@/lib/server/db/prisma";

type ProductWithRelations = Prisma.ProductGetPayload<{
  include: {
    category: true;
    images: true;
    variants: true;
  };
}>;

type ProductMutationData = {
  categoryId?: string;
  name?: string;
  slug?: string;
  shortDesc?: string;
  description?: string;
  status?: "ACTIVE" | "INACTIVE" | "REQUEST_ONLY" | "COMING_SOON";
  rentable?: boolean;
  sellable?: boolean;
  seoTitle?: string;
  seoDescription?: string;
  imageUrl?: string;
  imageAlt?: string;
  variantName?: string;
  variantSlug?: string;
  dailyRate?: number;
  weeklyRate?: number;
  monthlyRate?: number;
  availableQty?: number;
  specs?: Record<string, string | undefined>;
};

const publicProductStatuses: ProductStatus[] = ["ACTIVE", "REQUEST_ONLY"];

function listFallbackPublicProducts() {
  return launchProducts.filter((product) => publicProductStatuses.includes(product.status));
}

function mapDbProduct(product: ProductWithRelations, options: { publicView?: boolean } = {}): LaunchProduct {
  const variants = [...product.variants].sort(
    (a, b) => Number(a.dailyRate ?? 0) - Number(b.dailyRate ?? 0)
  );
  const variant = variants[0];
  const image = product.images[0];
  const status =
    options.publicView && product.status === "INACTIVE" ? "COMING_SOON" : product.status;

  return {
    id: product.id,
    categorySlug: product.category.slug,
    name: product.name,
    slug: product.slug,
    shortDesc: product.shortDesc ?? "",
    description: product.description ?? "",
    status,
    rentable: product.rentable,
    sellable: product.sellable,
    image: image?.url ?? "/placeholder-product.jpg",
    imageAlt: image?.alt ?? product.name,
    dailyRate: Number(variant?.dailyRate ?? 0),
    weeklyRate: variant?.weeklyRate ? Number(variant.weeklyRate) : undefined,
    monthlyRate: variant?.monthlyRate ? Number(variant.monthlyRate) : undefined,
    availableQty: variant?.availableQty ?? 0,
    variants: variants.map((item) => ({
      id: item.id,
      name: item.name,
      slug: item.slug,
      brand: item.brand ?? undefined,
      model: item.model ?? undefined,
      processor: item.processor ?? undefined,
      ram: item.ram ?? undefined,
      storage: item.storage ?? undefined,
      operatingSystem: item.operatingSystem ?? undefined,
      screenSize: item.screenSize ?? undefined,
      condition: item.condition ?? undefined,
      dailyRate: Number(item.dailyRate ?? 0),
      weeklyRate: item.weeklyRate ? Number(item.weeklyRate) : undefined,
      monthlyRate: item.monthlyRate ? Number(item.monthlyRate) : undefined,
      availableQty: item.availableQty ?? 0
    })),
    specs: {
      brand: variant?.brand ?? "",
      model: variant?.model ?? "",
      processor: variant?.processor ?? "",
      ram: variant?.ram ?? "",
      storage: variant?.storage ?? "",
      operatingSystem: variant?.operatingSystem ?? undefined,
      screenSize: variant?.screenSize ?? "",
      condition: variant?.condition ?? ""
    },
    seoTitle: product.seoTitle ?? product.name,
    seoDescription: product.seoDescription ?? product.shortDesc ?? ""
  };
}

export async function listPublicProducts() {
  if (!hasDatabaseUrl()) {
    return listFallbackPublicProducts();
  }

  try {
    const prisma = getPrisma();
    const products = await prisma.product.findMany({
      where: {
        status: { in: ["ACTIVE", "REQUEST_ONLY"] },
        category: { status: { not: "HIDDEN" } }
      },
      include: { category: true, images: true, variants: true },
      orderBy: { createdAt: "asc" }
    });

    return products.map((product) => mapDbProduct(product, { publicView: true }));
  } catch {
    return listFallbackPublicProducts();
  }
}

export async function listPublicProductsByCategorySlug(categorySlug: string) {
  if (!hasDatabaseUrl()) {
    return getProductsByCategory(categorySlug).filter((product) => publicProductStatuses.includes(product.status));
  }

  try {
    const prisma = getPrisma();
    const products = await prisma.product.findMany({
      where: {
        status: { in: ["ACTIVE", "REQUEST_ONLY"] },
        category: {
          slug: categorySlug,
          status: { not: "HIDDEN" }
        }
      },
      include: { category: true, images: true, variants: true },
      orderBy: { createdAt: "asc" }
    });

    return products.map((product) => mapDbProduct(product, { publicView: true }));
  } catch {
    return getProductsByCategory(categorySlug).filter((product) => publicProductStatuses.includes(product.status));
  }
}

export async function listAdminProducts() {
  if (!hasDatabaseUrl()) {
    return launchProducts;
  }

  const prisma = getPrisma();
  const products = await prisma.product.findMany({
    include: { category: true, images: true, variants: true },
    orderBy: { updatedAt: "desc" }
  });

  return products.map((product) => mapDbProduct(product));
}

export async function listActiveProductSlugs() {
  if (!hasDatabaseUrl()) {
    return getActiveProducts().map((product) => product.slug);
  }

  try {
    const prisma = getPrisma();
    const products = await prisma.product.findMany({
      where: { status: "ACTIVE" },
      select: { slug: true }
    });

    return products.map((product) => product.slug);
  } catch {
    return getActiveProducts().map((product) => product.slug);
  }
}

export async function listPublicProductParams() {
  if (!hasDatabaseUrl()) {
    return launchProducts
      .filter((product) => ["ACTIVE", "REQUEST_ONLY"].includes(product.status))
      .map((product) => ({
        categorySlug: product.categorySlug,
        productSlug: product.slug
      }));
  }

  try {
    const prisma = getPrisma();
    const products = await prisma.product.findMany({
      where: {
        status: { in: ["ACTIVE", "REQUEST_ONLY"] },
        category: { status: { not: "HIDDEN" } }
      },
      select: {
        slug: true,
        category: { select: { slug: true } }
      }
    });

    return products.map((product) => ({
      categorySlug: product.category.slug,
      productSlug: product.slug
    }));
  } catch {
    return launchProducts
      .filter((product) => publicProductStatuses.includes(product.status))
      .map((product) => ({
        categorySlug: product.categorySlug,
        productSlug: product.slug
      }));
  }
}

export async function listActiveProductPaths() {
  if (!hasDatabaseUrl()) {
    return getActiveProducts().map((product) => ({
      categorySlug: product.categorySlug,
      productSlug: product.slug
    }));
  }

  try {
    const prisma = getPrisma();
    const products = await prisma.product.findMany({
      where: {
        status: "ACTIVE",
        category: { status: "ACTIVE" }
      },
      select: {
        slug: true,
        category: { select: { slug: true } }
      }
    });

    return products.map((product) => ({
      categorySlug: product.category.slug,
      productSlug: product.slug
    }));
  } catch {
    return getActiveProducts().map((product) => ({
      categorySlug: product.categorySlug,
      productSlug: product.slug
    }));
  }
}

export async function findPublicProductBySlug(slug: string) {
  if (!hasDatabaseUrl()) {
    const product = getProductBySlug(slug);
    return product && publicProductStatuses.includes(product.status) ? product : null;
  }

  try {
    const prisma = getPrisma();
    const product = await prisma.product.findFirst({
      where: {
        slug,
        status: { in: ["ACTIVE", "REQUEST_ONLY"] },
        category: { status: { not: "HIDDEN" } }
      },
      include: { category: true, images: true, variants: true }
    });

    return product ? mapDbProduct(product, { publicView: true }) : null;
  } catch {
    const product = getProductBySlug(slug);
    return product && publicProductStatuses.includes(product.status) ? product : null;
  }
}

export async function findPublicProductByIdentifier(identifier: string) {
  if (!hasDatabaseUrl()) {
    const product = launchProducts.find((item) => item.id === identifier || item.slug === identifier);
    return product && publicProductStatuses.includes(product.status) ? product : null;
  }

  try {
    const prisma = getPrisma();
    const product = await prisma.product.findFirst({
      where: {
        OR: [{ id: identifier }, { slug: identifier }],
        status: { in: ["ACTIVE", "REQUEST_ONLY"] },
        category: { status: { not: "HIDDEN" } }
      },
      include: { category: true, images: true, variants: true }
    });

    return product ? mapDbProduct(product, { publicView: true }) : null;
  } catch {
    const product = launchProducts.find((item) => item.id === identifier || item.slug === identifier);
    return product && publicProductStatuses.includes(product.status) ? product : null;
  }
}

export async function findAdminProductById(id: string) {
  if (!hasDatabaseUrl()) {
    return launchProducts.find((product) => product.id === id) ?? null;
  }

  const prisma = getPrisma();
  const product = await prisma.product.findUnique({
    where: { id },
    include: { category: true, images: true, variants: true }
  });

  return product ? mapDbProduct(product) : null;
}

export async function createProduct(data: ProductMutationData & {
  categoryId: string;
  name: string;
  slug: string;
  dailyRate: number;
  availableQty: number;
}) {
  const prisma = getPrisma();
  return prisma.product.create({
    data: {
      category: { connect: { id: data.categoryId } },
      name: data.name,
      slug: data.slug,
      shortDesc: data.shortDesc,
      description: data.description,
      status: data.status ?? "ACTIVE",
      rentable: data.rentable ?? true,
      sellable: data.sellable ?? false,
      seoTitle: data.seoTitle,
      seoDescription: data.seoDescription,
      images: data.imageUrl
        ? {
            create: {
              url: data.imageUrl,
              alt: data.imageAlt || data.name,
              sortOrder: 0
            }
          }
        : undefined,
      variants: {
        create: {
          name: data.variantName || data.name,
          slug: data.variantSlug || data.slug,
          dailyRate: data.dailyRate,
          weeklyRate: data.weeklyRate,
          monthlyRate: data.monthlyRate,
          availableQty: data.availableQty,
          brand: data.specs?.brand,
          model: data.specs?.model,
          processor: data.specs?.processor,
          ram: data.specs?.ram,
          storage: data.specs?.storage,
          operatingSystem: data.specs?.operatingSystem,
          screenSize: data.specs?.screenSize,
          condition: data.specs?.condition
        }
      }
    }
  });
}

export async function updateProduct(id: string, data: ProductMutationData) {
  const prisma = getPrisma();
  const productData: Prisma.ProductUncheckedUpdateInput = {};

  if (data.categoryId !== undefined) productData.categoryId = data.categoryId;
  if (data.name !== undefined) productData.name = data.name;
  if (data.slug !== undefined) productData.slug = data.slug;
  if (data.shortDesc !== undefined) productData.shortDesc = data.shortDesc;
  if (data.description !== undefined) productData.description = data.description;
  if (data.status !== undefined) productData.status = data.status;
  if (data.rentable !== undefined) productData.rentable = data.rentable;
  if (data.sellable !== undefined) productData.sellable = data.sellable;
  if (data.seoTitle !== undefined) productData.seoTitle = data.seoTitle;
  if (data.seoDescription !== undefined) productData.seoDescription = data.seoDescription;

  const product = await prisma.product.update({
    where: { id },
    data: productData,
    include: { category: true, images: true, variants: true }
  });

  const hasVariantPatch =
    data.name !== undefined ||
    data.slug !== undefined ||
    data.variantName !== undefined ||
    data.variantSlug !== undefined ||
    data.dailyRate !== undefined ||
    data.weeklyRate !== undefined ||
    data.monthlyRate !== undefined ||
    data.availableQty !== undefined ||
    data.specs !== undefined;

  if (hasVariantPatch) {
    const variantData: Prisma.ProductVariantUncheckedUpdateInput = {};

    if (data.name !== undefined) variantData.name = data.name;
    if (data.slug !== undefined) variantData.slug = data.slug;
    if (data.variantName !== undefined) variantData.name = data.variantName;
    if (data.variantSlug !== undefined) variantData.slug = data.variantSlug;
    if (data.dailyRate !== undefined) variantData.dailyRate = data.dailyRate;
    if (data.weeklyRate !== undefined) variantData.weeklyRate = data.weeklyRate;
    if (data.monthlyRate !== undefined) variantData.monthlyRate = data.monthlyRate;
    if (data.availableQty !== undefined) variantData.availableQty = data.availableQty;
    if (data.specs?.brand !== undefined) variantData.brand = data.specs.brand;
    if (data.specs?.model !== undefined) variantData.model = data.specs.model;
    if (data.specs?.processor !== undefined) variantData.processor = data.specs.processor;
    if (data.specs?.ram !== undefined) variantData.ram = data.specs.ram;
    if (data.specs?.storage !== undefined) variantData.storage = data.specs.storage;
    if (data.specs?.operatingSystem !== undefined) {
      variantData.operatingSystem = data.specs.operatingSystem;
    }
    if (data.specs?.screenSize !== undefined) variantData.screenSize = data.specs.screenSize;
    if (data.specs?.condition !== undefined) variantData.condition = data.specs.condition;

    const variant = product.variants[0];
    if (variant) {
      await prisma.productVariant.update({
        where: { id: variant.id },
        data: variantData
      });
    } else {
      await prisma.productVariant.create({
        data: {
          productId: product.id,
          name: data.variantName ?? data.name ?? product.name,
          slug: data.variantSlug ?? data.slug ?? product.slug,
          dailyRate: data.dailyRate ?? 0,
          weeklyRate: data.weeklyRate,
          monthlyRate: data.monthlyRate,
          availableQty: data.availableQty ?? 0,
          brand: data.specs?.brand,
          model: data.specs?.model,
          processor: data.specs?.processor,
          ram: data.specs?.ram,
          storage: data.specs?.storage,
          operatingSystem: data.specs?.operatingSystem,
          screenSize: data.specs?.screenSize,
          condition: data.specs?.condition
        }
      });
    }
  }

  const hasImagePatch = data.imageUrl !== undefined || data.imageAlt !== undefined;
  if (hasImagePatch) {
    const image = product.images[0];
    const imageUrl = data.imageUrl?.trim();
    const imageAlt = data.imageAlt?.trim();

    if (image) {
      await prisma.productImage.update({
        where: { id: image.id },
        data: {
          ...(imageUrl ? { url: imageUrl } : {}),
          ...(imageAlt ? { alt: imageAlt } : {})
        }
      });
    } else if (imageUrl) {
      await prisma.productImage.create({
        data: {
          productId: product.id,
          url: imageUrl,
          alt: imageAlt || data.name || product.name,
          sortOrder: 0
        }
      });
    }
  }

  const updated = await prisma.product.findUniqueOrThrow({
    where: { id },
    include: { category: true, images: true, variants: true }
  });

  return mapDbProduct(updated);
}
