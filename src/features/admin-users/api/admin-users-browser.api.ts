"use client";

import { browserGet, browserPatch } from "@/lib/api/browser-api-client";
import type { ApiResponse } from "@/lib/api/api-response";
import type { PaginatedResponse } from "@/types/pagination";

export interface UserDetailsDto {
  id: number;
  username: string;
  email: string;
  role: string;
  isActive: boolean;
  failedLoginAttempts: number;
  lockoutEndAt: string | null;
  lastLoginAt: string | null;
  createdAt: string;
  updatedAt: string | null;
}

export interface GetUsersParams {
  page?: number;
  pageSize?: number;
  search?: string;
  role?: string;
  isActive?: boolean;
}

/**
 * Fetches the list of users for administration.
 */
export async function getAdminUsersBrowser(
  params?: GetUsersParams
): Promise<ApiResponse<PaginatedResponse<UserDetailsDto>>> {
  const query = new URLSearchParams();
  if (params?.page) query.append("page", params.page.toString());
  if (params?.pageSize) query.append("pageSize", params.pageSize.toString());
  if (params?.search) query.append("search", params.search);
  if (params?.role) query.append("role", params.role);
  if (params?.isActive !== undefined) query.append("isActive", params.isActive.toString());

  const queryString = query.toString() ? `?${query.toString()}` : "";
  return browserGet(`/api/v1/admin/users${queryString}`);
}

/**
 * Fetches a single user details.
 */
export async function getAdminUserDetailBrowser(
  id: number
): Promise<ApiResponse<UserDetailsDto>> {
  return browserGet(`/api/v1/admin/users/${id}`);
}

/**
 * Updates a user active status.
 */
export async function updateAdminUserStatusBrowser(
  id: number,
  isActive: boolean
): Promise<ApiResponse<string>> {
  return browserPatch(`/api/v1/admin/users/${id}/status`, { isActive });
}

/**
 * Updates a user role.
 */
export async function updateAdminUserRoleBrowser(
  id: number,
  role: string
): Promise<ApiResponse<string>> {
  return browserPatch(`/api/v1/admin/users/${id}/role`, { role });
}
