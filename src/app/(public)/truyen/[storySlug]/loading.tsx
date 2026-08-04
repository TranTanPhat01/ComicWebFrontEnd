import React from "react";

export function StoryDetailLoading() {
  return (
    <div className="story-detail-screen story-detail-screen--loading">
      {/* Skeleton Breadcrumbs */}
      <div className="container">
        <div className="skeleton-breadcrumbs skeleton-pulse" />
      </div>

      {/* Skeleton Hero Banner */}
      <div className="story-detail-hero story-detail-hero--loading">
        <div className="story-detail-hero__content-container">
          <div className="story-detail-hero__cover-card">
            <div className="story-detail-hero__cover-wrapper skeleton-pulse" />
          </div>
          <div className="story-detail-hero__info">
            <div className="skeleton-line skeleton-line--badge skeleton-pulse" />
            <div className="skeleton-line skeleton-line--title skeleton-pulse" />
            <div className="skeleton-line skeleton-line--meta skeleton-pulse" />
            <div className="skeleton-line skeleton-line--stats skeleton-pulse" />
            <div className="skeleton-line skeleton-line--actions skeleton-pulse" />
          </div>
        </div>
      </div>

      {/* Skeleton Body Layout */}
      <div className="story-detail-screen__container container">
        <div className="story-detail-screen__main">
          {/* Skeleton Synopsis Description */}
          <div className="story-description story-description--loading">
            <div className="skeleton-line skeleton-line--section-title skeleton-pulse" />
            <div className="skeleton-line skeleton-line--desc-paragraph skeleton-pulse" />
            <div className="skeleton-line skeleton-line--desc-paragraph skeleton-pulse" />
            <div className="skeleton-line skeleton-line--desc-paragraph skeleton-pulse" />
          </div>

          {/* Skeleton Chapters List */}
          <div className="chapter-list chapter-list--loading">
            <div className="skeleton-line skeleton-line--toolbar skeleton-pulse" />
            <div className="chapter-list__grid">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="chapter-list-item chapter-list-item--loading">
                  <div className="chapter-list-item__link skeleton-pulse" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Skeleton Sidebar Info Box */}
        <aside className="story-detail-screen__sidebar">
          <div className="story-info-sidebar story-info-sidebar--loading">
            <div className="skeleton-line skeleton-line--section-title skeleton-pulse" />
            <div className="story-info-sidebar__card skeleton-pulse" />
          </div>
        </aside>
      </div>
    </div>
  );
}

export default StoryDetailLoading;
