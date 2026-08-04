/**
 * Admin chapter DTOs.
 * Separate from public chapter DTOs.
 */

export interface AdminChapterListItemDto {
  id: string;
  title: string;
  slug: string;
  chapterNumber: number;
  status: ChapterStatus;
  version: number;
  publishedAt: string | null;
  createdAt: string;
  isLocked: boolean;
  affiliateLink: string | null;
}

export interface AdminChapterDetailDto {
  id: string;
  title: string;
  slug: string;
  chapterNumber: number;
  content: string;
  status: ChapterStatus;
  version: number;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
  isLocked: boolean;
  affiliateLink: string | null;
}

export type ChapterStatus = "Draft" | "Published" | "Archived";

export interface CreateChapterRequestDto {
  title: string;
  chapterNumber: number;
  content: string;
  status?: ChapterStatus;
  isLocked?: boolean;
  affiliateLink?: string | null;
}

export interface UpdateChapterRequestDto {
  title?: string;
  chapterNumber?: number;
  content?: string;
  status?: ChapterStatus;
  version?: number;
  isLocked?: boolean;
  affiliateLink?: string | null;
}

export interface GetAdminChaptersParams {
  pageNumber?: number;
  pageSize?: number;
  status?: ChapterStatus;
  sortBy?: string;
  sortDirection?: "asc" | "desc";
  /** Index signature for QueryParams compatibility */
  [key: string]: string | number | boolean | undefined | null;
}
