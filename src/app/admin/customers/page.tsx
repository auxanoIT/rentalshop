import Link from "next/link";

import { AdminShell } from "@/components/admin/admin-shell";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { requireAdminPage } from "@/lib/server/auth/page";
import { listCustomers } from "@/lib/server/modules/customers/customer.service";
import { formatNaira } from "@/lib/utils";

type CustomerRow = {
  id: string;
  customerType: string;
  name: string;
  companyName?: string | null;
  phone: string;
  email: string;
  city?: string | null;
  state?: string | null;
  orders: Array<{ id: string; reference: string; total: unknown; status: string }>;
  documents: Array<{ id: string; reviewStatus: string }>;
};

export default async function AdminCustomersPage() {
  const session = await requireAdminPage();
  const customers = (await listCustomers()) as CustomerRow[];

  return (
    <AdminShell session={session}>
      <h2 className="text-2xl font-semibold">Customers</h2>
      <div className="mt-5 rounded-lg border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Customer</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Orders</TableHead>
              <TableHead>Documents</TableHead>
              <TableHead>Latest order</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {customers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-muted-foreground">
                  No customer profiles yet. Guest checkout will populate this view after Neon is connected.
                </TableCell>
              </TableRow>
            ) : (
              customers.map((customer) => {
                const latestOrder = customer.orders[0];
                return (
                  <TableRow key={customer.id}>
                    <TableCell>
                      <p className="font-medium">{customer.companyName ?? customer.name}</p>
                      <p className="text-sm text-muted-foreground">{customer.customerType}</p>
                    </TableCell>
                    <TableCell>
                      <p>{customer.email}</p>
                      <p className="text-sm text-muted-foreground">{customer.phone}</p>
                    </TableCell>
                    <TableCell>{customer.orders.length}</TableCell>
                    <TableCell>
                      <Badge variant={customer.documents.some((document) => document.reviewStatus === "PENDING") ? "warning" : "outline"}>
                        {customer.documents.length}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {latestOrder ? (
                        <Link href={`/admin/orders/${latestOrder.id}`} className="font-medium hover:underline">
                          {latestOrder.reference} - {formatNaira(Number(latestOrder.total))}
                        </Link>
                      ) : (
                        "-"
                      )}
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
