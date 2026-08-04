import { serverGet, type QueryParams } from "@/lib/api/server-api-client";
import { API_ROUTES } from "@/constants/api-routes";
import type { ApiResponse } from "@/lib/api/api-response";
import type { PaginatedResponse } from "@/types/pagination";
import type {
  PublicChapterListItemDto,
  PublicChapterDetailDto,
} from "../types/public-chapter.types";

/**
 * Fetches the list of chapters for a story.
 * Server Component usage only.
 */
export async function getPublicChapters(
  storySlug: string,
  params?: {
    pageNumber?: number;
    pageSize?: number;
    sortBy?: string;
  }
): Promise<ApiResponse<PaginatedResponse<PublicChapterListItemDto>>> {
  return serverGet(
    API_ROUTES.public.stories.chapters(storySlug),
    params as QueryParams | undefined
  );
}

/**
 * Fetches a single chapter by slug.
 * Server Component usage only.
 */
export async function getPublicChapterBySlug(
  storySlug: string,
  chapterSlug: string
): Promise<ApiResponse<PublicChapterDetailDto>> {
  return serverGet(
    API_ROUTES.public.stories.chapterDetail(storySlug, chapterSlug)
  );
}
