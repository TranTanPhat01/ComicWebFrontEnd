import { getPublicStories, getGenres } from "../api/public-stories.api";
import { DEMO_STORIES } from "../demo/demo-stories";
import { env } from "@/lib/env";
import { parsePaginatedEnvelope } from "@/lib/api/parse-envelope";
import type { PublicStoryListItemDto, GenreOptionDto, GetStoriesParams } from "../types/public-story.types";

export interface StoriesPageResult {
  stories: PublicStoryListItemDto[];
  totalPages: number;
  totalCount: number;
  genres: GenreOptionDto[];
  isFallback: boolean;
}

/** Shared parser for paginated API envelope (handles both {data,meta} and {items,...} shapes) */
export function parseStoriesList(rawData: unknown): {
  stories: PublicStoryListItemDto[];
  totalPages: number;
  totalCount: number;
} {
  const parsed = parsePaginatedEnvelope<PublicStoryListItemDto>(rawData);
  return {
    stories: parsed.items,
    totalPages: parsed.totalPages,
    totalCount: parsed.totalCount,
  };
}

/** Fetches stories with optional params + dev fallback */
export async function fetchStoriesPage(
  params: GetStoriesParams,
  fallbackFilter?: (story: PublicStoryListItemDto) => boolean
): Promise<StoriesPageResult> {
  const pageSize = params.pageSize ?? 12;
  const page = params.page ?? 1;

  const [response, genresResponse] = await Promise.all([
    getPublicStories(params),
    getGenres(),
  ]);

  let genres: GenreOptionDto[] = [];
  if (genresResponse.success && genresResponse.data) {
    const rawGenres = genresResponse.data as unknown;
    if (Array.isArray(rawGenres)) {
      genres = rawGenres as GenreOptionDto[];
    } else if (rawGenres && typeof rawGenres === "object") {
      const obj = rawGenres as Record<string, unknown>;
      if ("data" in obj && Array.isArray(obj.data)) {
        genres = obj.data as GenreOptionDto[];
      }
    }
  }

  if (response.success && response.data) {
    const parsed = parseStoriesList(response.data as unknown);
    if (parsed.stories.length > 0) {
      return { ...parsed, genres, isFallback: false };
    }
  }

  // Dev fallback
  if (env.isDevelopment) {
    const filtered = fallbackFilter ? DEMO_STORIES.filter(fallbackFilter) : [...DEMO_STORIES];
    const totalCount = filtered.length;
    const totalPages = Math.ceil(totalCount / pageSize);
    const start = (page - 1) * pageSize;
    const stories = filtered.slice(start, start + pageSize);
    return { stories, totalPages, totalCount, genres, isFallback: true };
  }

  return { stories: [], totalPages: 1, totalCount: 0, genres, isFallback: false };
}
