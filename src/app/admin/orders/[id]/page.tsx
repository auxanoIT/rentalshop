import { updateOrderAction } from "@/app/admin/actions";
import { AdminShell } from "@/components/admin/admin-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { requireAdminPage } from "@/lib/server/auth/page";
import { hasDatabaseUrl } from "@/lib/server/db/prisma";
import { orderStatuses, paymentStatuses } from "@/lib/server/modules/orders/order.status";
import { getAdminOrder } from "@/lib/server/modules/orders/order.service";
import { formatNaira } from "@/lib/utils";

type AdminOrderDetail = {
  id?: string;
  reference: string;
  status: string;
  paymentStatus: string;
  total?: unknown;
  adminNotes?: string | null;
  customer?: { name?: string | null; email?: string | null; phone?: string | null } | null;
  items?: Array<{
    id: string;
    quantity: number;
    subtotal: unknown;
    variant?: { name?: string | null; product?: { name?: string | null } | null } | null;
  }>;
  payments?: Array<{ id: string; method: string; status: string; amount: unknown; reference: string }>;
  documents?: Array<{ id: string; documentType: string; reviewStatus: string; fileName: string }>;
  delivery?: { status: string; address: string; scheduledAt?: Date | string | null } | null;
  returnRecord?: { status: string; dueDate: Date | string; damageFee?: unknown } | null;
};

export default async function AdminOrderDetailPage({
  params,
  searchParams
}: {
  params: Promise<{ id: string }>;
  searchParams?: Promise<{ error?: string; saved?: string }>;
}) {
  const session = await requireAdminPage();
  const { id } = await params;
  const [order, query] = await Promise.all([
    getAdminOrder(id) as Promise<AdminOrderDetail>,
    searchParams ? searchParams : Promise.resolve({} as { error?: string; saved?: string })
  ]);
  const databaseReady = hasDatabaseUrl();
  const updateAction = updateOrderAction.bind(null, id);

  return (
    <AdminShell session={session}>
      <div className="flex flex-wrap items-center gap-3">
        <h2 className="text-2xl font-semibold">Order {order.reference}</h2>
        <Badge variant="outline">{order.status}</Badge>
      </div>
      {query.saved ? (
        <div className="mt-4 rounded-md border border-[#b8e2c7] bg-[#edfdf3] px-4 py-3 text-sm text-[#166534]">
          Order updated.
        </div>
      ) : null}
      {query.error === "database" ? (
        <div className="mt-4 rounded-md border border-[#f0d48a] bg-[#fff9e8] px-4 py-3 text-sm text-[#6f4a00]">
          Order changes require a configured Neon database.
        </div>
      ) : null}
      <div className="mt-5 grid gap-5 lg:grid-cols-[1fr_360px]">
        <div className="grid gap-4">
          <Card>
            <CardContent className="p-5">
              <h3 className="font-semibold">Customer</h3>
              <div className="mt-2 grid gap-1 text-sm text-muted-foreground">
                <p>{order.customer?.name ?? "Demo customer"}</p>
                {order.customer?.email ? <p>{order.customer.email}</p> : null}
                {order.customer?.phone ? <p>{order.customer.phone}</p> : null}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-5">
              <h3 className="font-semibold">Items</h3>
              <div className="mt-3 grid gap-3 text-sm">
                {order.items?.length ? (
                  order.items.map((item) => (
                    <div key={item.id} className="flex items-center justify-between gap-4 border-b pb-3 last:border-b-0 last:pb-0">
                      <div>
                        <p className="font-medium">{item.variant?.product?.name ?? item.variant?.name ?? "Rental item"}</p>
                        <p className="text-muted-foreground">Qty {item.quantity}</p>
                      </div>
                      <p>{formatNaira(Number(item.subtotal))}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-muted-foreground">Order items appear here after database records exist.</p>
                )}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="grid gap-4 p-5 text-sm md:grid-cols-2">
              <div>
                <h3 className="font-semibold">Payments</h3>
                <div className="mt-2 grid gap-1 text-muted-foreground">
                  {order.payments?.length ? (
                    order.payments.map((payment) => (
                      <p key={payment.id}>
                        {payment.method} - {payment.status} - {formatNaira(Number(payment.amount))}
                      </p>
                    ))
                  ) : (
                    <p>No payment record yet.</p>
                  )}
                </div>
              </div>
              <div>
                <h3 className="font-semibold">Documents</h3>
                <div className="mt-2 grid gap-1 text-muted-foreground">
                  {order.documents?.length ? (
                    order.documents.map((document) => (
                      <p key={document.id}>
                        {document.documentType} - {document.reviewStatus}
                      </p>
                    ))
                  ) : (
                    <p>No documents uploaded yet.</p>
                  )}
                </div>
              </div>
              <div>
                <h3 className="font-semibold">Delivery</h3>
                <p className="mt-2 text-muted-foreground">
                  {order.delivery ? `${order.delivery.status} - ${order.delivery.address}` : "Not scheduled"}
                </p>
              </div>
              <div>
                <h3 className="font-semibold">Return</h3>
                <p className="mt-2 text-muted-foreground">
                  {order.returnRecord ? `${order.returnRecord.status} - due ${new Date(order.returnRecord.dueDate).toLocaleDateString("en-NG")}` : "No return record"}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
        <form action={updateAction} className="grid h-fit gap-4 rounded-lg border bg-card p-5">
          <h3 className="font-semibold">Update order</h3>
          <Select name="status" defaultValue={order.status}>
            {orderStatuses.map((status) => (
              <option key={status}>{status}</option>
            ))}
          </Select>
          <Select name="paymentStatus" defaultValue={order.paymentStatus}>
            {paymentStatuses.map((status) => (
              <option key={status}>{status}</option>
            ))}
          </Select>
          <Textarea name="adminNotes" placeholder="Admin notes" defaultValue={order.adminNotes ?? ""} />
          <Button type="submit" disabled={!databaseReady}>
            Save order
          </Button>
        </form>
      </div>
    </AdminShell>
  );
}
