"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/constants/routes";
import { useToast } from "@/providers/toast-provider";

export default function RegisterPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  // Form states
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const usernameRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    usernameRef.current?.focus();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;

    if (!username.trim()) {
      toast("Vui lòng nhập tên đăng nhập.", "warning");
      usernameRef.current?.focus();
      return;
    }

    if (username.trim().length < 3) {
      toast("Tên đăng nhập phải có ít nhất 3 ký tự.", "warning");
      return;
    }

    if (!email.trim()) {
      toast("Vui lòng nhập địa chỉ email.", "warning");
      return;
    }

    if (!password) {
      toast("Vui lòng nhập mật khẩu.", "warning");
      return;
    }

    if (password.length < 12) {
      toast("Mật khẩu phải có độ dài tối thiểu là 12 ký tự.", "warning");
      return;
    }

    if (password !== confirmPassword) {
      toast("Xác nhận mật khẩu không khớp.", "warning");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: username.trim(),
          email: email.trim(),
          password,
        }),
      });

      if (response.ok) {
        toast("Đăng ký tài khoản thành công! Vui lòng đăng nhập.", "success");
        router.push(ROUTES.login);
      } else {
        const errData = await response.json().catch(() => null);
        toast(errData?.detail || errData?.error || "Đăng ký thất bại. Vui lòng kiểm tra lại thông tin.", "error");
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
            Đăng ký tài khoản để bắt đầu đồng bộ tủ sách cá nhân
          </p>
        </div>

        {/* Form content */}
        <form onSubmit={handleSubmit} className="login-card__form">
          {/* Username input */}
          <div className="login-field">
            <label htmlFor="register-username" className="login-field__label">
              Tên đăng nhập
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
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
              <input
                id="register-username"
                type="text"
                ref={usernameRef}
                className="login-field__input"
                placeholder="newuser123"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={loading}
                required
              />
            </div>
          </div>

          {/* Email input */}
          <div className="login-field">
            <label htmlFor="register-email" className="login-field__label">
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
                id="register-email"
                type="email"
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
            <label htmlFor="register-password" className="login-field__label">
              Mật khẩu
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
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
              <input
                id="register-password"
                type="password"
                className="login-field__input"
                placeholder="Tối thiểu 12 ký tự (A, a, 1, !)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                required
              />
            </div>
          </div>

          {/* Confirm Password input */}
          <div className="login-field">
            <label htmlFor="register-confirm-password" className="login-field__label">
              Xác nhận mật khẩu
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
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                />
              </svg>
              <input
                id="register-confirm-password"
                type="password"
                className="login-field__input"
                placeholder="Nhập lại mật khẩu"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
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
              "Đăng ký tài khoản"
            )}
          </button>
        </form>

        <div className="login-card__footer" style={{ marginTop: "1.5rem", textAlign: "center", fontSize: "0.9rem", color: "var(--color-text-muted)" }}>
          Đã có tài khoản?{" "}
          <Link href={ROUTES.login} style={{ color: "#f97316", fontWeight: "bold", textDecoration: "underline" }}>
            Đăng nhập ngay
          </Link>
        </div>
      </div>
    </div>
  );
}
