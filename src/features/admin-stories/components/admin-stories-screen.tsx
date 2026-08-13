"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { PageHeader } from "@/components/shared/page-header";
import Link from "next/link";

import {
  createAdminStory,
  deleteAdminStory,
  getAdminStoriesBrowser,
  getAdminStoryByIdBrowser,
  updateAdminStory,
  publishAdminStory,
  unpublishAdminStory,
  hideAdminStory,
  completeAdminStory,
  restoreAdminStory,
  scheduleAdminStory,
  uploadStoryCoverBrowser,
} from "../api/admin-stories-browser.api";
import type {
  AdminStoryListItemDto,
  AdminStoryStatus,
  CreateStoryRequestDto,
  UpdateStoryRequestDto,
} from "../types/admin-story.types";

// ── Types ──────────────────────────────────────────────────────────────────────
interface StoryFormDraft {
  title: string;
  slug: string;
  description: string;
  coverImageUrl: string;
  authorName: string;
  status: AdminStoryStatus;
  genres: string;
  version: number;
  scheduledAt: string;
}

const emptyDraft: StoryFormDraft = {
  title: "",
  slug: "",
  description: "",
  coverImageUrl: "",
  authorName: "",
  status: "Draft",
  genres: "",
  version: 0,
  scheduledAt: "",
};

const STATUS_LABELS: Record<AdminStoryStatus, string> = {
  Draft: "Bản nháp",
  Published: "Đã xuất bản",
  Hidden: "Tạm ẩn",
  Completed: "Đã hoàn thành",
};

const STATUS_OPTIONS: AdminStoryStatus[] = ["Draft", "Published", "Hidden", "Completed"];

const PAGE_SIZE = 12;

// ── Helpers ────────────────────────────────────────────────────────────────────
function extractList(data: unknown): AdminStoryListItemDto[] {
  if (!data || typeof data !== "object") return [];
  if ("data" in data && Array.isArray((data as { data: unknown }).data)) {
    return (data as { data: AdminStoryListItemDto[] }).data;
  }
  if ("items" in data && Array.isArray((data as { items: unknown }).items)) {
    return (data as { items: AdminStoryListItemDto[] }).items;
  }
  if (Array.isArray(data)) return data as AdminStoryListItemDto[];
  return [];
}

function extractMeta(data: unknown): { totalPages: number; totalItems: number } {
  if (!data || typeof data !== "object") return { totalPages: 1, totalItems: 0 };
  if ("meta" in data) {
    const meta = (data as { meta: { totalPages?: number; totalItems?: number } }).meta;
    return { totalPages: meta?.totalPages ?? 1, totalItems: meta?.totalItems ?? 0 };
  }
  if ("totalPages" in data) {
    const d = data as { totalPages?: number; totalCount?: number };
    return { totalPages: d.totalPages ?? 1, totalItems: d.totalCount ?? 0 };
  }
  return { totalPages: 1, totalItems: 0 };
}

function formatNumber(n: number) {
  return new Intl.NumberFormat("vi-VN").format(n);
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

function toDatetimeLocal(isoString: string | null | undefined): string {
  if (!isoString) return "";
  const date = new Date(isoString);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

function formatDateTime(dateStr: string) {
  const date = new Date(dateStr);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${pad(date.getDate())}/${pad(date.getMonth() + 1)} ${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

function toRelativeUrl(url: string | null | undefined): string {
  if (!url) return "";
  try {
    const parsed = new URL(url);
    if (parsed.pathname.startsWith("/uploads")) {
      return parsed.pathname;
    }
  } catch {
    // If it's already a relative path, return it as is
  }
  return url;
}

// ── Component ──────────────────────────────────────────────────────────────────
export function AdminStoriesScreen() {
  const [stories, setStories] = useState<AdminStoryListItemDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  // Filters & pagination
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<AdminStoryStatus | "">("");
  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState("");
  const [showDeleted, setShowDeleted] = useState(false);

  // Modal
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [originalStatus, setOriginalStatus] = useState<AdminStoryStatus | null>(null);
  const [draft, setDraft] = useState<StoryFormDraft>(emptyDraft);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      setUploadError("Kích thước file không được vượt quá 2MB.");
      return;
    }

    setUploading(true);
    setUploadError("");
    try {
      const response = await uploadStoryCoverBrowser(file);
      if (response.success) {
        setDraft((d) => ({ ...d, coverImageUrl: toRelativeUrl(response.data.data) }));
      } else {
        setUploadError(response.error.message || "Tải ảnh lên thất bại.");
      }
    } catch {
      setUploadError("Có lỗi xảy ra khi kết nối server.");
    } finally {
      setUploading(false);
    }
  };

  // ── Data fetching ────────────────────────────────────────────────────────────
  const loadStories = useCallback(async () => {
    setLoading(true);
    setError(null);
    const response = await getAdminStoriesBrowser({
      page: page,
      pageSize: PAGE_SIZE,
      search: search || undefined,
      status: filterStatus || undefined,
      includeDeleted: showDeleted,
    });
    if (response.success && response.data) {
      setStories(extractList(response.data));
      const meta = extractMeta(response.data);
      setTotalPages(meta.totalPages);
      setTotalItems(meta.totalItems);
    } else {
      setError(response.success ? "Không có dữ liệu." : (response as { success: false; error: { message: string } }).error?.message ?? "Lỗi không xác định.");
      setStories([]);
    }
    setLoading(false);
  }, [page, search, filterStatus, showDeleted]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void loadStories();
  }, [loadStories]);

  // ── Stats ────────────────────────────────────────────────────────────────────
  const stats = useMemo(() => ({
    total: totalItems,
    ongoing: stories.filter((s) => s.status === "Published").length,
    completed: stories.filter((s) => s.status === "Completed").length,
    hiatus: stories.filter((s) => s.status === "Draft" || s.status === "Hidden").length,
  }), [stories, totalItems]);

  // ── Search ───────────────────────────────────────────────────────────────────
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearch(searchInput);
    setPage(1);
  };

  const handleFilterStatus = (status: AdminStoryStatus | "") => {
    setFilterStatus(status);
    setPage(1);
  };

  // ── Modal ────────────────────────────────────────────────────────────────────
  const openCreateModal = () => {
    setEditingId(null);
    setOriginalStatus(null);
    setDraft(emptyDraft);
    setError(null);
    setUploadError("");
    setUploading(false);
    setModalOpen(true);
  };

  const openEditModal = async (story: AdminStoryListItemDto) => {
    setEditingId(story.id);
    setOriginalStatus(story.status);
    setDraft({
      title: story.title,
      slug: story.slug,
      description: "",
      coverImageUrl: story.coverImageUrl ?? "",
      authorName: "",
      status: story.status,
      genres: "",
      version: story.version,
      scheduledAt: toDatetimeLocal(story.scheduledAt),
    });
    setError(null);
    setUploadError("");
    setUploading(false);
    setModalOpen(true);

    const response = await getAdminStoryByIdBrowser(story.id);
    if (response.success && response.data) {
      const detail = (response.data as any).data || response.data;
      setOriginalStatus(detail.status);
      setDraft({
        title: detail.title,
        slug: detail.slug,
        description: detail.description ?? "",
        coverImageUrl: detail.coverImageUrl ?? "",
        authorName: detail.authorName ?? "",
        status: detail.status,
        genres: detail.genres ? detail.genres.join(", ") : "",
        version: detail.version,
        scheduledAt: toDatetimeLocal(detail.scheduledAt),
      });
    } else {
      setError("Không thể tải thông tin chi tiết truyện.");
    }
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingId(null);
    setDraft(emptyDraft);
    setError(null);
  };

  // ── CRUD handlers ────────────────────────────────────────────────────────────
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!(draft.title || "").trim()) {
      setError("Tên truyện là bắt buộc.");
      return;
    }
    if (!(draft.description || "").trim()) {
      setError("Mô tả truyện là bắt buộc.");
      return;
    }
    setSaving(true);
    setError(null);

    const genresArray = draft.genres
      ? draft.genres.split(",").map((g) => (g || "").trim()).filter(Boolean)
      : [];

    const response = editingId === null
      ? await createAdminStory({
          title: (draft.title || "").trim(),
          slug: (draft.slug || "").trim() || undefined,
          description: (draft.description || "").trim(),
          authorName: (draft.authorName || "").trim() || undefined,
          coverImageUrl: (draft.coverImageUrl || "").trim() || undefined,
          genres: genresArray.length > 0 ? genresArray : undefined,
        } satisfies CreateStoryRequestDto)
      : await updateAdminStory(editingId, {
          id: editingId,
          title: (draft.title || "").trim(),
          slug: (draft.slug || "").trim() || undefined,
          description: (draft.description || "").trim(),
          authorName: (draft.authorName || "").trim() || undefined,
          coverImageUrl: (draft.coverImageUrl || "").trim() || undefined,
          genres: genresArray.length > 0 ? genresArray : undefined,
          version: draft.version,
        } satisfies UpdateStoryRequestDto);

    if (response.success && response.data) {
      const newStory = (response.data as any).data || response.data;
      const currentVersion = newStory.version;
      const storyIdStr = String(newStory.id);
      let latestVersion = currentVersion;

      // Handle status workflow transition if it has changed
      if (editingId !== null && originalStatus !== null && originalStatus !== draft.status) {
        let workflowRes;
        if (draft.status === "Published") {
          workflowRes = await publishAdminStory(storyIdStr, latestVersion);
        } else if (draft.status === "Draft") {
          workflowRes = await unpublishAdminStory(storyIdStr, latestVersion);
        } else if (draft.status === "Hidden") {
          workflowRes = await hideAdminStory(storyIdStr, latestVersion);
        } else if (draft.status === "Completed") {
          workflowRes = await completeAdminStory(storyIdStr, latestVersion);
        }

        if (workflowRes && !workflowRes.success) {
          setError(workflowRes.error?.message ?? "Không thể chuyển trạng thái xuất bản.");
          setSaving(false);
          await loadStories();
          return;
        } else if (workflowRes && workflowRes.data) {
          const updatedStory = (workflowRes.data as any).data || workflowRes.data;
          latestVersion = updatedStory.version;
        }
      } else if (editingId === null && draft.status !== "Draft") {
        // Handle publishing on newly created story
        let workflowRes;
        if (draft.status === "Published") {
          workflowRes = await publishAdminStory(storyIdStr, latestVersion);
        } else if (draft.status === "Hidden") {
          workflowRes = await hideAdminStory(storyIdStr, latestVersion);
        } else if (draft.status === "Completed") {
          workflowRes = await completeAdminStory(storyIdStr, latestVersion);
        }

        if (workflowRes && !workflowRes.success) {
          setError(workflowRes.error?.message ?? "Tạo truyện thành công dưới dạng Nháp, nhưng không thể chuyển trạng thái xuất bản.");
          setSaving(false);
          await loadStories();
          return;
        } else if (workflowRes && workflowRes.data) {
          const updatedStory = (workflowRes.data as any).data || workflowRes.data;
          latestVersion = updatedStory.version;
        }
      }

      // Handle scheduled publishing when status is Draft
      if (draft.status === "Draft") {
        const nextScheduled = draft.scheduledAt ? new Date(draft.scheduledAt).toISOString() : null;
        if (newStory.scheduledAt !== nextScheduled) {
          const scheduleRes = await scheduleAdminStory(storyIdStr, nextScheduled, latestVersion);
          if (!scheduleRes.success) {
            setError(scheduleRes.error?.message ?? "Không thể thiết lập lịch hẹn giờ phát hành.");
            setSaving(false);
            await loadStories();
            return;
          }
        }
      }

      closeModal();
      await loadStories();
    } else {
      setError((response as { success: false; error: { message: string } }).error?.message ?? "Không thể lưu truyện.");
    }
    setSaving(false);
  };

  const handleDelete = async (story: AdminStoryListItemDto) => {
    if (!window.confirm(`Bạn có chắc muốn xóa truyện "${story.title}"?`)) return;
    const response = await deleteAdminStory(story.id, story.version);
    if (response.success) {
      await loadStories();
    } else {
      setError((response as { success: false; error: { message: string } }).error?.message ?? "Không thể xóa truyện.");
    }
  };

  const handleRestore = async (story: AdminStoryListItemDto) => {
    if (!window.confirm(`Bạn có chắc muốn khôi phục truyện "${story.title}"?`)) return;
    const response = await restoreAdminStory(story.id, story.version);
    if (response.success) {
      await loadStories();
    } else {
      setError((response as { success: false; error: { message: string } }).error?.message ?? "Không thể khôi phục truyện.");
    }
  };

  // ── Render ───────────────────────────────────────────────────────────────────
  return (
    <>
      {/* Modal Overlay */}
      {modalOpen && (
        <div className="admin-modal-overlay" onClick={closeModal}>
          <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal__header">
              <h2 className="admin-modal__title">
                {editingId ? "Chỉnh sửa truyện" : "Thêm truyện mới"}
              </h2>
              <button className="admin-modal__close" onClick={closeModal} type="button" aria-label="Đóng">✕</button>
            </div>

            {error && <p className="admin-form__error">{error}</p>}

            <form className="admin-form" onSubmit={(e) => void handleSubmit(e)}>
              <div className="admin-form__grid">
                <label className="admin-form__field admin-form__field--full">
                  <span>Tên truyện <span className="admin-form__required">*</span></span>
                  <input
                    className="input"
                    value={draft.title}
                    onChange={(e) => setDraft((d) => ({ ...d, title: e.target.value }))}
                    placeholder="Ví dụ: Đấu Phá Thương Khung"
                  />
                </label>

                <label className="admin-form__field">
                  <span>Slug (URL)</span>
                  <input
                    className="input"
                    value={draft.slug}
                    onChange={(e) => setDraft((d) => ({ ...d, slug: e.target.value }))}
                    placeholder="dau-pha-thuong-khung"
                  />
                </label>

                <label className="admin-form__field">
                  <span>Trạng thái</span>
                  <select
                    className="input"
                    value={draft.status}
                    onChange={(e) => setDraft((d) => ({ ...d, status: e.target.value as AdminStoryStatus }))}
                  >
                    {STATUS_OPTIONS.map((s) => (
                      <option key={s} value={s}>{STATUS_LABELS[s]}</option>
                    ))}
                  </select>
                </label>
 
                {draft.status === "Draft" && (
                  <label className="admin-form__field">
                    <span>Hẹn giờ xuất bản (Hệ thống)</span>
                    <input
                      type="datetime-local"
                      className="input"
                      value={draft.scheduledAt}
                      onChange={(e) => setDraft((d) => ({ ...d, scheduledAt: e.target.value }))}
                      min={toDatetimeLocal(new Date().toISOString())}
                    />
                  </label>
                )}

                <label className="admin-form__field">
                  <span>Tác giả</span>
                  <input
                    className="input"
                    value={draft.authorName}
                    onChange={(e) => setDraft((d) => ({ ...d, authorName: e.target.value }))}
                    placeholder="Tên tác giả"
                  />
                </label>



                <div className="admin-form__field admin-form__field--full" style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                  <span>Ảnh bìa truyện <span className="admin-form__hint">(Tải tệp từ máy hoặc nhập URL trực tiếp)</span></span>
                  <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
                    <div style={{ flex: 1 }}>
                      <input
                        className="input"
                        value={draft.coverImageUrl}
                        onChange={(e) => setDraft((d) => ({ ...d, coverImageUrl: e.target.value }))}
                        placeholder="Nhập URL ảnh bìa (hoặc tải tệp bên phải)..."
                        type="url"
                        style={{ width: "100%" }}
                      />
                    </div>
                    <div>
                      <label className="btn btn--secondary" style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", cursor: "pointer", whiteSpace: "nowrap" }}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" style={{ width: "1.25rem", height: "1.25rem" }}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                        </svg>
                        {uploading ? "Đang tải..." : "Tải ảnh lên"}
                        <input
                          type="file"
                          accept="image/jpeg,image/png,image/webp,image/gif"
                          onChange={handleFileUpload}
                          disabled={uploading}
                          style={{ display: "none" }}
                        />
                      </label>
                    </div>
                  </div>
                  {uploadError && (
                    <span style={{ color: "var(--danger)", fontSize: "0.875rem", marginTop: "0.25rem" }}>
                      ⚠️ {uploadError}
                    </span>
                  )}
                  {draft.coverImageUrl && (
                    <div style={{ marginTop: "0.5rem", display: "flex", alignItems: "center", gap: "1rem" }}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={draft.coverImageUrl}
                        alt="Preview bìa truyện"
                        style={{ width: "70px", height: "100px", objectFit: "cover", borderRadius: "4px", border: "1px solid var(--border-color)" }}
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = "/images/fallback-cover.svg";
                        }}
                      />
                      <span style={{ fontSize: "0.875rem", color: "var(--text-muted)" }}>
                        Xem trước ảnh bìa truyện
                      </span>
                    </div>
                  )}
                </div>

                <label className="admin-form__field admin-form__field--full">
                  <span>Thể loại <span className="admin-form__hint">(cách nhau bởi dấu phẩy)</span></span>
                  <input
                    className="input"
                    value={draft.genres}
                    onChange={(e) => setDraft((d) => ({ ...d, genres: e.target.value }))}
                    placeholder="Huyền Huyễn, Tiên Hiệp, Tu Chân"
                  />
                </label>

                <label className="admin-form__field admin-form__field--full">
                  <span>Mô tả <span className="admin-form__required">*</span></span>
                  <textarea
                    className="input"
                    rows={4}
                    value={draft.description}
                    onChange={(e) => setDraft((d) => ({ ...d, description: e.target.value }))}
                    placeholder="Tóm tắt nội dung truyện..."
                  />
                </label>
              </div>

              <div className="admin-modal__actions">
                <button className="btn btn--primary" type="submit" disabled={saving}>
                  {saving ? "Đang lưu..." : editingId ? "Cập nhật" : "Tạo truyện"}
                </button>
                <button className="btn btn--ghost" type="button" onClick={closeModal}>Hủy</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Main screen */}
      <div className="admin-stories">
        <PageHeader
          title="Quản lý Truyện"
          description="Thêm, chỉnh sửa và xóa truyện trong hệ thống"
          actions={
            <button className="btn btn--primary" type="button" onClick={openCreateModal}>
              + Thêm truyện
            </button>
          }
        />

        {/* Stats row */}
        <div className="admin-stories__stats">
          <div className="stats-card">
            <div className="stats-card__label">Tổng truyện</div>
            <div className="stats-card__value">{formatNumber(totalItems)}</div>
          </div>
          <div className="stats-card">
            <div className="stats-card__label">Đang tiến hành</div>
            <div className="stats-card__value stats-card__value--ongoing">{stats.ongoing}</div>
          </div>
          <div className="stats-card">
            <div className="stats-card__label">Đã hoàn thành</div>
            <div className="stats-card__value stats-card__value--completed">{stats.completed}</div>
          </div>
          <div className="stats-card">
            <div className="stats-card__label">Tạm ngưng / Hủy</div>
            <div className="stats-card__value stats-card__value--hiatus">{stats.hiatus}</div>
          </div>
        </div>

        {/* Toolbar: search + filter */}
        <div className="admin-stories__toolbar">
          <form onSubmit={handleSearch} className="admin-toolbar__search">
            <input
              className="input"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Tìm theo tên truyện..."
            />
            <button className="btn btn--secondary" type="submit">Tìm</button>
            {search && (
              <button
                className="btn btn--ghost"
                type="button"
                onClick={() => { setSearchInput(""); setSearch(""); setPage(1); }}
              >
                Xóa
              </button>
            )}
          </form>

          <div className="admin-toolbar__filters">
            <span className="admin-toolbar__label">Trạng thái:</span>
            <button
              className={`admin-filter-btn ${filterStatus === "" ? "admin-filter-btn--active" : ""}`}
              type="button"
              onClick={() => handleFilterStatus("")}
            >Tất cả</button>
            {STATUS_OPTIONS.map((s) => (
              <button
                key={s}
                className={`admin-filter-btn admin-filter-btn--${s.toLowerCase()} ${filterStatus === s ? "admin-filter-btn--active" : ""}`}
                type="button"
                onClick={() => handleFilterStatus(s)}
              >
                {STATUS_LABELS[s]}
              </button>
            ))}

            {/* Show Deleted Toggle */}
            <label className="admin-toolbar__deleted-toggle" style={{ display: "flex", alignItems: "center", gap: "0.4rem", marginLeft: "1.5rem", fontSize: "0.85rem", cursor: "pointer", userSelect: "none" }}>
              <input
                type="checkbox"
                checked={showDeleted}
                onChange={(e) => { setShowDeleted(e.target.checked); setPage(1); }}
                style={{ cursor: "pointer" }}
              />
              <span>Hiển thị truyện đã xóa</span>
            </label>
          </div>
        </div>

        {/* Error */}
        {error && !modalOpen && (
          <p className="admin-error-msg">{error}</p>
        )}

        {/* Table */}
        <div className="admin-table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th className="admin-table__th">Truyện</th>
                <th className="admin-table__th admin-table__th--center">Trạng thái</th>
                <th className="admin-table__th admin-table__th--center">Chương</th>
                <th className="admin-table__th admin-table__th--center">Lượt xem</th>
                <th className="admin-table__th">Cập nhật</th>
                <th className="admin-table__th admin-table__th--right">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 6 }).map((_, i) => (
                  <tr key={i} className="admin-table__row">
                    <td colSpan={6}>
                      <div className="admin-table__skeleton" />
                    </td>
                  </tr>
                ))
              ) : stories.length === 0 ? (
                <tr>
                  <td colSpan={6} className="admin-table__empty">
                    {search || filterStatus ? "Không tìm thấy truyện phù hợp." : "Chưa có truyện nào."}
                  </td>
                </tr>
              ) : (
                stories.map((story) => (
                  <tr key={story.id} className="admin-table__row">
                    {/* Cover + Title */}
                    <td className="admin-table__td">
                      <div className="admin-table__story-cell">
                        {story.coverImageUrl ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={story.coverImageUrl}
                            alt={story.title}
                            className="admin-table__cover"
                            onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                          />
                        ) : (
                          <div className="admin-table__cover-placeholder">📚</div>
                        )}
                        <div className="admin-table__story-info">
                          <span className="admin-table__story-title">{story.title}</span>
                          <span className="admin-table__story-slug">{story.slug}</span>
                        </div>
                      </div>
                    </td>

                    {/* Status badge */}
                    <td className="admin-table__td admin-table__td--center">
                      {story.deletedAt ? (
                        <span className="status-badge status-badge--danger" style={{ background: "rgba(239, 68, 68, 0.1)", color: "#EF4444" }}>
                          Đã xóa
                        </span>
                      ) : (
                        <span className={`status-badge status-badge--${story.status.toLowerCase()}`}>
                          {STATUS_LABELS[story.status]}
                        </span>
                      )}
                      {story.scheduledAt && story.status === "Draft" && (
                        <div style={{ fontSize: "0.75rem", color: "var(--color-accent-orange)", marginTop: "0.3rem", fontWeight: "500" }}>
                          ⏰ {formatDateTime(story.scheduledAt)}
                        </div>
                      )}
                    </td>

                    {/* Chapters */}
                    <td className="admin-table__td admin-table__td--center admin-table__td--mono">
                      {story.totalChapters ?? "—"}
                    </td>

                    {/* Views */}
                    <td className="admin-table__td admin-table__td--center admin-table__td--mono">
                      {story.viewCount !== undefined ? formatNumber(story.viewCount) : "—"}
                    </td>

                    {/* Date */}
                    <td className="admin-table__td admin-table__td--muted">
                      {formatDate(story.updateAt || story.createAt)}
                    </td>

                    {/* Actions */}
                    <td className="admin-table__td admin-table__td--right">
                      <div className="admin-table__actions">
                        {story.deletedAt ? (
                          <button
                            className="btn btn--primary admin-table__action-btn"
                            type="button"
                            onClick={() => void handleRestore(story)}
                          >
                            Khôi phục
                          </button>
                        ) : (
                          <>
                            <Link
                              href={`/admin/stories/${story.id}/chapters`}
                              className="btn btn--ghost admin-table__action-btn"
                              title="Quản lý chương"
                            >
                              Chương
                            </Link>
                            <button
                              className="btn btn--secondary admin-table__action-btn"
                              type="button"
                              onClick={() => openEditModal(story)}
                            >
                              Sửa
                            </button>
                            <button
                              className="btn btn--ghost admin-table__action-btn admin-table__action-btn--danger"
                              type="button"
                              onClick={() => void handleDelete(story)}
                            >
                              Xóa
                            </button>
                          </>
                        )}
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
            <button
              className="btn btn--secondary"
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
            >
              ← Trước
            </button>
            <span className="admin-pagination__info">
              Trang {page} / {totalPages}
            </span>
            <button
              className="btn btn--secondary"
              disabled={page === totalPages}
              onClick={() => setPage((p) => p + 1)}
            >
              Sau →
            </button>
          </div>
        )}
      </div>
    </>
  );
}
