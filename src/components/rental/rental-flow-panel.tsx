"use client";

import { Calculator, Loader2, ShoppingCart } from "lucide-react";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import type { LaunchProduct } from "@/lib/catalog";
import { useCartStore } from "@/lib/client/stores/cart.store";
import { useCheckoutStore } from "@/lib/client/stores/checkout.store";
import { daysBetween, formatNaira } from "@/lib/utils";

function isoDateAfter(days: number) {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toISOString().slice(0, 10);
}

type PricingResult = {
  rentalDays: number;
  minimumDays: number;
  dailyRate: number;
  subtotal: number;
  discount: number;
  deliveryFeeEstimate: number;
  total: number;
};

export function RentalFlowPanel({ product }: { product: LaunchProduct }) {
  const router = useRouter();
  const addItem = useCartStore((state) => state.addItem);
  const { setDates, setPurpose } = useCheckoutStore();
  const defaultVariant = product.variants[0];
  const [selectedVariantSlug, setSelectedVariantSlug] = useState(defaultVariant?.slug ?? product.slug);
  const [quantity, setQuantity] = useState(1);
  const [startDate, setStartDate] = useState(isoDateAfter(1));
  const [returnDate, setReturnDate] = useState(isoDateAfter(8));
  const [purpose, setRentalPurpose] = useState("Training");
  const [result, setResult] = useState<PricingResult | null>(null);
  const [error, setError] = useState("");
  const [loadingAction, setLoadingAction] = useState<"calculate" | "add" | "rent" | null>(null);
  const selectedVariant = useMemo(
    () => product.variants.find((variant) => variant.slug === selectedVariantSlug) ?? defaultVariant,
    [defaultVariant, product.variants, selectedVariantSlug]
  );
  const localDays = daysBetween(startDate, returnDate);

  async function validateSelection() {
    setError("");

    const response = await fetch("/api/pricing/calculate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        productSlug: selectedVariant?.slug ?? product.slug,
        quantity,
        startDate,
        returnDate
      })
    });
    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      setResult(null);
      throw new Error(data?.error?.message ?? "Unable to calculate rental price");
    }

    setResult(data.price);
    return data.price as PricingResult;
  }

  async function handleCalculate() {
    setLoadingAction("calculate");
    try {
      await validateSelection();
    } catch (quoteError) {
      setError(quoteError instanceof Error ? quoteError.message : "Unable to calculate rental price");
    } finally {
      setLoadingAction(null);
    }
  }

  async function addConfiguredItem(action: "add" | "rent") {
    setLoadingAction(action);
    try {
      await validateSelection();
      setDates(startDate, returnDate);
      setPurpose(purpose);
      addItem({
        productId: product.id,
        slug: product.slug,
        variantSlug: selectedVariant?.slug ?? product.slug,
        variantName: selectedVariant?.name ?? product.name,
        name: selectedVariant?.name ?? product.name,
        dailyRate: selectedVariant?.dailyRate ?? product.dailyRate,
        image: product.image,
        quantity
      });
      if (action === "rent") {
        router.push("/checkout");
      }
    } catch (quoteError) {
      setError(quoteError instanceof Error ? quoteError.message : "Unable to add rental selection");
    } finally {
      setLoadingAction(null);
    }
  }

  return (
    <div className="mt-5 grid gap-4 border-t pt-5">
      <div className="flex items-center gap-2">
        <Calculator className="h-5 w-5 text-primary" aria-hidden />
        <h2 className="text-lg font-semibold">Rental plan</h2>
      </div>

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

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="grid gap-2">
          <Label htmlFor={`quantity-${product.id}`}>Quantity</Label>
          <Input
            id={`quantity-${product.id}`}
            type="number"
            min={1}
            value={quantity}
            onChange={(event) => setQuantity(Math.max(1, Number(event.target.value)))}
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor={`purpose-${product.id}`}>Purpose</Label>
          <Select
            id={`purpose-${product.id}`}
            value={purpose}
            onChange={(event) => setRentalPurpose(event.target.value)}
          >
            <option>Training</option>
            <option>CBT exams</option>
            <option>Temporary staff</option>
            <option>Event operations</option>
            <option>Other</option>
          </Select>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="grid gap-2">
          <Label htmlFor={`start-${product.id}`}>Start date</Label>
          <Input
            id={`start-${product.id}`}
            type="date"
            value={startDate}
            onChange={(event) => setStartDate(event.target.value)}
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor={`return-${product.id}`}>Return date</Label>
          <Input
            id={`return-${product.id}`}
            type="date"
            value={returnDate}
            onChange={(event) => setReturnDate(event.target.value)}
          />
        </div>
      </div>

      <Button type="button" variant="outline" onClick={handleCalculate} disabled={!!loadingAction || localDays <= 0}>
        {loadingAction === "calculate" ? <Loader2 className="animate-spin" aria-hidden /> : null}
        Calculate total
      </Button>

      {error ? <p className="text-sm text-destructive">{error}</p> : null}

      {result ? (
        <div className="rounded-md bg-secondary p-4">
          <div className="grid gap-2 text-sm">
            <div className="flex justify-between">
              <span>Rental days</span>
              <span>{result.rentalDays}</span>
            </div>
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>{formatNaira(result.subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span>Discount</span>
              <span>{formatNaira(result.discount)}</span>
            </div>
            <div className="flex justify-between border-t pt-2 text-lg font-semibold">
              <span>Total</span>
              <span>{formatNaira(result.total)}</span>
            </div>
          </div>
          <p className="mt-3 text-xs leading-5 text-muted-foreground">
            Security deposit is reviewed separately by admin and is not included in this total.
          </p>
        </div>
      ) : null}

      <div className="grid gap-2 sm:grid-cols-2">
        <Button
          type="button"
          variant="outline"
          onClick={() => addConfiguredItem("add")}
          disabled={!!loadingAction || localDays <= 0}
        >
          {loadingAction === "add" ? <Loader2 className="animate-spin" aria-hidden /> : <ShoppingCart aria-hidden />}
          Add to cart
        </Button>
        <Button type="button" onClick={() => addConfiguredItem("rent")} disabled={!!loadingAction || localDays <= 0}>
          {loadingAction === "rent" ? <Loader2 className="animate-spin" aria-hidden /> : null}
          Rent now
        </Button>
      </div>
    </div>
  );
}
