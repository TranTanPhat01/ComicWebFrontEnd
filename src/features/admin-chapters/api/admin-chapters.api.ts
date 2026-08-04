import { serverGet } from "@/lib/api/server-api-client";
import { API_ROUTES } from "@/constants/api-routes";
import type { ApiResponse } from "@/lib/api/api-response";
import type { PaginatedResponse } from "@/types/pagination";
import type {
  AdminChapterListItemDto,
  AdminChapterDetailDto,
  GetAdminChaptersParams,
} from "../types/admin-chapter.types";

/**
 * Fetches paginated chapters for a story. Server Component only.
 */
export async function getAdminChapters(
  storyId: string,
  params?: GetAdminChaptersParams,
  accessToken?: string
): Promise<ApiResponse<PaginatedResponse<AdminChapterListItemDto>>> {
  return serverGet(API_ROUTES.admin.chapters.list(storyId), params, { accessToken });
}

/**
 * Fetches a single chapter by ID. Server Component only.
 */
export async function getAdminChapterById(
  storyId: string,
  chapterId: string,
  accessToken?: string
): Promise<ApiResponse<AdminChapterDetailDto>> {
  return serverGet(API_ROUTES.admin.chapters.detail(storyId, chapterId), undefined, { accessToken });
}
