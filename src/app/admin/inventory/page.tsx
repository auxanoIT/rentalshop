import { updateInventoryAction } from "@/app/admin/actions";
import { AdminShell } from "@/components/admin/admin-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { requireAdminPage } from "@/lib/server/auth/page";
import { hasDatabaseUrl } from "@/lib/server/db/prisma";
import { inventoryStatuses, listInventory } from "@/lib/server/modules/inventory/inventory.service";

type InventoryRow = {
  id: string;
  serialNo?: string | null;
  status: string;
  condition?: string | null;
  notes?: string | null;
  availableQty?: number;
  variant?: string | { name?: string | null; product?: { name?: string | null } | null };
};

function getVariantName(row: InventoryRow) {
  if (typeof row.variant === "string") return row.variant;
  return row.variant?.product?.name ?? row.variant?.name ?? "Inventory unit";
}

export default async function AdminInventoryPage({
  searchParams
}: {
  searchParams?: Promise<{ error?: string; saved?: string }>;
}) {
  const session = await requireAdminPage();
  const [inventory, query] = await Promise.all([
    listInventory() as Promise<InventoryRow[]>,
    searchParams ? searchParams : Promise.resolve({} as { error?: string; saved?: string })
  ]);
  const databaseReady = hasDatabaseUrl();

  return (
    <AdminShell session={session}>
      <h2 className="text-2xl font-semibold">Inventory</h2>
      {query.saved ? (
        <div className="mt-4 rounded-md border border-[#b8e2c7] bg-[#edfdf3] px-4 py-3 text-sm text-[#166534]">
          Inventory updated.
        </div>
      ) : null}
      {query.error === "database" ? (
        <div className="mt-4 rounded-md border border-[#f0d48a] bg-[#fff9e8] px-4 py-3 text-sm text-[#6f4a00]">
          Inventory changes require a configured Neon database.
        </div>
      ) : null}
      <div className="mt-5 rounded-lg border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Variant</TableHead>
              <TableHead>Serial / Qty</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Condition</TableHead>
              <TableHead>Update</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {inventory.map((row) => {
              const updateAction = updateInventoryAction.bind(null, row.id);
              return (
                <TableRow key={row.id}>
                  <TableCell className="font-medium">{getVariantName(row)}</TableCell>
                  <TableCell>{row.serialNo ?? row.availableQty ?? "-"}</TableCell>
                  <TableCell>
                    <Badge variant={row.status === "AVAILABLE" ? "success" : "warning"}>{row.status}</Badge>
                  </TableCell>
                  <TableCell>{row.condition ?? "-"}</TableCell>
                  <TableCell>
                    <form action={updateAction} className="grid min-w-[560px] gap-2 md:grid-cols-[150px_1fr_1fr_auto]">
                      <Select name="status" defaultValue={row.status} disabled={!databaseReady}>
                        {inventoryStatuses.map((status) => (
                          <option key={status} value={status}>
                            {status}
                          </option>
                        ))}
                      </Select>
                      <Input name="condition" defaultValue={row.condition ?? ""} placeholder="Condition" disabled={!databaseReady} />
                      <Input name="notes" defaultValue={row.notes ?? ""} placeholder="Inventory notes" disabled={!databaseReady} />
                      <Button type="submit" size="sm" disabled={!databaseReady}>
                        Save
                      </Button>
                    </form>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </AdminShell>
  );
}
