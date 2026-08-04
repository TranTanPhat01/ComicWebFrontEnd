import React from "react";
import Link from "next/link";
import { ROUTES } from "@/constants/routes";
import { siteConfig } from "@/config/site";

export function PublicFooter() {
  return (
    <footer className="public-footer">
      <div className="public-footer__container container">
        {/* Brand description on the left */}
        <div className="public-footer__info">
          <Link href={ROUTES.home} className="public-footer__logo">
            <svg
              className="public-footer__logo-icon"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25"
              />
            </svg>
            <span>{siteConfig.name}</span>
          </Link>
          <p className="public-footer__description">
            {siteConfig.description}. Đọc truyện chất lượng cao, cập nhật nhanh nhất, trải nghiệm mượt mà trên mọi thiết bị.
          </p>
        </div>

        {/* Navigation links in columns */}
        <div className="public-footer__links-wrapper">
          <div className="public-footer__group">
            <h3 className="public-footer__group-title">Khám Phá</h3>
            <nav className="public-footer__nav" aria-label="Khám phá">
              <Link href={ROUTES.home} className="public-footer__link">
                Trang chủ
              </Link>
              <Link href={`${ROUTES.home}?genre=Tất cả`} className="public-footer__link">
                Thể loại
              </Link>
              <Link href={ROUTES.home} className="public-footer__link">
                Mới cập nhật
              </Link>
            </nav>
          </div>

          <div className="public-footer__group">
            <h3 className="public-footer__group-title">Liên Kết</h3>
            <nav className="public-footer__nav" aria-label="Liên kết ngoài">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="public-footer__link"
              >
                Fanpage Facebook
              </a>
              <Link href={ROUTES.adminLogin} className="public-footer__link">
                Quản trị viên
              </Link>
            </nav>
          </div>
        </div>
      </div>

      <div className="public-footer__bottom container">
        <p className="public-footer__copyright">
          &copy; {new Date().getFullYear()} {siteConfig.name}. Thiết kế giao diện hiện đại & cao cấp. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

export default PublicFooter;
