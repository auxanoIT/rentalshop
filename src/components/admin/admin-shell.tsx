import {
  Boxes,
  ClipboardList,
  CreditCard,
  FileCheck,
  Home,
  Laptop,
  PackageCheck,
  RotateCcw,
  Settings,
  Truck,
  Users
} from "lucide-react";
import Link from "next/link";

import { AdminLogoutButton } from "@/components/admin/admin-logout-button";
import { type AdminSession } from "@/lib/server/auth/session";

const adminNav = [
  { href: "/admin/dashboard", label: "Dashboard", icon: Home },
  { href: "/admin/products", label: "Products", icon: Laptop },
  { href: "/admin/categories", label: "Categories", icon: Boxes },
  { href: "/admin/pricing-rules", label: "Pricing", icon: ClipboardList },
  { href: "/admin/inventory", label: "Inventory", icon: PackageCheck },
  { href: "/admin/orders", label: "Orders", icon: ClipboardList },
  { href: "/admin/customers", label: "Customers", icon: Users },
  { href: "/admin/documents", label: "Documents", icon: FileCheck },
  { href: "/admin/payments", label: "Payments", icon: CreditCard },
  { href: "/admin/deliveries", label: "Deliveries", icon: Truck },
  { href: "/admin/returns", label: "Returns", icon: RotateCcw },
  { href: "/admin/special-requests", label: "Requests", icon: ClipboardList },
  { href: "/admin/settings", label: "Settings", icon: Settings }
];

export function AdminShell({
  session,
  children
}: {
  session: AdminSession;
  children: React.ReactNode;
}) {
  return (
    <main className="container-page py-8">
      <div className="mb-6 flex flex-col gap-4 rounded-lg border bg-card p-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm text-muted-foreground">Admin dashboard</p>
          <h1 className="text-xl font-semibold">ITShop Equipment Leasing</h1>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-muted-foreground">{session.name}</span>
          <AdminLogoutButton />
        </div>
      </div>
      <div className="grid gap-6 lg:grid-cols-[240px_1fr]">
        <aside className="h-fit rounded-lg border bg-card p-3">
          <nav className="grid gap-1">
            {adminNav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-2 rounded-md px-3 py-2 text-sm text-muted-foreground hover:bg-muted hover:text-foreground"
              >
                <item.icon className="h-4 w-4" aria-hidden />
                {item.label}
              </Link>
            ))}
          </nav>
        </aside>
        <section>{children}</section>
      </div>
    </main>
  );
}
