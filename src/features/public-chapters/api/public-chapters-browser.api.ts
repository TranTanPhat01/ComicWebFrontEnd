"use client";

import { browserGet, browserPost } from "@/lib/api/browser-api-client";
import { API_ROUTES } from "@/constants/api-routes";
import type { ApiResponse } from "@/lib/api/api-response";

export interface SettingItemDto {
  key: string;
  value: string;
  description?: string;
}

/**
 * Tracks a user click on a chapter affiliate link.
 */
export async function trackAffiliateClickBrowser(
  chapterId: string | number
): Promise<ApiResponse<{ success: boolean }>> {
  return browserPost(API_ROUTES.public.stories.trackClick(chapterId), {});
}

/**
 * Fetches public system settings (scripts, meta tags).
 */
export async function getPublicSettingsBrowser(): Promise<ApiResponse<SettingItemDto[]>> {
  return browserGet(API_ROUTES.public.stories.settings);
}
