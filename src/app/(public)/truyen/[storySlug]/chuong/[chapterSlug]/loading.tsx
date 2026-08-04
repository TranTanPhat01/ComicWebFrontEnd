import React from "react";

export function ChapterReaderLoading() {
  return (
    <div className="chapter-reader-screen chapter-reader-screen--loading">
      <div className="container">
        {/* Skeleton Breadcrumbs */}
        <div className="skeleton-breadcrumbs skeleton-pulse" style={{ width: "320px" }} />

        {/* Skeleton Header Info */}
        <div className="chapter-reader-header__info" style={{ marginTop: "1rem", marginBottom: "2rem" }}>
          <div className="skeleton-line skeleton-line--badge skeleton-pulse" style={{ width: "160px", height: "18px" }} />
          <div className="skeleton-line skeleton-pulse" style={{ width: "40%", height: "36px", marginTop: "0.5rem" }} />
          <div className="skeleton-line skeleton-pulse" style={{ width: "220px", height: "16px", marginTop: "0.5rem" }} />
        </div>

        {/* Skeleton Navigation Top */}
        <div className="chapter-navigation" style={{ marginBottom: "3rem" }}>
          <div className="skeleton-pulse" style={{ width: "120px", height: "42px", borderRadius: "8px" }} />
          <div className="skeleton-pulse" style={{ width: "100px", height: "42px", borderRadius: "8px" }} />
          <div className="skeleton-pulse" style={{ width: "120px", height: "42px", borderRadius: "8px" }} />
        </div>

        {/* Skeleton Reading Content paragraphs */}
        <div className="chapter-content chapter-content--loading" style={{ maxWidth: "720px", margin: "0 auto", display: "grid", gap: "1rem" }}>
          <div className="skeleton-line skeleton-pulse" style={{ width: "100%", height: "18px" }} />
          <div className="skeleton-line skeleton-pulse" style={{ width: "95%", height: "18px" }} />
          <div className="skeleton-line skeleton-pulse" style={{ width: "80%", height: "18px" }} />
          <div className="skeleton-line skeleton-pulse" style={{ width: "90%", height: "18px", marginTop: "1rem" }} />
          <div className="skeleton-line skeleton-pulse" style={{ width: "100%", height: "18px" }} />
          <div className="skeleton-line skeleton-pulse" style={{ width: "70%", height: "18px" }} />
          <div className="skeleton-line skeleton-pulse" style={{ width: "85%", height: "18px", marginTop: "1rem" }} />
          <div className="skeleton-line skeleton-pulse" style={{ width: "95%", height: "18px" }} />
          <div className="skeleton-line skeleton-pulse" style={{ width: "50%", height: "18px" }} />
        </div>
      </div>
    </div>
  );
}

export default ChapterReaderLoading;
