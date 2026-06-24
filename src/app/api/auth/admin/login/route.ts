import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { getPrisma, hasDatabaseUrl } from "@/lib/server/db/prisma";
import { badRequest, unauthorized } from "@/lib/server/errors";
import { withApiError } from "@/lib/server/http";
import { createAdminSessionToken, setAdminSessionCookie } from "@/lib/server/auth/session";
import { verifyPassword } from "@/lib/server/auth/password";
import { assertRateLimit } from "@/lib/server/rate-limit";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1)
});

export async function POST(request: NextRequest) {
  return withApiError(async () => {
    assertRateLimit(request, "admin-login", { limit: 5, windowMs: 60_000 });
    const input = loginSchema.parse(await request.json());

    let admin: {
      id: string;
      name: string;
      email: string;
      role: string;
      passwordHash?: string;
      isActive: boolean;
    } | null = null;

    if (hasDatabaseUrl()) {
      admin = await getPrisma().adminUser.findUnique({
        where: { email: input.email }
      });
    } else {
      const seedEmail = process.env.ADMIN_SEED_EMAIL ?? "admin@itshop.ng";
      const seedPassword = process.env.ADMIN_SEED_PASSWORD;
      if (!seedPassword) {
        throw badRequest("Set ADMIN_SEED_PASSWORD or configure DATABASE_URL before admin login");
      }
      admin =
        input.email === seedEmail && input.password === seedPassword
          ? {
              id: "local-admin",
              name: process.env.ADMIN_SEED_NAME ?? "ITShop Admin",
              email: seedEmail,
              role: "SUPER_ADMIN",
              isActive: true
            }
          : null;
    }

    if (!admin || !admin.isActive) {
      throw unauthorized("Invalid admin credentials");
    }

    if (admin.passwordHash) {
      const valid = await verifyPassword(input.password, admin.passwordHash);
      if (!valid) throw unauthorized("Invalid admin credentials");
    }

    const token = await createAdminSessionToken({
      adminId: admin.id,
      name: admin.name,
      email: admin.email,
      role: admin.role
    });

    const response = NextResponse.json({
      admin: {
        id: admin.id,
        name: admin.name,
        email: admin.email,
        role: admin.role
      }
    });
    setAdminSessionCookie(response, token);
    return response;
  });
}
