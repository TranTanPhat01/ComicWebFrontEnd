import { cookies } from "next/headers";

export const ACCESS_TOKEN_COOKIE = "comicweb_access_token";
export const REFRESH_TOKEN_COOKIE = "comicweb_refresh_token";
export const MUST_CHANGE_PASSWORD_COOKIE = "comicweb_must_change_password";

const isProd = process.env.NODE_ENV === "production";

const BASE_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: isProd,
  sameSite: "lax" as const,
  path: "/",
};

/**
 * Retrieves the access token from server cookies.
 */
export async function getAccessToken(): Promise<string | undefined> {
  const cookieStore = await cookies();
  return cookieStore.get(ACCESS_TOKEN_COOKIE)?.value;
}

/**
 * Retrieves the refresh token from server cookies.
 */
export async function getRefreshToken(): Promise<string | undefined> {
  const cookieStore = await cookies();
  return cookieStore.get(REFRESH_TOKEN_COOKIE)?.value;
}

/**
 * Checks whether the user is required to change password based on cookies.
 */
export async function getMustChangePassword(): Promise<boolean> {
  const cookieStore = await cookies();
  return cookieStore.get(MUST_CHANGE_PASSWORD_COOKIE)?.value === "true";
}

interface SetAuthCookiesParams {
  accessToken: string;
  refreshToken: string;
  expiresIn: number; // in seconds
  mustChangePassword: boolean;
}

/**
 * Sets access, refresh, and force password change cookies on the client browser.
 */
export async function setAuthCookies({
  accessToken,
  refreshToken,
  expiresIn,
  mustChangePassword,
}: SetAuthCookiesParams): Promise<void> {
  const cookieStore = await cookies();

  // Set access token (expires according to backend settings)
  cookieStore.set(ACCESS_TOKEN_COOKIE, accessToken, {
    ...BASE_COOKIE_OPTIONS,
    maxAge: expiresIn,
  });

  // Set refresh token (lasts longer, e.g. 30 days)
  cookieStore.set(REFRESH_TOKEN_COOKIE, refreshToken, {
    ...BASE_COOKIE_OPTIONS,
    maxAge: 30 * 24 * 60 * 60,
  });

  // Set force change password flag
  cookieStore.set(MUST_CHANGE_PASSWORD_COOKIE, String(mustChangePassword), {
    ...BASE_COOKIE_OPTIONS,
    maxAge: mustChangePassword ? expiresIn : 30 * 24 * 60 * 60,
  });
}

/**
 * Clears all authentication cookies.
 */
export async function clearAuthCookies(): Promise<void> {
  const cookieStore = await cookies();

  cookieStore.delete(ACCESS_TOKEN_COOKIE);
  cookieStore.delete(REFRESH_TOKEN_COOKIE);
  cookieStore.delete(MUST_CHANGE_PASSWORD_COOKIE);
}
