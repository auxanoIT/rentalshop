"use client";

import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useMemo, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { getCartSubtotal, useCartStore } from "@/lib/client/stores/cart.store";
import { useCheckoutStore } from "@/lib/client/stores/checkout.store";
import { daysBetween, formatNaira } from "@/lib/utils";

type SubmissionState = "idle" | "submitting" | "success" | "error";

export function CheckoutForm() {
  const router = useRouter();
  const { items, clear } = useCartStore();
  const { startDate, returnDate, purpose, setDates, setPurpose } = useCheckoutStore();
  const [state, setState] = useState<SubmissionState>("idle");
  const [error, setError] = useState("");
  const formRef = useRef<HTMLFormElement>(null);
  const rentalDays = daysBetween(startDate, returnDate);
  const subtotal = useMemo(() => getCartSubtotal(items, Math.max(1, rentalDays)), [items, rentalDays]);

  async function submitCheckout(formData: FormData) {
    setState("submitting");
    setError("");

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
        productSlug: item.slug,
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
            {items.map((item) => (
              <div key={item.slug} className="flex justify-between gap-4">
                <span>
                  {item.quantity} × {item.name}
                </span>
                <span className="font-medium">{formatNaira(item.dailyRate * item.quantity * Math.max(1, rentalDays))}</span>
              </div>
            ))}
          </div>
          <div className="mt-5 border-t pt-5">
            <div className="flex justify-between text-sm">
              <span>Rental days</span>
              <span>{rentalDays}</span>
            </div>
            <div className="mt-3 flex justify-between text-xl font-semibold">
              <span>Estimated total</span>
              <span>{formatNaira(subtotal)}</span>
            </div>
            <p className="mt-2 text-xs leading-5 text-muted-foreground">
              Delivery fee, discounts, and security deposit are reviewed by admin. Deposit is not included by default.
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
              disabled={state === "submitting" || rentalDays <= 0}
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
