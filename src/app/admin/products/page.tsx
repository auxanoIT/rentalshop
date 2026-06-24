import Link from "next/link";

import { AdminShell } from "@/components/admin/admin-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { requireAdminPage } from "@/lib/server/auth/page";
import { hasDatabaseUrl } from "@/lib/server/db/prisma";
import { getAdminProducts } from "@/lib/server/modules/products/product.service";
import { formatNaira } from "@/lib/utils";

export default async function AdminProductsPage() {
  const session = await requireAdminPage();
  const products = await getAdminProducts();
  const databaseReady = hasDatabaseUrl();

  return (
    <AdminShell session={session}>
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-2xl font-semibold">Products</h2>
        <Button asChild>
          <Link href="/admin/products/new">New product</Link>
        </Button>
      </div>
      {!databaseReady ? (
        <div className="mt-4 rounded-md border border-[#f0d48a] bg-[#fff9e8] px-4 py-3 text-sm text-[#6f4a00]">
          Running from launch catalogue fallback. Connect Neon and run the seed before creating or editing products.
        </div>
      ) : null}
      <div className="mt-5 rounded-lg border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Daily rate</TableHead>
              <TableHead>Stock</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product.id}>
                <TableCell>
                  <Link href={`/admin/products/${product.id}`} className="font-medium hover:underline">
                    {product.name}
                  </Link>
                </TableCell>
                <TableCell>
                  <Badge variant={product.status === "ACTIVE" ? "success" : "warning"}>{product.status}</Badge>
                </TableCell>
                <TableCell>{product.dailyRate ? formatNaira(product.dailyRate) : "Custom"}</TableCell>
                <TableCell>{product.availableQty}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </AdminShell>
  );
}
