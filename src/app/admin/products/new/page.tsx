import { createProductAction } from "@/app/admin/actions";
import { AdminShell } from "@/components/admin/admin-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { requireAdminPage } from "@/lib/server/auth/page";
import { hasDatabaseUrl } from "@/lib/server/db/prisma";
import { getCategories } from "@/lib/server/modules/categories/category.service";

export default async function NewProductPage({
  searchParams
}: {
  searchParams?: Promise<{ error?: string }>;
}) {
  const session = await requireAdminPage();
  const categories = await getCategories();
  const params = searchParams ? await searchParams : {};
  const databaseReady = hasDatabaseUrl();

  return (
    <AdminShell session={session}>
      <h2 className="text-2xl font-semibold">New product</h2>
      {params.error === "database" ? (
        <div className="mt-4 rounded-md border border-[#f0d48a] bg-[#fff9e8] px-4 py-3 text-sm text-[#6f4a00]">
          Product changes require a configured Neon database.
        </div>
      ) : null}
      <form action={createProductAction} className="mt-5 grid max-w-4xl gap-5 rounded-lg border bg-card p-5">
        <div className="grid gap-2">
          <Label htmlFor="name">Product name</Label>
          <Input id="name" name="name" required />
        </div>
        <div className="grid gap-2 md:grid-cols-2">
          <div className="grid gap-2">
            <Label htmlFor="slug">Slug</Label>
            <Input id="slug" name="slug" required />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="categoryId">Category</Label>
            <Select id="categoryId" name="categoryId" required>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </Select>
          </div>
        </div>
        <div className="grid gap-2 md:grid-cols-3">
          <div className="grid gap-2">
            <Label htmlFor="status">Status</Label>
            <Select id="status" name="status" defaultValue="ACTIVE">
              <option value="ACTIVE">ACTIVE</option>
              <option value="REQUEST_ONLY">REQUEST_ONLY</option>
              <option value="COMING_SOON">COMING_SOON</option>
              <option value="INACTIVE">INACTIVE</option>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="dailyRate">Daily rate</Label>
            <Input id="dailyRate" name="dailyRate" type="number" min="0" step="1" required />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="availableQty">Available quantity</Label>
            <Input id="availableQty" name="availableQty" type="number" min="0" step="1" defaultValue="0" required />
          </div>
        </div>
        <div className="grid gap-2 md:grid-cols-2">
          <div className="grid gap-2">
            <Label htmlFor="weeklyRate">Weekly rate</Label>
            <Input id="weeklyRate" name="weeklyRate" type="number" min="0" step="1" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="monthlyRate">Monthly rate</Label>
            <Input id="monthlyRate" name="monthlyRate" type="number" min="0" step="1" />
          </div>
        </div>
        <div className="grid gap-2">
          <Label htmlFor="shortDesc">Short description</Label>
          <Input id="shortDesc" name="shortDesc" />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="description">Description</Label>
          <Textarea id="description" name="description" />
        </div>
        <div className="grid gap-2 md:grid-cols-2">
          <div className="grid gap-2">
            <Label htmlFor="imageUrl">Primary image URL</Label>
            <Input id="imageUrl" name="imageUrl" type="url" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="imageAlt">Image alt text</Label>
            <Input id="imageAlt" name="imageAlt" />
          </div>
        </div>
        <div className="grid gap-2 md:grid-cols-4">
          {[
            ["brand", "Brand"],
            ["model", "Model"],
            ["processor", "Processor"],
            ["ram", "RAM"],
            ["storage", "Storage"],
            ["operatingSystem", "Operating system"],
            ["screenSize", "Screen size"],
            ["condition", "Condition"]
          ].map(([name, label]) => (
            <div key={name} className="grid gap-2">
              <Label htmlFor={name}>{label}</Label>
              <Input id={name} name={name} />
            </div>
          ))}
        </div>
        <div className="flex flex-wrap gap-4 text-sm">
          <label className="flex items-center gap-2">
            <input type="checkbox" name="rentable" defaultChecked className="h-4 w-4" />
            Rentable
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" name="sellable" className="h-4 w-4" />
            Sellable
          </label>
        </div>
        <Button type="submit" disabled={!databaseReady}>
          Save product
        </Button>
      </form>
    </AdminShell>
  );
}
