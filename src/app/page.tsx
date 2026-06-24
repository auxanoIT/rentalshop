import { ArrowRight, BadgeCheck, Banknote, Building2, CalendarDays, ShieldCheck, Truck } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { JsonLd } from "@/components/json-ld";
import { ProductCard } from "@/components/rental/product-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getActiveProducts } from "@/lib/catalog";
import { organizationJsonLd } from "@/lib/seo";

const trustItems = [
  { icon: Banknote, label: "Clear launch pricing" },
  { icon: BadgeCheck, label: "Verified devices" },
  { icon: Truck, label: "Delivery support" },
  { icon: CalendarDays, label: "Flexible rental dates" },
  { icon: ShieldCheck, label: "Document review" }
];

export default function HomePage() {
  const products = getActiveProducts();

  return (
    <>
      <JsonLd data={organizationJsonLd()} />
      <main>
        <section className="relative overflow-hidden border-b bg-[#10271b] text-white">
          <Image
            src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1800&q=80"
            alt="Nigerian business team using rented laptops for a training session"
            fill
            priority
            className="object-cover opacity-36"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#07140d] via-[#07140d]/80 to-[#07140d]/30" />
          <div className="container-page relative py-20 md:py-24">
            <p className="text-sm font-semibold text-[#80e0ad]">rent.itshop.ng</p>
            <h1 className="mt-4 max-w-3xl text-4xl font-semibold leading-tight md:text-6xl">
              IT equipment rental in Nigeria
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-white/80 md:text-lg">
              Rent verified business laptops for training, CBT exams, temporary teams, offices, and
              events. Start with Dell Latitude devices and request bulk or special specifications.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg">
                <Link href="/equipment/laptops">
                  Rent a laptop
                  <ArrowRight aria-hidden />
                </Link>
              </Button>
              <Button asChild size="lg" variant="secondary">
                <Link href="/bulk-laptop-rental">Request bulk rental</Link>
              </Button>
            </div>
          </div>
        </section>

        <section className="border-b bg-card">
          <div className="container-page grid gap-3 py-5 sm:grid-cols-2 lg:grid-cols-5">
            {trustItems.map((item) => (
              <div key={item.label} className="flex items-center gap-2 text-sm font-medium">
                <item.icon className="h-4 w-4 text-primary" aria-hidden />
                {item.label}
              </div>
            ))}
          </div>
        </section>

        <section className="container-page py-12">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <p className="text-sm font-semibold text-primary">Laptop rental Nigeria</p>
              <h2 className="mt-2 text-2xl font-semibold md:text-3xl">Launch laptop rental products</h2>
            </div>
            <Button asChild variant="outline">
              <Link href="/laptop-rental-price">View pricing page</Link>
            </Button>
          </div>
          <div className="mt-6 grid gap-5 md:grid-cols-3">
            {products.map((product, index) => (
              <ProductCard key={product.id} product={product} priority={index === 0} />
            ))}
          </div>
        </section>

        <section className="border-y bg-card">
          <div className="container-page py-12">
            <div className="max-w-2xl">
              <p className="text-sm font-semibold text-primary">How it works</p>
              <h2 className="mt-2 text-2xl font-semibold md:text-3xl">A direct rental flow for busy teams</h2>
            </div>
            <div className="mt-6 grid gap-4 md:grid-cols-4">
              {[
                "Choose equipment and dates",
                "Submit guest checkout details",
                "Pay online or request bank transfer",
                "Admin verifies, delivers, and tracks return"
              ].map((step, index) => (
                <Card key={step}>
                  <CardContent className="p-5">
                    <span className="font-mono text-sm text-primary">0{index + 1}</span>
                    <h3 className="mt-3 font-semibold">{step}</h3>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="container-page grid gap-6 py-12 lg:grid-cols-[0.8fr_1fr]">
          <div>
            <p className="text-sm font-semibold text-primary">SEO rental cluster</p>
            <h2 className="mt-2 text-2xl font-semibold md:text-3xl">Built for laptop rental searches</h2>
            <p className="mt-3 text-muted-foreground">
              The site launches with commercial pages for Lagos rental, training, CBT exams, bulk laptop
              rental, rental pricing, and broader IT equipment rental in Nigeria.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {[
              ["/laptop-rental-lagos", "Laptop rental Lagos"],
              ["/laptop-rental-for-training", "Training laptop rental"],
              ["/bulk-laptop-rental", "Bulk laptop rental"],
              ["/laptop-rental-for-cbt-exams", "CBT exam laptop rental"],
              ["/laptop-rental-price", "Laptop rental price"],
              ["/it-equipment-rental-nigeria", "IT equipment rental Nigeria"]
            ].map(([href, label]) => (
              <Link key={href} href={href} className="rounded-lg border bg-card p-4 font-medium hover:border-primary">
                {label}
              </Link>
            ))}
          </div>
        </section>

        <section className="border-t bg-card">
          <div className="container-page flex flex-col justify-between gap-6 py-10 md:flex-row md:items-center">
            <div>
              <h2 className="text-2xl font-semibold">Need 10+ laptops or a custom spec?</h2>
              <p className="mt-2 text-muted-foreground">
                Send quantity, dates, city, software needs, and preferred specifications for admin review.
              </p>
            </div>
            <Button asChild size="lg">
              <Link href="/contact">
                Send request
                <Building2 aria-hidden />
              </Link>
            </Button>
          </div>
        </section>
      </main>
    </>
  );
}
