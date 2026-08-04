/**
 * Common API-related types shared across features.
 */

/** Generic ID type. */
export type EntityId = string;

/** Sort direction. */
export type SortDirection = "asc" | "desc";

/** Common sort params. */
export interface SortParams {
  sortBy?: string;
  sortDirection?: SortDirection;
}

/** Combined filter, sort, and pagination params. */
export interface ListParams {
  pageNumber?: number;
  pageSize?: number;
  sortBy?: string;
  sortDirection?: SortDirection;
  search?: string;
}
