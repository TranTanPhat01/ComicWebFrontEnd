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
  AdminChapterListItemDto,
  AdminChapterDetailDto,
  CreateChapterRequestDto,
  UpdateChapterRequestDto,
  GetAdminChaptersParams,
} from "../types/admin-chapter.types";

/**
 * Browser-side: fetches paginated chapters for a story.
 */
export async function getAdminChaptersBrowser(
  storyId: string,
  params?: GetAdminChaptersParams
): Promise<ApiResponse<PaginatedResponse<AdminChapterListItemDto>>> {
  return browserGet(API_ROUTES.admin.chapters.list(storyId), params);
}

/**
 * Creates a new chapter. Browser-side.
 */
export async function createAdminChapter(
  storyId: string,
  payload: CreateChapterRequestDto
): Promise<ApiResponse<AdminChapterDetailDto>> {
  return browserPost(API_ROUTES.admin.chapters.list(storyId), payload);
}

/**
 * Fetches a single chapter by ID for edit form. Browser-side.
 */
export async function getAdminChapterByIdBrowser(
  storyId: string,
  chapterId: string
): Promise<ApiResponse<AdminChapterDetailDto>> {
  return browserGet(API_ROUTES.admin.chapters.detail(storyId, chapterId));
}

/**
 * Updates an existing chapter. Browser-side.
 */
export async function updateAdminChapter(
  storyId: string,
  chapterId: string,
  payload: UpdateChapterRequestDto
): Promise<ApiResponse<AdminChapterDetailDto>> {
  return browserPut(API_ROUTES.admin.chapters.detail(storyId, chapterId), payload);
}

/**
 * Deletes a chapter. Browser-side.
 */
export async function deleteAdminChapter(
  storyId: string,
  chapterId: string,
  version: number
): Promise<ApiResponse<void>> {
  return browserDelete(`${API_ROUTES.admin.chapters.detail(storyId, chapterId)}?version=${version}`);
}

/**
 * Publishes a chapter. Browser-side.
 */
export async function publishAdminChapter(
  chapterId: string,
  version: number
): Promise<ApiResponse<any>> {
  return browserPost(`/api/v1/admin/chapters/${chapterId}/publish`, { version });
}

/**
 * Unpublishes a chapter. Browser-side.
 */
export async function unpublishAdminChapter(
  chapterId: string,
  version: number
): Promise<ApiResponse<any>> {
  return browserPost(`/api/v1/admin/chapters/${chapterId}/unpublish`, { version });
}

/**
 * Hides a chapter. Browser-side.
 */
export async function hideAdminChapter(
  chapterId: string,
  version: number
): Promise<ApiResponse<any>> {
  return browserPost(`/api/v1/admin/chapters/${chapterId}/hide`, { version });
}
