/**
 * Public story DTOs.
 * These are the shapes returned by /api/v1/stories (public endpoints).
 * Do NOT import from admin-stories — keep them separated.
 */

export interface PublicStoryListItemDto {
  id: string;
  title: string;
  slug: string;
  coverImageUrl: string | null;
  description: string | null;
  authorName: string | null;
  status: StoryStatus;
  genres: string[];
  totalChapters: number;
  viewCount: number;
  updatedAt: string;
}

export interface PublicStoryDetailDto {
  id: string;
  title: string;
  slug: string;
  coverImageUrl: string | null;
  description: string | null;
  authorName: string | null;
  artistName: string | null;
  status: StoryStatus;
  genres: string[];
  totalChapters: number;
  viewCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface GenreOptionDto {
  id: number;
  name: string;
  slug: string;
}

export type StoryStatus = "Ongoing" | "Completed" | "Hiatus" | "Dropped";

export interface GetStoriesParams {
  pageNumber?: number;
  pageSize?: number;
  search?: string;
  genre?: string;
  status?: StoryStatus;
  sortBy?: string;
  /** Index signature for QueryParams compatibility */
  [key: string]: string | number | boolean | undefined | null;
}
