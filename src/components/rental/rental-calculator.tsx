"use client";

import { Calculator, Loader2 } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { LaunchProduct } from "@/lib/catalog";
import { daysBetween, formatNaira } from "@/lib/utils";

function isoDateAfter(days: number) {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toISOString().slice(0, 10);
}

export function RentalCalculator({ product }: { product: LaunchProduct }) {
  const [quantity, setQuantity] = useState(1);
  const [startDate, setStartDate] = useState(isoDateAfter(1));
  const [returnDate, setReturnDate] = useState(isoDateAfter(8));
  const [result, setResult] = useState<null | {
    rentalDays: number;
    subtotal: number;
    discount: number;
    total: number;
    minimumDays: number;
  }>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const localDays = daysBetween(startDate, returnDate);

  async function calculate() {
    setLoading(true);
    setError("");

    const response = await fetch("/api/pricing/calculate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        productSlug: product.slug,
        quantity,
        startDate,
        returnDate
      })
    });

    const data = await response.json();
    setLoading(false);

    if (!response.ok) {
      setResult(null);
      setError(data?.error?.message ?? "Unable to calculate rental price");
      return;
    }

    setResult(data.price);
  }

  return (
    <div className="rounded-lg border bg-card p-5">
      <div className="flex items-center gap-2">
        <Calculator className="h-5 w-5 text-primary" aria-hidden />
        <h2 className="text-lg font-semibold">Rental calculator</h2>
      </div>
      <div className="mt-4 grid gap-4">
        <div className="grid gap-2">
          <Label htmlFor="quantity">Quantity</Label>
          <Input
            id="quantity"
            type="number"
            min={1}
            value={quantity}
            onChange={(event) => setQuantity(Number(event.target.value))}
          />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="grid gap-2">
            <Label htmlFor="startDate">Start date</Label>
            <Input id="startDate" type="date" value={startDate} onChange={(event) => setStartDate(event.target.value)} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="returnDate">Return date</Label>
            <Input id="returnDate" type="date" value={returnDate} onChange={(event) => setReturnDate(event.target.value)} />
          </div>
        </div>
        <Button type="button" onClick={calculate} disabled={loading || localDays <= 0}>
          {loading ? <Loader2 className="animate-spin" aria-hidden /> : null}
          Calculate total
        </Button>
      </div>

      {error ? <p className="mt-4 text-sm text-destructive">{error}</p> : null}

      {result ? (
        <div className="mt-5 rounded-md bg-secondary p-4">
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
    </div>
  );
}
