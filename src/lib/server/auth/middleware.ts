import { jwtVerify } from "jose";

export const ADMIN_COOKIE_NAME = "itshop_admin_session";

export function isAdminPath(pathname: string) {
  return pathname === "/admin" || pathname.startsWith("/admin/");
}

export function isPublicAdminPath(pathname: string) {
  return pathname === "/admin/login";
}

export function isSensitiveApiPath(pathname: string) {
  return pathname.startsWith("/api/admin") || pathname.startsWith("/api/documents");
}

function getSessionSecret() {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error("ADMIN_SESSION_SECRET must be at least 32 characters");
  }
  return new TextEncoder().encode(secret);
}

export async function hasValidAdminSessionCookie(token?: string | null) {
  if (!token) return false;

  try {
    await jwtVerify(token, getSessionSecret());
    return true;
  } catch {
    return false;
  }
}
