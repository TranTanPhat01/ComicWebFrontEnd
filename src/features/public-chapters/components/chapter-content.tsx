import React from "react";
import { EmptyState } from "@/components/feedback/empty-state";

interface ChapterContentProps {
  content: string | null | undefined;
}

export function ChapterContent({ content }: ChapterContentProps) {
  if (!content || content.trim() === "") {
    return (
      <div className="chapter-content chapter-content--empty">
        <EmptyState
          title="Nội dung trống"
          message="Chương truyện này hiện tại chưa có nội dung chữ hoặc hình ảnh."
        />
      </div>
    );
  }

  return (
    <article 
      className="chapter-content" 
      dangerouslySetInnerHTML={{ __html: content }} 
    />
  );
}

export default ChapterContent;
