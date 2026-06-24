import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { buildMetadata } from "@/lib/seo";
import { getPublicCategories } from "@/lib/server/modules/categories/category.service";

export const metadata = buildMetadata({
  title: "Equipment Rental Categories | ITShop Equipment Leasing",
  description: "Browse laptop rental and request IT equipment categories from ITShop Equipment Leasing.",
  path: "/equipment"
});

export default async function EquipmentPage() {
  const categories = await getPublicCategories();

  return (
    <main className="container-page py-12">
      <div className="max-w-3xl">
        <p className="text-sm font-semibold text-primary">Equipment categories</p>
        <h1 className="mt-2 text-4xl font-semibold">Rent laptops and request IT equipment</h1>
        <p className="mt-4 text-muted-foreground">
          Laptops are active for phase one. Other IT equipment categories are structured for request-only
          operations and future expansion.
        </p>
      </div>
      <div className="mt-8 grid gap-5 md:grid-cols-3">
        {categories.map((category) => (
          <Link key={category.slug} href={`/equipment/${category.slug}`}>
            <Card className="h-full hover:border-primary">
              <CardContent className="p-5">
                <Badge variant={category.status === "ACTIVE" ? "success" : "warning"}>
                  {category.status === "ACTIVE" ? "Active" : "Request only"}
                </Badge>
                <h2 className="mt-4 text-xl font-semibold">{category.name}</h2>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{category.description}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </main>
  );
}
