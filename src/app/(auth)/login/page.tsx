"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/constants/routes";
import { useToast } from "@/providers/toast-provider";

export default function LoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  // Form states
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const emailRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    emailRef.current?.focus();
  }, []);

  const handleSocialLogin = (platform: string) => {
    toast(`Đang kết nối tới tài khoản ${platform} để đăng nhập...`, "info");
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast(`Đăng nhập thành công qua ${platform}! Chào mừng bạn trở lại.`, "success");
      router.push(ROUTES.home);
    }, 1500);
  };

  const handleMergeLocalData = async () => {
    try {
      const storedBookmarks = localStorage.getItem("comic_web_bookmarks");
      const storedHistory = localStorage.getItem("comic_web_reading_history");
 
      const bookmarks = storedBookmarks ? JSON.parse(storedBookmarks) : [];
      const history = storedHistory ? JSON.parse(storedHistory) : [];
 
      const follows = Array.isArray(bookmarks) 
        ? bookmarks.map((b: any) => Number(b.id)).filter(id => !isNaN(id) && id > 0)
        : [];
 
      const histories = Array.isArray(history)
        ? history
            .map((h: any) => ({
              storyId: Number(h.storyId),
              chapterId: Number(h.chapterId),
              lastReadAt: h.readAt || new Date().toISOString()
            }))
            .filter((h: any) => !isNaN(h.storyId) && !isNaN(h.chapterId) && h.storyId > 0 && h.chapterId > 0)
        : [];
 
      if (follows.length > 0 || histories.length > 0) {
        const { mergeUserActivitiesBrowser } = await import("@/features/public-stories/api/user-activities-browser.api");
        await mergeUserActivitiesBrowser({ follows, histories });
        
        // Dọn dẹp local storage sau khi merge thành công
        localStorage.removeItem("comic_web_bookmarks");
        localStorage.removeItem("comic_web_reading_history");
      }
    } catch (err) {
      console.error("Failed to merge local data to server", err);
    }
  };
 
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
 
    if (!email.trim()) {
      toast("Vui lòng nhập địa chỉ email hoặc tên đăng nhập.", "warning");
      return;
    }
 
    if (!password) {
      toast("Vui lòng nhập mật khẩu.", "warning");
      return;
    }
 
    setLoading(true);
 
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          usernameOrEmail: email.trim(),
          password,
        }),
      });
 
      if (response.ok) {
        toast("Đăng nhập thành công! Chào mừng bạn quay trở lại.", "success");
        
        // Thực hiện đồng bộ dữ liệu trước khi chuyển trang
        await handleMergeLocalData();
        
        router.push(ROUTES.home);
        setTimeout(() => {
          window.location.href = ROUTES.home;
        }, 200);
      } else {
        const errData = await response.json().catch(() => null);
        toast(errData?.detail || errData?.error || "Đăng nhập thất bại. Vui lòng kiểm tra lại.", "error");
      }
    } catch (err) {
      toast("Không thể kết nối đến máy chủ xác thực.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-screen">
      {/* Back to Homepage Button */}
      <Link href={ROUTES.home} className="login-back-home">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2.5}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
        <span>Trở về trang chủ</span>
      </Link>

      <div className="login-card">
        {/* Brand / Title */}
        <div className="login-card__header">
          <Link href={ROUTES.home} className="login-card__logo">
            <svg
              className="login-card__logo-icon"
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
            <span className="login-card__logo-text">ComicWeb</span>
          </Link>
          <p className="login-card__subtitle">
            Đăng nhập để lưu lịch sử đọc và đồng bộ tủ truyện của bạn
          </p>
        </div>

        {/* Form content */}
        <form onSubmit={handleSubmit} className="login-card__form">
          {/* Email input */}
          <div className="login-field">
            <label htmlFor="login-email" className="login-field__label">
              Địa chỉ Email
            </label>
            <div className="login-field__input-wrapper">
              <svg
                className="login-field__input-icon"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
                />
              </svg>
              <input
                id="login-email"
                type="email"
                ref={emailRef}
                className="login-field__input"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                required
              />
            </div>
          </div>

          {/* Password input */}
          <div className="login-field">
            <div className="login-field__header">
              <label htmlFor="login-password" className="login-field__label">
                Mật khẩu
              </label>
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  toast("Tính năng quên mật khẩu đang được phát triển.", "info");
                }}
                className="login-card__link"
              >
                Quên mật khẩu?
              </a>
            </div>
            <div className="login-field__input-wrapper">
              <svg
                className="login-field__input-icon"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
              <input
                id="login-password"
                type="password"
                className="login-field__input"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                required
              />
            </div>
          </div>

          {/* Submit Button */}
          <button type="submit" className="btn btn--primary login-card__submit-btn" disabled={loading}>
            {loading ? (
              <span className="login-loading-spinner" />
            ) : (
              "Đăng nhập"
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="login-card__divider">
          <span>Hoặc đăng nhập bằng</span>
        </div>

        {/* Social logins */}
        <div className="login-card__socials">
          <button
            type="button"
            className="login-card__social-btn login-card__social-btn--google"
            onClick={() => handleSocialLogin("Google")}
            disabled={loading}
            title="Đăng nhập Google"
          >
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M12.24 10.285V13.4h6.887C18.2 15.614 15.645 18 12.24 18c-3.86 0-7-3.14-7-7s3.14-7 7-7c1.706 0 3.277.61 4.5 1.625l2.437-2.437C17.312 1.696 14.933 1 12.24 1c-5.523 0-10 4.477-10 10s4.477 10 10 10c5.733 0 10-4.007 10-10 0-.676-.06-1.32-.16-1.715h-9.84z"/>
            </svg>
            Google
          </button>

          <button
            type="button"
            className="login-card__social-btn login-card__social-btn--facebook"
            onClick={() => handleSocialLogin("Facebook")}
            disabled={loading}
            title="Đăng nhập Facebook"
          >
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
            </svg>
            Facebook
          </button>
        </div>
 
        <div className="login-card__footer" style={{ marginTop: "1.5rem", textAlign: "center", fontSize: "0.9rem", color: "var(--color-text-muted)" }}>
          Chưa có tài khoản?{" "}
          <Link href="/register" style={{ color: "#f97316", fontWeight: "bold", textDecoration: "underline" }}>
            Đăng ký ngay
          </Link>
        </div>
      </div>
    </div>
  );
}
