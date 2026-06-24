import { ArrowRight } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "How Laptop Rental Works in Nigeria | ITShop",
  description: "Learn how to rent laptops from ITShop Equipment Leasing as a guest customer.",
  path: "/how-it-works"
});

const steps = [
  "Choose laptop specification and quantity",
  "Select start date, return date, and rental purpose",
  "Submit guest checkout details and agreement acceptance",
  "Pay with Paystack or choose bank transfer review",
  "Admin verifies documents, payment, deposit, and inventory",
  "Receive delivery, use the equipment, then return for inspection"
];

export default function HowItWorksPage() {
  return (
    <main className="container-page py-12">
      <div className="max-w-3xl">
        <p className="text-sm font-semibold text-primary">Rental process</p>
        <h1 className="mt-2 text-4xl font-semibold">How laptop rental works in Nigeria</h1>
        <p className="mt-4 text-muted-foreground">
          The flow is built for guest checkout, admin review, document verification, delivery tracking,
          and return inspection.
        </p>
      </div>
      <div className="mt-8 grid gap-4 md:grid-cols-3">
        {steps.map((step, index) => (
          <Card key={step}>
            <CardContent className="p-5">
              <span className="font-mono text-sm text-primary">{String(index + 1).padStart(2, "0")}</span>
              <h2 className="mt-3 font-semibold">{step}</h2>
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Button asChild>
          <Link href="/equipment/laptops">
            Browse laptops
            <ArrowRight aria-hidden />
          </Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/faq">Read FAQ</Link>
        </Button>
      </div>
    </main>
  );
}
