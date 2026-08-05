import React from "react";
import Link from "next/link";
import { ROUTES } from "@/constants/routes";
import type { GenreOptionDto } from "../types/public-story.types";

// Helper function to return beautiful, soft, human-designed icons (Feather/Lucide style)
function getGenreIcon(name: string): React.ReactNode {
  const normalized = name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, ""); // Strip accents

  // Action / Adventure (Rounded crossed swords or shield)
  if (normalized.includes("hanh dong") || normalized.includes("phieu luu") || normalized.includes("action")) {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14.5 17.5L3 6V3h3l11.5 11.5" />
        <path d="M13 19l6-6" />
        <path d="M16 16l4 4" />
        <path d="M19 21l2-2" />
      </svg>
    );
  }

  // Magic / Fantasy (Cute Crescent Moon & Stars)
  if (normalized.includes("huyen huyen") || normalized.includes("huyen ao") || normalized.includes("magic") || normalized.includes("phep thuat") || normalized.includes("phap thuat") || normalized.includes("di nang")) {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
        <path d="M19 3v4M21 5h-4" />
      </svg>
    );
  }

  // System / Cyber / Tech (Rounded CPU chip)
  if (normalized.includes("he thong") || normalized.includes("system") || normalized.includes("game")) {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="4" y="4" width="16" height="16" rx="3" />
        <rect x="9" y="9" width="6" height="6" rx="1.5" />
        <path d="M9 1v3M15 1v3M9 20v3M15 20v3M20 9h3M20 15h3M1 9h3M1 15h3" />
      </svg>
    );
  }

  // Sci-Fi (Friendly Space Rocket)
  if (normalized.includes("khoa huyen") || normalized.includes("vien tuong") || normalized.includes("sci-fi") || normalized.includes("vu tru")) {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4.5 16.5c-1.5 1.5-2.5 3.5-2.5 3.5s2-1 3.5-2.5" />
        <path d="M12 9l-4.5 4.5" />
        <path d="M9 15l-3-3" />
        <path d="M18.5 5.5a4.24 4.24 0 0 0-6 0L3.5 14.5V20.5h6l9-9a4.24 4.24 0 0 0 0-6z" />
      </svg>
    );
  }

  // Cultivation (Lotus Flower - Soft and Zen)
  if (normalized.includes("tien hiep") || normalized.includes("tu chan") || normalized.includes("kiem hiep") || normalized.includes("kiem") || normalized.includes("hiep")) {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2a4 4 0 0 0-4 4c0 3 4 8 4 8s4-5 4-8a4 4 0 0 0-4-4z" />
        <path d="M12 14s-4-3-6-3a4 4 0 0 0-4 4c0 3 6 4 10 4s10-1 10-4a4 4 0 0 0-4-4c-2 0-6 3-6 3z" />
      </svg>
    );
  }

  // History / Western / Castle (Friendly Crown)
  if (normalized.includes("phuong tay") || normalized.includes("co dai") || normalized.includes("lich su") || normalized.includes("western") || normalized.includes("vuong quoc")) {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 4l3 12h14l3-12-6 7-4-7-4 7-6-7z" />
        <path d="M3 20h18" />
      </svg>
    );
  }

  // Urban / Modern (Cute Suburban House / Building)
  if (normalized.includes("do thi") || normalized.includes("hien dai") || normalized.includes("modern") || normalized.includes("city")) {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 21h18" />
        <path d="M5 21V8a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v13" />
        <circle cx="10" cy="11" r="1" />
        <circle cx="14" cy="11" r="1" />
        <circle cx="10" cy="16" r="1" />
        <circle cx="14" cy="16" r="1" />
      </svg>
    );
  }

  // Time Travel / Reincarnation (Hourglass with elegant curves)
  if (normalized.includes("xuyen khong") || normalized.includes("trung sinh") || normalized.includes("luan hoi") || normalized.includes("trong sinh")) {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M5 2h14" />
        <path d="M5 22h14" />
        <path d="M19 2v4a3 3 0 0 1-3 3c-1.5 0-3 .5-3 2.5s1.5 2.5 3 2.5a3 3 0 0 1 3 3v4" />
        <path d="M5 2v4a3 3 0 0 0 3 3c1.5 0 3 .5 3 2.5S9.5 15 8 15a3 3 0 0 0-3 3v4" />
      </svg>
    );
  }

  // Martial Arts / Qi (Soft Shield)
  if (normalized.includes("dau khi") || normalized.includes("vo thuat") || normalized.includes("qi") || normalized.includes("the luc")) {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
    );
  }

  // Romance (Soft Heart)
  if (normalized.includes("ngon tinh") || normalized.includes("lang man") || normalized.includes("tinh cam") || normalized.includes("love") || normalized.includes("romance")) {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
      </svg>
    );
  }

  // Mystery / Strategy (Soft Compass)
  if (normalized.includes("dau tri") || normalized.includes("trinh tham") || normalized.includes("bi an") || normalized.includes("kinh di")) {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
      </svg>
    );
  }

  // Default Open Book (Feather style)
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2zM22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
    </svg>
  );
}

const MOCK_GENRE_NAMES = ["Huyền Huyễn", "Đô Thị", "Hệ Thống", "Xuyên Không", "Tiên Hiệp", "Khoa Huyễn", "Đấu Khí", "Đấu Trí", "Khác"];

interface PopularGenresProps {
  genres?: GenreOptionDto[];
}

export function PopularGenres({ genres = [] }: PopularGenresProps) {
  const visibleGenres = genres.length > 0 ? genres.slice(0, 9) : MOCK_GENRE_NAMES;

  return (
    <section className="popular-genres" aria-label="Thể loại phổ biến">
      <div className="section-header">
        <h2 className="section-title">
          THỂ LOẠI PHỔ BIẾN
        </h2>
        <Link href={ROUTES.genres} className="section-header__link">
          Xem tất cả &rsaquo;
        </Link>
      </div>

      <div className="genres-grid">
        {visibleGenres.map((genre) => {
          const genreName = typeof genre === "string" ? genre : genre.name;
          const iconPath = getGenreIcon(genreName);

          return (
            <Link
              key={genreName}
              href={`${ROUTES.home}?genre=${encodeURIComponent(genreName)}`}
              className="genre-card"
            >
              <div className="genre-card__icon-wrapper">
                <span className="genre-card__icon">
                  {iconPath}
                </span>
              </div>
              <div className="genre-card__info">
                <span className="genre-card__name">{genreName}</span>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

export default PopularGenres;
