/**
 * Audit log DTOs.
 */

export interface AuditLogListItemDto {
  id: string;
  entityName: string;
  action: AuditAction;
  performedBy: string;
  performedAt: string;
  entityId: string | null;
  changes: string | null;
}

export type AuditAction = "Create" | "Update" | "Delete";

export interface GetAuditLogsParams {
  pageNumber?: number;
  pageSize?: number;
  entityName?: string;
  action?: AuditAction;
  performedBy?: string;
  from?: string;
  to?: string;
  /** Index signature for QueryParams compatibility */
  [key: string]: string | number | boolean | undefined | null;
}
