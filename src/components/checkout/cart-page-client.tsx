"use client";

import { Minus, Plus, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useCartStore } from "@/lib/client/stores/cart.store";
import { formatNaira } from "@/lib/utils";

export function CartPageClient() {
  const { items, updateQuantity, removeItem } = useCartStore();

  const estimatedDailyTotal = items.reduce((sum, item) => sum + item.dailyRate * item.quantity, 0);

  if (items.length === 0) {
    return (
      <main className="container-page py-12">
        <div className="max-w-2xl">
          <h1 className="text-3xl font-semibold">Cart</h1>
          <p className="mt-3 text-muted-foreground">Your rental cart is empty.</p>
          <Button asChild className="mt-6">
            <Link href="/equipment/laptops">Browse laptops</Link>
          </Button>
        </div>
      </main>
    );
  }

  return (
    <main className="container-page py-12">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <h1 className="text-3xl font-semibold">Cart</h1>
          <p className="mt-2 text-muted-foreground">Review quantities before checkout.</p>
        </div>
        <Button asChild>
          <Link href="/checkout">Continue to checkout</Link>
        </Button>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_340px]">
        <div className="grid gap-4">
          {items.map((item) => (
            <Card key={item.slug}>
              <CardContent className="grid gap-4 p-4 sm:grid-cols-[120px_1fr_auto] sm:items-center">
                <div className="relative aspect-[4/3] overflow-hidden rounded-md bg-muted">
                  <Image src={item.image} alt={item.name} fill className="object-cover" sizes="120px" />
                </div>
                <div>
                  <Link href={`/equipment/laptops/${item.slug}`} className="font-semibold hover:underline">
                    {item.name}
                  </Link>
                  <p className="mt-1 text-sm text-muted-foreground">{formatNaira(item.dailyRate)} per day</p>
                  <div className="mt-4 flex items-center gap-2">
                    <Button
                      type="button"
                      size="icon"
                      variant="outline"
                      onClick={() => updateQuantity(item.slug, item.quantity - 1)}
                    >
                      <Minus aria-hidden />
                      <span className="sr-only">Decrease quantity</span>
                    </Button>
                    <span className="w-10 text-center text-sm font-semibold">{item.quantity}</span>
                    <Button
                      type="button"
                      size="icon"
                      variant="outline"
                      onClick={() => updateQuantity(item.slug, item.quantity + 1)}
                    >
                      <Plus aria-hidden />
                      <span className="sr-only">Increase quantity</span>
                    </Button>
                  </div>
                </div>
                <Button type="button" size="icon" variant="ghost" onClick={() => removeItem(item.slug)}>
                  <Trash2 aria-hidden />
                  <span className="sr-only">Remove item</span>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <aside className="rounded-lg border bg-card p-5">
          <h2 className="font-semibold">Estimated daily total</h2>
          <p className="mt-3 text-3xl font-semibold">{formatNaira(estimatedDailyTotal)}</p>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            Final checkout total depends on rental dates, quantity rules, discounts, and delivery estimate.
          </p>
          <Button asChild className="mt-5 w-full">
            <Link href="/checkout">Checkout</Link>
          </Button>
        </aside>
      </div>
    </main>
  );
}
