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
