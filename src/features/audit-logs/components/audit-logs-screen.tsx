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
  const [fromUtcInput, setFromUtcInput] = useState("");
  const [toUtcInput, setToUtcInput] = useState("");
  const [fromUtc, setFromUtc] = useState("");
  const [toUtc, setToUtc] = useState("");

  // Detail Modal
  const [activeDetailLog, setActiveDetailLog] = useState<AuditLogListItemDto | null>(null);

  const loadLogs = useCallback(async () => {
    setLoading(true);
    setError(null);
    const params: GetAuditLogsParams = {
      page: page,
      pageSize: PAGE_SIZE,
      entityType: filterEntity || undefined,
      action: filterAction || undefined,
      actorUserId: filterUser ? Number(filterUser) || undefined : undefined,
      fromUtc: fromUtc ? new Date(fromUtc).toISOString() : undefined,
      toUtc: toUtc ? new Date(toUtc + "T23:59:59Z").toISOString() : undefined,
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
  }, [page, filterEntity, filterAction, filterUser, fromUtc, toUtc]);
 
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void loadLogs();
  }, [loadLogs]);

  const handleApplyFilters = (e: React.FormEvent) => {
    e.preventDefault();
    setFilterEntity(filterEntityInput);
    setFilterUser(filterUserInput);
    setFromUtc(fromUtcInput);
    setToUtc(toUtcInput);
    setPage(1);
  };
 
  const handleClearFilters = () => {
    setFilterEntityInput("");
    setFilterUserInput("");
    setFromUtcInput("");
    setToUtcInput("");
    setFilterEntity("");
    setFilterUser("");
    setFilterAction("");
    setFromUtc("");
    setToUtc("");
    setPage(1);
  };
 
  const handleExportCSV = () => {
    if (logs.length === 0) return;
    const headers = ["ID", "EntityType", "EntityID", "Action", "Actor", "Time", "Result", "IP", "UserAgent"];
    const rows = logs.map(log => [
      log.id,
      log.entityType,
      log.entityId || "",
      log.action,
      log.actorUsername || log.actorUserId || "Hệ thống",
      log.occurredAt,
      log.result,
      log.ipAddress || "",
      log.userAgent ? log.userAgent.replace(/"/g, '""') : ""
    ]);
    const csvContent = "data:text/csv;charset=utf-8,\uFEFF" 
      + [headers.join(","), ...rows.map(e => e.map(val => `"${val}"`).join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `audit-logs-page-${page}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const hasFilters = filterEntity || filterAction || filterUser || fromUtc || toUtc;

  return (
    <div className="admin-auditlogs">
      <PageHeader
        title="Nhật ký thao tác"
        description="Lịch sử thao tác trong hệ thống"
        actions={
          <button className="btn btn--secondary" type="button" onClick={handleExportCSV} disabled={logs.length === 0}>
            📥 Xuất CSV
          </button>
        }
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
      <form className="admin-stories__toolbar" onSubmit={handleApplyFilters} style={{ flexDirection: "column", gap: "1rem", alignItems: "stretch" }}>
        <div className="admin-toolbar__search" style={{ flexWrap: "wrap", gap: "0.75rem" }}>
          <input
            className="input"
            value={filterEntityInput}
            onChange={(e) => setFilterEntityInput(e.target.value)}
            placeholder="Lọc theo đối tượng (Story, Chapter)..."
            style={{ flex: "1 1 200px" }}
          />
          <input
            className="input"
            value={filterUserInput}
            onChange={(e) => setFilterUserInput(e.target.value)}
            placeholder="Lọc theo ID người dùng (số)..."
            style={{ flex: "1 1 150px" }}
          />
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flex: "1 1 280px" }}>
            <span style={{ fontSize: "0.85rem", color: "var(--color-text-muted)", whiteSpace: "nowrap" }}>Từ:</span>
            <input
              type="date"
              className="input"
              value={fromUtcInput}
              onChange={(e) => setFromUtcInput(e.target.value)}
              style={{ padding: "0.3rem 0.5rem" }}
            />
            <span style={{ fontSize: "0.85rem", color: "var(--color-text-muted)", whiteSpace: "nowrap" }}>Đến:</span>
            <input
              type="date"
              className="input"
              value={toUtcInput}
              onChange={(e) => setToUtcInput(e.target.value)}
              style={{ padding: "0.3rem 0.5rem" }}
            />
          </div>
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
                    <button
                      type="button"
                      className="btn btn--ghost"
                      style={{ fontSize: "0.8rem", padding: "0.2rem 0.5rem", minHeight: "auto" }}
                      onClick={() => setActiveDetailLog(log)}
                    >
                      🔍 Xem chi tiết
                    </button>
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
      {/* Detail JSON Modal */}
      {activeDetailLog && (
        <div className="admin-modal-overlay" onClick={() => setActiveDetailLog(null)}>
          <div className="admin-modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: "650px", width: "95%" }}>
            <div className="admin-modal__header">
              <h2 className="admin-modal__title">Chi tiết thao tác #{activeDetailLog.id}</h2>
              <button className="admin-modal__close" onClick={() => setActiveDetailLog(null)} type="button" aria-label="Đóng">✕</button>
            </div>
            <div className="admin-form" style={{ display: "flex", flexDirection: "column", gap: "0.8rem", marginTop: "1rem" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.8rem" }}>
                <p><strong>Thời gian:</strong> {formatDateTime(activeDetailLog.occurredAt)}</p>
                <p><strong>Kết quả:</strong> <span style={{ color: activeDetailLog.result === "Success" ? "#22c55e" : "#ef4444", fontWeight: "bold" }}>{activeDetailLog.result}</span></p>
                <p><strong>Đối tượng:</strong> {activeDetailLog.entityType} (ID: {activeDetailLog.entityId || "—"})</p>
                <p><strong>Hành động:</strong> {activeDetailLog.action}</p>
                <p><strong>Người dùng:</strong> {activeDetailLog.actorUsername || `ID: ${activeDetailLog.actorUserId}`}</p>
                <p><strong>Địa chỉ IP:</strong> {activeDetailLog.ipAddress || "—"}</p>
              </div>
              <p><strong>User Agent:</strong> <span style={{ fontSize: "0.8rem", wordBreak: "break-word", color: "var(--color-text-muted)" }}>{activeDetailLog.userAgent || "—"}</span></p>
              {activeDetailLog.errorCode && (
                <p><strong style={{ color: "#ef4444" }}>Mã lỗi:</strong> <code>{activeDetailLog.errorCode}</code></p>
              )}
              <div style={{ display: "flex", flexDirection: "column", gap: "0.3rem" }}>
                <strong>Dữ liệu chi tiết:</strong>
                <pre style={{ backgroundColor: "var(--color-bg-secondary)", color: "var(--color-text-primary)", padding: "1rem", borderRadius: "var(--radius-md)", overflowX: "auto", fontSize: "0.85rem", margin: 0, maxHeight: "250px", border: "1px solid var(--color-border)" }}>
                  {activeDetailLog.detailsJson 
                    ? JSON.stringify(JSON.parse(activeDetailLog.detailsJson), null, 2) 
                    : "Không có dữ liệu chi tiết."}
                </pre>
              </div>
            </div>
            <div className="admin-modal__actions" style={{ marginTop: "1.5rem" }}>
              <button className="btn btn--primary" type="button" onClick={() => setActiveDetailLog(null)}>Đóng</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
