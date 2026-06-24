import type { Prisma } from "@prisma/client";

import { getPrisma, hasDatabaseUrl } from "@/lib/server/db/prisma";

export async function listOrders() {
  if (!hasDatabaseUrl()) {
    return [];
  }

  return getPrisma().rentalOrder.findMany({
    include: {
      customer: true,
      items: { include: { variant: true } },
      payments: true,
      documents: true,
      delivery: true,
      returnRecord: true
    },
    orderBy: { createdAt: "desc" },
    take: 100
  });
}

export async function findOrderById(id: string) {
  if (!hasDatabaseUrl()) {
    return null;
  }

  return getPrisma().rentalOrder.findUnique({
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
}

export async function updateOrder(id: string, data: Prisma.RentalOrderUpdateInput) {
  return getPrisma().rentalOrder.update({
    where: { id },
    data
  });
}
