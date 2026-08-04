"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface ChapterErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export function ChapterError({ error, reset }: ChapterErrorProps) {
  const pathname = usePathname();

  useEffect(() => {
    console.error("Chapter Reader Page Error Boundary:", error);
  }, [error]);

  // Safely extract storySlug from client pathname since Next.js error boundaries do not receive params
  let storySlug = "";
  if (pathname) {
    const parts = pathname.split("/");
    const truyenIndex = parts.indexOf("truyen");
    if (truyenIndex !== -1 && parts[truyenIndex + 1]) {
      storySlug = parts[truyenIndex + 1];
    }
  }

  const backUrl = storySlug ? `/truyen/${storySlug}` : "/";

  return (
    <div className="story-error-screen container">
      <div className="story-error-screen__card">
        <div className="story-error-screen__icon-wrapper">
          <svg
            className="story-error-screen__icon"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>
        <h2 className="story-error-screen__title">Không thể tải nội dung chương</h2>
        <p className="story-error-screen__message">
          Hệ thống gặp sự cố khi truy vấn nội dung chương truyện từ backend. Vui lòng đảm bảo kết nối mạng hoặc thử lại sau.
        </p>
        <div className="story-error-screen__actions" style={{ display: "flex", gap: "1rem" }}>
          <button onClick={() => reset()} className="story-error-screen__btn">
            Thử lại
          </button>
          <Link
            href={backUrl}
            className="story-error-screen__btn"
            style={{
              backgroundColor: "rgba(255, 255, 255, 0.1)",
              border: "1px solid rgba(255, 255, 255, 0.15)",
              color: "#fff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              textDecoration: "none",
            }}
          >
            Về chi tiết truyện
          </Link>
        </div>
      </div>
    </div>
  );
}

export default ChapterError;
