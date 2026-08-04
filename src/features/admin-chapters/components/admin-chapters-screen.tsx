"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { ROUTES } from "@/constants/routes";
import { PageHeader } from "@/components/shared/page-header";
import {
  createAdminChapter,
  deleteAdminChapter,
  getAdminChaptersBrowser,
  getAdminChapterByIdBrowser,
  updateAdminChapter,
  publishAdminChapter,
  unpublishAdminChapter,
  hideAdminChapter,
} from "../api/admin-chapters-browser.api";
import type {
  AdminChapterListItemDto,
  ChapterStatus,
  CreateChapterRequestDto,
  UpdateChapterRequestDto,
} from "../types/admin-chapter.types";

// ── Types ──────────────────────────────────────────────────────────────────────
interface ChapterFormDraft {
  title: string;
  chapterNumber: string;
  content: string;
  status: ChapterStatus;
  version: number;
  isLocked: boolean;
  affiliateLink: string;
}

const emptyDraft: ChapterFormDraft = {
  title: "",
  chapterNumber: "",
  content: "",
  status: "Draft",
  version: 0,
  isLocked: false,
  affiliateLink: "",
};

const STATUS_LABELS: Record<ChapterStatus, string> = {
  Draft: "Bản nháp",
  Published: "Đã đăng",
  Archived: "Lưu trữ",
};

const STATUS_OPTIONS: ChapterStatus[] = ["Draft", "Published", "Archived"];

const PAGE_SIZE = 20;

// ── Helpers ────────────────────────────────────────────────────────────────────
function extractList(data: unknown): AdminChapterListItemDto[] {
  if (!data || typeof data !== "object") return [];
  if ("data" in data && Array.isArray((data as { data: unknown }).data)) {
    return (data as { data: AdminChapterListItemDto[] }).data;
  }
  if ("items" in data && Array.isArray((data as { items: unknown }).items)) {
    return (data as { items: AdminChapterListItemDto[] }).items;
  }
  if (Array.isArray(data)) return data as AdminChapterListItemDto[];
  return [];
}

function extractTotalPages(data: unknown): number {
  if (!data || typeof data !== "object") return 1;
  if ("meta" in data) return (data as { meta?: { totalPages?: number } }).meta?.totalPages ?? 1;
  if ("totalPages" in data) return (data as { totalPages?: number }).totalPages ?? 1;
  return 1;
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

// ── Props ──────────────────────────────────────────────────────────────────────
interface AdminChaptersScreenProps {
  storyId: string;
  storyTitle: string;
}

// ── Component ──────────────────────────────────────────────────────────────────
export function AdminChaptersScreen({ storyId, storyTitle }: AdminChaptersScreenProps) {
  const [chapters, setChapters] = useState<AdminChapterListItemDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);

  // Modal
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [originalStatus, setOriginalStatus] = useState<ChapterStatus | null>(null);
  const [draft, setDraft] = useState<ChapterFormDraft>(emptyDraft);

  // ── Data fetching ────────────────────────────────────────────────────────────
  const loadChapters = useCallback(async () => {
    setLoading(true);
    setError(null);
    const response = await getAdminChaptersBrowser(storyId, {
      pageNumber: page,
      pageSize: PAGE_SIZE,
      sortBy: "chapterNumber",
      sortDirection: "desc",
    });
    if (response.success && response.data) {
      setChapters(extractList(response.data));
      setTotalPages(extractTotalPages(response.data));
    } else {
      setError(
        (response as { success: false; error: { message: string } }).error?.message ??
          "Không thể tải danh sách chương."
      );
    }
    setLoading(false);
  }, [storyId, page]);

  useEffect(() => {
    void loadChapters();
  }, [loadChapters]);

  // ── Modal helpers ────────────────────────────────────────────────────────────
  const openCreateModal = () => {
    const nextNumber = chapters.length > 0 ? Math.max(...chapters.map((c) => c.chapterNumber)) + 1 : 1;
    setEditingId(null);
    setOriginalStatus(null);
    setDraft({ ...emptyDraft, chapterNumber: String(nextNumber) });
    setError(null);
    setModalOpen(true);
  };

  const openEditModal = async (chapter: AdminChapterListItemDto) => {
    setEditingId(chapter.id);
    setOriginalStatus(chapter.status);
    setDraft({
      title: chapter.title,
      chapterNumber: String(chapter.chapterNumber),
      content: "",
      status: chapter.status,
      version: chapter.version,
      isLocked: chapter.isLocked,
      affiliateLink: chapter.affiliateLink ?? "",
    });
    setError(null);
    setModalOpen(true);

    const response = await getAdminChapterByIdBrowser(storyId, chapter.id);
    if (response.success && response.data) {
      const detail = response.data;
      setOriginalStatus(detail.status);
      setDraft({
        title: detail.title,
        chapterNumber: String(detail.chapterNumber),
        content: detail.content ?? "",
        status: detail.status,
        version: detail.version,
        isLocked: detail.isLocked,
        affiliateLink: detail.affiliateLink ?? "",
      });
    } else {
      setError("Không thể tải chi tiết chương.");
    }
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingId(null);
    setDraft(emptyDraft);
    setError(null);
  };

  // ── CRUD ─────────────────────────────────────────────────────────────────────
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const chapterNum = Number(draft.chapterNumber);
    if (!draft.title.trim()) { setError("Tiêu đề chương là bắt buộc."); return; }
    if (isNaN(chapterNum) || chapterNum < 1) { setError("Số chương phải là số nguyên dương."); return; }
    if (!draft.content.trim()) { setError("Nội dung chương là bắt buộc."); return; }

    setSaving(true);
    setError(null);

    const response = editingId === null
      ? await createAdminChapter(storyId, {
          title: draft.title.trim(),
          chapterNumber: chapterNum,
          content: draft.content.trim(),
          isLocked: draft.isLocked,
          affiliateLink: draft.isLocked ? draft.affiliateLink.trim() || null : null,
        } satisfies CreateChapterRequestDto)
      : await updateAdminChapter(storyId, editingId, {
          title: draft.title.trim(),
          chapterNumber: chapterNum,
          content: draft.content.trim(),
          version: draft.version,
          isLocked: draft.isLocked,
          affiliateLink: draft.isLocked ? draft.affiliateLink.trim() || null : null,
        } satisfies UpdateChapterRequestDto);

    if (response.success && response.data) {
      const newChapter = response.data;
      let currentVersion = newChapter.version;
      const chapterIdStr = String(newChapter.id);

      // Handle status workflow transition if it has changed
      if (editingId !== null && originalStatus !== null && originalStatus !== draft.status) {
        let workflowRes;
        if (draft.status === "Published") {
          workflowRes = await publishAdminChapter(chapterIdStr, currentVersion);
        } else if (draft.status === "Draft") {
          workflowRes = await unpublishAdminChapter(chapterIdStr, currentVersion);
        } else if (draft.status === "Archived") {
          workflowRes = await hideAdminChapter(chapterIdStr, currentVersion);
        }

        if (workflowRes && !workflowRes.success) {
          setError(workflowRes.error?.message ?? "Không thể chuyển trạng thái xuất bản chương.");
          setSaving(false);
          await loadChapters();
          return;
        }
      } else if (editingId === null && draft.status !== "Draft") {
        // Publish/Hide newly created chapter immediately
        let workflowRes;
        if (draft.status === "Published") {
          workflowRes = await publishAdminChapter(chapterIdStr, currentVersion);
        } else if (draft.status === "Archived") {
          workflowRes = await hideAdminChapter(chapterIdStr, currentVersion);
        }

        if (workflowRes && !workflowRes.success) {
          setError(workflowRes.error?.message ?? "Tạo chương thành công dưới dạng Nháp, nhưng không thể chuyển trạng thái xuất bản.");
          setSaving(false);
          await loadChapters();
          return;
        }
      }

      closeModal();
      await loadChapters();
    } else {
      setError(
        (response as { success: false; error: { message: string } }).error?.message ??
          "Không thể lưu chương."
      );
    }
    setSaving(false);
  };

  const handleDelete = async (chapter: AdminChapterListItemDto) => {
    if (!window.confirm(`Xóa chương ${chapter.chapterNumber}: "${chapter.title}"?`)) return;
    const response = await deleteAdminChapter(storyId, chapter.id, chapter.version);
    if (response.success) {
      await loadChapters();
    } else {
      setError(
        (response as { success: false; error: { message: string } }).error?.message ??
          "Không thể xóa chương."
      );
    }
  };

  // ── Render ───────────────────────────────────────────────────────────────────
  return (
    <>
      {/* Modal */}
      {modalOpen && (
        <div className="admin-modal-overlay" onClick={closeModal}>
          <div className="admin-modal admin-modal--large" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal__header">
              <h2 className="admin-modal__title">
                {editingId ? "Chỉnh sửa chương" : "Thêm chương mới"}
              </h2>
              <button className="admin-modal__close" onClick={closeModal} type="button">✕</button>
            </div>

            {error && <p className="admin-form__error">{error}</p>}

            <form className="admin-form" onSubmit={(e) => void handleSubmit(e)}>
              <div className="admin-form__grid">
                <label className="admin-form__field">
                  <span>Số chương <span className="admin-form__required">*</span></span>
                  <input
                    className="input"
                    type="number"
                    min={1}
                    value={draft.chapterNumber}
                    onChange={(e) => setDraft((d) => ({ ...d, chapterNumber: e.target.value }))}
                    placeholder="1"
                  />
                </label>

                <label className="admin-form__field">
                  <span>Trạng thái</span>
                  <select
                    className="input"
                    value={draft.status}
                    onChange={(e) => setDraft((d) => ({ ...d, status: e.target.value as ChapterStatus }))}
                  >
                    {STATUS_OPTIONS.map((s) => (
                      <option key={s} value={s}>{STATUS_LABELS[s]}</option>
                    ))}
                  </select>
                </label>

                <label className="admin-form__field admin-form__field--full">
                  <span>Tiêu đề chương <span className="admin-form__required">*</span></span>
                  <input
                    className="input"
                    value={draft.title}
                    onChange={(e) => setDraft((d) => ({ ...d, title: e.target.value }))}
                    placeholder="Ví dụ: Cuộc chiến bắt đầu"
                  />
                </label>

                <label className="admin-form__field admin-form__field--full">
                  <span>Nội dung chương <span className="admin-form__required">*</span></span>
                  <textarea
                    className="input admin-form__content-area"
                    rows={12}
                    value={draft.content}
                    onChange={(e) => setDraft((d) => ({ ...d, content: e.target.value }))}
                    placeholder="Nhập nội dung chương truyện tại đây..."
                  />
                </label>

                <div className="admin-form__field admin-form__field--full" style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: "0.5rem", marginTop: "0.5rem" }}>
                  <input
                    type="checkbox"
                    id="isLockedCheckbox"
                    checked={draft.isLocked}
                    onChange={(e) => setDraft((d) => ({ ...d, isLocked: e.target.checked }))}
                    style={{ width: "18px", height: "18px", cursor: "pointer" }}
                  />
                  <label htmlFor="isLockedCheckbox" style={{ fontWeight: 600, cursor: "pointer", textTransform: "none", color: "var(--color-text-primary)", margin: 0 }}>
                    Khóa chương truyện (Yêu cầu người đọc click link Shopee để mở khóa)
                  </label>
                </div>

                {draft.isLocked && (
                  <label className="admin-form__field admin-form__field--full">
                    <span>Link sản phẩm Shopee (Affiliate Link) <span className="admin-form__required">*</span></span>
                    <input
                      className="input"
                      type="url"
                      value={draft.affiliateLink}
                      onChange={(e) => setDraft((d) => ({ ...d, affiliateLink: e.target.value }))}
                      placeholder="https://shope.ee/..."
                      required
                    />
                  </label>
                )}
              </div>

              <div className="admin-modal__actions">
                <button className="btn btn--primary" type="submit" disabled={saving}>
                  {saving ? "Đang lưu..." : editingId ? "Cập nhật" : "Tạo chương"}
                </button>
                <button className="btn btn--ghost" type="button" onClick={closeModal}>Hủy</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Main screen */}
      <div className="admin-chapters">
        <PageHeader
          title={`Chương: ${storyTitle}`}
          description={`Quản lý danh sách chương · Tổng ${chapters.length} chương`}
          actions={
            <div style={{ display: "flex", gap: "0.75rem" }}>
              <Link href={ROUTES.adminStories} className="btn btn--ghost">
                ← Về danh sách truyện
              </Link>
              <button className="btn btn--primary" type="button" onClick={openCreateModal}>
                + Thêm chương
              </button>
            </div>
          }
        />

        {/* Stats */}
        <div className="admin-stories__stats">
          {STATUS_OPTIONS.map((s) => (
            <div key={s} className="stats-card">
              <div className="stats-card__label">{STATUS_LABELS[s]}</div>
              <div className="stats-card__value">
                {chapters.filter((c) => c.status === s).length}
              </div>
            </div>
          ))}
          <div className="stats-card">
            <div className="stats-card__label">Tổng chương</div>
            <div className="stats-card__value">{chapters.length}</div>
          </div>
        </div>

        {error && !modalOpen && <p className="admin-error-msg">{error}</p>}

        {/* Table */}
        <div className="admin-table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th className="admin-table__th admin-table__th--center">#</th>
                <th className="admin-table__th">Tiêu đề chương</th>
                <th className="admin-table__th admin-table__th--center">Trạng thái</th>
                <th className="admin-table__th">Ngày tạo</th>
                <th className="admin-table__th admin-table__th--right">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 8 }).map((_, i) => (
                  <tr key={i} className="admin-table__row">
                    <td colSpan={5}><div className="admin-table__skeleton" /></td>
                  </tr>
                ))
              ) : chapters.length === 0 ? (
                <tr>
                  <td colSpan={5} className="admin-table__empty">
                    Chưa có chương nào. Hãy thêm chương đầu tiên!
                  </td>
                </tr>
              ) : (
                chapters.map((chapter) => (
                  <tr key={chapter.id} className="admin-table__row">
                    <td className="admin-table__td admin-table__td--center admin-table__td--mono">
                      {chapter.chapterNumber}
                    </td>
                     <td className="admin-table__td">
                      <span className="admin-table__story-title">
                        {chapter.title}
                        {chapter.isLocked && <span style={{ marginLeft: "0.5rem", fontSize: "0.75rem", padding: "0.15rem 0.4rem", backgroundColor: "rgba(239, 68, 68, 0.1)", color: "#ef4444", borderRadius: "var(--radius-sm)", fontWeight: "bold" }}>🔒 Khóa Shopee</span>}
                      </span>
                      <span className="admin-table__story-slug">{chapter.slug}</span>
                    </td>
                    <td className="admin-table__td admin-table__td--center">
                      <span className={`status-badge status-badge--chapter-${chapter.status.toLowerCase()}`}>
                        {STATUS_LABELS[chapter.status]}
                      </span>
                    </td>
                    <td className="admin-table__td admin-table__td--muted">
                      {formatDate(chapter.createdAt)}
                    </td>
                    <td className="admin-table__td admin-table__td--right">
                      <div className="admin-table__actions">
                        <button
                          className="btn btn--secondary admin-table__action-btn"
                          type="button"
                          onClick={() => openEditModal(chapter)}
                        >
                          Sửa
                        </button>
                        <button
                          className="btn btn--ghost admin-table__action-btn admin-table__action-btn--danger"
                          type="button"
                          onClick={() => void handleDelete(chapter)}
                        >
                          Xóa
                        </button>
                      </div>
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
    </>
  );
}
