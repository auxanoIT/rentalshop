import { updateSpecialRequestAction } from "@/app/admin/actions";
import { AdminShell } from "@/components/admin/admin-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { requireAdminPage } from "@/lib/server/auth/page";
import { hasDatabaseUrl } from "@/lib/server/db/prisma";
import {
  listSpecialRequests,
  specialRequestStatuses
} from "@/lib/server/modules/special-requests/special-request.service";

type SpecialRequestRow = {
  id: string;
  name: string;
  companyName?: string | null;
  phone: string;
  email: string;
  city?: string | null;
  state?: string | null;
  quantity?: number | null;
  requirements: string;
  status: string;
  adminNotes?: string | null;
};

export default async function AdminSpecialRequestsPage({
  searchParams
}: {
  searchParams?: Promise<{ error?: string; saved?: string }>;
}) {
  const session = await requireAdminPage();
  const [requests, query] = await Promise.all([
    listSpecialRequests() as Promise<SpecialRequestRow[]>,
    searchParams ? searchParams : Promise.resolve({} as { error?: string; saved?: string })
  ]);
  const databaseReady = hasDatabaseUrl();

  return (
    <AdminShell session={session}>
      <h2 className="text-2xl font-semibold">Special requests</h2>
      {query.saved ? (
        <div className="mt-4 rounded-md border border-[#b8e2c7] bg-[#edfdf3] px-4 py-3 text-sm text-[#166534]">
          Special request updated.
        </div>
      ) : null}
      <div className="mt-5 rounded-lg border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Requester</TableHead>
              <TableHead>Need</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Update</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {requests.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-muted-foreground">
                  No special requests yet. Public bulk and custom-spec forms will populate this view after Neon is connected.
                </TableCell>
              </TableRow>
            ) : (
              requests.map((request) => {
                const updateAction = updateSpecialRequestAction.bind(null, request.id);
                return (
                  <TableRow key={request.id}>
                    <TableCell>
                      <p className="font-medium">{request.companyName ?? request.name}</p>
                      <p className="text-sm text-muted-foreground">{request.email} / {request.phone}</p>
                    </TableCell>
                    <TableCell>
                      <p className="line-clamp-2 max-w-md">{request.requirements}</p>
                      <p className="text-sm text-muted-foreground">
                        {request.quantity ? `${request.quantity} units` : "Quantity not set"}
                      </p>
                    </TableCell>
                    <TableCell>
                      <Badge variant={request.status === "WON" ? "success" : "warning"}>{request.status}</Badge>
                    </TableCell>
                    <TableCell>
                      <form action={updateAction} className="grid min-w-96 gap-2 md:grid-cols-[150px_1fr_auto]">
                        <Select name="status" defaultValue={request.status} disabled={!databaseReady}>
                          {specialRequestStatuses.map((status) => (
                            <option key={status} value={status}>
                              {status}
                            </option>
                          ))}
                        </Select>
                        <Input name="adminNotes" defaultValue={request.adminNotes ?? ""} placeholder="Admin notes" disabled={!databaseReady} />
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
