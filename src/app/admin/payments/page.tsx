import Link from "next/link";

import { updatePaymentAction } from "@/app/admin/actions";
import { AdminShell } from "@/components/admin/admin-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { requireAdminPage } from "@/lib/server/auth/page";
import { hasDatabaseUrl } from "@/lib/server/db/prisma";
import { listPayments, paymentStatuses } from "@/lib/server/modules/payments/payment.repository";
import { formatNaira } from "@/lib/utils";

type PaymentRow = {
  id: string;
  provider: string;
  method: string;
  amount: unknown;
  status: string;
  reference: string;
  order?: {
    id: string;
    reference: string;
    customer?: { name?: string | null } | null;
  } | null;
};

export default async function AdminPaymentsPage({
  searchParams
}: {
  searchParams?: Promise<{ error?: string; saved?: string }>;
}) {
  const session = await requireAdminPage();
  const [payments, query] = await Promise.all([
    listPayments() as Promise<PaymentRow[]>,
    searchParams ? searchParams : Promise.resolve({} as { error?: string; saved?: string })
  ]);
  const databaseReady = hasDatabaseUrl();

  return (
    <AdminShell session={session}>
      <h2 className="text-2xl font-semibold">Payments</h2>
      {query.saved ? (
        <div className="mt-4 rounded-md border border-[#b8e2c7] bg-[#edfdf3] px-4 py-3 text-sm text-[#166534]">
          Payment status saved.
        </div>
      ) : null}
      <div className="mt-5 rounded-lg border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Reference</TableHead>
              <TableHead>Order</TableHead>
              <TableHead>Method</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Update</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {payments.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-muted-foreground">
                  No payment records yet. Paystack and bank transfer checkout will populate this view after Neon is connected.
                </TableCell>
              </TableRow>
            ) : (
              payments.map((payment) => {
                const updateAction = updatePaymentAction.bind(null, payment.id);
                return (
                  <TableRow key={payment.id}>
                    <TableCell className="font-medium">{payment.reference}</TableCell>
                    <TableCell>
                      {payment.order ? (
                        <Link href={`/admin/orders/${payment.order.id}`} className="hover:underline">
                          {payment.order.reference}
                        </Link>
                      ) : (
                        "-"
                      )}
                    </TableCell>
                    <TableCell>{payment.provider} / {payment.method}</TableCell>
                    <TableCell>{formatNaira(Number(payment.amount))}</TableCell>
                    <TableCell>
                      <Badge variant={payment.status === "PAID" ? "success" : "warning"}>{payment.status}</Badge>
                    </TableCell>
                    <TableCell>
                      <form action={updateAction} className="flex min-w-56 gap-2">
                        <Select name="status" defaultValue={payment.status} disabled={!databaseReady}>
                          {paymentStatuses.map((status) => (
                            <option key={status} value={status}>
                              {status}
                            </option>
                          ))}
                        </Select>
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
