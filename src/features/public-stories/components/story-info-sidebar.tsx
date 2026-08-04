import React from "react";
import type { PublicStoryDetailDto } from "../types/public-story.types";

interface StoryInfoSidebarProps {
  story: PublicStoryDetailDto;
}

export function StoryInfoSidebar({ story }: StoryInfoSidebarProps) {
  const formattedViews = new Intl.NumberFormat("vi-VN").format(story.viewCount);
  
  const formatDate = (isoString: string) => {
    return new Date(isoString).toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <section className="story-info-sidebar" aria-label="Thông tin chi tiết truyện">
      <h3 className="story-info-sidebar__title">THÔNG TIN CHI TIẾT</h3>
      <div className="story-info-sidebar__card">
        <dl className="story-info-sidebar__list">
          <div className="story-info-sidebar__item">
            <dt className="story-info-sidebar__label">Tên truyện</dt>
            <dd className="story-info-sidebar__value" title={story.title}>{story.title}</dd>
          </div>
          <div className="story-info-sidebar__item">
            <dt className="story-info-sidebar__label">Tác giả</dt>
            <dd className="story-info-sidebar__value">{story.authorName || "Đang cập nhật"}</dd>
          </div>
          {story.artistName && (
            <div className="story-info-sidebar__item">
              <dt className="story-info-sidebar__label">Họa sĩ</dt>
              <dd className="story-info-sidebar__value">{story.artistName}</dd>
            </div>
          )}
          <div className="story-info-sidebar__item">
            <dt className="story-info-sidebar__label">Trạng thái</dt>
            <dd className="story-info-sidebar__value">
              <span className={`status-badge-compact status-badge-compact--${story.status.toLowerCase()}`}>
                {story.status === "Ongoing" ? "Đang tiến hành" : 
                 story.status === "Completed" ? "Hoàn thành" : 
                 story.status === "Hiatus" ? "Tạm ngưng" : "Đã hủy"}
              </span>
            </dd>
          </div>
          <div className="story-info-sidebar__item">
            <dt className="story-info-sidebar__label">Số chương</dt>
            <dd className="story-info-sidebar__value">{story.totalChapters}</dd>
          </div>
          <div className="story-info-sidebar__item">
            <dt className="story-info-sidebar__label">Lượt xem</dt>
            <dd className="story-info-sidebar__value">{formattedViews}</dd>
          </div>
          <div className="story-info-sidebar__item">
            <dt className="story-info-sidebar__label">Ngày đăng</dt>
            <dd className="story-info-sidebar__value">{formatDate(story.createdAt)}</dd>
          </div>
          <div className="story-info-sidebar__item">
            <dt className="story-info-sidebar__label">Cập nhật lúc</dt>
            <dd className="story-info-sidebar__value">{formatDate(story.updatedAt)}</dd>
          </div>
        </dl>
      </div>
    </section>
  );
}

export default StoryInfoSidebar;
