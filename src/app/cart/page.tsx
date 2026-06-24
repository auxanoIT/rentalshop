import { CartPageClient } from "@/components/checkout/cart-page-client";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Rental Cart | ITShop Equipment Leasing",
  description: "Review laptop rental cart before checkout.",
  path: "/cart",
  noIndex: true
});

export default function CartPage() {
  return <CartPageClient />;
}
