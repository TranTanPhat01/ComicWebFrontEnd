"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";

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
  const pathname = usePathname();

  const isCleanPath = pathname ? pathname.includes("/chuong/") : false;

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
        const url = isCleanPath
          ? `/truyen/${storySlug}/chuong/${previousSlug}`
          : `/truyen/${storySlug}?chuong-id=${previousSlug}`;
        router.push(url);
      } else if (event.key === "ArrowRight" && nextSlug) {
        const url = isCleanPath
          ? `/truyen/${storySlug}/chuong/${nextSlug}`
          : `/truyen/${storySlug}?chuong-id=${nextSlug}`;
        router.push(url);
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
