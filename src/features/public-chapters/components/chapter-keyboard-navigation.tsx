"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

interface KeyboardNavigationProps {
  storySlug: string;
  previousSlug: string | null;
  nextSlug: string | null;
}

export function ChapterKeyboardNavigation({
  storySlug,
  previousSlug,
  nextSlug,
}: KeyboardNavigationProps) {
  const router = useRouter();

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const activeEl = document.activeElement;
      if (activeEl) {
        const tagName = activeEl.tagName.toLowerCase();
        const contentEditable = activeEl.getAttribute("contenteditable");
        if (
          tagName === "input" ||
          tagName === "textarea" ||
          tagName === "select" ||
          contentEditable === "true" ||
          contentEditable === ""
        ) {
          return;
        }
      }

      if (event.key === "ArrowLeft" && previousSlug) {
        router.push(`/truyen/${storySlug}?chuong-id=${previousSlug}`);
      } else if (event.key === "ArrowRight" && nextSlug) {
        router.push(`/truyen/${storySlug}?chuong-id=${nextSlug}`);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [router, storySlug, previousSlug, nextSlug]);

  return null;
}

export default ChapterKeyboardNavigation;
