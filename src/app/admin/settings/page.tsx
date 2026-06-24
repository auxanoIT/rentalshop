import { updateSettingsAction } from "@/app/admin/actions";
import { AdminShell } from "@/components/admin/admin-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { requireAdminPage } from "@/lib/server/auth/page";
import { hasDatabaseUrl } from "@/lib/server/db/prisma";
import { getBusinessSettings } from "@/lib/server/modules/settings/settings.service";

type BusinessSettingsView = {
  contact?: {
    email?: string;
    phone?: string;
    market?: string;
  };
  business_contact?: {
    email?: string;
    phone?: string;
    market?: string;
  };
  bankTransfer?: {
    details?: string;
  };
  emailTemplates?: {
    notes?: string;
  };
};

export default async function AdminSettingsPage({
  searchParams
}: {
  searchParams?: Promise<{ error?: string; saved?: string }>;
}) {
  const session = await requireAdminPage();
  const [settings, query] = await Promise.all([
    getBusinessSettings() as Promise<BusinessSettingsView>,
    searchParams ? searchParams : Promise.resolve({} as { error?: string; saved?: string })
  ]);
  const contact = settings.contact ?? settings.business_contact;
  const databaseReady = hasDatabaseUrl();

  return (
    <AdminShell session={session}>
      <h2 className="text-2xl font-semibold">Settings</h2>
      {query.saved ? (
        <div className="mt-4 rounded-md border border-[#b8e2c7] bg-[#edfdf3] px-4 py-3 text-sm text-[#166534]">
          Settings saved.
        </div>
      ) : null}
      {query.error === "database" ? (
        <div className="mt-4 rounded-md border border-[#f0d48a] bg-[#fff9e8] px-4 py-3 text-sm text-[#6f4a00]">
          Settings changes require a configured Neon database.
        </div>
      ) : null}
      <form action={updateSettingsAction} className="mt-5 grid max-w-2xl gap-4 rounded-lg border bg-card p-5">
        <div className="grid gap-2">
          <Label htmlFor="email">Business email</Label>
          <Input id="email" name="email" type="email" defaultValue={contact?.email ?? "support@itshop.ng"} required />
        </div>
        <div className="grid gap-2 md:grid-cols-2">
          <div className="grid gap-2">
            <Label htmlFor="phone">Business phone</Label>
            <Input id="phone" name="phone" defaultValue={contact?.phone ?? ""} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="market">Market</Label>
            <Input id="market" name="market" defaultValue={contact?.market ?? "Nigeria"} />
          </div>
        </div>
        <div className="grid gap-2">
          <Label htmlFor="bank">Bank transfer details</Label>
          <Textarea
            id="bank"
            name="bank"
            defaultValue={settings.bankTransfer?.details ?? ""}
            placeholder="Bank name, account number, account name"
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="emailTemplates">Email template notes</Label>
          <Textarea
            id="emailTemplates"
            name="emailTemplates"
            defaultValue={settings.emailTemplates?.notes ?? ""}
            placeholder="Order, payment, document, delivery, and return email notes"
          />
        </div>
        <Button type="submit" disabled={!databaseReady}>
          Save settings
        </Button>
      </form>
    </AdminShell>
  );
}
