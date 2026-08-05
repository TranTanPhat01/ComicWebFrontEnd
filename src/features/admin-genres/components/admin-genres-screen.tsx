"use client";

import { useEffect, useMemo, useState } from "react";
import { PageHeader } from "@/components/shared/page-header";
import {
  createAdminGenre,
  deleteAdminGenre,
  getAdminGenres,
  updateAdminGenre,
} from "../api/admin-genres.api";
import type { AdminGenreDto, CreateGenreRequestDto, UpdateGenreRequestDto } from "../types/admin-genre.types";

const emptyDraft = {
  name: "",
  slug: "",
  description: "",
  isActive: true,
};

export function AdminGenresScreen() {
  const [genres, setGenres] = useState<AdminGenreDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [draft, setDraft] = useState<CreateGenreRequestDto & { id?: number }>(emptyDraft);
  const [editingId, setEditingId] = useState<number | null>(null);

  const loadGenres = async () => {
    setLoading(true);
    setError(null);
    const response = await getAdminGenres();
    if (response.success && response.data) {
      const raw = response.data as unknown;
      if (raw && typeof raw === "object" && "data" in raw && Array.isArray((raw as { data: unknown }).data)) {
        setGenres((raw as { data: AdminGenreDto[] }).data);
      } else if (Array.isArray(raw)) {
        setGenres(raw as AdminGenreDto[]);
      } else {
        setGenres([]);
      }
    } else {
      setError(response.success ? "Không có dữ liệu." : (response as { success: false; error: { message: string } }).error?.message ?? "Không thể tải danh sách thể loại.");
      setGenres([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void loadGenres();
  }, []);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!draft.name.trim()) {
      setError("Tên thể loại là bắt buộc.");
      return;
    }

    setSaving(true);
    setError(null);

    const payload: CreateGenreRequestDto | UpdateGenreRequestDto = {
      name: draft.name.trim(),
      slug: draft.slug?.trim() || undefined,
      description: draft.description?.trim() || undefined,
      isActive: draft.isActive,
    };

    const response = editingId === null
      ? await createAdminGenre(payload as CreateGenreRequestDto)
      : await updateAdminGenre(editingId, payload as UpdateGenreRequestDto);

    if (response.success) {
      setDraft(emptyDraft);
      setEditingId(null);
      await loadGenres();
    } else {
      setError(response.error.message || "Không thể lưu thể loại.");
    }

    setSaving(false);
  };

  const handleEdit = (genre: AdminGenreDto) => {
    setEditingId(genre.id);
    setDraft({
      id: genre.id,
      name: genre.name,
      slug: genre.slug,
      description: genre.description ?? "",
      isActive: genre.isActive ?? true,
    });
  };

  const handleDelete = async (genreId: number) => {
    if (!window.confirm("Bạn có chắc muốn xóa thể loại này?")) {
      return;
    }

    const response = await deleteAdminGenre(genreId);
    if (response.success) {
      await loadGenres();
      if (editingId === genreId) {
        setDraft(emptyDraft);
        setEditingId(null);
      }
    } else {
      setError(response.error.message || "Không thể xóa thể loại.");
    }
  };

  const stats = useMemo(() => ({
    total: genres.length,
    active: genres.filter((genre) => genre.isActive !== false).length,
    stories: genres.reduce((sum, genre) => sum + (genre.storyCount ?? 0), 0),
  }), [genres]);

  return (
    <div className="admin-genres">
      <PageHeader
        title="Quản lý thể loại"
        description="Tạo, chỉnh sửa và tổ chức thể loại cho truyện"
        actions={
          <button className="btn btn--primary" type="button" onClick={() => {
            setDraft(emptyDraft);
            setEditingId(null);
          }}>
            + Thêm thể loại
          </button>
        }
      />

      <div className="admin-genres__overview" style={{ display: "grid", gap: "1rem", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", marginTop: "1.25rem" }}>
        <div className="stats-card">
          <div className="stats-card__label">Tổng thể loại</div>
          <div className="stats-card__value">{stats.total}</div>
        </div>
        <div className="stats-card">
          <div className="stats-card__label">Đang bật</div>
          <div className="stats-card__value">{stats.active}</div>
        </div>
        <div className="stats-card">
          <div className="stats-card__label">Số truyện gắn</div>
          <div className="stats-card__value">{stats.stories}</div>
        </div>
      </div>

      <div className="admin-genres__content" style={{ display: "grid", gap: "1.25rem", gridTemplateColumns: "minmax(0, 1.1fr) minmax(280px, 0.9fr)", marginTop: "1.5rem" }}>
        <section className="panel-card">
          <div className="panel-card__header">
            <h2 className="panel-card__title">Danh sách thể loại</h2>
            <span className="panel-card__muted">{loading ? "Đang tải..." : `${genres.length} mục`}</span>
          </div>

          {loading ? (
            <p style={{ color: "var(--color-text-muted)" }}>Đang tải dữ liệu...</p>
          ) : error ? (
            <p style={{ color: "var(--color-accent-red)" }}>{error}</p>
          ) : genres.length === 0 ? (
            <p style={{ color: "var(--color-text-muted)" }}>Chưa có thể loại nào.</p>
          ) : (
            <div className="admin-genres__list" style={{ display: "grid", gap: "0.75rem" }}>
              {genres.map((genre) => (
                <article key={genre.id} className="admin-genre-item" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "1rem", padding: "0.9rem 1rem", border: "1px solid var(--color-border)", borderRadius: "var(--radius-lg)", background: "var(--color-surface-1)" }}>
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flexWrap: "wrap" }}>
                      <strong>{genre.name}</strong>
                      <span style={{ fontSize: "0.75rem", padding: "0.2rem 0.45rem", borderRadius: "999px", background: "var(--color-surface-2)", color: "var(--color-text-muted)" }}>{genre.slug}</span>
                      {!genre.isActive && <span style={{ fontSize: "0.75rem", color: "var(--color-accent-red)" }}>Tắt</span>}
                    </div>
                    {genre.description && <p style={{ marginTop: "0.25rem", color: "var(--color-text-muted)" }}>{genre.description}</p>}
                  </div>
                  <div style={{ display: "flex", gap: "0.5rem" }}>
                    <button className="btn btn--secondary" type="button" onClick={() => handleEdit(genre)}>Sửa</button>
                    <button className="btn btn--ghost" type="button" onClick={() => void handleDelete(genre.id)}>Xóa</button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

        <section className="panel-card">
          <div className="panel-card__header">
            <h2 className="panel-card__title">{editingId ? "Chỉnh sửa thể loại" : "Thêm thể loại mới"}</h2>
            <span className="panel-card__muted">{editingId ? "Cập nhật thông tin" : "Nhập dữ liệu mới"}</span>
          </div>

          <form onSubmit={(event) => void handleSubmit(event)} style={{ display: "grid", gap: "0.9rem" }}>
            <label style={{ display: "grid", gap: "0.35rem" }}>
              <span>Tên thể loại</span>
              <input
                className="input"
                value={draft.name}
                onChange={(event) => setDraft((current) => ({ ...current, name: event.target.value }))}
                placeholder="Ví dụ: Huyền Huyễn"
              />
            </label>

            <label style={{ display: "grid", gap: "0.35rem" }}>
              <span>Slug</span>
              <input
                className="input"
                value={draft.slug}
                onChange={(event) => setDraft((current) => ({ ...current, slug: event.target.value }))}
                placeholder="huyen-huyen"
              />
            </label>

            <label style={{ display: "grid", gap: "0.35rem" }}>
              <span>Mô tả</span>
              <textarea
                className="input"
                rows={4}
                value={draft.description}
                onChange={(event) => setDraft((current) => ({ ...current, description: event.target.value }))}
                placeholder="Mô tả ngắn về thể loại"
              />
            </label>

            <label style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <input
                type="checkbox"
                checked={draft.isActive}
                onChange={(event) => setDraft((current) => ({ ...current, isActive: event.target.checked }))}
              />
              <span>Hiển thị trên trang công khai</span>
            </label>

            <div style={{ display: "flex", gap: "0.65rem" }}>
              <button className="btn btn--primary" type="submit" disabled={saving}>{saving ? "Đang lưu..." : editingId ? "Cập nhật" : "Lưu thể loại"}</button>
              <button className="btn btn--ghost" type="button" onClick={() => {
                setDraft(emptyDraft);
                setEditingId(null);
              }}>Hủy</button>
            </div>
          </form>
        </section>
      </div>
    </div>
  );
}
