import { jwtVerify, SignJWT } from "jose";
import { cookies } from "next/headers";
import type { NextRequest, NextResponse } from "next/server";

import { unauthorized } from "@/lib/server/errors";

const ADMIN_COOKIE = "itshop_admin_session";

export type AdminSession = {
  adminId: string;
  email: string;
  name: string;
  role: string;
};

function getSessionSecret() {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error("ADMIN_SESSION_SECRET must be at least 32 characters");
  }
  return new TextEncoder().encode(secret);
}

export async function createAdminSessionToken(session: AdminSession) {
  return new SignJWT(session)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("8h")
    .sign(getSessionSecret());
}

export async function verifyAdminSessionToken(token?: string | null): Promise<AdminSession | null> {
  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, getSessionSecret());
    return {
      adminId: String(payload.adminId),
      email: String(payload.email),
      name: String(payload.name),
      role: String(payload.role)
    };
  } catch {
    return null;
  }
}

export function setAdminSessionCookie(response: NextResponse, token: string) {
  response.cookies.set(ADMIN_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 8
  });
}

export function clearAdminSessionCookie(response: NextResponse) {
  response.cookies.set(ADMIN_COOKIE, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0
  });
}

export async function getAdminSessionFromRequest(request: NextRequest) {
  return verifyAdminSessionToken(request.cookies.get(ADMIN_COOKIE)?.value);
}

export async function requireAdminRequest(request: NextRequest) {
  const session = await getAdminSessionFromRequest(request);
  if (!session) {
    throw unauthorized("Admin login required");
  }
  return session;
}

export async function getAdminSession() {
  const cookieStore = await cookies();
  return verifyAdminSessionToken(cookieStore.get(ADMIN_COOKIE)?.value);
}
