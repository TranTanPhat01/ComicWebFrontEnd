/**
 * Server-side API client.
 *
 * Used in Server Components and Route Handlers only.
 * Reads the API base URL from environment variables at call time (not module init)
 * so it works correctly in different rendering contexts.
 *
 * Auth token is passed explicitly — never read from localStorage.
 * For server-side auth, pass the token from cookies (via `serverEnv.authSecret`).
 */

import { env } from "@/lib/env";
import {
  createSuccessResponse,
  createErrorResponse,
  type ApiResponse,
} from "./api-response";
import { parseResponseError, parseNetworkError } from "./api-error";
import { buildUrl } from "./build-query-string";

export type QueryParams = Record<
  string,
  string | number | boolean | undefined | null
>;

export interface RequestOptions {
  /** Additional headers to send with the request. */
  headers?: HeadersInit;
  /** Bearer token for authenticated requests. */
  accessToken?: string;
  /** Next.js cache / revalidation options. */
  next?: NextFetchRequestConfig;
  /** Abort signal. */
  signal?: AbortSignal;
}

/**
 * Performs a GET request from the server side.
 */
export async function serverGet<T>(
  path: string,
  params?: QueryParams,
  options: RequestOptions = {}
): Promise<ApiResponse<T>> {
  const url = `${env.apiBaseUrl}${buildUrl(path, params)}`;
  return serverFetch<T>("GET", url, undefined, options);
}

/**
 * Performs a POST request from the server side.
 */
export async function serverPost<T>(
  path: string,
  body?: unknown,
  options: RequestOptions = {}
): Promise<ApiResponse<T>> {
  const url = `${env.apiBaseUrl}${path}`;
  return serverFetch<T>("POST", url, body, options);
}

/**
 * Performs a PUT request from the server side.
 */
export async function serverPut<T>(
  path: string,
  body?: unknown,
  options: RequestOptions = {}
): Promise<ApiResponse<T>> {
  const url = `${env.apiBaseUrl}${path}`;
  return serverFetch<T>("PUT", url, body, options);
}

/**
 * Performs a DELETE request from the server side.
 */
export async function serverDelete<T>(
  path: string,
  options: RequestOptions = {}
): Promise<ApiResponse<T>> {
  const url = `${env.apiBaseUrl}${path}`;
  return serverFetch<T>("DELETE", url, undefined, options);
}

// ─── Internal ─────────────────────────────────────────────────────────────────

async function serverFetch<T>(
  method: string,
  url: string,
  body: unknown,
  options: RequestOptions
): Promise<ApiResponse<T>> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    Accept: "application/json",
  };

  const isAdminRequest = url.toLowerCase().includes("/admin/");
  let token = options.accessToken;

  if (!token && isAdminRequest) {
    try {
      const { getAccessToken } = await import("@/lib/auth/auth-cookies");
      token = await getAccessToken();
    } catch {
      // In non-server contexts (e.g. build-time pre-render), cookies() might throw.
    }
  }

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  if (options.headers) {
    Object.assign(headers, options.headers);
  }

  try {
    let response = await fetch(url, {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
      signal: options.signal,
      next: options.next,
    });

    // If 401 on an admin request, try to refresh token and retry exactly once
    const isRetry = options.headers ? new Headers(options.headers).get("X-Is-Retry") === "true" : false;
    if (response.status === 401 && isAdminRequest && !isRetry) {
      try {
        const { refreshSession } = await import("@/lib/auth/refresh-session");
        const newToken = await refreshSession();
        if (newToken) {
          const retryHeaders: Record<string, string> = {
            ...headers,
            "Authorization": `Bearer ${newToken}`,
            "X-Is-Retry": "true",
          };
          
          response = await fetch(url, {
            method,
            headers: retryHeaders,
            body: body !== undefined ? JSON.stringify(body) : undefined,
            signal: options.signal,
            next: options.next,
          });
        } else {
          const { clearAuthCookies } = await import("@/lib/auth/auth-cookies");
          await clearAuthCookies();
        }
      } catch {
        // Fall through to parse original 401
      }
    }

    if (!response.ok) {
      const error = await parseResponseError(response);
      return createErrorResponse(error.toApiError(), response.status);
    }

    // Handle 204 No Content
    if (response.status === 204) {
      return createSuccessResponse<T>(undefined as T, 204);
    }

    const data = (await response.json()) as T;
    return createSuccessResponse(data, response.status);
  } catch (error) {
    const networkError = parseNetworkError(error);
    return createErrorResponse(networkError.toApiError(), 0);
  }
}
