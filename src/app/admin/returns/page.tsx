import Link from "next/link";

import { updateReturnAction } from "@/app/admin/actions";
import { AdminShell } from "@/components/admin/admin-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { requireAdminPage } from "@/lib/server/auth/page";
import { hasDatabaseUrl } from "@/lib/server/db/prisma";
import { listReturns, returnStatuses } from "@/lib/server/modules/returns/return.service";
import { formatNaira } from "@/lib/utils";

type ReturnRow = {
  id: string;
  status: string;
  dueDate: Date | string;
  receivedAt?: Date | string | null;
  inspectionNotes?: string | null;
  damageFee?: unknown;
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

export default async function AdminReturnsPage({
  searchParams
}: {
  searchParams?: Promise<{ error?: string; saved?: string }>;
}) {
  const session = await requireAdminPage();
  const [returns, query] = await Promise.all([
    listReturns() as Promise<ReturnRow[]>,
    searchParams ? searchParams : Promise.resolve({} as { error?: string; saved?: string })
  ]);
  const databaseReady = hasDatabaseUrl();

  return (
    <AdminShell session={session}>
      <h2 className="text-2xl font-semibold">Returns</h2>
      {query.saved ? (
        <div className="mt-4 rounded-md border border-[#b8e2c7] bg-[#edfdf3] px-4 py-3 text-sm text-[#166534]">
          Return record updated.
        </div>
      ) : null}
      <div className="mt-5 rounded-lg border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order</TableHead>
              <TableHead>Due</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Damage fee</TableHead>
              <TableHead>Update</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {returns.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-muted-foreground">
                  No return records yet. Checkout creates return tracking records with each order after Neon is connected.
                </TableCell>
              </TableRow>
            ) : (
              returns.map((returnRecord) => {
                const updateAction = updateReturnAction.bind(null, returnRecord.id);
                return (
                  <TableRow key={returnRecord.id}>
                    <TableCell>
                      <Link href={`/admin/orders/${returnRecord.order.id}`} className="font-medium hover:underline">
                        {returnRecord.order.reference}
                      </Link>
                      <p className="text-sm text-muted-foreground">{returnRecord.order.customer?.name}</p>
                    </TableCell>
                    <TableCell>{new Date(returnRecord.dueDate).toLocaleDateString("en-NG")}</TableCell>
                    <TableCell>
                      <Badge variant={returnRecord.status === "CLEARED" ? "success" : "warning"}>{returnRecord.status}</Badge>
                    </TableCell>
                    <TableCell>{formatNaira(Number(returnRecord.damageFee ?? 0))}</TableCell>
                    <TableCell>
                      <form action={updateAction} className="grid min-w-[560px] gap-2 md:grid-cols-[170px_1fr_1fr_auto]">
                        <Select name="status" defaultValue={returnRecord.status} disabled={!databaseReady}>
                          {returnStatuses.map((status) => (
                            <option key={status} value={status}>
                              {status}
                            </option>
                          ))}
                        </Select>
                        <Input name="receivedAt" type="datetime-local" defaultValue={dateInputValue(returnRecord.receivedAt)} disabled={!databaseReady} />
                        <Input name="damageFee" type="number" min="0" step="1" defaultValue={Number(returnRecord.damageFee ?? 0)} disabled={!databaseReady} />
                        <input type="hidden" name="inspectionNotes" value={returnRecord.inspectionNotes ?? ""} />
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
