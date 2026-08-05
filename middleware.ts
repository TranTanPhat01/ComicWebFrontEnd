import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const accessToken = request.cookies.get("comicweb_access_token")?.value;
  const refreshToken = request.cookies.get("comicweb_refresh_token")?.value;
  const mustChangePassword = request.cookies.get("comicweb_must_change_password")?.value === "true";

  const isAuthRoute = pathname === "/admin/login";
  const isChangePasswordRoute = pathname === "/admin/change-password";

  const hasSession = !!accessToken || !!refreshToken;

  // Protect admin routes
  if (pathname.startsWith("/admin")) {
    // 1. Not logged in -> Redirect to login page
    if (!hasSession && !isAuthRoute) {
      // Capture the path to redirect back after successful login
      const returnUrl = request.nextUrl.pathname + request.nextUrl.search;
      const loginUrl = new URL("/admin/login", request.url);
      loginUrl.searchParams.set("returnUrl", returnUrl);
      return NextResponse.redirect(loginUrl);
    }

    // 2. Logged in but must change password -> Force redirect to change password page
    if (hasSession && mustChangePassword && !isChangePasswordRoute) {
      return NextResponse.redirect(new URL("/admin/change-password", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  // Matches /admin, /admin/login, /admin/change-password, and all subpaths
  matcher: ["/admin", "/admin/:path*"],
};
