/**
 * Admin story DTOs.
 * These are SEPARATE from public story DTOs.
 * Admin endpoints may return additional fields (e.g., internal status, IDs).
 * Do NOT import public story types here.
 */

export interface AdminStoryListItemDto {
  id: string;
  title: string;
  slug: string;
  coverImageUrl: string | null;
  status: AdminStoryStatus;
  totalChapters: number;
  viewCount: number;
  version: number;
  createdAt: string;
  updatedAt: string;
}

export interface AdminStoryDetailDto {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  coverImageUrl: string | null;
  authorName: string | null;
  artistName: string | null;
  status: AdminStoryStatus;
  genres: string[];
  totalChapters: number;
  viewCount: number;
  version: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateStoryRequestDto {
  title: string;
  slug?: string;
  description?: string;
  authorName?: string;
  artistName?: string;
  coverImageUrl?: string;
  genres?: string[];
}

export interface UpdateStoryRequestDto {
  title?: string;
  slug?: string;
  description?: string;
  authorName?: string;
  artistName?: string;
  coverImageUrl?: string;
  genres?: string[];
  version?: number;
}

export type AdminStoryStatus = "Draft" | "Published" | "Hidden" | "Completed";

export interface AdminGetStoriesParams {
  pageNumber?: number;
  pageSize?: number;
  search?: string;
  status?: AdminStoryStatus;
  sortBy?: string;
  sortDirection?: "asc" | "desc";
  /** Index signature for QueryParams compatibility */
  [key: string]: string | number | boolean | undefined | null;
}
