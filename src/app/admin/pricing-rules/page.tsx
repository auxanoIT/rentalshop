import { updatePricingRulesAction } from "@/app/admin/actions";
import { AdminShell } from "@/components/admin/admin-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { requireAdminPage } from "@/lib/server/auth/page";
import { hasDatabaseUrl } from "@/lib/server/db/prisma";
import { getAdminPricingRules } from "@/lib/server/modules/pricing/pricing.service";
import { formatNaira } from "@/lib/utils";

export default async function AdminPricingRulesPage({
  searchParams
}: {
  searchParams?: Promise<{ error?: string; saved?: string }>;
}) {
  const session = await requireAdminPage();
  const [rules, query] = await Promise.all([
    getAdminPricingRules(),
    searchParams ? searchParams : Promise.resolve({} as { error?: string; saved?: string })
  ]);
  const databaseReady = hasDatabaseUrl();
  const bulkDiscountPercent = Math.round(rules.bulkDiscountRate * 100);
  const summary = [
    ["Single unit minimum days", `${rules.minDaysSingleUnit}`],
    ["Bulk threshold", `${rules.bulkThreshold}`],
    ["Bulk minimum days", `${rules.minDaysBulk}`],
    ["Maximum standard days", `${rules.maxStandardDays}`],
    ["Bulk discount rate", `${bulkDiscountPercent}%`],
    ["Default delivery estimate", formatNaira(rules.deliveryFeeDefault)]
  ];

  return (
    <AdminShell session={session}>
      <h2 className="text-2xl font-semibold">Pricing rules</h2>
      {query.saved ? (
        <div className="mt-4 rounded-md border border-[#b8e2c7] bg-[#edfdf3] px-4 py-3 text-sm text-[#166534]">
          Pricing rules saved.
        </div>
      ) : null}
      {query.error === "database" ? (
        <div className="mt-4 rounded-md border border-[#f0d48a] bg-[#fff9e8] px-4 py-3 text-sm text-[#6f4a00]">
          Pricing changes require a configured Neon database.
        </div>
      ) : null}
      <div className="mt-5 grid gap-5 lg:grid-cols-[1fr_360px]">
        <div className="grid gap-3 md:grid-cols-2">
          {summary.map(([label, value]) => (
            <Card key={label}>
              <CardContent className="p-5">
                <p className="text-sm text-muted-foreground">{label}</p>
                <p className="mt-2 text-2xl font-semibold">{value}</p>
              </CardContent>
            </Card>
          ))}
        </div>
        <form action={updatePricingRulesAction} className="grid h-fit gap-4 rounded-lg border bg-card p-5">
          <h3 className="font-semibold">Update default rules</h3>
          <input type="hidden" name="name" value={rules.name} />
          <div className="grid gap-2">
            <Label htmlFor="minDaysSingleUnit">Single unit minimum days</Label>
            <Input id="minDaysSingleUnit" name="minDaysSingleUnit" type="number" min="1" defaultValue={rules.minDaysSingleUnit} required />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="bulkThreshold">Bulk threshold</Label>
            <Input id="bulkThreshold" name="bulkThreshold" type="number" min="1" defaultValue={rules.bulkThreshold} required />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="minDaysBulk">Bulk minimum days</Label>
            <Input id="minDaysBulk" name="minDaysBulk" type="number" min="1" defaultValue={rules.minDaysBulk} required />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="maxStandardDays">Maximum standard days</Label>
            <Input id="maxStandardDays" name="maxStandardDays" type="number" min="1" defaultValue={rules.maxStandardDays} required />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="bulkDiscountPercent">Bulk discount %</Label>
            <Input id="bulkDiscountPercent" name="bulkDiscountPercent" type="number" min="0" max="100" step="0.01" defaultValue={bulkDiscountPercent} required />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="deliveryFeeDefault">Default delivery fee</Label>
            <Input id="deliveryFeeDefault" name="deliveryFeeDefault" type="number" min="0" step="1" defaultValue={rules.deliveryFeeDefault} required />
          </div>
          <Button type="submit" disabled={!databaseReady}>
            Save rules
          </Button>
        </form>
      </div>
    </AdminShell>
  );
}
