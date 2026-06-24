import { Laptop, Menu, ShoppingCart } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";

const navItems = [
  { href: "/equipment/laptops", label: "Laptops" },
  { href: "/laptop-rental-lagos", label: "Lagos" },
  { href: "/bulk-laptop-rental", label: "Bulk rental" },
  { href: "/laptop-rental-price", label: "Prices" },
  { href: "/how-it-works", label: "How it works" },
  { href: "/faq", label: "FAQ" }
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur">
      <div className="container-page flex min-h-16 items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <span className="flex h-9 w-9 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <Laptop className="h-5 w-5" aria-hidden />
          </span>
          <span className="leading-tight">
            ITShop
            <span className="block text-xs font-normal text-muted-foreground">Equipment Leasing</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-5 text-sm font-medium lg:flex">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} className="text-muted-foreground hover:text-foreground">
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          <Button asChild variant="outline">
            <Link href="/cart">
              <ShoppingCart aria-hidden />
              Cart
            </Link>
          </Button>
          <Button asChild>
            <Link href="/checkout">Checkout</Link>
          </Button>
        </div>

        <details className="group relative md:hidden">
          <summary className="flex h-10 w-10 cursor-pointer list-none items-center justify-center rounded-md border bg-card">
            <Menu className="h-5 w-5" aria-hidden />
            <span className="sr-only">Open menu</span>
          </summary>
          <div className="absolute right-0 mt-3 w-72 rounded-lg border bg-card p-3 shadow-lg">
            <div className="grid gap-1">
              {navItems.map((item) => (
                <Link key={item.href} href={item.href} className="rounded-md px-3 py-2 text-sm hover:bg-muted">
                  {item.label}
                </Link>
              ))}
              <Link href="/cart" className="rounded-md px-3 py-2 text-sm hover:bg-muted">
                Cart
              </Link>
              <Link href="/checkout" className="rounded-md px-3 py-2 text-sm hover:bg-muted">
                Checkout
              </Link>
            </div>
          </div>
        </details>
      </div>
    </header>
  );
}
