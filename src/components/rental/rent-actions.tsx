"use client";

import { ShoppingCart, Zap } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import type { LaunchProduct } from "@/lib/catalog";
import { useCartStore } from "@/lib/client/stores/cart.store";

export function RentActions({ product }: { product: LaunchProduct }) {
  const addItem = useCartStore((state) => state.addItem);
  const defaultVariant = product.variants[0];
  const [selectedVariantSlug, setSelectedVariantSlug] = useState(defaultVariant?.slug ?? product.slug);
  const selectedVariant = useMemo(
    () => product.variants.find((variant) => variant.slug === selectedVariantSlug) ?? defaultVariant,
    [defaultVariant, product.variants, selectedVariantSlug]
  );

  function addSelectedVariant() {
    addItem({
      productId: product.id,
      slug: product.slug,
      variantSlug: selectedVariant?.slug ?? product.slug,
      variantName: selectedVariant?.name ?? product.name,
      name: selectedVariant?.name ?? product.name,
      dailyRate: selectedVariant?.dailyRate ?? product.dailyRate,
      image: product.image,
      quantity: 1
    });
  }

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
    <div className="grid gap-3">
      {product.variants.length > 1 ? (
        <div className="grid gap-2">
          <Label htmlFor={`variant-${product.id}`}>Variant</Label>
          <Select
            id={`variant-${product.id}`}
            value={selectedVariantSlug}
            onChange={(event) => setSelectedVariantSlug(event.target.value)}
          >
            {product.variants.map((variant) => (
              <option key={variant.id} value={variant.slug}>
                {variant.name}
              </option>
            ))}
          </Select>
        </div>
      ) : null}
      <div className="grid gap-2 sm:grid-cols-2">
        <Button type="button" variant="outline" onClick={addSelectedVariant}>
          <ShoppingCart aria-hidden />
          Add
        </Button>
        <Button asChild onClick={addSelectedVariant}>
          <Link href="/checkout">Rent now</Link>
        </Button>
      </div>
    </div>
  );
}
