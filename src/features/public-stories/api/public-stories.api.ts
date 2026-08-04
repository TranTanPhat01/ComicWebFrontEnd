import { serverGet } from "@/lib/api/server-api-client";
import { API_ROUTES } from "@/constants/api-routes";
import type { ApiResponse } from "@/lib/api/api-response";
import type { PaginatedResponse } from "@/types/pagination";
import type {
  PublicStoryListItemDto,
  PublicStoryDetailDto,
  GetStoriesParams,
  GenreOptionDto,
} from "../types/public-story.types";

/**
 * Fetches the paginated list of public stories.
 * Server Component usage only.
 */
export async function getPublicStories(
  params?: GetStoriesParams
): Promise<ApiResponse<PaginatedResponse<PublicStoryListItemDto>>> {
  return serverGet(API_ROUTES.public.stories.list, params);
}

/**
 * Fetches a single public story by its slug.
 * Server Component usage only.
 */
export async function getPublicStoryBySlug(
  storySlug: string
): Promise<ApiResponse<PublicStoryDetailDto>> {
  return serverGet(API_ROUTES.public.stories.detail(storySlug));
}

export async function getGenres(): Promise<ApiResponse<GenreOptionDto[]>> {
  return serverGet(API_ROUTES.public.stories.genres);
}
