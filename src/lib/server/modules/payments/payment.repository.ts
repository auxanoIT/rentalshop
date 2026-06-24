import { z } from "zod";

import { getPrisma, hasDatabaseUrl } from "@/lib/server/db/prisma";
import { paymentStatuses } from "@/lib/server/modules/orders/order.status";

export { paymentStatuses };

const paymentStatusUpdateSchema = z.object({
  status: z.enum(paymentStatuses)
});

export async function createPaystackPaymentRecord(params: {
  orderId: string;
  amount: number;
  reference: string;
  rawResponse?: unknown;
}) {
  if (!hasDatabaseUrl()) {
    return {
      id: `local_payment_${Date.now()}`,
      provider: "PAYSTACK",
      method: "CARD",
      status: "PENDING",
      ...params
    };
  }

  return getPrisma().payment.upsert({
    where: { reference: params.reference },
    update: {
      rawResponse: params.rawResponse as object
    },
    create: {
      orderId: params.orderId,
      provider: "PAYSTACK",
      method: "CARD",
      amount: params.amount,
      status: "PENDING",
      reference: params.reference,
      rawResponse: params.rawResponse as object
    }
  });
}

export async function markPaymentPaid(reference: string, rawResponse: unknown) {
  if (!hasDatabaseUrl()) {
    return { reference, status: "PAID", rawResponse };
  }

  const payment = await getPrisma().payment.update({
    where: { reference },
    data: {
      status: "PAID",
      rawResponse: rawResponse as object,
      order: {
        update: {
          paymentStatus: "PAID",
          status: "PAID"
        }
      }
    }
  });

  return payment;
}

export async function listPayments() {
  if (!hasDatabaseUrl()) return [];

  return getPrisma().payment.findMany({
    include: { order: { include: { customer: true } } },
    orderBy: { createdAt: "desc" },
    take: 100
  });
}

export async function updatePaymentStatus(id: string, payload: unknown) {
  const { status } = paymentStatusUpdateSchema.parse(payload);
  const prisma = getPrisma();

  return prisma.$transaction(async (tx) => {
    const payment = await tx.payment.update({
      where: { id },
      data: { status },
      include: { order: true }
    });

    await tx.rentalOrder.update({
      where: { id: payment.orderId },
      data: {
        paymentStatus: status,
        ...(status === "PAID" ? { status: "PAID" } : {})
      }
    });

    return tx.payment.findUniqueOrThrow({
      where: { id },
      include: { order: { include: { customer: true } } }
    });
  });
}
