import { CheckoutForm } from "@/components/checkout/checkout-form";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Checkout | ITShop Equipment Leasing",
  description: "Submit guest laptop rental checkout details.",
  path: "/checkout",
  noIndex: true
});

export default function CheckoutPage() {
  return <CheckoutForm />;
}
