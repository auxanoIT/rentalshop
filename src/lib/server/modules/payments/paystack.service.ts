import crypto from "node:crypto";

import { z } from "zod";

import { getPrisma, hasDatabaseUrl } from "@/lib/server/db/prisma";
import { badRequest, notFound } from "@/lib/server/errors";
import { createPaystackPaymentRecord, markPaymentPaid } from "@/lib/server/modules/payments/payment.repository";

export const paystackInitiateSchema = z.object({
  orderId: z.string().min(1),
  email: z.string().email()
});

export async function initiatePaystackPayment(payload: unknown) {
  const input = paystackInitiateSchema.parse(payload);
  const reference = `PS-${Date.now()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;

  let amount = 0;
  if (hasDatabaseUrl()) {
    const order = await getPrisma().rentalOrder.findUnique({
      where: { id: input.orderId },
      select: { total: true }
    });
    if (!order) throw notFound("Order not found");
    amount = Number(order.total);
  } else {
    amount = 5000;
  }

  if (!process.env.PAYSTACK_SECRET_KEY) {
    await createPaystackPaymentRecord({
      orderId: input.orderId,
      amount,
      reference,
      rawResponse: { mock: true }
    });
    return {
      reference,
      authorizationUrl: `/payment/success?reference=${reference}`,
      mock: true
    };
  }

  const response = await fetch("https://api.paystack.co/transaction/initialize", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      email: input.email,
      amount: Math.round(amount * 100),
      reference,
      callback_url: `${process.env.NEXT_PUBLIC_SITE_URL}/payment/success`
    })
  });

  const data = await response.json();
  if (!response.ok || !data.status) {
    throw badRequest("Unable to initialize Paystack payment", data);
  }

  await createPaystackPaymentRecord({
    orderId: input.orderId,
    amount,
    reference,
    rawResponse: data
  });

  return {
    reference,
    authorizationUrl: data.data.authorization_url
  };
}

export function verifyPaystackSignature(rawBody: string, signature?: string | null) {
  if (!process.env.PAYSTACK_WEBHOOK_SECRET) {
    return process.env.NODE_ENV !== "production";
  }

  const hash = crypto
    .createHmac("sha512", process.env.PAYSTACK_WEBHOOK_SECRET)
    .update(rawBody)
    .digest("hex");

  return hash === signature;
}

export async function handlePaystackWebhook(rawBody: string, signature?: string | null) {
  if (!verifyPaystackSignature(rawBody, signature)) {
    throw badRequest("Invalid Paystack webhook signature");
  }

  const event = JSON.parse(rawBody);
  if (event.event === "charge.success" && event.data?.reference) {
    await markPaymentPaid(event.data.reference, event);
  }

  return { received: true };
}
