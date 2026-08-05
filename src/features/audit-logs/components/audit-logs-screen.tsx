"use client";

import { useCallback, useEffect, useState } from "react";
import { PageHeader } from "@/components/shared/page-header";
import { getAuditLogsBrowser } from "../api/audit-logs-browser.api";
import type { AuditLogListItemDto, GetAuditLogsParams } from "../types/audit-log.types";

// ── Helpers ────────────────────────────────────────────────────────────────────
function extractList(data: unknown): AuditLogListItemDto[] {
  if (!data || typeof data !== "object") return [];
  if ("data" in data && Array.isArray((data as { data: unknown }).data)) {
    return (data as { data: AuditLogListItemDto[] }).data;
  }
  if ("items" in data && Array.isArray((data as { items: unknown }).items)) {
    return (data as { items: AuditLogListItemDto[] }).items;
  }
  if (Array.isArray(data)) return data as AuditLogListItemDto[];
  return [];
}

function extractMeta(data: unknown): { totalPages: number; totalItems: number } {
  if (!data || typeof data !== "object") return { totalPages: 1, totalItems: 0 };
  if ("meta" in data) {
    const meta = (data as { meta?: { totalPages?: number; totalItems?: number } }).meta;
    return { totalPages: meta?.totalPages ?? 1, totalItems: meta?.totalItems ?? 0 };
  }
  if ("totalPages" in data) {
    const d = data as { totalPages?: number; totalCount?: number };
    return { totalPages: d.totalPages ?? 1, totalItems: d.totalCount ?? 0 };
  }
  return { totalPages: 1, totalItems: 0 };
}

function formatDateTime(dateStr: string) {
  return new Date(dateStr).toLocaleString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function getActionLabel(action: string): string {
  const norm = action.toUpperCase();
  if (norm.includes("CREATE")) return "Tạo mới";
  if (norm.includes("UPDATE")) return "Cập nhật";
  if (norm.includes("DELETE") || norm.includes("REMOVE")) return "Xóa";
  return action;
}

function getActionBadgeClass(action: string): string {
  const norm = action.toUpperCase();
  if (norm.includes("CREATE")) return "status-badge--audit-create";
  if (norm.includes("UPDATE")) return "status-badge--audit-update";
  if (norm.includes("DELETE") || norm.includes("REMOVE")) return "status-badge--audit-delete";
  return "status-badge--audit-info";
}

const PAGE_SIZE = 20;

// ── Component ──────────────────────────────────────────────────────────────────
export function AuditLogsScreen() {
  const [logs, setLogs] = useState<AuditLogListItemDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [page, setPage] = useState(1);

  // Filters
  const [filterEntity, setFilterEntity] = useState("");
  const [filterAction, setFilterAction] = useState<string>("");
  const [filterUser, setFilterUser] = useState("");
  const [filterEntityInput, setFilterEntityInput] = useState("");
  const [filterUserInput, setFilterUserInput] = useState("");

  const loadLogs = useCallback(async () => {
    setLoading(true);
    setError(null);
    const params: GetAuditLogsParams = {
      page: page,
      pageSize: PAGE_SIZE,
      entityType: filterEntity || undefined,
      action: filterAction || undefined,
      actorUserId: filterUser ? Number(filterUser) || undefined : undefined,
    };
    const response = await getAuditLogsBrowser(params);
    if (response.success && response.data) {
      setLogs(extractList(response.data));
      const meta = extractMeta(response.data);
      setTotalPages(meta.totalPages);
      setTotalItems(meta.totalItems);
    } else {
      setError(
        (response as { success: false; error: { message: string } }).error?.message ??
          "Không thể tải audit logs."
      );
      setLogs([]);
    }
    setLoading(false);
  }, [page, filterEntity, filterAction, filterUser]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void loadLogs();
  }, [loadLogs]);

  const handleApplyFilters = (e: React.FormEvent) => {
    e.preventDefault();
    setFilterEntity(filterEntityInput);
    setFilterUser(filterUserInput);
    setPage(1);
  };

  const handleClearFilters = () => {
    setFilterEntityInput("");
    setFilterUserInput("");
    setFilterEntity("");
    setFilterUser("");
    setFilterAction("");
    setPage(1);
  };

  const hasFilters = filterEntity || filterAction || filterUser;

  return (
    <div className="admin-auditlogs">
      <PageHeader
        title="Nhật ký thao tác"
        description="Lịch sử thao tác trong hệ thống"
      />

      {/* Stats */}
      <div className="admin-stories__stats">
        <div className="stats-card">
          <div className="stats-card__label">Tổng bản ghi</div>
          <div className="stats-card__value">{totalItems}</div>
        </div>
        <div className="stats-card">
          <div className="stats-card__label">Tạo mới</div>
          <div className="stats-card__value" style={{ color: "#22c55e" }}>
            {logs.filter((l) => l.action.toUpperCase().includes("CREATE")).length}
          </div>
        </div>
        <div className="stats-card">
          <div className="stats-card__label">Cập nhật</div>
          <div className="stats-card__value" style={{ color: "#f59e0b" }}>
            {logs.filter((l) => l.action.toUpperCase().includes("UPDATE")).length}
          </div>
        </div>
        <div className="stats-card">
          <div className="stats-card__label">Xóa</div>
          <div className="stats-card__value" style={{ color: "#ef4444" }}>
            {logs.filter((l) => l.action.toUpperCase().includes("DELETE") || l.action.toUpperCase().includes("REMOVE")).length}
          </div>
        </div>
      </div>

      {/* Filter bar */}
      <form className="admin-stories__toolbar" onSubmit={handleApplyFilters}>
        <div className="admin-toolbar__search">
          <input
            className="input"
            value={filterEntityInput}
            onChange={(e) => setFilterEntityInput(e.target.value)}
            placeholder="Lọc theo đối tượng (ví dụ: Story, Chapter)..."
          />
          <input
            className="input"
            value={filterUserInput}
            onChange={(e) => setFilterUserInput(e.target.value)}
            placeholder="Lọc theo ID người thực hiện (số)..."
          />
          <button className="btn btn--secondary" type="submit">Áp dụng</button>
          {hasFilters && (
            <button className="btn btn--ghost" type="button" onClick={handleClearFilters}>
              Xóa bộ lọc
            </button>
          )}
        </div>

        <div className="admin-toolbar__filters">
          <span className="admin-toolbar__label">Hành động:</span>
          <button
            type="button"
            className={`admin-filter-btn ${filterAction === "" ? "admin-filter-btn--active" : ""}`}
            onClick={() => { setFilterAction(""); setPage(1); }}
          >Tất cả</button>
          {["Create", "Update", "Delete"].map((a) => {
            const labels: Record<string, string> = { Create: "Tạo mới", Update: "Cập nhật", Delete: "Xóa" };
            return (
              <button
                key={a}
                type="button"
                className={`admin-filter-btn admin-filter-btn--audit-${a.toLowerCase()} ${filterAction === a ? "admin-filter-btn--active" : ""}`}
                onClick={() => { setFilterAction(a); setPage(1); }}
              >
                {labels[a]}
              </button>
            );
          })}
        </div>
      </form>

      {error && <p className="admin-error-msg">{error}</p>}

      {/* Table */}
      <div className="admin-table-wrapper">
        <table className="admin-table">
          <thead>
            <tr>
              <th className="admin-table__th">Đối tượng</th>
              <th className="admin-table__th admin-table__th--center">Hành động</th>
              <th className="admin-table__th">Người thực hiện</th>
              <th className="admin-table__th">Thời gian</th>
              <th className="admin-table__th">Chi tiết</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              Array.from({ length: 10 }).map((_, i) => (
                <tr key={i} className="admin-table__row">
                  <td colSpan={5}><div className="admin-table__skeleton" /></td>
                </tr>
              ))
            ) : logs.length === 0 ? (
              <tr>
                <td colSpan={5} className="admin-table__empty">
                  {hasFilters ? "Không tìm thấy log phù hợp." : "Chưa có log nào."}
                </td>
              </tr>
            ) : (
              logs.map((log) => (
                <tr key={log.id} className="admin-table__row">
                  <td className="admin-table__td">
                    <div className="admin-table__story-info">
                      <span className="admin-table__story-title">{log.entityType}</span>
                      {log.entityId && (
                        <span className="admin-table__story-slug">ID: {log.entityId}</span>
                      )}
                    </div>
                  </td>
                  <td className="admin-table__td admin-table__td--center">
                    <span className={`status-badge ${getActionBadgeClass(log.action)}`}>
                      {getActionLabel(log.action)}
                    </span>
                  </td>
                  <td className="admin-table__td admin-table__td--muted">
                    {log.actorUsername || (log.actorUserId ? `User ID: ${log.actorUserId}` : "Hệ thống")}
                  </td>
                  <td className="admin-table__td admin-table__td--muted">
                    {formatDateTime(log.occurredAt)}
                  </td>
                  <td className="admin-table__td">
                    {log.detailsJson || log.errorCode ? (
                      <span className="admin-auditlogs__changes" title={log.detailsJson || log.errorCode || ""}>
                        {log.detailsJson
                          ? log.detailsJson.length > 60
                            ? log.detailsJson.slice(0, 60) + "..."
                            : log.detailsJson
                          : `Lỗi: ${log.errorCode}`}
                      </span>
                    ) : (
                      <span style={{ color: "var(--color-text-muted)" }}>—</span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="admin-pagination">
          <button className="btn btn--secondary" disabled={page === 1} onClick={() => setPage((p) => p - 1)}>
            ← Trước
          </button>
          <span className="admin-pagination__info">Trang {page} / {totalPages}</span>
          <button className="btn btn--secondary" disabled={page === totalPages} onClick={() => setPage((p) => p + 1)}>
            Sau →
          </button>
        </div>
      )}
    </div>
  );
}
