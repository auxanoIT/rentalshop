import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

import { launchCategories, launchProducts } from "../src/lib/catalog";

const prisma = new PrismaClient();

async function main() {
  const saltRounds = Number(process.env.BCRYPT_SALT_ROUNDS ?? 12);
  const adminEmail = process.env.ADMIN_SEED_EMAIL ?? "admin@itshop.ng";
  const adminPassword = process.env.ADMIN_SEED_PASSWORD ?? "change-this-before-launch";
  const passwordHash = await bcrypt.hash(adminPassword, saltRounds);

  await prisma.adminUser.upsert({
    where: { email: adminEmail },
    update: { passwordHash, isActive: true },
    create: {
      name: process.env.ADMIN_SEED_NAME ?? "ITShop Admin",
      email: adminEmail,
      passwordHash,
      role: "SUPER_ADMIN"
    }
  });

  await prisma.pricingRule.upsert({
    where: { id: "default_pricing_rule" },
    update: {},
    create: {
      id: "default_pricing_rule",
      name: "Default rental pricing",
      minDaysSingleUnit: 7,
      bulkThreshold: 10,
      minDaysBulk: 2,
      maxStandardDays: 183,
      bulkDiscountRate: 0.05,
      deliveryFeeDefault: 0
    }
  });

  for (const category of launchCategories) {
    await prisma.category.upsert({
      where: { slug: category.slug },
      update: {
        name: category.name,
        description: category.description,
        status: category.status === "REQUEST_ONLY" ? "REQUEST_ONLY" : "ACTIVE",
        seoTitle: category.seoTitle,
        seoDescription: category.seoDescription
      },
      create: {
        id: category.id,
        name: category.name,
        slug: category.slug,
        description: category.description,
        status: category.status === "REQUEST_ONLY" ? "REQUEST_ONLY" : "ACTIVE",
        seoTitle: category.seoTitle,
        seoDescription: category.seoDescription
      }
    });
  }

  const laptopCategory = await prisma.category.findUniqueOrThrow({
    where: { slug: "laptops" }
  });

  for (const product of launchProducts) {
    const dbProduct = await prisma.product.upsert({
      where: { slug: product.slug },
      update: {
        name: product.name,
        shortDesc: product.shortDesc,
        description: product.description,
        status: product.status,
        rentable: product.rentable,
        sellable: product.sellable,
        seoTitle: product.seoTitle,
        seoDescription: product.seoDescription
      },
      create: {
        id: product.id,
        categoryId: laptopCategory.id,
        name: product.name,
        slug: product.slug,
        shortDesc: product.shortDesc,
        description: product.description,
        status: product.status,
        rentable: product.rentable,
        sellable: product.sellable,
        seoTitle: product.seoTitle,
        seoDescription: product.seoDescription,
        images: {
          create: {
            url: product.image,
            alt: product.imageAlt,
            sortOrder: 0
          }
        }
      }
    });

    const existingImage = await prisma.productImage.findFirst({
      where: { productId: dbProduct.id },
      orderBy: { sortOrder: "asc" }
    });

    if (existingImage) {
      await prisma.productImage.update({
        where: { id: existingImage.id },
        data: {
          url: product.image,
          alt: product.imageAlt,
          sortOrder: 0
        }
      });
    } else {
      await prisma.productImage.create({
        data: {
          productId: dbProduct.id,
          url: product.image,
          alt: product.imageAlt,
          sortOrder: 0
        }
      });
    }

    const variant = await prisma.productVariant.upsert({
      where: { slug: product.slug },
      update: {
        name: product.name,
        brand: product.specs.brand,
        model: product.specs.model,
        processor: product.specs.processor,
        ram: product.specs.ram,
        storage: product.specs.storage,
        operatingSystem: product.specs.operatingSystem,
        screenSize: product.specs.screenSize,
        condition: product.specs.condition,
        dailyRate: product.dailyRate,
        weeklyRate: product.weeklyRate,
        monthlyRate: product.monthlyRate,
        availableQty: product.availableQty
      },
      create: {
        productId: dbProduct.id,
        name: product.name,
        slug: product.slug,
        brand: product.specs.brand,
        model: product.specs.model,
        processor: product.specs.processor,
        ram: product.specs.ram,
        storage: product.specs.storage,
        operatingSystem: product.specs.operatingSystem,
        screenSize: product.specs.screenSize,
        condition: product.specs.condition,
        dailyRate: product.dailyRate,
        weeklyRate: product.weeklyRate,
        monthlyRate: product.monthlyRate,
        availableQty: product.availableQty
      }
    });

    const existingUnits = await prisma.inventoryUnit.count({
      where: { variantId: variant.id }
    });

    if (product.status === "ACTIVE" && existingUnits === 0) {
      await prisma.inventoryUnit.createMany({
        data: Array.from({ length: product.availableQty }, (_, index) => ({
          variantId: variant.id,
          serialNo: `${product.slug.toUpperCase().replace(/[^A-Z0-9]/g, "-")}-${String(index + 1).padStart(3, "0")}`,
          status: "AVAILABLE",
          condition: product.specs.condition
        }))
      });
    }
  }

  await prisma.businessSetting.upsert({
    where: { key: "business_contact" },
    update: {},
    create: {
      key: "business_contact",
      value: {
        email: "support@itshop.ng",
        site: "https://rent.itshop.ng",
        market: "Nigeria"
      }
    }
  });
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
