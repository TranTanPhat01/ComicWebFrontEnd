"use client";

import React, { useState } from "react";
import { translateText } from "@/lib/utils";

interface StoryDescriptionProps {
  description: string | null;
}

export function StoryDescription({ description }: StoryDescriptionProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const translatedDescription = translateText(description);

  if (!translatedDescription) {
    return (
      <div className="story-description">
        <h2 className="story-description__title">NỘI DUNG</h2>
        <p className="story-description__content story-description__content--empty">
          Chưa có mô tả chi tiết cho truyện này.
        </p>
      </div>
    );
  }

  // Split description by newlines to render nice paragraphs
  const paragraphs = translatedDescription.split("\n").filter(p => p.trim() !== "");

  return (
    <div className="story-description">
      <h2 className="story-description__title">NỘI DUNG</h2>
      <div
        className={`story-description__content ${
          isExpanded ? "story-description__content--expanded" : ""
        }`}
      >
        {paragraphs.map((para, index) => (
          <p key={index} className="story-description__paragraph">
            {para}
          </p>
        ))}
      </div>
      
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="story-description__toggle-btn"
        aria-expanded={isExpanded}
      >
        {isExpanded ? (
          <>
            Thu gọn
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
            </svg>
          </>
        ) : (
          <>
            Xem thêm
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </>
        )}
      </button>
    </div>
  );
}

export default StoryDescription;
