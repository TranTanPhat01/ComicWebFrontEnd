import { browserGet, browserPut, browserPost } from "@/lib/api/browser-api-client";
import type { ApiResponse } from "@/lib/api/api-response";
import type { PaginatedResponse } from "@/types/pagination";

export interface UserNotificationDto {
  id: number;
  storyId?: number;
  storySlug?: string;
  storyTitle?: string;
  chapterId?: number;
  chapterSlug?: string;
  message: string;
  isRead: boolean;
  createAt: string;
}

export async function getUserNotificationsBrowser(params?: {
  page?: number;
  pageSize?: number;
}): Promise<ApiResponse<PaginatedResponse<UserNotificationDto>>> {
  return browserGet("/api/v1/me/notifications", params);
}

export async function markNotificationReadBrowser(
  id: number
): Promise<ApiResponse<string>> {
  return browserPut(`/api/v1/me/notifications/${id}/read`);
}

export async function markAllNotificationsReadBrowser(): Promise<ApiResponse<string>> {
  return browserPut("/api/v1/me/notifications/read-all");
}

export async function subscribeNewsletterBrowser(
  email: string
): Promise<ApiResponse<string>> {
  return browserPost("/api/v1/newsletter/subscribe", { email });
}
