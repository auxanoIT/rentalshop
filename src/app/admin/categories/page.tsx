import { createCategoryAction } from "@/app/admin/actions";
import { AdminShell } from "@/components/admin/admin-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { requireAdminPage } from "@/lib/server/auth/page";
import { hasDatabaseUrl } from "@/lib/server/db/prisma";
import { getCategories } from "@/lib/server/modules/categories/category.service";

export default async function AdminCategoriesPage({
  searchParams
}: {
  searchParams?: Promise<{ error?: string; saved?: string }>;
}) {
  const session = await requireAdminPage();
  const [categories, query] = await Promise.all([
    getCategories(),
    searchParams ? searchParams : Promise.resolve({} as { error?: string; saved?: string })
  ]);
  const databaseReady = hasDatabaseUrl();

  return (
    <AdminShell session={session}>
      <h2 className="text-2xl font-semibold">Categories</h2>
      {query.saved ? (
        <div className="mt-4 rounded-md border border-[#b8e2c7] bg-[#edfdf3] px-4 py-3 text-sm text-[#166534]">
          Category saved.
        </div>
      ) : null}
      {query.error === "database" ? (
        <div className="mt-4 rounded-md border border-[#f0d48a] bg-[#fff9e8] px-4 py-3 text-sm text-[#6f4a00]">
          Category changes require a configured Neon database.
        </div>
      ) : null}
      <div className="mt-5 grid gap-5 lg:grid-cols-[1fr_340px]">
        <div className="grid gap-3">
          {categories.map((category) => (
            <Card key={category.id}>
              <CardContent className="flex items-start justify-between gap-4 p-5">
                <div>
                  <h3 className="font-semibold">{category.name}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{category.description}</p>
                </div>
                <Badge variant={category.status === "ACTIVE" ? "success" : "warning"}>{category.status}</Badge>
              </CardContent>
            </Card>
          ))}
        </div>
        <form action={createCategoryAction} className="grid h-fit gap-4 rounded-lg border bg-card p-5">
          <h3 className="font-semibold">Create category</h3>
          <div className="grid gap-2">
            <Label htmlFor="name">Name</Label>
            <Input id="name" name="name" required />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="slug">Slug</Label>
            <Input id="slug" name="slug" required />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" name="description" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="status">Status</Label>
            <Select id="status" name="status" defaultValue="ACTIVE">
              <option value="ACTIVE">ACTIVE</option>
              <option value="REQUEST_ONLY">REQUEST_ONLY</option>
              <option value="COMING_SOON">COMING_SOON</option>
              <option value="HIDDEN">HIDDEN</option>
            </Select>
          </div>
          <Button type="submit" disabled={!databaseReady}>
            Save category
          </Button>
        </form>
      </div>
    </AdminShell>
  );
}
