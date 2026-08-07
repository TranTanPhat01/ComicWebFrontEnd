"use client";

import { useEffect, useState } from "react";
import { PageHeader } from "@/components/shared/page-header";
import Link from "next/link";
import { ROUTES } from "@/constants/routes";
import { getAdminStoriesBrowser, getAdminStatsBrowser } from "../api/admin-stories-browser.api";
import type { AdminStoryListItemDto, AdminStatsDto } from "../types/admin-story.types";

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

// ── Component ──────────────────────────────────────────────────────────────────
export function AdminDashboardScreen() {
  const [stories, setStories] = useState<AdminStoryListItemDto[]>([]);
  const [stats, setStats] = useState<AdminStatsDto | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    void (async () => {
      const [res, statsRes] = await Promise.all([
        
        getAdminStoriesBrowser({ page: 1, pageSize: 10 }),
        getAdminStatsBrowser(),
      ]);

      if (res.success && res.data) {
        const raw = res.data as unknown;
        let list: AdminStoryListItemDto[] = [];
        if (raw && typeof raw === "object") {
          if ("data" in raw && Array.isArray((raw as { data: unknown }).data)) {
            list = (raw as { data: AdminStoryListItemDto[] }).data;
          } else if ("items" in raw && Array.isArray((raw as { items: unknown }).items)) {
            list = (raw as { items: AdminStoryListItemDto[] }).items;
          }
        }
        setStories(list);
      }

      if (statsRes.success && statsRes.data) {
        setStats(statsRes.data);
      }
      setLoading(false);
    })();
  }, []);

  const ongoing = stories.filter((s) => s.status === "Published").length;
  const completed = stories.filter((s) => s.status === "Completed").length;
  const totalItems = stories.length;

  return (
    <div className="admin-dashboard">
      <PageHeader
        title="Trang quản trị"
        description="Tổng quan hệ thống ComicWeb"
      />

      {/* Stats Grid */}
      <div className="admin-dashboard__stats">
        <div className="stats-card stats-card--accent-primary">
          <div className="stats-card__icon">📚</div>
          <div className="stats-card__label">Tổng truyện</div>
          <div className="stats-card__value">{loading ? "—" : formatNumber(stats?.totalStories ?? 0)}</div>
          <div className="stats-card__sub">trong hệ thống</div>
        </div>

        <div className="stats-card stats-card--accent-green">
          <div className="stats-card__icon">🔥</div>
          <div className="stats-card__label">Đang phát hành</div>
          <div className="stats-card__value stats-card__value--ongoing">
            {loading ? "—" : formatNumber(stats?.ongoingStories ?? 0)}
          </div>
          <div className="stats-card__sub">truyện đang update</div>
        </div>

        <div className="stats-card stats-card--accent-blue">
          <div className="stats-card__icon">📖</div>
          <div className="stats-card__label">Tổng chương</div>
          <div className="stats-card__value">{loading ? "—" : formatNumber(stats?.totalChapters ?? 0)}</div>
          <div className="stats-card__sub">chương đã đăng</div>
        </div>

        <div className="stats-card stats-card--accent-orange">
          <div className="stats-card__icon">🔒</div>
          <div className="stats-card__label">Khóa Shopee</div>
          <div className="stats-card__value">{loading ? "—" : formatNumber(stats?.lockedChapters ?? 0)}</div>
          <div className="stats-card__sub">chương có link mua sách</div>
        </div>
 
        <div className="stats-card stats-card--accent-red" style={{ borderLeft: "4px solid #ef4444" }}>
          <div className="stats-card__icon">🛒</div>
          <div className="stats-card__label">Click Mua Sách</div>
          <div className="stats-card__value" style={{ color: "#ef4444" }}>
            {loading ? "—" : formatNumber(stats?.totalAffiliateClicks ?? 0)}
          </div>
          <div className="stats-card__sub">lượt click link Shopee</div>
        </div>
      </div>

      {/* Quick Links */}
      <div className="admin-dashboard__quicklinks">
        <h3 className="admin-dashboard__section-title">Truy cập nhanh</h3>
        <div className="admin-dashboard__quicklinks-grid">
          <Link href={ROUTES.adminStories} className="admin-quicklink-card">
            <span className="admin-quicklink-card__icon">📚</span>
            <span className="admin-quicklink-card__label">Quản lý Truyện</span>
            <span className="admin-quicklink-card__arrow">→</span>
          </Link>
          <Link href={ROUTES.adminGenres} className="admin-quicklink-card">
            <span className="admin-quicklink-card__icon">🏷️</span>
            <span className="admin-quicklink-card__label">Quản lý Thể loại</span>
            <span className="admin-quicklink-card__arrow">→</span>
          </Link>
          <Link href={ROUTES.adminAuditLogs} className="admin-quicklink-card">
            <span className="admin-quicklink-card__icon">📋</span>
            <span className="admin-quicklink-card__label">Nhật ký thao tác</span>
            <span className="admin-quicklink-card__arrow">→</span>
          </Link>
          <Link href="/" target="_blank" className="admin-quicklink-card">
            <span className="admin-quicklink-card__icon">🌐</span>
            <span className="admin-quicklink-card__label">Xem trang public</span>
            <span className="admin-quicklink-card__arrow">↗</span>
          </Link>
        </div>
      </div>

      {/* Recent Stories Table */}
      <div className="admin-dashboard__recent panel-card">
        <div className="panel-card__header">
          <h3 className="panel-card__title">Truyện mới nhất</h3>
          <Link href={ROUTES.adminStories} className="admin-dashboard__see-all">
            Xem tất cả →
          </Link>
        </div>

        {loading ? (
          <div className="admin-table__skeleton" style={{ height: "200px" }} />
        ) : stories.length === 0 ? (
          <p style={{ color: "var(--color-text-muted)", textAlign: "center", padding: "2rem 0" }}>
            Chưa có truyện nào trong hệ thống.
          </p>
        ) : (
          <div className="admin-table-wrapper">
            <table className="admin-table">
              <thead>
                <tr>
                  <th className="admin-table__th">Tên truyện</th>
                  <th className="admin-table__th admin-table__th--center">Trạng thái</th>
                  <th className="admin-table__th admin-table__th--center">Chương</th>
                  <th className="admin-table__th admin-table__th--center">Lượt xem</th>
                  <th className="admin-table__th">Cập nhật</th>
                </tr>
              </thead>
              <tbody>
                {stories.slice(0, 8).map((story) => (
                  <tr key={story.id} className="admin-table__row">
                    <td className="admin-table__td">
                      <span className="admin-table__story-title">{story.title}</span>
                    </td>
                    <td className="admin-table__td admin-table__td--center">
                      <span className={`status-badge status-badge--${story.status.toLowerCase()}`}>
                        {story.status === "Published" ? "Đã xuất bản"
                          : story.status === "Completed" ? "Hoàn thành"
                          : story.status === "Draft" ? "Bản nháp"
                          : "Tạm ẩn"}
                      </span>
                    </td>
                    <td className="admin-table__td admin-table__td--center admin-table__td--mono">
                      {story.totalChapters ?? "—"}
                    </td>
                    <td className="admin-table__td admin-table__td--center admin-table__td--mono">
                      {story.viewCount !== undefined ? formatNumber(story.viewCount) : "—"}
                    </td>
                    <td className="admin-table__td admin-table__td--muted">
                      {formatDate(story.updateAt || story.createAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Status breakdown */}
      <div className="admin-dashboard__breakdown">
        <div className="panel-card">
          <div className="panel-card__header">
            <h3 className="panel-card__title">Phân bổ trạng thái</h3>
          </div>
          <div className="admin-dashboard__breakdown-list">
            {[
              { label: "Đã xuất bản", count: ongoing, color: "#22c55e", pct: totalItems > 0 ? (ongoing / stories.length) * 100 : 0 },
              { label: "Đã hoàn thành", count: completed, color: "#7c3aed", pct: totalItems > 0 ? (completed / stories.length) * 100 : 0 },
              { label: "Bản nháp", count: stories.filter((s) => s.status === "Draft").length, color: "#f59e0b", pct: totalItems > 0 ? (stories.filter((s) => s.status === "Draft").length / stories.length) * 100 : 0 },
              { label: "Tạm ẩn", count: stories.filter((s) => s.status === "Hidden").length, color: "#ef4444", pct: totalItems > 0 ? (stories.filter((s) => s.status === "Hidden").length / stories.length) * 100 : 0 },
            ].map((item) => (
              <div key={item.label} className="admin-dashboard__breakdown-item">
                <div className="admin-dashboard__breakdown-label">
                  <span>{item.label}</span>
                  <span style={{ color: "var(--color-text-muted)" }}>{item.count}</span>
                </div>
                <div className="admin-dashboard__breakdown-bar-bg">
                  <div
                    className="admin-dashboard__breakdown-bar"
                    style={{ width: `${item.pct}%`, backgroundColor: item.color }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
