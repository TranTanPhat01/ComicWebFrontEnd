"use client";

import React, { useState, useRef, useEffect } from "react";
import type { LoginRequestDto } from "../types/auth.types";

export function AdminLoginForm() {
  const [usernameOrEmail, setUsernameOrEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  
  // Field validation errors
  const [fieldErrors, setFieldErrors] = useState<{
    usernameOrEmail?: string;
    password?: string;
  }>({});

  const usernameRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  // Focus on first input on mount
  useEffect(() => {
    usernameRef.current?.focus();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;

    // Reset errors
    setErrorMsg("");
    setFieldErrors({});

    // Client-side validations
    const errors: typeof fieldErrors = {};
    if (!usernameOrEmail.trim()) {
      errors.usernameOrEmail = "Vui lòng nhập tên đăng nhập hoặc email.";
    }
    if (!password) {
      errors.password = "Vui lòng nhập mật khẩu.";
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      // Focus first error field
      if (errors.usernameOrEmail) {
        usernameRef.current?.focus();
      } else if (errors.password) {
        passwordRef.current?.focus();
      }
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          usernameOrEmail: usernameOrEmail.trim(),
          password,
        } as LoginRequestDto),
      });

      if (response.ok) {
        const data = await response.json();
        
        // Handle forced password change flow
        if (data.mustChangePassword) {
          window.location.href = "/admin/change-password";
          return;
        }

        // Get and validate returnUrl to prevent open redirects
        const searchParams = new URLSearchParams(window.location.search);
        const returnUrl = searchParams.get("returnUrl") || "/admin";
        
        // Prevent open redirect by verifying it starts with '/' and not '//'
        const isSafeRedirect = returnUrl.startsWith("/") && !returnUrl.startsWith("//");
        window.location.href = isSafeRedirect ? returnUrl : "/admin";
      } else {
        const errorData = await response.json().catch(() => null);
        
        if (errorData) {
          // Check for RFC 7807 problem details field validation errors
          if (errorData.errors) {
            const mappedErrors: typeof fieldErrors = {};
            Object.keys(errorData.errors).forEach((key) => {
              const messages = errorData.errors[key];
              if (messages && messages.length > 0) {
                // Map key casing
                if (key.toLowerCase().includes("username")) {
                  mappedErrors.usernameOrEmail = messages[0];
                } else if (key.toLowerCase().includes("password")) {
                  mappedErrors.password = messages[0];
                }
              }
            });
            setFieldErrors(mappedErrors);
          }

          // General message
          setErrorMsg(
            errorData.detail || 
            errorData.title || 
            "Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin."
          );
        } else {
          setErrorMsg("Sai tài khoản hoặc mật khẩu.");
        }
      }
    } catch {
      setErrorMsg("Không thể kết nối tới máy chủ xác thực.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
      {errorMsg && (
        <div
          role="alert"
          aria-live="assertive"
          style={{
            background: "rgba(239, 68, 68, 0.1)",
            border: "1px solid var(--color-error, #ef4444)",
            borderRadius: "var(--radius-md)",
            padding: "0.75rem 1rem",
            color: "var(--color-error, #ef4444)",
            fontSize: "0.9rem",
            lineHeight: "1.4",
          }}
        >
          {errorMsg}
        </div>
      )}

      {/* Username / Email field */}
      <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
        <label
          htmlFor="usernameOrEmail"
          style={{
            fontSize: "0.85rem",
            fontWeight: 600,
            color: "var(--color-text-secondary)",
          }}
        >
          Tên đăng nhập hoặc Email
        </label>
        <input
          id="usernameOrEmail"
          type="text"
          ref={usernameRef}
          value={usernameOrEmail}
          onChange={(e) => setUsernameOrEmail(e.target.value)}
          disabled={isLoading}
          autoComplete="username"
          style={{
            padding: "0.75rem 1rem",
            borderRadius: "var(--radius-md)",
            border: fieldErrors.usernameOrEmail
              ? "1px solid var(--color-error, #ef4444)"
              : "1px solid var(--color-border)",
            background: "var(--color-surface-2)",
            color: "var(--color-text-primary)",
            fontSize: "0.95rem",
            outline: "none",
            transition: "border-color var(--transition-fast)",
          }}
          onFocus={(e) => {
            if (!fieldErrors.usernameOrEmail) {
              e.currentTarget.style.borderColor = "var(--color-primary)";
            }
          }}
          onBlur={(e) => {
            if (!fieldErrors.usernameOrEmail) {
              e.currentTarget.style.borderColor = "var(--color-border)";
            }
          }}
        />
        {fieldErrors.usernameOrEmail && (
          <span style={{ color: "var(--color-error, #ef4444)", fontSize: "0.8rem" }}>
            {fieldErrors.usernameOrEmail}
          </span>
        )}
      </div>

      {/* Password field */}
      <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
        <label
          htmlFor="password"
          style={{
            fontSize: "0.85rem",
            fontWeight: 600,
            color: "var(--color-text-secondary)",
          }}
        >
          Mật khẩu
        </label>
        <div style={{ position: "relative" }}>
          <input
            id="password"
            type={showPassword ? "text" : "password"}
            ref={passwordRef}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={isLoading}
            autoComplete="current-password"
            style={{
              width: "100%",
              padding: "0.75rem 3rem 0.75rem 1rem",
              borderRadius: "var(--radius-md)",
              border: fieldErrors.password
                ? "1px solid var(--color-error, #ef4444)"
                : "1px solid var(--color-border)",
              background: "var(--color-surface-2)",
              color: "var(--color-text-primary)",
              fontSize: "0.95rem",
              outline: "none",
              transition: "border-color var(--transition-fast)",
            }}
            onFocus={(e) => {
              if (!fieldErrors.password) {
                e.currentTarget.style.borderColor = "var(--color-primary)";
              }
            }}
            onBlur={(e) => {
              if (!fieldErrors.password) {
                e.currentTarget.style.borderColor = "var(--color-border)";
              }
            }}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            style={{
              position: "absolute",
              right: "0.75rem",
              top: "50%",
              transform: "translateY(-50%)",
              background: "none",
              border: "none",
              color: "var(--color-text-muted)",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "4px",
            }}
            aria-label={showPassword ? "Ẩn mật khẩu" : "Hiển thị mật khẩu"}
          >
            {showPassword ? (
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" style={{ width: "20px", height: "20px" }}>
                <path fillRule="evenodd" d="M3.28 2.22a.75.75 0 00-1.06 1.06l14.5 14.5a.75.75 0 101.06-1.06L3.28 2.22z" />
                <path d="M6.337 8.29l-1.285-1.285A9.27 9.27 0 001.003 10c1.003 3.3 4.1 5.5 7.497 5.5 1.162 0 2.268-.25 3.268-.7l-1.278-1.279a3.02 3.02 0 01-1.37.479c-1.647 0-3-1.329-3-2.964 0-.583.17-1.127.46-1.597zm4.04 4.04L9.01 10.965A2.99 2.99 0 018.986 10c0-1.636 1.353-2.964 3-2.964.317 0 .617.051.9.143L11.53 8.536a1.5 1.5 0 00-1.152 3.794z" />
                <path d="M12.43 10.91l1.413 1.413a9.23 9.23 0 001.657-2.323c-1.003-3.3-4.1-5.5-7.497-5.5-1.229 0-2.397.27-3.44.754l1.397 1.397a5.028 5.028 0 011.666-.347c2.723 0 5 2.186 5 4.885 0 .252-.019.5-.057.742z" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" style={{ width: "20px", height: "20px" }}>
                <path d="M10 12.5a2.5 2.5 0 100-5 2.5 2.5 0 000 5z" />
                <path fillRule="evenodd" d="M.664 10.59a1.651 1.651 0 010-1.18 10.024 10.024 0 0118.672 0c.23.476.23 1.074 0 1.55a10.024 10.024 0 01-18.672 0zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
              </svg>
            )}
          </button>
        </div>
        {fieldErrors.password && (
          <span style={{ color: "var(--color-error, #ef4444)", fontSize: "0.8rem" }}>
            {fieldErrors.password}
          </span>
        )}
      </div>

      {/* Submit Button */}
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
          boxShadow: "0 4px 12px rgba(var(--color-primary-rgb, 99, 102, 241), 0.3)",
          transition: "opacity var(--transition-fast), transform var(--transition-fast)",
          opacity: isLoading ? 0.7 : 1,
        }}
        onMouseEnter={(e) => {
          if (!isLoading) e.currentTarget.style.opacity = "0.9";
        }}
        onMouseLeave={(e) => {
          if (!isLoading) e.currentTarget.style.opacity = "1";
        }}
      >
        {isLoading ? (
          <>
            <svg
              className="animate-spin"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              style={{
                width: "20px",
                height: "20px",
                animation: "spin 1s linear infinite",
              }}
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
                style={{ opacity: 0.25 }}
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                style={{ opacity: 0.75 }}
              />
            </svg>
            Đang đăng nhập...
          </>
        ) : (
          "Đăng nhập"
        )}
      </button>
      
      {/* Dynamic spinner keyframes definition */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}} />
    </form>
  );
}
