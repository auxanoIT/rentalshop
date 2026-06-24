import { AdminShell } from "@/components/admin/admin-shell";
import { StatCard } from "@/components/admin/stat-card";
import { requireAdminPage } from "@/lib/server/auth/page";
import { getDashboardSummary } from "@/lib/server/modules/dashboard/dashboard.service";

export default async function AdminDashboardPage() {
  const session = await requireAdminPage();
  const summary = await getDashboardSummary();

  return (
    <AdminShell session={session}>
      <div>
        <h2 className="text-2xl font-semibold">Dashboard</h2>
        <div className="mt-5 grid gap-4 md:grid-cols-3 xl:grid-cols-4">
          <StatCard label="Total orders" value={summary.totalOrders} />
          <StatCard label="Pending orders" value={summary.pendingOrders} />
          <StatCard label="Paid orders" value={summary.paidOrders} />
          <StatCard label="Active rentals" value={summary.activeRentals} />
          <StatCard label="Due returns" value={summary.dueReturns} />
          <StatCard label="Overdue rentals" value={summary.overdueRentals} />
          <StatCard label="Available inventory" value={summary.availableInventory} />
          <StatCard label="Rented inventory" value={summary.rentedInventory} />
          <StatCard label="Pending documents" value={summary.pendingDocuments} />
          <StatCard label="Revenue" value={summary.revenue} currency />
        </div>
      </div>
    </AdminShell>
  );
}
