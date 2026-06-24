import Link from "next/link";

import { Button } from "@/components/ui/button";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Payment Failed | ITShop Equipment Leasing",
  description: "Rental payment failed.",
  path: "/payment/failed",
  noIndex: true
});

export default function PaymentFailedPage() {
  return (
    <main className="container-page py-16">
      <div className="max-w-2xl rounded-lg border bg-card p-6">
        <p className="text-sm font-semibold text-destructive">Payment failed</p>
        <h1 className="mt-2 text-3xl font-semibold">The payment was not completed</h1>
        <p className="mt-3 text-muted-foreground">
          You can retry checkout or contact admin for bank transfer review.
        </p>
        <div className="mt-6 flex gap-3">
          <Button asChild>
            <Link href="/checkout">Retry checkout</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/contact">Contact admin</Link>
          </Button>
        </div>
      </div>
    </main>
  );
}
