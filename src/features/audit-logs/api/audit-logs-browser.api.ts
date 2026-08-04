"use client";

import { browserGet } from "@/lib/api/browser-api-client";
import { API_ROUTES } from "@/constants/api-routes";
import type { ApiResponse } from "@/lib/api/api-response";
import type { PaginatedResponse } from "@/types/pagination";
import type {
  AuditLogListItemDto,
  GetAuditLogsParams,
} from "../types/audit-log.types";

/**
 * Fetches the paginated audit log list (browser/client component only).
 */
export async function getAuditLogsBrowser(
  params?: GetAuditLogsParams
): Promise<ApiResponse<PaginatedResponse<AuditLogListItemDto>>> {
  return browserGet(API_ROUTES.admin.auditLogs.list, params);
}
