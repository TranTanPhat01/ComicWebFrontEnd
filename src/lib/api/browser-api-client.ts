"use client";

/**
 * Browser-side API client.
 *
 * Used in Client Components and custom hooks only.
 * Reads the API base URL from NEXT_PUBLIC_API_BASE_URL.
 *
 * Auth token is read from an HTTP-only cookie via a server action or
 * passed explicitly. NEVER stored in or read from localStorage.
 */

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

export interface BrowserRequestOptions {
  /** Additional headers. */
  headers?: HeadersInit;
  /** Bearer token (obtained from server action, never localStorage). */
  accessToken?: string;
  /** Abort signal for cancellation. */
  signal?: AbortSignal;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "";

function getBaseUrl(path: string): string {
  // These paths are proxied through Next.js server routes so the server can
  // attach the HttpOnly auth cookie as a Bearer token.
  if (
    path.startsWith("/api/admin") ||
    path.startsWith("/api/v1/admin") ||
    path.startsWith("/api/v1/me")
  ) {
    return "";
  }
  return API_BASE_URL;
}

/**
 * Performs a GET request from the browser.
 */
export async function browserGet<T>(
  path: string,
  params?: QueryParams,
  options: BrowserRequestOptions = {}
): Promise<ApiResponse<T>> {
  const url = `${getBaseUrl(path)}${buildUrl(path, params)}`;
  return browserFetch<T>("GET", url, undefined, options);
}

/**
 * Performs a POST request from the browser.
 */
export async function browserPost<T>(
  path: string,
  body?: unknown,
  options: BrowserRequestOptions = {}
): Promise<ApiResponse<T>> {
  const url = `${getBaseUrl(path)}${path}`;
  return browserFetch<T>("POST", url, body, options);
}

/**
 * Performs a PUT request from the browser.
 */
export async function browserPut<T>(
  path: string,
  body?: unknown,
  options: BrowserRequestOptions = {}
): Promise<ApiResponse<T>> {
  const url = `${getBaseUrl(path)}${path}`;
  return browserFetch<T>("PUT", url, body, options);
}

/**
 * Performs a PATCH request from the browser.
 */
export async function browserPatch<T>(
  path: string,
  body?: unknown,
  options: BrowserRequestOptions = {}
): Promise<ApiResponse<T>> {
  const url = `${getBaseUrl(path)}${path}`;
  return browserFetch<T>("PATCH", url, body, options);
}

/**
 * Performs a DELETE request from the browser.
 */
export async function browserDelete<T>(
  path: string,
  options: BrowserRequestOptions = {}
): Promise<ApiResponse<T>> {
  const url = `${getBaseUrl(path)}${path}`;
  return browserFetch<T>("DELETE", url, undefined, options);
}

// ─── Internal ─────────────────────────────────────────────────────────────────

async function browserFetch<T>(
  method: string,
  url: string,
  body: unknown,
  options: BrowserRequestOptions
): Promise<ApiResponse<T>> {
  const isFormData = body instanceof FormData;
  const headers: Record<string, string> = {
    Accept: "application/json",
  };

  if (!isFormData) {
    headers["Content-Type"] = "application/json";
  }

  if (options.accessToken) {
    headers["Authorization"] = `Bearer ${options.accessToken}`;
  }

  if (options.headers) {
    Object.assign(headers, options.headers);
  }

  try {
    const response = await fetch(url, {
      method,
      headers,
      body: body !== undefined ? (isFormData ? (body as any) : JSON.stringify(body)) : undefined,
      signal: options.signal,
      // Always include cookies for auth (HttpOnly cookie pattern)
      credentials: "include",
    });

    if (!response.ok) {
      const error = await parseResponseError(response);
      return createErrorResponse(error.toApiError(), response.status);
    }

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
