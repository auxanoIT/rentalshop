import { updateDocumentAction } from "@/app/admin/actions";
import { AdminShell } from "@/components/admin/admin-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { requireAdminPage } from "@/lib/server/auth/page";
import { hasDatabaseUrl } from "@/lib/server/db/prisma";
import { listDocuments } from "@/lib/server/modules/documents/document.repository";
import { documentReviewStatuses } from "@/lib/server/modules/documents/document.service";

type AdminDocumentRow = {
  id: string;
  fileName: string;
  documentType: string;
  reviewStatus: string;
  adminNote?: string | null;
  customer?: { name?: string | null } | null;
};

export default async function AdminDocumentsPage({
  searchParams
}: {
  searchParams?: Promise<{ error?: string; saved?: string }>;
}) {
  const session = await requireAdminPage();
  const [documents, query] = await Promise.all([
    listDocuments() as Promise<AdminDocumentRow[]>,
    searchParams ? searchParams : Promise.resolve({} as { error?: string; saved?: string })
  ]);
  const databaseReady = hasDatabaseUrl();

  return (
    <AdminShell session={session}>
      <h2 className="text-2xl font-semibold">Documents</h2>
      {query.saved ? (
        <div className="mt-4 rounded-md border border-[#b8e2c7] bg-[#edfdf3] px-4 py-3 text-sm text-[#166534]">
          Document review saved.
        </div>
      ) : null}
      <div className="mt-5 rounded-lg border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>File</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Review</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {documents.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-muted-foreground">
                  No uploaded documents yet.
                </TableCell>
              </TableRow>
            ) : (
              documents.map((document) => {
                const updateAction = updateDocumentAction.bind(null, document.id);
                return (
                  <TableRow key={document.id}>
                    <TableCell className="font-medium">{document.fileName}</TableCell>
                    <TableCell>{document.customer?.name}</TableCell>
                    <TableCell>
                      <Badge variant={document.reviewStatus === "VALID" ? "success" : "warning"}>{document.reviewStatus}</Badge>
                    </TableCell>
                    <TableCell>{document.documentType}</TableCell>
                    <TableCell>
                      <form action={updateAction} className="grid min-w-96 gap-2 md:grid-cols-[170px_1fr_auto]">
                        <Select name="reviewStatus" defaultValue={document.reviewStatus} disabled={!databaseReady}>
                          {documentReviewStatuses.map((status) => (
                            <option key={status} value={status}>
                              {status}
                            </option>
                          ))}
                        </Select>
                        <Input name="adminNote" defaultValue={document.adminNote ?? ""} placeholder="Review note" disabled={!databaseReady} />
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
