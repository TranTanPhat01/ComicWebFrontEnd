/**
 * Builds a URL query string from a plain object.
 * Skips keys with undefined or null values.
 *
 * @example
 * buildQueryString({ page: 1, size: 10, q: undefined })
 * // → "?page=1&size=10"
 */
export function buildQueryString(
  params: Record<string, string | number | boolean | undefined | null>
): string {
  const searchParams = new URLSearchParams();

  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === null) continue;
    searchParams.set(key, String(value));
  }

  const qs = searchParams.toString();
  return qs ? `?${qs}` : "";
}

/**
 * Appends a query string to a base URL path.
 *
 * @example
 * buildUrl("/api/v1/stories", { page: 1, size: 10 })
 * // → "/api/v1/stories?page=1&size=10"
 */
export function buildUrl(
  path: string,
  params?: Record<string, string | number | boolean | undefined | null>
): string {
  if (!params) return path;
  return `${path}${buildQueryString(params)}`;
}
