/**
 * Admin story DTOs.
 * These are SEPARATE from public story DTOs.
 * Admin endpoints may return additional fields (e.g., internal status, IDs).
 * Do NOT import public story types here.
 */

export interface AdminStoryListItemDto {
  id: number;
  title: string;
  slug: string;
  coverImageUrl: string | null;
  authorName: string | null;
  genres: string[];
  status: AdminStoryStatus;
  version: number;
  publishedAt: string | null;
  deletedAt: string | null;
  scheduledAt: string | null;
  createAt: string;
  updateAt: string | null;
  // Fallbacks for display UI
  totalChapters?: number;
  viewCount?: number;
}

export interface AdminStoryDetailDto {
  id: number;
  title: string;
  slug: string;
  description: string | null;
  coverImageUrl: string | null;
  authorName: string | null;
  genres: string[];
  status: AdminStoryStatus;
  version: number;
  publishedAt: string | null;
  deletedAt: string | null;
  scheduledAt: string | null;
  createAt: string;
  updateAt: string | null;
  // Fallbacks for display UI
  totalChapters?: number;
  viewCount?: number;
}

export interface CreateStoryRequestDto {
  title: string;
  slug?: string;
  description?: string;
  authorName?: string;
  coverImageUrl?: string;
  genres?: string[];
}

export interface UpdateStoryRequestDto {
  id: number;
  title: string;
  slug?: string;
  description?: string;
  authorName?: string;
  coverImageUrl?: string;
  genres?: string[];
  version: number;
}

export type AdminStoryStatus = "Draft" | "Published" | "Hidden" | "Completed";

export interface AdminGetStoriesParams {
  page?: number;
  pageSize?: number;
  search?: string;
  status?: string;
  includeDeleted?: boolean;
  sort?: string;
  desc?: boolean;
  /** Index signature for QueryParams compatibility */
  [key: string]: string | number | boolean | undefined | null;
}

export interface AdminStatsDto {
  totalStories: number;
  totalChapters: number;
  totalUsers: number;
  totalLogs: number;
  lockedChapters: number;
  ongoingStories: number;
  totalAffiliateClicks: number;
}
