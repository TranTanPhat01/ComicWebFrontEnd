"use client";

import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";

export function ScrollToTop() {
  const [visible, setVisible] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setVisible(window.scrollY > 400);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const isChapterPage = pathname ? pathname.includes("/chuong/") : false;

  if (!visible || isChapterPage) return null;

  return (
    <button
      onClick={scrollTop}
      className="scroll-to-top"
      aria-label="Cuộn lên đầu trang"
      title="Lên đầu trang"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2.5}
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
      </svg>
    </button>
  );
}

export default ScrollToTop;
