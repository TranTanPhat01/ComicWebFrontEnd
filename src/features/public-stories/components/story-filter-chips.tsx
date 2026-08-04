"use client";

import React, { useRef, useEffect } from "react";
import Link from "next/link";
import { ROUTES } from "@/constants/routes";
import type { GenreOptionDto } from "../types/public-story.types";

interface StoryFilterChipsProps {
  activeGenre?: string;
  search?: string;
  genres?: GenreOptionDto[];
}

export function StoryFilterChips({ activeGenre = "Tất cả", search, genres = [] }: StoryFilterChipsProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const activeChipRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    if (activeChipRef.current && scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const activeChip = activeChipRef.current;

      const containerWidth = container.clientWidth;
      const containerScrollLeft = container.scrollLeft;
      const chipOffsetLeft = activeChip.offsetLeft;
      const chipWidth = activeChip.clientWidth;

      // Determine if chip is out of container visible boundaries
      const isClippedLeft = chipOffsetLeft < containerScrollLeft;
      const isClippedRight = (chipOffsetLeft + chipWidth) > (containerScrollLeft + containerWidth);

      if (isClippedLeft || isClippedRight) {
        const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        // Scroll the active chip centered inside the horizontal viewport
        container.scrollTo({
          left: chipOffsetLeft - (containerWidth / 2) + (chipWidth / 2),
          behavior: prefersReducedMotion ? "auto" : "smooth",
        });
      }
    }
  }, [activeGenre, search]);

  const items = [{ id: 0, name: "Tất cả", slug: "" }, ...genres];

  return (
    <div className="filter-chips-container" aria-label="Lọc theo thể loại">
      <div ref={scrollContainerRef} className="filter-chips-scroll">
        {items.map((genre) => {
          const isAll = genre.name === "Tất cả";
          const isActive = isAll
            ? activeGenre === "Tất cả" && !search
            : activeGenre === genre.name;

          const query: Record<string, string> = {};
          if (!isAll) {
            query.genre = genre.name;
          }

          const queryString = new URLSearchParams(query).toString();
          const href = queryString ? `${ROUTES.home}?${queryString}` : ROUTES.home;

          return (
            <Link
              key={genre.id || genre.name}
              href={href}
              scroll={false}
              ref={isActive ? activeChipRef : null}
              className={`filter-chip ${isActive ? "filter-chip--active" : ""}`}
            >
              {genre.name}
            </Link>
          );
        })}
      </div>
      <div className="filter-chips-container__fade" />
    </div>
  );
}

export default StoryFilterChips;
