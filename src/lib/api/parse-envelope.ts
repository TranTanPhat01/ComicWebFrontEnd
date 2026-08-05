/**
 * Parses backend envelopes.
 * Handles both {data, requestId} and {data, meta, requestId} shapes.
 */

export interface PaginatedEnvelope<T> {
  data: T[];
  meta: {
    pageNumber?: number;
    page?: number;
    pageSize?: number;
    totalItems?: number;
    totalCount?: number;
    totalPages?: number;
  };
  requestId: string;
}

export function parseEnvelopeData<T>(raw: unknown): T | null {
  if (!raw || typeof raw !== "object") return null;
  const obj = raw as Record<string, unknown>;
  if ("data" in obj) {
    return obj.data as T;
  }
  return raw as T;
}

export function parsePaginatedEnvelope<T>(raw: unknown): {
  items: T[];
  totalPages: number;
  totalCount: number;
} {
  if (!raw || typeof raw !== "object") {
    return { items: [], totalPages: 1, totalCount: 0 };
  }

  const obj = raw as Record<string, unknown>;

  // Check standard BE envelope: { data: T[], meta: { page/pageNumber, pageSize, totalItems/totalCount, totalPages } }
  if ("data" in obj && Array.isArray(obj.data)) {
    const meta = obj.meta as Record<string, number> | undefined;
    return {
      items: obj.data as T[],
      totalPages: meta?.totalPages ?? 1,
      totalCount: meta?.totalItems ?? meta?.totalCount ?? (obj.data as unknown[]).length,
    };
  }

  // Check alternate shape: { items: T[], totalPages: number, totalCount: number }
  if ("items" in obj && Array.isArray(obj.items)) {
    return {
      items: obj.items as T[],
      totalPages: (obj.totalPages as number) ?? 1,
      totalCount: (obj.totalCount as number) ?? (obj.totalItems as number) ?? (obj.items as unknown[]).length,
    };
  }

  // Check array fallback
  if (Array.isArray(raw)) {
    return {
      items: raw as T[],
      totalPages: 1,
      totalCount: raw.length,
    };
  }

  return { items: [], totalPages: 1, totalCount: 0 };
}
