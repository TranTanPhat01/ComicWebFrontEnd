import { NextResponse } from "next/server";
import { env } from "@/lib/env";
import { clearAuthCookies, getRefreshToken } from "@/lib/auth/auth-cookies";

export async function POST() {
  const refreshToken = await getRefreshToken();

  // Try to revoke the token on the backend
  if (refreshToken) {
    try {
      await fetch(`${env.apiBaseUrl}/api/v1/auth/logout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Cookie": `comicweb_refresh=${refreshToken}`,
        },
      });
    } catch (error) {
      // Ignore backend revoke error, we must still clean local session
    }
  }

  // Clear browser cookies
  await clearAuthCookies();

  return new NextResponse(null, { status: 204 });
}
