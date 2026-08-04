import { serverGet } from "@/lib/api/server-api-client";
import { API_ROUTES } from "@/constants/api-routes";
import type { ApiResponse } from "@/lib/api/api-response";
import type { PaginatedResponse } from "@/types/pagination";
import type {
  AdminStoryListItemDto,
  AdminStoryDetailDto,
  AdminGetStoriesParams,
} from "../types/admin-story.types";

/**
 * Fetches the paginated list of stories for the admin panel.
 * Server Component usage only.
 */
export async function getAdminStories(
  params?: AdminGetStoriesParams,
  accessToken?: string
): Promise<ApiResponse<PaginatedResponse<AdminStoryListItemDto>>> {
  return serverGet(API_ROUTES.admin.stories.list, params, { accessToken });
}

/**
 * Fetches a single story by ID for the admin panel.
 * Server Component usage only.
 */
export async function getAdminStoryById(
  storyId: string,
  accessToken?: string
): Promise<ApiResponse<AdminStoryDetailDto>> {
  return serverGet(API_ROUTES.admin.stories.detail(storyId), undefined, {
    accessToken,
  });
}
