/**
 * Public story DTOs.
 * These are the shapes returned by /api/v1/stories (public endpoints).
 * Field names must match the JSON serialised output from the BE (camelCase).
 * Do NOT import from admin-stories — keep them separated.
 */

/** Summary of a published chapter (embedded in list & detail). Matches BE PublicChapterSummaryDto. */
export interface PublicChapterSummaryDto {
  id: number;
  slug: string;
  number: number;
  title: string;
  publishedAt: string | null;
}

/** Item returned in GET /api/v1/stories list. Matches BE PublicStoryListItemDto. */
export interface PublicStoryListItemDto {
  id: number;
  slug: string;
  title: string;
  description: string | null;
  /** BE field: coverUrl */
  coverUrl: string | null;
  authorName: string | null;
  status: StoryStatus;
  genres: string[];
  /** BE field: chapterCount */
  chapterCount: number;
  latestChapter: PublicChapterSummaryDto | null;
  publishedAt: string | null;
  updatedAt: string | null;
}

/** Detail returned in GET /api/v1/stories/{slug}. Matches BE PublicStoryDetailDto.
 *  NOTE: chapters array is embedded in the detail — no separate chapters endpoint needed for the detail page.
 */
export interface PublicStoryDetailDto {
  id: number;
  slug: string;
  title: string;
  description: string | null;
  /** BE field: coverUrl */
  coverUrl: string | null;
  authorName: string | null;
  status: StoryStatus;
  genres: string[];
  publishedAt: string | null;
  updatedAt: string | null;
  /** Embedded chapters (only in detail response). */
  chapters: PublicChapterSummaryDto[];
}

/** Genre item returned from /api/v1/stories/genres. Matches BE GenreListItemDto. */
export interface GenreOptionDto {
  id: number;
  name: string;
  slug: string;
  isActive: boolean;
  storyCount: number;
}

export type StoryStatus = "Ongoing" | "Completed" | "Hiatus" | "Dropped";

/** Query parameters for GET /api/v1/stories. Matches BE GetPublishedStoriesQuery. */
export interface GetStoriesParams {
  /** Page number (1-based). BE param: page */
  page?: number;
  pageSize?: number;
  /** Full-text search. BE param: query */
  query?: string;
  /** Filter by author name. BE param: author */
  author?: string;
  /** Filter by genre slug/name. BE param: genre */
  genre?: string;
  /** Sort field. Prefix with "-" for descending. e.g. "-updatedAt". BE param: sort */
  sort?: string;
  /** Index signature for QueryParams compatibility */
  [key: string]: string | number | boolean | undefined | null;
}
