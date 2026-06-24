"use client";

import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useMemo, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { getCartItemKey, useCartStore } from "@/lib/client/stores/cart.store";
import { useCheckoutStore } from "@/lib/client/stores/checkout.store";
import { daysBetween, formatNaira } from "@/lib/utils";

type SubmissionState = "idle" | "submitting" | "success" | "error";
type PricingState = "idle" | "loading" | "ready" | "error";

type PricingLine = {
  productSlug: string;
  quantity: number;
  rentalDays: number;
  dailyRate: number;
  subtotal: number;
  discount: number;
  total: number;
};

type PricingQuote = {
  items: PricingLine[];
  quantity: number;
  rentalDays: number;
  minimumDays: number;
  subtotal: number;
  discount: number;
  deliveryFeeEstimate: number;
  total: number;
  securityDepositIncluded: false;
};

export function CheckoutForm() {
  const router = useRouter();
  const { items, clear } = useCartStore();
  const { startDate, returnDate, purpose, setDates, setPurpose } = useCheckoutStore();
  const [state, setState] = useState<SubmissionState>("idle");
  const [error, setError] = useState("");
  const [pricingState, setPricingState] = useState<PricingState>("idle");
  const [pricingError, setPricingError] = useState("");
  const [priceQuote, setPriceQuote] = useState<PricingQuote | null>(null);
  const [priceQuoteKey, setPriceQuoteKey] = useState("");
  const formRef = useRef<HTMLFormElement>(null);
  const rentalDays = daysBetween(startDate, returnDate);
  const orderQuantity = useMemo(() => items.reduce((sum, item) => sum + item.quantity, 0), [items]);
  const quoteItems = useMemo(
    () =>
      items.map((item) => ({
        productSlug: item.variantSlug ?? item.slug,
        quantity: item.quantity
      })),
    [items]
  );
  const quoteRequestKey = useMemo(
    () => JSON.stringify({ items: quoteItems, startDate, returnDate }),
    [quoteItems, returnDate, startDate]
  );
  const activePriceQuote = priceQuoteKey === quoteRequestKey ? priceQuote : null;
  const priceLinesBySlug = useMemo(
    () => new Map(activePriceQuote?.items.map((line) => [line.productSlug, line]) ?? []),
    [activePriceQuote]
  );
  const effectivePricingState: PricingState =
    items.length === 0
      ? "idle"
      : rentalDays <= 0
        ? "error"
        : activePriceQuote
          ? "ready"
          : pricingState === "error"
            ? "error"
            : "loading";
  const effectivePricingError = rentalDays <= 0 ? "Return date must be after start date" : pricingError;

  useEffect(() => {
    if (items.length === 0 || rentalDays <= 0) return;

    const controller = new AbortController();

    void Promise.resolve().then(async () => {
      setPricingState("loading");
      setPricingError("");

      try {
        const response = await fetch("/api/pricing/calculate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          signal: controller.signal,
          body: JSON.stringify({
            items: quoteItems,
            startDate,
            returnDate
          })
        });
        const data = await response.json().catch(() => ({}));
        if (!response.ok) {
          throw new Error(data?.error?.message ?? "Unable to calculate checkout total");
        }
        setPriceQuote(data.price as PricingQuote);
        setPriceQuoteKey(quoteRequestKey);
        setPricingState("ready");
      } catch (quoteError) {
        if (quoteError instanceof DOMException && quoteError.name === "AbortError") return;
        setPriceQuote(null);
        setPriceQuoteKey("");
        setPricingState("error");
        setPricingError(quoteError instanceof Error ? quoteError.message : "Unable to calculate checkout total");
      }
    });

    return () => controller.abort();
  }, [items.length, quoteItems, quoteRequestKey, rentalDays, returnDate, startDate]);

  async function submitCheckout(formData: FormData) {
    setState("submitting");
    setError("");

    if (effectivePricingState !== "ready" || !activePriceQuote) {
      setState("error");
      setError(effectivePricingError || "Checkout total is not ready yet.");
      return;
    }

    const payload = {
      customerType: formData.get("customerType"),
      name: formData.get("name"),
      companyName: formData.get("companyName") || undefined,
      contactName: formData.get("contactName") || undefined,
      phone: formData.get("phone"),
      email: formData.get("email"),
      deliveryAddress: formData.get("deliveryAddress"),
      city: formData.get("city") || undefined,
      state: formData.get("state") || undefined,
      purpose,
      notes: formData.get("notes") || undefined,
      rentalStartDate: startDate,
      returnDate,
      items: items.map((item) => ({
        productSlug: item.variantSlug ?? item.slug,
        quantity: item.quantity
      })),
      documentsMode: formData.get("documentsMode"),
      paymentMethod: formData.get("paymentMethod"),
      agreementAccepted: formData.get("agreementAccepted") === "on"
    };

    try {
      const orderResponse = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const orderData = await orderResponse.json();
      if (!orderResponse.ok) throw new Error(orderData?.error?.message ?? "Unable to create order");

      const documentFile = formData.get("documentFile");
      if (documentFile instanceof File && documentFile.size > 0) {
        const uploadForm = new FormData();
        uploadForm.set("customerId", orderData.order.customerId);
        uploadForm.set("orderId", orderData.order.id);
        uploadForm.set("documentType", "Verification document");
        uploadForm.set("file", documentFile);

        const uploadResponse = await fetch("/api/documents/upload", {
          method: "POST",
          body: uploadForm
        });
        if (!uploadResponse.ok) {
          const uploadData = await uploadResponse.json().catch(() => ({}));
          throw new Error(uploadData?.error?.message ?? "Document upload failed");
        }
      }

      if (payload.paymentMethod === "PAYSTACK") {
        const paymentResponse = await fetch("/api/payments/paystack/initiate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            orderId: orderData.order.id,
            email: payload.email
          })
        });
        const paymentData = await paymentResponse.json();
        if (!paymentResponse.ok) throw new Error(paymentData?.error?.message ?? "Unable to start payment");
        clear();
        window.location.href = paymentData.payment.authorizationUrl;
        return;
      }

      clear();
      setState("success");
      router.push(`/payment/success?reference=${orderData.order.reference}`);
    } catch (submissionError) {
      setState("error");
      setError(submissionError instanceof Error ? submissionError.message : "Checkout failed");
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await submitCheckout(new FormData(event.currentTarget));
  }

  async function handleSubmitClick() {
    const form = formRef.current;
    if (!form || !form.reportValidity()) return;
    await submitCheckout(new FormData(form));
  }

  if (items.length === 0) {
    return (
      <main className="container-page py-12">
        <h1 className="text-3xl font-semibold">Checkout</h1>
        <p className="mt-3 text-muted-foreground">Your cart is empty.</p>
        <Button asChild className="mt-6">
          <Link href="/equipment/laptops">Browse laptops</Link>
        </Button>
      </main>
    );
  }

  return (
    <main className="container-page py-12">
      <div className="max-w-3xl">
        <h1 className="text-3xl font-semibold">Checkout</h1>
        <p className="mt-2 text-muted-foreground">
          Submit rental details as a guest. Customer records are created securely in the backend.
        </p>
      </div>

      <form ref={formRef} onSubmit={handleSubmit} className="mt-8 grid gap-6 lg:grid-cols-[1fr_360px]">
        <div className="grid gap-6">
          <section className="rounded-lg border bg-card p-5">
            <h2 className="text-lg font-semibold">Rental dates</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-3">
              <div className="grid gap-2">
                <Label htmlFor="startDate">Start date</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={startDate}
                  onChange={(event) => setDates(event.target.value, returnDate)}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="returnDate">Return date</Label>
                <Input
                  id="returnDate"
                  type="date"
                  value={returnDate}
                  onChange={(event) => setDates(startDate, event.target.value)}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="purpose">Purpose</Label>
                <Select id="purpose" value={purpose} onChange={(event) => setPurpose(event.target.value)}>
                  <option>Training</option>
                  <option>CBT exams</option>
                  <option>Temporary staff</option>
                  <option>Event operations</option>
                  <option>Other</option>
                </Select>
              </div>
            </div>
          </section>

          <section className="rounded-lg border bg-card p-5">
            <h2 className="text-lg font-semibold">Customer details</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div className="grid gap-2">
                <Label htmlFor="customerType">Customer type</Label>
                <Select id="customerType" name="customerType" required>
                  <option value="INDIVIDUAL">Individual</option>
                  <option value="COMPANY">Company</option>
                  <option value="INSTITUTION">Institution</option>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="name">Name</Label>
                <Input id="name" name="name" required />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="companyName">Company or institution</Label>
                <Input id="companyName" name="companyName" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="contactName">Contact person</Label>
                <Input id="contactName" name="contactName" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="phone">Phone</Label>
                <Input id="phone" name="phone" required />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" type="email" required />
              </div>
            </div>
          </section>

          <section className="rounded-lg border bg-card p-5">
            <h2 className="text-lg font-semibold">Delivery and verification</h2>
            <div className="mt-4 grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="deliveryAddress">Delivery address</Label>
                <Textarea id="deliveryAddress" name="deliveryAddress" required />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="grid gap-2">
                  <Label htmlFor="city">City</Label>
                  <Input id="city" name="city" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="state">State</Label>
                  <Input id="state" name="state" />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="documentsMode">Documents</Label>
                <Select id="documentsMode" name="documentsMode">
                  <option value="EMAIL_LATER">I will send documents by email</option>
                  <option value="UPLOAD">Upload verification document now</option>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="documentFile">Verification document</Label>
                <Input id="documentFile" name="documentFile" type="file" accept=".pdf,.jpg,.jpeg,.png,.webp" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea id="notes" name="notes" />
              </div>
            </div>
          </section>
        </div>

        <aside className="h-fit rounded-lg border bg-card p-5">
          <h2 className="text-lg font-semibold">Order summary</h2>
          <div className="mt-4 grid gap-3 text-sm">
            {items.map((item) => {
              const itemKey = getCartItemKey(item);
              const priceLine = priceLinesBySlug.get(itemKey);
              const lineTotal = priceLine?.total ?? item.dailyRate * item.quantity * Math.max(1, rentalDays);

              return (
                <div key={itemKey} className="flex justify-between gap-4">
                  <span>
                    {item.quantity} x {item.name}
                  </span>
                  <span className="font-medium">{formatNaira(lineTotal)}</span>
                </div>
              );
            })}
          </div>
          <div className="mt-5 border-t pt-5">
            <div className="flex justify-between text-sm">
              <span>Rental days</span>
              <span>{activePriceQuote?.rentalDays ?? rentalDays}</span>
            </div>
            <div className="mt-2 flex justify-between text-sm">
              <span>Total quantity</span>
              <span>{activePriceQuote?.quantity ?? orderQuantity}</span>
            </div>
            <div className="mt-2 flex justify-between text-sm">
              <span>Subtotal</span>
              <span>{formatNaira(activePriceQuote?.subtotal ?? 0)}</span>
            </div>
            <div className="mt-2 flex justify-between text-sm">
              <span>Discount</span>
              <span>{formatNaira(activePriceQuote?.discount ?? 0)}</span>
            </div>
            <div className="mt-2 flex justify-between text-sm">
              <span>Delivery estimate</span>
              <span>{formatNaira(activePriceQuote?.deliveryFeeEstimate ?? 0)}</span>
            </div>
            <div className="mt-3 flex justify-between border-t pt-3 text-xl font-semibold">
              <span>Validated total</span>
              <span>{activePriceQuote ? formatNaira(activePriceQuote.total) : "Checking..."}</span>
            </div>
            {effectivePricingState === "loading" ? (
              <p className="mt-3 text-xs text-muted-foreground">Checking pricing rules...</p>
            ) : null}
            {effectivePricingError ? <p className="mt-3 text-sm text-destructive">{effectivePricingError}</p> : null}
            <p className="mt-2 text-xs leading-5 text-muted-foreground">
              Security deposit is reviewed by admin and is not included by default.
            </p>
          </div>
          <div className="mt-5 grid gap-3">
            <Label htmlFor="paymentMethod">Payment method</Label>
            <Select id="paymentMethod" name="paymentMethod">
              <option value="PAYSTACK">Paystack online payment</option>
              <option value="BANK_TRANSFER">Bank transfer review</option>
            </Select>
            <label className="flex items-start gap-3 text-sm">
              <input name="agreementAccepted" type="checkbox" className="mt-1" required />
              <span>
                I accept the{" "}
                <Link href="/rental-agreement" className="text-primary underline">
                  rental agreement
                </Link>
                .
              </span>
            </label>
            {error ? <p className="text-sm text-destructive">{error}</p> : null}
            <Button
              type="button"
              onClick={handleSubmitClick}
              disabled={state === "submitting" || effectivePricingState !== "ready" || rentalDays <= 0}
            >
              {state === "submitting" ? <Loader2 className="animate-spin" aria-hidden /> : null}
              Submit rental order
            </Button>
          </div>
        </aside>
      </form>
    </main>
  );
}
