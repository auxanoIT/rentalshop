import { NextResponse, type NextRequest } from "next/server";

import { ADMIN_COOKIE_NAME, isAdminPath, isPublicAdminPath } from "@/lib/server/auth/middleware";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (isAdminPath(pathname) && !isPublicAdminPath(pathname)) {
    const hasSession = request.cookies.has(ADMIN_COOKIE_NAME);
    if (!hasSession) {
      const loginUrl = new URL("/admin/login", request.url);
      loginUrl.searchParams.set("next", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"]
};
