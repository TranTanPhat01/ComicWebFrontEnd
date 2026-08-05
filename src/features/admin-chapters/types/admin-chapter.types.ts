/**
 * Admin chapter DTOs.
 * Separate from public chapter DTOs.
 */

export interface AdminChapterListItemDto {
  id: number;
  storyId: number;
  chapterNumber: number;
  title: string;
  slug: string;
  status: ChapterStatus;
  version: number;
  publishedAt: string | null;
  deletedAt: string | null;
  createAt: string;
  updateAt: string | null;
  isLocked: boolean;
  affiliateLink: string | null;
}

export interface AdminChapterDetailDto {
  id: number;
  storyId: number;
  chapterNumber: number;
  title: string;
  slug: string;
  content: string;
  status: ChapterStatus;
  version: number;
  publishedAt: string | null;
  deletedAt: string | null;
  createAt: string;
  updateAt: string | null;
  isLocked: boolean;
  affiliateLink: string | null;
}

export type ChapterStatus = "Draft" | "Published" | "Hidden";

export interface CreateChapterRequestDto {
  chapterNumber: number;
  title: string;
  slug?: string;
  content: string;
  isLocked?: boolean;
  affiliateLink?: string | null;
}

export interface UpdateChapterRequestDto {
  chapterNumber: number;
  title: string;
  slug?: string;
  content: string;
  version: number;
  isLocked?: boolean;
  affiliateLink?: string | null;
}

export interface GetAdminChaptersParams {
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
