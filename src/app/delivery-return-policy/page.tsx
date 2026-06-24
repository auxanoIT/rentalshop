import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Delivery and Return Policy | ITShop Equipment Leasing",
  description: "Delivery, return, inspection, and closure policy for ITShop Equipment Leasing rentals.",
  path: "/delivery-return-policy"
});

export default function DeliveryReturnPolicyPage() {
  return (
    <main className="container-page py-12">
      <article className="max-w-3xl">
        <p className="text-sm font-semibold text-primary">Policy</p>
        <h1 className="mt-2 text-4xl font-semibold">Delivery and return policy</h1>
        <div className="mt-6 grid gap-5 leading-7 text-muted-foreground">
          <p>
            Delivery availability, schedule, and delivery fee are confirmed during admin review. Orders are
            not considered ready for delivery until payment, documents, inventory, and deposit notes are resolved.
          </p>
          <p>
            Return schedules are tracked by admin. Returned devices may be marked as returned, under
            inspection, cleared, damaged, or lost depending on inspection outcome.
          </p>
          <p>
            Overdue, damaged, or missing equipment can attract additional charges according to the final
            agreement communicated for the order.
          </p>
        </div>
      </article>
    </main>
  );
}
