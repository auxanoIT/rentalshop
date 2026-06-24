import Link from "next/link";

import { Button } from "@/components/ui/button";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Payment Success | ITShop Equipment Leasing",
  description: "Rental payment or order submission success.",
  path: "/payment/success",
  noIndex: true
});

export default async function PaymentSuccessPage({
  searchParams
}: {
  searchParams: Promise<{ reference?: string }>;
}) {
  const params = await searchParams;

  return (
    <main className="container-page py-16">
      <div className="max-w-2xl rounded-lg border bg-card p-6">
        <p className="text-sm font-semibold text-primary">Order received</p>
        <h1 className="mt-2 text-3xl font-semibold">Your rental request is in review</h1>
        <p className="mt-3 leading-7 text-muted-foreground">
          Admin will verify payment, documents, inventory, delivery, and deposit details before fulfilment.
        </p>
        {params.reference ? (
          <p className="mt-4 rounded-md bg-secondary p-3 font-mono text-sm">Reference: {params.reference}</p>
        ) : null}
        <Button asChild className="mt-6">
          <Link href="/equipment/laptops">Browse laptops</Link>
        </Button>
      </div>
    </main>
  );
}
