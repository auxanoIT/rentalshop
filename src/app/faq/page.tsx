import { JsonLd } from "@/components/json-ld";
import { Card, CardContent } from "@/components/ui/card";
import { buildMetadata, faqJsonLd } from "@/lib/seo";

const faqs = [
  {
    question: "What is the minimum laptop rental period?",
    answer:
      "One laptop has a 7-day minimum rental period. Bulk rentals of 10 laptops or more can be reviewed from 2 days upward."
  },
  {
    question: "Do customers need accounts?",
    answer:
      "No. Phase one uses guest checkout. The backend creates customer records automatically after order submission."
  },
  {
    question: "Is security deposit included in checkout total?",
    answer:
      "No. Security deposit is reviewed and communicated separately by admin after order submission."
  },
  {
    question: "Can I request a special laptop specification?",
    answer:
      "Yes. Use the special specification or contact flow for custom RAM, storage, operating system, software, quantity, or device type."
  },
  {
    question: "Can I pay by bank transfer?",
    answer:
      "Yes. Bank transfer orders are marked for manual review, and admin confirms payment before fulfilment."
  }
];

export const metadata = buildMetadata({
  title: "Laptop Rental FAQ Nigeria | ITShop Equipment Leasing",
  description: "Answers to common laptop rental questions for Nigeria, Lagos, training, CBT exams, payment, documents, and returns.",
  path: "/faq"
});

export default function FaqPage() {
  return (
    <>
      <JsonLd data={faqJsonLd(faqs)} />
      <main className="container-page py-12">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold text-primary">FAQ</p>
          <h1 className="mt-2 text-4xl font-semibold">Laptop rental FAQ Nigeria</h1>
          <p className="mt-4 text-muted-foreground">
            Practical answers about checkout, rental dates, payments, documents, delivery, returns, and admin review.
          </p>
        </div>
        <div className="mt-8 grid gap-4">
          {faqs.map((faq) => (
            <Card key={faq.question}>
              <CardContent className="p-5">
                <h2 className="font-semibold">{faq.question}</h2>
                <p className="mt-2 leading-7 text-muted-foreground">{faq.answer}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </>
  );
}
