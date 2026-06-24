import { getProductBySlug } from "@/lib/catalog";
import { getPrisma, hasDatabaseUrl } from "@/lib/server/db/prisma";
import { badRequest, notFound } from "@/lib/server/errors";
import { sendAdminOrderAlert, sendOrderConfirmation } from "@/lib/server/modules/notifications/resend.service";
import { createOrderSchema, updateOrderSchema } from "@/lib/server/modules/orders/order.validation";
import { calculateRentalPrice } from "@/lib/server/modules/pricing/pricing.service";

function makeReference() {
  const date = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  const suffix = Math.random().toString(36).slice(2, 8).toUpperCase();
  return `REN-${date}-${suffix}`;
}

export async function createGuestOrder(payload: unknown) {
  const input = createOrderSchema.parse(payload);
  const rentalDays = Math.ceil(
    (input.returnDate.getTime() - input.rentalStartDate.getTime()) / 86_400_000
  );

  if (rentalDays <= 0) {
    throw badRequest("Return date must be after start date");
  }

  const pricedItems = await Promise.all(
    input.items.map(async (item) => {
      const price = await calculateRentalPrice({
        productSlug: item.productSlug,
        quantity: item.quantity,
        startDate: input.rentalStartDate,
        returnDate: input.returnDate
      });
      return { ...item, price };
    })
  );

  const subtotal = pricedItems.reduce((sum, item) => sum + item.price.subtotal, 0);
  const discount = pricedItems.reduce((sum, item) => sum + item.price.discount, 0);
  const deliveryFeeEstimate = pricedItems.reduce((sum, item) => sum + item.price.deliveryFeeEstimate, 0);
  const total = subtotal - discount + deliveryFeeEstimate;
  const reference = makeReference();

  if (!hasDatabaseUrl()) {
    const order = {
      id: `local_${reference}`,
      reference,
      customerId: `local_customer_${Date.now()}`,
      status: input.paymentMethod === "PAYSTACK" ? "PAYMENT_PENDING" : "UNDER_REVIEW",
      paymentStatus: input.paymentMethod === "PAYSTACK" ? "PENDING" : "MANUAL_REVIEW",
      total,
      subtotal,
      discount,
      deliveryFeeEstimate,
      rentalDays,
      customer: {
        name: input.name,
        email: input.email,
        phone: input.phone
      },
      items: pricedItems
    };
    await sendOrderConfirmation({ to: input.email, name: input.name, reference, total });
    await sendAdminOrderAlert({ reference, customerName: input.name, total });
    return order;
  }

  const prisma = getPrisma();
  const order = await prisma.$transaction(async (tx) => {
    const customer = await tx.customer.create({
      data: {
        customerType: input.customerType,
        name: input.name,
        companyName: input.companyName,
        contactName: input.contactName,
        phone: input.phone,
        email: input.email,
        address: input.deliveryAddress,
        city: input.city,
        state: input.state
      }
    });

    const dbOrder = await tx.rentalOrder.create({
      data: {
        reference,
        customerId: customer.id,
        status: input.paymentMethod === "PAYSTACK" ? "PAYMENT_PENDING" : "UNDER_REVIEW",
        paymentStatus: input.paymentMethod === "PAYSTACK" ? "PENDING" : "MANUAL_REVIEW",
        rentalStartDate: input.rentalStartDate,
        returnDate: input.returnDate,
        rentalDays,
        deliveryAddress: input.deliveryAddress,
        city: input.city,
        state: input.state,
        purpose: input.purpose,
        subtotal,
        discount,
        deliveryFeeEstimate,
        total,
        agreementAccepted: input.agreementAccepted,
        adminNotes: input.notes,
        delivery: {
          create: {
            address: input.deliveryAddress,
            city: input.city,
            state: input.state
          }
        },
        returnRecord: {
          create: {
            dueDate: input.returnDate
          }
        }
      }
    });

    for (const item of pricedItems) {
      const variant = await tx.productVariant.findUnique({
        where: { slug: item.productSlug }
      });

      if (!variant) {
        throw notFound(`Variant ${item.productSlug} not found`);
      }

      await tx.rentalOrderItem.create({
        data: {
          orderId: dbOrder.id,
          variantId: variant.id,
          quantity: item.quantity,
          dailyRate: item.price.dailyRate,
          rentalDays,
          subtotal: item.price.subtotal
        }
      });
    }

    if (input.paymentMethod === "BANK_TRANSFER") {
      await tx.payment.create({
        data: {
          orderId: dbOrder.id,
          provider: "BANK_TRANSFER",
          method: "BANK_TRANSFER",
          amount: total,
          status: "MANUAL_REVIEW",
          reference: `BT-${reference}`
        }
      });
    }

    return dbOrder;
  });

  await sendOrderConfirmation({ to: input.email, name: input.name, reference, total });
  await sendAdminOrderAlert({ reference, customerName: input.name, total });

  return order;
}

export async function listAdminOrders() {
  if (!hasDatabaseUrl()) return [];
  return getPrisma().rentalOrder.findMany({
    include: { customer: true, items: true, payments: true, documents: true },
    orderBy: { createdAt: "desc" },
    take: 100
  });
}

export async function getAdminOrder(id: string) {
  if (!hasDatabaseUrl()) {
    const product = getProductBySlug("dell-latitude-core-i5-8gb-256gb");
    return {
      id,
      reference: "REN-LOCAL-DEMO",
      status: "SUBMITTED",
      paymentStatus: "PENDING",
      total: product?.dailyRate ?? 5000
    };
  }

  const order = await getPrisma().rentalOrder.findUnique({
    where: { id },
    include: {
      customer: true,
      items: { include: { variant: { include: { product: true } } } },
      payments: true,
      documents: true,
      delivery: true,
      returnRecord: true
    }
  });

  if (!order) throw notFound("Order not found");
  return order;
}

export async function updateAdminOrder(id: string, payload: unknown) {
  const input = updateOrderSchema.parse(payload);
  if (!hasDatabaseUrl()) {
    return { id, ...input };
  }

  return getPrisma().rentalOrder.update({
    where: { id },
    data: input
  });
}
