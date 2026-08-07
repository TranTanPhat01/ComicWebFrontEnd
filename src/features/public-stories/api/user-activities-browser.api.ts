"use client";

import { browserGet, browserPost, browserPut, browserDelete } from "@/lib/api/browser-api-client";
import type { ApiResponse } from "@/lib/api/api-response";
import type { PaginatedResponse } from "@/types/pagination";

export interface ServerFollowedStoryDto {
  storyId: number;
  title: string;
  slug: string;
  coverImageUrl: string;
  authorName: string | null;
  genreNames: string | null;
  followedAt: string;
}

export interface ServerReadingHistoryDto {
  storyId: number;
  storyTitle: string;
  storySlug: string;
  coverImageUrl: string;
  chapterId: number;
  chapterNumber: number;
  chapterTitle: string | null;
  chapterSlug: string;
  lastReadAt: string;
}

export interface HistoryMergePayload {
  storyId: number;
  chapterId: number;
  lastReadAt: string; // ISO String
}

export interface MergePayload {
  follows: number[];
  histories: HistoryMergePayload[];
}

/**
 * Fetches the user's bookmarks (followed stories) from server.
 */
export async function getFollowedStoriesBrowser(
  page: number = 1,
  pageSize: number = 20
): Promise<ApiResponse<PaginatedResponse<ServerFollowedStoryDto>>> {
  return browserGet(`/api/v1/me/follows?page=${page}&pageSize=${pageSize}`);
}

/**
 * Follows a story on the server.
 */
export async function followStoryBrowser(storyId: number): Promise<ApiResponse<string>> {
  return browserPost(`/api/v1/me/follows/${storyId}`);
}

/**
 * Unfollows a story on the server.
 */
export async function unfollowStoryBrowser(storyId: number): Promise<ApiResponse<string>> {
  return browserDelete(`/api/v1/me/follows/${storyId}`);
}

/**
 * Fetches the user's reading history from server.
 */
export async function getReadingHistoryBrowser(
  page: number = 1,
  pageSize: number = 20
): Promise<ApiResponse<PaginatedResponse<ServerReadingHistoryDto>>> {
  return browserGet(`/api/v1/me/history?page=${page}&pageSize=${pageSize}`);
}

/**
 * Saves or updates a reading history entry on the server.
 */
export async function upsertReadingHistoryBrowser(
  storyId: number,
  chapterId: number
): Promise<ApiResponse<string>> {
  return browserPut(`/api/v1/me/history`, { storyId, chapterId });
}

/**
 * Deletes a story entry from reading history on the server.
 */
export async function deleteReadingHistoryBrowser(storyId: number): Promise<ApiResponse<string>> {
  return browserDelete(`/api/v1/me/history/${storyId}`);
}

/**
 * Merges local bookmarks and reading history to the server.
 */
export async function mergeUserActivitiesBrowser(payload: MergePayload): Promise<ApiResponse<string>> {
  return browserPost(`/api/v1/me/merge`, payload);
}
