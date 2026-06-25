import Link from "next/link";

import { updateDeliveryAction } from "@/app/admin/actions";
import { AdminShell } from "@/components/admin/admin-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { requireAdminPage } from "@/lib/server/auth/page";
import { hasDatabaseUrl } from "@/lib/server/db/prisma";
import { deliveryStatuses, listDeliveries } from "@/lib/server/modules/deliveries/delivery.service";

type DeliveryRow = {
  id: string;
  status: string;
  address: string;
  city?: string | null;
  state?: string | null;
  scheduledAt?: Date | string | null;
  deliveredAt?: Date | string | null;
  notes?: string | null;
  order: {
    id: string;
    reference: string;
    customer?: { name?: string | null } | null;
  };
};

function dateInputValue(value?: Date | string | null) {
  if (!value) return "";
  return new Date(value).toISOString().slice(0, 16);
}

export default async function AdminDeliveriesPage({
  searchParams
}: {
  searchParams?: Promise<{ error?: string; saved?: string }>;
}) {
  const session = await requireAdminPage();
  const [deliveries, query] = await Promise.all([
    listDeliveries() as Promise<DeliveryRow[]>,
    searchParams ? searchParams : Promise.resolve({} as { error?: string; saved?: string })
  ]);
  const databaseReady = hasDatabaseUrl();

  return (
    <AdminShell session={session}>
      <h2 className="text-2xl font-semibold">Deliveries</h2>
      {query.saved ? (
        <div className="mt-4 rounded-md border border-[#b8e2c7] bg-[#edfdf3] px-4 py-3 text-sm text-[#166534]">
          Delivery updated.
        </div>
      ) : null}
      <div className="mt-5 rounded-lg border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order</TableHead>
              <TableHead>Address</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Schedule</TableHead>
              <TableHead>Update</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {deliveries.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-muted-foreground">
                  No delivery records yet. Checkout creates delivery records with each order after Neon is connected.
                </TableCell>
              </TableRow>
            ) : (
              deliveries.map((delivery) => {
                const updateAction = updateDeliveryAction.bind(null, delivery.id);
                return (
                  <TableRow key={delivery.id}>
                    <TableCell>
                      <Link href={`/admin/orders/${delivery.order.id}`} className="font-medium hover:underline">
                        {delivery.order.reference}
                      </Link>
                      <p className="text-sm text-muted-foreground">{delivery.order.customer?.name}</p>
                    </TableCell>
                    <TableCell>{[delivery.address, delivery.city, delivery.state].filter(Boolean).join(", ")}</TableCell>
                    <TableCell>
                      <Badge variant={delivery.status === "DELIVERED" ? "success" : "warning"}>{delivery.status}</Badge>
                    </TableCell>
                    <TableCell>{delivery.scheduledAt ? new Date(delivery.scheduledAt).toLocaleString("en-NG") : "-"}</TableCell>
                    <TableCell>
                      <form action={updateAction} className="grid min-w-[680px] gap-2 md:grid-cols-[150px_1fr_1fr_1fr_auto]">
                        <Select name="status" defaultValue={delivery.status} disabled={!databaseReady}>
                          {deliveryStatuses.map((status) => (
                            <option key={status} value={status}>
                              {status}
                            </option>
                          ))}
                        </Select>
                        <Input name="scheduledAt" type="datetime-local" defaultValue={dateInputValue(delivery.scheduledAt)} disabled={!databaseReady} />
                        <Input name="deliveredAt" type="datetime-local" defaultValue={dateInputValue(delivery.deliveredAt)} disabled={!databaseReady} />
                        <Input name="notes" defaultValue={delivery.notes ?? ""} placeholder="Delivery notes" disabled={!databaseReady} />
                        <Button type="submit" size="sm" disabled={!databaseReady}>
                          Save
                        </Button>
                      </form>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>
    </AdminShell>
  );
}
