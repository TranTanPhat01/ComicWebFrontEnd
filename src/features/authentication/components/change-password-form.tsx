"use client";

import React, { useState, useRef, useEffect } from "react";
import type { ChangePasswordRequestDto } from "../types/auth.types";

export function ChangePasswordForm() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [fieldErrors, setFieldErrors] = useState<{
    currentPassword?: string;
    newPassword?: string;
    confirmPassword?: string;
  }>({});

  const currentRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    currentRef.current?.focus();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;

    setErrorMsg("");
    setFieldErrors({});

    const errors: typeof fieldErrors = {};
    if (!currentPassword) {
      errors.currentPassword = "Vui lòng nhập mật khẩu hiện tại.";
    }
    if (!newPassword) {
      errors.newPassword = "Vui lòng nhập mật khẩu mới.";
    } else if (newPassword.length < 6) {
      errors.newPassword = "Mật khẩu mới phải có ít nhất 6 ký tự.";
    }
    if (newPassword && newPassword === currentPassword) {
      errors.newPassword = "Mật khẩu mới không được trùng với mật khẩu hiện tại.";
    }
    if (newPassword !== confirmPassword) {
      errors.confirmPassword = "Mật khẩu xác nhận không khớp.";
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/change-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          currentPassword,
          newPassword,
          confirmPassword,
        } as ChangePasswordRequestDto),
      });

      if (response.ok) {
        // Redirect to login page with a success query parameter
        const isAdmin = typeof window !== "undefined" && window.location.pathname.startsWith("/admin");
        window.location.href = isAdmin 
          ? "/admin/login?message=ChangePasswordSuccess" 
          : "/login?message=ChangePasswordSuccess";
      } else {
        const errorData = await response.json().catch(() => null);
        
        if (errorData) {
          // Handle backend validation errors
          if (errorData.errors) {
            const mappedErrors: typeof fieldErrors = {};
            Object.keys(errorData.errors).forEach((key) => {
              const messages = errorData.errors[key];
              if (messages && messages.length > 0) {
                if (key.toLowerCase().includes("currentpassword")) {
                  mappedErrors.currentPassword = messages[0];
                } else if (key.toLowerCase().includes("newpassword")) {
                  mappedErrors.newPassword = messages[0];
                } else if (key.toLowerCase().includes("confirmpassword")) {
                  mappedErrors.confirmPassword = messages[0];
                }
              }
            });
            setFieldErrors(mappedErrors);
          }

          setErrorMsg(
            errorData.detail || 
            errorData.title || 
            "Không thể cập nhật mật khẩu. Vui lòng kiểm tra lại."
          );
        } else {
          setErrorMsg("Cập nhật mật khẩu thất bại. Mật khẩu hiện tại không đúng.");
        }
      }
    } catch {
      setErrorMsg("Lỗi kết nối máy chủ.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
      {errorMsg && (
        <div
          role="alert"
          style={{
            background: "rgba(239, 68, 68, 0.1)",
            border: "1px solid var(--color-error, #ef4444)",
            borderRadius: "var(--radius-md)",
            padding: "0.75rem 1rem",
            color: "var(--color-error, #ef4444)",
            fontSize: "0.9rem",
          }}
        >
          {errorMsg}
        </div>
      )}

      {/* Current Password */}
      <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
        <label htmlFor="currentPassword" style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--color-text-secondary)" }}>
          Mật khẩu hiện tại
        </label>
        <div style={{ position: "relative" }}>
          <input
            id="currentPassword"
            type={showCurrent ? "text" : "password"}
            ref={currentRef}
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            disabled={isLoading}
            style={{
              width: "100%",
              padding: "0.75rem 3rem 0.75rem 1rem",
              borderRadius: "var(--radius-md)",
              border: fieldErrors.currentPassword ? "1px solid var(--color-error, #ef4444)" : "1px solid var(--color-border)",
              background: "var(--color-surface-2)",
              color: "var(--color-text-primary)",
              fontSize: "0.95rem",
              outline: "none",
            }}
          />
          <button
            type="button"
            onClick={() => setShowCurrent(!showCurrent)}
            style={{
              position: "absolute",
              right: "0.75rem",
              top: "50%",
              transform: "translateY(-50%)",
              background: "none",
              border: "none",
              color: "var(--color-text-muted)",
              cursor: "pointer",
            }}
          >
            {showCurrent ? "Ẩn" : "Hiện"}
          </button>
        </div>
        {fieldErrors.currentPassword && (
          <span style={{ color: "var(--color-error, #ef4444)", fontSize: "0.8rem" }}>
            {fieldErrors.currentPassword}
          </span>
        )}
      </div>

      {/* New Password */}
      <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
        <label htmlFor="newPassword" style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--color-text-secondary)" }}>
          Mật khẩu mới
        </label>
        <div style={{ position: "relative" }}>
          <input
            id="newPassword"
            type={showNew ? "text" : "password"}
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            disabled={isLoading}
            style={{
              width: "100%",
              padding: "0.75rem 3rem 0.75rem 1rem",
              borderRadius: "var(--radius-md)",
              border: fieldErrors.newPassword ? "1px solid var(--color-error, #ef4444)" : "1px solid var(--color-border)",
              background: "var(--color-surface-2)",
              color: "var(--color-text-primary)",
              fontSize: "0.95rem",
              outline: "none",
            }}
          />
          <button
            type="button"
            onClick={() => setShowNew(!showNew)}
            style={{
              position: "absolute",
              right: "0.75rem",
              top: "50%",
              transform: "translateY(-50%)",
              background: "none",
              border: "none",
              color: "var(--color-text-muted)",
              cursor: "pointer",
            }}
          >
            {showNew ? "Ẩn" : "Hiện"}
          </button>
        </div>
        {fieldErrors.newPassword && (
          <span style={{ color: "var(--color-error, #ef4444)", fontSize: "0.8rem" }}>
            {fieldErrors.newPassword}
          </span>
        )}
      </div>

      {/* Confirm Password */}
      <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
        <label htmlFor="confirmPassword" style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--color-text-secondary)" }}>
          Xác nhận mật khẩu mới
        </label>
        <div style={{ position: "relative" }}>
          <input
            id="confirmPassword"
            type={showConfirm ? "text" : "password"}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            disabled={isLoading}
            style={{
              width: "100%",
              padding: "0.75rem 3rem 0.75rem 1rem",
              borderRadius: "var(--radius-md)",
              border: fieldErrors.confirmPassword ? "1px solid var(--color-error, #ef4444)" : "1px solid var(--color-border)",
              background: "var(--color-surface-2)",
              color: "var(--color-text-primary)",
              fontSize: "0.95rem",
              outline: "none",
            }}
          />
          <button
            type="button"
            onClick={() => setShowConfirm(!showConfirm)}
            style={{
              position: "absolute",
              right: "0.75rem",
              top: "50%",
              transform: "translateY(-50%)",
              background: "none",
              border: "none",
              color: "var(--color-text-muted)",
              cursor: "pointer",
            }}
          >
            {showConfirm ? "Ẩn" : "Hiện"}
          </button>
        </div>
        {fieldErrors.confirmPassword && (
          <span style={{ color: "var(--color-error, #ef4444)", fontSize: "0.8rem" }}>
            {fieldErrors.confirmPassword}
          </span>
        )}
      </div>

      <button
        type="submit"
        disabled={isLoading}
        style={{
          marginTop: "0.5rem",
          padding: "0.75rem 1.5rem",
          borderRadius: "var(--radius-md)",
          border: "none",
          background: "var(--color-primary)",
          color: "#fff",
          fontWeight: 600,
          fontSize: "1rem",
          cursor: isLoading ? "not-allowed" : "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "0.5rem",
          opacity: isLoading ? 0.7 : 1,
        }}
      >
        {isLoading ? "Đang xử lý..." : "Cập nhật mật khẩu"}
      </button>
    </form>
  );
}
