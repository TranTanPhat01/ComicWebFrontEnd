/**
 * Audit log DTOs.
 * Aligned with BE AuditLogDto and search query parameters.
 */

export interface AuditLogListItemDto {
  id: number;
  actorUserId: number | null;
  actorUsername: string | null;
  actorType: string;
  action: string;
  entityType: string;
  entityId: string | null;
  result: string;
  occurredAt: string;
  requestId: string | null;
  ipAddress: string | null;
  userAgent: string | null;
  detailsJson: string | null;
  errorCode: string | null;
}

export interface GetAuditLogsParams {
  page?: number;
  pageSize?: number;
  actorUserId?: number;
  action?: string;
  entityType?: string;
  entityId?: string;
  result?: string;
  fromUtc?: string;
  toUtc?: string;
  /** Index signature for QueryParams compatibility */
  [key: string]: string | number | boolean | undefined | null;
}
