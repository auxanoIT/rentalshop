import { ContactForm } from "@/components/contact/contact-form";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Contact ITShop Equipment Leasing",
  description: "Contact ITShop Equipment Leasing for laptop rental, bulk rental, CBT exam rental, and custom IT equipment requests.",
  path: "/contact"
});

export default function ContactPage() {
  return (
    <main className="container-page grid gap-8 py-12 lg:grid-cols-[0.8fr_1fr]">
      <div>
        <p className="text-sm font-semibold text-primary">Contact</p>
        <h1 className="mt-2 text-4xl font-semibold">Send a rental request</h1>
        <p className="mt-4 leading-7 text-muted-foreground">
          Use this form for custom specifications, bulk quantities, equipment that is not listed, or
          project details that need admin review.
        </p>
        <div className="mt-6 rounded-lg border bg-card p-5 text-sm text-muted-foreground">
          <p className="font-medium text-foreground">Admin review covers:</p>
          <p className="mt-2">Availability, dates, payment, documents, delivery, deposit, and return terms.</p>
        </div>
      </div>
      <ContactForm />
    </main>
  );
}
