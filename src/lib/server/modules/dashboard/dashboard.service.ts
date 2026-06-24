import { launchProducts } from "@/lib/catalog";
import { getPrisma, hasDatabaseUrl } from "@/lib/server/db/prisma";

export async function getDashboardSummary() {
  if (!hasDatabaseUrl()) {
    return {
      totalOrders: 0,
      pendingOrders: 0,
      paidOrders: 0,
      activeRentals: 0,
      dueReturns: 0,
      overdueRentals: 0,
      availableInventory: launchProducts.reduce((sum, product) => sum + product.availableQty, 0),
      rentedInventory: 0,
      pendingDocuments: 0,
      revenue: 0
    };
  }

  const prisma = getPrisma();
  const [
    totalOrders,
    pendingOrders,
    paidOrders,
    activeRentals,
    dueReturns,
    availableInventory,
    rentedInventory,
    pendingDocuments,
    paidPayments
  ] = await Promise.all([
    prisma.rentalOrder.count(),
    prisma.rentalOrder.count({ where: { status: { in: ["SUBMITTED", "UNDER_REVIEW", "PAYMENT_PENDING"] } } }),
    prisma.rentalOrder.count({ where: { paymentStatus: "PAID" } }),
    prisma.rentalOrder.count({ where: { status: "ACTIVE_RENTAL" } }),
    prisma.rentalOrder.count({ where: { status: "RETURN_DUE" } }),
    prisma.inventoryUnit.count({ where: { status: "AVAILABLE" } }),
    prisma.inventoryUnit.count({ where: { status: "RENTED" } }),
    prisma.customerDocument.count({ where: { reviewStatus: "PENDING" } }),
    prisma.payment.findMany({ where: { status: "PAID" }, select: { amount: true } })
  ]);

  return {
    totalOrders,
    pendingOrders,
    paidOrders,
    activeRentals,
    dueReturns,
    overdueRentals: 0,
    availableInventory,
    rentedInventory,
    pendingDocuments,
    revenue: paidPayments.reduce((sum, payment) => sum + Number(payment.amount), 0)
  };
}
