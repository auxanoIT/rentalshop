import { notFound } from "next/navigation";

import { updateProductAction } from "@/app/admin/actions";
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
import { getAdminProduct } from "@/lib/server/modules/products/product.service";
import { formatNaira } from "@/lib/utils";

export default async function AdminProductDetailPage({
  params,
  searchParams
}: {
  params: Promise<{ id: string }>;
  searchParams?: Promise<{ error?: string; saved?: string }>;
}) {
  const session = await requireAdminPage();
  const { id } = await params;
  const [product, categories, query] = await Promise.all([
    getAdminProduct(id).catch(() => null),
    getCategories(),
    searchParams ? searchParams : Promise.resolve({} as { error?: string; saved?: string })
  ]);
  if (!product) notFound();

  const selectedCategory = categories.find((category) => category.slug === product.categorySlug);
  const databaseReady = hasDatabaseUrl();
  const updateAction = updateProductAction.bind(null, product.id);
  const primaryVariant = product.variants[0];

  return (
    <AdminShell session={session}>
      <h2 className="text-2xl font-semibold">{product.name}</h2>
      {query.saved ? (
        <div className="mt-4 rounded-md border border-[#b8e2c7] bg-[#edfdf3] px-4 py-3 text-sm text-[#166534]">
          Product saved.
        </div>
      ) : null}
      {query.error === "database" ? (
        <div className="mt-4 rounded-md border border-[#f0d48a] bg-[#fff9e8] px-4 py-3 text-sm text-[#6f4a00]">
          Product changes require a configured Neon database.
        </div>
      ) : null}
      <div className="mt-5 grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="p-5">
            <p className="text-sm text-muted-foreground">Status</p>
            <Badge className="mt-2" variant={product.status === "ACTIVE" ? "success" : "warning"}>
              {product.status}
            </Badge>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <p className="text-sm text-muted-foreground">Daily rate</p>
            <p className="mt-2 text-xl font-semibold">{product.dailyRate ? formatNaira(product.dailyRate) : "Custom"}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <p className="text-sm text-muted-foreground">Available quantity</p>
            <p className="mt-2 text-xl font-semibold">{product.availableQty}</p>
          </CardContent>
        </Card>
      </div>
      <form action={updateAction} className="mt-5 grid max-w-4xl gap-5 rounded-lg border bg-card p-5">
        <h3 className="font-semibold">Edit product</h3>
        <div className="grid gap-2">
          <Label htmlFor="name">Product name</Label>
          <Input id="name" name="name" defaultValue={product.name} required />
        </div>
        <div className="grid gap-2 md:grid-cols-2">
          <div className="grid gap-2">
            <Label htmlFor="slug">Slug</Label>
            <Input id="slug" name="slug" defaultValue={product.slug} required />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="categoryId">Category</Label>
            <Select id="categoryId" name="categoryId" defaultValue={selectedCategory?.id} required>
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
            <Select id="status" name="status" defaultValue={product.status}>
              <option value="ACTIVE">ACTIVE</option>
              <option value="REQUEST_ONLY">REQUEST_ONLY</option>
              <option value="COMING_SOON">COMING_SOON</option>
              <option value="INACTIVE">INACTIVE</option>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="dailyRate">Daily rate</Label>
            <Input id="dailyRate" name="dailyRate" type="number" min="0" step="1" defaultValue={product.dailyRate} required />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="availableQty">Available quantity</Label>
            <Input id="availableQty" name="availableQty" type="number" min="0" step="1" defaultValue={product.availableQty} required />
          </div>
        </div>
        <div className="grid gap-2 md:grid-cols-2">
          <div className="grid gap-2">
            <Label htmlFor="weeklyRate">Weekly rate</Label>
            <Input id="weeklyRate" name="weeklyRate" type="number" min="0" step="1" defaultValue={product.weeklyRate} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="monthlyRate">Monthly rate</Label>
            <Input id="monthlyRate" name="monthlyRate" type="number" min="0" step="1" defaultValue={product.monthlyRate} />
          </div>
        </div>
        <div className="grid gap-2">
          <Label htmlFor="shortDesc">Short description</Label>
          <Input id="shortDesc" name="shortDesc" defaultValue={product.shortDesc} />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="description">Description</Label>
          <Textarea id="description" name="description" defaultValue={product.description} />
        </div>
        <div className="grid gap-2 md:grid-cols-2">
          <div className="grid gap-2">
            <Label htmlFor="seoTitle">SEO title</Label>
            <Input id="seoTitle" name="seoTitle" defaultValue={product.seoTitle} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="seoDescription">SEO description</Label>
            <Input id="seoDescription" name="seoDescription" defaultValue={product.seoDescription} />
          </div>
        </div>
        <div className="grid gap-2 md:grid-cols-2">
          <div className="grid gap-2">
            <Label htmlFor="imageUrl">Primary image URL</Label>
            <Input id="imageUrl" name="imageUrl" type="url" defaultValue={product.image} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="imageAlt">Image alt text</Label>
            <Input id="imageAlt" name="imageAlt" defaultValue={product.imageAlt} />
          </div>
        </div>
        <div className="grid gap-2 md:grid-cols-2">
          <div className="grid gap-2">
            <Label htmlFor="variantName">Primary variant name</Label>
            <Input id="variantName" name="variantName" defaultValue={primaryVariant?.name ?? product.name} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="variantSlug">Primary variant slug</Label>
            <Input id="variantSlug" name="variantSlug" defaultValue={primaryVariant?.slug ?? product.slug} />
          </div>
        </div>
        <div className="grid gap-2 md:grid-cols-4">
          {[
            ["brand", "Brand", product.specs.brand],
            ["model", "Model", product.specs.model],
            ["processor", "Processor", product.specs.processor],
            ["ram", "RAM", product.specs.ram],
            ["storage", "Storage", product.specs.storage],
            ["operatingSystem", "Operating system", product.specs.operatingSystem],
            ["screenSize", "Screen size", product.specs.screenSize],
            ["condition", "Condition", product.specs.condition]
          ].map(([name, label, value]) => (
            <div key={name} className="grid gap-2">
              <Label htmlFor={name}>{label}</Label>
              <Input id={name} name={name} defaultValue={value} />
            </div>
          ))}
        </div>
        <div className="flex flex-wrap gap-4 text-sm">
          <label className="flex items-center gap-2">
            <input type="checkbox" name="rentable" defaultChecked={product.rentable} className="h-4 w-4" />
            Rentable
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" name="sellable" defaultChecked={product.sellable} className="h-4 w-4" />
            Sellable
          </label>
        </div>
        <Button type="submit" disabled={!databaseReady}>
          Save changes
        </Button>
      </form>
    </AdminShell>
  );
}
