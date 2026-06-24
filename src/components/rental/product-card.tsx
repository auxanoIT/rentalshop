import Image from "next/image";
import Link from "next/link";

import { RentActions } from "@/components/rental/rent-actions";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import type { LaunchProduct } from "@/lib/catalog";
import { formatNaira } from "@/lib/utils";

export function ProductCard({ product, priority = false }: { product: LaunchProduct; priority?: boolean }) {
  return (
    <Card className="overflow-hidden">
      <Link href={`/equipment/${product.categorySlug}/${product.slug}`} className="block">
        <div className="relative aspect-[4/3] bg-muted">
          <Image
            src={product.image}
            alt={product.imageAlt}
            fill
            priority={priority}
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover"
          />
        </div>
      </Link>
      <CardContent className="grid gap-4 p-4">
        <div className="grid gap-2">
          <div className="flex flex-wrap gap-2">
            <Badge variant={product.status === "ACTIVE" ? "success" : "warning"}>
              {product.status === "ACTIVE" ? "Available" : "Request only"}
            </Badge>
            <Badge variant="outline">{product.specs.processor}</Badge>
          </div>
          <Link
            href={`/equipment/${product.categorySlug}/${product.slug}`}
            className="text-base font-semibold hover:underline"
          >
            {product.name}
          </Link>
          <p className="text-sm leading-6 text-muted-foreground">{product.shortDesc}</p>
        </div>

        <dl className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
          <div>
            <dt>RAM</dt>
            <dd className="font-medium text-foreground">{product.specs.ram}</dd>
          </div>
          <div>
            <dt>Storage</dt>
            <dd className="font-medium text-foreground">{product.specs.storage}</dd>
          </div>
          <div>
            <dt>Screen</dt>
            <dd className="font-medium text-foreground">{product.specs.screenSize}</dd>
          </div>
          <div>
            <dt>Stock</dt>
            <dd className="font-medium text-foreground">
              {product.status === "ACTIVE" ? `${product.availableQty} units` : "Custom"}
            </dd>
          </div>
        </dl>

        <div className="flex items-end justify-between gap-3">
          <div>
            <p className="text-xs text-muted-foreground">From</p>
            <p className="text-xl font-semibold">
              {product.dailyRate > 0 ? formatNaira(product.dailyRate) : "Custom"}
              {product.dailyRate > 0 ? <span className="text-sm font-normal text-muted-foreground">/day</span> : null}
            </p>
          </div>
        </div>
        <RentActions product={product} />
      </CardContent>
    </Card>
  );
}
