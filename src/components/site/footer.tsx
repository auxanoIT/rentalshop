import Link from "next/link";

const footerSections = [
  {
    title: "Rentals",
    links: [
      { href: "/equipment/laptops", label: "Laptop rental" },
      { href: "/bulk-laptop-rental", label: "Bulk rental" },
      { href: "/laptop-rental-for-training", label: "Training rental" },
      { href: "/laptop-rental-for-cbt-exams", label: "CBT exam rental" }
    ]
  },
  {
    title: "Company",
    links: [
      { href: "/how-it-works", label: "How it works" },
      { href: "/rental-agreement", label: "Rental agreement" },
      { href: "/delivery-return-policy", label: "Delivery and returns" },
      { href: "/contact", label: "Contact" }
    ]
  },
  {
    title: "Admin",
    links: [{ href: "/admin/login", label: "Admin login" }]
  }
];

export function SiteFooter() {
  return (
    <footer className="border-t bg-card">
      <div className="container-page grid gap-8 py-10 md:grid-cols-[1.4fr_2fr]">
        <div>
          <p className="text-lg font-semibold">ITShop Equipment Leasing</p>
          <p className="mt-3 max-w-md text-sm leading-6 text-muted-foreground">
            IT equipment rental for Nigerian teams, starting with verified Dell Latitude laptops for
            training, exams, offices, events, and temporary projects.
          </p>
        </div>
        <div className="grid gap-6 sm:grid-cols-3">
          {footerSections.map((section) => (
            <div key={section.title}>
              <p className="text-sm font-semibold">{section.title}</p>
              <div className="mt-3 grid gap-2 text-sm text-muted-foreground">
                {section.links.map((link) => (
                  <Link key={link.href} href={link.href} className="hover:text-foreground">
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="border-t py-4">
        <div className="container-page flex flex-col gap-2 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <span>&copy; {new Date().getFullYear()} ITShop.ng. All rights reserved.</span>
          <span>rent.itshop.ng</span>
        </div>
      </div>
    </footer>
  );
}
