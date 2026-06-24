import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Rental Agreement | ITShop Equipment Leasing",
  description: "Read the launch rental agreement terms for ITShop Equipment Leasing.",
  path: "/rental-agreement"
});

export default function RentalAgreementPage() {
  return (
    <main className="container-page py-12">
      <article className="max-w-3xl">
        <p className="text-sm font-semibold text-primary">Policy</p>
        <h1 className="mt-2 text-4xl font-semibold">Rental agreement</h1>
        <div className="mt-6 grid gap-5 leading-7 text-muted-foreground">
          <p>
            Customers must provide accurate rental details, contact information, delivery address, and
            verification documents when requested. Equipment remains the property of ITShop.ng or its
            equipment partners during the rental period.
          </p>
          <p>
            Checkout totals estimate rental charges. Security deposit, delivery charges, damage fees,
            loss fees, and special configuration charges may be reviewed and communicated separately by admin.
          </p>
          <p>
            Customers must return equipment on or before the return date in the same condition received,
            subject to normal usage. Admin inspection determines final closure.
          </p>
        </div>
      </article>
    </main>
  );
}
