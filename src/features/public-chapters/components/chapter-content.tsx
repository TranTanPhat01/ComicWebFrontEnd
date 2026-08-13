import React from "react";
import { EmptyState } from "@/components/feedback/empty-state";

interface ChapterContentProps {
  content: string | null | undefined;
}

function formatContent(content: string): string {
  if (!content) return "";

  // Check if content already contains HTML tags (e.g. from scraped chapters)
  const hasHtml = /<[a-z/][^>]*>/i.test(content);
  if (hasHtml) {
    return content;
  }

  // Plain text from manual story-posting: split by double newlines for paragraphs, and replace single newlines with <br />
  return content
    .split(/\r?\n\s*\r?\n/)
    .filter((para) => para.trim() !== "")
    .map((para) => `<p>${para.replace(/\r?\n/g, "<br />")}</p>`)
    .join("");
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

  const formattedContent = formatContent(content);

  return (
    <article 
      className="chapter-content" 
      dangerouslySetInnerHTML={{ __html: formattedContent }} 
    />
  );
}

export default ChapterContent;
