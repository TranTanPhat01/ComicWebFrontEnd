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
  storyId: string
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
  storyId: string,
  payload: UpdateStoryRequestDto
): Promise<ApiResponse<AdminStoryDetailDto>> {
  return browserPut(API_ROUTES.admin.stories.update(storyId), payload);
}

/**
 * Deletes a story. Browser-side.
 */
export async function deleteAdminStory(
  storyId: string,
  version: number
): Promise<ApiResponse<void>> {
  return browserDelete(`${API_ROUTES.admin.stories.delete(storyId)}?version=${version}`);
}

/**
 * Publishes a story. Browser-side.
 */
export async function publishAdminStory(
  storyId: string,
  version: number
): Promise<ApiResponse<any>> {
  return browserPost(`${API_ROUTES.admin.stories.list}/${storyId}/publish`, { version });
}

/**
 * Unpublishes a story (back to Draft). Browser-side.
 */
export async function unpublishAdminStory(
  storyId: string,
  version: number
): Promise<ApiResponse<any>> {
  return browserPost(`${API_ROUTES.admin.stories.list}/${storyId}/unpublish`, { version });
}

/**
 * Hides a story. Browser-side.
 */
export async function hideAdminStory(
  storyId: string,
  version: number
): Promise<ApiResponse<any>> {
  return browserPost(`${API_ROUTES.admin.stories.list}/${storyId}/hide`, { version });
}

/**
 * Completes a story. Browser-side.
 */
export async function completeAdminStory(
  storyId: string,
  version: number
): Promise<ApiResponse<any>> {
  return browserPost(`${API_ROUTES.admin.stories.list}/${storyId}/complete`, { version });
}
