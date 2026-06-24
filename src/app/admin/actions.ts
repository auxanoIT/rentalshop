"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { requireAdminPage } from "@/lib/server/auth/page";
import { hasDatabaseUrl } from "@/lib/server/db/prisma";
import { recordAuditLog } from "@/lib/server/modules/audit/audit.service";
import { createAdminCategory } from "@/lib/server/modules/categories/category.service";
import { updateDelivery } from "@/lib/server/modules/deliveries/delivery.service";
import { updateAdminDocumentReview } from "@/lib/server/modules/documents/document.service";
import { updateInventoryUnit } from "@/lib/server/modules/inventory/inventory.service";
import { updateAdminOrder } from "@/lib/server/modules/orders/order.service";
import { updatePaymentStatus } from "@/lib/server/modules/payments/payment.repository";
import {
  createAdminProduct,
  updateAdminProduct
} from "@/lib/server/modules/products/product.service";
import { updateAdminPricingRules } from "@/lib/server/modules/pricing/pricing.service";
import { updateReturnRecord } from "@/lib/server/modules/returns/return.service";
import { updateBusinessSettings } from "@/lib/server/modules/settings/settings.service";
import { updateSpecialRequest } from "@/lib/server/modules/special-requests/special-request.service";

function text(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function optionalText(formData: FormData, key: string) {
  const value = text(formData, key);
  return value.length > 0 ? value : undefined;
}

function optionalNumber(formData: FormData, key: string) {
  const value = text(formData, key);
  return value.length > 0 ? Number(value) : undefined;
}

function redirectIfNoDatabase(path: string) {
  if (!hasDatabaseUrl()) {
    redirect(`${path}?error=database`);
  }
}

function productPayloadFromForm(formData: FormData) {
  return {
    categoryId: text(formData, "categoryId"),
    name: text(formData, "name"),
    slug: text(formData, "slug"),
    shortDesc: optionalText(formData, "shortDesc"),
    description: optionalText(formData, "description"),
    status: text(formData, "status"),
    rentable: formData.has("rentable"),
    sellable: formData.has("sellable"),
    imageUrl: optionalText(formData, "imageUrl"),
    imageAlt: optionalText(formData, "imageAlt"),
    dailyRate: Number(text(formData, "dailyRate")),
    weeklyRate: optionalNumber(formData, "weeklyRate"),
    monthlyRate: optionalNumber(formData, "monthlyRate"),
    availableQty: Number(text(formData, "availableQty")),
    specs: {
      brand: optionalText(formData, "brand"),
      model: optionalText(formData, "model"),
      processor: optionalText(formData, "processor"),
      ram: optionalText(formData, "ram"),
      storage: optionalText(formData, "storage"),
      operatingSystem: optionalText(formData, "operatingSystem"),
      screenSize: optionalText(formData, "screenSize"),
      condition: optionalText(formData, "condition")
    }
  };
}

export async function createProductAction(formData: FormData) {
  const session = await requireAdminPage();
  redirectIfNoDatabase("/admin/products/new");

  const product = await createAdminProduct(productPayloadFromForm(formData));
  await recordAuditLog(session, {
    action: "product.create",
    entityType: "Product",
    entityId: product.id,
    metadata: { name: product.name, slug: product.slug }
  });

  revalidatePath("/admin/products");
  revalidatePath("/equipment");
  redirect(`/admin/products/${product.id}?saved=1`);
}

export async function updateProductAction(id: string, formData: FormData) {
  const session = await requireAdminPage();
  redirectIfNoDatabase(`/admin/products/${id}`);

  const product = await updateAdminProduct(id, productPayloadFromForm(formData));
  await recordAuditLog(session, {
    action: "product.update",
    entityType: "Product",
    entityId: id,
    metadata: { name: product.name, slug: product.slug }
  });

  revalidatePath("/admin/products");
  revalidatePath(`/admin/products/${id}`);
  revalidatePath("/equipment");
  redirect(`/admin/products/${id}?saved=1`);
}

export async function createCategoryAction(formData: FormData) {
  const session = await requireAdminPage();
  redirectIfNoDatabase("/admin/categories");

  const category = await createAdminCategory({
    name: text(formData, "name"),
    slug: text(formData, "slug"),
    description: optionalText(formData, "description"),
    status: text(formData, "status")
  });

  await recordAuditLog(session, {
    action: "category.create",
    entityType: "Category",
    entityId: category.id,
    metadata: { name: category.name, slug: category.slug }
  });

  revalidatePath("/admin/categories");
  revalidatePath("/equipment");
  redirect("/admin/categories?saved=1");
}

export async function updatePricingRulesAction(formData: FormData) {
  const session = await requireAdminPage();
  redirectIfNoDatabase("/admin/pricing-rules");

  const rule = await updateAdminPricingRules({
    name: optionalText(formData, "name") ?? "Default rental pricing",
    minDaysSingleUnit: text(formData, "minDaysSingleUnit"),
    bulkThreshold: text(formData, "bulkThreshold"),
    minDaysBulk: text(formData, "minDaysBulk"),
    maxStandardDays: text(formData, "maxStandardDays"),
    bulkDiscountPercent: text(formData, "bulkDiscountPercent"),
    deliveryFeeDefault: text(formData, "deliveryFeeDefault")
  });

  await recordAuditLog(session, {
    action: "pricing.update",
    entityType: "PricingRule",
    entityId: rule.id,
    metadata: { name: rule.name }
  });

  revalidatePath("/admin/pricing-rules");
  revalidatePath("/equipment");
  redirect("/admin/pricing-rules?saved=1");
}

export async function updateSettingsAction(formData: FormData) {
  const session = await requireAdminPage();
  redirectIfNoDatabase("/admin/settings");

  const settings = await updateBusinessSettings({
    contact: {
      email: text(formData, "email"),
      phone: optionalText(formData, "phone"),
      market: optionalText(formData, "market") ?? "Nigeria"
    },
    bankTransfer: {
      details: optionalText(formData, "bank")
    },
    emailTemplates: {
      notes: optionalText(formData, "emailTemplates")
    }
  });

  await recordAuditLog(session, {
    action: "settings.update",
    entityType: "BusinessSetting",
    metadata: { contactEmail: settings.contact.email }
  });

  revalidatePath("/admin/settings");
  redirect("/admin/settings?saved=1");
}

export async function updateOrderAction(id: string, formData: FormData) {
  const session = await requireAdminPage();
  redirectIfNoDatabase(`/admin/orders/${id}`);

  const order = await updateAdminOrder(id, {
    status: text(formData, "status"),
    paymentStatus: text(formData, "paymentStatus"),
    adminNotes: optionalText(formData, "adminNotes")
  });

  await recordAuditLog(session, {
    action: "order.update",
    entityType: "RentalOrder",
    entityId: id,
    metadata: { reference: "reference" in order ? order.reference : id }
  });

  revalidatePath("/admin/orders");
  revalidatePath(`/admin/orders/${id}`);
  redirect(`/admin/orders/${id}?saved=1`);
}

export async function updateInventoryAction(id: string, formData: FormData) {
  const session = await requireAdminPage();
  redirectIfNoDatabase("/admin/inventory");

  const unit = await updateInventoryUnit(id, {
    status: text(formData, "status"),
    condition: optionalText(formData, "condition"),
    notes: optionalText(formData, "notes")
  });

  await recordAuditLog(session, {
    action: "inventory.update",
    entityType: "InventoryUnit",
    entityId: id,
    metadata: { serialNo: unit.serialNo, status: unit.status }
  });

  revalidatePath("/admin/inventory");
  redirect("/admin/inventory?saved=1");
}

export async function updateDocumentAction(id: string, formData: FormData) {
  const session = await requireAdminPage();
  redirectIfNoDatabase("/admin/documents");

  const document = await updateAdminDocumentReview(id, {
    reviewStatus: text(formData, "reviewStatus"),
    adminNote: optionalText(formData, "adminNote")
  });

  await recordAuditLog(session, {
    action: "document.review",
    entityType: "CustomerDocument",
    entityId: id,
    metadata: { fileName: document.fileName, reviewStatus: document.reviewStatus }
  });

  revalidatePath("/admin/documents");
  redirect("/admin/documents?saved=1");
}

export async function updatePaymentAction(id: string, formData: FormData) {
  const session = await requireAdminPage();
  redirectIfNoDatabase("/admin/payments");

  const payment = await updatePaymentStatus(id, {
    status: text(formData, "status")
  });

  await recordAuditLog(session, {
    action: "payment.update",
    entityType: "Payment",
    entityId: id,
    metadata: { reference: payment.reference, status: payment.status }
  });

  revalidatePath("/admin/payments");
  revalidatePath("/admin/orders");
  redirect("/admin/payments?saved=1");
}

export async function updateDeliveryAction(id: string, formData: FormData) {
  const session = await requireAdminPage();
  redirectIfNoDatabase("/admin/deliveries");

  const delivery = await updateDelivery(id, {
    status: text(formData, "status"),
    scheduledAt: optionalText(formData, "scheduledAt"),
    deliveredAt: optionalText(formData, "deliveredAt"),
    notes: optionalText(formData, "notes")
  });

  await recordAuditLog(session, {
    action: "delivery.update",
    entityType: "Delivery",
    entityId: id,
    metadata: { orderReference: delivery.order.reference, status: delivery.status }
  });

  revalidatePath("/admin/deliveries");
  revalidatePath("/admin/orders");
  redirect("/admin/deliveries?saved=1");
}

export async function updateReturnAction(id: string, formData: FormData) {
  const session = await requireAdminPage();
  redirectIfNoDatabase("/admin/returns");

  const returnRecord = await updateReturnRecord(id, {
    status: text(formData, "status"),
    receivedAt: optionalText(formData, "receivedAt"),
    inspectionNotes: optionalText(formData, "inspectionNotes"),
    damageFee: optionalNumber(formData, "damageFee")
  });

  await recordAuditLog(session, {
    action: "return.update",
    entityType: "ReturnRecord",
    entityId: id,
    metadata: { orderReference: returnRecord.order.reference, status: returnRecord.status }
  });

  revalidatePath("/admin/returns");
  revalidatePath("/admin/orders");
  redirect("/admin/returns?saved=1");
}

export async function updateSpecialRequestAction(id: string, formData: FormData) {
  const session = await requireAdminPage();
  redirectIfNoDatabase("/admin/special-requests");

  const request = await updateSpecialRequest(id, {
    status: text(formData, "status"),
    adminNotes: optionalText(formData, "adminNotes")
  });

  await recordAuditLog(session, {
    action: "special-request.update",
    entityType: "SpecialRequest",
    entityId: id,
    metadata: { email: request.email, status: request.status }
  });

  revalidatePath("/admin/special-requests");
  redirect("/admin/special-requests?saved=1");
}
