import { z } from "zod";

import { orderStatuses, paymentStatuses } from "@/lib/server/modules/orders/order.status";

export const orderItemSchema = z.object({
  productSlug: z.string().min(1),
  quantity: z.coerce.number().int().positive()
});

export const createOrderSchema = z.object({
  customerType: z.enum(["INDIVIDUAL", "COMPANY", "INSTITUTION"]),
  name: z.string().min(2),
  companyName: z.string().optional(),
  contactName: z.string().optional(),
  phone: z.string().min(7),
  email: z.string().email(),
  deliveryAddress: z.string().min(5),
  city: z.string().optional(),
  state: z.string().optional(),
  purpose: z.string().optional(),
  notes: z.string().optional(),
  rentalStartDate: z.coerce.date(),
  returnDate: z.coerce.date(),
  items: z.array(orderItemSchema).min(1),
  documentsMode: z.enum(["UPLOAD", "EMAIL_LATER"]).default("EMAIL_LATER"),
  paymentMethod: z.enum(["PAYSTACK", "BANK_TRANSFER"]).default("PAYSTACK"),
  agreementAccepted: z.literal(true)
});

export const updateOrderSchema = z.object({
  status: z.enum(orderStatuses).optional(),
  paymentStatus: z.enum(paymentStatuses).optional(),
  adminNotes: z.string().optional()
});
