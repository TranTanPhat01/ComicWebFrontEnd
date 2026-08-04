import React from "react";
import Link from "next/link";
import { ROUTES } from "@/constants/routes";
import type { GenreOptionDto } from "../types/public-story.types";

// Define genres with distinct SVGs for premium look
interface GenreItem {
  name: string;
  iconPath: React.ReactNode;
}

const GENRE_ITEMS: GenreItem[] = [
  {
    name: "Huyền Huyễn",
    iconPath: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
      </svg>
    ),
  },
  {
    name: "Đô Thị",
    iconPath: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.5 21V8.25A2.25 2.25 0 0017.25 6h-10.5A2.25 2.25 0 004.5 8.25V21m16.5 0V12a2.25 2.25 0 00-2.25-2.25H18M4.5 21V12a2.25 2.25 0 012.25-2.25H9m12 9V9.75A2.25 2.25 0 0018.75 7.5h-1.5m-9 13.5V10.125c0-.621.504-1.125 1.125-1.125H9.75M4.5 21h15" />
      </svg>
    ),
  },
  {
    name: "Hệ Thống",
    iconPath: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0115 18.257V17.25m6-12V15a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15V5.25m18 0A2.25 2.25 0 0018.75 3H5.25A2.25 2.25 0 003 5.25m18 0V12a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 12V5.25" />
      </svg>
    ),
  },
  {
    name: "Xuyên Không",
    iconPath: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
    ),
  },
  {
    name: "Tiên Hiệp",
    iconPath: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.813 15.904L9 21l5.096-.813a11.97 11.97 0 004.281-2.274l.006-.005a11.972 11.972 0 002.274-4.281L21 9l-5.096.813a11.97 11.97 0 00-4.281 2.274l-.006.005a11.972 11.972 0 00-2.274 4.281z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11.5 12.5L3 21" />
      </svg>
    ),
  },
  {
    name: "Khoa Huyễn",
    iconPath: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 3.104v1.244c0 .89-.56 1.6-1.2 1.6h-.5c-.64 0-1.2-.71-1.2-1.6V3.104m6-.001v1.245c0 .89.56 1.6 1.2 1.6h.5c.64 0 1.2-.71 1.2-1.6V3.103m-9 3.978c0-.621.504-1.125 1.125-1.125h12.75c.621 0 1.125.504 1.125 1.125v1.125h-15V7.081zm0 2.25h15v8.25c0 .621-.504 1.125-1.125 1.125H5.625A1.125 1.125 0 014.5 17.58v-8.25z" />
      </svg>
    ),
  },
  {
    name: "Đấu Khí",
    iconPath: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.362 5.214A8.252 8.252 0 0112 21 8.25 8.25 0 016.038 7.048 8.287 8.287 0 009 9.6a8.983 8.983 0 013.361-6.867 8.21 8.21 0 003 2.48z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 18a3.75 3.75 0 00.495-7.467 5.99 5.99 0 00-1.925 3.546 5.974 5.974 0 01-2.133-1A3.75 3.75 0 0012 18z" />
      </svg>
    ),
  },
  {
    name: "Đấu Trí",
    iconPath: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 18a3.75 3.75 0 00.495-7.467 5.99 5.99 0 00-1.925 3.546 5.974 5.974 0 01-2.133-1A3.75 3.75 0 0012 18z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m0-12.728l.707.707m11.314 11.314l.707-.707" />
      </svg>
    ),
  },
  {
    name: "Khác",
    iconPath: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
      </svg>
    ),
  },
];

interface PopularGenresProps {
  genres?: GenreOptionDto[];
}

export function PopularGenres({ genres = [] }: PopularGenresProps) {
  const visibleGenres = genres.length > 0 ? genres.slice(0, 8) : GENRE_ITEMS;

  return (
    <section className="popular-genres" aria-label="Thể loại phổ biến">
      <div className="section-header">
        <h2 className="section-title">
          THỂ LOẠI PHỔ BIẾN
        </h2>
        <Link href={ROUTES.home} className="section-header__link">
          Xem tất cả &rsaquo;
        </Link>
      </div>

      <div className="genres-grid">
        {visibleGenres.map((genre) => {
          const genreName = typeof genre === "string" ? genre : genre.name;
          const iconPath = typeof genre === "string"
            ? GENRE_ITEMS.find((item) => item.name === genre)?.iconPath || GENRE_ITEMS[0]?.iconPath
            : GENRE_ITEMS.find((item) => item.name === genre.name)?.iconPath || GENRE_ITEMS[0]?.iconPath;

          return (
            <Link
              key={genreName}
              href={`${ROUTES.home}?genre=${encodeURIComponent(genreName)}`}
              className="genre-card"
            >
              <div className="genre-card__icon">
                {iconPath}
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
