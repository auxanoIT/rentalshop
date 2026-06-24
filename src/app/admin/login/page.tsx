import { AdminLoginForm } from "@/components/admin/admin-login-form";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Admin Login | ITShop Equipment Leasing",
  description: "Admin login for ITShop Equipment Leasing.",
  path: "/admin/login",
  noIndex: true
});

export default async function AdminLoginPage({
  searchParams
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const params = await searchParams;
  const nextPath = params.next?.startsWith("/admin") ? params.next : "/admin/dashboard";

  return (
    <main className="container-page grid min-h-[70vh] place-items-center py-12">
      <div className="w-full max-w-md">
        <AdminLoginForm nextPath={nextPath} />
      </div>
    </main>
  );
}
