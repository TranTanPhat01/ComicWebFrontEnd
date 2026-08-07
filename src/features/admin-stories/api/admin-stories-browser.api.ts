"use client";

import {
  browserDelete,
  browserGet,
  browserPost,
  browserPut,
} from "@/lib/api/browser-api-client";
import { API_ROUTES } from "@/constants/api-routes";
import type { ApiResponse } from "@/lib/api/api-response";
import type { PaginatedResponse } from "@/types/pagination";
import type {
  AdminStoryListItemDto,
  AdminStoryDetailDto,
  AdminGetStoriesParams,
  CreateStoryRequestDto,
  UpdateStoryRequestDto,
  AdminStatsDto,
} from "../types/admin-story.types";

/**
 * Browser-side: fetches paginated stories (for client components).
 */
export async function getAdminStoriesBrowser(
  params?: AdminGetStoriesParams
): Promise<ApiResponse<PaginatedResponse<AdminStoryListItemDto>>> {
  return browserGet(API_ROUTES.admin.stories.list, params);
}

/**
 * Fetches a single story by ID for edit form. Browser-side.
 */
export async function getAdminStoryByIdBrowser(
  storyId: string | number
): Promise<ApiResponse<AdminStoryDetailDto>> {
  return browserGet(API_ROUTES.admin.stories.detail(storyId));
}

/**
 * Creates a new story. Browser-side.
 */
export async function createAdminStory(
  payload: CreateStoryRequestDto
): Promise<ApiResponse<AdminStoryDetailDto>> {
  return browserPost(API_ROUTES.admin.stories.create, payload);
}

/**
 * Updates an existing story. Browser-side.
 */
export async function updateAdminStory(
  storyId: string | number,
  payload: UpdateStoryRequestDto
): Promise<ApiResponse<AdminStoryDetailDto>> {
  return browserPut(API_ROUTES.admin.stories.update(storyId), payload);
}

/**
 * Deletes a story. Browser-side.
 */
export async function deleteAdminStory(
  storyId: string | number,
  version: number
): Promise<ApiResponse<void>> {
  return browserDelete(`${API_ROUTES.admin.stories.delete(storyId)}?version=${version}`);
}

/**
 * Publishes a story. Browser-side.
 */
export async function publishAdminStory(
  storyId: string | number,
  version: number
): Promise<ApiResponse<AdminStoryDetailDto>> {
  return browserPost(API_ROUTES.admin.stories.publish(storyId), { version });
}

/**
 * Unpublishes a story (back to Draft). Browser-side.
 */
export async function unpublishAdminStory(
  storyId: string | number,
  version: number
): Promise<ApiResponse<AdminStoryDetailDto>> {
  return browserPost(API_ROUTES.admin.stories.unpublish(storyId), { version });
}

/**
 * Hides a story. Browser-side.
 */
export async function hideAdminStory(
  storyId: string | number,
  version: number
): Promise<ApiResponse<AdminStoryDetailDto>> {
  return browserPost(API_ROUTES.admin.stories.hide(storyId), { version });
}

/**
 * Completes a story. Browser-side.
 */
export async function completeAdminStory(
  storyId: string | number,
  version: number
): Promise<ApiResponse<AdminStoryDetailDto>> {
  return browserPost(API_ROUTES.admin.stories.complete(storyId), { version });
}

/**
 * Schedules a story to be published at a specific time. Browser-side.
 */
export async function scheduleAdminStory(
  storyId: string | number,
  scheduledAt: string | null,
  version: number
): Promise<ApiResponse<AdminStoryDetailDto>> {
  return browserPost(API_ROUTES.admin.stories.schedule(storyId), { scheduledAt: scheduledAt || null, version });
}

/**
 * Restores a soft-deleted story. Browser-side.
 */
export async function restoreAdminStory(
  storyId: string | number,
  version: number
): Promise<ApiResponse<AdminStoryDetailDto>> {
  return browserPost(`${API_ROUTES.admin.stories.restore(storyId)}?version=${version}`);
}

/**
 * Fetches dashboard statistics. Browser-side.
 */
export async function getAdminStatsBrowser(): Promise<ApiResponse<AdminStatsDto>> {
  return browserGet(API_ROUTES.admin.stats);
}

/**
 * Uploads a story cover image. Browser-side.
 */
export async function uploadStoryCoverBrowser(
  file: File
): Promise<ApiResponse<string>> {
  const formData = new FormData();
  formData.append("file", file);
  return browserPost(API_ROUTES.admin.upload.image, formData);
}
