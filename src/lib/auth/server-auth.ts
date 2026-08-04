import { cookies } from "next/headers";

/**
 * Cookie name for the JWT access token.
 * Must be HttpOnly and Secure in production.
 */
export const AUTH_COOKIE_NAME = "auth_token" as const;

/**
 * Cookie name for the refresh token.
 */
export const REFRESH_COOKIE_NAME = "refresh_token" as const;

/**
 * Cookie options for the auth token.
 * Adjust maxAge and sameSite as needed for your auth flow.
 */
export const AUTH_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
  maxAge: 60 * 60, // 1 hour
};

/**
 * Reads the JWT access token from the HttpOnly cookie.
 * This runs server-side only (Server Components, Route Handlers).
 */
export async function getServerAccessToken(): Promise<string | undefined> {
  const cookieStore = await cookies();
  return cookieStore.get(AUTH_COOKIE_NAME)?.value;
}

/**
 * Checks whether the user is currently authenticated (server-side).
 */
export async function isAuthenticated(): Promise<boolean> {
  const token = await getServerAccessToken();
  return !!token;
}
