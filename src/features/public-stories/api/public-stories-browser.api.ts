"use client";

import { browserGet } from "@/lib/api/browser-api-client";
import { API_ROUTES } from "@/constants/api-routes";
import type { ApiResponse } from "@/lib/api/api-response";
import type { PaginatedResponse } from "@/types/pagination";
import type {
  PublicStoryListItemDto,
  GetStoriesParams,
} from "../types/public-story.types";

/**
 * Browser-side: Fetches the paginated list of public stories for client components.
 */
export async function getPublicStoriesBrowser(
  params?: GetStoriesParams
): Promise<ApiResponse<PaginatedResponse<PublicStoryListItemDto>>> {
  return browserGet(API_ROUTES.public.stories.list, params);
}
