import Link from "next/link";

import { AdminShell } from "@/components/admin/admin-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { requireAdminPage } from "@/lib/server/auth/page";
import { hasDatabaseUrl } from "@/lib/server/db/prisma";
import { listAdminOrders } from "@/lib/server/modules/orders/order.service";
import { formatNaira } from "@/lib/utils";

type AdminOrderRow = {
  id: string;
  reference: string;
  customer?: { name?: string | null } | null;
  status: string;
  paymentStatus: string;
  total: unknown;
};

export default async function AdminOrdersPage() {
  const session = await requireAdminPage();
  const orders = (await listAdminOrders()) as AdminOrderRow[];
  const databaseReady = hasDatabaseUrl();

  return (
    <AdminShell session={session}>
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-2xl font-semibold">Orders</h2>
        {!databaseReady ? (
          <Button asChild variant="outline">
            <Link href="/admin/orders/demo">Open demo detail</Link>
          </Button>
        ) : null}
      </div>
      <div className="mt-5 rounded-lg border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Reference</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Payment</TableHead>
              <TableHead>Total</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-muted-foreground">
                  No database orders yet. Guest checkout will populate this table after Neon is connected.
                </TableCell>
              </TableRow>
            ) : (
              orders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell>
                    <Link href={`/admin/orders/${order.id}`} className="font-medium hover:underline">
                      {order.reference}
                    </Link>
                  </TableCell>
                  <TableCell>{order.customer?.name}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{order.status}</Badge>
                  </TableCell>
                  <TableCell>{order.paymentStatus}</TableCell>
                  <TableCell>{formatNaira(Number(order.total))}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </AdminShell>
  );
}
