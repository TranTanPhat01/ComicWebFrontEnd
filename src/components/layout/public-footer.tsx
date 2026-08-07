"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ROUTES } from "@/constants/routes";
import { siteConfig } from "@/config/site";
import { subscribeNewsletterBrowser } from "@/features/public-stories/api/notifications-browser.api";

function NewsletterSubscriptionForm() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string; isError: boolean } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanEmail = email.trim();
    if (!cleanEmail) return;

    setLoading(true);
    setMessage(null);

    try {
      const response = await subscribeNewsletterBrowser(cleanEmail);
      if (response.success) {
        setMessage({ text: "Đăng ký thành công! Cảm ơn bạn.", isError: false });
        setEmail("");
      } else {
        setMessage({ text: response.error?.message || "Đăng ký thất bại. Vui lòng thử lại.", isError: true });
      }
    } catch (err) {
      setMessage({ text: "Lỗi kết nối. Vui lòng thử lại sau.", isError: true });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="public-footer__newsletter-form">
      <div className="public-footer__newsletter-input-wrapper">
        <input
          type="email"
          required
          placeholder="Nhập email của bạn..."
          className="public-footer__newsletter-input"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={loading}
        />
        <button
          type="submit"
          className="public-footer__newsletter-btn"
          disabled={loading}
          aria-label="Đăng ký"
        >
          {loading ? (
            <span className="public-footer__newsletter-spinner" />
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
              <path d="M3 4a2 2 0 00-2 2v1.161l8.441 4.221a1.25 1.25 0 001.118 0L19 7.162V6a2 2 0 00-2-2H3z" />
              <path d="M19 8.839l-7.77 3.885a2.75 2.75 0 01-2.46 0L1 8.839V14a2 2 0 002 2h14a2 2 0 002-2V8.839z" />
            </svg>
          )}
        </button>
      </div>
      {message && (
        <p className={`public-footer__newsletter-msg ${message.isError ? "public-footer__newsletter-msg--error" : ""}`}>
          {message.text}
        </p>
      )}
    </form>
  );
}

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
              <Link href={ROUTES.genres} className="public-footer__link">
                Thể loại
              </Link>
              <Link href={ROUTES.newUpdates} className="public-footer__link">
                Mới cập nhật
              </Link>
              <Link href={ROUTES.hot} className="public-footer__link">
                Truyện Hot
              </Link>
              <Link href={ROUTES.completed} className="public-footer__link">
                Hoàn thành
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

          <div className="public-footer__group public-footer__newsletter">
            <h3 className="public-footer__group-title">Đăng Ký Nhận Tin</h3>
            <p className="public-footer__newsletter-desc">
              Nhận thông báo qua email mỗi khi có chương mới của các truyện bạn yêu thích.
            </p>
            <NewsletterSubscriptionForm />
          </div>
        </div>
      </div>

      <div className="public-footer__bottom container">
        <p className="public-footer__copyright">
          &copy; {new Date().getFullYear()} {siteConfig.name}. Thiết kế giao diện hiện đại & cao cấp. Mọi quyền được bảo lưu.
        </p>
      </div>
    </footer>
  );
}

export default PublicFooter;
