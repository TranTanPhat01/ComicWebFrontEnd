import { serverGet } from "@/lib/api/server-api-client";
import { API_ROUTES } from "@/constants/api-routes";
import type { ApiResponse } from "@/lib/api/api-response";
import type { PaginatedResponse } from "@/types/pagination";
import type {
  AuditLogListItemDto,
  GetAuditLogsParams,
} from "../types/audit-log.types";

/**
 * Fetches the paginated audit log list (Server Component).
 * Requires admin authentication.
 */
export async function getAuditLogs(
  params?: GetAuditLogsParams,
  accessToken?: string
): Promise<ApiResponse<PaginatedResponse<AuditLogListItemDto>>> {
  return serverGet(API_ROUTES.admin.auditLogs.list, params, { accessToken });
}
