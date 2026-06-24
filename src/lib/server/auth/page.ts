import { redirect } from "next/navigation";

import { getAdminSession } from "@/lib/server/auth/session";

export async function requireAdminPage() {
  const session = await getAdminSession();
  if (!session) {
    redirect("/admin/login");
  }
  return session;
}
