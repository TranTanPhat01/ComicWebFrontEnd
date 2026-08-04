"use client";

import React, { useEffect } from "react";

interface StoryErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export function StoryError({ error, reset }: StoryErrorProps) {
  useEffect(() => {
    console.error("Story Detail Page Error Boundary:", error);
  }, [error]);

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
        <h2 className="story-error-screen__title">Không thể tải thông tin truyện</h2>
        <p className="story-error-screen__message">
          Hệ thống gặp sự cố khi truy vấn thông tin truyện từ backend. Vui lòng đảm bảo kết nối mạng hoặc thử lại sau.
        </p>
        <div className="story-error-screen__actions">
          <button onClick={() => reset()} className="story-error-screen__btn">
            Thử lại
          </button>
        </div>
      </div>
    </div>
  );
}

export default StoryError;
