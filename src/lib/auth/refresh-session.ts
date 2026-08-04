import { cookies } from "next/headers";
import { env } from "@/lib/env";
import {
  ACCESS_TOKEN_COOKIE,
  REFRESH_TOKEN_COOKIE,
  clearAuthCookies,
  getRefreshToken
} from "./auth-cookies";

interface RefreshResponse {
  accessToken: string;
  expiresIn: number;
}

interface BackendApiEnvelope<T> {
  data: T;
  requestId: string;
}

/**
 * Performs a token refresh server-side.
 * 
 * 1. Reads the current refresh token from the browser cookie.
 * 2. Calls the backend POST /api/v1/auth/refresh forwarding the cookie.
 * 3. Rotates the browser cookies with the new access and refresh tokens.
 * 4. Returns the new access token, or null if the refresh failed.
 */
export async function refreshSession(): Promise<string | null> {
  const refreshToken = await getRefreshToken();
  if (!refreshToken) {
    await clearAuthCookies();
    return null;
  }

  try {
    const response = await fetch(`${env.apiBaseUrl}/api/v1/auth/refresh`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // Forward refresh token as the cookie backend expects
        "Cookie": `comicweb_refresh=${refreshToken}`,
      },
    });

    if (!response.ok) {
      await clearAuthCookies();
      return null;
    }

    const envelope = (await response.json()) as BackendApiEnvelope<RefreshResponse>;
    const refreshData = envelope.data;
    if (!refreshData || !refreshData.accessToken) {
      await clearAuthCookies();
      return null;
    }

    // Extract new refresh token from the backend's Set-Cookie header if rotated
    let newRefreshToken = refreshToken;
    const setCookieHeader = response.headers.get("set-cookie");
    if (setCookieHeader) {
      const match = setCookieHeader.match(/comicweb_refresh=([^;]+)/);
      if (match) {
        newRefreshToken = match[1];
      }
    }

    const cookieStore = await cookies();
    const isProd = process.env.NODE_ENV === "production";
    const baseOptions = {
      httpOnly: true,
      secure: isProd,
      sameSite: "lax" as const,
      path: "/",
    };

    // Update access token
    cookieStore.set(ACCESS_TOKEN_COOKIE, refreshData.accessToken, {
      ...baseOptions,
      maxAge: refreshData.expiresIn,
    });

    // Update refresh token
    cookieStore.set(REFRESH_TOKEN_COOKIE, newRefreshToken, {
      ...baseOptions,
      maxAge: 30 * 24 * 60 * 60,
    });

    return refreshData.accessToken;
  } catch (error) {
    await clearAuthCookies();
    return null;
  }
}
