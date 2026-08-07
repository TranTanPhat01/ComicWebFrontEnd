"use client";

import { browserGet, browserPut } from "@/lib/api/browser-api-client";
import { API_ROUTES } from "@/constants/api-routes";
import type { ApiResponse } from "@/lib/api/api-response";
import type { SettingItemDto } from "../../public-chapters/api/public-chapters-browser.api";

/**
 * Fetches all admin system settings (scripts, meta tags, etc.).
 */
export async function getAdminSettingsBrowser(): Promise<ApiResponse<SettingItemDto[]>> {
  return browserGet(API_ROUTES.admin.settings);
}

/**
 * Saves all admin system settings.
 */
export async function saveAdminSettingsBrowser(
  payload: SettingItemDto[]
): Promise<ApiResponse<string>> {
  return browserPut(API_ROUTES.admin.settings, payload);
}
