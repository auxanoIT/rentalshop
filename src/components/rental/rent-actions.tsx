"use client";

import { ShoppingCart, Zap } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import type { LaunchProduct } from "@/lib/catalog";
import { useCartStore } from "@/lib/client/stores/cart.store";

export function RentActions({ product }: { product: LaunchProduct }) {
  const addItem = useCartStore((state) => state.addItem);

  if (product.status === "REQUEST_ONLY") {
    return (
      <Button asChild variant="outline" className="w-full">
        <Link href={`/contact?request=${product.slug}`}>
          <Zap aria-hidden />
          Request spec
        </Link>
      </Button>
    );
  }

  return (
    <div className="grid gap-2 sm:grid-cols-2">
      <Button
        type="button"
        variant="outline"
        onClick={() =>
          addItem({
            productId: product.id,
            slug: product.slug,
            name: product.name,
            dailyRate: product.dailyRate,
            image: product.image,
            quantity: 1
          })
        }
      >
        <ShoppingCart aria-hidden />
        Add
      </Button>
      <Button
        asChild
        onClick={() =>
          addItem({
            productId: product.id,
            slug: product.slug,
            name: product.name,
            dailyRate: product.dailyRate,
            image: product.image,
            quantity: 1
          })
        }
      >
        <Link href="/checkout">Rent now</Link>
      </Button>
    </div>
  );
}
