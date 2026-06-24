import { getPrisma, hasDatabaseUrl } from "@/lib/server/db/prisma";

export async function listCustomers() {
  if (!hasDatabaseUrl()) return [];

  return getPrisma().customer.findMany({
    include: {
      orders: {
        select: {
          id: true,
          reference: true,
          total: true,
          status: true,
          createdAt: true
        },
        orderBy: { createdAt: "desc" }
      },
      documents: {
        select: {
          id: true,
          reviewStatus: true
        }
      }
    },
    orderBy: { createdAt: "desc" },
    take: 100
  });
}
